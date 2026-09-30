"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import { useTrip } from "@/lib/trip/TripProvider";
import DateRangePicker from "@/components/DateRangePicker";
import Stepper from "@/components/Stepper";
import type { Destination } from "@/lib/destinations";
import type { Tour } from "@/lib/tours";
import s from "./page.module.css";

const STEP_LABELS = ["Search", "Your Options", "Review & Book"];

const LOADING_MESSAGES = [
  "Checking real availability…",
  "Matching your dates and budget…",
  "Ranking the closest real packages…",
  "Finalizing your options…",
];

const stepVariants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const TYPES = [
  { id: "classic", icon: "\u{1F41B}", title: "Classic Safari" },
  { id: "luxury", icon: "\u{2728}", title: "Luxury Safari" },
  { id: "family", icon: "\u{1F468}‍\u{1F469}‍\u{1F467}", title: "Family Safari" },
  { id: "honeymoon", icon: "\u{1F495}", title: "Honeymoon" },
  { id: "trekking", icon: "\u{26F0}️", title: "Kilimanjaro Trek" },
  { id: "halal", icon: "\u{1F31F}", title: "Halal Safari" },
  { id: "cultural", icon: "\u{1F3FA}", title: "Cultural Encounter" },
  { id: "beach", icon: "\u{1F3D6}️", title: "Beach Relaxation" },
] as const;

// The famous names go first — everything else ("hidden gems") is real and bookable, just not
// something a first-time visitor would think to search for by name. Order here, not a filter:
// nothing is hidden, the well-known draws just aren't buried among admin place names anymore.
// Every Tanzania tour now lives under one of these three broad regions (see the
// prune_tanzania_destinations_to_three migration) — no tourist arrives already knowing
// Materuni or Lushoto by name, so the picker leads with the regions, not the parks.
const FEATURED_SLUGS = ["northern-tanzania-safari", "southern-tanzania", "coastal"];

const BUDGETS = [
  { id: "budget", label: "Budget", sub: "Comfortable, well-priced", max: 2000 },
  { id: "mid-range", label: "Mid-range", sub: "Our most popular tier", max: 5000 },
  { id: "luxury", label: "Luxury", sub: "Exclusive camps & lodges", max: Infinity },
] as const;

// A trip generated this way shows at least this many options and never more — few enough to
// scan on one screen, many enough that "nothing matched" almost never happens.
const MIN_OPTIONS = 3;
const MAX_OPTIONS = 8;
// The score a real tour needs to count as a genuine candidate at all (see scoreTour below).
const MATCH_THRESHOLD = 5;

type Activity = {
  name: string; description?: string; image?: string; cost: number; time?: string; duration?: number;
};
type Day = { day: number; date: string; title: string; activities: Activity[] };
type ApiPackage = { package: number; itinerary: Day[]; total_cost?: number; price_per_person?: number };
type ApiTripResult = {
  id: number; title: string; destination: string;
  estimated_price?: number; currency?: string;
  itinerary?: ApiPackage[];
};

/** One card in the results grid — either a real, already-published Mauly tour (bookable now)
 *  or a day-by-day itinerary the AI generator proposed (not an existing listing). Real tours
 *  are always tried first; generation only fills in when there aren't enough real matches. */
type TripOption =
  | { kind: "real"; tour: Tour; days: Day[] }
  | { kind: "generated"; title: string; destination: string; days: Day[]; totalCost?: number; pricePerPerson?: number };

function daysBetween(a: string, b: string): number {
  const ms = new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1); // inclusive of both ends, minimum 1 night trip
}

const TYPE_STYLE: Record<string, string> = {
  trekking: "Adrenaline & Adventure",
  classic: "Safari & Wildlife",
  family: "Safari & Wildlife",
  honeymoon: "Safari & Wildlife",
};

// Generic qualifiers that would make every destination "match" every tour if left in — the
// distinctive word is what actually identifies a place (e.g. "Manyara", not "National"/"Park").
const GENERIC_PLACE_WORDS = new Set(["national", "park", "mount", "lake", "the", "island"]);
function coreWords(name: string): string[] {
  return name.toLowerCase().split(/\s+/).filter((w) => w.length >= 4 && !GENERIC_PLACE_WORDS.has(w));
}

/** Scores how well a real, live tour matches what the wizard asked for. Destination and trip
 *  type are the two things worth insisting on; duration and budget just refine the ranking —
 *  a 6-day request should still surface a real 7-day tour rather than fall through to the AI
 *  generator over a one-day difference. Returns null when it's not a real candidate at all. */
