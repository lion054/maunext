import s from "./page.module.css";

export default function ContactPage() {
  return (
    <div className="wrap">
      <div className={s.body}>
        <div>
          <span className="eyebrow">Get in Touch</span>
          <h1>Plan Your Safari</h1>
          <p>We respond to every enquiry within 24 hours.</p>
          <div className={s.info}>
            <div className={s.infoRow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              +255 784 884 018
            </div>
            <div className={s.infoRow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
              contact@mauly-tours.com
            </div>
            <div className={s.infoRow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.4-7-11a7 7 0 0114 0c0 4.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
              Moshi, Kilimanjaro Region, Tanzania
            </div>
            <div className={s.infoRow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              24/7 Emergency: +255 784 884 019
            </div>
          </div>
        </div>
        <form className={s.form}>
          <span className="eyebrow">Send a Message</span>
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>Tell Us About Your Dream Journey</h2>
          <div className={s.row2}>
            <label className={s.field}>Full name<input type="text" /></label>
            <label className={s.field}>Email<input type="email" /></label>
          </div>
          <div className={s.row2}>
            <label className={s.field}>Phone / WhatsApp
              <div className={s.phoneRow}>
                <select className={s.code} defaultValue="+255">
                  {["+255", "+1", "+44", "+49", "+33", "+61", "+971"].map((c) => <option key={c}>{c}</option>)}
                </select>
                <input type="tel" />
              </div>
            </label>
            <label className={s.field}>Preferred dates<input type="text" placeholder="e.g. June 2027" /></label>
          </div>
          <label className={s.field}>Tell us about your trip<textarea rows={5} /></label>
          <button className="btn btn--dark" type="button">Send Message &rarr;</button>
        </form>
      </div>
    </div>
  );
}
