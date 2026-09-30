import Link from "next/link";
import Image from "next/image";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import HeroSearch from "@/components/HeroSearch";
import CollectionBadges from "@/components/CollectionBadges";
import Stars from "@/components/Stars";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { getTours } from "@/lib/tours";
import { getDestinations } from "@/lib/destinations";
import { getStays } from "@/lib/stays";
import { buildSearchOptions } from "@/lib/searchOptions";
import { REVIEWS } from "@/lib/reviews";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import s from "./page.module.css";

const FEATURED_REVIEWS = seededShuffle(REVIEWS, todaySeed + ":reviews").slice(0, 3);

const EXPERIENCES = [
  { n: "01", cat: "Wildlife", title: "Wildlife Safari", img: "/img/great-migration.jpg", href: "/safaris" },
  { n: "02", cat: "Summit", title: "Mountain Trekking", img: "/img/kilimanjaro-summit-night.jpg", href: "/trekking" },
  { n: "03", cat: "Culture", title: "Cultural Journeys", img: "/img/maasai-lake-natron.webp", href: "/experiences" },
  { n: "04", cat: "Coast", title: "Beach Relaxation", img: "/img/zanzibar-sunset.jpg", href: "/destinations/zanzibar" },
];

const MOTION_POINTS = [
  { l: "A", title: "Wildlife Safaris", sub: "The Great Migration and untamed wilderness" },
  { l: "B", title: "Kilimanjaro Treks", sub: "Follow climbers to the Roof of Africa" },
  { l: "C", title: "Cultural Encounters", sub: "Immerse in Maasai and local traditions" },
];

const IMPACT = [
  { n: "92%", l: "Eco-certified lodges used" },
  { n: "15+", l: "Local communities supported" },
  { n: "0", l: "Single-use plastic on trip" },
];

const LOGOS = [
  { src: "/img/logo-tripadvisor.webp", w: 701, h: 450, alt: "TripAdvisor", caption: "Tripadvisor Travelers' Choice", sub: "Winner 2025" },
  { src: "/img/logo-travelife.webp", w: 701, h: 252, alt: "Travelife", caption: "Travelife Certified", sub: "Awarded sustainability status" },
  { src: "/img/logo-kpap.webp", w: 701, h: 297, alt: "KPAP", caption: "Supporting KPAP", sub: "Kilimanjaro Porters Assistance Project" },
  { src: "/img/logo-tato.webp", w: 701, h: 563, alt: "TATO", caption: "Member — TATO", sub: "Tanzania Association of Tour Operators" },
  { src: "/img/logo-ttb.png", w: 189, h: 49, alt: "Tanzania Tourist Board", caption: "Proud Member — TTB", sub: "Tanzania Tourist Board" },
  { src: "/img/logo-iata.webp", w: 701, h: 450, alt: "IATA", caption: "Recognized by IATA", sub: "International Air Transport Association" },
];

const JOURNAL = [
  { tag: "Heritage", date: "August 18, 2026", title: "Tanzanian Food: 12 Must-Try Dishes in Tanzania", img: "/img/zanzibar-island.jpg" },
  { tag: "Trekking", date: "August 17, 2026", title: "Kilimanjaro Routes: 7 Best Routes To Climb Mount Kilimanjaro", img: "/img/kilimanjaro-summit-night.jpg" },
  { tag: "Trekking", date: "August 17, 2026", title: "7 Mount Kilimanjaro Myths Debunked", img: "" },
];

