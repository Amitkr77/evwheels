import HomeClient from "./HomeClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://evwheels.in";

async function getProducts(limit) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/products?limit=${limit}&sort=createdAt&order=desc`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  // Popular Products now fetches its own tabs from /api/showcase client-side
  // — only the EV Showcase section's "Trending right now" panel still needs
  // a server-fetched list.
  const trendingProducts = await getProducts(4);

  return <HomeClient trendingProducts={trendingProducts} />;
}
