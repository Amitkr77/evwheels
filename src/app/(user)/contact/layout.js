export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EVWheels in Patna. Visit our showroom, call us, or send an enquiry online. We're here to help you find the perfect electric cycle.",
  alternates: { canonical: "https://evwheels.in/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact EVWheels | Electric Cycle Shop in Patna",
    description:
      "Visit our showroom in Patna, call us, or send an enquiry. We're here to help you choose the right e-cycle.",
    url: "https://evwheels.in/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact EVWheels | Electric Cycle Shop in Patna",
    description: "Visit our showroom in Patna or reach us online. We help you find the right electric cycle.",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "EVWheels",
  url: "https://evwheels.in",
  telephone: "+91-8298922623",
  email: "support@evwheels.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Naubatpur",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "801109",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
  ],
  areaServed: { "@type": "State", name: "Bihar" },
  sameAs: ["https://www.instagram.com/evwheels_patna"],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of electric cycles and products do you sell?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We sell electric cycles, e-bikes, BMS units (Battery Management Systems), lithium battery packs, motor accessories, and other EV components — all sourced from trusted manufacturers.",
      },
    },
    {
      "@type": "Question",
      name: "Is EMI available for purchases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer easy EMI options through leading banks and financial partners. Contact us for current EMI plans and eligibility.",
      },
    },
    {
      "@type": "Question",
      name: "Do you have a service center in Patna?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our service center is in Patna, Bihar — offering fast response, genuine parts, and complete after-sales support for all EV products sold by us.",
      },
    },
    {
      "@type": "Question",
      name: "What warranty do your products come with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Warranty terms vary by product. Electric cycles typically include a battery warranty and a frame/motor warranty. Specific warranty details are listed on each product page.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer delivery outside Patna?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We deliver across Bihar including Muzaffarpur, Gaya, Bhagalpur, Darbhanga, and more. Free shipping is available on eligible orders.",
      },
    },
  ],
};

export default function ContactLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
