import HomeClient from "./HomeClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://evwheels.in";

// ── Homepage-specific metadata (overrides root layout defaults) ──────────────
export const metadata = {
  title: {
    absolute: "EVWheels — Buy Electric Cycles & E-Bikes in Patna, Bihar",
  },
  description:
    "Shop certified electric cycles, e-bikes and EV accessories in Patna, Bihar. 90–110 km range, 2-year battery warranty, free delivery and easy EMI across Bihar.",
  alternates: { canonical: "https://evwheels.in" },
  openGraph: {
    title: "EVWheels — Buy Electric Cycles & E-Bikes in Patna, Bihar",
    description:
      "Shop certified electric cycles and e-bikes in Patna. Long range, 2-year warranty, free delivery and EMI options across Bihar.",
    url: "https://evwheels.in",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EVWheels — Buy Electric Cycles & E-Bikes in Patna, Bihar",
    description:
      "Shop certified electric cycles and e-bikes in Patna. Long range, 2-year warranty, free delivery across Bihar.",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "EVWheels",
  url: "https://evwheels.in",
  logo: "https://evwheels.in/logo.png",
  image: "https://evwheels.in/og-default.jpg",
  description:
    "EVWheels is Patna's trusted electric cycle and e-bike store. We offer a wide range of e-cycles, batteries, BMS units and EV accessories with local service support.",
  telephone: "+91-8298922623",
  email: "support@evwheels.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Naubatpur",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "801109",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.5941,
    longitude: 85.1376,
  },
  areaServed: [
    "Patna", "Muzaffarpur", "Gaya", "Bhagalpur", "Darbhanga", "Bihar",
  ],
  priceRange: "₹₹",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
  ],
  sameAs: ["https://www.instagram.com/evwheels_patna"],
};

// All slug variants the DB might use for electric cycles / scooters
const EV_SLUGS = [
  "electric-cycles",
  "electric-cycle",
  "electric-scooters",
  "electric-scooter",
  "electric-scooty",
];

async function fetchCategory(slug, limit) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/products?category=${slug}&limit=${limit}&sort=createdAt&order=desc`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

// Fisher-Yates shuffle — runs server-side so result varies on every refresh
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchHeroSlides() {
  try {
    const res = await fetch(`${BASE_URL}/api/hero-slides`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slides || [];
  } catch {
    return [];
  }
}

async function fetchInstagramPosts() {
  try {
    const res = await fetch(`${BASE_URL}/api/instagram-posts`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [results, heroSlides, instagramPosts] = await Promise.all([
    Promise.all(EV_SLUGS.map((s) => fetchCategory(s, 8))),
    fetchHeroSlides(),
    fetchInstagramPosts(),
  ]);

  // Flatten + deduplicate by _id
  const seen = new Set();
  const pool = results.flat().filter((p) => {
    if (!p._id || seen.has(p._id)) return false;
    seen.add(p._id);
    return true;
  });

  const trendingProducts = shuffle(pool).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HomeClient
        trendingProducts={trendingProducts}
        heroSlides={heroSlides}
        instagramPosts={instagramPosts}
      />
    </>
  );
}
