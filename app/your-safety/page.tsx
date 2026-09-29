import Link from "next/link";
import Reveal from "@/components/Reveal";
import s from "./page.module.css";

const MONITORING = [
  { title: "Continuous Monitoring", desc: "Our team monitors official government advisories, local authorities, park management updates, and regional news throughout the day." },
  { title: "Local On-the-Ground Network", desc: "We maintain direct communication with our guides, drivers, and partner lodges who provide immediate updates from all major safari routes and Kilimanjaro areas." },
  { title: "Proactive Traveler Alerts", desc: "If any situation arises that could affect a client's itinerary, we notify travelers promptly through email, WhatsApp, and phone alerts." },
  { title: "24/7 Operations Team", desc: "Our operations team is available around the clock to assess developments and coordinate adjustments when needed." },
];

const COMMS = [
  { title: "Designated Contact Person", desc: "Every traveler is assigned a primary point of contact who remains available before and during the trip." },
  { title: "Multi-Channel Communication", desc: "We use WhatsApp, phone, email, and our lodge/park communication network to ensure clients receive important updates instantly." },
  { title: "Emergency Hotline", desc: "We provide a 24/7 emergency line that connects travelers directly to our operations manager in case assistance is needed." },
  { title: "Daily Briefing", desc: "Guides provide daily safety briefings and updates regarding weather conditions, route status, and any relevant local developments." },
];

const FLEXIBILITY = [
  { title: "Alternative Routes or Parks", desc: "If a specific area experiences unrest, unusual weather, or accessibility challenges, we reroute to equally rewarding and safe destinations." },
  { title: "Flexible Safari Timing", desc: "Game drives and transfers may be adjusted to avoid high-traffic zones or areas affected by temporary disturbances." },
  { title: "Kilimanjaro Adjustments", desc: "On the mountain, our guides can modify daily schedules based on weather patterns and climber health while maintaining acclimatisation safety." },
  { title: "Accommodation Changes if Needed", desc: "We work with a wide network of partner lodges, allowing us to shift accommodations seamlessly should the need arise." },
  { title: "Pre-Trip Flexibility", desc: "If conditions change before a trip begins, we offer itinerary revisions, date adjustments, or re-routing options." },
];

export default function YourSafetyPage() {
  return (
    <div className="wrap">
      <div className={s.head}>
        <span className="eyebrow">Safari &middot; December 29, 2025</span>
        <h1>Your Safety, Every Step of the Journey</h1>
        <p>
          At Mauly Tours, traveler safety is our top priority. We monitor real-time updates from local
          authorities, park systems, and our on-the-ground network of guides and partners. Our operations team
          provides proactive communication across WhatsApp, phone, and email, ensuring travelers are informed at
          all times.
        </p>
      </div>

      <Reveal className={s.section} as="div">
        <span className="eyebrow">How we monitor conditions and keep clients informed</span>
        <h2>Real-Time Updates</h2>
        <div className={s.grid}>
          {MONITORING.map((m, i) => (
            <div className={s.card} key={m.title}><b>{i + 1}</b><h4>{m.title}</h4><p>{m.desc}</p></div>
          ))}
        </div>
      </Reveal>

      <Reveal className={s.section} as="div">
        <span className="eyebrow">How Mauly Tours communicates safety information to clients</span>
        <h2>Communication Protocols</h2>
        <div className={s.grid}>
          {COMMS.map((m, i) => (
            <div className={s.card} key={m.title}><b>{i + 1}</b><h4>{m.title}</h4><p>{m.desc}</p></div>
          ))}
        </div>
      </Reveal>

      <Reveal className={s.section} as="div">
        <span className="eyebrow">How you adjust plans when needed without disrupting the experience</span>
        <h2>Itinerary Flexibility</h2>
        <div className={s.grid}>
          {FLEXIBILITY.map((m, i) => (
            <div className={s.card} key={m.title}><b>{i + 1}</b><h4>{m.title}</h4><p>{m.desc}</p></div>
          ))}
        </div>
      </Reveal>

      <Reveal className={s.cta}>
        <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Ready to experience Tanzania?</span>
        <h2>Private safaris designed around you</h2>
        <p>Every detail arranged, every moment extraordinary.</p>
        <Link href="/plan" className="btn btn--primary">Plan My Journey &rarr;</Link>
      </Reveal>
    </div>
  );
}
