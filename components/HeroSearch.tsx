"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "./DatePicker";
import s from "./HeroSearch.module.css";

const DESTINATIONS = [
  { group: "Browse", options: [{ value: "", label: "Where would you like to go?" }] },
  {
    group: "Safari Regions", options: [
      { value: "safari:Northern Circuit", label: "Northern Circuit (Serengeti, Ngorongoro)" },
      { value: "safari:Southern Circuit", label: "Southern Circuit (Ruaha)" },
      { value: "safari:Kilimanjaro & Meru", label: "Kilimanjaro & Meru" },
      { value: "safari:Usambara", label: "Usambara Mountains" },
    ],
  },
  {
    group: "Experience", options: [
      { value: "style:Luxury & private", label: "Luxury Safaris" },
      { value: "style:Classic & flexible", label: "Classic Safaris" },
      { value: "style:Adventure", label: "Adventure & Trekking" },
      { value: "style:Day trip", label: "Day Trips" },
    ],
  },
  { group: "Stays", options: [{ value: "stays", label: "Lodges & Camps" }] },
];

export default function HeroSearch() {
  const router = useRouter();
  const [dest, setDest] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [travelers, setTravelers] = useState(2);

  return (
    <form
      className={s.bar}
      onSubmit={(e) => {
        e.preventDefault();
        if (dest === "stays") {
          router.push("/stays");
        } else if (dest.startsWith("safari:")) {
          router.push(`/safaris?region=${encodeURIComponent(dest.slice(7))}`);
        } else if (dest.startsWith("style:")) {
          router.push(`/safaris?style=${encodeURIComponent(dest.slice(6))}`);
        } else {
          router.push("/safaris");
        }
      }}
    >
      <label className={s.field}>
        <span>Destination</span>
        <select value={dest} onChange={(e) => setDest(e.target.value)}>
          {DESTINATIONS.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.options.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <label className={s.field}>
        <span>When</span>
        <DatePicker value={checkIn} onChange={setCheckIn} placeholder="Add dates" variant="bare" />
      </label>
      <label className={s.field}>
        <span>Travelers</span>
        <input type="number" min={1} max={12} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} />
      </label>
      <button type="submit" className={s.submit}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
        Search
      </button>
    </form>
  );
}
