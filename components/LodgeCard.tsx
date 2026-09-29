import Link from "next/link";
import Image from "next/image";
import Price from "./Price";
import s from "./LodgeCard.module.css";

export type Room = { name: string; guests: number; price: number };

export type Lodge = {
  slug: string;
  title: string;
  location: string;
  subtitle: string;
  fromPrice?: number;
  currency?: string;
  availability: "available" | "limited" | "on_request" | "closed";
  tier?: "budget" | "mid" | "luxury";
  image?: string;
  rooms?: Room[];
  gallery?: string[];
  amenities?: string[];
};

const AVAIL_LABEL: Record<Lodge["availability"], string> = {
  available: "Available",
  limited: "Limited — confirm quickly",
  on_request: "On request",
  closed: "Not currently bookable",
};
const AVAIL_CLASS: Record<Lodge["availability"], string> = {
  available: "badge--ok",
  limited: "badge--warn",
  on_request: "badge--muted",
  closed: "badge--off",
};
const TIER_LABEL: Record<NonNullable<Lodge["tier"]>, [string, string]> = {
  budget: ["Budget", "$"],
  mid: ["Mid-range", "$$"],
  luxury: ["Luxury", "$$$"],
};

export default function LodgeCard({ lodge }: { lodge: Lodge }) {
  return (
    <Link href={`/stays/${lodge.slug}`} className={s.card}>
      <div className={s.media}>
        {lodge.image ? (
          <Image className={s.img} src={lodge.image} alt={lodge.title} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" />
        ) : (
          <span className={s.ph} aria-hidden="true">{lodge.title.charAt(0).toUpperCase()}</span>
        )}
        <span className={`badge ${AVAIL_CLASS[lodge.availability]} ${s.availBadge}`}>
          {AVAIL_LABEL[lodge.availability]}
        </span>
        {lodge.tier && (
          <span className={`tier tier--${lodge.tier} ${s.tierBadge}`}>
            <b>{TIER_LABEL[lodge.tier][1]}</b>{TIER_LABEL[lodge.tier][0]}
          </span>
        )}
      </div>
      <div className={s.body}>
        <h3 className={s.title}>{lodge.title}</h3>
        <p className={s.loc}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-6.4-7-11a7 7 0 0114 0c0 4.6-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {lodge.location}
        </p>
        <p className={s.sub}>{lodge.subtitle}</p>
        <div className={s.foot}>
          {lodge.fromPrice ? (
            <span className={s.price}><em>from</em> <Price value={lodge.fromPrice} /><small>/night</small></span>
          ) : <span />}
          <span className={s.cta}>View lodge &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
