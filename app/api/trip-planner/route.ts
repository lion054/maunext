import { NextResponse } from "next/server";

/** Server-side proxy for the real Tanova AI trip planner. The secret key lives only
 *  in the server environment (TANOVA_API_KEY) and never reaches the browser — this
 *  route is the only thing allowed to read it. Costs real money per successful call
 *  (the endpoint returns 402 when the account can't be billed), so this is only ever
 *  invoked when a visitor explicitly submits the plan form, never speculatively. */
export async function POST(request: Request) {
  const key = process.env.TANOVA_API_KEY;
  const base = process.env.TANOVA_API_BASE;
  if (!key || !base) {
    return NextResponse.json({ error: "Trip planner is not configured." }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  if (!b.destination || !b.start_date || !b.end_date || !b.guests) {
    return NextResponse.json({ error: "destination, start_date, end_date and guests are required." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/tanova/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the trip planner right now." }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok) {
    // Pass through the upstream status (401/402/403/422/429/500 per the API spec) so the
    // client can show a specific message (e.g. 402 = the trip-planner quota is exhausted)
    // without ever seeing the upstream response body verbatim, which could leak internals.
    const message =
      upstream.status === 402 ? "Trip planning is temporarily unavailable — please contact us directly."
      : upstream.status === 422 ? (typeof data?.warnings?.[0] === "string" ? String(data.warnings[0]).slice(0, 240) : "Please check your dates and try again.")
      : "Something went wrong generating your trip.";
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  // POST /tanova/generate only returns a summary (packages: count, first_package: totals) —
  // the actual day-by-day itinerary only exists at GET /tanova/trips/{id}. Fetch it now so
  // the client gets one complete result instead of a second round trip.
  const tripId = data?.data?.id;
  if (!tripId) {
    return NextResponse.json(data, { status: 200 });
  }

  try {
    const tripRes = await fetch(`${base}/tanova/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    });
    if (tripRes.ok) {
      const tripData = await tripRes.json();
      return NextResponse.json(tripData, { status: 200 });
    }
  } catch {
    // fall through to the summary below
  }

  // The trip was created but we couldn't read back the full itinerary — still return
  // the summary rather than failing the whole request.
  return NextResponse.json(data, { status: 200 });
}