function scoreTour(tour: Tour, opts: { placeId: number | null; placeName: string; tripType: string; desiredDays: number; budgetMax: number }): number | null {
  let score = 0;

  if (opts.placeId !== null) {
    // Real Mauly tours carry one location_id (their "starting point"), but plenty of real
    // multi-park itineraries genuinely visit a place without being tagged to it — the tour's
    // own region text usually says so (e.g. "Grand Tanzanian Journey" mentions Ngorongoro in
    // its address even though its location_id is Serengeti). An exact tag is still worth more,
    // but a real mention is still a real candidate, not a non-match — the same idea as
    // LuxSav's own /api/search/multiday, which matches destination text, not a strict id.
    const exact = tour.locationId === opts.placeId;
    const mentioned = !exact && coreWords(opts.placeName).some((w) => tour.region.toLowerCase().includes(w));
    if (exact) score += 4;
    else if (mentioned) score += 2;
    else return null; // neither tagged nor mentioned — don't offer a trip built somewhere else
  }

  if (opts.tripType === "halal") {
    if (!tour.collections?.includes("halal")) return null;
    score += 3;
  } else if (opts.tripType === "luxury") {
    if (tour.collections?.includes("sublime")) score += 3;
    else if (tour.price && tour.price > 4000) score += 1;
  } else if (opts.tripType === "cultural") {
    if (!tour.collections?.includes("cultural")) return null;
    score += 3;
  } else if (opts.tripType === "beach") {
    if (!tour.collections?.includes("beach")) return null;
    score += 3;
  } else {
    const wantStyle = TYPE_STYLE[opts.tripType];
    if (wantStyle) {
      if (tour.style === wantStyle) score += 2;
      else if (opts.tripType === "trekking") return null; // a trek request should never get a game-drive result
    }
  }

  const dayDiff = Math.abs(tour.days - opts.desiredDays);
  if (dayDiff === 0) score += 3;
  else if (dayDiff <= 2) score += 2;
  else if (dayDiff <= 4) score += 1;

  if (tour.price && tour.price <= opts.budgetMax) score += 1;

  // A real, bundled, fixed-departure product is worth a small nudge over an
  // otherwise-equal flexible listing; a genuine day trip is worth one for a
  // one-day request specifically, mirroring how LuxSav's own duration filter works.
  if (tour.productType === "package") score += 1;
  if (opts.desiredDays <= 1 && tour.productType === "day_trip") score += 2;

  return score;
}

/** Real per-day detail doesn't exist for any tour (confirmed against the live API — see
 *  lib/tours.ts) so this never invents what happens on a specific day. Day 1 carries the
 *  tour's actual summary and real inclusions verbatim; a closing day is a generic, always-true
 *  transfer note; everything between is explicitly labelled "continues" rather than guessed at. */
function buildDaysFromTour(tour: Tour, startDate: string): Day[] {
  const start = new Date(startDate + "T00:00:00");
  const days: Day[] = [];
  const n = Math.max(1, tour.days);
  for (let i = 0; i < n; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    if (i === 0) {
      days.push({
        day: 1,
        date,
        title: tour.title,
        activities: [
          { name: tour.summary, cost: 0, image: tour.img },
          ...tour.included.slice(0, 6).map((inc) => ({ name: inc, cost: 0 })),
        ],
      });
    } else if (i === n - 1 && n > 1) {
      days.push({ day: i + 1, date, title: "Departure", activities: [{ name: "Transfer for your onward flight.", cost: 0 }] });
    } else {
      days.push({ day: i + 1, date, title: `${tour.title} — continues`, activities: [{ name: "Part of this package — see the full itinerary for day-by-day detail.", cost: 0 }] });
    }
  }
  return days;
}

