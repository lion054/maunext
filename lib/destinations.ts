export type Destination = {
  slug: string; title: string; eyebrow: string; tagline: string; image: string; secondaryImage: string;
  intro: string; highlights: { title: string; desc: string }[]; whenToGo: string; gettingThere: string; tourSlugs?: string[];
  lat: number; lng: number;
};

/** Live catalogue, fetched from the Tanova Vendor API (GET /destinations) on 2026-09-29.
 *  No highlights/whenToGo/gettingThere data exists in the API — left empty rather than
 *  invented; the destination detail page hides those sections when empty. Ngorongoro has
 *  no linked tour photos in the API, so it reuses real photos already sourced from the
 *  WordPress site earlier in this project. */
export const DESTINATIONS: Destination[] = [
  {
    slug: "zanzibar", title: "Zanzibar", eyebrow: "Tanzania", lat: -6.1659, lng: 39.2026,
    tagline: "Zanzibar is a tropical archipelago located off the coast of Tanzania, known for its pristine beaches, turquoise waters, and rich cultural heritage.",
    image: "/img/real-api/tours/turquoise-temptation-zanzibar-tour/1.webp", secondaryImage: "/img/real-api/tours/turquoise-temptation-zanzibar-tour/1.webp",
    intro: "Zanzibar is a tropical archipelago located off the coast of Tanzania, known for its pristine beaches, turquoise waters, and rich cultural heritage. The islands offer a unique blend of African, Arab, and Indian influences, making it a fascinating destination to explore. Highlights of Zanzibar include Stone Town, a UNESCO World Heritage Site and the historic heart of the island, featuring winding alleys, bustling markets, and beautiful architecture. The island's beaches offer soft white sand, clear waters, and opportunities for water sports such as snorkelling, diving, and fishing. Zanzibar is also known for its spice plantations, where visitors can learn about the island's history as a major centre of the spice trade.",
    highlights: [{ title: "Turquoise Temptation - Zanzibar Tour", desc: "A beach-and-culture Zanzibar itinerary covering Stone Town's UNESCO-listed old quarter, a spice plantation tour, wildlife viewing for red colobus monkeys in…" }],
    whenToGo: "June–October and December–February are the driest, sunniest windows; water stays warm (26–29°C) year-round.",
    gettingThere: "Zanzibar has its own international airport (ZNZ), with direct flights from Kilimanjaro, Dar es Salaam and several international hubs.",
    tourSlugs: ["turquoise-temptation-zanzibar-tour"],
  },
  {
    slug: "mount-kilimanjaro", title: "Mount Kilimanjaro", eyebrow: "Tanzania", lat: -3.0674, lng: 37.3556,
    tagline: "",
    image: "/img/real-api/tours/8-day-kilimanjaro-group-trek-via-lemosho-route/1.webp", secondaryImage: "/img/real-api/tours/8-day-kilimanjaro-group-trek-via-lemosho-route/2.jpg",
    intro: "",
    highlights: [{ title: "8-Day Kilimanjaro Group Trek via Lemosho Route", desc: "A fixed-date, small-group ascent of Mount Kilimanjaro via the Lemosho route, run over 8 days on set joining dates rather than a private booking — travelers…" }, { title: "Rescue Kilimanjaro Snow", desc: "A climate-focused volunteering program built around Kilimanjaro's retreating glaciers, combining tree planting in deforested zones with basic climate field…" }, { title: "Shira Discovery", desc: "A short, two-day taste of Kilimanjaro trekking that climbs through montane forest and moorland to camp overnight at Shira 1, with an optional…" }],
    whenToGo: "June to October and January to February are the clearest, most popular climbing windows.",
    gettingThere: "Most climbs start from Moshi or Arusha, both about an hour from Kilimanjaro International Airport (JRO).",
    tourSlugs: ["8-day-kilimanjaro-group-trek-via-lemosho-route", "7-day-kilimanjaro-group-trek-via-lemosho-route", "7-day-kilimanjaro-group-trek-via-machame-route", "6-day-kilimanjaro-group-trek-via-marangu-route", "6-day-kilimanjaro-group-trek-via-machame-route", "shira-discovery", "teaching-awareness-volunteering", "clinical-health-provider-volunteering-in-tanzania", "public-health-trainer", "marangu-route-8-day-adventure-to-the-kilimanjaro-summit", "machame-route-8-day-adventure-to-conquer-kilimanjaro", "lemosho-route-10-day-adventure-to-the-summit-of-mt-kilimanjaro", "umbwe-route-6-day-challenge-to-the-summit-of-mt-kilimanjaro", "tree-nursery-development-management", "rongai-route-kilimanjaro-trek", "shira-route-kilimanjaro-trek", "rescue-kilimanjaro-snow"],
  },
  {
    slug: "serengeti-national-park", title: "Serengeti National Park", eyebrow: "Tanzania", lat: -2.3333, lng: 34.5833,
    tagline: "",
    image: "/img/real-api/tours/8-day-northern-circuit-group-trek/1.webp", secondaryImage: "/img/real-api/tours/8-day-northern-circuit-group-trek/2.jpg",
    intro: "",
    highlights: [{ title: "Migration Wilderness Wanderlust", desc: "An eight-day safari across four of northern Tanzania's premier parks, timed to catch the Great Migration in the Serengeti alongside game drives in…" }, { title: "Luxury Golf & Serengeti Migration Safari", desc: "A niche itinerary pairing two rounds of golf at the Kilimanjaro Golf Estate with a Great Migration safari through the Serengeti, Ngorongoro Crater and…" }, { title: "Ndutu Life Awakens", desc: "A safari timed to the wildebeest calving season, when hundreds of thousands of calves are born on the Ndutu plains between late January and early March. The…" }],
    whenToGo: "June–July for the dramatic Grumeti river crossings; December–March for calving season on the southern plains.",
    gettingThere: "Light-aircraft flights connect Arusha and Kilimanjaro to airstrips within the park, or a scenic 6–7 hour drive via Ngorongoro.",
    tourSlugs: ["8-day-northern-circuit-group-trek", "luxury-golf-serengeti-migration-safari", "migration-wilderness-wanderlust", "grand-tanzanian-journey", "ndutu-migration-safari", "ndutu-life-awakens"],
  },
  {
    slug: "ngorongoro", title: "Ngorongoro", eyebrow: "Tanzania", lat: -3.1667, lng: 35.4167,
    tagline: "",
    image: "/img/real/destinations/ngorongoro-crater/1.jpg", secondaryImage: "/img/real/destinations/ngorongoro-crater/2.jpg",
    intro: "",
    highlights: [{ title: "Big Five in a Day", desc: "One of the most reliable places in Africa to see lion, leopard, elephant, buffalo and the endangered black rhino on a single crater-floor game drive." }, { title: "Lake Magadi", desc: "A shallow soda lake on the crater floor that draws large flocks of flamingos, especially in the wetter months." }, { title: "Maasai Highlands", desc: "The surrounding conservation area is also home to Maasai communities, who still graze livestock within its boundaries." }],
    whenToGo: "Good year-round thanks to the crater's self-contained wildlife population — June–September offers the clearest skies for photography.",
    gettingThere: "A 2–3 hour drive from Arusha, usually combined with the Serengeti and Lake Manyara as part of the northern circuit.",
  },
  {
    slug: "arusha", title: "Arusha", eyebrow: "Tanzania", lat: -3.3667, lng: 36.6833,
    tagline: "",
    image: "/img/real-api/tours/lake-dreams/1.webp", secondaryImage: "/img/real-api/tours/lake-dreams/2.webp",
    intro: "",
    highlights: [{ title: "Lake Dreams", desc: "A single-day outing in Arusha National Park that opens with an early canoe paddle on the Momella Lakes, followed by a guided nature walk, a picnic lunch,…" }, { title: "4 Days Mount Meru", desc: "A slightly longer, more gradual ascent of Mount Meru than the 3-day option, giving extra time for forest walks and wildlife viewing in Arusha National Park…" }, { title: "Wild Ecology Conservation Program", desc: "A conservation volunteering program covering wildlife monitoring, habitat restoration and climate-change field research around Kilimanjaro's ecosystems,…" }],
    whenToGo: "Pleasant most of the year at this altitude — June–October is driest for day trips into the surrounding parks.",
    gettingThere: "Arusha is the northern-circuit's hub, a short drive from Kilimanjaro International Airport (JRO).",
    tourSlugs: ["lake-dreams", "peak-perfection", "wild-ecology-conservation-program", "4-days-mount-meru", "3-days-mount-meru", "cycling-and-tree-planting-volunteering-program", "arts-and-sports-volunteering-in-tanzania"],
  },
  {
    slug: "tarangire-national-park", title: "Tarangire National Park", eyebrow: "Tanzania", lat: -2.7333, lng: 35.8833,
    tagline: "",
    image: "/img/real-api/tours/tanzanian-trio-safari-tarangire-manyara-ngorongoro-expedition/1.webp", secondaryImage: "/img/real-api/tours/tanzanian-trio-safari-tarangire-manyara-ngorongoro-expedition/2.jpg",
    intro: "",
    highlights: [{ title: "Massive Elephant Congregations", desc: "During dry season the park draws enormous elephant herds, sometimes over 300 animals, around the river." }, { title: "Exceptional Bird Diversity", desc: "With more than 550 recorded species, it's one of Tanzania's premier destinations for birdwatchers." }, { title: "Iconic Baobab Landscapes", desc: "Ancient baobab trees punctuate the terrain, giving the park its distinctive, photogenic character." }],
    whenToGo: "June–October (dry season) brings the best wildlife viewing as animals concentrate near the river; the wetter months (November–May) reward visitors with lush scenery and strong birdlife.",
    gettingThere: "Tarangire sits about 115km southwest of Arusha — a 2.5–3 hour drive, or a short flight into Kuro Airstrip.",
    tourSlugs: ["tanzanian-trio-safari-tarangire-manyara-ngorongoro-expedition"],
  },
  {
    slug: "lake-manyara-national-park", title: "Lake Manyara National Park", eyebrow: "Tanzania", lat: -3.4, lng: 35.8333,
    tagline: "",
    image: "/img/real-api/tours/manyara-explorers-delight-3-day-wildlife-and-culture-safari/1.webp", secondaryImage: "/img/real-api/tours/manyara-explorers-delight-3-day-wildlife-and-culture-safari/1.webp",
    intro: "",
    highlights: [{ title: "Manyara Explorer's Delight: 3-Day Wildlife and Culture Safari", desc: "A short Arusha-based safari to Lake Manyara National Park featuring a treetop canopy walk, sunrise and morning game drives for Big Five sightings, and a…" }],
    whenToGo: "June–October (dry season) concentrates wildlife along the lake shore; the wet season brings lush scenery and strong birdlife.",
    gettingThere: "A 1.5-hour drive from Arusha, often combined with Tarangire and Ngorongoro on the northern circuit.",
    tourSlugs: ["manyara-explorers-delight-3-day-wildlife-and-culture-safari"],
  },
  {
    slug: "lushoto-usambara", title: "Lushoto (Usambara)", eyebrow: "Tanzania", lat: -4.4333, lng: 38.3,
    tagline: "",
    image: "/img/real-api/tours/usambara-wonders-from-peaks-to-waterfalls/1.webp", secondaryImage: "/img/real-api/tours/usambara-wonders-from-peaks-to-waterfalls/1.webp",
    intro: "",
    highlights: [{ title: "Usambara Wonders - From Peaks to Waterfalls", desc: "A nature-and-culture trip through the Usambara Mountains based in Lushoto, with a sunset stop at Irente Viewpoint, a guided hike through Magamba Forest…" }],
    whenToGo: "Year-round — the cooler highland climate holds steady, with June–October driest for trekking.",
    gettingThere: "A scenic 2–3 hour drive from Moshi or Arusha into the Usambara foothills.",
    tourSlugs: ["usambara-wonders-from-peaks-to-waterfalls"],
  },
  {
    slug: "mkomazi-national-park", title: "Mkomazi National Park", eyebrow: "Tanzania", lat: -3.6667, lng: 37.8333,
    tagline: "",
    image: "/img/real-api/tours/the-safari-oasis/1.webp", secondaryImage: "/img/real-api/tours/the-safari-oasis/1.webp",
    intro: "",
    highlights: [{ title: "The Safari Oasis", desc: "A short getaway pairing relaxed tented time at Lake Chala, with a private chef preparing meals, and active game viewing at Mkomazi National Park including a…" }],
    whenToGo: "June to October offers the clearest game viewing as vegetation thins.",
    gettingThere: "A scenic 4–5 hour drive from Moshi or Arusha, or a light-aircraft charter.",
    tourSlugs: ["the-safari-oasis"],
  },
  {
    slug: "lake-natron", title: "Lake Natron", eyebrow: "Tanzania", lat: -2.3333, lng: 36,
    tagline: "",
    image: "/img/real-api/tours/lengais-legacy/1.webp", secondaryImage: "/img/real-api/tours/lengais-legacy/1.webp",
    intro: "",
    highlights: [{ title: "Lengai's Legacy", desc: "A Rift Valley adventure combining Maasai cultural immersion at Africa Amini Maasai Lodge, exploration of the surreal Lake Natron landscape, a climb up the…" }],
    whenToGo: "June to February is generally the driest window for the volcano hike and flamingo viewing.",
    gettingThere: "A rugged 3–4 hour drive from Arusha into the Rift Valley.",
    tourSlugs: ["lengais-legacy"],
  },
  {
    slug: "materuni", title: "Materuni", eyebrow: "Tanzania", lat: -3.25, lng: 37.2833,
    tagline: "",
    image: "/img/real-api/tours/moshi-tuk-tuk-tour-3-day-cultural-and-nature-adventure/1.webp", secondaryImage: "/img/real-api/tours/moshi-tuk-tuk-tour-3-day-cultural-and-nature-adventure/1.webp",
    intro: "",
    highlights: [{ title: "Moshi Tuk Tuk Tour: 3-Day Cultural and Nature Adventure", desc: "A tuk-tuk-based city and countryside tour around Moshi, Tanzania's coffee-growing gateway town to Kilimanjaro. It mixes a town tour of markets, churches and…" }],
    whenToGo: "Year-round — the waterfall and coffee-farm walks near Moshi aren't heavily seasonal.",
    gettingThere: "A short drive from Moshi, often paired with a Kilimanjaro-area day trip.",
    tourSlugs: ["moshi-tuk-tuk-tour-3-day-cultural-and-nature-adventure"],
  },
];

export function getDestination(slug: string) {
  return DESTINATIONS.find((d) => d.slug === slug);
}