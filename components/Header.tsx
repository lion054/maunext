"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MobileNav from "./MobileNav";
import MegaIcon, { type IconName } from "./MegaIcon";
import { useTrip } from "@/lib/trip/TripProvider";
import { useCurrency, CURRENCIES } from "@/lib/currency/CurrencyProvider";
import s from "./Header.module.css";

// Pages that open on a full-bleed dark hero — the header can sit transparent
// over them (with the white logo) until the visitor scrolls. Everything else
// keeps the solid header, since a transparent bar over a plain white page
// would make the nav unreadable.
const HERO_PAGES = new Set(["/", "/sublime", "/halal-safaris", "/trekking", "/mount-meru", "/about", "/destinations", "/experiences", "/sustainable-tourism"]);
function isHeroPage(pathname: string) {
  if (HERO_PAGES.has(pathname)) return true;
  if (pathname.startsWith("/destinations/")) return true;
  if (pathname.startsWith("/safaris/") && pathname !== "/safaris") return true;
  return false;
}

// Maps a pathname to the top-level nav section it belongs to, so the header
// can keep the visitor's current section highlighted.
const ACTIVE_RULES: { label: string; paths: string[] }[] = [
  { label: "Destinations", paths: ["/destinations"] },
  { label: "Safaris", paths: ["/safaris"] },
  { label: "Trekking", paths: ["/trekking", "/mount-meru"] },
  { label: "Experiences", paths: ["/experiences"] },
  { label: "Stays", paths: ["/stays"] },
  { label: "About", paths: ["/about", "/sustainable-tourism", "/your-safety", "/contact", "/blog"] },
];

