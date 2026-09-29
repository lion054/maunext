"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import s from "./page.module.css";

export type Post = { date: string; category: "Safari" | "Retreat" | "Trekking" | "Heritage"; title: string; img: string; fallbackLabel?: string; href?: string };

const CATEGORIES = ["All", "Safari", "Retreat", "Trekking", "Heritage"] as const;

function Kicker({ category }: { category: Post["category"] }) {
  return <span className={s.kicker}>{category}</span>;
}

export default function BlogBrowser({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const filtered = useMemo(() => (category === "All" ? posts : posts.filter((p) => p.category === category)), [posts, category]);
  const [lead, ...river] = filtered;

  return (
    <>
      <nav className={s.sectionNav} aria-label="Filter by section">
        {CATEGORIES.map((c, i) => (
          <span key={c}>
            {i > 0 && <span className={s.navDivider} aria-hidden="true">|</span>}
            <button type="button" className={`${s.navItem} ${category === c ? s.navItemActive : ""}`} onClick={() => setCategory(c)}>{c}</button>
          </span>
        ))}
      </nav>
      <hr className={s.rule} />

      <div key={category}>
        {lead && (() => {
          const leadInner = (
            <>
              {lead.img ? (
                <div className={s.leadImg} style={{ backgroundImage: `url(${lead.img})` }} />
              ) : (
                <div className={s.leadImgFallback}><b>{lead.fallbackLabel ?? "Read More"}</b></div>
              )}
              <div className={s.leadBody}>
                <Kicker category={lead.category} />
                <h2 className={s.leadTitle}>{lead.title}</h2>
                <span className={s.leadMeta}>{lead.date}</span>
              </div>
            </>
          );
          return lead.href ? (
            <Link href={lead.href} className={s.lead}>{leadInner}</Link>
          ) : (
            <article className={s.lead}>{leadInner}</article>
          );
        })()}

        <div className={s.river}>
          {river.map((p) => {
            const inner = (
              <>
                {p.img ? (
                  <div className={s.riverImg} style={{ backgroundImage: `url(${p.img})` }} />
                ) : (
                  <div className={s.riverImgFallback}><b>{p.fallbackLabel ?? "Read More"}</b></div>
                )}
                <div className={s.riverBody}>
                  <Kicker category={p.category} />
                  <h3 className={s.riverTitle}>{p.title}</h3>
                  <span className={s.riverMeta}>{p.date}</span>
                </div>
              </>
            );
            return p.href ? (
              <Link href={p.href} className={s.riverItem} key={p.title}>{inner}</Link>
            ) : (
              <article className={s.riverItem} key={p.title}>{inner}</article>
            );
          })}
        </div>
      </div>
    </>
  );
}
