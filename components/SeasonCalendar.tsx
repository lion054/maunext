"use client";

import Link from "next/link";
import { useState } from "react";
import type { SeasonMonth, SeasonLevel } from "@/lib/destinations";
import s from "./SeasonCalendar.module.css";

const NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const LABEL: Record<SeasonLevel, string> = { 1: "Green season", 2: "Shoulder", 3: "Very good", 4: "Peak" };

/** Twelve-month visitor calendar: how good each month is at a destination and why, plus the
 *  number of live group departures. Tap or focus a month to read its note. */
export default function SeasonCalendar({
  title, months, departures, currentMonth, planHref = "/plan",
}: {
  title: string;
  months: SeasonMonth[];
  /** Live group departures per calendar month (index 0 = January). */
  departures: number[];
  currentMonth: number;
  planHref?: string;
}) {
  const [active, setActive] = useState(currentMonth);
  const m = months[active];
  const best = months.map((x, i) => (x.level === 4 ? NAMES[i].slice(0, 3) : null)).filter(Boolean);

  return (
    <div className={s.wrap}>
      <div className={s.grid} role="radiogroup" aria-label={`When to visit ${title}`}>
        {months.map((x, i) => (
          <button
            key={NAMES[i]}
            type="button"
            role="radio"
            aria-checked={active === i}
            aria-label={`${NAMES[i]}: ${LABEL[x.level]}${departures[i] ? `, ${departures[i]} group departures` : ""}`}
            className={`${s.month} ${s[`l${x.level}`]} ${active === i ? s.on : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={s.mName}>{NAMES[i].slice(0, 3)}</span>
            <span className={s.bar} aria-hidden="true">
              {[1, 2, 3, 4].map((n) => <i key={n} className={n <= x.level ? s.fill : ""} />)}
            </span>
            {departures[i] > 0 && <span className={s.dot} aria-hidden="true" title={`${departures[i]} group departures`} />}
            {i === currentMonth && <span className={s.now}>Now</span>}
          </button>
        ))}
      </div>

      <ul className={s.legend} aria-label="Legend">
        {([4, 3, 2, 1] as SeasonLevel[]).map((l) => <li key={l}><i className={`${s.swatch} ${s[`l${l}`]}`} />{LABEL[l]}</li>)}
        <li><i className={s.dotKey} />Group departure</li>
      </ul>

      <div className={s.panel} aria-live="polite">
        <div>
          <span className={s.pMonth}>{NAMES[active]}</span>
          <span className={`${s.pTag} ${s[`l${m.level}`]}`}>{LABEL[m.level]}</span>
        </div>
        <p>{m.note}</p>
        {departures[active] > 0 && <p className={s.dep}><b>{departures[active]}</b> group {departures[active] === 1 ? "departure" : "departures"} this month.</p>}
        <Link href={planHref} className={s.cta}>Plan a {NAMES[active]} trip &rarr;</Link>
      </div>
      {best.length > 0 && <p className={s.summary}>Peak months: {best.join(", ")}.</p>}
    </div>
  );
}
