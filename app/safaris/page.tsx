import { Suspense } from "react";
import { getTours } from "@/lib/tours";
import { getDestinations } from "@/lib/destinations";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import SafarisBrowser from "./SafarisBrowser";
import s from "./page.module.css";

export const metadata = {
  title: "Tanzania Safaris & Journeys | Mauly Tours",
  description: "Browse every Mauly Tours safari, trek and journey, and filter by region, style, length and price.",
};

export default async function SafarisPage() {
  const [tours, destinations] = await Promise.all([getTours(), getDestinations()]);
  return (
    <>
      <div className={s.banner} style={{ backgroundImage: "url(/img/great-migration.jpg)" }}>
        <div className={s.bannerInner}>
          <span className={s.bannerKicker}>Every journey, one place</span>
          <h1>Start Your Adventure</h1>
        </div>
      </div>

      <div className="wrap">
        <div className={s.finder}>
          <h2>Find the journey that suits you</h2>
          <p>Every safari, trek and beach escape we run, privately guided and tailored to your pace. Filter by region, style or length, then open any trip for the full itinerary.</p>
        </div>
        <Suspense fallback={null}>
          <SafarisBrowser tours={seededShuffle(tours, todaySeed + ":safaris")} destinations={destinations.map(({ id, slug, title }) => ({ id, slug, title }))} />
        </Suspense>
      </div>
    </>
  );
}
