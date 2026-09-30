"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SearchOptions } from "@/lib/searchOptions";
import s from "./HeroSearch.module.css";

/** Home-banner search. Every choice comes from what is live on the site right now
 *  (destinations with tours, real trip styles and lengths, with counts), and each one maps to a
 *  filter that /safaris actually applies. */
export default function HeroSearch({ options }: { options: SearchOptions }) {
  const router = useRouter();
  const [dest, setDest] = useState("");
  const [style, setStyle] = useState("");
  const [days, setDays] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (dest === "stays") return router.push("/stays");
    const q = new URLSearchParams();
    if (dest) q.set("destination", dest);
    if (style) q.set("style", style);
    if (days) q.set("days", days);
    router.push(`/safaris${q.size ? `?${q}` : ""}`);
  };

  return (
    <form className={s.bar} onSubmit={go} role="search" aria-label="Find a journey">
      <label className={s.field}>
        <span>Destination</span>
        <select value={dest} onChange={(e) => setDest(e.target.value)}>
          <option value="">Anywhere ({options.total} journeys)</option>
          <optgroup label="Destinations">
            {options.destinations.map((d) => <option key={d.slug} value={d.slug}>{d.title} ({d.count})</option>)}
          </optgroup>
          {options.stays > 0 && (
            <optgroup label="Stays">
              <option value="stays">Lodges &amp; camps ({options.stays})</option>
            </optgroup>
          )}
        </select>
      </label>
      <label className={s.field}>
        <span>Style</span>
        <select value={style} onChange={(e) => setStyle(e.target.value)} disabled={dest === "stays"}>
          <option value="">Any style</option>
          {options.styles.map((o) => <option key={o.value} value={o.value}>{o.value} ({o.count})</option>)}
        </select>
      </label>
      <label className={s.field}>
        <span>Trip length</span>
        <select value={days} onChange={(e) => setDays(e.target.value)} disabled={dest === "stays"}>
          <option value="">Any length</option>
          {options.lengths.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.count})</option>)}
        </select>
      </label>
      <button type="submit" className={s.submit}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
        Search
      </button>
    </form>
  );
}
