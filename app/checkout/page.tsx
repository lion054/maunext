"use client";

import Link from "next/link";
import { useState } from "react";
import { useTrip } from "@/lib/trip/TripProvider";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import DatePicker from "@/components/DatePicker";
import s from "./page.module.css";

type BookingResult = {
  itemId: string;
  title: string;
  ok: boolean;
  bookingCode?: string;
  total?: number;
  checkoutUrl?: string;
  error?: string;
};

export default function CheckoutPage() {
  const { items, total, clear } = useTrip();
  const { format } = useCurrency();
  const [step, setStep] = useState<"details" | "submitting" | "done">("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [results, setResults] = useState<BookingResult[]>([]);
  const canSubmitDetails = firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "" && date !== "";

  if (items.length === 0 && step !== "done") {
    return (
      <div className="wrap">
        <div className={s.empty}>
          <span className="eyebrow">Checkout</span>
          <h1>Your trip is empty</h1>
          <p>Add a safari or stay before checking out.</p>
          <Link href="/safaris" className="btn btn--dark">Browse safaris &rarr;</Link>
        </div>
      </div>
    );
  }

  async function submitBookings() {
    setStep("submitting");
    const snapshot = items;
    const settled = await Promise.all(
      snapshot.map(async (item): Promise<BookingResult> => {
        try {
          const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: item.kind,
              slug: item.slug,
              startDate: date,
              adults: item.qty,
              firstName,
              lastName,
              email,
              phone: phone || undefined,
              notes: notes || undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) return { itemId: item.id, title: item.title, ok: false, error: data.error ?? "Something went wrong." };
          return { itemId: item.id, title: item.title, ok: true, bookingCode: data.bookingCode, total: data.total, checkoutUrl: data.checkoutUrl };
        } catch {
          return { itemId: item.id, title: item.title, ok: false, error: "Could not reach the booking system." };
        }
      })
    );
    setResults(settled);
    if (settled.some((r) => r.ok)) clear();
    setStep("done");
  }

  if (step === "done") {
    const succeeded = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);
    return (
      <div className="wrap">
        <div className={s.done}>
          <div className={s.doneIcon}>{succeeded.length > 0 ? "✓" : "!"}</div>
          <span className="eyebrow">{succeeded.length > 0 ? "Booking request sent" : "Booking could not be created"}</span>
          <h1>{succeeded.length > 0 ? `Thank you, ${firstName}` : "Something went wrong"}</h1>
          <p>
            {succeeded.length > 0
              ? "Each safari or stay below is booked as its own reservation with Mauly's real booking system — nothing is paid for yet. Continue to secure payment for each to confirm it."
              : "None of your bookings could be created. Please check the details below or contact us directly."}
          </p>
          {succeeded.length > 0 && (
            <div className={s.form} style={{ textAlign: "left", marginBottom: 18 }}>
              {succeeded.map((r) => (
                <div key={r.itemId} className={s.summaryItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: 6, paddingBottom: 14, borderBottom: "1px solid var(--tanova-line)" }}>
                  <b>{r.title}</b>
                  <span className={s.note}>Booking reference {r.bookingCode} {typeof r.total === "number" ? `· ${format(r.total)} total` : ""}</span>
                  {r.checkoutUrl && (
                    <a href={r.checkoutUrl} target="_blank" rel="noreferrer" className="btn btn--dark" style={{ marginTop: 4 }}>
                      Continue to secure payment &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          {failed.length > 0 && (
            <div className={s.form} style={{ textAlign: "left", marginBottom: 18, background: "var(--muted-bg)" }}>
              {failed.map((r) => (
                <div key={r.itemId} className={s.summaryItem}>
                  <span>{r.title}</span>
                  <span className={s.note} style={{ color: "var(--tanova-primary)" }}>{r.error}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/" className="btn btn--outline">Back to home &rarr;</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className={s.head}>
        <span className="eyebrow">Checkout</span>
        <h1>Your details</h1>
        <div className={s.steps}>
          <span className={s.stepActive}>1. Details</span>
          <span className={step === "submitting" ? s.stepActive : ""}>2. Confirm &amp; pay</span>
        </div>
      </div>

      <div className={s.body}>
        <div className={s.main}>
          <form
            className={s.form}
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmitDetails || step === "submitting") return;
              submitBookings();
            }}
          >
            <div className={s.row2}>
              <label className={s.field}>First name
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label className={s.field}>Last name
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </label>
            </div>
            <label className={s.field}>Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className={s.field}>Phone (optional)
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className={s.field}>Preferred travel date
              <DatePicker value={date} onChange={setDate} placeholder="Select a date" />
            </label>
            <label className={s.field}>Notes for our team (optional)
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <button className="btn btn--dark" type="submit" disabled={!canSubmitDetails || step === "submitting"} style={{ width: "100%", justifyContent: "center" }}>
              {step === "submitting" ? "Submitting your booking…" : "Submit booking →"}
            </button>
            <p className={s.note}>
              This submits a real, unpaid booking request to Mauly&rsquo;s booking system for each item below &mdash;
              you&rsquo;ll get a secure payment link for each one next. Nothing is charged on this page.
            </p>
          </form>
        </div>

        <aside className={s.summary}>
          <h3>Order summary</h3>
          {items.map((item) => (
            <div className={s.summaryItem} key={item.id}>
              <span>{item.title} &times; {item.qty}</span>
              <b>{format(item.qty * item.unitPrice)}</b>
            </div>
          ))}
          <div className={s.summaryTotal}><span>Total</span><b>{format(total)}</b></div>
        </aside>
      </div>
    </div>
  );
}
