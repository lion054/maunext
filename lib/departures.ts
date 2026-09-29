export type Departure = {
  tourSlug: string;
  date: string;
  price: number;
  capacity: number;
  seatsLeft: number;
};

/** Live data, fetched from the Tanova Vendor API (GET /departures) on 2026-09-29.
 *  Only 3 open, scheduled departures exist system-wide right now — not a gap in this
 *  fetch, that's the real current state of the booking system's departure board. */
export const DEPARTURES: Departure[] = [
  { tourSlug: "6-day-kilimanjaro-group-trek-via-machame-route", date: "2026-10-04", price: 2470, capacity: 12, seatsLeft: 12 },
  { tourSlug: "6-day-kilimanjaro-group-trek-via-marangu-route", date: "2026-10-14", price: 2160, capacity: 12, seatsLeft: 12 },
  { tourSlug: "7-day-kilimanjaro-group-trek-via-lemosho-route", date: "2026-10-22", price: 2670, capacity: 12, seatsLeft: 12 },
];

export function departuresForTour(slug: string) {
  return DEPARTURES.filter((d) => d.tourSlug === slug);
}
