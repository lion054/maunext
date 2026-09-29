import { NextResponse } from "next/server";

/** Server-side proxy for the real Tanova AI concierge. Same key-isolation rule as
 *  /api/trip-planner. Two actions map onto the two real endpoints:
 *   - "start": POST /concierge/conversations   (first message, creates a conversation)
 *   - "send":  POST /concierge/conversations/{id}/send   (a reply within one)
 *  Only ever called from an explicit visitor action in the chat panel — no auto-open,
 *  no auto-send, no polling, since each message is a billed call (402 on the real API
 *  when the account can't be charged). */
export async function POST(request: Request) {
  const key = process.env.TANOVA_API_KEY;
  const base = process.env.TANOVA_API_BASE;
  if (!key || !base) {
    return NextResponse.json({ error: "Concierge is not configured." }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = body as { action?: string; message?: string; conversationId?: number; guestName?: string; guestEmail?: string };
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: "application/json" };

  let upstream: Response;
  try {
    if (b.action === "start") {
      if (!b.message) return NextResponse.json({ error: "message is required." }, { status: 400 });
      upstream = await fetch(`${base}/concierge/conversations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: b.message,
          channel: "web",
          chatbot_name: "Mauly Concierge",
          ...(b.guestName ? { guest_name: b.guestName } : {}),
          ...(b.guestEmail ? { guest_email: b.guestEmail } : {}),
        }),
      });
    } else if (b.action === "send") {
      if (!b.message || !b.conversationId) {
        return NextResponse.json({ error: "message and conversationId are required." }, { status: 400 });
      }
      upstream = await fetch(`${base}/concierge/conversations/${b.conversationId}/send`, {
        method: "POST",
        headers,
        body: JSON.stringify({ body: b.message }),
      });
    } else {
      return NextResponse.json({ error: 'action must be "start" or "send".' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Could not reach the concierge right now." }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok) {
    const message =
      upstream.status === 402 ? "Chat is temporarily unavailable — please use the contact form instead."
      : "Something went wrong sending your message.";
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(data, { status: 200 });
}
