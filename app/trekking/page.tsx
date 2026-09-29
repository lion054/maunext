import Link from "next/link";
import Image from "next/image";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import { departuresForTour } from "@/lib/departures";
import s from "./page.module.css";

const STATS = [
  { n: "5,895m", l: "Summit elevation" },
  { n: "6", l: "Routes to the top" },
  { n: "92%", l: "Best-route success rate" },
  { n: "KPAP", l: "Certified guides & crew" },
];

/** Real route data (success rates, days, difficulty) — tag is a short label pulled
 *  directly from each route's own description below it, not a new claim. */
const ROUTES = [
  { name: "Lemosho Route", tourSlug: "7-day-kilimanjaro-group-trek-via-lemosho-route", diff: "moderate", days: "7–8 Days", success: "90%+ success rate", tag: "Best for first-timers", desc: "The most scenic route, with excellent acclimatisation and high success rates. Our top recommendation for most climbers." },
  { name: "Machame Route", tourSlug: "6-day-kilimanjaro-group-trek-via-machame-route", diff: "challenging", days: "6–7 Days", success: "85% success rate", tag: "Most popular route", desc: "The most popular route. Dramatic scenery, excellent views, and a great “climb high, sleep low” profile." },
  { name: "Rongai Route", tourSlug: "rongai-route-kilimanjaro-trek", diff: "moderate", days: "6–7 Days", success: "75% success rate", tag: "Quietest route", desc: "The only route that approaches from the north. Quieter, drier, and great for those seeking solitude." },
  { name: "Marangu Route", tourSlug: "6-day-kilimanjaro-group-trek-via-marangu-route", diff: "moderate", days: "5–6 Days", success: "65% success rate", tag: "Hut accommodation", desc: "The classic “Coca-Cola” route with hut accommodation. Shorter acclimatisation reduces summit success rates." },
  { name: "Northern Circuit", tourSlug: "8-day-northern-circuit-group-trek", diff: "moderate", days: "9–10 Days", success: "92%+ success rate", tag: "Highest success rate", desc: "The longest and most remote route. Exceptional acclimatisation profile, outstanding summit success rate." },
  { name: "Umbwe Route", tourSlug: "umbwe-route-6-day-challenge-to-the-summit-of-mt-kilimanjaro", diff: "veryhard", days: "5–6 Days", success: "50% success rate", tag: "Steepest & most direct", desc: "The steepest, most direct route. For fit, experienced trekkers only. Rapid ascent significantly reduces success rate." },
];

const DIFF_LABEL: Record<string, string> = { moderate: "Moderate", challenging: "Challenging", veryhard: "Very Hard" };

export default function TrekkingPage() {
  return (
    <>
      <ParallaxHero image="/img/kilimanjaro-summit-night.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Africa&rsquo;s Rooftop</span>
          <h1 className={s.heroTitle}>Conquer Mount Kilimanjaro</h1>
          <p>The world&rsquo;s highest free-standing mountain &mdash; no technical climbing experience required, just the right pace.</p>
          <Link href="/plan" className="btn btn--primary">Plan my trek &rarr;</Link>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.statsRow}>
          {STATS.map((st) => (
            <div className={s.statCell} key={st.l}><b>{st.n}</b><span>{st.l}</span></div>
          ))}
        </Reveal>
      </div>

      <div className="wrap">
        <Reveal className={s.intro}>
          <div>
            <span className="eyebrow">Why Kilimanjaro?</span>
            <h2>The world&rsquo;s highest free-standing mountain</h2>
            <p>At 5,895 metres above sea level, Mount Kilimanjaro is Africa&rsquo;s highest point &mdash; and one of the world&rsquo;s most accessible high summits. No technical climbing experience is required.</p>
            <p>Mauly Tours has been leading Kilimanjaro climbs for over 20 years. Our guides are KPAP-certified, our porters are paid above the legal minimum wage, and our policy on the mountain is zero single-use plastic.</p>
          </div>
          <Link href="/mount-meru" className={s.crossSell}>
            <Image src="/img/ol-doinyo-lengai.webp" alt="Mount Meru" width={600} height={800} className={s.crossSellImg} />
            <div>
              <span className="eyebrow">Looking for a quieter climb?</span>
              <h3>Mount Meru</h3>
              <p>Tanzania&rsquo;s second-highest peak &mdash; a 4-day trek with fewer crowds and rich wildlife along the way.</p>
              <span className={s.crossSellLink}>View the climb &rarr;</span>
            </div>
          </Link>
        </Reveal>
      </div>

      <div className="wrap">
        <Reveal style={{ marginBottom: 36 }}>
          <span className="eyebrow">Choose your path</span>
          <h2>The 6 Routes to the Summit</h2>
          <p className={s.explorerLede}>Every route to Uhuru Peak trades off differently between time, difficulty and summit success &mdash; here&rsquo;s exactly how, side by side, not spread across three separate widgets.</p>
        </Reveal>

        <div className={s.explorer}>
          {ROUTES.map((r, i) => {
            const pct = parseInt(r.success, 10);
            const [nextDeparture] = departuresForTour(r.tourSlug);
            return (
              <Reveal key={r.name} delay={i * 0.04}>
                <Link href={`/safaris/${r.tourSlug}`} className={s.explorerRow}>
                  <div className={s.explorerHead}>
                    <span className={s.explorerName}>{r.name}</span>
                    <span className={s.explorerTag}>{r.tag}</span>
                    {nextDeparture && (
                      <span className={s.explorerDeparture}>
                        Next departure {new Date(nextDeparture.date + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} &middot; {nextDeparture.seatsLeft} of {nextDeparture.capacity} seats open
                      </span>
                    )}
                  </div>
                  <p className={s.explorerDesc}>{r.desc}</p>
                  <div className={s.explorerMeta}>
                    <span className={`${s.routeDiff} ${s[`routeDiff--${r.diff}` as keyof typeof s]}`}>{DIFF_LABEL[r.diff]}</span>
                    <span className={s.explorerDays}>{r.days}</span>
                  </div>
                  <div className={s.explorerBarRow}>
                    <div className={s.explorerBarTrack}>
                      <div
                        className={`${s.explorerBarFill} ${s[`explorerBarFill--${r.diff}` as keyof typeof s]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={s.explorerPct}>{pct}% success</span>
                  </div>
                  <span className={s.explorerCta}>View this route &rarr;</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="wrap">
        <Reveal className={s.reading}>
          <Link href="/blog" className={s.readingLink}>
            <Image src="/img/kilimanjaro-summit-night-sm.jpg" alt="" width={1024} height={683} className={s.readingImg} />
            <div>
              <span className="eyebrow">Essential reading</span>
              <h3>Kilimanjaro tips, routes and packing advice from our journal</h3>
              <p>Route comparisons, costs, best climbing seasons, preparation and packing tips from our local guides.</p>
            </div>
          </Link>
        </Reveal>

        <Reveal className={s.crew}>
          <div>
            <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>The summit awaits</span>
            <h2>Start Your Summit Journey</h2>
            <p>Every crew is KPAP-certified &mdash; the Kilimanjaro Porters Assistance Project sets standards for porter pay, load limits and treatment, and we only work with crews who meet them.</p>
          </div>
          <div className={s.crewActions}>
            <Link href="/calendar" className="btn btn--primary">See Open Departures &rarr;</Link>
            <Link href="/contact" className="btn btn--outline">Talk to a Guide</Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
