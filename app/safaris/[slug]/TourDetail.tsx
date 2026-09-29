"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Tour } from "@/lib/tours";
import { TOURS } from "@/lib/tours";
import { reviewsForTour } from "@/lib/reviews";
import { departuresForTour } from "@/lib/departures";
import { useTrip } from "@/lib/trip/TripProvider";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import { seededShuffle, todaySeed } from "@/lib/shuffle";
import Lightbox from "@/components/Lightbox";
import ReviewList from "@/components/ReviewList";
import CollectionBadges from "@/components/CollectionBadges";
import Stars from "@/components/Stars";
import s from "./page.module.css";

const TABS = ["Overview", "Itinerary", "Included", "FAQ"] as const;

export default function TourDetail({ tour }: { tour: Tour }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const relatedSeed = todaySeed + ":related:" + tour.slug;
  const related = seededShuffle(TOURS.filter((t) => t.slug !== tour.slug && t.region === tour.region), relatedSeed).slice(0, 3);
  const relatedFallback = related.length > 0 ? related : seededShuffle(TOURS.filter((t) => t.slug !== tour.slug), relatedSeed).slice(0, 3);

  const { addItem } = useTrip();
  const { format } = useCurrency();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelDate, setTravelDate] = useState("");
  const [added, setAdded] = useState(false);

  const canAdd = name.trim() !== "" && email.trim() !== "";

  const reviews = reviewsForTour(tour.slug);
  const deps = departuresForTour(tour.slug);

  return (
    <>
      <section className={s.hero} style={{ backgroundImage: `linear-gradient(rgba(10,20,18,.15), rgba(8,16,15,.85)), url(${tour.img})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className={s.priceFloat}>
          {tour.price ? (<><span>From</span><b>{format(tour.price)}</b><span>/ person</span></>) : <b>Price on request</b>}
        </div>
        <div className={s.heroInner}>
          <CollectionBadges collections={tour.collections} className={s.heroBadges} />
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Safari &mdash; Tanzania</span>
          <h1 className={s.heroTitle}>{tour.title}</h1>
          <div className={s.heroRating}>
            <Stars n={tour.rating.score} className={s.heroStars} hidden />
            <span>{tour.rating.score.toFixed(1)} &middot; {tour.rating.count} reviews</span>
          </div>
          <div className={s.tagRow}>{(tour.tags ?? []).map((t) => <span className={s.tag} key={t}>{t}</span>)}</div>
          <div className={s.factsRow}>
            <span>&#128337; {tour.days} {tour.days === 1 ? "Day" : "Days"}</span>
            <span>&#128197; Best: {tour.bestTime}</span>
            <span>&#128205; {tour.style}</span>
          </div>
          {deps.length > 0 && (
            <Link href="/calendar" className={s.depNotice}>
              &#9992; {deps.length === 1 ? "1 fixed departure open" : `${deps.length} fixed departures open`} &middot; from {new Date(deps[0].date + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })} &rarr;
            </Link>
          )}
        </div>
      </section>

      <nav className={s.tabs}>
        <div className={s.tabsInner}>
          {TABS.map((t) => (
            <button key={t} type="button" className={`${s.tab} ${tab === t ? s.active : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </nav>

      <div className="wrap">
        <div className={s.body}>
          <div className={s.main}>
           <AnimatePresence mode="wait">
            {tab === "Overview" && (
              <motion.div key="Overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                <p className="lede" style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--tanova-text)", marginBottom: 28 }}>{tour.summary}</p>

                <h2>Photos from this Safari</h2>
                <div className={s.photoGrid}>
                  {tour.gallery.map((src, i) => (
                    <button type="button" key={src} className={s.photoItem} onClick={() => setLightboxIndex(i)}>
                      <Image src={src} alt={`${tour.title} — photo ${i + 1}`} fill sizes="(max-width: 900px) 50vw, 25vw" />
                    </button>
                  ))}
                </div>

                {tour.guide && (
                  <div className={s.guideCard}>
                    <span className={s.guideAvatar}>{tour.guide.initials}</span>
                    <div className={s.guideBody}>
                      <span className={s.guideEyebrow}>Your local guide for this safari</span>
                      <h3>{tour.guide.name} &middot; {tour.guide.role}</h3>
                      <div className={s.guideMeta}>
                        <Stars n={tour.guide.rating} className={s.heroStars} hidden />
                        <span>{tour.guide.rating.toFixed(1)} ({tour.guide.reviews} reviews)</span>
                        <span className={s.guideLang}>Speaks {tour.guide.languages.join(", ")}</span>
                      </div>
                      <p>{tour.guide.bio}</p>
                    </div>
                  </div>
                )}

                <div className={s.checkGrid}>
                  <div className={s.checkCol}>
                    <h4>What&rsquo;s Included</h4>
                    <ul>{tour.included.map((i) => <li key={i}><span className={s.checkYes}>&#10003;</span>{i}</li>)}</ul>
                  </div>
                  <div className={s.checkCol}>
                    <h4>Not Included</h4>
                    <ul>{tour.excluded.map((i) => <li key={i}><span className={s.checkNo}>&times;</span>{i}</li>)}</ul>
                  </div>
                </div>
                <h2>What to Expect</h2>
                <div className={s.infoGrid}>
                  <div className={s.infoCard}><h4>Highlights</h4><ul>{tour.whatToExpect.map((w) => <li key={w}>{w}</li>)}</ul></div>
                  <div className={s.infoCard}><h4>Best Time to Go</h4><ul><li>{tour.bestTime}</li><li>Ideal duration: {tour.days} {tour.days === 1 ? "day" : "days"}</li></ul></div>
                  <div className={s.infoCard}><h4>Activities</h4><ul>{tour.activities.map((a) => <li key={a}>{a}</li>)}</ul></div>
                </div>

                <h2>Traveler Reviews</h2>
                <ReviewList reviews={reviews} />
              </motion.div>
            )}

            {tab === "Itinerary" && (
              <motion.div key="Itinerary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                <h2>Your Itinerary</h2>
                <div className={s.timeline}>
                  {tour.itinerary.map((d, i) => (
                    <div className={s.day} key={d.title}>
                      <div className={s.dayDot}>{i + 1}</div>
                      <div><h3>{d.title}</h3><p>{d.desc}</p></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "Included" && (
              <motion.div key="Included" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                <h2>What&rsquo;s Included</h2>
                <div className={s.checkGrid}>
                  <div className={s.checkCol}>
                    <h4>Included</h4>
                    <ul>{tour.included.map((i) => <li key={i}><span className={s.checkYes}>&#10003;</span>{i}</li>)}</ul>
                  </div>
                  <div className={s.checkCol}>
                    <h4>Not Included</h4>
                    <ul>{tour.excluded.map((i) => <li key={i}><span className={s.checkNo}>&times;</span>{i}</li>)}</ul>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "FAQ" && (
              <motion.div key="FAQ" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                <h2>Frequently Asked</h2>
                {tour.faqs.map((f, i) => (
                  <div className={s.faq} key={f.q}>
                    <button type="button" className={s.faqBtn} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      {f.q}
                      <motion.span className={s.faqIcon} animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>+</motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className={s.faqA}>{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
           </AnimatePresence>
          </div>

          <aside className={s.aside}>
            {added ? (
              <div className={s.book}>
                <div className={s.sentIcon}>&#10003;</div>
                <h3 style={{ textAlign: "center", fontSize: 17 }}>Added to your trip</h3>
                <p className={s.note}>{tour.title} is now in your trip cart. Add another safari or stay, or review your trip when you&rsquo;re ready.</p>
                <Link href="/cart" className="btn btn--dark" style={{ width: "100%", justifyContent: "center" }}>View your trip &rarr;</Link>
                <button type="button" className="btn btn--outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setAdded(false)}>Adjust details</button>
              </div>
            ) : (
              <form
                className={s.book}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!canAdd) return;
                  if (tour.price) {
                    addItem({
                      kind: "tour",
                      slug: tour.slug,
                      title: tour.title,
                      img: tour.img,
                      unitLabel: "Travelers",
                      unitPrice: tour.price,
                      qty: Math.max(1, adults + children),
                      meta: `${tour.days} ${tour.days === 1 ? "day" : "days"}${travelDate ? ` · ${travelDate}` : ""}`,
                    });
                  }
                  setAdded(true);
                }}
              >
                <div>
                  <div className={s.bookPrice}>{tour.price ? format(tour.price) : "Price on request"}</div>
                  <span style={{ fontSize: 11, color: "var(--tanova-muted)", textTransform: "uppercase" }}>{tour.price ? "per person" : "we'll confirm pricing with you"}</span>
                </div>
                <label className={s.field}>Full name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
                <label className={s.field}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <div className={s.row2}>
                  <label className={s.field}>Adults
                    <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                  <label className={s.field}>Children
                    <select value={children} onChange={(e) => setChildren(Number(e.target.value))}>
                      {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                </div>
                <label className={s.field}>When would you like to travel?<input type="text" placeholder="e.g. July 2027" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} /></label>
                <label className={s.field}>Tell us more<textarea rows={3} /></label>
                <button type="submit" className="btn btn--primary" disabled={!canAdd} style={{ width: "100%", justifyContent: "center" }}>Add to Trip &rarr;</button>
                <a href="https://wa.me/255000000000" target="_blank" rel="noreferrer" className="btn btn--dark" style={{ width: "100%", justifyContent: "center", background: "#25d366" }}>WhatsApp</a>
                <p className={s.note}>Local, family-run experts since 1983 &middot; Free personalisation, no hidden fees &middot; Flexible dates, private departure.</p>
              </form>
            )}
          </aside>
        </div>
      </div>

      <section className={s.related}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Continue exploring</span>
          <h2>You May Also Like</h2>
          <div className={s.relatedGrid}>
            {relatedFallback.map((t) => (
              <Link href={`/safaris/${t.slug}`} className={s.relatedCard} key={t.slug} style={{ backgroundImage: `url(${t.img})` }}>
                <span className={s.relatedTitle}>{t.title}</span>
                <span className={s.relatedLink}>View Tour &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox images={tour.gallery} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={setLightboxIndex} />
      )}
    </>
  );
}
