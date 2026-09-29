import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import s from "./page.module.css";

const HIGHLIGHTS = [
  { title: "Caldera", desc: "The summit features a striking caldera, with sheer cliffs and a lush crater floor." },
  { title: "Little Meru", desc: "At 3,820m, Little Meru provides an excellent acclimatisation hike with panoramic views of the main summit." },
  { title: "Momella Lakes", desc: "These alkaline lakes at the base of the mountain are home to varied birdlife and a serene trailhead." },
];

const ZONES = [
  { title: "Cultivation Zone", range: "1,500–2,000m", desc: "Farmland and villages surround the base, where local communities grow coffee and bananas." },
  { title: "Montane Forest Zone", range: "2,000–2,800m", desc: "Dense forest teeming with wildlife, including monkeys, antelopes and a rich variety of birds." },
  { title: "Heath & Moorland Zone", range: "2,800–3,500m", desc: "Open moorland with giant heathers and lobelias, and striking views of the surrounding landscape." },
  { title: "Alpine Desert Zone", range: "3,500–4,500m", desc: "Harsh, rocky terrain with sparse vegetation and dramatic volcanic features." },
];

const ITINERARY = [
  { day: "Day 1", title: "Momella Gate to Miriakamba Hut", desc: "Begin at Momella Gate after registration; armed rangers accompany the group due to wildlife in the park. Trek through rainforest rich with monkeys and birdlife." },
  { day: "Day 2", title: "Miriakamba to Saddle Hut (via Little Meru)", desc: "Ascend into the heather zone with wider views. Optional acclimatisation hike to Little Meru for altitude adjustment." },
  { day: "Day 3", title: "Saddle Hut to Socialist Peak, return to Miriakamba", desc: "Early start (around midnight) for the summit push along the crater rim to Socialist Peak (4,566m), with sunrise views and Kilimanjaro in the distance." },
  { day: "Day 4", title: "Miriakamba to Momella Gate", desc: "Final descent through the forest back to Momella Gate, with wildlife sightings along the way." },
];

const WILDLIFE = [
  { zone: "Montane Forest", animals: "Colobus monkeys, blue monkeys, bushbucks, giraffes, buffalo", features: "Dense canopy, vines, fig trees" },
  { zone: "Heathland", animals: "Sunbirds, duikers, and occasional large mammals", features: "Giant heathers, open glades" },
  { zone: "Moorland", animals: "Hyraxes, eagles, chameleons", features: "Rocky terrain, low shrubs, expansive views" },
  { zone: "Alpine Desert & Crater Rim", animals: "Rare sightings: leopard, lammergeier", features: "Barren ridges, volcanic formations" },
];

const BEST_TIME = [
  { window: "June to October", desc: "The weather holds with clearer skies, and the ground is solid underfoot — the most popular window, and Kilimanjaro usually pops up in the distance." },
  { window: "January to Early March", desc: "Quieter, but the weather is still dry and reliable. The light hits different, especially in the afternoons — softer shadows, longer views, cooler air." },
  { window: "April, May & November", desc: "The wet seasons. Weather can be patchy, but forests glow and trails are empty — worth it if you prioritise solitude over certainty." },
];

const INCLUDED = ["Park permits and all hut stays", "Full guiding team (guide, ranger, porters)", "Ground transport to/from Arusha", "Meals from start to summit", "Clean water on the trail"];
const EXCLUDED = ["International flights", "Visa fees and paperwork", "Travel insurance", "Tips for the crew (guides, porters, cooks)", "Personal snacks, gear, and add-ons"];

const PACKING = [
  { title: "Train Your Body", desc: "You don't need to be an athlete, but you do need legs that won't ache when the path turns steep. Stair training helps — try a loaded backpack on a two-hour walk and see how your body responds." },
  { title: "Pack Right", desc: "Pack light, but pack smart. Layers matter more than looks — mornings are chilly, afternoons hot, and the summit wind cuts through anything flimsy. Break in your boots before you arrive." },
  { title: "Hydrate", desc: "You'll need to drink more than usual. Altitude can do strange things, and dehydration makes the symptoms worse. Tell your guide if something feels off — headaches, nausea and vivid dreams are common and usually pass." },
];

const FAQS = [
  { q: "How difficult is Mount Meru compared to Kilimanjaro?", a: "It's shorter with fewer days, but it's still a proper climb — you'll feel the final push to the summit, especially in the dark. No ropes or crampons needed. If Kilimanjaro is a marathon, Meru's a fast, hilly half: tough, but doable with a good pace." },
  { q: "What's the best time of year to trek Mount Meru?", a: "June to October is dry, clear and the most popular. January and February are calmer with better light and less traffic. April, May and November can be wet, but you'll have the mountain nearly to yourself." },
  { q: "Do I need previous trekking experience?", a: "No, but fitness helps. If you can walk uphill for a few hours without collapsing, you'll be fine. The huts give you proper sleep and the pace is steady — just listen to your guide and drink more water than you think you need." },
  { q: "How long does the trek take?", a: "Four days. Day one gets you through the forest, day two hits the heather zone, day three is summit day — an early start, a long haul, and a big reward — and day four winds you back down." },
  { q: "Is Mount Meru suitable for solo travellers?", a: "Absolutely. You'll be paired with a guide regardless, and the trail is social without being crowded. Most solo travellers say it feels safe and supported, with room to be as sociable or solitary as the mood strikes." },
];

