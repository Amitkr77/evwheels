import ProductDetailClient from "./ProductDetailClient";

// JSON.stringify doesn't escape "</script>" — without this, a title/description
// containing that literal string could break out of the JSON-LD tag and inject markup.
function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://evwheels.in";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { title: "Product Not Found" };

    const { product } = await res.json();

    const title = product.title;
    const description =
      product.description?.slice(0, 155) ||
      `Buy ${title} online at EVWheels. Available in Patna, Bihar.`;
    const image = product.images?.[0];
    const price = product.price;

    return {
      title,
      description,
      alternates: { canonical: `${BASE_URL}/shop/${slug}` },
      openGraph: {
        title: `${title} | EVWheels`,
        description,
        url: `${BASE_URL}/shop/${slug}`,
        type: "website",
        images: image
          ? [{ url: image, width: 1200, height: 630, alt: title }]
          : [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "EVWheels" }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | EVWheels`,
        description,
        images: image ? [image] : ["/og-default.jpg"],
      },
      other: {
        "product:price:amount": String(price),
        "product:price:currency": "INR",
      },
    };
  } catch {
    return { title: "Electric Cycle | EVWheels" };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    const res = await fetch(`${BASE_URL}/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      product = data.product;
    }
  } catch {
    // render client fallback
  }

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.images || [],
        sku: product._id,
        brand: {
          "@type": "Brand",
          name: product.brand || "EVWheels",
        },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${BASE_URL}/shop/${slug}`,
          seller: { "@type": "Organization", name: "EVWheels" },
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        ...(product.warranty > 0 && {
          warranty: `${product.warranty} months manufacturer warranty`,
        }),
        ...(product.colors?.length > 0 && { color: product.colors.join(", ") }),
        ...(product.category?.name && { category: product.category.name }),
      }
    : null;

  // Mirrors the on-page breadcrumb — Home / Category / Subcategory? / Product,
  // built from the product's real category & subcategory instead of a fixed
  // "Electric Cycles" crumb pointing at a /cycles route that doesn't exist.
  const breadcrumbItems = [{ name: "Home", item: BASE_URL }];

  if (product?.category?.slug) {
    breadcrumbItems.push({
      name: product.category.name,
      item: `${BASE_URL}/shop?category=${product.category.slug}`,
    });
  } else {
    breadcrumbItems.push({ name: "Shop", item: `${BASE_URL}/shop` });
  }

  if (product?.subcategory?.name) {
    breadcrumbItems.push({
      name: product.subcategory.name,
      item: `${BASE_URL}/shop?category=${product.category?.slug || ""}&subcategory=${product.subcategory._id}`,
    });
  }

  breadcrumbItems.push({
    name: product?.title || slug,
    item: `${BASE_URL}/shop/${slug}`,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <ProductDetailClient />
    </>
  );
}
