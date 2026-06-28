const BASE_URL = "https://evwheels.in";

export default async function sitemap() {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/cycles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/why-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/support`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const res = await fetch(`${BASE_URL}/api/products?limit=500&inStock=false`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return staticRoutes;

    const data = await res.json();
    const products = data.products || [];

    const productRoutes = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE_URL}/cycles/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.createdAt),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
