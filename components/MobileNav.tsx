"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { NavItem } from "./Header";
import { useTrip } from "@/lib/trip/TripProvider";
import s from "./MobileNav.module.css";

export default function MobileNav({ nav, open, onClose }: { nav: NavItem[]; open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { count } = useTrip();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`${s.overlay} ${open ? s.overlayOpen : ""}`} onClick={onClose} aria-hidden="true" />
      <div className={`${s.drawer} ${open ? s.drawerOpen : ""}`} role="dialog" aria-modal="true" aria-label="Menu">
        <div className={s.drawerHead}>
          <img src="/logo/mauly-logo-nav.svg" alt="Mauly Tours" width={59} height={30} className={s.drawerLogo} />
          <button ref={closeRef} type="button" className={s.close} onClick={onClose} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        <nav className={s.list}>
          {nav.map((item) => (
            <div className={s.group} key={item.label}>
              <Link href={item.href} className={s.top} onClick={onClose}>{item.label}</Link>
              {item.mega && (
                <div className={s.subWrap}>
                  {item.mega.groups.map((g) => (
                    <div key={g.title} className={s.subGroup}>
                      <span className={s.subTitle}>{g.title}</span>
                      {g.links.map((l) => (
                        <div key={l.href + l.label}>
                          <Link href={l.href} className={s.sub} onClick={onClose}>{l.label}</Link>
                          {l.children && (
                            <div className={s.subChildren}>
                              {l.children.map((c) => (
                                <Link key={c.href} href={c.href} className={s.subChild} onClick={onClose}>{c.label}</Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/sublime" className={s.sublime} onClick={onClose}>The Sublime Collection &rarr;</Link>
        </nav>
        <div className={s.drawerFoot}>
          <Link href="/cart" className={s.cartLink} onClick={onClose}>Your trip {count > 0 ? `(${count})` : ""}</Link>
          <Link href="/plan" className="btn btn--dark" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
            Plan Your Journey
          </Link>
        </div>
      </div>
    </>
  );
}
