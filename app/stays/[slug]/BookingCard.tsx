"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lodge } from "@/components/LodgeCard";
import { useTrip } from "@/lib/trip/TripProvider";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import DateRangePicker from "@/components/DateRangePicker";
import Stepper from "@/components/Stepper";
import s from "./page.module.css";

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = Math.round((outDate.getTime() - inDate.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

export default function BookingCard({ stay, availLabel, availClass }: { stay: Lodge; availLabel: string; availClass: string }) {
  const [roomIdx, setRoomIdx] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const { addItem } = useTrip();
  const { format } = useCurrency();

  const hasRooms = !!stay.rooms && stay.rooms.length > 0;
  const room = hasRooms ? stay.rooms![roomIdx] : null;
  const nights = nightsBetween(checkIn, checkOut);
  const total = room ? (nights > 0 ? nights * room.price : room.price) : 0;
  const min = hasRooms ? Math.min(...stay.rooms!.map((r) => r.price)) : null;
  const dateError = checkIn && checkOut && nights <= 0;
  const canSubmit = name.trim() !== "" && email.trim() !== "" && checkIn && checkOut && !dateError;

  const nightsLabel = useMemo(() => (nights > 0 ? `${nights} night${nights === 1 ? "" : "s"}` : "per night"), [nights]);
  const handleDates = (inDate: string, outDate: string) => { setCheckIn(inDate); setCheckOut(outDate); };

  // No confirmed room pricing from the source system for this property — a simpler
  // enquiry-only path instead of a priced date picker with numbers we don't actually have.
  if (!hasRooms) {
    if (status === "sent") {
      return (
        <div className={s.book}>
          <div className={s.sentIcon}>&#10003;</div>
          <h3 className={s.sentTitle}>Enquiry sent</h3>
          <p className={s.note}>
            We&rsquo;ve noted your interest in {stay.title}. This is a prototype — no email
            was actually sent — but on the live site our team replies within 24 hours with
            room options and pricing for your dates.
          </p>
          <Link href="/cart" className="btn btn--dark" style={{ width: "100%", justifyContent: "center" }}>View your trip &rarr;</Link>
          <button type="button" className="btn btn--outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setStatus("idle")}>
            Start another enquiry
          </button>
        </div>
      );
    }
    return (
      <form
        className={s.book}
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          setStatus("sent");
        }}
      >
        <div className={s.bookHead}>
          <span className={s.bookPrice} style={{ fontSize: 15 }}>Price on request</span>
          <span className={`badge ${availClass}`}>{availLabel}</span>
        </div>
        <label className={s.field}>Dates
          <DateRangePicker startValue={checkIn} endValue={checkOut} onChange={handleDates} placeholder="Add dates" />
        </label>
        {dateError && <p className={s.error}>Check-out must be after check-in.</p>}
        <label className={s.field}>Guests
          <Stepper value={guests} onChange={setGuests} min={1} max={16} />
        </label>
        <label className={s.field}>Your name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className={s.field}>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button className="btn btn--dark" type="submit" disabled={!canSubmit} style={{ width: "100%", justifyContent: "center" }}>
          Request rates &rarr;
        </button>
        <p className={s.note}>We&rsquo;ll confirm room options and pricing with the property directly for your dates.</p>
      </form>
    );
  }

  // hasRooms is true from here on (the false case already returned above), so this is safe.
  const confirmedRoom = stay.rooms![roomIdx];

  if (status === "sent") {
    return (
      <div className={s.book}>
        <div className={s.sentIcon}>&#10003;</div>
        <h3 className={s.sentTitle}>Enquiry sent</h3>
        <p className={s.note}>
          We&rsquo;ve noted your interest in <b>{confirmedRoom.name}</b> at {stay.title}
          {nights > 0 ? ` for ${nightsLabel}` : ""}. This is a prototype — no email
          was actually sent — but on the live site our team replies within 24 hours
          to confirm availability with the lodge before any payment is taken.
        </p>
        <Link href="/cart" className="btn btn--dark" style={{ width: "100%", justifyContent: "center" }}>View your trip &rarr;</Link>
        <button type="button" className="btn btn--outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setStatus("idle")}>
          Start another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      className={s.book}
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        addItem({
          kind: "stay",
          slug: stay.slug,
          title: stay.title,
          img: stay.image,
          unitLabel: nightsLabel,
          unitPrice: confirmedRoom.price,
          qty: nights > 0 ? nights : 1,
          meta: `${confirmedRoom.name} · ${guests} guest${guests === 1 ? "" : "s"}${checkIn ? ` · from ${checkIn}` : ""}`,
        });
        setStatus("sent");
      }}
    >
      <div className={s.bookHead}>
        <span className={s.bookPrice}><em>from</em>{format(min ?? 0)}<span style={{ fontSize: 12, fontWeight: 600, color: "var(--tanova-muted)" }}>/night</span></span>
        <span className={`badge ${availClass}`}>{availLabel}</span>
      </div>

      <label className={s.field}>Room
        <select value={roomIdx} onChange={(e) => setRoomIdx(Number(e.target.value))}>
          {stay.rooms!.map((r, i) => <option key={r.name} value={i}>{r.name} — {format(r.price)}/night</option>)}
        </select>
      </label>

      <label className={s.field}>Dates
        <DateRangePicker startValue={checkIn} endValue={checkOut} onChange={handleDates} placeholder="Add dates" />
      </label>
      {dateError && <p className={s.error}>Check-out must be after check-in.</p>}

      <label className={s.field}>Guests
        <Stepper value={guests} onChange={setGuests} min={1} max={confirmedRoom.guests} />
      </label>

      <label className={s.field}>Your name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className={s.field}>Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      {nights > 0 && (
        <div className={s.totalRow}>
          <span>{format(confirmedRoom.price)} &times; {nightsLabel}</span>
          <b>{format(total)}</b>
        </div>
      )}

      <button className="btn btn--dark" type="submit" disabled={!canSubmit} style={{ width: "100%", justifyContent: "center" }}>
        Add to Trip
      </button>
      <p className={s.note}>Your card is held, not charged. We confirm the room with the lodge, then charge only if it&rsquo;s available.</p>
    </form>
  );
}
