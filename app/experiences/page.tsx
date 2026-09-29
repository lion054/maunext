import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import s from "./page.module.css";

const SECTIONS = [
  {
    n: "01", title: "Wildlife Safari", img: "/img/great-migration.jpg",
    desc: "Witness the Great Migration, track the Big Five across the Serengeti, and discover why Tanzania hosts more wildlife than anywhere else on Earth. Guided by certified naturalists who know every animal by name.",
    href: "/safaris",
  },
  {
    n: "02", title: "Kilimanjaro Trekking", img: "/img/kilimanjaro-summit-night.jpg",
    desc: "Africa's highest peak. Six routes, one summit. Whether you're a first-time trekker or a seasoned mountaineer, our KPAP-certified guides will take you to 5,895 metres.",
    href: "/trekking",
  },
  {
    n: "03", title: "Cultural Encounter", img: "/img/maasai-lake-natron.webp",
    desc: "Live alongside Maasai communities, explore Zanzibar's spice legacy, and experience Tanzania's extraordinary human tapestry. Our cultural guides are drawn from the communities themselves.",
    href: "/halal-safaris",
  },
  {
    n: "04", title: "Beach Relaxation", img: "/img/zanzibar-sunset.jpg",
    desc: "The perfect finale to any safari. Zanzibar's powder-white beaches, coral reefs, and Stone Town heritage complete a Tanzania journey like nothing else.",
    href: "/destinations",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <ParallaxHero image="/img/lion-behaviour.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Tanzania &mdash; Four Extraordinary Journeys</span>
          <h1>Extraordinary Experiences</h1>
          <p>Four ways to encounter Tanzania — each as personal and purposeful as you are.</p>
        </div>
      </ParallaxHero>

      <div className="wrap">
        {SECTIONS.map((sec, i) => (
          <Reveal key={sec.title} className={s.split} as="div">
            <div className={s.splitImg} style={{ backgroundImage: `url(${sec.img})` }} />
            <div className={s.splitText}>
              <span className="eyebrow">{sec.n} &mdash; Experience</span>
              <h2>{sec.title}</h2>
              <p>{sec.desc}</p>
              <Link href={sec.href} className="btn btn--dark">Explore {sec.title} &rarr;</Link>
            </div>
          </Reveal>
        ))}

        <Reveal className={s.why}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Why Mauly</span>
          <h2>Personalised. Purposeful. Private.</h2>
          <p>Every Mauly experience is designed from scratch around you — your dates, your interests, your pace. We don&rsquo;t do group departures, cookie-cutter itineraries, or compromise.</p>
          <Link href="/contact" className="btn btn--primary">Start Planning &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
