"use client";

import Link from "next/link";
import { useTrip } from "@/lib/trip/TripProvider";
import { useCurrency } from "@/lib/currency/CurrencyProvider";
import s from "./page.module.css";

export default function CartPage() {
  const { items, total, removeItem, setQty } = useTrip();
  const { format } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="wrap">
        <div className={s.empty}>
          <span className="eyebrow">Your trip</span>
          <h1>Nothing added yet</h1>
          <p>Browse our safaris and stays, and add what catches your eye — we&rsquo;ll keep it here while you plan.</p>
          <div className={s.emptyActions}>
            <Link href="/safaris" className="btn btn--dark">Browse safaris &rarr;</Link>
            <Link href="/stays" className="btn btn--outline">Browse stays &rarr;</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className={s.head}>
        <span className="eyebrow">Your trip</span>
        <h1>Review your selections</h1>
        <p>Nothing is booked yet &mdash; adjust quantities or remove items, then continue when you&rsquo;re ready.</p>
      </div>

      <div className={s.body}>
        <div className={s.items}>
          {items.map((item) => (
            <div className={s.item} key={item.id}>
              {item.img ? <div className={s.itemImg} style={{ backgroundImage: `url(${item.img})` }} /> : <div className={s.itemImgFallback} />}
              <div className={s.itemBody}>
                <span className={s.itemKind}>{item.kind === "tour" ? "Safari" : "Stay"}</span>
                <h3>{item.title}</h3>
                {item.meta && <p className={s.itemMeta}>{item.meta}</p>}
                <div className={s.itemRow}>
                  <label className={s.qty}>
                    {item.unitLabel}
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => setQty(item.id, Number(e.target.value))}
                    />
                  </label>
                  <span className={s.itemPrice}>{format(item.qty * item.unitPrice)}</span>
                </div>
              </div>
              <button type="button" className={s.remove} onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l14 14M19 5L5 19" /></svg>
              </button>
            </div>
          ))}
        </div>

        <aside className={s.summary}>
          <h3>Trip summary</h3>
          <div className={s.summaryRow}><span>Subtotal</span><b>{format(total)}</b></div>
          <p className={s.note}>Final pricing is confirmed once availability is verified with each property and outfitter &mdash; nothing is charged today.</p>
          <Link href="/checkout" className="btn btn--dark" style={{ width: "100%", justifyContent: "center" }}>Continue to checkout &rarr;</Link>
          <Link href="/safaris" className={s.continueShopping}>Keep browsing</Link>
        </aside>
      </div>
    </div>
  );
}
