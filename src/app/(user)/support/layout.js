export const metadata = {
  title: "Support & Parts Finder",
  description:
    "Find spare parts, accessories, and service support for your electric cycle. Use our parts finder, browse popular models, and locate service centres near you in Bihar.",
  alternates: { canonical: "https://evwheels.in/support" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "E-Cycle Support & Parts Finder | EVWheels",
    description:
      "Find spare parts, accessories, and service support for your electric cycle in Bihar.",
    url: "https://evwheels.in/support",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "E-Cycle Support & Parts Finder | EVWheels",
    description: "Find spare parts and service support for your electric cycle in Bihar.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I find the right spare part for my electric cycle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use our Parts Finder tool — select your product category (BMS, battery, motor, etc.) to see compatible accessories and spare parts. You can also reach us on WhatsApp with your model details.",
      },
    },
    {
      "@type": "Question",
      name: "Where is the EVWheels service centre located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our service centre is in Patna, Bihar. We also provide remote support and can ship replacement parts to all major cities in Bihar including Muzaffarpur, Gaya, Bhagalpur, and Darbhanga.",
      },
    },
    {
      "@type": "Question",
      name: "How do I identify my electric cycle model for servicing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can find your model details on the serial number plate located on the frame near the bottom bracket, or in the product documentation that came with your purchase.",
      },
    },
    {
      "@type": "Question",
      name: "Are genuine spare parts available for all models?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We stock genuine parts for all products sold by EVWheels including BMS units, battery cells, chargers, motors, and accessories. Contact us if you don't see what you need.",
      },
    },
  ],
};

export default function SupportLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
