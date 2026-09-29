import Link from "next/link";
import Image from "next/image";
import ParallaxHero from "@/components/ParallaxHero";
import Reveal from "@/components/Reveal";
import s from "./page.module.css";

const WORK = [
  { title: "Privately Guided", desc: "Every tour is yours alone. No sharing vehicles with strangers, no fixed group departures — just your party, your guide, and the wilderness." },
  { title: "Sustainable Practices", desc: "We prioritise eco-friendly, responsible tourism — protecting and preserving the wild places and wildlife that make Tanzania extraordinary." },
  { title: "Local Connections", desc: "Deep-rooted relationships with local communities enrich every journey with authentic, respectful cultural immersion." },
];

const NUMBERS = [
  { n: "43", l: "Years in the Field" },
  { n: "50+", l: "Destinations across East Africa" },
  { n: "100%", l: "Tanzanian-Owned & Family-Run" },
];

const TEAM = [
  { name: "Peter Mollel", role: "Senior Safari Guide", initials: "PM", bio: "15+ years guiding migration safaris across the northern circuit." },
  { name: "Grace Mushi", role: "Family Safari Specialist", initials: "GM", bio: "Designs pacing for every family itinerary personally." },
  { name: "Joseph Kimaro", role: "Migration Tracking Specialist", initials: "JK", bio: "Two decades tracking the Great Migration's movement." },
  { name: "Naomi Sarakikya", role: "Adventure & Cultural Guide", initials: "NS", bio: "Leads every Maasai village visit personally, ensuring it's respectful and reciprocal." },
  { name: "Baraka Shirima", role: "Mountain Trekking Guide", initials: "BS", bio: "Born in the Usambara foothills, still has family along the trail." },
  { name: "Elias Temba", role: "Birdlife & Photography Guide", initials: "ET", bio: "Former ornithology researcher turned photography-focused guide." },
  { name: "Amara Ndosi", role: "Operations Director", initials: "AN", bio: "Oversees day-to-day operations across every lodge, camp and guide on the ground in Tanzania." },
  { name: "Halima Njau", role: "Guest Relations Lead", initials: "HN", bio: "Your first point of contact — coordinates every enquiry from first message to departure." },
];

const BADGES = [
  { name: "TripAdvisor", tag: "Travellers' Choice", desc: "266 five-star reviews", img: "/img/logo-tripadvisor.webp", w: 701, h: 450 },
  { name: "Travelife", tag: "Gold Partner", desc: "Sustainability certified", img: "/img/logo-travelife.webp", w: 701, h: 252 },
  { name: "KPAP", tag: "Porters Partner", desc: "Fair wages & porter welfare", img: "/img/logo-kpap.webp", w: 701, h: 297 },
  { name: "TATO", tag: "Full Member", desc: "Tanzania Association of Tour Operators", img: "/img/logo-tato.webp", w: 701, h: 563 },
  { name: "IATA", tag: "Accredited Agent", desc: "International Air Transport Association", img: "/img/logo-iata.webp", w: 701, h: 450 },
];

export default function AboutPage() {
  return (
    <>
      <ParallaxHero image="/img/lion-manyara.webp" className={s.hero} overlayClassName={s.heroOverlay}>
        <div className={s.heroInner}>
          <span className="eyebrow" style={{ color: "var(--tanova-gold)" }}>Mauly Tours &mdash; Est. 1983</span>
          <h1>43 Years of Safari Excellence in Tanzania</h1>
          <p className={s.quote}>&ldquo;To share the beauty, culture and wilderness of Tanzania with the world &mdash; through genuine, responsible travel.&rdquo;</p>
          <div className={s.quoteBy}>The founding vision &middot; Salim Mauly, 1983</div>
        </div>
      </ParallaxHero>

      <div className="wrap">
        <Reveal className={s.story}>
          <p>
            Mauly Tours &amp; Safaris was founded in 1983 in Moshi, Tanzania &mdash; a proudly Tanzanian,
            family-owned company. The journey began when <b>Salim Mauly</b> established Mauly as a small
            airport shuttle service, carrying travellers between Kilimanjaro International Airport and Moshi
            at a time when northern Tanzania&rsquo;s tourism industry was still young.
          </p>
          <p>
            Following Salim&rsquo;s passing in 1985, <b>Shariffa Mauly</b> courageously continued to build the
            company while raising their four daughters — expanding Mauly internationally and earning a
            reputation for reliability, integrity and excellence.
          </p>
          <p>
            Over the decades the company grew from a small local operator into a respected
            destination-management company — tailor-made safaris, Kilimanjaro and Mount Meru treks, and
            cultural journeys. Today Mauly Tours remains 100% Tanzanian-owned and family-run, with the next
            generation carrying the legacy forward.
          </p>
        </Reveal>

        <Reveal as="div" style={{ textAlign: "center", marginTop: 40 }}>
          <span className="eyebrow">Our approach</span>
          <h2>How We Work</h2>
        </Reveal>
        <div className={s.workGrid}>
          {WORK.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className={s.workCard}><h3>{w.title}</h3><p>{w.desc}</p></div>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.numbers}>
          {NUMBERS.map((n) => <div key={n.l}><b>{n.n}</b><span>{n.l}</span></div>)}
        </Reveal>

        <Reveal as="div" style={{ textAlign: "center", marginTop: 60 }}>
          <span className="eyebrow">The people behind your trip</span>
          <h2>Meet the Team</h2>
          <p style={{ maxWidth: "56ch", margin: "12px auto 0", color: "var(--tanova-muted)", fontSize: 14.5 }}>
            We employ as many local specialists as possible rather than building a large central office &mdash;
            every guide below plans and leads trips personally, not just a name on an itinerary.
          </p>
        </Reveal>
        <div className={s.teamGrid}>
          {TEAM.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.04}>
              <div className={s.teamCard}>
                <span className={s.teamAvatar}>{t.initials}</span>
                <h4>{t.name}</h4>
                <span className={s.teamRole}>{t.role}</span>
                <p>{t.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" style={{ textAlign: "center", marginTop: 60 }}>
          <span className="eyebrow">Recognised excellence</span>
          <h2>By the Numbers</h2>
        </Reveal>
        <div className={s.badges}>
          {BADGES.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.05}>
              <div className={s.badge}>
                <Image src={b.img} alt={b.name} width={b.w} height={b.h} style={{ height: 28, width: "auto", margin: "0 auto 10px" }} />
                <span>{b.tag}</span>
                <b>{b.name}</b>
                <small>{b.desc}</small>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className={s.cta}>
          <span className="eyebrow">Let&rsquo;s meet</span>
          <h2>Ready to Meet Tanzania?</h2>
          <p>Start the conversation with a specialist who has designed hundreds of journeys across this country.</p>
          <Link href="/contact" className="btn btn--dark">Start the Conversation &rarr;</Link>
        </Reveal>
      </div>
    </>
  );
}
