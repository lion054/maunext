import { tanovaGet } from "./tanova/client";
import { getTours } from "./tours";

export type Departure = {
  tourSlug: string;
  date: string;
  price: number;
  capacity: number;
  seatsLeft: number;
  status: "open" | "filling" | "full" | "closed";
};

type ApiDeparture = {
  tour: { id: number; title: string };
  date: string;
  capacity: number;
  seats_left: number;
  price: number | null;
  status: "open" | "filling" | "full" | "closed";
};

/** Live departure board (GET /departures) — every scheduled, bookable date across every
 *  tour, with real seats-left. Unlike /services/*, this endpoint returns a flat
 *  `{ data: [...], meta: {...} }` shape, not the nested Laravel-paginator shape
 *  tanovaGetAll expects — so this calls tanovaGet directly. The API keys a departure by
 *  numeric tour id, not slug, so this cross-references the live tour list (already cached
 *  by the same request) to attach the slug each page actually routes on. */
export async function getDepartures(): Promise<Departure[]> {
  const from = new Date().toISOString().slice(0, 10);
  const path = `/departures?from=${from}&to=2027-12-31&per_page=100`;
  type Page = { data: ApiDeparture[]; meta?: { last_page?: number } };
  const [first, tours] = await Promise.all([tanovaGet<Page>(path), getTours()]);
  // The board is paginated (meta.last_page); follow it so a busy season never truncates silently.
  const rows = [...first.data];
  const lastPage = first.meta?.last_page ?? 1;
  for (let page = 2; page <= lastPage; page++) {
    rows.push(...(await tanovaGet<Page>(`${path}&page=${page}`)).data);
  }
  const slugById = new Map(tours.map((t) => [t.id, t.slug]));

  return rows
    .map((d) => {
      const slug = slugById.get(d.tour.id);
      if (!slug) return null;
      return {
        tourSlug: slug,
        date: d.date,
        price: d.price ?? 0,
        capacity: d.capacity,
        seatsLeft: d.seats_left,
        status: d.status,
      };
    })
    .filter((d): d is Departure => d !== null);
}

export async function departuresForTour(slug: string): Promise<Departure[]> {
  const departures = await getDepartures();
  return departures.filter((d) => d.tourSlug === slug);
}