export default async function Home() {
  const [tours, destinations, stays] = await Promise.all([getTours(), getDestinations(), getStays()]);
  const searchOptions = buildSearchOptions(tours, destinations, stays.length);
  const HANDPICKED_TOURS = seededShuffle(tours, todaySeed + ":tours").slice(0, 6);
  const DAY_TRIPS = tours.filter((t) => t.productType === "day_trip");
  return (
    <>
      <ParallaxHero image="/img/leopard-serengeti-plains.webp" video="/video/hero.mp4" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <div className={s.heroEyebrow}>Trusted since 1983</div>
          <h1 className={s.heroTitle}>Experience<br /><em>On Your Terms</em></h1>
          <p className={s.heroSub}>Tailored journeys that adapt to your <b>Pace</b>, <b>Passions</b> and <b>Style</b>.</p>
          <div className={s.heroActions}>
            <Link href="/safaris" className="btn btn--primary">Explore Safaris &rarr;</Link>
            <Link href="/contact" className="btn btn--outline">Speak to a Specialist</Link>
          </div>
          <div className={s.trustBar}>
            <Stars n={5} size={14} className={s.stars} hidden />
            <span>Trusted since 1983</span>
            <span className={s.divider}>|</span>
            <span>Tanzania &middot; Rwanda &middot; Kenya &mdash; four decades in the field</span>
          </div>
          <HeroSearch options={searchOptions} />
        </div>
        <div className={s.scrollCue} aria-hidden="true"><span>Scroll</span><i /></div>
      </ParallaxHero>

      <section className="section">
        <div className="wrap">
          <Reveal className={s.sectionHeadLeft}>
            <span className="eyebrow">Tailored journeys</span>
            <h2>Discover Experiences Tailored for You</h2>
          </Reveal>
          <div className={s.expGrid}>
            {EXPERIENCES.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.06}>
                <Link href={e.href} className={s.expCard}>
                  <div className={s.expImg} style={{ backgroundImage: `url(${e.img})` }} />
                  <div className={s.expTag}>{e.n} &mdash; {e.cat}</div>
                  <div className={s.expTitle}>{e.title}</div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className={s.sectionHead}>
            <span className="eyebrow">What sets us apart</span>
            <h2>Tailored journeys, crafted around you.</h2>
            <p>No fixed group buses, no rushed checklists. Every itinerary is drawn for a single party — the pace, the lodges, the moments by the fire are all yours. We simply make sure the wilderness shows up on cue.</p>
          </Reveal>
          <Reveal className={s.bento}>
            <div className={`${s.bentoImg} ${s.bentoFeature}`} style={{ backgroundImage: "url(/img/lion-manyara.webp)" }}>
              <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>The Mauly difference</span>
              <h3>Forty-three years reading the wild &mdash; for you.</h3>
            </div>
            <div className={`${s.bentoStat} ${s.bentoStat1}`}><b>43</b><span>Years of safari craft &middot; since 1983</span></div>
            <div className={`${s.bentoStat} ${s.bentoStat2}`}>
              <b>
                266
                <i aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </i>
              </b>
              <span>Tripadvisor travellers&rsquo; choice</span>
            </div>
            <div className={`${s.bentoImg} ${s.bentoImg2}`} style={{ backgroundImage: "url(/img/zanzibar-sunset.jpg)" }}>
              <span>Zanzibar</span>
            </div>
            <div className={`${s.bentoStat} ${s.bentoStat3}`}><b>50+</b><span>Destinations across East Africa</span></div>
            <Link href="/plan" className={s.bentoCta}>
              <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Start with a blank page</span>
              <h3>Plan your journey</h3>
              <span className={s.bentoCtaLink}>Begin &rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className={s.toursBand}>
        <div className="wrap">
          <Reveal className={s.toursHead}>
            <div>
              <span className="eyebrow">Signature journeys</span>
              <h2>Handpicked Tours <em>for You</em></h2>
            </div>
            <Link href="/safaris" className="btn btn--primary">Request the Full Collection &rarr;</Link>
          </Reveal>
          <div className={s.toursGrid}>
            {HANDPICKED_TOURS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.05}>
                <Link href={`/safaris/${t.slug}`} className={s.tourTile} style={{ backgroundImage: `url(${t.img})` }}>
                  <CollectionBadges collections={t.collections} className={s.tourTileBadges} />
                  <span className={s.tourTileTitle}>{t.title}</span>
                  <span className={s.tourTileMeta}>{t.meta}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {DAY_TRIPS.length > 0 && (
        <section className={s.toursBand}>
          <div className="wrap">
            <Reveal className={s.toursHead}>
              <div>
                <span className="eyebrow">Short on time?</span>
                <h2>Day Trips <em>Worth the Detour</em></h2>
              </div>
              <Link href="/safaris?type=day_trip" className="btn btn--primary">See All Day Trips &rarr;</Link>
            </Reveal>
            <div className={s.toursGrid}>
              {DAY_TRIPS.map((t, i) => (
                <Reveal key={t.title} delay={i * 0.05}>
                  <Link href={`/safaris/${t.slug}`} className={s.tourTile} style={{ backgroundImage: `url(${t.img})` }}>
                    <CollectionBadges collections={t.collections} className={s.tourTileBadges} />
                    <span className={s.tourTileTitle}>{t.title}</span>
                    <span className={s.tourTileMeta}>{t.meta}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={s.collectionsBand}>
        <div className="wrap">
          <Reveal className={s.sectionHead}>
            <span className="eyebrow">Two ways to travel with us</span>
            <h2>Our Signature Collections</h2>
          </Reveal>
          <div className={s.collectionsGrid}>
            <Reveal className={s.collectionCard}>
              <div className={s.collectionImg} style={{ backgroundImage: "url(/img/paje-golden-hour.jpg)" }} />
              <div className={s.collectionOverlay} />
              <div className={s.collectionBody}>
                <span className={`collection-badge collection-badge--sublime ${s.collectionBadge}`}><span aria-hidden="true">✦</span>Sublime Collection</span>
                <h3 className={s.collectionTitle}>Ultra-luxury safaris, composed by hand</h3>
                <p className={s.collectionDesc}>A darker, quieter register of travel — private throughout, flown not driven, with a dedicated concierge overseeing every detail.</p>
                <div className={s.collectionMeta}>
                  <span>From $4,650</span><span>&middot;</span><span>Exclusive-use camps</span>
                </div>
                <Link href="/sublime" className="btn btn--primary">Explore Sublime &rarr;</Link>
              </div>
            </Reveal>
            <Reveal delay={0.1} className={s.collectionCard}>
              <div className={s.collectionImg} style={{ backgroundImage: "url(/img/zanzibar-island.jpg)" }} />
              <div className={s.collectionOverlay} />
              <div className={s.collectionBody}>
                <span className={`collection-badge collection-badge--halal ${s.collectionBadge}`}><span aria-hidden="true">✓</span>Halal Safaris</span>
                <h3 className={s.collectionTitle}>Faith-conscious travel, beautifully done</h3>
                <p className={s.collectionDesc}>Halal dining, prayer-friendly stays and Ramadan-aware scheduling — Tanzania and Zanzibar, exactly on your terms.</p>
                <div className={s.collectionMeta}>
                  <span>From $320</span><span>&middot;</span><span>100% halal-verified</span>
                </div>
                <Link href="/halal-safaris" className="btn btn--primary">Explore Halal Safaris &rarr;</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className={s.motionGrid}>
            <Reveal>
              <span className="eyebrow">Tanzania in motion</span>
              <h2>Experience Tanzania <em>in Motion</em></h2>
              <p className={s.motionLede}>Meet the people, hear their stories, and feel the land breathe. Here&rsquo;s what a Mauly journey is built from.</p>
              <ul className={s.motionList}>
                {MOTION_POINTS.map((m) => (
                  <li key={m.l}><span className={s.motionLetter}>{m.l}</span><div><b>{m.title}</b><small>{m.sub}</small></div></li>
                ))}
              </ul>
              <button type="button" className="btn btn--dark">Watch the Film &rarr;</button>
            </Reveal>
            <Reveal delay={0.1}>
              <div className={s.videoCard} style={{ backgroundImage: "url(/img/great-migration.jpg)" }}>
                <button type="button" className={s.playBtn} aria-label="Play film">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className={s.impactGrid}>
            <Reveal>
              <div className={s.impactImg} style={{ backgroundImage: "url(/img/tarangire-elephants.jpg)" }} />
            </Reveal>
            <Reveal delay={0.1}>
              <span className="eyebrow">Travel with purpose</span>
              <h2>Every journey leaves the land better than it found it.</h2>
              <p>From eco-certified camps to community-owned conservancies, we measure success in more than memories.</p>
              <div className={s.impactStats}>
                {IMPACT.map((i) => <div key={i.l}><b>{i.n}</b><span>{i.l}</span></div>)}
              </div>
              <Link href="/about" className="btn btn--primary">Read Our Impact &rarr;</Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className={s.sectionHead}>
            <span className="eyebrow">Verified reviews</span>
            <h2>Trusted by Travelers</h2>
          </Reveal>
          <Reveal className={s.reviewsRow}>
            <div className={s.taWidget}>
              <b>EXCELLENT</b>
              <div className={s.taCircles}>
                {Array.from({ length: 5 }).map((_, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- real TripAdvisor star asset
                  <img src="https://cdn.trustindex.io/assets/platform/Tripadvisor/star/f.svg" alt="" key={i} width={22} height={22} />
                ))}
              </div>
              <span>Based on 266 reviews</span>
              <Image src="/img/logo-tripadvisor.webp" alt="Tripadvisor" width={701} height={450} className={s.taLogo} />
            </div>
            <ReviewsCarousel reviews={FEATURED_REVIEWS} />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className={s.sectionHead}>
            <span className="eyebrow">Proudly certified &amp; awarded</span>
          </Reveal>
          <div className={s.logoGrid}>
            {LOGOS.map((l, i) => (
              <Reveal key={l.alt} delay={i * 0.04}>
                <div className={s.logoCard}>
                  <Image src={l.src} alt={l.alt} width={l.w} height={l.h} />
                  <b>{l.caption}</b>
                  <span>{l.sub}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className={s.toursHead}>
            <div>
              <span className="eyebrow">Insights from experts</span>
              <h2>Insights From Experts</h2>
            </div>
            <Link href="/blog" className="btn btn--dark">Read the Journal &rarr;</Link>
          </Reveal>
          <div className={s.grid3}>
            {JOURNAL.map((j, i) => (
              <Reveal key={j.title} delay={i * 0.06}>
                <Link href="/blog" className={s.postCard}>
                  {j.img ? (
                    <div className={s.postImg} style={{ backgroundImage: `url(${j.img})` }}><span className={s.postTag}>{j.tag}</span></div>
                  ) : (
                    <div className={s.postImgFallback}><span className={s.postTag}>{j.tag}</span><b>Myths &amp; Facts</b></div>
                  )}
                  <div className={s.tourBody}>
                    <div className={s.postDate}>{j.date}</div>
                    <h3 className={s.postTitle}>{j.title}</h3>
                    <span className={s.postReadMore}>Read more &rarr;</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ParallaxHero image="/img/paje-golden-hour.jpg" className={s.closeCta} overlayClassName={s.closeCtaOverlay}>
        <div className={`wrap ${s.closeCtaInner}`}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Your journey begins</span>
          <h2 className={s.closeCtaTitle}>Let&rsquo;s design the safari you&rsquo;ll <em>never stop telling people about.</em></h2>
          <p>Tell us how you like to travel. A specialist replies within one working day with a tailored proposal &mdash; no obligation, no templates.</p>
          <Link href="/contact" className="btn btn--primary">Begin the Conversation &rarr;</Link>
        </div>
      </ParallaxHero>
    </>
  );
}
