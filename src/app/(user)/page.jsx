import HomeClient from "./HomeClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://evwheels.in";

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
    <HomeClient
      trendingProducts={trendingProducts}
      heroSlides={heroSlides}
      instagramPosts={instagramPosts}
    />
  );
}
