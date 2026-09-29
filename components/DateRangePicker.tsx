"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { WEEKDAYS, parseISO, toISO, startOfDay, formatDisplay, buildMonthGrid } from "@/lib/dateUtils";
import s from "./DatePicker.module.css";

export default function DateRangePicker({
  startValue,
  endValue,
  onChange,
  min,
  startLabel = "Check-in",
  endLabel = "Check-out",
  placeholder = "Add dates",
  className,
  variant = "field",
}: {
  startValue: string;
  endValue: string;
  /** Fires on every pick — once with only a start (end cleared) when a new range begins,
   *  again with both once the second date is chosen. Mirrors how two separate onChange
   *  handlers used to fire independently, so existing "is this complete?" checks downstream
   *  don't need to change. */
  onChange: (start: string, end: string) => void;
  min?: string;
  startLabel?: string;
  endLabel?: string;
  placeholder?: string;
  className?: string;
  variant?: "field" | "bare";
}) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "right">("left");
  const start = useMemo(() => parseISO(startValue), [startValue]);
  const end = useMemo(() => parseISO(endValue), [endValue]);
  const floor = useMemo(() => startOfDay(parseISO(min ?? "") ?? new Date()), [min]);
  const [viewDate, setViewDate] = useState(() => start ?? floor);
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
    setViewDate(start ?? floor);
    const rect = wrapRef.current?.getBoundingClientRect();
    const PANEL_WIDTH = 280;
    const overflowsRight = rect ? rect.left + PANEL_WIDTH > window.innerWidth - 12 : false;
    setAlign(overflowsRight ? "right" : "left");
    setOpen(true);
  };

  function pick(day: Date) {
    // No range yet, or a complete range already stood — this click starts a fresh one.
    if (!start || (start && end)) {
      onChange(toISO(day), "");
      return;
    }
    // Mid-selection (start set, end not) — a click before the start restarts the range
    // rather than producing an inverted/invalid one.
    if (day < start) {
      onChange(toISO(day), "");
      return;
    }
    onChange(toISO(start), toISO(day));
    setOpen(false);
  }

  const grid = useMemo(() => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  const monthLabel = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const label = start && end
    ? `${formatDisplay(start)} – ${formatDisplay(end)}`
    : start
      ? `${formatDisplay(start)} – ${endLabel}?`
      : "";

  return (
    <div className={`${s.wrap} ${className ?? ""}`} ref={wrapRef}>
      <button
        type="button"
        className={`${s.trigger} ${variant === "bare" ? s.triggerBare : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
      >
        <span className={label ? s.value : s.placeholder}>{label || placeholder}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`${s.panel} ${align === "right" ? s.panelRight : ""}`}
            role="dialog"
            aria-label={`Choose ${startLabel.toLowerCase()} and ${endLabel.toLowerCase()} dates`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={s.rangeHint}>
              {!start ? `Choose ${startLabel.toLowerCase()}` : !end ? `Choose ${endLabel.toLowerCase()}` : `${formatDisplay(start)} – ${formatDisplay(end)}`}
            </p>
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
                const isStart = start && toISO(day) === toISO(start);
                const isEnd = end && toISO(day) === toISO(end);
                const isInRange = start && end && day > start && day < end;
                const isToday = toISO(day) === toISO(new Date());
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    disabled={disabled}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={day.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    className={[
                      s.day,
                      !inMonth && s.dayMuted,
                      (isStart || isEnd) && s.daySelected,
                      isInRange && s.dayInRange,
                      isToday && !isStart && !isEnd && s.dayToday,
                    ].filter(Boolean).join(" ")}
                    onClick={() => pick(day)}
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
