import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { groqChat } from "@/lib/groq";
import { offlineChatReply, type ChatReply, type PageLink } from "@/lib/samira-offline";
import { getTours } from "@/lib/tours";
import { getDepartures } from "@/lib/departures";
import { getDestinations } from "@/lib/destinations";

export const runtime = "nodejs";

/** Samira — Mauly's AI chat, built to never go down. Three layers, in order:
 *   1. Claude (primary) — real, catalog-grounded answers via tool use.
 *   2. Groq/Llama — fast fallback if Claude errors, times out, or has no key set.
 *   3. Rule-based offline replies (lib/samira-offline.ts) — no network call, never
 *      throws, always returns something useful. This layer needs no API key at all,
 *      so the chat still works even before ANTHROPIC_API_KEY/GROQ_API_KEY exist.
 *  Every layer produces the same shape, so the widget never has to know which one
 *  answered. */

const RESPOND_TOOL = {
  name: "respond",
  description: "Send your reply to the visitor. content = HTML message body only — no link text, no follow-up questions in it. Navigation goes in page_links.",
  input_schema: {
    type: "object",
    required: ["content", "page_links"],
    properties: {
      content: { type: "string", description: "HTML body. <strong>, <br><br>, &bull; allowed. No markdown, no <a> tags." },
      page_links: {
        type: "array",
        description: "1-3 navigation buttons shown below the message.",
        items: {
          type: "object",
          required: ["label", "url"],
          properties: {
            label: { type: "string" },
            url: { type: "string" },
            type: { type: "string", enum: ["plan", "package", "destination", "default"] },
          },
        },
      },
      suggested_follow_ups: { type: "array", items: { type: "string" }, description: "2-3 short follow-up questions under 55 chars. Omit when needs_ticket is true." },
      show_cta: { type: "boolean" },
      needs_ticket: { type: "boolean", description: "True when this needs a human — a specific date/price negotiation, a complaint, or the visitor asks to talk to someone." },
      ticket_subject: { type: "string" },
    },
  },
};

async function buildCatalogContext() {
  const [tours, departures, destinations] = await Promise.all([getTours(), getDepartures(), getDestinations()]);
  const featured = tours.filter((t) => t.price).slice(0, 30);
  let ctx = "\n\nLIVE CATALOG (real Mauly tours — never invent a slug not listed here):";
  for (const t of featured) {
    ctx += `\n• ${t.title} [slug: ${t.slug}] — ${t.days}d, ${t.region}, from USD ${t.price}${t.collections?.length ? ` (${t.collections.join(", ")})` : ""}`;
  }
  ctx += "\n\nFIXED-DATE KILIMANJARO GROUP DEPARTURES (open right now):";
  for (const d of departures) {
    ctx += `\n• ${d.tourSlug} — ${d.date}, USD ${d.price}, ${d.seatsLeft}/${d.capacity} seats left`;
  }
  ctx += "\n\nDESTINATION PAGES (link as /destinations/[slug]):";
  for (const d of destinations) ctx += `\n• ${d.title} [slug: ${d.slug}]`;
  return ctx;
}

const SYSTEM = `You are Samira — the AI concierge for Mauly Tours & Safaris (mauly-tours.com), a Tanzanian, family-owned safari operator founded in 1983 in Moshi by Salim Mauly.

PERSONA: Warm, knowledgeable, concise (2-3 sentences). Never robotic. HTML only: <strong>, <br><br>, &bull;. Never mention Claude, Anthropic, or that you are an AI model — you are Samira.

FACTS:
- 100% Tanzanian-owned, family-run since 1983, based in Moshi, Kilimanjaro Region.
- Real contact: phone/WhatsApp +255 784 884 018, email contact@mauly-tours.com, 24/7 emergency +255 784 884 019.
- Booking: 30% deposit due now, balance due 60 days before travel.
- The Sublime Collection (/sublime) is Mauly's ultra-luxury, fully bespoke tier — private vehicle and guide throughout.
- Halal Safaris (/halal-safaris) is a dedicated programme: halal dining, prayer-aware scheduling, alcohol-free stays on request.
- Most journeys are private and run on the traveller's own dates. A handful of Kilimanjaro treks (Lemosho, Machame, Marangu, Northern Circuit) also run as fixed-date small-group departures — see LIVE CATALOG below.
- Trip planner (/plan) generates a real day-by-day itinerary from live availability — always offer it for anything not matched to one specific package.

RULES:
- Always name a specific real package (with price) when relevant, using ONLY slugs from LIVE CATALOG below. Never invent a slug or price.
- Link package pages as /safaris/[slug], destinations as /destinations/[slug], the planner as /plan.
- Always include 1-3 page_links relevant to the topic.
- Set needs_ticket true when the visitor wants to talk to a human, has a complaint, or needs something only a person can resolve (exact date negotiation, group rates, special requirements) — and set show_cta true.
- Call the respond tool for every reply. Never output plain text.`;