function getActiveLabel(pathname: string): string | null {
  for (const rule of ACTIVE_RULES) {
    if (rule.paths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return rule.label;
  }
  return null;
}

export type MegaLink = { label: string; href: string; icon?: IconName; children?: { label: string; href: string }[] };
export type MegaGroup = { title: string; col: 1 | 2; links: MegaLink[]; viewAllHref?: string; viewAllLabel?: string };
export type MegaFeatured = { eyebrow: string; title: string; image: string; ctaLabel: string; ctaHref: string };
export type NavItem = { label: string; href: string; mega?: { quickLinks: { label: string; href: string }[]; groups: MegaGroup[]; featured: MegaFeatured } };

const NAV: NavItem[] = [
  {
    label: "Destinations",
    href: "/destinations",
    mega: {
      quickLinks: [
        { label: "The Great Migration", href: "/destinations/serengeti-national-park" },
        { label: "Zanzibar", href: "/destinations/zanzibar" },
        { label: "Kilimanjaro", href: "/destinations/mount-kilimanjaro" },
        { label: "Ngorongoro Crater", href: "/destinations/ngorongoro" },
      ],
      groups: [
        {
          title: "Northern Circuit", col: 1,
          links: [
            { label: "Serengeti National Park", href: "/destinations/serengeti-national-park", icon: "compass" },
            { label: "Ngorongoro", href: "/destinations/ngorongoro", icon: "mountain" },
            { label: "Tarangire National Park", href: "/destinations/tarangire-national-park", icon: "compass" },
            { label: "Lake Manyara National Park", href: "/destinations/lake-manyara-national-park", icon: "waves" },
          ],
          viewAllHref: "/destinations", viewAllLabel: "View All Destinations",
        },
        {
          title: "Mountains & Highlands", col: 1,
          links: [
            { label: "Mount Kilimanjaro", href: "/destinations/mount-kilimanjaro", icon: "mountain" },
            { label: "Arusha", href: "/destinations/arusha", icon: "compass" },
            { label: "Materuni", href: "/destinations/materuni", icon: "mountain" },
          ],
        },
        {
          title: "Coast & Remote", col: 2,
          links: [
            { label: "Zanzibar", href: "/destinations/zanzibar", icon: "waves" },
            { label: "Lushoto (Usambara)", href: "/destinations/lushoto-usambara", icon: "compass" },
            { label: "Lake Natron", href: "/destinations/lake-natron", icon: "waves" },
            { label: "Mkomazi National Park", href: "/destinations/mkomazi-national-park", icon: "compass" },
          ],
          viewAllHref: "/destinations", viewAllLabel: "View All Destinations",
        },
        {
          title: "Must See", col: 2,
          links: [
            { label: "The Great Migration", href: "/destinations/serengeti-national-park", icon: "users" },
            { label: "Ngorongoro Crater", href: "/destinations/ngorongoro", icon: "users" },
            { label: "Kilimanjaro Summit", href: "/trekking", icon: "mountain" },
          ],
        },
      ],
      featured: { eyebrow: "Explore Africa", title: "Wild Destinations", image: "/img/tarangire-elephants.jpg", ctaLabel: "View All Destinations", ctaHref: "/destinations" },
    },
  },
  {
    label: "Safaris",
    href: "/safaris",
    mega: {
      quickLinks: [
        { label: "Sublime Collection", href: "/sublime" },
        { label: "Halal Safaris", href: "/halal-safaris" },
        { label: "Golf Safari", href: "/safaris/luxury-golf-serengeti-migration-safari" },
        { label: "Cultural & Community", href: "/safaris?style=Cultural%20%26%20Community" },
      ],
      groups: [
        {
          title: "Signature Packages", col: 1,
          links: [
            { label: "Grand Tanzanian Journey", href: "/safaris/grand-tanzanian-journey", icon: "users" },
            { label: "Migration Wilderness Wanderlust", href: "/safaris/migration-wilderness-wanderlust", icon: "users" },
            { label: "Usambara Wonders", href: "/safaris/usambara-wonders-from-peaks-to-waterfalls", icon: "globe" },
            { label: "Lengai's Legacy", href: "/safaris/lengais-legacy", icon: "mountain" },
          ],
          viewAllHref: "/safaris", viewAllLabel: "View All Signature Packages",
        },
        {
          title: "Volunteer & Community", col: 1,
          links: [
            { label: "Teaching & Awareness Volunteering", href: "/safaris/teaching-awareness-volunteering", icon: "users" },
            { label: "Wild Ecology Conservation Program", href: "/safaris/wild-ecology-conservation-program", icon: "globe" },
            { label: "Clinical Health Provider Volunteering", href: "/safaris/clinical-health-provider-volunteering-in-tanzania", icon: "users" },
          ],
        },
        {
          title: "Themed Safaris", col: 2,
          links: [
            { label: "Tanzanian Trio Safari", href: "/safaris/tanzanian-trio-safari-tarangire-manyara-ngorongoro-expedition", icon: "users" },
            { label: "Lake Dreams", href: "/safaris/lake-dreams", icon: "waves" },
            { label: "Luxury Golf & Migration", href: "/safaris/luxury-golf-serengeti-migration-safari", icon: "users" },
            { label: "Manyara Explorer's Delight", href: "/safaris/manyara-explorers-delight-3-day-wildlife-and-culture-safari", icon: "users" },
          ],
          viewAllHref: "/safaris", viewAllLabel: "View All Themed Safaris",
        },
      ],
      featured: { eyebrow: "Safari Collection", title: "Handcrafted Journeys", image: "/img/lion-behaviour.jpg", ctaLabel: "Browse All Safaris", ctaHref: "/safaris" },
    },
  },
  {
    label: "Trekking",
    href: "/trekking",
    mega: {
      quickLinks: [
        { label: "Lemosho Route", href: "/safaris/8-day-kilimanjaro-group-trek-via-lemosho-route" },
        { label: "Machame Route", href: "/safaris/7-day-kilimanjaro-group-trek-via-machame-route" },
        { label: "Mount Meru", href: "/mount-meru" },
        { label: "Departures Calendar", href: "/calendar" },
      ],
      groups: [
        {
          title: "Mountains", col: 1,
          links: [
            { label: "Mount Kilimanjaro", href: "/trekking", icon: "mountain" },
            { label: "Mount Meru — 4 Days", href: "/mount-meru", icon: "mountain" },
            { label: "Mount Meru — 3 Days", href: "/safaris/3-days-mount-meru", icon: "mountain" },
          ],
        },
        {
          title: "On the Mountain", col: 1,
          links: [
            { label: "Rescue Kilimanjaro Snow", href: "/safaris/rescue-kilimanjaro-snow", icon: "globe" },
            { label: "Teaching & Awareness Volunteering", href: "/safaris/teaching-awareness-volunteering", icon: "users" },
          ],
        },
        {
          title: "The 6 Routes to the Summit", col: 2,
          links: [
            { label: "Lemosho Route", href: "/safaris/8-day-kilimanjaro-group-trek-via-lemosho-route", icon: "mountain" },
            { label: "Machame Route", href: "/safaris/7-day-kilimanjaro-group-trek-via-machame-route", icon: "mountain" },
            { label: "Rongai Route", href: "/safaris/rongai-route-kilimanjaro-trek", icon: "mountain" },
            { label: "Marangu Route", href: "/safaris/6-day-kilimanjaro-group-trek-via-marangu-route", icon: "mountain" },
            { label: "Northern Circuit", href: "/safaris/8-day-northern-circuit-group-trek", icon: "mountain" },
            { label: "Umbwe Route", href: "/safaris/umbwe-route-6-day-challenge-to-the-summit-of-mt-kilimanjaro", icon: "mountain" },
          ],
          viewAllHref: "/trekking", viewAllLabel: "Compare All Routes",
        },
      ],
      featured: { eyebrow: "Kilimanjaro", title: "Africa's Highest Summit", image: "/img/kilimanjaro-summit-night.jpg", ctaLabel: "Plan Your Climb", ctaHref: "/trekking" },
    },
  },
  {
    label: "Experiences",
    href: "/experiences",
    mega: {
      quickLinks: [
        { label: "Halal Safaris", href: "/halal-safaris" },
        { label: "Moshi Tuk Tuk Tour", href: "/safaris/moshi-tuk-tuk-tour-3-day-cultural-and-nature-adventure" },
        { label: "Beach Escapes", href: "/destinations/zanzibar" },
        { label: "Custom Tour", href: "/plan" },
      ],
      groups: [
        {
          title: "Tailored", col: 1,
          links: [
            { label: "Custom Tour (AI Trip Planner)", href: "/plan", icon: "lock" },
            { label: "Scheduled Departures", href: "/calendar", icon: "compass" },
            { label: "Halal Safaris", href: "/halal-safaris", icon: "users" },
            { label: "Responsible Tourism", href: "/sustainable-tourism", icon: "pencil" },
          ],
          viewAllHref: "/experiences", viewAllLabel: "View All Experiences",
        },
        {
          title: "Cultural", col: 1,
          links: [
            { label: "Moshi Tuk Tuk Tour", href: "/safaris/moshi-tuk-tuk-tour-3-day-cultural-and-nature-adventure", icon: "globe" },
            { label: "Usambara Wonders", href: "/safaris/usambara-wonders-from-peaks-to-waterfalls", icon: "globe" },
          ],
        },
        {
          title: "Safari Experiences", col: 2,
          links: [
            { label: "Ndutu Life Awakens", href: "/safaris/ndutu-life-awakens", icon: "users" },
            { label: "Ndutu Migration Safari", href: "/safaris/ndutu-migration-safari", icon: "users" },
          ],
          viewAllHref: "/safaris", viewAllLabel: "View All Safari Experiences",
        },
        {
          title: "Island Retreats", col: 2,
          links: [
            { label: "Turquoise Temptation", href: "/safaris/turquoise-temptation-zanzibar-tour", icon: "waves" },
            { label: "The Island Bliss", href: "/safaris/the-island-bliss", icon: "waves" },
          ],
        },
      ],
      featured: { eyebrow: "Beyond Safari", title: "Ways to Encounter Tanzania", image: "/img/paje-golden-hour.jpg", ctaLabel: "Explore Experiences", ctaHref: "/experiences" },
    },
  },
  {
    label: "Stays",
    href: "/stays",
    mega: {
      quickLinks: [
        { label: "Ngorongoro Lodge Meliá Collection", href: "/stays/ngorongoro-lodge-melia-collection" },
        { label: "Ngorongoro Serena Safari Lodge", href: "/stays/ngorongoro-serena-safari-lodge" },
        { label: "Lion's Paw Camp", href: "/stays/lions-paw-camp-by-karibu-camps" },
        { label: "All Stays", href: "/stays" },
      ],
      groups: [
        {
          title: "Ngorongoro Lodges & Camps", col: 1,
          links: [
            { label: "Ngorongoro Lodge Meliá Collection", href: "/stays/ngorongoro-lodge-melia-collection", icon: "compass" },
            { label: "Ngorongoro Serena Safari Lodge", href: "/stays/ngorongoro-serena-safari-lodge", icon: "compass" },
            { label: "Lion's Paw Camp (by Karibu Camps)", href: "/stays/lions-paw-camp-by-karibu-camps", icon: "compass" },
          ],
          viewAllHref: "/stays", viewAllLabel: "View All Stays",
        },
      ],
      featured: { eyebrow: "Hand-Chosen", title: "Where to Rest Between Game Drives", image: "/img/lion-manyara.webp", ctaLabel: "Browse All Stays", ctaHref: "/stays" },
    },
  },
  {
    label: "About",
    href: "/about",
    mega: {
      quickLinks: [
        { label: "Our Story", href: "/about" },
        { label: "Responsible Tourism", href: "/sustainable-tourism" },
        { label: "Your Safety", href: "/your-safety" },
        { label: "Contact Us", href: "/contact" },
      ],
      groups: [
        {
          title: "Company", col: 1,
          links: [
            { label: "About Us", href: "/about", icon: "info" },
            { label: "Responsible Tourism", href: "/sustainable-tourism", icon: "pencil" },
            { label: "Halal Safaris", href: "/halal-safaris", icon: "users" },
          ],
          viewAllHref: "/about", viewAllLabel: "View All Company",
        },
        {
          title: "Plan With Us", col: 1,
          links: [
            { label: "Contact Us", href: "/contact", icon: "phone" },
            { label: "Plan Your Journey", href: "/plan", icon: "compass" },
          ],
        },
        {
          title: "Read & Explore", col: 2,
          links: [
            { label: "Travel Blog", href: "/blog", icon: "doc" },
            { label: "Experiences", href: "/experiences", icon: "globe" },
            { label: "All Safaris", href: "/safaris", icon: "users" },
          ],
          viewAllHref: "/blog", viewAllLabel: "View All Read & Explore",
        },
      ],
      featured: { eyebrow: "Est. 1983", title: "Years of Safari Excellence", image: "/img/kilimanjaro-summit-night.jpg", ctaLabel: "Meet Mauly Tours", ctaHref: "/about" },
    },
  },
];

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [condensed, setCondensed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const { count } = useTrip();
  const { currency, setCurrency } = useCurrency();
  const pathname = usePathname();
  const hero = isHeroPage(pathname);
  const transparent = hero && !condensed;
  const active = getActiveLabel(pathname);

  // Every navigation lands at the top of the new page (Next's default scroll
  // behavior), so force the header back to its non-condensed state immediately
  // rather than trusting window.scrollY here — Next's own scroll reset can
  // land a frame after this runs, which previously caused the header to
  // briefly (or, if the user never scrolled again, permanently) carry over
  // the *previous* page's condensed state onto a fresh hero page.
  useEffect(() => {
    setCondensed(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    if (!currencyOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCurrencyOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setCurrencyOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [currencyOpen]);

  return (
    <>
      <header ref={headerRef} className={`${s.header} ${condensed ? s.condensed : ""} ${transparent ? s.transparent : ""}`}>
      <div className={s.bar}>
        <Link href="/" className={s.logo} onClick={() => setOpen(null)}>
          <img src={transparent ? "/logo/mauly-logo-white.svg" : "/logo/mauly-logo-nav.svg"} alt="Mauly Tours" width={79} height={40} className={s.logoImg} />
        </Link>
        <nav className={s.nav}>
          {NAV.map((item) => (
            <div
              className={s.navItem}
              key={item.label}
              onMouseEnter={() => item.mega && setOpen(item.label)}
              onMouseLeave={() => item.mega && setOpen((cur) => (cur === item.label ? null : cur))}
            >
              {item.mega ? (
                <button
                  type="button"
                  className={`${s.navTrigger} ${active === item.label ? s.active : ""}`}
                  aria-haspopup="true"
                  aria-expanded={open === item.label}
                  onClick={() => setOpen(open === item.label ? null : item.label)}
                >
                  {item.label}
                  <svg className={`${s.caret} ${open === item.label ? s.caretOpen : ""}`} viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 1l4 4 4-4" />
                  </svg>
                </button>
              ) : (
                <Link href={item.href} className={`${s.navTrigger} ${active === item.label ? s.active : ""}`}>{item.label}</Link>
              )}
              {item.mega && (
                <div className={`${s.mega} ${open === item.label ? s.megaOpen : ""}`}>
                  <div className={s.megaQuick}>
                    <span className={s.megaQuickLabel}>Popular</span>
                    {item.mega.quickLinks.map((q) => (
                      <Link key={q.href + q.label} href={q.href} onClick={() => setOpen(null)} className={s.megaQuickPill}>{q.label}</Link>
                    ))}
                  </div>
                  <div className={s.megaGrid}>
                    <div className={s.megaCol}>
                      {item.mega.groups.filter((g) => g.col === 1).map((group) => (
                        <div className={s.megaGroup} key={group.title}>
                          <h4>{group.title}</h4>
                          <ul>
                            {group.links.map((l) => (
                              <li key={l.href + l.label}>
                                <Link href={l.href} onClick={() => setOpen(null)} className={s.megaLink}>
                                  {l.icon && (
                                    <span className={s.megaLinkIconWrap}><MegaIcon name={l.icon} className={s.megaLinkIcon} /></span>
                                  )}
                                  {l.label}
                                </Link>
                                {l.children && (
                                  <ul className={s.megaSubList}>
                                    {l.children.map((c) => (
                                      <li key={c.href}><Link href={c.href} onClick={() => setOpen(null)}>{c.label}</Link></li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                          {group.viewAllHref && (
                            <Link href={group.viewAllHref} onClick={() => setOpen(null)} className={s.viewAll}>{group.viewAllLabel} &rarr;</Link>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className={s.megaCol}>
                      {item.mega.groups.filter((g) => g.col === 2).map((group) => (
                        <div className={s.megaGroup} key={group.title}>
                          <h4>{group.title}</h4>
                          <ul>
                            {group.links.map((l) => (
                              <li key={l.href + l.label}>
                                <Link href={l.href} onClick={() => setOpen(null)} className={s.megaLink}>
                                  {l.icon && (
                                    <span className={s.megaLinkIconWrap}><MegaIcon name={l.icon} className={s.megaLinkIcon} /></span>
                                  )}
                                  {l.label}
                                </Link>
                                {l.children && (
                                  <ul className={s.megaSubList}>
                                    {l.children.map((c) => (
                                      <li key={c.href}><Link href={c.href} onClick={() => setOpen(null)}>{c.label}</Link></li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                          {group.viewAllHref && (
                            <Link href={group.viewAllHref} onClick={() => setOpen(null)} className={s.viewAll}>{group.viewAllLabel} &rarr;</Link>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link href={item.mega.featured.ctaHref} onClick={() => setOpen(null)} className={s.megaFeatured}>
                      <div className={s.megaFeaturedImg} style={{ backgroundImage: `url(${item.mega.featured.image})` }} />
                      <div className={s.megaFeaturedBody}>
                        <span className={s.megaFeaturedEye}>{item.mega.featured.eyebrow}</span>
                        <span className={s.megaFeaturedTitle}>{item.mega.featured.title}</span>
                        <span className={s.megaFeaturedCta}>
                          {item.mega.featured.ctaLabel}
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </span>
                      </div>
                    </Link>
                  </div>
                  <Link href="/sublime" className={s.megaSublime} onClick={() => setOpen(null)}>
                    <div className={s.megaSublimeImg} />
                    <div className={s.megaSublimeL}>
                      <span className={s.megaSublimeEye}><span aria-hidden="true">✦</span>The Sublime Collection</span>
                      <span className={s.megaSublimeTitle}>Ultra-luxury safaris, composed by hand</span>
                    </div>
                    <span className={s.megaSublimeCta}>
                      Explore Sublime
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className={s.actions}>
          <button className={s.lang} type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a13.7 13.7 0 013.5 9A13.7 13.7 0 0112 21a13.7 13.7 0 01-3.5-9A13.7 13.7 0 0112 3z" /></svg>
            EN
          </button>
          <div className={s.currency} ref={currencyRef}>
            <button
              className={s.lang}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={currencyOpen}
              onClick={() => setCurrencyOpen((o) => !o)}
            >
              {currency}
            </button>
            {currencyOpen && (
              <ul className={s.currencyMenu} role="listbox">
                {CURRENCIES.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.code === currency}
                      className={c.code === currency ? s.currencyActive : ""}
                      onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                    >
                      <span>{c.symbol} {c.code}</span>
                      <small>{c.label}</small>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/cart" className={s.cart} aria-label={`Your trip${count ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
            </svg>
            {count > 0 && <span className={s.cartBadge}>{count}</span>}
          </Link>
          <Link href="/plan" className="btn btn--outline">Plan Your Journey</Link>
          <button
            type="button"
            className={s.hamburger}
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <MobileNav nav={NAV} open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>
      {/* The header is taken out of normal flow (position: fixed) so a hero page's
          banner can sit directly behind it instead of being pushed down by the
          header's own box — this spacer restores that missing space, but only on
          pages that don't have a hero to overlap. */}
      {!hero && <div className={s.spacer} style={{ height: condensed ? 66 : 98 }} aria-hidden />}
    </>
  );
}
