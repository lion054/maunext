import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import MegaIcon, { type IconName } from "@/components/MegaIcon";
import { TOURS } from "@/lib/tours";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import s from "./page.module.css";

const HALAL_TOURS = seededShuffle(TOURS.filter((t) => t.collections?.includes("halal")), todaySeed + ":halal");

const PROMISE: { title: string; desc: string; icon: IconName }[] = [
  { title: "Halal Dining", icon: "plate", desc: "Halal food throughout — certified restaurants, halal-friendly lodges and camps, and meals prepared to your requirements on safari and at the coast." },
  { title: "Prayer-Friendly", icon: "crescent", desc: "Hotels with prayer facilities and qibla direction, prayer times respected and built into your daily itinerary, with arrangements for Jumu'ah where possible." },
  { title: "Alcohol-Free Stays", icon: "prohibit", desc: "Alcohol-free hotels and family-friendly properties on request, so your accommodation matches your values from arrival to departure." },
  { title: "Respectful Guides", icon: "users", desc: "Guides who understand and observe Muslim traditions — mindful of prayer, modesty and dietary needs, many from Tanzania's own Muslim communities." },
];

const RAMADAN = [
  "Early drives, flexible schedules",
  "Suhoor arranged before dawn",
  "Iftar ready at sunset",
];

export default function HalalSafarisPage() {
  return (
    <>
      <ParallaxHero image="/img/zanzibar-island.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={`wrap ${s.heroInner}`}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Welcome &middot; Karibu</span>
          <h1 className={s.heroTitle}>Halal Safaris</h1>
          <p>Tanzania &amp; Zanzibar, on your terms.</p>
          <Link href="/plan?halal=1" className="btn btn--primary">Plan a halal safari &rarr;</Link>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.intro}>
          <span className="eyebrow">A warm welcome, without compromise</span>
          <h2>Faith-conscious travel, beautifully done</h2>
          <p>
            Tanzania &mdash; and especially Zanzibar, a proudly Muslim island &mdash; is among the world&rsquo;s
            most welcoming destinations for Muslim travellers. As a Tanzanian, family-run company, we craft
            private journeys where your faith is honoured quietly and completely.
          </p>
        </Reveal>

        <Reveal className={s.sectionHeadLike} as="div">
          <span className="eyebrow">Our promise to you</span>
          <h2 style={{ textAlign: "center", marginBottom: 32 }}>Everything arranged with care</h2>
        </Reveal>
        <div className={s.promiseGrid}>
          {PROMISE.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className={s.promiseCard}>
                <span className={s.promiseIcon} aria-hidden="true"><MegaIcon name={p.icon} size={19} /></span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.ramadan}>
          <div>
            <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Traveling during Ramadan</span>
            <h2>Ramadan, without missing a moment</h2>
            <p>Game drives shift around your day, not the other way round. We schedule early starts and shaded midday rest to work with your fast.</p>
            <ul className={s.ramadanList}>
              {RAMADAN.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <Link href="/plan?halal=1" className="btn btn--primary">Experience Ramadan in Zanzibar &rarr;</Link>
          </div>
          <div className={s.ramadanImg} style={{ backgroundImage: "url(/img/paje-golden-hour.jpg)" }} />
        </Reveal>

        <div className={s.spice}>
          <Reveal>
            <div className={s.spiceImg} style={{ backgroundImage: "url(/img/zanzibar-sunset.jpg)" }} />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">A natural fit</span>
            <h2>Safari &amp; the Spice Island</h2>
            <p>Pair a Big Five safari with Zanzibar&rsquo;s mosques, Stone Town heritage and halal cuisine, or extend to its turquoise, family-friendly beaches.</p>
            <Link href="/plan?halal=1" className="btn btn--dark">Explore Zanzibar &rarr;</Link>
          </Reveal>
        </div>

        <Reveal className={s.sectionHeadLike} as="div">
          <span className="eyebrow">Ready to book</span>
          <h2 style={{ textAlign: "center", marginBottom: 32 }}>Halal-Approved Safaris</h2>
        </Reveal>
        <div className={s.grid}>
          {HALAL_TOURS.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.06}>
              <Link href={`/safaris/${t.slug}`} className={s.card} style={{ display: "block" }}>
                <div className={s.cardImg} style={{ backgroundImage: `url(${t.img})` }} />
                <div className={s.cardBody}>
                  <div className={s.badgeRow}><span className="badge badge--ok">Halal Approved</span></div>
                  <h3 className={s.cardTitle}>{t.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--tanova-muted)" }}>{t.meta}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.moreHalal} as="div">
          <span className={s.moreHalalLabel}>Also within our halal-verified range:</span>
          <div className={s.moreHalalList}>
            {["The Island Bliss", "The Safari Oasis", "Shira Discovery", "Jungle Escape", "Manyara Explorer's Delight", "Southern Tanzania Discovery", "Ndutu Migration Safari", "Ndutu Life Awakens", "3 Days Mount Meru", "Grand Tanzanian Journey", "Mara Moments", "Nature's Harmony", "Moshi Tuk Tuk Tour"].map((name) => (
              <span key={name} className={s.moreHalalPill}>{name}</span>
            ))}
          </div>
          <p className={s.moreHalalNote}>Every itinerary we run can be made halal-verified on request — tell us which one catches your eye.</p>
        </Reveal>

        <Reveal className={s.cta}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Let&rsquo;s plan together</span>
          <h2>Tell us what matters to you</h2>
          <p>Share your dates, group and requirements &mdash; halal dining, prayer needs, alcohol-free stays, Ramadan timing &mdash; and we&rsquo;ll design a private, faith-conscious itinerary just for you.</p>
          <small>We reply within 24 hours</small>
          <Link href="/plan?halal=1" className="btn btn--primary">Plan my halal safari &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
