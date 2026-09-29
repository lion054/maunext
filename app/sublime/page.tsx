import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import ReviewList from "@/components/ReviewList";
import { REVIEWS } from "@/lib/reviews";
import Price from "@/components/Price";
import s from "./page.module.css";

const JOURNEYS = [
  { eye: "Nine Days", price: 6850, title: "Golf & the Great Migration", desc: "Championship golf and a private villa beneath Kilimanjaro, then flown deep into the Serengeti for river crossings from exclusive migration camps.", url: "/safaris/luxury-golf-serengeti-migration-safari", linkLabel: "View full itinerary", img: "/img/kilimanjaro-summit-night.jpg" },
  { eye: "Ten Days", price: null, title: "The Grand Tanzanian Journey", desc: "Four iconic parks in supreme comfort, completed by Zanzibar's Stone Town and a private beach sanctuary — every detail anticipated.", url: "/safaris/grand-tanzanian-journey", linkLabel: "View full itinerary", img: "/img/zanzibar-island.jpg" },
  { eye: "Seven Days", price: 4650, title: "Private Migration Wilderness", desc: "Exclusive-use luxury camps that move with the herds across Tarangire, the Northern Serengeti and Ngorongoro — your own vehicle, your own pace.", url: "/safaris/migration-wilderness-wanderlust", linkLabel: "View full itinerary", img: "/img/tarangire-elephants.jpg" },
];

const SUBLIME_REVIEWS = REVIEWS.filter((r) => r.tourSlug === "luxury-golf-serengeti-migration-safari" || r.tourSlug === "migration-wilderness-wanderlust");

const STANDARD = [
  ["Private throughout", "Your own vehicle, private guide and exclusive-use camps — never a shared departure."],
  ["Flown, not driven", "Light-aircraft transfers, so your days belong to the wild, not the road."],
  ["The finest addresses", "Hand-chosen lodges, migration camps and beach retreats — the best beds in Tanzania."],
  ["A dedicated concierge", "One expert designs and quietly oversees your entire journey, before and throughout."],
];

export default function SublimePage() {
  return (
    <div className={s.page}>
      <ParallaxHero image="/img/paje-golden-hour.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <div className={s.eye}>The Sublime Collection</div>
          <h1 className={s.h1}>Ultra-luxury safaris,<br />composed by hand</h1>
          <p className={s.lede}>A darker, quieter register of travel — for those who have done East Africa before, and want it done differently this time.</p>
          <div className={s.heroCta}>
            <Link href="/contact" className="btn btn--primary">Speak to a Specialist &rarr;</Link>
          </div>
        </div>
      </ParallaxHero>

      <section className={s.section}>
        <Reveal className={s.sectionHead}>
          <div className={s.eye}>Signature Journeys</div>
          <h2>Three ways to begin</h2>
        </Reveal>
        <div className={s.journeys}>
          {JOURNEYS.map((j, i) => (
            <Reveal key={j.title} delay={i * 0.1}>
              <article className={s.journey}>
                <div className={s.journeyImg} style={{ backgroundImage: `url(${j.img})` }}>
                  {j.price && <span className={s.jPrice}>From <Price value={j.price} /></span>}
                </div>
                <div className={s.journeyBody}>
                  <div className={s.jEye}>{j.eye}</div>
                  <h3 className={s.jTitle}>{j.title}</h3>
                  <p className={s.jDesc}>{j.desc}</p>
                  <Link href={j.url} className={s.jLink}>{j.linkLabel} &rarr;</Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <Reveal className={s.sectionHead}>
          <div className={s.eye}>The Standard</div>
          <h2>What Sublime always means</h2>
        </Reveal>
        <div className={s.standard}>
          {STANDARD.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className={s.std}>
                <span />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {SUBLIME_REVIEWS.length > 0 && (
        <section className={s.section}>
          <Reveal className={s.sectionHead}>
            <div className={s.eye}>What Sublime travelers say</div>
            <h2>Composed for them, too</h2>
          </Reveal>
          <ReviewList reviews={SUBLIME_REVIEWS} />
        </section>
      )}

      <Reveal as="section" className={s.cta}>
        <h2>Sublime is composed, never sold off the shelf.</h2>
        <Link href="/contact" className="btn btn--primary">Begin a conversation &rarr;</Link>
      </Reveal>
    </div>
  );
}
