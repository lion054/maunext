"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Tour } from "@/lib/tours";
import { excerpt } from "@/lib/destinations";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import s from "./page.module.css";

const MAX_COMPARE = 3;

const COLLECTIONS = [
  { id: "all", label: "All Collections" },
  { id: "sublime", label: "Sublime Collection" },
  { id: "halal", label: "Halal Approved" },
] as const;
const PRODUCT_TYPES = [
  { id: "all", label: "All Types" },
  { id: "day_trip", label: "Day Trips" },
  { id: "package", label: "Packages" },
  { id: "multi_day_tour", label: "Multi-Day Tours" },
] as const;
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "duration", label: "Shortest First" },
] as const;
// No sort-by-rating option: the live catalogue has no review-score data yet, so every
// tour would tie at 0 — a dead sort is worse than no sort. Re-add once real ratings exist.

const PAGE_SIZE = 15;

const COLLECTION_TAG = { sublime: "Sublime Collection", halal: "Halal Approved", cultural: "Cultural", beach: "Beach" } as const;
const TYPE_LABEL = { day_trip: "Day trip", package: "Package", multi_day_tour: "Multi-day tour", activity: "Activity" } as const;

/** A floating dropdown card: an accent label over a native <select> (keeps keyboard and
 *  screen-reader behaviour for free), restyled to sit in the filter row. */
