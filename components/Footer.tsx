import Link from "next/link";
import s from "./Footer.module.css";

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/maulytours/", path: "M17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10z" },
  { label: "Facebook", href: "https://www.facebook.com/maulytourssafaris/", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { label: "Twitter / X", href: "https://twitter.com/Mauly_Tours", path: "M4 4l16 16M20 4L4 20" },
  { label: "LinkedIn", href: "https://tz.linkedin.com/company/mauly-tours", path: "M6 9H2v12h4V9zM4 2a2 2 0 100 4 2 2 0 000-4zM22 21v-6.5c0-3-1.5-4.5-4-4.5a3.5 3.5 0 00-3.5 2V9h-4v12h4v-6.5c0-1.2.6-2 1.8-2s1.7.8 1.7 2V21z" },
  { label: "TikTok", href: "https://www.tiktok.com/@maulytours", path: "M16 3v11.5a3.5 3.5 0 11-3-3.46V8a6.5 6.5 0 106.5 6.5V9a6 6 0 003-1V4.5A6 6 0 0116 3z" },
];

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="wrap">
        <div className={s.grid}>
          <div className={s.col}>
            <img src="/logo/mauly-logo-footer.svg" alt="Mauly Tours" width={109} height={42} className={s.brand} />
            <p className={s.tag}>Tailored East African safaris, since 1983. Tanzania &middot; Rwanda &middot; Kenya.</p>
            <div className={s.contact}>
              <a href="tel:+255784884018">+255 784 884 018</a>
              <a href="mailto:contact@mauly-tours.com">contact@mauly-tours.com</a>
              <span>Moshi, Kilimanjaro Region, Tanzania</span>
            </div>
            <div className={s.social}>
              {SOCIAL.map((s2) => (
                <a key={s2.label} href={s2.href} target="_blank" rel="noreferrer noopener" aria-label={s2.label} className={s.socialLink}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={s2.path} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div className={s.col}>
            <h4>Destinations</h4>
            <ul>
              <li><Link href="/destinations">Tanzania</Link></li>
              <li><Link href="/destinations/zanzibar">Zanzibar</Link></li>
              <li><Link href="/trekking">Mount Kilimanjaro</Link></li>
            </ul>
          </div>
          <div className={s.col}>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/safaris">Safaris</Link></li>
              <li><Link href="/calendar">When to Go</Link></li>
              <li><Link href="/stays">Stays</Link></li>
              <li><Link href="/sublime">The Sublime Collection</Link></li>
              <li><Link href="/halal-safaris">Halal Safaris</Link></li>
              <li><Link href="/sustainable-tourism">Responsible Tourism</Link></li>
            </ul>
          </div>
          <div className={s.col}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Journal</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/your-safety">Your Safety</Link></li>
            </ul>
          </div>
        </div>
        <div className={s.bottom}>
          <span>&copy; {new Date().getFullYear()} MaulyTours. UI/UX prototype &mdash; not affiliated content.</span>
          <span>Trusted since 1983</span>
        </div>
      </div>
    </footer>
  );
}
