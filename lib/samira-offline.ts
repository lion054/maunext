/** Samira Offline — rule-based fallback replies for when Claude and Groq are both
 *  unavailable. This is the layer that makes the chat "never down": it needs no API
 *  key, no network call, and never throws, so the widget always has something real
 *  and useful to say. Facts here are Mauly's own — founded 1983 in Moshi by Salim
 *  Mauly, family-owned — and prices/slugs are pulled from lib/tours.ts, not invented. */

export type PageLink = { label: string; url: string; type?: string };

export type ChatReply = {
  content: string;
  pageLinks: PageLink[];
  suggestedFollowUps: string[];
  showCta: boolean;
  needsTicket: boolean;
  ticketType: string | null;
  ticketSubject: string | null;
  source: "offline" | "claude" | "groq";
};

type Intent = { match: (m: string) => boolean; reply: () => Omit<ChatReply, "source"> };

const base = (over: Partial<Omit<ChatReply, "source">>): Omit<ChatReply, "source"> => ({
  content: "",
  pageLinks: [],
  suggestedFollowUps: [],
  showCta: false,
  needsTicket: false,
  ticketType: null,
  ticketSubject: null,
  ...over,
});

const INTENTS: Intent[] = [
  {
    match: (m) => /\b(hi|hello|hey|jambo|habari|good (morning|afternoon|evening))\b/i.test(m),
    reply: () => base({
      content: "Jambo! I'm Samira, Mauly's travel concierge. <br><br>Whether it's a Serengeti safari, a Kilimanjaro summit, or a halal-verified Zanzibar escape, I can point you to the right journey. What's calling you to Tanzania?",
      pageLinks: [
        { label: "Browse safaris →", url: "/safaris", type: "default" },
        { label: "Build my itinerary →", url: "/plan", type: "plan" },
      ],
      suggestedFollowUps: ["Tell me about the Serengeti", "Kilimanjaro trek options?", "Halal safari options?"],
    }),
  },
  {
    match: (m) => /\b(migration|wildebeest|crossing|mara river|calving|ndutu)\b/i.test(m),
    reply: () => base({
      content: "The Great Migration is unforgettable — the Mara River crossings run <strong>July–October</strong> in the north; calving season is <strong>January–March</strong> around Ndutu. <br><br>Our <strong>Ndutu Migration Safari</strong> is built around calving season — 6 days, from <strong>USD 2,600</strong>.",
      pageLinks: [
        { label: "View Ndutu Migration Safari →", url: "/safaris/ndutu-migration-safari", type: "package" },
        { label: "Explore the Serengeti →", url: "/destinations/serengeti-national-park", type: "destination" },
        { label: "Build my itinerary →", url: "/plan", type: "plan" },
      ],
      suggestedFollowUps: ["Best month for the migration?", "What's included?", "Any Kilimanjaro combo?"],
    }),
  },
  {
    match: (m) => /\b(serengeti|game drive|big five|lion|leopard|cheetah|rhino)\b/i.test(m),
    reply: () => base({
      content: "The Serengeti is Tanzania's flagship park — endless plains, the Big Five, and the Great Migration passing through for months of the year. <br><br>Our <strong>Tanzanian Trio Safari</strong> covers Tarangire, Manyara and Ngorongoro in 4 days from <strong>USD 1,274</strong>, or go bigger with the 8-day <strong>Migration Wilderness Wanderlust</strong> from our Sublime Collection.",
      pageLinks: [
        { label: "View Tanzanian Trio Safari →", url: "/safaris/tanzanian-trio-safari-tarangire-manyara-ngorongoro-expedition", type: "package" },
        { label: "Explore the Serengeti →", url: "/destinations/serengeti-national-park", type: "destination" },
        { label: "Build my itinerary →", url: "/plan", type: "plan" },
      ],
      suggestedFollowUps: ["What's the best season?", "Family-friendly options?", "Luxury Sublime options?"],
    }),
  },
  {
    match: (m) => /\b(kilimanjaro|kili|trek|climb|summit|lemosho|machame|rongai|marangu|umbwe|northern circuit|shira)\b/i.test(m),
    reply: () => base({
      content: "Kilimanjaro — Africa's roof at 5,895m. Mauly has led climbs here for over 20 years with KPAP-certified guides. <br><br>&bull; <strong>7-Day Lemosho</strong> — most scenic, best acclimatization, from <strong>USD 2,670</strong><br>&bull; <strong>7-Day Machame</strong> — the popular 'Whiskey Route', from <strong>USD 2,470</strong><br>&bull; <strong>6-Day Marangu</strong> — the only hut-based route, from <strong>USD 2,160</strong><br>&bull; <strong>8-Day Northern Circuit</strong> — longest, highest success rate, from <strong>USD 2,900</strong>",
      pageLinks: [
        { label: "Compare all routes →", url: "/trekking", type: "default" },
        { label: "See open departures →", url: "/calendar", type: "default" },
        { label: "View 7-Day Lemosho →", url: "/safaris/7-day-kilimanjaro-group-trek-via-lemosho-route", type: "package" },
      ],
      suggestedFollowUps: ["Which route is easiest?", "When are the next open dates?", "What's included?"],
    }),
  },
  {
    match: (m) => /\b(zanzibar|beach|island|stone town|snorkel|diving|dhow|spice)\b/i.test(m),
    reply: () => base({
      content: "Zanzibar pairs UNESCO-listed Stone Town with spice plantations and reef diving at Mnemba Atoll. <br><br>Our <strong>Turquoise Temptation</strong> tour covers Stone Town, a spice plantation, Jozani Forest's red colobus monkeys and the Nakupenda Sandbank over 5 days. Best visited <strong>June–October</strong> or <strong>December–February</strong>.",
      pageLinks: [
        { label: "Explore Zanzibar →", url: "/destinations/zanzibar", type: "destination" },
        { label: "View Turquoise Temptation →", url: "/safaris/turquoise-temptation-zanzibar-tour", type: "package" },
        { label: "Halal-friendly Zanzibar →", url: "/halal-safaris", type: "default" },
      ],
      suggestedFollowUps: ["Can I combine Zanzibar with a safari?", "Best beach areas?", "Halal dining options?"],
    }),
  },
  {
    match: (m) => /\b(ngorongoro|crater|maasai|caldera)\b/i.test(m),
    reply: () => base({
      content: "The Ngorongoro Crater is the world's largest intact volcanic caldera — dense Big Five wildlife including a resident black rhino population, all visible from the crater floor in a single morning.",
      pageLinks: [
        { label: "Explore Ngorongoro →", url: "/destinations/ngorongoro", type: "destination" },
        { label: "View Tanzanian Trio Safari →", url: "/safaris/tanzanian-trio-safari-tarangire-manyara-ngorongoro-expedition", type: "package" },
        { label: "Build my itinerary →", url: "/plan", type: "plan" },
      ],
      suggestedFollowUps: ["Best time to visit?", "Can I combine with Serengeti?", "Is it good for photography?"],
    }),
  },
  {
    match: (m) => /\b(halal|muslim|prayer|ramadan|mosque)\b/i.test(m),
    reply: () => base({
      content: "Mauly runs a dedicated <strong>Halal Safaris</strong> programme — halal-certified dining, prayer-time-aware scheduling, alcohol-free stays on request, and guides who understand Muslim traditions. <br><br>Our <strong>7-Day Luxury Halal-Friendly Great Migration Safari</strong> covers the Serengeti, Ngorongoro and Tarangire from <strong>USD 1,000</strong>.",
      pageLinks: [
        { label: "Explore Halal Safaris →", url: "/halal-safaris", type: "default" },
        { label: "Plan a halal safari →", url: "/plan?halal=1", type: "plan" },
      ],
      suggestedFollowUps: ["What's included for Ramadan travel?", "Female guides available?", "Alcohol-free stays?"],
    }),
  },
  {
    match: (m) => /\b(mount meru|meru)\b/i.test(m),
    reply: () => base({
      content: "Mount Meru is Tanzania's second-highest peak (4,566m) — a quieter, wildlife-rich alternative to Kilimanjaro, climbed over 3–4 days through Arusha National Park with a midnight summit push for sunrise views of Kilimanjaro itself.",
      pageLinks: [
        { label: "Book my Meru trek →", url: "/safaris/4-days-mount-meru", type: "package" },
        { label: "Mount Meru guide →", url: "/mount-meru", type: "default" },
      ],
      suggestedFollowUps: ["How hard is it compared to Kilimanjaro?", "Best time of year?", "Do I need experience?"],
    }),
  },
  {
    match: (m) => /\b(price|cost|how much|budget|expensive|cheap|afford|usd|dollar)\b/i.test(m),
    reply: () => base({
      content: "Prices vary by journey and party size — a few real starting points: <br><br>&bull; Tanzanian Trio Safari (4 days): from <strong>USD 1,274</strong><br>&bull; 7-Day Lemosho Trek: from <strong>USD 2,670</strong><br>&bull; Ndutu Migration Safari (6 days): from <strong>USD 2,600</strong><br>&bull; Luxury Golf &amp; Serengeti Migration Safari (9 days): from <strong>USD 4,596</strong><br><br>Every trip is quoted with a <strong>30% deposit due now, balance due 60 days before travel</strong>. Use the trip planner for a price built around your own dates and party size.",
      pageLinks: [
        { label: "Get a tailored quote →", url: "/plan", type: "plan" },
        { label: "Browse all safaris →", url: "/safaris", type: "default" },
      ],
      suggestedFollowUps: ["What's the deposit policy?", "Group discounts?", "What's included in the price?"],
      showCta: true,
    }),
  },
  {
    match: (m) => /\b(visa|passport|entry|immigration|yellow fever|vaccine|vaccination|malaria)\b/i.test(m),
    reply: () => base({
      content: "Most nationalities need a visa for Tanzania — the easiest route is the <strong>eVisa</strong> at immigration.go.tz before you travel (1–3 business days, USD 50–100 depending on type). <br><br>You'll also want a passport valid 6+ months beyond arrival, a Yellow Fever certificate if arriving from an at-risk country, and malaria prophylaxis (check with your doctor 4–6 weeks ahead).",
      pageLinks: [
        { label: "Talk to our team →", url: "/contact", type: "default" },
        { label: "Safety & travel info →", url: "/your-safety", type: "default" },
      ],
      suggestedFollowUps: ["Do you help with visas?", "What vaccines do I need?", "Is Tanzania safe?"],
    }),
  },
  {
    match: (m) => /\b(book|booking|reserve|confirm|deposit|payment|pay|how do i)\b/i.test(m),
    reply: () => base({
      content: "Booking with Mauly: <strong>1)</strong> pick a journey or build one on the trip planner, <strong>2)</strong> confirm your dates and party size, <strong>3)</strong> pay a <strong>30% deposit</strong> to secure it — the balance is due 60 days before travel. Fixed-date Kilimanjaro group treks and private, custom-date safaris both work this way.",
      pageLinks: [
        { label: "Start planning →", url: "/plan", type: "plan" },
        { label: "See open departures →", url: "/calendar", type: "default" },
      ],
      suggestedFollowUps: ["What's your cancellation policy?", "Can I book a private date instead?", "Talk to the team?"],
      showCta: true,
    }),
  },
  {
    match: (m) => /\b(contact|speak|talk|call|whatsapp|email|team|human|person|agent|phone)\b/i.test(m),
    reply: () => base({
      content: "You can reach Mauly directly: <br><br>&bull; <strong>Phone/WhatsApp:</strong> +255 784 884 018<br>&bull; <strong>Email:</strong> contact@mauly-tours.com<br>&bull; <strong>24/7 emergency line:</strong> +255 784 884 019<br>&bull; Based in Moshi, Kilimanjaro Region, Tanzania — we reply within 24 hours.",
      pageLinks: [{ label: "Contact the team →", url: "/contact", type: "default" }],
      showCta: true,
    }),
  },
  {
    match: (m) => /\b(who are you|about you|about mauly|mauly tours|salim|founded|history)\b/i.test(m),
    reply: () => base({
      content: "I'm Samira, Mauly's concierge. Mauly Tours &amp; Safaris was founded in 1983 in Moshi by <strong>Salim Mauly</strong> — we're a 100% Tanzanian-owned, family-run company, still family-led today. What would you like to explore?",
      pageLinks: [
        { label: "About Mauly →", url: "/about", type: "default" },
        { label: "Browse safaris →", url: "/safaris", type: "default" },
      ],
      suggestedFollowUps: ["How do I start planning?", "What makes Mauly different?", "Where do you operate?"],
    }),
  },
];

const DEFAULT_REPLY = (): Omit<ChatReply, "source"> => base({
  content: "Tanzania is calling — and Mauly has been crafting journeys here since 1983. Whether it's a Serengeti safari, a Kilimanjaro summit, or a halal-verified Zanzibar escape, tell me what you have in mind and I'll point you the right way.",
  pageLinks: [
    { label: "Build my itinerary →", url: "/plan", type: "plan" },
    { label: "Browse all safaris →", url: "/safaris", type: "default" },
    { label: "Talk to the team →", url: "/contact", type: "default" },
  ],
  suggestedFollowUps: ["Tell me about safaris", "Kilimanjaro options?", "Zanzibar beach holidays?"],
  showCta: true,
});

/** Always returns a valid reply for the given message. Never throws. */
export function offlineChatReply(userMessage: string): ChatReply {
  const m = String(userMessage || "").toLowerCase();
  for (const intent of INTENTS) {
    if (intent.match(m)) return { ...intent.reply(), source: "offline" };
  }
  return { ...DEFAULT_REPLY(), source: "offline" };
}
