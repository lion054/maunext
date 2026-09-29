import { notFound } from "next/navigation";
import { TOURS, getTour } from "@/lib/tours";
import TourDetail from "./TourDetail";

export function generateStaticParams() {
  return TOURS.map((t) => ({ slug: t.slug }));
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  return <TourDetail tour={tour} />;
}
