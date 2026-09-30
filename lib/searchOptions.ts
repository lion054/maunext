import type { Tour } from "./tours";
import type { Destination } from "./destinations";

export type SearchOptions = {
  /** Destinations that actually have at least one live tour, with how many. */
  destinations: { slug: string; title: string; count: number }[];
  styles: { value: string; count: number }[];
  /** "Up to N days" buckets that contain at least one live tour. */
  lengths: { value: number; label: string; count: number }[];
  total: number;
  stays: number;
};

const LENGTHS = [
  { value: 2, label: "Up to 2 days" },
  { value: 5, label: "Up to 5 days" },
  { value: 9, label: "Up to 9 days" },
];

/** Search choices derived from the live catalogue, so a filter is only offered when it will
 *  return something. Rebuilds itself as tours are added or unpublished in the portal. */
export function buildSearchOptions(tours: Tour[], destinations: Destination[], stays = 0): SearchOptions {
  const byLocation = new Map<number, number>();
  const byStyle = new Map<string, number>();
  for (const t of tours) {
    if (t.locationId != null) byLocation.set(t.locationId, (byLocation.get(t.locationId) ?? 0) + 1);
    byStyle.set(t.style, (byStyle.get(t.style) ?? 0) + 1);
  }
  return {
    destinations: destinations
      .map((d) => ({ slug: d.slug, title: d.title, count: byLocation.get(d.id) ?? 0 }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count),
    styles: [...byStyle].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count),
    lengths: LENGTHS.map((l) => ({ ...l, count: tours.filter((t) => t.days <= l.value).length })).filter((l) => l.count > 0),
    total: tours.length,
    stays,
  };
}
