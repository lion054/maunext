import type { Review } from "@/lib/reviews";
import Stars from "./Stars";
import s from "./ReviewList.module.css";

export default function ReviewList({ reviews, className }: { reviews: Review[]; className?: string }) {
  return (
    <div className={`${s.grid} ${className ?? ""}`}>
      {reviews.map((r) => (
        <div className={s.card} key={r.title}>
          <div className={s.head}>
            {r.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- real reviewer photo hosted on TripAdvisor's own CDN, not a local asset
              <img src={r.avatar} alt="" className={s.avatarImg} />
            ) : (
              <span className={s.avatar}>{r.initials}</span>
            )}
            <div>
              <b>{r.name}</b>
              <div className={s.meta}><Stars n={r.rating} className={s.stars} /><span>{r.date}</span></div>
            </div>
          </div>
          <h4>{r.title}</h4>
          <p className={s.body}>{r.body}</p>
        </div>
      ))}
    </div>
  );
}
