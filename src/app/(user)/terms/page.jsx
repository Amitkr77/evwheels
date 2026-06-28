import Link from "next/link";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using the EVWheels website and placing orders, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website. These terms apply to all visitors, users, and customers of EVWheels.`,
  },
  {
    title: "Products and Pricing",
    content: `• All product descriptions, images, and specifications are provided in good faith and are as accurate as possible.
• Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.
• We reserve the right to change prices without prior notice. Price changes do not affect orders already confirmed.
• Product availability is not guaranteed. If an item becomes unavailable after your order, we will notify you promptly and offer a refund or alternative.`,
  },
  {
    title: "Orders and Payment",
    content: `• By placing an order, you make an offer to purchase the product at the listed price.
• An order is confirmed only after we send you an order confirmation email.
• We reserve the right to cancel any order due to pricing errors, stock issues, or suspected fraud.
• Currently, we accept Cash on Delivery (COD). Online payment options are coming soon.
• COD orders require payment at the time of delivery. Please keep the exact amount ready.`,
  },
  {
    title: "Shipping and Delivery",
    content: `• We deliver across Bihar with standard delivery times of 4–8 business days from order confirmation.
• Free shipping is available on orders above a certain threshold (displayed at checkout).
• Delivery timelines are estimates and may vary due to logistics or external factors outside our control.
• For full details, see our Shipping Policy.`,
  },
  {
    title: "Returns and Refunds",
    content: `• We offer a 30-day return window from the date of delivery for eligible products.
• Items must be returned in their original condition, unused, and with all original packaging.
• Refunds are processed within 7–10 business days of receiving the returned item.
• For full details, see our Returns & Refund Policy.`,
  },
  {
    title: "Warranty",
    content: `• Electric cycles sold by EVWheels come with a 2-year battery warranty and a 1-year comprehensive warranty covering the frame and motor.
• Warranty does not cover damage caused by misuse, accidents, or unauthorised modifications.
• To claim warranty service, contact us at support@evwheels.in with your order details and a description of the issue.`,
  },
  {
    title: "User Accounts",
    content: `• You are responsible for maintaining the confidentiality of your account credentials.
• You must notify us immediately of any unauthorised use of your account.
• We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`,
  },
  {
    title: "Intellectual Property",
    content: `All content on the EVWheels website — including text, images, logos, and design — is the property of EVWheels and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without our prior written permission.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the extent permitted by law, EVWheels is not liable for:
• Indirect, incidental, or consequential damages arising from use of our website or products
• Loss of data, revenue, or business opportunities
• Delays or failures caused by circumstances beyond our reasonable control (force majeure)

Our maximum liability to you for any claim is limited to the purchase price of the relevant product.`,
  },
  {
    title: "Governing Law",
    content: `These Terms of Service are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Patna, Bihar.`,
  },
  {
    title: "Changes to Terms",
    content: `We may update these Terms of Service periodically. Continued use of the website after changes are posted constitutes acceptance of the updated terms. We recommend reviewing this page regularly.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-24 pb-24 font-['Inter']">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-emerald-800 transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-neutral-900">Terms of Service</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-neutral-500 text-sm">Last updated: June 2025</p>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            Please read these Terms of Service carefully before using EVWheels. By accessing our website or placing an order, you agree to these terms.
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
        <div className="mt-14 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Have a question about our terms?</h2>
          <p className="text-neutral-600 text-sm">
            Contact us at <a href="mailto:support@evwheels.in" className="text-emerald-800 hover:underline">support@evwheels.in</a> or visit our <Link href="/contact" className="text-emerald-800 hover:underline">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
