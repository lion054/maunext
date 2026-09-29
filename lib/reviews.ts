export type Review = {
  name: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  tourSlug?: string;
};

export const REVIEWS: Review[] = [
  {
    name: "Helen R.", initials: "HR", rating: 5, date: "September 2026", title: "The migration crossing we'll never forget",
    body: "Our guide Joseph knew exactly where to position the vehicle for the Mara crossing — we were the only car there for twenty minutes. Every detail of this trip felt considered, not templated.",
    tourSlug: "migration-wilderness-wanderlust",
  },
  {
    name: "Marcus T.", initials: "MT", rating: 5, date: "August 2026", title: "Golf and game drives, genuinely seamless",
    body: "I was skeptical a golf-and-safari combination could work well, but the logistics were flawless and the light-aircraft transfer into the Serengeti was an experience in itself.",
    tourSlug: "luxury-golf-serengeti-migration-safari",
  },
  {
    name: "Priya & Dev K.", initials: "PK", rating: 5, date: "July 2026", title: "Perfect pace for our kids",
    body: "Grace planned every stop with our 8 and 11 year olds in mind without dumbing anything down for us. Tarangire's elephants were the highlight of both their years.",
    tourSlug: "tanzanian-trio-safari",
  },
  {
    name: "Sofia N.", initials: "SN", rating: 4, date: "June 2026", title: "Ol Doinyo Lengai was brutal and worth it",
    body: "Naomi got us to the crater rim just as the sun came up — genuinely one of the hardest things I've done, and she never let us feel unsafe doing it.",
    tourSlug: "lengais-legacy",
  },
  {
    name: "James & Alice O.", initials: "JO", rating: 5, date: "May 2026", title: "A quiet, unhurried day exactly when we needed one",
    body: "After a week of early starts, Lake Dreams was the gentle day we needed. Elias timed it perfectly for the flamingos and the light.",
    tourSlug: "lake-dreams",
  },
  {
    name: "Ben C.", initials: "BC", rating: 5, date: "April 2026", title: "Usambara is Tanzania's best-kept secret",
    body: "Nobody else on the trail for two days. Baraka's family connections in the villages made this feel like travel, not tourism.",
    tourSlug: "usambara-wonders",
  },
  {
    name: "The Whitfield Family", initials: "WF", rating: 5, date: "March 2026", title: "41 years of experience really shows",
    body: "Every question we had was answered before we asked it. Mauly clearly does this at a level most operators don't reach.",
  },
  {
    name: "Amina H.", initials: "AH", rating: 5, date: "February 2026", title: "Halal dining handled without a single compromise",
    body: "We've had halal requests half-honored on other trips. Mauly's team had it fully sorted at every single lodge, no exceptions, no awkward conversations.",
  },
];

export function reviewsForTour(slug: string, fallbackCount = 3) {
  const matched = REVIEWS.filter((r) => r.tourSlug === slug);
  if (matched.length > 0) return matched;
  return REVIEWS.slice(0, fallbackCount);
}
