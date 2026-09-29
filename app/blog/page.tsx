import BlogBrowser, { type Post } from "./BlogBrowser";
import s from "./page.module.css";

const POSTS: Post[] = [
  { date: "August 18, 2026", category: "Heritage", title: "Tanzanian Food: 12 Must-Try Dishes in Tanzania", img: "/img/zanzibar-island.jpg" },
  { date: "August 17, 2026", category: "Trekking", title: "Kilimanjaro Routes: 7 Best Routes To Climb Mount Kilimanjaro", img: "/img/kilimanjaro-summit-night.jpg" },
  { date: "August 17, 2026", category: "Trekking", title: "7 Mount Kilimanjaro Myths Debunked", img: "", fallbackLabel: "Myths & Facts" },
  { date: "August 16, 2026", category: "Trekking", title: "Climbing Mount Kilimanjaro: Everything You Need to Know", img: "/img/kilimanjaro-summit-night-sm.jpg" },
  { date: "June 11, 2026", category: "Safari", title: "Which Tanzania Safari Has the Best Chance of Seeing Lions?", img: "/img/lion-behaviour.jpg" },
  { date: "June 9, 2026", category: "Safari", title: "Why Elephants Make Tarangire So Special", img: "/img/tarangire-elephants.jpg" },
  { date: "June 7, 2026", category: "Heritage", title: "12 Most Instagrammable Places in Zanzibar", img: "/img/zanzibar-sunset.jpg" },
  { date: "June 5, 2026", category: "Heritage", title: "Best Sunset Spots in Zanzibar", img: "/img/paje-golden-hour.jpg" },
  { date: "June 3, 2026", category: "Trekking", title: "Post-Climb Recovery and Aftercare Kilimanjaro", img: "/img/ol-doinyo-lengai.webp" },
  { date: "June 1, 2026", category: "Trekking", title: "Kilimanjaro Summit Night: What to Expect", img: "/img/kilimanjaro-summit-night.jpg" },
  { date: "May 11, 2026", category: "Safari", title: "Best Time to Visit Tarangire National Park", img: "/img/tarangire-elephants.jpg" },
  { date: "May 9, 2026", category: "Safari", title: "How Many Days Do You Need for a Tanzania Safari?", img: "/img/maasai-lake-natron.webp" },
  { date: "May 7, 2026", category: "Safari", title: "Why Zanzibar Is Known as the Spice Island", img: "/img/zanzibar-island.jpg" },
  { date: "May 5, 2026", category: "Safari", title: "The Best Spice Farms to Visit in Zanzibar", img: "/img/zanzibar-sunset.jpg" },
  { date: "May 3, 2026", category: "Trekking", title: "Ethical Climbing and Responsible Tourism on Kilimanjaro", img: "", fallbackLabel: "Responsible Trekking" },
  { date: "May 1, 2026", category: "Trekking", title: "How to Choose a Kilimanjaro Tour Operator 2026", img: "/img/kilimanjaro-summit-night-sm.jpg" },
  { date: "April 11, 2026", category: "Safari", title: "Guided Safaris vs Self-Drive: Why Guided Wins", img: "/img/lion-behaviour.jpg" },
  { date: "April 9, 2026", category: "Safari", title: "Family Safari vs. Adventure Safari: Which Is Right for You?", img: "/img/flamingos-momella.webp" },
  { date: "April 7, 2026", category: "Retreat", title: "10 Must Visit Historic Sites in Stone Town", img: "/img/zanzibar-island.jpg" },
  { date: "April 5, 2026", category: "Retreat", title: "Nungwi vs Kendwa: Which Zanzibar Beach Is Better?", img: "/img/paje-golden-hour.jpg" },
  { date: "April 3, 2026", category: "Retreat", title: "Food and Nutrition on a Kilimanjaro Trek", img: "/img/kilimanjaro-summit-night.jpg" },
  { date: "April 1, 2026", category: "Trekking", title: "What Accommodation is Like on Kilimanjaro", img: "/img/ol-doinyo-lengai.webp" },
  { date: "March 25, 2026", category: "Safari", title: "Wildebeest Migration Safari: 7 Essential Tips", img: "/img/great-migration.jpg" },
  { date: "March 25, 2026", category: "Safari", title: "Best Time to See the Great Wildebeest Migration", img: "/img/great-migration.jpg" },
  { date: "March 11, 2026", category: "Safari", title: "What to Pack for a Tanzanian Safari", img: "/img/lion-manyara.webp" },
  { date: "December 29, 2025", category: "Safari", title: "Your Safety, Every Step of the Journey", img: "", fallbackLabel: "Traveler Safety", href: "/your-safety" },
];

const TODAY = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export default function BlogPage() {
  return (
    <div className="wrap">
      <div className={s.masthead}>
        <h1 className={s.mastheadTitle}>The Mauly Journal</h1>
        <span className={s.mastheadDate}>{TODAY}</span>
      </div>
      <p className={s.mastheadDek}>Safari guides, Kilimanjaro know-how, and dispatches from across Tanzania — written by the guides who lead the trips.</p>
      <BlogBrowser posts={POSTS} />
    </div>
  );
}