export default function PlanWizard({ destinations, tours }: { destinations: Destination[]; tours: Tour[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const halalRequested = params.get("halal") === "1";
  const { format } = useCurrency();
  const { addItem } = useTrip();

  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState<string>(halalRequested ? "halal" : "");
  const [placeId, setPlaceId] = useState<number | null>(null);
  const [destName, setDestName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]["id"]>("mid-range");

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length), 1400);
    return () => clearInterval(id);
  }, [loading]);
  const [options, setOptions] = useState<TripOption[]>([]);
  const [expanded, setExpanded] = useState<number | null>(0);
  // Real tours the visitor has picked to combine into one trip — the actual "edit before
  // booking" step is choosing which of the matched results to keep, not editing day-by-day
  // content that doesn't exist as separately-priced data. Selecting more than one (e.g. a
  // Kilimanjaro trek + a Zanzibar stay) checks out as one multi-item order, same as adding
  // several things to a normal cart.
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSelected(slug: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const selectedTours = useMemo(
    () => options.filter((o): o is Extract<TripOption, { kind: "real" }> => o.kind === "real" && selected.has(o.tour.slug)),
    [options, selected]
  );
  const selectedTotal = selectedTours.reduce((sum, o) => sum + (o.tour.price ?? 0) * guests, 0);

  function bookSelectedTrip() {
    for (const opt of selectedTours) {
      addItem({
        kind: "tour",
        slug: opt.tour.slug,
        title: opt.tour.title,
        img: opt.tour.img,
        unitLabel: "Travelers",
        unitPrice: opt.tour.price ?? 0,
        qty: Math.max(1, guests),
        meta: `${opt.tour.days} ${opt.tour.days === 1 ? "day" : "days"}${startDate ? ` · ${startDate}` : ""}`,
      });
    }
    router.push("/checkout");
  }

  // All of them, shown at once — the three broad regions first, then everything else
  // (Zanzibar, Ngorongoro, Rwanda, Kenya, …) in whatever order the API returns.
  const allPlaces = useMemo(
    () => [...destinations].sort((a, b) => {
      const ai = FEATURED_SLUGS.indexOf(a.slug), bi = FEATURED_SLUGS.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return 0;
    }),
    [destinations]
  );

  const canGenerate = placeId !== null && !!startDate && !!endDate && guests >= 1;

  async function generateTrip() {
    setLoading(true);
    setLoadingMsg(0);
    setNote(null);
    setSelected(new Set());
    setExpanded(0);

    // Calibration: Mauly's 40+ tours are real, priced, already-bookable packages — check for
    // genuine matches before spending on the AI generator (which assembles something novel
    // from scratch and costs real money per call). Every real match close enough to count
    // (up to 8) is shown directly; the AI generator only fills in when fewer than 3 real
    // tours match, so a request is almost never answered with nothing at all.
    const desiredDays = daysBetween(startDate, endDate);
    const budgetMax = BUDGETS.find((b) => b.id === budget)?.max ?? Infinity;
    const scored = tours
      .map((t) => ({ tour: t, score: scoreTour(t, { placeId, placeName: destName, tripType, desiredDays, budgetMax }) }))
      .filter((x): x is { tour: Tour; score: number } => x.score !== null && x.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score);
    // Every candidate here already matches the chosen destination (scoreTour returns null
    // otherwise) — so one that also matches the requested day count exactly is a real
    // "6 days, Northern Circuit"-style request with a real answer. It's promoted to the top
    // rather than merely scoring well, the same way LuxSav's /multiday page shows the real
    // duration it has rather than the closest thing that happened to rank higher.
    const exactIdx = scored.findIndex((x) => x.tour.days === desiredDays);
    if (exactIdx > 0) {
      const [exact] = scored.splice(exactIdx, 1);
      scored.unshift(exact);
    }

    const realOptions: TripOption[] = scored.slice(0, MAX_OPTIONS).map((x) => ({
      kind: "real",
      tour: x.tour,
      days: buildDaysFromTour(x.tour, startDate),
    }));
    // The closest real match is pre-selected so most visitors can go straight to "Review &
    // Book" — everyone else is one click away from swapping it for, or adding to, another.
    const firstReal = realOptions[0];
    if (firstReal?.kind === "real") setSelected(new Set([firstReal.tour.slug]));

    if (realOptions.length >= MIN_OPTIONS) {
      setOptions(realOptions);
      setStep(2);
      setLoading(false);
      return;
    }

    // Fewer than 3 real matches — ask the AI generator to round the set out. Its own
    // response already comes back as several package variants; take enough of those to
    // reach MIN_OPTIONS (or as many as it offered, capped at MAX_OPTIONS total).
    try {
      const res = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destName,
          place_id: placeId,
          start_date: startDate,
          end_date: endDate,
          guests,
          budget,
          trip_type: tripType || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const ai = data.data as ApiTripResult;
        const need = Math.max(MAX_OPTIONS - realOptions.length, 0);
        const generated: TripOption[] = (ai.itinerary ?? []).slice(0, need).map((pkg) => ({
          kind: "generated",
          title: ai.title,
          destination: ai.destination,
          days: pkg.itinerary,
          totalCost: pkg.total_cost,
          pricePerPerson: pkg.price_per_person,
        }));
        setOptions([...realOptions, ...generated]);
        if (realOptions.length + generated.length === 0) {
          setNote("Nothing matched closely enough yet — a specialist can put something together by hand instead.");
        } else if (realOptions.length < MIN_OPTIONS) {
          setNote("A few of these are freshly generated rather than existing packages — details may shift once we confirm availability.");
        }
      } else {
        setOptions(realOptions);
        if (realOptions.length === 0) {
          setNote(data.error || "Nothing matched closely enough yet — a specialist can put something together by hand instead.");
        }
      }
    } catch {
      setOptions(realOptions);
      if (realOptions.length === 0) {
        setNote("Could not reach the trip planner right now — please try again, or contact us directly.");
      }
    } finally {
      setStep(2);
      setLoading(false);
    }
  }

  return (
    <div className={s.wizard}>
      <ol className={s.stepProgress}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const state = n === step ? "active" : n < step ? "done" : "";
          return (
            <li key={label} className={`${s.stepNode} ${s[state] || ""}`}>
              <span className={s.stepDot}>{n < step ? "✓" : n}</span>
              <span className={s.stepLabel}>{label}</span>
            </li>
          );
        })}
      </ol>

      {halalRequested && step === 1 && (
        <div className={s.banner}>
          Planning a halal safari &mdash; every itinerary we suggest will be halal-verified.
        </div>
      )}

      <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div className={s.step} key="step-1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeOut" }}>
        <div className={s.searchHero}>
          <span className={s.searchBadge}>✦ Experience Concierge</span>
          <h1>Plan Your Perfect Trip</h1>
          <p>Pick a place to build around, add your dates and budget, and we&rsquo;ll show real, bookable options first.</p>

          <h2 className={s.subhead}>Where in Tanzania?</h2>
          <div className={s.cards}>
            {allPlaces.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`${s.card} ${placeId === d.id ? s.active : ""}`}
                onClick={() => { setPlaceId(d.id); setDestName(d.title); }}
              >
                <span className={s.cardTitle}>{d.title}</span>
                <span className={s.cardSub}>
                  {d.tagline ? (d.tagline.length > 90 ? d.tagline.slice(0, 87) + "…" : d.tagline) : `${d.activityCount} experience${d.activityCount === 1 ? "" : "s"} here`}
                </span>
              </button>
            ))}
          </div>

          <h2 className={s.subhead}>What kind of journey? <small>(optional)</small></h2>
          <div className={s.packageTabs}>
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${s.packageTab} ${tripType === t.id ? s.active : ""}`}
                onClick={() => setTripType((cur) => (cur === t.id ? "" : t.id))}
              >
                <span aria-hidden="true">{t.icon}</span> {t.title}
              </button>
            ))}
          </div>

          <h2 className={s.subhead}>When, and how many?</h2>
          <div className={s.dateRow}>
            <label className={s.field}>Dates
              <DateRangePicker
                startValue={startDate}
                endValue={endDate}
                onChange={(a, d) => { setStartDate(a); setEndDate(d); }}
                startLabel="Arrival"
                endLabel="Departure"
                placeholder="Add dates"
              />
            </label>
            <label className={s.field}>Guests
              <Stepper value={guests} onChange={setGuests} min={1} max={12} />
            </label>
          </div>

          <h2 className={s.subhead}>Budget tier</h2>
          <div className={s.cards}>
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`${s.card} ${budget === b.id ? s.active : ""}`}
                onClick={() => setBudget(b.id)}
              >
                <span className={s.cardTitle}>{b.label}</span>
                <span className={s.cardSub}>{b.sub}</span>
              </button>
            ))}
          </div>

          <div className={s.actions}>
            <button className="btn btn--primary" type="button" onClick={generateTrip} disabled={!canGenerate || loading}>
              {loading ? "Building your trip…" : "Show My Trip Options →"}
            </button>
          </div>
          {loading && (
            <div className={s.loadingRow}>
              <span className={s.loadingPulse} aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={loadingMsg}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {LOADING_MESSAGES[loadingMsg]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
          <p className={s.aiNote}>
            We check our own real, bookable packages for matches first — 3 to 8 real options when we have them.
            Only if fewer than 3 fit do we generate something new to round out the list, which takes a few extra seconds.
          </p>
        </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div className={s.step} key="step-2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeOut" }}>
          <div className={s.resultsHero}>
            <div>
              <span className={s.resultsEyebrow}>Your Trip</span>
              <h1>{destName || "Your trip"}</h1>
              <p className={s.resultsSubtitle}>{options.length} option{options.length === 1 ? "" : "s"} found</p>
            </div>
            <div className={s.resultsMetaRow}>
              <div className={s.resultsMetaItem}>
                <span className={s.resultsMetaLabel}>Dates</span>
                <span className={s.resultsMetaValue}>{startDate} — {endDate}</span>
              </div>
              <div className={s.resultsMetaDivider} />
              <div className={s.resultsMetaItem}>
                <span className={s.resultsMetaLabel}>Travelers</span>
                <span className={s.resultsMetaValue}>{guests} guest{guests === 1 ? "" : "s"}</span>
              </div>
              <div className={s.resultsMetaDivider} />
              <button type="button" className={s.back} onClick={() => setStep(1)}>&larr; Edit search</button>
            </div>
          </div>
          {note && <p className={s.aiNote}>{note}</p>}

          {options.length === 0 ? (
            <div className={s.actions}>
              <button type="button" className={s.back} onClick={() => setStep(1)}>&larr; Try different dates</button>
              <a href="/contact" className="btn btn--dark">Contact us instead</a>
            </div>
          ) : (
            <div className={s.optionsGrid}>
              {options.map((opt, i) => {
                const isReal = opt.kind === "real";
                const title = isReal ? opt.tour.title : opt.title;
                const price = isReal ? opt.tour.price : opt.pricePerPerson;
                const totalCost = isReal ? (opt.tour.price ? opt.tour.price * guests : undefined) : opt.totalCost;
                const img = isReal ? opt.tour.img : undefined;
                const isOpen = expanded === i;
                const isSelected = isReal && selected.has(opt.tour.slug);
                const tags = isReal
                  ? [opt.tour.productType?.replace(/_/g, " "), opt.tour.style].filter((t): t is string => !!t)
                  : ["AI-proposed"];
                return (
                  <motion.div
                    className={`${s.optionCard} ${isSelected ? s.selected : ""}`}
                    key={isReal ? opt.tour.slug : `${opt.title}-${i}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                  >
                    <div className={s.optionLink}>
                      <div className={`${s.optionPhoto} ${!img ? s.optionPhotoFallback : ""}`} style={img ? { backgroundImage: `url(${img})` } : undefined}>
                        {i === 0 && <span className={s.optionBadge}>Top Pick</span>}
                        {i === 1 && <span className={`${s.optionBadge} ${s.secondary}`}>Also Popular</span>}
                        {isReal && (
                          <button
                            type="button"
                            className={`${s.selectToggle} ${isSelected ? s.on : ""}`}
                            onClick={() => toggleSelected(opt.tour.slug)}
                            aria-pressed={isSelected}
                            aria-label={isSelected ? `Remove ${title} from your trip` : `Add ${title} to your trip`}
                          >
                            {isSelected ? "✓" : "+"}
                          </button>
                        )}
                      </div>

                      <div className={s.optionBody}>
                        <span className={s.optionPackageLabel}>{isReal ? "Real package — book now" : "AI-proposed itinerary"}</span>
                        <h3 className={s.optionTitle}>{title}</h3>
                        <div className={s.optionTags}>
                          {tags.map((t) => <span className={s.optionTag} key={t}>{t}</span>)}
                        </div>
                        <div className={s.optionDetails}>
                          <span className={s.optionDetail}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            {opt.days.length} day{opt.days.length === 1 ? "" : "s"}
                          </span>
                          {isReal && (
                            <span className={s.optionDetail}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                              {opt.tour.included.length || 1} inclusion{opt.tour.included.length === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>
                        <button type="button" className={s.optionExpand} onClick={() => setExpanded(isOpen ? null : i)}>
                          {isOpen ? "Hide day-by-day" : "View day-by-day itinerary"}
                          <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                        </button>
                      </div>

                      <div className={s.optionFooter}>
                        <div>
                          <div className={s.optionPriceLabel}>{isReal ? "From" : "Est. from"}</div>
                          <div className={s.optionPrice}>{price ? format(price) : "—"}</div>
                          <div className={s.optionPriceSuffix}>per person</div>
                        </div>
                        {typeof totalCost === "number" && <span className={s.optionTotal}>Total {format(totalCost)}</span>}
                        {isReal ? (
                          <>
                            <button type="button" className="btn btn--primary" onClick={() => toggleSelected(opt.tour.slug)} disabled={!opt.tour.price}>
                              {isSelected ? "Remove from Trip" : "Add to Trip"}
                            </button>
                            <Link href={`/safaris/${opt.tour.slug}`} className={s.optionListingLink}>View full listing &rarr;</Link>
                          </>
                        ) : (
                          <a href="/contact" className="btn btn--outline">Speak to a Specialist &rarr;</a>
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className={s.optionExpanded}>
                        <div className={s.dayList}>
                          {opt.days.map((day) => (
                            <div className={s.dayCard} key={day.day}>
                              <div className={s.dayHead}>
                                <span className={s.dayNum}>Day {day.day}</span>
                                <span className={s.dayDate}>{day.date}</span>
                              </div>
                              {day.activities.length > 0 ? (
                                day.activities.map((a, ai) => (
                                  <div className={s.activityRow} key={ai}>
                                    {a.image && <Image src={a.image} alt={a.name} width={64} height={64} className={s.activityImg} />}
                                    <div>
                                      <b>{a.name}</b>
                                      {a.description && <p>{a.description}</p>}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className={s.dayEmpty}>Open day &mdash; ideal for rest, or tell us what you&rsquo;d like here.</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className={s.actions}>
            <button type="button" className={s.back} onClick={() => { setStep(1); setOptions([]); setNote(null); setSelected(new Set()); }}>&larr; Start over</button>
          </div>

          {selectedTours.length > 0 && (
            <div className={s.tripBar}>
              <div className={s.tripBarInner}>
                <div className={s.tripBarSummary}>
                  <span className={s.tripBarCount}>{selectedTours.length} trip{selectedTours.length === 1 ? "" : "s"} selected</span>
                  <span className={s.tripBarTotal}>{format(selectedTotal)} total &middot; {guests} guest{guests === 1 ? "" : "s"}</span>
                </div>
                <button type="button" className="btn btn--primary" onClick={() => setStep(3)}>Review My Trip &rarr;</button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {step === 3 && (
        <motion.div className={s.step} key="step-3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeOut" }}>
          <span className="eyebrow">Review &amp; book</span>
          <h1>Your Trip</h1>
          <p className={s.resultsMeta}>
            {selectedTours.length} item{selectedTours.length === 1 ? "" : "s"} &middot; {guests} guest{guests === 1 ? "" : "s"} &middot; {startDate} &rarr; {endDate}
          </p>

          <div className={s.reviewList}>
            {selectedTours.map((opt) => (
              <div className={s.reviewItem} key={opt.tour.slug}>
                <div className={s.reviewItemHead}>
                  <span className={s.reviewItemImg} style={{ backgroundImage: `url(${opt.tour.img})` }} />
                  <span className={s.reviewItemTitle}>{opt.tour.title}</span>
                  <span className={s.reviewItemPrice}>{opt.tour.price ? format(opt.tour.price * guests) : "price on request"}</span>
                  <button type="button" className={s.removeItem} onClick={() => toggleSelected(opt.tour.slug)} aria-label={`Remove ${opt.tour.title}`}>
                    &times;
                  </button>
                </div>
                <div className={s.dayList}>
                  {opt.days.map((day) => (
                    <div className={s.dayCard} key={day.day}>
                      <div className={s.dayHead}>
                        <span className={s.dayNum}>Day {day.day}</span>
                        <span className={s.dayDate}>{day.date}</span>
                      </div>
                      {day.activities.length > 0 ? (
                        day.activities.map((a, ai) => (
                          <div className={s.activityRow} key={ai}>
                            {a.image && <Image src={a.image} alt={a.name} width={64} height={64} className={s.activityImg} />}
                            <div>
                              <b>{a.name}</b>
                              {a.description && <p>{a.description}</p>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={s.dayEmpty}>Open day &mdash; ideal for rest, or tell us what you&rsquo;d like here.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={s.summaryPanel}>
            <div className={s.summaryRow}><span>Trips</span><span>{selectedTours.length}</span></div>
            <div className={s.summaryRow}><span>Guests</span><span>{guests}</span></div>
            <div className={s.summaryRow}><span>Dates</span><span>{startDate} &rarr; {endDate}</span></div>
            <div className={`${s.summaryRow} ${s.total}`}><span>Total</span><span>{format(selectedTotal)}</span></div>
          </div>

          <div className={s.actions}>
            <button type="button" className={s.back} onClick={() => setStep(2)}>&larr; Back to options</button>
            <button type="button" className="btn btn--primary" onClick={bookSelectedTrip} disabled={selectedTours.length === 0}>
              Confirm &amp; Book This Trip &rarr;
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
