import { Suspense } from "react";
import { STAYS } from "@/lib/stays";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import StaysBrowser from "./StaysBrowser";
import s from "./page.module.css";

export default function StaysPage() {
  const stays = seededShuffle(STAYS, todaySeed + ":stays");
  return (
    <div className="wrap">
      <div className={s.head}>
        <span className="eyebrow">Stays</span>
        <h1>Hand-chosen lodges &amp; camps</h1>
        <p>Every property we resell, priced at our net rate plus a transparent markup &mdash; never the partner&rsquo;s listed rate.</p>
      </div>
      <Suspense fallback={null}>
        <StaysBrowser stays={stays} />
      </Suspense>
    </div>
  );
}
