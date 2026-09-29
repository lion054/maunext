import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import s from "./page.module.css";

const PILLARS = [
  {
    n: "01", title: "Environment",
    desc: "We protect Tanzania's wildlife and wild places — 92% of the lodges we use are eco-certified, our tours and climbs are single-use-plastic free, and we follow a strict leave-no-trace ethic on every safari and beach.",
  },
  {
    n: "02", title: "Culture",
    desc: "We honour the communities and traditions that make Tanzania extraordinary. Cultural visits are led by the communities themselves — Maasai, Chagga and Swahili guides who share their own heritage, fairly and with dignity.",
  },
  {
    n: "03", title: "Economic Empowerment",
    desc: "Tourism should enrich Tanzanians. We hire local guides at above-market wages, source from local suppliers, and partner with KPAP to guarantee fair pay for every porter. Your spend stays and works in the communities you visit.",
  },
];

const STATS = [
  { n: "92%", l: "Eco-certified lodges used" },
  { n: "15+", l: "Communities supported" },
  { n: "0", l: "Single-use plastic on tour" },
];

export default function SustainableTourismPage() {
  return (
    <>
      <ParallaxHero image="/img/tarangire-elephants.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Environment &middot; Culture &middot; Community</span>
          <h1>Responsible Tourism</h1>
          <p>Travel that leaves Tanzania better.</p>
          <Link href="/plan" className="btn btn--primary">Plan a journey that matters &rarr;</Link>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.section} as="div">
          <span className="eyebrow">Our ethos</span>
          <h2>Leave it better than we found it</h2>
          <p className={s.lede}>
            Responsible tourism isn&rsquo;t a marketing checkbox — it is the foundation of every decision we make,
            and it stands on three pillars: protecting the environment, honouring local culture, and driving
            economic empowerment for Tanzanian communities.
          </p>
        </Reveal>

        <Reveal className={s.section} as="div">
          <span className="eyebrow">Our commitments</span>
          <h2>Three Pillars of Responsible Travel</h2>
          <div className={s.pillars}>
            {PILLARS.map((p) => (
              <div className={s.pillar} key={p.n}>
                <span className={s.pillarNum}>{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.halal}>
          <div>
            <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Inclusive by design</span>
            <h2>Halal &amp; Muslim-Friendly Safaris</h2>
            <p>
              Responsible travel means welcoming everyone. We craft faith-conscious journeys with halal dining,
              prayer-friendly itineraries, alcohol-free stays and guides who respect Muslim traditions &mdash;
              across Tanzania and Zanzibar.
            </p>
            <Link href="/halal-safaris" className="btn btn--dark">Explore Halal Safaris &rarr;</Link>
          </div>
          <div className={s.halalImg} style={{ backgroundImage: "url(/img/zanzibar-island.jpg)" }} />
        </Reveal>

        <Reveal className={s.stats}>
          {STATS.map((st) => <div key={st.l}><b>{st.n}</b><span>{st.l}</span></div>)}
        </Reveal>

        <Reveal className={s.cta}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Travel differently</span>
          <h2>Plan a journey that matters</h2>
          <p>Every Mauly safari supports the wildlife, people and places that make Tanzania extraordinary. Let&rsquo;s design yours.</p>
          <Link href="/plan" className="btn btn--primary">Start Planning &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
