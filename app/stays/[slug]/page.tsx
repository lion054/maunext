import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getStays, getStay } from "@/lib/stays";
import BookingCard from "./BookingCard";
import Price from "@/components/Price";
import s from "./page.module.css";

export async function generateStaticParams() {
  const stays = await getStays();
  return stays.map((stay) => ({ slug: stay.slug }));
}

const AVAIL_LABEL: Record<string, string> = {
  available: "Available", limited: "Limited — confirm quickly",
  on_request: "On request", closed: "Not currently bookable",
};
const AVAIL_CLASS: Record<string, string> = {
  available: "badge--ok", limited: "badge--warn", on_request: "badge--muted", closed: "badge--off",
};

export default async function StayDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stay = await getStay(slug);
  if (!stay) notFound();

  return (
    <div className="wrap">
      <Link href="/stays" className={s.back}>&larr; All stays</Link>

      <div className={s.hero}>
        {stay.image ? <Image className={s.heroImg} src={stay.image} alt={stay.title} fill sizes="(max-width: 900px) 100vw, 900px" priority /> : null}
        <div className={s.heroAfter} />
        <span className={`badge ${AVAIL_CLASS[stay.availability]} ${s.availBadge}`}>{AVAIL_LABEL[stay.availability]}</span>
        {stay.tier && <span className={`tier tier--${stay.tier} ${s.tierBadge}`}><b>{{ budget: "$", mid: "$$", luxury: "$$$" }[stay.tier]}</b>{{ budget: "Budget", mid: "Mid-range", luxury: "Luxury" }[stay.tier]}</span>}
        <div className={s.heroCap}>
          <h1 className={s.heroTitle}>{stay.title}</h1>
          <p className={s.heroLoc}>{stay.location}</p>
        </div>
      </div>

      <div className={s.body}>
        <div className={s.main}>
          <p className={s.lede}>{stay.subtitle}</p>
          <p className={s.desc}>
            Mauly resells this lodge directly &mdash; the price shown is our net rate plus a transparent
            markup, never the partner&rsquo;s own listed price. We confirm availability with the property
            before any payment is taken.
          </p>

          {stay.amenities && (
            <>
              <h2>Amenities</h2>
              <ul className={s.amenities}>
                {stay.amenities.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </>
          )}

          <h2>Rooms &amp; rates</h2>
          {stay.rooms && stay.rooms.length > 0 ? (
            <table className={s.rooms}><tbody>
              {stay.rooms.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}<span className={s.guests}>&middot; sleeps {r.guests}</span></td>
                  <td><Price value={r.price} /><span style={{ fontWeight: 400, fontSize: 11, color: "var(--tanova-muted)" }}>/night</span></td>
                </tr>
              ))}
            </tbody></table>
          ) : (
            <p className={s.desc}>Rates depend on room type, season and length of stay — send us your dates and we&rsquo;ll confirm pricing with the property directly.</p>
          )}

          {stay.gallery && (
            <>
              <h2>Photos</h2>
              <div className={s.gallery}>
                {stay.gallery.map((src, i) => (
                  <div className={s.galleryItem} key={src}>
                    <Image src={src} alt={`${stay.title} — photo ${i + 1}`} fill sizes="(max-width: 900px) 50vw, 33vw" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className={s.aside}>
          <BookingCard stay={stay} availLabel={AVAIL_LABEL[stay.availability]} availClass={AVAIL_CLASS[stay.availability]} />
        </aside>
      </div>
    </div>
  );
}
