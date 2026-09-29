"use client";

import { useState } from "react";
import Link from "next/link";
import type { Destination } from "@/lib/destinations";
import s from "./DestinationsMap.module.css";

const VIEW_W = 420;
const VIEW_H = 440;
const MARGIN = 52;

/** Real lat/lng from the Tanova API (GET /destinations), projected linearly onto the
 *  viewBox — the pins' relative positions are geographically accurate. The backdrop
 *  itself is a stylised locator shape, not a traced border, so it never claims more
 *  cartographic precision than that. */
function project(destinations: Destination[]) {
  const lats = destinations.map((d) => d.lat);
  const lngs = destinations.map((d) => d.lng);
  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);
  const lngMin = Math.min(...lngs);
  const lngMax = Math.max(...lngs);
  const latSpan = latMax - latMin || 1;
  const lngSpan = lngMax - lngMin || 1;
  const innerW = VIEW_W - MARGIN * 2;
  const innerH = VIEW_H - MARGIN * 2;
  return destinations.map((d) => ({
    ...d,
    x: MARGIN + ((d.lng - lngMin) / lngSpan) * innerW,
    y: MARGIN + ((latMax - d.lat) / latSpan) * innerH,
  }));
}

export default function DestinationsMap({ destinations }: { destinations: Destination[] }) {
  const [active, setActive] = useState<string | null>(null);
  const points = project(destinations);
  const zanzibar = points.find((p) => p.slug === "zanzibar");

  return (
    <div className={s.wrap}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={s.svg} role="img" aria-label="Map of Mauly Tours destinations across northern Tanzania">
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} rx="28" className={s.ocean} />
        <path
          className={s.land}
          d={`M ${MARGIN - 30} ${MARGIN + 10}
              C ${MARGIN - 40} ${VIEW_H * 0.3}, ${MARGIN - 20} ${VIEW_H * 0.55}, ${MARGIN + 10} ${VIEW_H * 0.72}
              C ${MARGIN + 30} ${VIEW_H * 0.88}, ${VIEW_W * 0.45} ${VIEW_H - MARGIN + 30}, ${VIEW_W * 0.62} ${VIEW_H - MARGIN + 10}
              C ${VIEW_W * 0.8} ${VIEW_H - MARGIN - 20}, ${VIEW_W - MARGIN + 20} ${VIEW_H * 0.6}, ${VIEW_W - MARGIN + 10} ${VIEW_H * 0.38}
              C ${VIEW_W - MARGIN} ${VIEW_H * 0.2}, ${VIEW_W * 0.7} ${MARGIN - 20}, ${VIEW_W * 0.45} ${MARGIN - 25}
              C ${VIEW_W * 0.2} ${MARGIN - 28}, ${MARGIN - 15} ${MARGIN - 15}, ${MARGIN - 30} ${MARGIN + 10} Z`}
        />
        <ellipse cx={MARGIN + 18} cy={MARGIN + 30} rx="30" ry="26" className={s.lake} />
        <text x={MARGIN + 18} y={MARGIN + 32} textAnchor="middle" className={s.lakeLabel}>Lake Victoria</text>

        {zanzibar && <ellipse cx={zanzibar.x + 14} cy={zanzibar.y} rx="7" ry="14" className={s.island} transform={`rotate(-18 ${zanzibar.x + 14} ${zanzibar.y})`} />}

        {points.map((p) => (
          <a
            href={`/destinations/${p.slug}`}
            key={p.slug}
            className={s.pinLink}
            aria-label={p.title}
            onMouseEnter={() => setActive(p.slug)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(p.slug)}
            onBlur={() => setActive(null)}
          >
            <circle cx={p.x} cy={p.y} r={active === p.slug ? 15 : 10} className={s.pinHalo} />
            <circle cx={p.x} cy={p.y} r={active === p.slug ? 8 : 6} className={s.pin} />
          </a>
        ))}
      </svg>

      {points.map((p) => (
        <div
          key={p.slug}
          className={`${s.tooltip} ${active === p.slug ? s.tooltipActive : ""}`}
          style={{ left: `${(p.x / VIEW_W) * 100}%`, top: `${(p.y / VIEW_H) * 100}%` }}
        >
          <b>{p.title}</b>
          <Link href={`/destinations/${p.slug}`}>Explore &rarr;</Link>
        </div>
      ))}
    </div>
  );
}
