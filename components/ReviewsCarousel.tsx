"use client";

import { useRef } from "react";
import type { Review } from "@/lib/reviews";
import s from "./ReviewsCarousel.module.css";

const TA_STAR = "https://cdn.trustindex.io/assets/platform/Tripadvisor/star/f.svg";
const TA_ICON = "https://cdn.trustindex.io/assets/platform/Tripadvisor/icon.svg";

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(`.${s.card}`) as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 320;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className={s.wrap}>
      <div className={s.track} ref={trackRef}>
        {reviews.map((r) => (
          <div className={s.card} key={r.title}>
            <div className={s.head}>
              <div className={s.avatarWrap}>
                {r.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element -- real reviewer photo hosted on TripAdvisor's own CDN
                  <img src={r.avatar} alt="" className={s.avatarImg} />
                ) : (
                  <span className={s.avatarFallback}>{r.initials}</span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element -- real TripAdvisor platform badge asset */}
                <img src={TA_ICON} alt="" className={s.platformBadge} />
              </div>
              <div>
                <b>{r.name}</b>
                <span className={s.date}>{r.date}</span>
              </div>
            </div>
            <div className={s.stars} aria-label={`${r.rating} out of 5`}>
              {Array.from({ length: r.rating }).map((_, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- real TripAdvisor star asset
                <img src={TA_STAR} alt="" key={i} width={16} height={16} />
              ))}
            </div>
            <h4>{r.title}</h4>
            <p>{r.body}</p>
          </div>
        ))}
      </div>
      <button type="button" className={`${s.arrow} ${s.arrowPrev}`} aria-label="Previous reviews" onClick={() => scroll(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button type="button" className={`${s.arrow} ${s.arrowNext}`} aria-label="Next reviews" onClick={() => scroll(1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l6 6-6 6" /></svg>
      </button>
    </div>
  );
}
