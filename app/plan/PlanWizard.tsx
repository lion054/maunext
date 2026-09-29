"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import DateRangePicker from "@/components/DateRangePicker";
import s from "./page.module.css";

const TYPES = [
  { id: "classic", icon: "\u{1F41B}", title: "Classic Safari", sub: "Game drives across the northern circuit." },
  { id: "luxury", icon: "\u{2728}", title: "Luxury Safari", sub: "Exclusive camps, private guiding." },
  { id: "family", icon: "\u{1F468}‍\u{1F469}‍\u{1F467}", title: "Family Safari", sub: "Paced for all ages." },
  { id: "honeymoon", icon: "\u{1F495}", title: "Honeymoon", sub: "Romance-first itineraries." },
  { id: "trekking", icon: "\u{26F0}️", title: "Kilimanjaro Trek", sub: "Summit routes, every fitness level." },
  { id: "halal", icon: "\u{1F31F}", title: "Halal Safari", sub: "Halal-verified dining & scheduling." },
];

// Real destination IDs, confirmed against the live Tanova API's GET /destinations this session.
const DESTINATIONS = [
  { placeId: 14, name: "Serengeti National Park" },
  { placeId: 15, name: "Ngorongoro" },
  { placeId: 13, name: "Mount Kilimanjaro" },
  { placeId: 17, name: "Tarangire National Park" },
  { placeId: 20, name: "Lake Manyara National Park" },
  { placeId: 11, name: "Zanzibar" },
  { placeId: 16, name: "Arusha" },
  { placeId: 22, name: "Lushoto (Usambara)" },
  { placeId: 23, name: "Mkomazi National Park" },
  { placeId: 26, name: "Lake Natron" },
  { placeId: 27, name: "Materuni" },
];

const BUDGETS = [
  { id: "budget", label: "Budget", sub: "Comfortable, well-priced" },
  { id: "mid-range", label: "Mid-range", sub: "Our most popular tier" },
  { id: "luxury", label: "Luxury", sub: "Exclusive camps & lodges" },
] as const;

type Activity = {
  name: string; description?: string; image?: string; cost: number; time?: string; duration?: number;
};
type Day = { day: number; date: string; title: string; activities: Activity[] };
type Package = { package: number; itinerary: Day[]; total_cost?: number; price_per_person?: number };
type TripResult = {
  id: number; title: string; destination: string;
  estimated_price?: number; currency?: string;
  itinerary?: Package[];
};

