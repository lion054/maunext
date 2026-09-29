"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Tour } from "@/lib/tours";
import CollectionBadges from "@/components/CollectionBadges";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import s from "./page.module.css";

const MAX_COMPARE = 3;

const COLLECTIONS = [
  { id: "all", label: "All Collections" },
  { id: "sublime", label: "Sublime Collection" },
  { id: "halal", label: "Halal Approved" },
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

export default function SafarisBrowser({ tours }: { tours: Tour[] }) {
  const params = useSearchParams();
  const { format } = useCurrency();
  const styles = useMemo(() => ["All Styles", ...Array.from(new Set(tours.map((t) => t.style)))], [tours]);
  const REGIONS = useMemo(() => ["All Regions", ...Array.from(new Set(tours.map((t) => t.region)))], [tours]);

  const [region, setRegion] = useState(params.get("region") ?? "All Regions");
  const [style, setStyle] = useState(params.get("style") ?? "All Styles");
  const [collection, setCollection] = useState<(typeof COLLECTIONS)[number]["id"]>(
    (params.get("collection") as (typeof COLLECTIONS)[number]["id"]) ?? "all"
  );
  const [maxDays, setMaxDays] = useState(0);
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
      (region === "All Regions" || t.region === region) &&
      (style === "All Styles" || t.style === style) &&
      (maxDays === 0 || t.days <= maxDays) &&
      (collection === "all" || t.collections?.includes(collection))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "duration") list = [...list].sort((a, b) => a.days - b.days);
    return list;
  }, [tours, region, style, collection, maxDays, sort]);

  // Reset pagination when the filters change. Adjusted during render (React's documented
  // alternative to an effect for "reset state when a dependency changes") rather than in a
  // useEffect, which would cost an extra render+commit cycle for the same result.
  const filterKey = `${region}|${style}|${collection}|${maxDays}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisible(PAGE_SIZE);
  }

  const shown = filtered.slice(0, visible);

  return (
    <>
      <div className={s.filterBar}>
        <label className={s.filterField}>
          <span>Region</span>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className={s.filterField}>
          <span>Style</span>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {styles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className={s.filterField}>
          <span>Collection</span>
          <select value={collection} onChange={(e) => setCollection(e.target.value as typeof collection)}>
            {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
        <label className={s.filterField}>
          <span>Duration</span>
          <select value={maxDays} onChange={(e) => setMaxDays(Number(e.target.value))}>
            <option value={0}>Any length</option>
            <option value={2}>Up to 2 days</option>
            <option value={5}>Up to 5 days</option>
            <option value={9}>Up to 9 days</option>
          </select>
        </label>
        <label className={s.filterField}>
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            {SORTS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        {(region !== "All Regions" || style !== "All Styles" || collection !== "all" || maxDays !== 0) && (
          <button type="button" className={s.filterClear} onClick={() => { setRegion("All Regions"); setStyle("All Styles"); setCollection("all"); setMaxDays(0); }}>
            Clear filters
          </button>
        )}
      </div>

      <p className={s.resultCount}>{filtered.length} {filtered.length === 1 ? "itinerary" : "itineraries"} found</p>

      {filtered.length === 0 ? (
        <p className={s.noResults}>No itineraries match those filters yet — try widening your search, or <Link href="/contact">tell us what you have in mind</Link>.</p>
      ) : (
        <>
          <div className={s.grid} key={`${region}|${style}|${collection}|${maxDays}|${sort}`}>
            {shown.map((t) => (
              <Link href={`/safaris/${t.slug}`} className={s.card} key={t.slug}>
                <div className={s.img} style={{ backgroundImage: `url(${t.img})` }}>
                  <CollectionBadges collections={t.collections} className={s.cardBadges} />
                  <button
                    type="button"
                    className={`${s.compareToggle} ${compareSlugs.includes(t.slug) ? s.compareToggleActive : ""}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(t.slug); }}
                    aria-pressed={compareSlugs.includes(t.slug)}
                    aria-label={compareSlugs.includes(t.slug) ? `Remove ${t.title} from comparison` : `Add ${t.title} to comparison`}
                    disabled={!compareSlugs.includes(t.slug) && compareSlugs.length >= MAX_COMPARE}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                    Compare
                  </button>
                </div>
                <div className={s.body}>
                  <h3 className={s.title}>{t.title}</h3>
                  <p className={s.desc}>{t.meta} &middot; {t.price ? `from ${format(t.price)}` : "Price on request"}</p>
                  <span className={s.link}>View tour &rarr;</span>
                </div>
              </Link>
            ))}
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
