export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EVWheels in Patna. Visit our showroom, call us, or send an enquiry online. We're here to help you find the perfect electric cycle.",
  alternates: { canonical: "https://evwheels.in/contact" },
  openGraph: {
    title: "Contact EVWheels | Electric Cycle Shop in Patna",
    description:
      "Visit our showroom in Patna, call us, or send an enquiry. We're here to help you choose the right e-cycle.",
    url: "https://evwheels.in/contact",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of electric cycles do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer city commuters (RangeX City), off-road capable (TrailX Pro), and foldable urban models (LiteX Fold) — all designed and tested for real Indian roads.",
      },
    },
    {
      "@type": "Question",
      name: "Is EMI available for purchases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer easy EMI options starting from ₹2,499/month through leading banks and financial partners.",
      },
    },
    {
      "@type": "Question",
      name: "Where is your service center?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our dedicated service center is located in Patna, Bihar — offering fast response, genuine parts, and complete ownership support.",
      },
    },
    {
      "@type": "Question",
      name: "What is your warranty policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All our cycles come with a 2-year battery warranty and 1-year comprehensive warranty on frame & motor. Extended plans are also available.",
      },
    },
  ],
};

export default function ContactLayout({ children }) {
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
