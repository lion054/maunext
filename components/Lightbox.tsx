"use client";

import { useEffect } from "react";
import s from "./Lightbox.module.css";

export default function Lightbox({
  images, index, onClose, onNav,
}: {
  images: string[]; index: number; onClose: () => void; onNav: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNav((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, images.length, onClose, onNav]);

  return (
    <div className={s.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button type="button" className={s.close} onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </button>
      {images.length > 1 && (
        <button type="button" className={`${s.nav} ${s.prev}`} onClick={(e) => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length); }} aria-label="Previous photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      <img src={images[index]} alt={`Photo ${index + 1} of ${images.length}`} className={s.img} onClick={(e) => e.stopPropagation()} />
      {images.length > 1 && (
        <button type="button" className={`${s.nav} ${s.next}`} onClick={(e) => { e.stopPropagation(); onNav((index + 1) % images.length); }} aria-label="Next photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      )}
      {images.length > 1 && <div className={s.counter}>{index + 1} / {images.length}</div>}
    </div>
  );
}
