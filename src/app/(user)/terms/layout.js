const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",   item: "https://evwheels.in" },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://evwheels.in/terms" },
  ],
};

export const metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for EVWheels. Understand your rights and obligations when purchasing electric cycles, accessories, and services from us.",
  alternates: { canonical: "https://evwheels.in/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service | EVWheels",
    description:
      "Read the EVWheels Terms of Service — your rights and obligations when buying electric cycles and accessories from us.",
    url: "https://evwheels.in/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | EVWheels",
    description: "Read the EVWheels Terms of Service before purchasing.",
  },
};

export default function TermsLayout({ children }) {
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
