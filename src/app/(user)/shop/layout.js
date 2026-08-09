const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Electric Cycles & E-Bikes — EVWheels",
  description:
    "Browse the full collection of electric cycles, e-bikes and EV accessories available at EVWheels, Patna, Bihar.",
  url: "https://evwheels.in/shop",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: "https://evwheels.in" },
      { "@type": "ListItem", position: 2, name: "Shop",  item: "https://evwheels.in/shop" },
    ],
  },
};

export const metadata = {
  title: "Electric Cycles & E-Bikes",
  description:
    "Browse our full collection of electric cycles, e-bikes and EV accessories in Patna, Bihar. Filter by price, brand, and availability. Fast delivery across Bihar.",
  alternates: { canonical: "https://evwheels.in/shop" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Electric Cycles & E-Bikes | EVWheels",
    description:
      "Browse our full collection of electric cycles, e-bikes and EV accessories in Patna, Bihar. Filter by price, brand, and availability.",
    url: "https://evwheels.in/shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electric Cycles & E-Bikes | EVWheels",
    description:
      "Browse our full range of electric cycles and e-bikes in Patna, Bihar. Free delivery. Easy EMI.",
  },
};

export default function ShopLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
