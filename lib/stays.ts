import { tanovaGetAll } from "./tanova/client";

export type Room = { name: string; guests: number; price: number };

export type Lodge = {
  id: number;
  slug: string; title: string; location: string; subtitle: string; fromPrice?: number; currency?: string;
  availability: "available" | "limited" | "on_request" | "closed"; tier?: "budget" | "mid" | "luxury";
  image?: string; rooms?: Room[]; gallery?: string[]; amenities?: string[];
};

type ApiHotel = {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  address: string | null;
  price: string | null;
  hero_url: string | null;
  gallery_urls: string[] | null;
  status: string;
};

function stripHtml(html: string | null): string {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function mapHotel(h: ApiHotel): Lodge {
  const gallery = h.gallery_urls ?? [];
  return {
    id: h.id,
    slug: h.slug,
    title: h.title,
    location: (h.address ?? "Tanzania").split(",")[0].trim(),
    subtitle: stripHtml(h.content).slice(0, 220),
    // No booking calendar/pricing endpoint is wired up here yet, so every live listing
    // reads as "available" with an enquiry path (see BookingCard) rather than a fake status.
    availability: "available",
    tier: "luxury",
    fromPrice: h.price ? Number(h.price) : undefined,
    image: h.hero_url ?? gallery[0],
    gallery: gallery.filter((g) => g !== h.hero_url),
  };
}

/** Live hotel catalogue — see lib/tours.ts for the same pattern. No per-room pricing exists
 *  in the portal for any of these yet, so `rooms` stays undefined; the booking UI already
 *  shows an enquiry path instead of a priced date picker whenever that's absent. */
export async function getStays(): Promise<Lodge[]> {
  const rows = await tanovaGetAll<ApiHotel>("/services/hotels?status=publish");
  return rows.filter((h) => h.status === "publish").map(mapHotel);
}

export async function getStay(slug: string): Promise<Lodge | undefined> {
  const stays = await getStays();
  return stays.find((s) => s.slug === slug);
}