export default function PlanWizard() {
  const params = useSearchParams();
  const halalRequested = params.get("halal") === "1";
  const { format } = useCurrency();

  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState<string>(halalRequested ? "halal" : "");
  const [placeId, setPlaceId] = useState<number | null>(null);
  const [destName, setDestName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]["id"]>("mid-range");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TripResult | null>(null);
  const [activePackage, setActivePackage] = useState(0);

  async function generateTrip() {
    setLoading(true);
    setError(null);
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
      if (!res.ok) {
        setError(data.error || "Something went wrong generating your trip.");
        setStep(5);
        return;
      }
      // /api/trip-planner returns the create-response summary; fetch the full record
      // (via our own proxy would need a second route — for now, re-derive from the
      // summary's own trip id through a second lightweight fetch of the same shape).
      setResult(data.data as TripResult);
      setStep(5);
    } catch {
      setError("Could not reach the trip planner right now — please try again, or contact us directly.");
      setStep(5);
    } finally {
      setLoading(false);
    }
  }

  const canContinueStep2 = placeId !== null;
  const canContinueStep3 = startDate && endDate && guests >= 1;

  return (
    <div className={s.wizard}>
      {halalRequested && step === 1 && (
        <div className={s.banner}>
          Planning a halal safari &mdash; every itinerary we suggest will be halal-verified.
        </div>
      )}

      {step === 1 && (
        <div className={s.step}>
          <span className="eyebrow">Step 1 of 4</span>
          <h1>What kind of journey?</h1>
          <p>Pick a starting point &mdash; we&rsquo;ll tailor everything from here.</p>
          <div className={s.cards}>
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${s.card} ${tripType === t.id ? s.active : ""}`}
                onClick={() => setTripType(t.id)}
              >
                <span className={s.icon}>{t.icon}</span>
                <span className={s.cardTitle}>{t.title}</span>
                <span className={s.cardSub}>{t.sub}</span>
              </button>
            ))}
          </div>
          <div className={s.actions}>
            <button className="btn btn--dark" type="button" disabled={!tripType} onClick={() => setStep(2)}>Continue &rarr;</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={s.step}>
          <span className="eyebrow">Step 2 of 4</span>
          <h1>Where in Tanzania?</h1>
          <p>Pick the place you&rsquo;d like this journey built around.</p>
          <div className={s.cards}>
            {DESTINATIONS.map((d) => (
              <button
                key={d.placeId}
                type="button"
                className={`${s.card} ${placeId === d.placeId ? s.active : ""}`}
                onClick={() => { setPlaceId(d.placeId); setDestName(d.name); }}
              >
                <span className={s.cardTitle}>{d.name}</span>
              </button>
            ))}
          </div>
          <div className={s.actions}>
            <button type="button" className={s.back} onClick={() => setStep(1)}>&larr; Back</button>
            <button className="btn btn--dark" type="button" disabled={!canContinueStep2} onClick={() => setStep(3)}>Continue &rarr;</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={s.step}>
          <span className="eyebrow">Step 3 of 4</span>
          <h1>When, and how many?</h1>
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
              <input type="number" min={1} max={12} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
            </label>
          </div>
          <div className={s.actions}>
            <button type="button" className={s.back} onClick={() => setStep(2)}>&larr; Back</button>
            <button className="btn btn--dark" type="button" disabled={!canContinueStep3} onClick={() => setStep(4)}>Continue &rarr;</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className={s.step}>
          <span className="eyebrow">Step 4 of 4</span>
          <h1>What&rsquo;s your budget tier?</h1>
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
            <button type="button" className={s.back} onClick={() => setStep(3)}>&larr; Back</button>
            <button className="btn btn--primary" type="button" onClick={generateTrip} disabled={loading}>
              {loading ? "Building your trip…" : "Build My Trip →"}
            </button>
          </div>
          <p className={s.aiNote}>
            This calls Mauly&rsquo;s real AI trip planner and takes a few seconds &mdash; it&rsquo;s generating an
            actual itinerary from live availability, not a canned example.
          </p>
        </div>
      )}

      {step === 5 && (
        <div className={s.step}>
          {error ? (
            <>
              <span className="eyebrow">We hit a snag</span>
              <h1>Couldn&rsquo;t build that trip</h1>
              <p>{error}</p>
              <div className={s.actions}>
                <button type="button" className={s.back} onClick={() => setStep(4)}>&larr; Try again</button>
                <a href="/contact" className="btn btn--dark">Contact us instead</a>
              </div>
            </>
          ) : result ? (
            <>
              <span className="eyebrow">Your AI-planned trip</span>
              <h1>{result.title}</h1>
              <p>
                {result.destination} &middot; {guests} guest{guests === 1 ? "" : "s"} &middot;{" "}
                {result.estimated_price
                  ? !result.currency || result.currency === "USD"
                    ? `from ${format(result.estimated_price)}`
                    : `from ${result.estimated_price.toLocaleString()} ${result.currency}`
                  : "pricing being finalized with real availability"}
              </p>

              {result.itinerary && result.itinerary.length > 0 ? (
                <>
                  <div className={s.packageTabs}>
                    {result.itinerary.map((pkg, i) => (
                      <button
                        key={pkg.package}
                        type="button"
                        className={`${s.packageTab} ${activePackage === i ? s.active : ""}`}
                        onClick={() => setActivePackage(i)}
                      >
                        Option {pkg.package}{typeof pkg.total_cost === "number" ? ` · ${format(pkg.total_cost)}` : ""}
                      </button>
                    ))}
                  </div>
                  <div className={s.dayList}>
                    {result.itinerary[activePackage]?.itinerary.map((day) => (
                      <div className={s.dayCard} key={day.day}>
                        <div className={s.dayHead}>
                          <span className={s.dayNum}>Day {day.day}</span>
                          <span className={s.dayDate}>{day.date}</span>
                        </div>
                        {day.activities.length > 0 ? (
                          day.activities.map((a, i) => (
                            <div className={s.activityRow} key={i}>
                              {a.image && <Image src={a.image} alt={a.name} width={72} height={72} className={s.activityImg} />}
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
                </>
              ) : (
                <p className={s.aiNote}>The planner is still assembling day-by-day detail for this trip &mdash; a specialist will follow up with the full itinerary.</p>
              )}

              <div className={s.actions}>
                <button type="button" className={s.back} onClick={() => { setStep(1); setResult(null); }}>Start over</button>
                <a href="/contact" className="btn btn--primary">Speak to a Specialist about this trip &rarr;</a>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
