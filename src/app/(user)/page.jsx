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
  const [featuredProducts, trendingProducts] = await Promise.all([
    getProducts(8),
    getProducts(4),
  ]);

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      trendingProducts={trendingProducts}
    />
  );
}
