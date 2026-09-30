"use client";

import Image from "next/image";
import { useState } from "react";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import s from "./page.module.css";

const CODES = ["+255", "+1", "+44", "+49", "+33", "+61", "+971"];

const TRUST = [
  { src: "/img/logo-tripadvisor.webp", w: 701, h: 450, alt: "TripAdvisor", label: "Travelers' Choice" },
  { src: "/img/logo-kpap.webp", w: 701, h: 297, alt: "KPAP", label: "Porters Partner" },
  { src: "/img/logo-tato.webp", w: 701, h: 563, alt: "TATO", label: "Full Member" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+255");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || sending) return;
    setSending(true);
    setError(null);
    const parts = [message.trim()];
    if (dates.trim()) parts.push(`Preferred dates: ${dates.trim()}`);
    if (phone.trim()) parts.push(`Phone/WhatsApp: ${code} ${phone.trim()}`);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", message: parts.join("\n\n"), guestName: name.trim(), guestEmail: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not send your message right now — please try again, or WhatsApp us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <ParallaxHero image="/img/zanzibar-sunset.jpg" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Get in Touch</span>
          <h1 className={s.heroTitle}>Let&rsquo;s Plan Your Journey</h1>
          <p>Tell us what you have in mind &mdash; a real person in Moshi replies within 24 hours, every time.</p>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.lede} as="div">
          <span className={s.ledeRule} aria-hidden="true" />
          <p>A family business since 1983 &mdash; every enquiry reaches Mauly directly, never a call centre.</p>
        </Reveal>

        <div className={s.body}>
          <Reveal className={s.infoCol}>
            <span className="eyebrow">Speak to us directly</span>
            <div className={s.info}>
              <a className={s.infoRow} href="tel:+255784884018">
                <span className={s.infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </span>
                <div><b>+255 784 884 018</b><span>Phone &amp; WhatsApp</span></div>
              </a>
              <a className={s.infoRow} href="mailto:contact@mauly-tours.com">
                <span className={s.infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
                </span>
                <div><b>contact@mauly-tours.com</b><span>We reply within 24 hours</span></div>
              </a>
              <div className={s.infoRow}>
                <span className={s.infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.4-7-11a7 7 0 0114 0c0 4.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                </span>
                <div><b>Moshi, Kilimanjaro Region</b><span>Tanzania</span></div>
              </div>
              <div className={`${s.infoRow} ${s.infoRowEmergency}`}>
                <span className={s.infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </span>
                <div><b>+255 784 884 019</b><span>24/7 emergency line, on safari</span></div>
              </div>
            </div>

            <div className={s.trust}>
              {TRUST.map((t) => (
                <div className={s.trustItem} key={t.alt}>
                  <Image src={t.src} alt={t.alt} width={t.w} height={t.h} />
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className={s.formCol}>
            {sent ? (
              <div className={s.form}>
                <div className={s.sentIcon}>&#10003;</div>
                <h2 style={{ fontSize: 19, textAlign: "center" }}>Message sent</h2>
                <p className={s.sentNote}>
                  Thanks, {name.split(" ")[0]} — this went straight into our real enquiry system. Expect a reply by email within 24 hours.
                </p>
                <button type="button" className="btn btn--outline" style={{ alignSelf: "center" }} onClick={() => { setSent(false); setMessage(""); setDates(""); }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className={s.form} onSubmit={submit}>
                <span className="eyebrow">Send a Message</span>
                <h2 style={{ fontSize: 21, marginBottom: 2 }}>Tell Us About Your Dream Journey</h2>
                <div className={s.row2}>
                  <label className={s.field}>Full name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={sending} /></label>
                  <label className={s.field}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={sending} /></label>
                </div>
                <div className={s.row2}>
                  <label className={s.field}>Phone / WhatsApp
                    <div className={s.phoneRow}>
                      <select className={s.code} value={code} onChange={(e) => setCode(e.target.value)} disabled={sending}>
                        {CODES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={sending} />
                    </div>
                  </label>
                  <label className={s.field}>Preferred dates<input type="text" placeholder="e.g. June 2027" value={dates} onChange={(e) => setDates(e.target.value)} disabled={sending} /></label>
                </div>
                <label className={s.field}>Tell us about your trip<textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required disabled={sending} /></label>
                {error && <p className="form-error">{error}</p>}
                <button className="btn btn--dark" type="submit" disabled={!canSubmit || sending}>
                  {sending ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </>
  );
}
