import Link from "next/link";
import { notFound } from "next/navigation";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import { DESTINATIONS, getDestination } from "@/lib/destinations";
import { TOURS } from "@/lib/tours";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import Price from "@/components/Price";
import s from "./page.module.css";

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export default async function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  const related = seededShuffle(
    (dest.tourSlugs ?? []).map((ts) => TOURS.find((t) => t.slug === ts)).filter(Boolean),
    todaySeed + ":related:" + dest.slug
  );

  return (
    <>
      <ParallaxHero image={dest.image} className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>{dest.eyebrow}</span>
          <h1 style={{ color: "#fff", fontSize: "clamp(32px,5.5vw,54px)" }}>{dest.title}</h1>
          <p>{dest.tagline}</p>
          <Link href="/plan" className="btn btn--primary">Plan a trip here &rarr;</Link>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.section} as="div">
          <span className="eyebrow">Overview</span>
          <p className={s.intro}>{dest.intro}</p>
        </Reveal>

        {dest.highlights.length > 0 && (
          <div className={s.section}>
            <Reveal as="div"><span className="eyebrow">Why go</span><h2>Why We Love {dest.title}</h2></Reveal>
            <div className={s.zigzag}>
              {dest.highlights.slice(0, 2).length > 0 && (
                <Reveal as="div" className={s.zigRow}>
                  <div className={s.zigReasons}>
                    {dest.highlights.slice(0, 2).map((h, i) => (
                      <div className={s.zigReason} key={h.title}><span className={s.zigNum}>0{i + 1}</span><h4>{h.title}</h4><p>{h.desc}</p></div>
                    ))}
                  </div>
                  <div className={s.zigImg} style={{ backgroundImage: `url(${dest.image})` }} />
                </Reveal>
              )}
              {dest.highlights[2] && (
                <Reveal as="div" className={`${s.zigRow} ${s.zigRowReverse}`}>
                  <div className={s.zigImg} style={{ backgroundImage: `url(${dest.secondaryImage})` }} />
                  <div className={s.zigReasons}>
                    <div className={s.zigReason}><span className={s.zigNum}>03</span><h4>{dest.highlights[2].title}</h4><p>{dest.highlights[2].desc}</p></div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        )}

        <Reveal className={s.section} as="div">
          <div className={s.videoBanner} style={{ backgroundImage: `url(${dest.secondaryImage})` }}>
            <button type="button" className={s.playBtn} aria-label={`Preview ${dest.title}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </button>
            <span className={s.videoCaption}>A closer look at {dest.title}</span>
          </div>
        </Reveal>

        {(dest.whenToGo || dest.gettingThere) && (
          <Reveal className={s.section} as="div">
            <div className={s.infoGrid}>
              {dest.whenToGo && (
                <div className={s.infoCard}>
                  <h4>When to go</h4>
                  <p>{dest.whenToGo}</p>
                </div>
              )}
              {dest.gettingThere && (
                <div className={s.infoCard}>
                  <h4>Getting there</h4>
                  <p>{dest.gettingThere}</p>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {related.length > 0 && (
          <Reveal className={s.section} as="div">
            <span className="eyebrow">Itineraries featuring {dest.title}</span>
            <h2>Related journeys</h2>
            <div className={s.related}>
              {related.map((t) => t && (
                <Link href={`/safaris/${t.slug}`} className={s.relatedCard} key={t.slug} style={{ backgroundImage: `url(${t.img})` }}>
                  <div className={s.relatedBody}>
                    <b>{t.title}</b>
                    <span>{t.days} days{t.price ? <> &middot; from <Price value={t.price} /></> : null}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal className={s.cta}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Ready when you are</span>
          <h2>Let&rsquo;s Build Your {dest.title} Journey</h2>
          <p>Tell us your dates and interests — we&rsquo;ll shape a private itinerary around {dest.title}.</p>
          <Link href="/contact" className="btn btn--primary">Enquire Now &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
