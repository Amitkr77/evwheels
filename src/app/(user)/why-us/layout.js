const whyUsSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Why Choose EVWheels | Patna's #1 E-Cycle Store",
  description:
    "Discover why EVWheels is Bihar's most trusted electric cycle brand. Genuine products, local service centres across Patna, affordable EMI, and after-sales support.",
  url: "https://evwheels.in/why-us",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: "https://evwheels.in" },
      { "@type": "ListItem", position: 2, name: "Why Us",   item: "https://evwheels.in/why-us" },
    ],
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Reasons to Choose EVWheels",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Certified Genuine Products" },
      { "@type": "ListItem", position: 2, name: "Local Service Centre in Patna" },
      { "@type": "ListItem", position: 3, name: "90–110 km Verified Range" },
      { "@type": "ListItem", position: 4, name: "2-Year Battery Warranty" },
      { "@type": "ListItem", position: 5, name: "Easy EMI Options" },
      { "@type": "ListItem", position: 6, name: "Free Delivery Across Bihar" },
    ],
  },
};

export const metadata = {
  title: "Why Choose EVWheels",
  description:
    "Discover why EVWheels is Bihar's most trusted electric cycle brand. Genuine products, local service centres across Patna, affordable EMI, and after-sales support.",
  alternates: { canonical: "https://evwheels.in/why-us" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Why Choose EVWheels | Patna's #1 E-Cycle Store",
    description:
      "Genuine products, local service centres across Patna, affordable EMI, and after-sales support.",
    url: "https://evwheels.in/why-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Choose EVWheels | Patna's #1 E-Cycle Store",
    description: "Bihar's most trusted e-cycle brand. Genuine products, local service, 2-year warranty & easy EMI.",
  },
};

export default function WhyUsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(whyUsSchema) }}
      />
      {children}
    </>
  );
}
