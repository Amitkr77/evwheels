const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",   item: "https://evwheels.in" },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://evwheels.in/privacy-policy" },
  ],
};

export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how EVWheels collects, uses, and protects your personal information. We are committed to your privacy and never sell your data to third parties.",
  alternates: { canonical: "https://evwheels.in/privacy-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | EVWheels",
    description:
      "Learn how EVWheels collects, uses, and protects your personal information. Your data stays private — always.",
    url: "https://evwheels.in/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | EVWheels",
    description: "Learn how EVWheels protects your personal information.",
  },
};

export default function PrivacyLayout({ children }) {
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
