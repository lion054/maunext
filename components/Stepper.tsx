"use client";

import s from "./Stepper.module.css";

export default function Stepper({
  value, onChange, min = 0, max = 20, label,
}: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string;
}) {
  return (
    <div className={s.stepper}>
      <button type="button" className={s.btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease">
        &minus;
      </button>
      <span className={s.value}>
        {value}
        {label && <span className={s.label}>{label}</span>}
      </span>
      <button type="button" className={s.btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase">
        +
      </button>
    </div>
  );
}
