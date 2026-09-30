"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Tour } from "@/lib/tours";
import type { Departure } from "@/lib/departures";
import { useTrip } from "@/lib/trip/TripProvider";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import DatePicker from "@/components/DatePicker";
import Stepper from "@/components/Stepper";
import s from "./page.module.css";

const WHATSAPP = "255784884018";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRIVATE = "private";

const fmtDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TourBookingCard({ tour, deps }: { tour: Tour; deps: Departure[] }) {
  const uid = useId();
  const { addItem } = useTrip();
  const { format } = useCurrency();

  const bookable = deps.filter((d) => d.status !== "full" && d.status !== "closed");
  const [choice, setChoice] = useState<string>(bookable.length ? bookable[0].date : PRIVATE);
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, date: false });
  const [added, setAdded] = useState(false);

  const departure = bookable.find((d) => d.date === choice);
  const unit = departure?.price || tour.price || 0;
  const guests = adults + children;
  const total = unit * guests;
  const travelDate = departure ? departure.date : date;
  const seatsLeft = departure?.seatsLeft;
  const overSeats = seatsLeft !== undefined && guests > seatsLeft;

  const errors = {
    name: name.trim() ? "" : "Please tell us your name",
    email: EMAIL_RE.test(email.trim()) ? "" : "Enter a valid email address",
    date: travelDate ? "" : "Pick a date, or ask us for suggestions",
  };
  const valid = !errors.name && !errors.email && !errors.date && !overSeats;
  const show = (k: keyof typeof errors) => touched[k] && errors[k];

  const waText = encodeURIComponent(`Hi Mauly Tours, I'm interested in "${tour.title}" for ${adults} adult${adults === 1 ? "" : "s"}${children ? ` and ${children} child${children === 1 ? "" : "ren"}` : ""}${travelDate ? ` around ${fmtDate(travelDate)}` : ""}. Could you help?`);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, date: true });
    if (!valid) return;
    if (unit) {
      addItem({
        kind: "tour",
        slug: tour.slug,
        title: tour.title,
        img: tour.img,
        unitLabel: "Travelers",
        unitPrice: unit,
        qty: Math.max(1, guests),
        date: travelDate || undefined,
        meta: [`${tour.days} ${tour.days === 1 ? "day" : "days"}`, travelDate && fmtDate(travelDate), departure ? "Group departure" : "Private departure", note.trim()].filter(Boolean).join(" · "),
      });
    }
    setAdded(true);
  };

  if (added) {
    return (
      <div className={s.book} role="status">
        <div className={s.sentIcon}>&#10003;</div>
        <h3 style={{ textAlign: "center", fontSize: 17 }}>Added to your trip</h3>
        <p className={s.note}>{tour.title} is now in your trip cart. Add another safari or stay, or review your trip when you&rsquo;re ready.</p>
        <Link href="/cart" className="btn btn--dark" style={{ width: "100%", justifyContent: "center" }}>View your trip &rarr;</Link>
        <button type="button" className="btn btn--outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setAdded(false)}>Adjust details</button>
      </div>
    );
  }

  return (
    <>
      <form id="book" className={s.book} onSubmit={submit} noValidate>
        <div className={s.bookHead}>
          <div className={s.bookPrice}>{unit ? format(unit) : "Price on request"}</div>
          <span className={s.bookUnit}>{unit ? "per person" : "we'll confirm pricing with you"}</span>
        </div>

        <fieldset className={s.fieldset}>
          <legend className={s.legend}>1 &middot; When</legend>
          {bookable.length > 0 ? (
            <div className={s.depList} role="radiogroup" aria-label="Choose a departure">
              {bookable.map((d) => (
                <label key={d.date} className={`${s.dep} ${choice === d.date ? s.depOn : ""}`}>
                  <input type="radio" name={`${uid}-dep`} checked={choice === d.date} onChange={() => setChoice(d.date)} />
                  <span className={s.depDate}>{fmtDate(d.date)}</span>
                  <span className={`${s.depSeats} ${d.status === "filling" ? s.depFilling : ""}`}>{d.seatsLeft} {d.seatsLeft === 1 ? "seat" : "seats"} left</span>
                </label>
              ))}
              <label className={`${s.dep} ${choice === PRIVATE ? s.depOn : ""}`}>
                <input type="radio" name={`${uid}-dep`} checked={choice === PRIVATE} onChange={() => setChoice(PRIVATE)} />
                <span className={s.depDate}>Private departure</span>
                <span className={s.depSeats}>your own dates</span>
              </label>
            </div>
          ) : null}
          {!departure && (
            <div className={s.field}>
              <span id={`${uid}-d`}>Preferred start date</span>
              <DatePicker id={`${uid}-date`} value={date} onChange={(v) => { setDate(v); setTouched((t) => ({ ...t, date: true })); }} min={todayISO()} placeholder="Select a date" />
              {show("date") && <em className={s.err} role="alert">{errors.date}</em>}
            </div>
          )}
        </fieldset>

        <fieldset className={s.fieldset}>
          <legend className={s.legend}>2 &middot; Who</legend>
          <div className={s.row2}>
            <div className={s.field}>
              <span>Adults</span>
              <Stepper value={adults} onChange={setAdults} min={1} max={12} />
            </div>
            <div className={s.field}>
              <span>Children</span>
              <Stepper value={children} onChange={setChildren} min={0} max={8} />
            </div>
          </div>
          {overSeats && <em className={s.err} role="alert">Only {seatsLeft} {seatsLeft === 1 ? "seat" : "seats"} left on this departure &mdash; reduce the party or choose a private departure.</em>}
        </fieldset>

        <fieldset className={s.fieldset}>
          <legend className={s.legend}>3 &middot; You</legend>
          <label className={s.field}>Full name
            <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} aria-invalid={!!show("name")} aria-describedby={show("name") ? `${uid}-ne` : undefined} />
            {show("name") && <em className={s.err} id={`${uid}-ne`} role="alert">{errors.name}</em>}
          </label>
          <label className={s.field}>Email
            <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} aria-invalid={!!show("email")} aria-describedby={show("email") ? `${uid}-ee` : undefined} />
            {show("email") && <em className={s.err} id={`${uid}-ee`} role="alert">{errors.email}</em>}
          </label>
          <label className={s.field}>Anything we should know? <span className={s.opt}>(optional)</span>
            <textarea rows={2} value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Dietary needs, celebrations, must-see wildlife…" />
          </label>
        </fieldset>

        {unit > 0 && (
          <div className={s.totalRow} aria-live="polite">
            <span>{guests} {guests === 1 ? "traveler" : "travelers"} &times; {format(unit)}</span>
            <b>{format(total)}</b>
          </div>
        )}

        <button type="submit" className={`btn btn--primary ${s.cta}`}>Add to Trip &rarr;</button>
        <a href={`https://wa.me/${WHATSAPP}?text=${waText}`} target="_blank" rel="noreferrer" className={`btn btn--outline ${s.wa}`}>Ask a specialist on WhatsApp</a>
        <p className={s.reassure}><b>No payment now.</b> A specialist replies within 24 hours with a tailored quote &mdash; free personalisation, no hidden fees.</p>
      </form>

      <div className={`${s.stickyBar} sticky-cta`}>
        <div>
          <b>{unit ? `${format(total)}` : "Price on request"}</b>
          <span>{unit ? `${guests} ${guests === 1 ? "traveler" : "travelers"}` : "quote on request"}</span>
        </div>
        <a href="#book" className="btn btn--primary">Book this trip</a>
      </div>
    </>
  );
}
