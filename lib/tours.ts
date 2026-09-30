import { tanovaGetAll } from "./tanova/client";

export type Guide = {
  name: string;
  role: string;
  languages: string[];
  rating: number;
  reviews: number;
  bio: string;
  initials: string;
};

export type Tour = {
  id: number;
  locationId: number | null;
  slug: string;
  title: string;
  meta: string;
  img: string;
  price?: number;
  days: number;
  bestTime?: string;
  style: string;
  region: string;
  /** Day Trip / Package / Multi-Day Tour / Activity, straight from the portal's own `trip_type`
   *  (bc-cms VendorServiceController::tripType()) — not inferred client-side, so it stays correct
   *  as soon as a vendor's data changes. Named productType, not tripType: PlanWizard.tsx already
   *  has an unrelated local state variable called tripType (the Classic/Luxury/Family/… step). */
  productType?: "day_trip" | "package" | "multi_day_tour" | "activity";
  collections?: ("sublime" | "halal" | "cultural" | "beach")[];
  tags?: string[];
  summary: string;
  included: string[];
  excluded: string[];
  whatToExpect: string[];
  activities: string[];
  itinerary: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  rating: { score: number; count: number };
  gallery: string[];
  guide?: Guide;
};

/** Editorial curation the Tanova API has no concept of — which tours are marketed under the
 *  Sublime (ultra-luxury) or Halal (halal-verified) collections. This is the one thing that
 *  still lives in this codebase rather than the portal: everything else (price, description,
 *  photos, availability) is fetched live so it can never go stale. Add a slug here and it
 *  picks up the collection badge everywhere (cards, detail page, /sublime, /halal-safaris)
 *  without touching a single component.
 *  grand-tanzanian-journey carries both tags: it's tagged halal in the portal's own data and
 *  was already being hand-featured on /sublime, so both are now true rather than one page
 *  silently disagreeing with the other. */
const COLLECTIONS: Record<string, ("sublime" | "halal" | "cultural" | "beach")[]> = {
  "luxury-golf-serengeti-migration-safari": ["sublime"],
  "migration-wilderness-wanderlust": ["sublime"],
  "8-day-northern-circuit-group-trek": ["sublime"],
  "turquoise-temptation-zanzibar-tour": ["sublime", "beach"],
  "grand-tanzanian-journey": ["halal", "sublime", "beach"],
  "moshi-tuk-tuk-tour-3-day-cultural-and-nature-adventure": ["halal", "cultural"],
  "southern-tanzania-discovery": ["halal"],
  "manyara-explorers-delight-3-day-wildlife-and-culture-safari": ["halal", "cultural"],
  "the-island-bliss": ["halal", "beach"],
  "the-safari-oasis": ["halal"],
  "shira-discovery": ["halal"],
  "jungle-escape": ["halal"],
  "natures-harmony": ["halal"],
  "mara-moments": ["halal"],
  "ndutu-migration-safari": ["halal"],
  "3-days-mount-meru": ["halal"],
  "ndutu-life-awakens": ["halal"],
  // Experiences ("Cultural Encounter" theme) from the real content export — community
  // engagement, volunteering and teaching placements, not wildlife-first products.
  "arts-and-sports-volunteering-in-tanzania": ["cultural"],
  "clinical-health-provider-volunteering-in-tanzania": ["cultural"],
  "cycling-and-tree-planting-volunteering-program": ["cultural"],
  "public-health-trainer": ["cultural"],
  "teaching-awareness-volunteering": ["cultural"],
  "tree-nursery-development-management": ["cultural"],
  "wild-ecology-conservation-program": ["cultural"],
};

type ApiTour = {
  id: number;
  location_id: number | null;
  slug: string;
  title: string;
  short_desc: string | null;
  content: string | null;
  price: string | null;
  duration_hours: number | null;
  address: string | null;
  category_name: string | null;
  hero_url: string | null;
  gallery_urls: string[] | null;
  include: { title: string }[] | null;
  status: string;
  trip_type?: "day_trip" | "package" | "multi_day_tour" | "activity" | null;
};

function stripHtml(html: string | null): string {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function mapTour(t: ApiTour): Tour {
  const days = Math.max(1, Math.round((t.duration_hours ?? 24) / 24));
  const gallery = t.gallery_urls?.length ? t.gallery_urls : t.hero_url ? [t.hero_url] : [];
  return {
    id: t.id,
    locationId: t.location_id,
    slug: t.slug,
    title: t.title,
    meta: `${days} Day${days > 1 ? "s" : ""} · Tanzania`,
    img: t.hero_url ?? gallery[0] ?? "/img/tarangire-elephants.jpg",
    price: t.price ? Number(t.price) : undefined,
    days,
    style: t.category_name ?? "Tour",
    region: t.address ?? "Tanzania",
    productType: t.trip_type ?? undefined,
    collections: COLLECTIONS[t.slug],
    summary: t.short_desc || stripHtml(t.content),
    included: (t.include ?? []).map((i) => i.title),
    excluded: [],
    whatToExpect: [],
    activities: [],
    itinerary: [],
    faqs: [],
    rating: { score: 0, count: 0 },
    gallery,
  };
}

/** The live tour catalogue. Cached by Next's fetch cache (see lib/tanova/client.ts) — a new
 *  tour, a price change or an unpublish in the portal shows up here within the revalidate
 *  window, no redeploy needed. */
export async function getTours(): Promise<Tour[]> {
  const rows = await tanovaGetAll<ApiTour>("/services/tours?status=publish");
  return rows.filter((t) => t.status === "publish").map(mapTour);
}

export async function getTour(slug: string): Promise<Tour | undefined> {
  const tours = await getTours();
  return tours.find((t) => t.slug === slug);
}
