import Link from "next/link";
import { Suspense } from "react";
import { TOURS } from "@/lib/tours";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import SafarisBrowser from "./SafarisBrowser";
import s from "./page.module.css";

const CATEGORIES = [
  { title: "Classic Safari", desc: "Game drives across the northern circuit — Serengeti, Ngorongoro and Tarangire.", img: "/img/great-migration.jpg" },
  { title: "Luxury Safari", desc: "Exclusive-use camps and private guiding, at the pace you choose.", img: "/img/lion-manyara.webp" },
  { title: "Family Safari", desc: "Paced for every age, with lodges that welcome children.", img: "/img/flamingos-momella.webp" },
  { title: "Honeymoon Safari", desc: "Romance-first itineraries, ending on a private beach.", img: "/img/zanzibar-sunset.jpg" },
  { title: "Halal Safari", desc: "Halal-verified dining and prayer-time-aware scheduling throughout.", img: "/img/tarangire-elephants.jpg" },
  { title: "Golf & Safari", desc: "Championship golf beneath Kilimanjaro, then straight into the bush.", img: "/img/kilimanjaro-summit-night.jpg" },
];

export default function SafarisPage() {
  return (
    <div className="wrap">
      <div className={s.hero}>
        <span className="eyebrow">Safaris</span>
        <h1>Every safari, one starting point</h1>
        <p>Pick the style closest to what you have in mind &mdash; every itinerary is then tailored from there.</p>
      </div>
      <div className={s.grid}>
        {CATEGORIES.map((c) => (
          <article className={s.card} key={c.title}>
            <div className={s.img} style={{ backgroundImage: `url(${c.img})` }} />
            <div className={s.body}>
              <h3 className={s.title}>{c.title}</h3>
              <p className={s.desc}>{c.desc}</p>
              <Link href="/plan" className={s.link}>Plan this safari &rarr;</Link>
            </div>
          </article>
        ))}
      </div>

      <div className={s.sectionHead}>
        <span className="eyebrow">Signature journeys</span>
        <h1 style={{ fontSize: "clamp(26px,4vw,36px)" }}>Or browse a finished itinerary</h1>
        <p>Six tours, ready to view in full &mdash; day-by-day itinerary, what&rsquo;s included, and pricing.</p>
      </div>
      <Suspense fallback={null}>
        <SafarisBrowser tours={seededShuffle(TOURS, todaySeed + ":safaris")} />
      </Suspense>
    </div>
  );
}