function Drop({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className={s.kDrop}>
      <span className={s.kDropLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export default function SafarisBrowser({ tours, destinations }: { tours: Tour[]; destinations: { id: number; slug: string; title: string }[] }) {
  const params = useSearchParams();
  const { format } = useCurrency();
  const styles = useMemo(() => ["All Styles", ...Array.from(new Set(tours.map((t) => t.style)))], [tours]);
  // Only destinations that have live tours, with counts — the tour's own address is free text
  // (dozens of unique values), so it makes a poor filter.
  const destOptions = useMemo(() => {
    const count = new Map<number, number>();
    tours.forEach((t) => t.locationId != null && count.set(t.locationId, (count.get(t.locationId) ?? 0) + 1));
    return destinations.filter((d) => count.has(d.id)).map((d) => ({ value: d.slug, label: `${d.title} (${count.get(d.id)})` }));
  }, [tours, destinations]);
  const destById = useMemo(() => new Map(destinations.map((d) => [d.id, d])), [destinations]);

  const [region, setRegion] = useState(params.get("destination") ?? "all");
  const [style, setStyle] = useState(params.get("style") ?? "All Styles");
  const [collection, setCollection] = useState<(typeof COLLECTIONS)[number]["id"]>(
    (params.get("collection") as (typeof COLLECTIONS)[number]["id"]) ?? "all"
  );
  const [productType, setProductType] = useState<(typeof PRODUCT_TYPES)[number]["id"]>(
    (params.get("type") as (typeof PRODUCT_TYPES)[number]["id"]) ?? "all"
  );
  const [maxDays, setMaxDays] = useState(Number(params.get("days")) || 0);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const compareModalRef = useRef<HTMLDivElement>(null);

  function toggleCompare(slug: string) {
    setCompareSlugs((cur) => {
      if (cur.includes(slug)) return cur.filter((s) => s !== slug);
      if (cur.length >= MAX_COMPARE) return cur;
      return [...cur, slug];
    });
  }

  const compareTours = useMemo(
    () => compareSlugs.map((slug) => tours.find((t) => t.slug === slug)).filter((t): t is Tour => !!t),
    [compareSlugs, tours]
  );

  useEffect(() => {
    if (!compareOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCompareOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (compareModalRef.current && !compareModalRef.current.contains(e.target as Node)) setCompareOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [compareOpen]);

  const filtered = useMemo(() => {
    let list = tours.filter((t) =>
      (region === "all" || (t.locationId != null && destById.get(t.locationId)?.slug === region)) &&
      (style === "All Styles" || t.style === style) &&
      (maxDays === 0 || t.days <= maxDays) &&
      (collection === "all" || t.collections?.includes(collection)) &&
      (productType === "all" || t.productType === productType)
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "duration") list = [...list].sort((a, b) => a.days - b.days);
    return list;
  }, [tours, region, style, collection, productType, maxDays, sort, destById]);

  // Reset pagination when the filters change. Adjusted during render (React's documented
  // alternative to an effect for "reset state when a dependency changes") rather than in a
  // useEffect, which would cost an extra render+commit cycle for the same result.
  const filterKey = `${region}|${style}|${collection}|${productType}|${maxDays}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisible(PAGE_SIZE);
  }

  const shown = filtered.slice(0, visible);

  return (
    <>
      <div className={s.kFilters}>
        <div className={s.kGroup}>
          <Drop label="Destination" value={region} onChange={setRegion} options={[{ value: "all", label: "All destinations" }, ...destOptions]} />
          <Drop label="Style" value={style} onChange={setStyle} options={styles.map((r) => ({ value: r, label: r }))} />
          <Drop label="Type" value={productType} onChange={(v) => setProductType(v as typeof productType)} options={PRODUCT_TYPES.map((c) => ({ value: c.id, label: c.label }))} />
          <Drop label="Collection" value={collection} onChange={(v) => setCollection(v as typeof collection)} options={COLLECTIONS.map((c) => ({ value: c.id, label: c.label }))} />
          <Drop label="Length" value={String(maxDays)} onChange={(v) => setMaxDays(Number(v))} options={[
            { value: "0", label: "Any length" }, { value: "2", label: "Up to 2 days" }, { value: "5", label: "Up to 5 days" }, { value: "9", label: "Up to 9 days" },
          ]} />
        </div>
        <Drop label="Sort by" value={sort} onChange={(v) => setSort(v as typeof sort)} options={SORTS.map((r) => ({ value: r.id, label: r.label }))} />
      </div>

      <div className={s.resultRow}>
        <p className={s.resultCount} aria-live="polite">{filtered.length} {filtered.length === 1 ? "journey" : "journeys"} found</p>
        {(region !== "all" || style !== "All Styles" || collection !== "all" || productType !== "all" || maxDays !== 0) && (
          <button type="button" className={s.filterClear} onClick={() => { setRegion("all"); setStyle("All Styles"); setCollection("all"); setProductType("all"); setMaxDays(0); }}>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className={s.noResults}>No itineraries match those filters yet — try widening your search, or <Link href="/contact">tell us what you have in mind</Link>.</p>
      ) : (
        <>
          <div className={s.kGrid} key={`${region}|${style}|${collection}|${productType}|${maxDays}|${sort}`}>
            {shown.map((t) => {
              const tag = t.collections?.[0] ? COLLECTION_TAG[t.collections[0]] : undefined;
              const inCompare = compareSlugs.includes(t.slug);
              return (
                <article className={s.kCard} key={t.slug}>
                  <div className={s.kImg} style={{ backgroundImage: `url(${t.img})` }}>
                    <button
                      type="button"
                      className={`${s.compareToggle} ${inCompare ? s.compareToggleActive : ""}`}
                      onClick={() => toggleCompare(t.slug)}
                      aria-pressed={inCompare}
                      aria-label={inCompare ? `Remove ${t.title} from comparison` : `Add ${t.title} to comparison`}
                      disabled={!inCompare && compareSlugs.length >= MAX_COMPARE}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                      Compare
                    </button>
                  </div>
                  <div className={s.kText}>
                    {tag && <span className={s.kTag}>{tag}</span>}
                    <h3 className={s.kTitle}><Link href={`/safaris/${t.slug}`}>{t.title}</Link></h3>
                    <p className={s.kSummary}>{excerpt(t.summary, 120)}</p>
                    <ul className={s.kMeta}>
                      <li><strong>Trip type</strong> {t.productType ? TYPE_LABEL[t.productType] : t.style}</li>
                      <li><strong>Duration</strong> {t.days} {t.days === 1 ? "day" : "days"}</li>
                      <li><strong>Location</strong> {(t.locationId != null && destById.get(t.locationId)?.title) || t.region}</li>
                    </ul>
                    <div className={s.kFoot}>
                      <Link href={`/safaris/${t.slug}`} className={s.kExplore}>Explore this trip</Link>
                      <div className={s.kPrice}>{t.price ? <>From <strong>{format(t.price)}</strong></> : <strong>On request</strong>}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {visible < filtered.length && (
            <div className={s.loadMoreRow}>
              <button type="button" className="btn btn--outline" style={{ color: "var(--tanova-primary)", borderColor: "var(--tanova-primary)" }} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
              </button>
              <span className={s.loadMoreCount}>{visible} of {filtered.length} shown</span>
            </div>
          )}
        </>
      )}

      {compareSlugs.length > 0 && (
        <div className={s.compareBar}>
          <div className={s.compareBarInner}>
            <div className={s.compareBarThumbs}>
              {compareTours.map((t) => (
                <div className={s.compareThumb} key={t.slug} style={{ backgroundImage: `url(${t.img})` }} title={t.title} />
              ))}
              <span className={s.compareBarLabel}>{compareSlugs.length} of {MAX_COMPARE} selected</span>
            </div>
            <div className={s.compareBarActions}>
              <button type="button" className={s.compareClear} onClick={() => setCompareSlugs([])}>Clear</button>
              <button type="button" className="btn btn--dark" disabled={compareSlugs.length < 2} onClick={() => setCompareOpen(true)}>
                Compare {compareSlugs.length > 1 ? `${compareSlugs.length} Tours` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && compareTours.length > 1 && (
        <div className={s.compareModalOverlay}>
          <div className={s.compareModal} ref={compareModalRef} role="dialog" aria-label="Compare tours">
            <button type="button" className={s.compareClose} onClick={() => setCompareOpen(false)} aria-label="Close comparison">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
            <div className={s.compareScroll}>
              <table className={s.compareTable}>
                <thead>
                  <tr>
                    <th />
                    {compareTours.map((t) => (
                      <th key={t.slug}>
                        <div className={s.compareImg} style={{ backgroundImage: `url(${t.img})` }} />
                        <b>{t.title}</b>
                        <button type="button" className={s.compareRemove} onClick={() => toggleCompare(t.slug)}>Remove</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    {compareTours.map((t) => <td key={t.slug}>{t.price ? `from ${format(t.price)}` : "On request"}</td>)}
                  </tr>
                  <tr>
                    <td>Duration</td>
                    {compareTours.map((t) => <td key={t.slug}>{t.days} {t.days === 1 ? "day" : "days"}</td>)}
                  </tr>
                  <tr>
                    <td>Style</td>
                    {compareTours.map((t) => <td key={t.slug}>{t.style}</td>)}
                  </tr>
                  <tr>
                    <td>Region</td>
                    {compareTours.map((t) => <td key={t.slug}>{t.region}</td>)}
                  </tr>
                  <tr>
                    <td>Rating</td>
                    {compareTours.map((t) => <td key={t.slug}>{t.rating.score > 0 ? `${t.rating.score} (${t.rating.count})` : "Not yet rated"}</td>)}
                  </tr>
                  <tr>
                    <td>What&rsquo;s included</td>
                    {compareTours.map((t) => (
                      <td key={t.slug}>
                        <ul className={s.compareIncluded}>
                          {t.included.slice(0, 4).map((i) => <li key={i}>{i}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td />
                    {compareTours.map((t) => (
                      <td key={t.slug}>
                        <Link href={`/safaris/${t.slug}`} className="btn btn--dark" style={{ width: "100%", justifyContent: "center" }}>View tour &rarr;</Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
