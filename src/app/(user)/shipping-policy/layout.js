const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",   item: "https://evwheels.in" },
    { "@type": "ListItem", position: 2, name: "Shipping Policy", item: "https://evwheels.in/shipping-policy" },
  ],
};

export const metadata = {
  title: "Shipping Policy",
  description:
    "Free shipping on all electric cycles across Bihar. Standard delivery in 4–8 business days. Know our delivery zones, tracking process, and what happens if your order is delayed.",
  alternates: { canonical: "https://evwheels.in/shipping-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shipping Policy | EVWheels",
    description:
      "Free shipping on all electric cycles across Bihar. 4–8 business day delivery. Find out about tracking, delivery zones, and more.",
    url: "https://evwheels.in/shipping-policy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shipping Policy | EVWheels",
    description: "Free shipping on all electric cycles across Bihar. 4–8 business day delivery.",
  },
};

export default function ShippingLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
