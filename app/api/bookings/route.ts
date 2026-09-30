import { NextResponse } from "next/server";
import { getTours } from "@/lib/tours";
import { getStays } from "@/lib/stays";

/** Server-side proxy for the real Tanova booking system (POST /bookings). Same
 *  key-isolation rule as /api/trip-planner and /api/concierge — the secret key never
 *  reaches the browser. The upstream call works out the real price and seat/room
 *  availability itself; we only ever send the guest's choices, never a price. On
 *  success it hands back a real `checkout_url` — the browser is redirected there to
 *  pay, so no card details are ever collected or seen by this app. */
export async function POST(request: Request) {
  const key = process.env.TANOVA_API_KEY;
  const base = process.env.TANOVA_API_BASE;
  if (!key || !base) {
    return NextResponse.json({ error: "Booking is not configured." }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = body as {
    kind?: "tour" | "stay";
    slug?: string;
    startDate?: string;
    endDate?: string;
    adults?: number;
    children?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };

  if (!b.kind || !b.slug || !b.startDate || !b.adults || !b.firstName || !b.lastName || !b.email) {
    return NextResponse.json({ error: "kind, slug, startDate, adults, firstName, lastName and email are required." }, { status: 400 });
  }

  // Resolved from the live catalogue, not a static map — a listing added or renamed in the
  // portal is bookable here immediately, no redeploy needed to teach this route its id.
  const listing = b.kind === "tour" ? (await getTours()).find((t) => t.slug === b.slug) : (await getStays()).find((s) => s.slug === b.slug);
  if (!listing) {
    return NextResponse.json({ error: "We don't recognize that listing." }, { status: 404 });
  }
  const serviceId = listing.id;

  const payload: Record<string, unknown> = {
    service_type: b.kind === "tour" ? "tour" : "hotel",
    service_id: serviceId,
    start_date: b.startDate,
    adults: b.adults,
    first_name: b.firstName,
    last_name: b.lastName,
    email: b.email,
  };
  if (b.endDate) payload.end_date = b.endDate;
  if (b.children) payload.children = b.children;
  if (b.phone) payload.phone = b.phone;
  if (b.notes) payload.notes = b.notes;

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the booking system right now." }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const code = data?.error?.code as string | undefined;
    const message =
      code === "sold_out" ? `Sold out — only ${data?.error?.seats_left ?? 0} seats left on that date.`
      : code === "not_available" ? "That service isn't running on the selected date."
      : code === "tier_party_size" ? "That party size isn't allowed for this option."
      : code === "validation_failed" ? (data?.error?.message ?? "Please check your details and try again.")
      : code === "subscription_required" ? "Booking is temporarily unavailable — please contact us directly."
      : "Something went wrong creating your booking.";
    return NextResponse.json({ error: message, code }, { status: upstream.status });
  }

  const result = data?.data ?? {};
  return NextResponse.json({
    bookingCode: result.booking_code,
    status: result.status,
    total: result.total,
    checkoutUrl: result.checkout_url,
  }, { status: 201 });
}
