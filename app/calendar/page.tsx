import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import { getDepartures } from "@/lib/departures";
import { getTours } from "@/lib/tours";
import Price from "@/components/Price";
import s from "./page.module.css";

type Month = { n: string; short: string; season: "dry" | "wet" | "shoulder"; tag: string; note: string };

const MONTHS: Month[] = [
  { n: "January", short: "Jan", season: "shoulder", tag: "Calving begins", note: "Short dry spell. Wildebeest calving starts on the southern Serengeti plains — predator action follows." },
  { n: "February", short: "Feb", season: "shoulder", tag: "Peak calving", note: "The single best month for newborn wildebeest and the predators that trail them, around Ndutu." },
  { n: "March", short: "Mar", season: "wet", tag: "Long rains begin", note: "Rains build through the month. Lush, quiet, and the start of the low season." },
  { n: "April", short: "Apr", season: "wet", tag: "Long rains", note: "The wettest month. Lowest rates of the year, dramatic skies, some camps close." },
  { n: "May", short: "May", season: "wet", tag: "Rains taper off", note: "Rains ease through the month. Green, uncrowded, and still excellent value." },
  { n: "June", short: "Jun", season: "dry", tag: "Dry season begins", note: "Bush thins out fast. Migration herds push into the Western Corridor. Kilimanjaro season opens." },
  { n: "July", short: "Jul", season: "dry", tag: "Grumeti crossings", note: "Peak dry season begins. Dramatic Grumeti River crossings in the western Serengeti." },
  { n: "August", short: "Aug", season: "dry", tag: "Mara crossings", note: "Clear skies, cool mornings, the herds reach the Mara River in the north — the classic crossing images." },
  { n: "September", short: "Sep", season: "dry", tag: "Peak game viewing", note: "Driest month of the year. Exceptional visibility across every northern-circuit park." },
  { n: "October", short: "Oct", season: "dry", tag: "Migration lingers", note: "Still dry, still excellent. Herds begin drifting back south as the season turns." },
  { n: "November", short: "Nov", season: "shoulder", tag: "Short rains begin", note: "Brief afternoon showers green things up fast. Migration heads back toward the southern plains." },
  { n: "December", short: "Dec", season: "shoulder", tag: "Short rains ease", note: "Rains fade by mid-month. Warm, green, and a good value window before the January calving rush." },
];

const SEASON_LABEL: Record<Month["season"], string> = { dry: "Dry season", wet: "Long rains", shoulder: "Shoulder season" };

export default async function CalendarPage() {
  const [departures, tours] = await Promise.all([getDepartures(), getTours()]);
  const tourBySlug = new Map(tours.map((t) => [t.slug, t]));
  const departuresByDate = [...departures].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <ParallaxHero image="/img/great-migration.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Plan around the seasons</span>
          <h1 style={{ color: "#fff", fontSize: "clamp(32px,5.5vw,54px)" }}>When to Go</h1>
          <p>Tanzania rewards different months for different reasons — here&rsquo;s what each one actually looks like on the ground, plus our next confirmed departure dates.</p>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.section} as="div">
          <span className="eyebrow">The year, month by month</span>
          <h2>Tanzania Safari Calendar</h2>
          <div className={s.legend}>
            <span><i className={s.dotDry} />Dry season</span>
            <span><i className={s.dotWet} />Long rains</span>
            <span><i className={s.dotShoulder} />Shoulder season</span>
          </div>
          <div className={s.grid}>
            {MONTHS.map((m, i) => (
              <Reveal key={m.n} delay={i * 0.03} className={`${s.month} ${s[`month--${m.season}`]}`} as="div">
                <div className={s.monthTop}>
                  <span className={s.monthName}>{m.short}</span>
                  <i className={s[`dot${m.season.charAt(0).toUpperCase()}${m.season.slice(1)}` as keyof typeof s]} />
                </div>
                <span className={s.monthTag}>{m.tag}</span>
                <p className={s.monthNote}>{m.note}</p>
                <span className={s.monthSeason}>{SEASON_LABEL[m.season]}</span>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section} as="div">
          <span className="eyebrow">Ready to book</span>
          <h2>Scheduled Departures</h2>
          <p className={s.lede}>
            Most Mauly journeys are private and start whenever you&rsquo;re ready — but a few small-group treks run on
            fixed dates, joining travelers together at a lower per-person cost. Here&rsquo;s what&rsquo;s currently open.
          </p>
          {departuresByDate.length === 0 ? (
            <p className={s.noDep}>No fixed departures are currently open for booking — every other itinerary on this site can still be arranged privately on your own dates. <Link href="/contact">Tell us what you have in mind</Link>.</p>
          ) : (
            <div className={s.depGrid}>
              {departuresByDate.map((d) => {
                const tour = tourBySlug.get(d.tourSlug);
                if (!tour) return null;
                const pct = Math.round(((d.capacity - d.seatsLeft) / d.capacity) * 100);
                const dateLabel = new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
                return (
                  <Link href={`/safaris/${tour.slug}`} className={s.depCard} key={d.tourSlug + d.date}>
                    <div className={s.depImg} style={{ backgroundImage: `url(${tour.img})` }} />
                    <div className={s.depBody}>
                      <span className={s.depDate}>{dateLabel}</span>
                      <h3 className={s.depTitle}>{tour.title}</h3>
                      <div className={s.depSeats}>
                        <div className={s.depBar}><div className={s.depBarFill} style={{ width: `${pct}%` }} /></div>
                        <span>{d.seatsLeft} of {d.capacity} seats open</span>
                      </div>
                      <div className={s.depFoot}>
                        <span className={s.depPrice}><Price value={d.price} /> <small>/ person</small></span>
                        <span className={s.depCta}>View &amp; book &rarr;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Reveal>

        <Reveal className={s.cta}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Prefer your own dates?</span>
          <h2>Every private safari on this site starts whenever you&rsquo;re ready</h2>
          <p>Fixed departures are the exception, not the rule — most Mauly journeys are built around your calendar, not ours.</p>
          <Link href="/plan" className="btn btn--primary">Plan Your Journey &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
