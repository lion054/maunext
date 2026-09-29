"use client";

import type { Lodge } from "@/components/LodgeCard";
import LodgeCard from "@/components/LodgeCard";
import s from "./page.module.css";

/** No filter/sort bar here on purpose: the live catalogue currently has 3 real stays, all in the
 *  same region, all the same tier, all available, none with a set nightly rate — every filter or
 *  sort option would be either a no-op or a dead control right now. Bring the filter bar back
 *  once the real inventory is varied enough to make filtering meaningful again. */
export default function StaysBrowser({ stays }: { stays: Lodge[] }) {
  return (
    <>
      <p className={s.resultCount}>{stays.length} {stays.length === 1 ? "stay" : "stays"}</p>
      <div className={s.grid}>
        {stays.map((lodge) => <LodgeCard key={lodge.slug} lodge={lodge} />)}
      </div>
    </>
  );
}