async function tryClaude(messages: { role: string; content: string }[]): Promise<ChatReply | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 20_000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ac.signal,
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: SYSTEM + (await buildCatalogContext()),
        tools: [RESPOND_TOOL],
        tool_choice: { type: "tool", name: "respond" },
        messages: messages.slice(-10),
      }),
    });
    if (!res.ok) throw new Error(`Claude HTTP ${res.status}`);
    const data = await res.json();
    const toolUse = data.content?.find((b: { type: string }) => b.type === "tool_use");
    if (!toolUse) throw new Error("Claude returned no tool_use block");
    const input = toolUse.input as Record<string, unknown>;
    return {
      content: String(input.content ?? ""),
      pageLinks: (Array.isArray(input.page_links) ? input.page_links : []).filter((l: PageLink) => l?.label && l?.url),
      suggestedFollowUps: Array.isArray(input.suggested_follow_ups) ? (input.suggested_follow_ups as string[]) : [],
      showCta: Boolean(input.show_cta),
      needsTicket: Boolean(input.needs_ticket),
      ticketType: "general",
      ticketSubject: typeof input.ticket_subject === "string" ? input.ticket_subject : null,
      source: "claude",
    };
  } finally {
    clearTimeout(timer);
  }
}

const GROQ_SYSTEM = `You are Samira, AI concierge for Mauly Tours & Safaris (Tanzania, family-owned since 1983, Moshi).
Be warm and brief (2-3 sentences). Return ONLY a valid JSON object: {content (HTML, <strong>/<br><br>/&bull; only), page_links: [{label,url,type}], suggested_follow_ups: [string], show_cta: boolean}.
Real packages: Tanzanian Trio Safari /safaris/tanzanian-trio-safari-tarangire-manyara-ngorongoro-expedition from USD 1274; 7-Day Lemosho Trek /safaris/7-day-kilimanjaro-group-trek-via-lemosho-route from USD 2670; Ndutu Migration Safari /safaris/ndutu-migration-safari from USD 2600; Turquoise Temptation Zanzibar /safaris/turquoise-temptation-zanzibar-tour.
Planner: /plan. Halal: /halal-safaris. Sublime: /sublime. Contact: contact@mauly-tours.com, WhatsApp +255 784 884 018.
Never invent slugs. Respond with ONLY the JSON object.`;

async function tryGroq(messages: { role: string; content: string }[]): Promise<ChatReply | null> {
  if (!process.env.GROQ_API_KEY) return null;
  const { content } = await groqChat({
    json: true,
    maxTokens: 500,
    timeoutMs: 12_000,
    messages: [
      { role: "system", content: GROQ_SYSTEM },
      ...messages.slice(-6).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
  });
  const parsed = JSON.parse(content);
  return {
    content: parsed.content ?? "",
    pageLinks: Array.isArray(parsed.page_links) ? parsed.page_links : [],
    suggestedFollowUps: Array.isArray(parsed.suggested_follow_ups) ? parsed.suggested_follow_ups : [],
    showCta: Boolean(parsed.show_cta),
    needsTicket: false,
    ticketType: null,
    ticketSubject: null,
    source: "groq",
  };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`chat:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many messages — please wait a moment." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { messages } = body as { messages?: { role: string; content: string }[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required." }, { status: 400 });
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Layer 1: Claude
  try {
    const result = await tryClaude(messages);
    if (result) return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.warn("[Samira] Claude unavailable, trying Groq:", (err as Error).message);
  }

  // Layer 2: Groq
  try {
    const result = await tryGroq(messages);
    if (result) return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.warn("[Samira] Groq unavailable, using offline rules:", (err as Error).message);
  }

  // Layer 3: offline rules — always succeeds
  return NextResponse.json(offlineChatReply(lastUserMsg), { status: 200 });
}
