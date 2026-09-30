import { tanovaGet } from "./tanova/client";
import { getTours, type Tour } from "./tours";

export type Destination = {
  id: number;
  slug: string; title: string; eyebrow: string; tagline: string; image: string; secondaryImage: string;
  intro: string; highlights: { title: string; desc: string }[]; whenToGo: string; gettingThere: string; tourSlugs?: string[];
  activityCount: number;
  lat: number; lng: number;
  /** What sets this region apart from the rest of East Africa — editorial paragraphs. */
  about: string[];
  /** At-a-glance facts (best for, ideal length, nearest airport…). */
  facts: { label: string; value: string }[];
  /** Twelve entries, January first: how good a month is to visit, with a one-line reason. */
  months: SeasonMonth[];
  goodToKnow: string[];
};

/** 1 = green/quiet season · 2 = shoulder · 3 = very good · 4 = peak. */
export type SeasonLevel = 1 | 2 | 3 | 4;
export type SeasonMonth = { level: SeasonLevel; note: string };

/** Truncate at a word boundary — never mid-word — and add an ellipsis only when text was cut. */
export function excerpt(text: string, max = 200): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:.\u2013\u2014-]+$/, "")}\u2026`;
}

const seasons = (levels: string, notes: string[]): SeasonMonth[] =>
  notes.map((note, i) => ({ level: Number(levels[i]) as SeasonLevel, note }));

type Editorial = {
  tagline: string; intro: string; whenToGo: string; gettingThere: string;
  about?: string[]; facts?: { label: string; value: string }[]; months?: SeasonMonth[]; goodToKnow?: string[];
};

/** whenToGo/gettingThere have no equivalent field in the Tanova API at all — this is genuine
 *  editorial copy, kept here rather than invented at request time. tagline/intro are live-first
 *  (the API's own teaser/description, when the portal has them) and only fall back to this
 *  copy when the portal's fields are still empty — see mapDestination() below. Keyed by the
 *  location's real numeric id (stable — a location's id never changes, unlike a derived slug). */
const EDITORIAL: Record<number, Editorial> = {
  11: { // Zanzibar
    tagline: "Zanzibar is a tropical archipelago located off the coast of Tanzania, known for its pristine beaches, turquoise waters, and rich cultural heritage.",
    intro: "Zanzibar is a tropical archipelago located off the coast of Tanzania, known for its pristine beaches, turquoise waters, and rich cultural heritage. The islands offer a unique blend of African, Arab, and Indian influences, making it a fascinating destination to explore. Highlights of Zanzibar include Stone Town, a UNESCO World Heritage Site and the historic heart of the island, featuring winding alleys, bustling markets, and beautiful architecture. The island's beaches offer soft white sand, clear waters, and opportunities for water sports such as snorkelling, diving, and fishing. Zanzibar is also known for its spice plantations, where visitors can learn about the island's history as a major centre of the spice trade.",
    whenToGo: "June–October and December–February are the driest, sunniest windows; water stays warm (26–29°C) year-round.",
    gettingThere: "Zanzibar has its own international airport (ZNZ), with direct flights from Kilimanjaro, Dar es Salaam and several international hubs.",
    about: [
      "What makes Zanzibar different is its layers. Stone Town, a UNESCO World Heritage Site, is a maze of carved doors, coral-stone houses and spice markets shaped by centuries of Swahili, Arab, Indian and European trade. Outside town, spice farms still grow cloves, cinnamon and vanilla, and Jozani Forest shelters the rare red colobus monkey.",
      "The coast then does the rest: powder-white beaches, warm turquoise water, and reefs for snorkelling and diving. It is the natural way to end a safari or a Kilimanjaro climb, with days that are as active or as slow as you like.",
    ],
    facts: [
      { label: "Best for", value: "Beaches, culture, diving, honeymoons" },
      { label: "Ideal length", value: "3 to 5 nights" },
      { label: "Nearest airport", value: "Zanzibar (ZNZ)" },
      { label: "Peak season", value: "June to October, December to February" },
    ],
    months: seasons("443113444343", [
      "Hot, sunny and dry. Calm seas and the warmest water of the year.",
      "Peak beach weather with clear skies. Very good for diving.",
      "Heat and humidity build. The long rains begin late in the month.",
      "Long rains with heavy showers. Many beach lodges close.",
      "Wettest weeks. The quietest time on the island, with the lowest rates.",
      "Dry, breezy and cooler. Excellent for Stone Town and spice tours.",
      "Bright, dry days with steady sea breezes. Popular with kitesurfers.",
      "Peak season. Clear water and long sunny days.",
      "Dry and warm. Good visibility for snorkelling and diving.",
      "Warming up as the season winds down. Fewer crowds.",
      "Short rains arrive, usually in brief afternoon showers.",
      "Hot and busy in the festive season. Book early.",
    ]),
    goodToKnow: [
      "Dress modestly in Stone Town and away from resort beaches. Zanzibar is a majority-Muslim island.",
      "Tides on the east coast are big. Check the timetable if you plan to swim or snorkel.",
      "Combine a safari with the beach: flights link Kilimanjaro, Arusha and Dar es Salaam to the island.",
    ],
  },
  30: { // Northern Tanzania Safari
    tagline: "The classic safari circuit: the Serengeti's endless plains, the Ngorongoro Crater, Tarangire's baobab elephants and Africa's highest peak.",
    intro: "Northern Tanzania is where most people picture Africa: golden plains under acacia silhouettes, elephant herds crossing dry riverbeds, and Kilimanjaro floating above the clouds. Four national parks and one conservation area sit within a day's drive of Arusha, so a single journey can pair the Serengeti with the Ngorongoro Crater, Tarangire and Lake Manyara, and finish with a climb or a coffee-farm walk on Kilimanjaro's slopes.",
    whenToGo: "June to October is the dry season and the classic time to go: animals gather at water, roads are firm and skies are clear. January to March brings the calving season on the southern Serengeti and Ndutu plains. April and May are the green, quiet months with the lowest rates.",
    gettingThere: "Fly into Kilimanjaro International Airport (JRO) or Arusha (ARK). Most itineraries begin in Arusha, and light aircraft link the Serengeti airstrips for those who want to save road time.",
    about: [
      "What makes the north different is concentration. The Serengeti–Mara ecosystem hosts the Great Migration, roughly 1.5 million wildebeest and hundreds of thousands of zebra and gazelle following the rains in a year-round loop, and the Ngorongoro Crater holds one of the densest populations of large mammals anywhere, including the endangered black rhino.",
      "It is also a cultural landscape. Maasai communities live alongside wildlife in the Ngorongoro highlands and around Tarangire, and the fertile slopes of Kilimanjaro and Meru support the Chagga and Meru farming communities. Visits here can include a village walk, a coffee farm or a night in a community-run camp, not only game drives.",
    ],
    facts: [
      { label: "Best for", value: "First safaris, migration, Big Five, photography" },
      { label: "Ideal length", value: "5 to 8 days" },
      { label: "Nearest airport", value: "Kilimanjaro (JRO) or Arusha (ARK)" },
      { label: "Peak season", value: "June to October" },
    ],
    months: seasons("343111444443", [
      "Hot and dry. Calving begins around Ndutu, with predators close behind.",
      "Peak calving on the southern plains. Thousands of newborn wildebeest a day.",
      "Calving tails off as the rains approach. Lush scenery and fewer vehicles.",
      "Long rains. Green and dramatic, but some roads are slow and some camps close.",
      "Wettest weeks. Lowest rates of the year and quiet parks.",
      "The dry season starts. Cool mornings, clear skies and firm roads.",
      "Migration reaches the northern Serengeti. Ideal for Kilimanjaro climbs too.",
      "River crossings at the Mara and Grumeti. Peak safari season.",
      "Dry, dusty and very good for wildlife around waterholes. Fewer people than August.",
      "Still dry, with the herds in the north. Short rains may start late in the month.",
      "Short rains turn the plains green. Quiet lodges and good birdlife.",
      "Herds drift south again. Festive season is busy, so book early.",
    ]),
    goodToKnow: [
      "Nights on the Ngorongoro rim and in the highlands are cold, even in the dry season. Pack a warm layer.",
      "Park fees make up a large share of the cost, and they rise in the peak months.",
      "Combine a safari with a Zanzibar or Mafia beach stay to finish the trip on the coast.",
    ],
  },
  31: { // Southern Tanzania
    tagline: "The wild side of Tanzania: vast, uncrowded parks, boat safaris on the Rufiji and wild chimpanzees beside Lake Tanganyika.",
    intro: "Southern and western Tanzania are for travellers who want wilderness without the traffic. Nyerere, Ruaha and Mikumi offer big game across enormous landscapes, often with a handful of other vehicles in sight, while remote Mahale on the shore of Lake Tanganyika is one of the few places in Africa where you can track wild chimpanzees on foot.",
    whenToGo: "June to October is the best window for game viewing, when animals concentrate at the rivers. Mahale's chimpanzee trekking is at its best in the dry months from May to October. The March to May rains are quiet and green, but several camps in the south close.",
    gettingThere: "Mikumi is about four hours by road from Dar es Salaam. Nyerere and Ruaha are usually reached by light aircraft from Dar es Salaam or Zanzibar. Mahale has no road access: you arrive by scheduled flight and boat.",
    about: [
      "The south is defined by space. Nyerere is one of the largest protected areas in Africa, and Ruaha's baobab-studded hills carry big predator numbers, including lion prides. Few roads and fewer camps mean you can spend an afternoon with a sighting and nobody else.",
      "It is also the best place in Tanzania to do safari differently: by boat on the Rufiji River among hippos and crocodiles, on foot with a ranger, or by trekking chimpanzees through the forest at Mahale. Waterfalls and rainforest in the Udzungwa Mountains add hiking to the mix.",
    ],
    facts: [
      { label: "Best for", value: "Uncrowded wildlife, boat and walking safaris, chimpanzees" },
      { label: "Ideal length", value: "5 to 9 days" },
      { label: "Nearest airport", value: "Dar es Salaam (DAR)" },
      { label: "Peak season", value: "June to October" },
    ],
    months: seasons("222122344422", [
      "Green and warm. Excellent for birds, with lower rates.",
      "Still green. Some tracks are slow, but the scenery is at its best.",
      "Heavy rain. Several camps close and roads become difficult.",
      "The wettest weeks of the year. Most remote camps are closed.",
      "Rains ease and the tracks dry out. Chimpanzee trekking improves.",
      "Dry and clear. Game viewing gets easier every week.",
      "Cool, dry days. Animals gather along the rivers.",
      "Prime game viewing. Boat safaris on the Rufiji are at their best.",
      "Peak dry season, with dependable sightings and few other vehicles.",
      "Hot and very dry. Big concentrations of wildlife at the last water.",
      "Short rains begin. The land turns green quickly.",
      "Warm and green. Quiet, with festive-season demand at the coast.",
    ]),
    goodToKnow: [
      "Distances are long, so light-aircraft transfers save days. Build them into the plan.",
      "Mahale is remote and small-group by nature. Permits and camp space fill early.",
      "Malaria precautions matter here. Speak to your doctor well before you travel.",
    ],
  },
  32: { // Coastal
    tagline: "Indian Ocean islands and the green highlands behind the coast: reefs, dhows, spice-scented history and cool mountain trails.",
    intro: "Tanzania's coast lets a safari trip slow down. Mafia Island offers quiet reefs, whale sharks in season and a marine park that feels a world away from the busier beaches, while the lush Usambara Mountains, a short drive inland from the coast, provide cool forest hikes, viewpoints and village life.",
    whenToGo: "October to March is the best time for diving on Mafia and for whale sharks, with November to February at its peak. June to October is drier and cooler, and best for the Usambara. The long rains from March to May are the quietest and wettest.",
    gettingThere: "Mafia Island is reached by light aircraft from Dar es Salaam, usually a short scheduled flight. The Usambara Mountains are a scenic drive from Moshi or Arusha, or from the coastal town of Tanga.",
    about: [
      "The coast is where East Africa meets the wider Indian Ocean world. Swahili culture, dhow sailing and centuries of trade with Arabia and India shape the food, the architecture and the pace of life. It is a place to snorkel, dive and unwind after the effort of a safari.",
      "Just inland, the Usambara Mountains reveal a completely different Tanzania: terraced farms, misty forest, rare endemic plants and birds, and viewpoints that drop away to the plains. Together, the islands and the highlands make an easy, restorative counterpoint to the parks.",
    ],
    facts: [
      { label: "Best for", value: "Diving, snorkelling, relaxing, hiking, culture" },
      { label: "Ideal length", value: "3 to 5 days" },
      { label: "Nearest airport", value: "Dar es Salaam (DAR)" },
      { label: "Peak season", value: "November to February" },
    ],
    months: seasons("443113333344", [
      "Hot and calm. Excellent visibility for diving and whale-shark encounters.",
      "Peak island season. Warm water and light winds.",
      "Heat builds and rains start. Reefs are still good early in the month.",
      "Long rains. Heavy showers, with many lodges on the coast closed.",
      "Very wet. Best for those who want a quiet green escape.",
      "Dry, breezy and cooler. Good conditions in the Usambara.",
      "Cool and dry. Clear mountain views and pleasant beaches.",
      "Clear skies and steady sea breezes. Good for dhow sailing.",
      "Dry and warm. Good visibility on the reefs.",
      "Water warms and whale sharks begin to arrive around Mafia.",
      "Whale-shark season, with warm water and only occasional showers.",
      "Hot, sunny and popular. Whale sharks stay until March.",
    ]),
    goodToKnow: [
      "The Usambara is cool and can be damp. Bring a light rain jacket and walking shoes.",
      "Whale-shark sightings are seasonal and never guaranteed. Book several days on Mafia.",
      "Pair with a safari: a few beach nights work well after a long game-drive run.",
    ],
  },
  33: { // Rwanda
    tagline: "Mountain gorillas in the Virunga volcanoes, golden monkeys and a green, orderly country that makes travel easy.",
    intro: "Rwanda is compact, safe and beautifully organised, and it offers one of the great wildlife encounters on earth: an hour spent with a family of mountain gorillas in the mist-covered forest of Volcanoes National Park. Add golden monkeys, a hike to Dian Fossey's old research site, and time in village communities around Musanze.",
    whenToGo: "June to September and December to February are the driest windows, when trails are firmer and volcano views clearer. Gorillas are trekked all year, so the wet months of March to May and October to November remain worthwhile if you are ready for muddy trails.",
    gettingThere: "Fly into Kigali (KGL). Volcanoes National Park is about two hours from the capital by road. Rwanda pairs well with a northern Tanzania safari for a combined gorilla-and-big-game trip.",
    about: [
      "What makes Rwanda different is how much is concentrated in a small area. Mountain gorillas live in only a few forests in the world, and Rwanda's conservation effort is credited with helping their numbers recover. Trekking is tightly controlled, with limited daily permits, so each family is visited by only a few people at a time.",
      "The experience goes beyond the gorillas. Rwanda is known for clean cities, terraced hills and community tourism that returns money to the villages next to the park. Visits include cultural encounters with dance, craft and farming traditions.",
    ],
    facts: [
      { label: "Best for", value: "Gorilla trekking, primates, community culture" },
      { label: "Ideal length", value: "3 to 4 days" },
      { label: "Nearest airport", value: "Kigali (KGL)" },
      { label: "Peak season", value: "June to September" },
    ],
    months: seasons("333111444423", [
      "Short dry spell. Easier trails and good volcano views.",
      "Dry and clear, with good trekking conditions.",
      "The long rains begin. Trails are wet and muddy.",
      "Wettest month. Fewest visitors and misty forests.",
      "Rain continues, easing toward the end of the month.",
      "Dry season begins. Firm trails and clear skies.",
      "Dry and pleasant. Very good for trekking.",
      "Peak trekking. Book permits well in advance.",
      "Dry and clear. Excellent volcano views.",
      "Short rains start. Greener forest and thinner crowds.",
      "Rains continue but usually as brief showers.",
      "The dry spell returns and holiday demand picks up.",
    ]),
    goodToKnow: [
      "Gorilla permits are limited and sell out for peak months. Book as early as you can.",
      "Trekking can mean one to several hours of steep walking at altitude. Choose a fitness level to match.",
      "Bring waterproof boots, gardening gloves and long sleeves for the nettles and mud.",
    ],
  },
  34: { // Kenya
    tagline: "The Maasai Mara's open plains, the migration's dramatic river crossings, and Nairobi's wildlife orphanages and lakes.",
    intro: "Kenya is the home of the classic safari and a natural companion to a Tanzanian journey. A Kenyan route often begins in Nairobi with elephant and giraffe encounters, moves to Lake Nakuru's flamingos and rhino sanctuary, and ends on the Maasai Mara, one of the finest wildlife landscapes on the continent.",
    whenToGo: "July to October is when the Great Migration is in the Mara, with the dramatic river crossings peaking in August and September. January and February are hot and dry and very good for big cats. The long rains of April and May are the quietest time.",
    gettingThere: "Fly into Nairobi's Jomo Kenyatta International (NBO). The Mara is roughly a five- to six-hour drive from the capital, or a short scheduled flight to a Mara airstrip.",
    about: [
      "The Maasai Mara is the northern end of the same ecosystem as the Serengeti, and it is where the herds famously cross the Mara River. Its rolling grassland makes sightings easy, and its conservancies limit vehicle numbers and allow night drives and walking safaris.",
      "Kenya adds things you will not find in Tanzania: the Sheldrick Elephant Orphanage and Giraffe Centre in Nairobi, Lake Nakuru's rhino-friendly woodland, and a long tradition of Maasai-led conservancies where local landowners share in tourism income.",
    ],
    facts: [
      { label: "Best for", value: "Migration crossings, big cats, conservation visits" },
      { label: "Ideal length", value: "4 to 7 days" },
      { label: "Nearest airport", value: "Nairobi (NBO)" },
      { label: "Peak season", value: "July to October" },
    ],
    months: seasons("332113444423", [
      "Hot and dry. Good big-cat viewing in short grass.",
      "Dry and warm, with excellent predator sightings.",
      "The rains start. Green plains and fewer vehicles.",
      "Long rains. Some camps close and roads are muddy.",
      "Wet and quiet. Lowest rates of the year.",
      "Dry season returns. The herds start to gather.",
      "The migration begins arriving in the Mara.",
      "Peak river crossings and peak demand. Book early.",
      "Herds are still in the Mara. Dry, dusty and busy.",
      "The herds begin moving back south. Fewer visitors.",
      "Short rains bring green grass and birdlife.",
      "Festive-season demand. Dry days return.",
    ]),
    goodToKnow: [
      "Kenya and Tanzania have separate visas and border procedures. Plan combined trips with your specialist.",
      "River crossings cannot be predicted to the day. Allow several nights in the Mara to improve your chances.",
      "Nairobi traffic is heavy. Allow generous transfer times on arrival and departure days.",
    ],
  },

  13: { // Mount Kilimanjaro
    tagline: "", intro: "",
    whenToGo: "June to October and January to February are the clearest, most popular climbing windows.",
    gettingThere: "Most climbs start from Moshi or Arusha, both about an hour from Kilimanjaro International Airport (JRO).",
  },
  14: { // Serengeti National Park
    tagline: "", intro: "",
    whenToGo: "June–July for the dramatic Grumeti river crossings; December–March for calving season on the southern plains.",
    gettingThere: "Light-aircraft flights connect Arusha and Kilimanjaro to airstrips within the park, or a scenic 6–7 hour drive via Ngorongoro.",
  },
  15: { // Ngorongoro
    tagline: "The world's largest intact volcanic caldera: a natural amphitheatre of wildlife that lives together on one crater floor.",
    intro: "The Ngorongoro Crater is a collapsed volcano about 20 km across and 600 m deep, and its floor is a self-contained ecosystem of grassland, swamp, forest and soda lake. Lions, elephants, buffalo, hippos and one of Africa's few reliable populations of black rhino share the space, and you can watch them from the crater rim in the morning mist.",
    whenToGo: "Good all year, since the crater's wildlife lives there permanently. June to October offers the clearest skies and firmest tracks. November to May is greener with fewer vehicles, though April and May can be muddy. Rim temperatures are cool year-round.",
    gettingThere: "Roughly a three- to four-hour drive from Arusha, usually as part of a northern circuit with the Serengeti, Tarangire and Lake Manyara.",
    about: [
      "What makes Ngorongoro different is the scale and closeness of the wildlife in a single bowl. The steep walls keep most animals inside all year, so sightings do not depend on migration. A half-day descent can produce lions, hyenas, flamingos on Lake Magadi and, with luck, a black rhino.",
      "It is a UNESCO World Heritage Site and a multi-use conservation area where Maasai pastoralists still graze livestock on the highlands. Beyond the crater, the area offers walks to Olmoti, Empakaai and the ancient Olduvai Gorge, where early-human fossils were found.",
    ],
    facts: [
      { label: "Best for", value: "Big Five, black rhino, photography" },
      { label: "Ideal length", value: "1 to 2 nights" },
      { label: "Nearest airport", value: "Arusha (ARK) or Kilimanjaro (JRO)" },
      { label: "Peak season", value: "June to October" },
    ],
    months: seasons("332114444432", [
      "Warm and green. Good for birds and for calves on the rim.",
      "Dry spell with good visibility across the crater floor.",
      "The rains start. Green scenery and fewer vehicles.",
      "Long rains. Some descent roads can be slippery.",
      "Wet and misty. The quietest time on the rim.",
      "Dry, cool and clear. The best light for photography.",
      "Dry and crisp. Peak season, with cold nights on the rim.",
      "Consistently dry with excellent visibility.",
      "Clear skies, and rhinos and lions are easy to find on the dry floor.",
      "Still dry. Vehicle numbers ease off toward the end of the month.",
      "Short rains green the crater. Excellent value.",
      "Cool, green and festive. Book early for the holidays.",
    ]),
    goodToKnow: [
      "Crater descents have a fixed time window and fee, so plan for an early start.",
      "The rim is about 2,300 m. Nights are cold, and mist is common in the morning.",
      "Pair with the Serengeti or Tarangire, as the crater is best in one full day.",
    ],
  },
  16: { // Arusha
    tagline: "", intro: "",
    whenToGo: "Pleasant most of the year at this altitude — June–October is driest for day trips into the surrounding parks.",
    gettingThere: "Arusha is the northern-circuit's hub, a short drive from Kilimanjaro International Airport (JRO).",
  },
  17: { // Tarangire National Park
    tagline: "", intro: "",
    whenToGo: "June–October (dry season) brings the best wildlife viewing as animals concentrate near the river; the wetter months (November–May) reward visitors with lush scenery and strong birdlife.",
    gettingThere: "Tarangire sits about 115km southwest of Arusha — a 2.5–3 hour drive, or a short flight into Kuro Airstrip.",
  },
  20: { // Lake Manyara National Park
    tagline: "", intro: "",
    whenToGo: "June–October (dry season) concentrates wildlife along the lake shore; the wet season brings lush scenery and strong birdlife.",
    gettingThere: "A 1.5-hour drive from Arusha, often combined with Tarangire and Ngorongoro on the northern circuit.",
  },
  22: { // Lushoto (Usambara)
    tagline: "", intro: "",
    whenToGo: "Year-round — the cooler highland climate holds steady, with June–October driest for trekking.",
    gettingThere: "A scenic 2–3 hour drive from Moshi or Arusha into the Usambara foothills.",
  },
  23: { // Mkomazi National Park
    tagline: "", intro: "",
    whenToGo: "June to October offers the clearest game viewing as vegetation thins.",
    gettingThere: "A scenic 4–5 hour drive from Moshi or Arusha, or a light-aircraft charter.",
  },
  26: { // Lake Natron
    tagline: "", intro: "",
    whenToGo: "June to February is generally the driest window for the volcano hike and flamingo viewing.",
    gettingThere: "A rugged 3–4 hour drive from Arusha into the Rift Valley.",
  },
  27: { // Materuni
    tagline: "", intro: "",
    whenToGo: "Year-round — the waterfall and coffee-farm walks near Moshi aren't heavily seasonal.",
    gettingThere: "A short drive from Moshi, often paired with a Kilimanjaro-area day trip.",
  },
};

type ApiDestination = {
  id: number;
  name: string;
  teaser: string | null;
  description: string | null;
  image: string | null;
  lat: number;
  lng: number;
  counts: { activities: number; packages: number; stays: number; transports: number };
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function mapDestination(d: ApiDestination, tours: Tour[]): Destination {
  const linked = tours.filter((t) => t.locationId === d.id);
  const ed = EDITORIAL[d.id];
  const fallbackImg = linked[0]?.img ?? d.image ?? "/img/tarangire-elephants.jpg";
  return {
    id: d.id,
    slug: slugify(d.name),
    title: d.name,
    eyebrow: "Tanzania",
    tagline: d.teaser || ed?.tagline || "",
    intro: d.description || ed?.intro || "",
    whenToGo: ed?.whenToGo ?? "",
    gettingThere: ed?.gettingThere ?? "",
    image: d.image ?? fallbackImg,
    secondaryImage: linked[1]?.img ?? fallbackImg,
    highlights: linked.slice(0, 3).map((t) => ({ title: t.title, desc: excerpt(t.summary, 190) })),
    about: ed?.about ?? [],
    facts: ed?.facts ?? [],
    months: ed?.months ?? [],
    goodToKnow: ed?.goodToKnow ?? [],
    tourSlugs: linked.map((t) => t.slug),
    activityCount: d.counts.activities,
    lat: d.lat,
    lng: d.lng,
  };
}

/** Live destinations — every location the portal has something published in (GET
 *  /destinations), enriched with that location's real, currently-live tours (matched by
 *  location id, not fuzzy text) for highlights/tourSlugs/photos. A tour added under a
 *  destination shows up here automatically; one removed drops out just as fast. */
export async function getDestinations(): Promise<Destination[]> {
  const [res, tours] = await Promise.all([
    tanovaGet<{ data: { destinations: ApiDestination[] } }>("/destinations"),
    getTours(),
  ]);
  return res.data.destinations
    .filter((d) => d.counts.activities > 0 || EDITORIAL[d.id])
    .map((d) => mapDestination(d, tours));
}

export async function getDestination(slug: string): Promise<Destination | undefined> {
  const destinations = await getDestinations();
  return destinations.find((d) => d.slug === slug);
}
