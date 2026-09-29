export type Room = { name: string; guests: number; price: number };

export type Lodge = {
  slug: string; title: string; location: string; subtitle: string; fromPrice?: number; currency?: string;
  availability: "available" | "limited" | "on_request" | "closed"; tier?: "budget" | "mid" | "luxury";
  image?: string; rooms?: Room[]; gallery?: string[]; amenities?: string[];
};

/** Live catalogue, fetched from the Tanova Vendor API (GET /services/hotels) on 2026-09-29.
 *  This is the real, currently-live set of 3 hotels Mauly has listed — the previous 7 fictional
 *  lodges (Acacia Farm Lodge etc.) did not correspond to any real live listing and have been
 *  removed rather than kept alongside real data. No real per-room pricing exists in the API for
 *  any of these three, so `rooms` is omitted — the booking UI shows an enquiry path instead of
 *  a priced date picker when rooms is absent.
 *
 *  Photos: the API only returns numeric internal media IDs for hotel galleries (not resolvable
 *  URLs), so these come from matching each hotel's real filenames against the local, cleaned
 *  WordPress uploads library instead — same real properties either way. */
export const STAYS: Lodge[] = [
  {
    slug: "ngorongoro-lodge-melia-collection", title: "Ngorongoro Lodge Meliá Collection", location: "Ngorongoro",
    subtitle: "A crater-rim resort pairing contemporary design with local heritage, positioned for prime wildlife viewing. The property emphasises sustainable practices alongside refined accommodation, dining and wellness facilities, p",
    availability: "available", tier: "luxury",
    image: "/img/real/rooms/ngorongoro-lodge-melia-collection/1.jpg",
    gallery: ["/img/real/rooms/ngorongoro-lodge-melia-collection/2.jpg", "/img/real/rooms/ngorongoro-lodge-melia-collection/3.jpg", "/img/real/rooms/ngorongoro-lodge-melia-collection/4.jpg", "/img/real/rooms/ngorongoro-lodge-melia-collection/5.jpg", "/img/real/rooms/ngorongoro-lodge-melia-collection/6.jpg"],
  },
  {
    slug: "ngorongoro-serena-safari-lodge", title: "Ngorongoro Serena Safari Lodge", location: "Ngorongoro",
    subtitle: "A luxury lodge set dramatically on the crater's edge, blending Maasai-inspired architecture with modern comfort. Rooms carry locally-influenced design and panoramic crater views, alongside curated dining and cultural exc",
    availability: "available", tier: "luxury",
    image: "/img/real/rooms/ngorongoro-serena-safari-lodge/1.jpg",
    gallery: ["/img/real/rooms/ngorongoro-serena-safari-lodge/2.jpg", "/img/real/rooms/ngorongoro-serena-safari-lodge/3.jpg", "/img/real/rooms/ngorongoro-serena-safari-lodge/4.jpg", "/img/real/rooms/ngorongoro-serena-safari-lodge/5.jpg", "/img/real/rooms/ngorongoro-serena-safari-lodge/6.jpg", "/img/real/rooms/ngorongoro-serena-safari-lodge/7.jpg", "/img/real/rooms/ngorongoro-serena-safari-lodge/8.jpg"],
  },
  {
    slug: "lions-paw-camp-by-karibu-camps", title: "Lion's Paw Camp (by Karibu Camps)", location: "Ngorongoro",
    subtitle: "A luxury safari camp with eight tents on the Ngorongoro Crater rim, featuring classic decor and elegant ensuite bathrooms. Guests get gourmet dining using local ingredients and opportunities to engage with the nearby Maa",
    availability: "available", tier: "luxury",
    image: "/img/real/rooms/lions-paw/1.jpg",
    gallery: ["/img/real/rooms/lions-paw/2.jpg", "/img/real/rooms/lions-paw/3.jpg", "/img/real/rooms/lions-paw/4.jpg", "/img/real/rooms/lions-paw/5.jpg", "/img/real/rooms/lions-paw/6.jpg", "/img/real/rooms/lions-paw/7.jpg", "/img/real/rooms/lions-paw/8.jpg"],
  },
];

export function getStay(slug: string) {
  return STAYS.find((s) => s.slug === slug);
}