export default function MountMeruPage() {
  return (
    <>
      <ParallaxHero image="/img/ol-doinyo-lengai.webp" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Welcome to the hidden gem of Tanzania</span>
          <h1 style={{ color: "#fff", fontSize: "clamp(32px,5vw,52px)" }}>Mount Meru Trekking Tour</h1>
          <p>Tanzania&rsquo;s second-highest peak at 4,566m &mdash; a quieter, more peaceful alternative to Kilimanjaro, with impressive wildlife along the way.</p>
          <Link href="/safaris/4-days-mount-meru" className="btn btn--primary">Book my Meru trek &rarr;</Link>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.section}>
          <span className="eyebrow">Geographical highlight</span>
          <h2>An active stratovolcano</h2>
          <p>Mount Meru is an active stratovolcano with a distinct cone and a history of significant eruptions, the last occurring over a century ago.</p>
          <div className={s.highlights}>
            {HIGHLIGHTS.map((h) => (
              <div className={s.highlight} key={h.title}><b>{h.title}</b><span>{h.desc}</span></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section}>
          <span className="eyebrow">Mt Meru ecological zones</span>
          <h2>A journey through diverse ecology</h2>
          <p>Trekking Mount Meru is a journey through distinct ecological zones, each with its own flora and fauna.</p>
          <div className={s.zones}>
            {ZONES.map((z) => (
              <div className={s.zone} key={z.title}><b>{z.title} <span style={{ fontWeight: 400 }}>&middot; {z.range}</span></b><span>{z.desc}</span></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section}>
          <span className="eyebrow">Routes to summit</span>
          <h2>The Momella Route</h2>
          <p>Mount Meru offers a single route to the summit — the Momella Route — renowned for its scenery, wildlife encounters and rewarding four-day itinerary.</p>
          <div className={s.itinerary}>
            {ITINERARY.map((d) => (
              <div className={s.day} key={d.day}>
                <span className={s.dayNum}>{d.day}</span>
                <div><h3>{d.title}</h3><p>{d.desc}</p></div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section}>
          <span className="eyebrow">What you&rsquo;ll encounter</span>
          <h2>Wildlife &amp; Landscapes by Zone</h2>
          <p>You don&rsquo;t have to wait for the summit to see something wild — here&rsquo;s what to expect across the zones.</p>
          <div className={s.wildlifeTable}>
            <div className={s.wildlifeHead}><span>Zone</span><span>Wildlife</span><span>Landscape</span></div>
            {WILDLIFE.map((w) => (
              <div className={s.wildlifeRow} key={w.zone}>
                <span className={s.wildlifeZone}>{w.zone}</span>
                <span data-label="Wildlife">{w.animals}</span>
                <span data-label="Landscape">{w.features}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section}>
          <span className="eyebrow">When to go</span>
          <h2>Best Time to Trek Mount Meru</h2>
          <div className={s.bestTime}>
            {BEST_TIME.map((b) => (
              <div className={s.bestTimeCard} key={b.window}><b>{b.window}</b><p>{b.desc}</p></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section}>
          <span className="eyebrow">Budget</span>
          <h2>Cost &amp; What&rsquo;s Included</h2>
          <p>Prices shift depending on group size and timing, but most Mount Meru treks fall between <b>$900 and $1,200 per person</b>.</p>
          <div className={s.checkGrid}>
            <div className={s.checkCol}>
              <h4>Already Covered</h4>
              <ul>{INCLUDED.map((i) => <li key={i}><span className={s.checkYes}>&#10003;</span>{i}</li>)}</ul>
            </div>
            <div className={s.checkCol}>
              <h4>On You</h4>
              <ul>{EXCLUDED.map((i) => <li key={i}><span className={s.checkNo}>&times;</span>{i}</li>)}</ul>
            </div>
          </div>
        </Reveal>

        <Reveal className={s.section}>
          <span className="eyebrow">Get ready</span>
          <h2>Essential Preparation Tips</h2>
          <div className={s.highlights}>
            {PACKING.map((p) => (
              <div className={s.highlight} key={p.title}><b>{p.title}</b><span>{p.desc}</span></div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.section}>
          <span className="eyebrow">Know before you go</span>
          <h2>Frequently Asked Questions</h2>
          <div className={s.faqList}>
            {FAQS.map((f) => (
              <div className={s.faq} key={f.q}>
                <h4>{f.q}</h4>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className={s.cta}>
          <h2>What makes Meru different?</h2>
          <p>Mount Meru is an excellent choice for trekkers seeking a quieter alternative to Kilimanjaro — impressive wildlife, varied terrain and rewarding views, in four days rather than six or more.</p>
          <Link href="/safaris/4-days-mount-meru" className="btn btn--primary">Book my Meru trek &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
