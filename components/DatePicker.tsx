"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { WEEKDAYS, parseISO, toISO, startOfDay, formatDisplay, buildMonthGrid } from "@/lib/dateUtils";
import s from "./DatePicker.module.css";

export default function DatePicker({
  value,
  onChange,
  min,
  placeholder = "Select date",
  className,
  id,
  variant = "field",
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  /** "field" (default) draws its own bordered box, matching standalone form fields.
   *  "bare" skips border/background/padding, for contexts (like HeroSearch) that already
   *  provide that chrome around the field and just need the trigger content. */
  variant?: "field" | "bare";
}) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "right">("left");
  const selected = useMemo(() => parseISO(value), [value]);
  const floor = useMemo(() => startOfDay(parseISO(min ?? "") ?? new Date()), [min]);
  const [viewDate, setViewDate] = useState(() => selected ?? floor);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const openPicker = () => {
    setViewDate(selected ?? floor);
    // Left-align by default, but on a narrow screen a right-column field (e.g. "Check-out",
    // which sits next to "Check-in" in a 2-up row at every width, mobile included) would
    // push a left-anchored 280px panel off the right edge of the viewport — flip it instead.
    const rect = wrapRef.current?.getBoundingClientRect();
    const PANEL_WIDTH = 280;
    const overflowsRight = rect ? rect.left + PANEL_WIDTH > window.innerWidth - 12 : false;
    setAlign(overflowsRight ? "right" : "left");
    setOpen(true);
  };

  const grid = useMemo(() => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  const monthLabel = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className={`${s.wrap} ${className ?? ""}`} ref={wrapRef}>
      <button
        type="button"
        id={id}
        className={`${s.trigger} ${variant === "bare" ? s.triggerBare : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
      >
        <span className={selected ? s.value : s.placeholder}>{selected ? formatDisplay(selected) : placeholder}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`${s.panel} ${align === "right" ? s.panelRight : ""}`}
            role="dialog"
            aria-label="Choose a date"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={s.head}>
              <button type="button" aria-label="Previous month" onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <span>{monthLabel}</span>
              <button type="button" aria-label="Next month" onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
            <div className={s.weekdays}>{WEEKDAYS.map((w) => <span key={w}>{w}</span>)}</div>
            <div className={s.days}>
              {grid.map((day) => {
                const inMonth = day.getMonth() === viewDate.getMonth();
                const disabled = day < floor;
                const isSelected = selected && toISO(day) === toISO(selected);
                const isToday = toISO(day) === toISO(new Date());
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    disabled={disabled}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={day.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    className={[s.day, !inMonth && s.dayMuted, isSelected && s.daySelected, isToday && !isSelected && s.dayToday].filter(Boolean).join(" ")}
                    onClick={() => { onChange(toISO(day)); setOpen(false); }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
