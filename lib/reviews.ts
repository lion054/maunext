export type Review = {
  name: string;
  initials: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  tourSlug?: string;
};

/** Real TripAdvisor reviews for Mauly Tours & Safaris, scraped from the live site's own
 *  Trustindex-powered widget (mauly-tours.com) on 2026-09-29 — the same 10 reviews it
 *  serves, including the ones left in German, French and Portuguese as originally posted.
 *  All 10 are 5-star; avatar images are the reviewers' own real TripAdvisor profile photos. */
export const REVIEWS: Review[] = [
  {
    name: "Dhaval D", initials: "DD", rating: 5, date: "June 2026", title: "10 out of 10 experience!",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e8/24/default-avatar-2020-60.jpg?w=1200&h=1200&s=1",
    body: "We had an incredible safari experience with Mauly Tours, and a big reason for that was the outstanding work of both Samira and Samuel. This was actually our second trip with Mauly Tours, and there's a reason we came back. Before we even arrived in Tanzania, Samira made the entire planning process easy and stress-free — every question was answered quickly, every detail thoughtfully arranged. Once our safari began, Samuel brought the experience to life: knowledgeable, patient, and genuinely passionate. We saw lions, elephants, zebras, buffalo and countless other animals, and he took the time to explain their behaviors rather than just spot them. Having now traveled with Mauly Tours twice, they'll be our first call next time we're planning a trip to Tanzania.",
  },
  {
    name: "Sandy S", initials: "SS", rating: 5, date: "March 2026", title: "Hakuna Matata / Gipfelglück!",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b7/0a/07/caption.jpg?w=978&h=978&s=1",
    body: "Es war ein unvergessliches Abenteuer zum höchsten Berg Afrikas, dem Uhuru Peak 5895m (Kilimanjaro) über die Lemosho Route (Northern Circuit) mit Mauly Tours! Tolles Land, tolle Landschaft, tolles Team, tolle Organisation, super leckere Verpflegung. Alle waren immer für einen da! Danke für dieses unvergessliche Abenteuer❤️",
  },
  {
    name: "Erona I", initials: "EI", rating: 5, date: "January 2026", title: "INCROYABLE",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e2/e6/default-avatar-2020-45.jpg?w=1200&h=1200&s=1",
    body: "L'expérience était incroyable. Tout était parfait. Notre guide Karim juste incroyable qui connaissait parfaitement son métier et à répondu à toutes nos questions et attentes très à l'écoute bienveillant positive et souriant. Encore merci à lui.",
  },
  {
    name: "Odyssey05054565539", initials: "OD", rating: 5, date: "January 2026", title: "Succesful ascent of Uhuru Peak with Mauly",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/f4/5d/default-avatar-2020-32.jpg?w=1200&h=1200&s=1",
    tourSlug: "8-day-kilimanjaro-group-trek-via-lemosho-route",
    body: "In January 2026, my son Fabian (24) and I (60) climbed Uhuru Peak/Kilimanjaro with Mauly Tours. From the initial contact via the info address to the presentation of the certificate for the successful ascent, every step was excellently organized. Enquiries were often answered in less than an hour. We were picked up at the airport and the 8-day Lemosho tour was conducted by a friendly team with great attention to detail. Not only did we successfully reach the summit without suffering from altitude sickness, we also made friends — and that counts for even more.",
  },
  {
    name: "Daiva V", initials: "DV", rating: 5, date: "January 2026", title: "Unforgetable moments of safari in Tanzania",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e4/2d/default-avatar-2020-48.jpg?w=1200&h=1200&s=1",
    body: "Eunice was an excellent contact for us. She always responded promptly, was extremely helpful, and very hospitable. We had many questions during our planning, and she handled everything professionally and kindly. Highly recommended. Aaron — our driver — was professional and tried to do the best experience for us. A lot of pictures and amazing moments of safari to remember.",
  },
  {
    name: "Alécio", initials: "AL", rating: 5, date: "January 2026", title: "VIAGEM ESPETACULAR",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e3/6a/default-avatar-2020-47.jpg?w=1200&h=1200&s=1",
    body: "Participei de safaris em dois parques nacionais da Tanzânia - Tarangire e Ngorongoro - em um programa montado exclusivamente para mim. Todo o passeio foi muito organizado e o guia que me atendeu, muito profissional. As acomodações onde pernoitei eram de ótima qualidade. O passeio foi inesquecível! Além disso, achei o preço justo. Valeu muito a pena! Recomendo, sem ressalvas, a Mauly Tours & Safaris.",
  },
  {
    name: "Alice W", initials: "AW", rating: 5, date: "November 2025", title: "A life changing safari experience with the most exceptional team",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/55/50/a0/alice-w.jpg?w=253&h=253&s=1",
    body: "My experience with Mauly Tours was extraordinary from the very first message. This is not just a tour company — it is a family operated team that pours heart, intention and genuine care into every part of the process. Samira was the first point of contact and immediately set the tone: professionalism, warmth and patience through several changes in plans. Aron, our guide in Tarangire, was exceptional — his knowledge of wildlife behavior and the ecosystem was remarkable, but it was his intuition, patience and presence that set him apart. Every detail felt intentional rather than transactional. I'll absolutely be returning and recommending them.",
  },
  {
    name: "Chris", initials: "CH", rating: 5, date: "November 2025", title: "A dream has become reality",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e9/bb/default-avatar-2020-65.jpg?w=1200&h=1200&s=1",
    body: "Climbing Kilimanjaro was a lifelong dream, and Mauly Tours made it a reality. From the moment we arrived at the airport until the moment we left, everything was perfectly taken care of. A huge thank you to Aubrey and Mathi for their incredible guidance, to James for the food that kept us energized every day, and to Elia for making sure we always had everything we needed. None of this would have been possible without the amazing porters — their strength and positive spirit carried us all the way to the summit and back. With Mauly Tours, you “just” have to walk, eat, and stay positive. Pole pole — hakuna matata.",
  },
  {
    name: "Lessparling", initials: "LS", rating: 5, date: "October 2025", title: "Fantastic Safari Experience with best driver guide in Tanzania",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/f1/42/default-avatar-2020-20.jpg?w=1200&h=1200&s=1",
    body: "Our safari experience was absolutely fantastic, mainly thanks to our exceptional driver and guide, Lyimo. He had excellent knowledge of all 3 safari parks we visited, and seemed to intuitively know exactly where we needed to be — lions, elephants, hippos, even a rare leopard sighting. He navigated challenging roads with skill and confidence, keeping in touch with fellow guides to ensure no opportunities were missed. Professional, friendly, and incredibly knowledgeable — our safari wouldn't have been the same without him. Les and Pauline Sparling, Ireland.",
  },
  {
    name: "Carla F", initials: "CF", rating: 5, date: "October 2025", title: "It was their incredible team that made us reach the summit of Kilimanjaro!",
    avatar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f6/e5/2b/default-avatar-2020-52.jpg?w=1200&h=1200&s=1",
    body: "Summiting Kilimanjaro is probably one of the most amazing things we have ever done and it wouldn't have been possible without Mauly. Our guides Aubray and Juma, our waiter Pamfili, our chef James and all the amazing porters really made it happen with us together. It was hard, but honestly with the pole pole pace even me and my dad (who are not very hardcore extreme hikers) made it to the top, so I can genuinely just recommend this to anyone. The feeling standing at the summit above the clouds while the sun is rising is indescribable — you had to be there!",
  },
];

export function reviewsForTour(slug: string, fallbackCount = 3) {
  const matched = REVIEWS.filter((r) => r.tourSlug === slug);
  if (matched.length > 0) return matched;
  return REVIEWS.slice(0, fallbackCount);
}
