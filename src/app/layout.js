import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import PostHogProvider from "@/providers/PostHogProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://evwheels.in";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#065f46",
};

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "EVWheels — Electric Cycles & E-Bikes in Patna, Bihar",
    template: "%s | EVWheels",
  },
  description:
    "Buy premium electric cycles and e-bikes in Patna, Bihar. Wide range of e-cycles with long battery life, local service support, and easy EMI options. Serving Patna, Muzaffarpur, Gaya, and across Bihar.",
  keywords: [
    "electric cycles",
    "e-bikes",
    "electric bicycles",
    "e-cycle Patna",
    "Bihar",
    "EVWheels",
    "eco-friendly transport",
    "e-cycle shop Bihar",
    "buy electric cycle online",
  ],
  authors: [{ name: "EVWheels", url: BASE_URL }],
  creator: "EVWheels",
  publisher: "EVWheels",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "EVWheels",
    title: "EVWheels — Electric Cycles & E-Bikes in Patna, Bihar",
    description:
      "Buy premium electric cycles and e-bikes in Patna, Bihar. Wide range of e-cycles with long battery life and local service support.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "EVWheels — Electric Cycles in Patna, Bihar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EVWheels — Electric Cycles & E-Bikes in Patna, Bihar",
    description:
      "Buy premium electric cycles and e-bikes in Patna, Bihar. Wide range of e-cycles with local service support.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EVWheels",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9876543210",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/evwheels",
    "https://www.facebook.com/evwheels",
    "https://twitter.com/evwheels",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EVWheels",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/shop?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const orgSchemaJSON = JSON.stringify(orgSchema);
const websiteSchemaJSON = JSON.stringify(websiteSchema);

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: orgSchemaJSON }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchemaJSON }}
        />
        {/* Google Analytics — deferred until the browser is idle so it doesn't compete with the initial render */}
        <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-9J6P8DLC69" />
        <Script
          id="ga-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9J6P8DLC69');`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <PostHogProvider>
          <AuthProvider>{children}</AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
