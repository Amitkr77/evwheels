import Link from "next/link";

const SECTIONS = [
  {
    title: "Information We Collect",
    content: `When you create an account or place an order on EVWheels, we collect:
• Personal details: name, email address, phone number
• Delivery address and billing information
• Order history and purchase records
• Device and browser information for security and analytics
• Communications you send us (support emails, contact form submissions)

We do not collect payment card details directly — payments are handled by our trusted payment partners.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use your personal information to:
• Process and deliver your orders
• Send order confirmations, dispatch updates, and delivery notifications
• Respond to your support requests and enquiries
• Send you promotional emails and offers (only with your consent)
• Improve our website, products, and services
• Comply with legal obligations

We do not sell or rent your personal data to any third party.`,
  },
  {
    title: "Sharing of Information",
    content: `Your information may be shared with:
• Delivery partners (for shipping and last-mile logistics)
• Payment processors (for secure transaction processing)
• Service providers who operate our website infrastructure

All third parties are contractually required to protect your data and use it only for the stated purpose.`,
  },
  {
    title: "Cookies",
    content: `EVWheels uses cookies to:
• Keep you signed in during your session
• Remember your cart contents
• Understand how visitors use our website (analytics)

You can disable cookies in your browser settings. Some features of the website may not work correctly without cookies.`,
  },
  {
    title: "Data Retention",
    content: `We retain your personal data for as long as your account is active or as required by law. Order records are kept for a minimum of 7 years for tax and legal compliance. You may request deletion of your account and associated data at any time by contacting us.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to:
• Access the personal data we hold about you
• Correct inaccurate or incomplete data
• Request deletion of your data
• Opt out of marketing communications at any time
• Raise a complaint with the relevant data protection authority

To exercise any of these rights, contact us at support@evwheels.in.`,
  },
  {
    title: "Security",
    content: `We use industry-standard security measures including SSL encryption, secure servers, and access controls to protect your personal data. However, no method of transmission over the internet is 100% secure. If you suspect unauthorised access to your account, please contact us immediately.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page and, where appropriate, notify you by email. Continued use of EVWheels after changes are posted constitutes acceptance of the revised policy.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-24 font-['Inter']">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#19B5D8] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-neutral-900">Privacy Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 text-sm">Last updated: June 2025</p>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            At EVWheels, we take your privacy seriously. This policy explains what personal information we collect, how we use it, and your rights regarding that information.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                {i + 1}. {section.title}
              </h2>
              <div className="text-neutral-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-14 p-6 bg-[#DDF8FD] rounded-2xl border border-[#19B5D8]/20">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Questions about this policy?</h2>
          <p className="text-neutral-600 text-sm mb-4">
            Contact our data team at <a href="mailto:support@evwheels.in" className="text-[#19B5D8] hover:underline">support@evwheels.in</a> or visit our <Link href="/contact" className="text-[#19B5D8] hover:underline">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
