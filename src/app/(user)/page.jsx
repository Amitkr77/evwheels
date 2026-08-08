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
      { next: { revalidate: 0 } } // no cache — random pick should vary per request
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

export default async function Home() {
  // Try all slug variants in parallel — each fetches up to 8 products so we
  // have a decent pool to pick from when a category has more than 4.
  const results = await Promise.all(EV_SLUGS.map((s) => fetchCategory(s, 8)));

  // Flatten + deduplicate by _id (same product may appear under multiple slugs)
  const seen = new Set();
  const pool = results.flat().filter((p) => {
    if (!p._id || seen.has(p._id)) return false;
    seen.add(p._id);
    return true;
  });

  // Shuffle so the 4 chosen products change on every page load
  const trendingProducts = shuffle(pool).slice(0, 4);

  return <HomeClient trendingProducts={trendingProducts} />;
}
