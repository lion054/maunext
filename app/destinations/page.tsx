import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import DestinationsMap from "@/components/DestinationsMap";
import { getDestinations } from "@/lib/destinations";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import s from "./page.module.css";

const HIGHLIGHTS = [
  { emoji: "\u{1F992}", title: "Exceptional Wildlife", desc: "Prolific and diverse wildlife in settings that remind you how wild Tanzania truly remains." },
  { emoji: "\u{1F3D5}️", title: "Expert-led Guiding", desc: "Mauly's team of field-trained naturalists brings every sighting to life with deep local knowledge." },
  { emoji: "\u{1F304}", title: "Dramatic Landscapes", desc: "Tanzania's extraordinary terrain shapes a safari experience unlike anywhere else on earth." },
];

const WHY = [
  { n: "01", title: "Private Guides", desc: "Your own expert naturalist — exclusively yours throughout the visit." },
  { n: "02", title: "Best Sighting Access", desc: "Years of local relationships mean we position you ahead of the crowd." },
  { n: "03", title: "Flexible Pace", desc: "No shared vehicles, no schedules — we go when you are ready." },
  { n: "04", title: "Sustainable Impact", desc: "Every booking funds community conservation projects here." },
];

const SEASONS = [
  { months: "Jan – Feb", tag: "Short Dry", desc: "Excellent game viewing. Calving season in Serengeti." },
  { months: "Mar – May", tag: "Long Rains", desc: "Lush scenery. Fewer visitors, lower rates." },
  { months: "Jun – Oct", tag: "Prime Safari", desc: "Best game viewing. Dry bush, clear sightlines. River crossings." },
  { months: "Nov – Dec", tag: "Short Rains", desc: "Green season arrives. Good birdwatching, quieter lodges." },
];

const ACTIVITIES = [
  { n: "01", title: "Game Drives", desc: "Expert-guided morning and evening drives in private 4x4 vehicles, positioned for the best sightings." },
  { n: "02", title: "Walking Safaris", desc: "Read the bush at ground level with an armed ranger — tracking, plants, small creatures, big moments." },
  { n: "03", title: "Cultural Encounters", desc: "Meet local communities, hear their stories, and understand Tanzania from the inside." },
  { n: "04", title: "Sundowner Stopouts", desc: "A perfect drink on the plains as the African sun sets — one of those moments that lasts a lifetime." },
];

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  const SHUFFLED_DESTINATIONS = seededShuffle(destinations, todaySeed + ":destinations");
  return (
    <>
      <ParallaxHero image="/img/great-migration.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Tanzania &middot; Mauly Tours</span>
          <h1 style={{ color: "#fff", fontSize: "clamp(34px,5.5vw,58px)" }}>Discover Tanzania</h1>
          <p>Prolific wildlife, dramatic landscapes, and forty-three years of local relationships that put you ahead of the crowd.</p>
          <div className={s.access}>
            <div><b>Getting There</b><br /><span>Kilimanjaro International Airport (JRO) or Arusha (ARK) — all transfers arranged by Mauly Tours.</span></div>
          </div>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.section} as="div">
          <span className="eyebrow">What awaits</span>
          <h2>Defining Highlights</h2>
          <div className={s.highlights}>
            {HIGHLIGHTS.map((h) => (
              <div className={s.highlight} key={h.title}><span className={s.emoji}>{h.emoji}</span><b>{h.title}</b><span>{h.desc}</span></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section} as="div">
          <span className="eyebrow">Why choose Mauly</span>
          <h2>Why Visit Tanzania With Us</h2>
          <div className={s.whyGrid}>
            {WHY.map((w) => (
              <div className={s.whyCard} key={w.n}><b>{w.n}</b><h4>{w.title}</h4><p>{w.desc}</p></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section} as="div">
          <span className="eyebrow">When to come</span>
          <h2>Seasonal Guide</h2>
          <div className={s.seasons}>
            {SEASONS.map((se) => (
              <div className={s.season} key={se.months}><b>{se.months}</b><span>{se.tag}</span><p>{se.desc}</p></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section} as="div">
          <span className="eyebrow">Things to do</span>
          <h2>Activities &amp; Experiences</h2>
          <div className={s.activities}>
            {ACTIVITIES.map((a) => (
              <div className={s.activity} key={a.n}><b>{a.n}</b><h4>{a.title}</h4><p>{a.desc}</p><Link href="/contact">Enquire &rarr;</Link></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section} as="div">
          <span className="eyebrow">Explore by park</span>
          <h2>Where to Go</h2>
          <p style={{ fontSize: 14, color: "var(--tanova-muted)", marginTop: 10, maxWidth: "60ch" }}>Hover or tap a pin to see where each destination sits relative to the others.</p>
        </Reveal>
        <Reveal style={{ marginBottom: "var(--sp-7)" }}>
          <DestinationsMap destinations={destinations} />
        </Reveal>
        <div className={s.grid}>
          {SHUFFLED_DESTINATIONS.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.05} className={`${s.card} ${i === 0 ? s.big : ""}`} as="div">
              <Link href={`/destinations/${d.slug}`} className={s.cardLink} style={{ backgroundImage: `url(${d.image})` }}>
                <div className={s.cardBody}>
                  <div className={s.cardCountry}>{d.eyebrow}</div>
                  <h3 className={s.cardTitle}>{d.title}</h3>
                  <p className={s.cardDesc}>{d.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.cta}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Your journey starts here</span>
          <h2>Let Us Take You to Tanzania</h2>
          <p>Tell us what you&rsquo;re drawn to and we&rsquo;ll shape a private itinerary around it.</p>
          <Link href="/plan" className="btn btn--primary">Plan Your Journey &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
