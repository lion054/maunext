import { notFound } from "next/navigation";
import { getTours, getTour } from "@/lib/tours";
import { departuresForTour } from "@/lib/departures";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import TourDetail from "./TourDetail";

// Pre-render today's known tours at build/first-request time for speed; a tour added to the
// portal after that still renders on first visit (Next's default dynamicParams stays true)
// and gets folded into the cache from then on — nothing here blocks a brand-new slug.
export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [tour, allTours, deps] = await Promise.all([getTour(slug), getTours(), departuresForTour(slug)]);
  if (!tour) notFound();

  const relatedSeed = todaySeed + ":related:" + tour.slug;
  const sameRegion = seededShuffle(allTours.filter((t) => t.slug !== tour.slug && t.region === tour.region), relatedSeed).slice(0, 3);
  const relatedFallback = sameRegion.length > 0 ? sameRegion : seededShuffle(allTours.filter((t) => t.slug !== tour.slug), relatedSeed).slice(0, 3);

  return <TourDetail tour={tour} relatedFallback={relatedFallback} deps={deps} />;
}
