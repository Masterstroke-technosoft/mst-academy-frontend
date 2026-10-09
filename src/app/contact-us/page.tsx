import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, MapPin, Clock } from "lucide-react";

function WhatsAppIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: { absolute: 'Contact Masterstroke Academy | Blockchain Course Support, Pune' },
  description:
    'Contact Masterstroke Academy, Pune. Course access, payments, certification and wallet support. Mon-Sat, 10am-6pm IST. Reply within 24-48 hours.',
  alternates: { canonical: '/contact-us' },
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-mst-red hover:underline mb-4 text-sm font-medium"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-[var(--text)]">
            Get in Touch
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Contact Masterstroke Academy | Support & Assistance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <p className="text-[var(--text)] leading-relaxed">
            Masterstroke Academy is committed to providing quality education, technical support, and assistance
            regarding courses, certifications, payments, Web3 wallet integration, and blockchain-enabled
            educational services.
          </p>
          <p className="text-[var(--text)] leading-relaxed mt-4">
            If you have any questions, concerns, feedback, or require assistance with your account, course access,
            certifications, rewards, validator participation, or any other Academy-related services, our support
            team is available to help.
          </p>
        </div>

        {/* Business Information */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-[var(--text)] mb-6">Business Information</h2>

          <div className="bg-gradient-to-br from-mst-red/10 to-red-600/10 border border-mst-red/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Masterstroke Academy</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              <span className="text-mst-red font-semibold">A Product of</span> Masterstroke Technosoft Pvt. Ltd.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-mst-red mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Registered Office:</p>
                  <p className="text-[var(--text)] leading-relaxed">
                    Kohinoor World Towers T3-403,
                    <br />
                    Old Pune-Mumbai Highway,
                    <br />
                    Opposite Empire Estate,
                    <br />
                    Pimpri, Pune – 411018,
                    <br />
                    Maharashtra, India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Support */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-[var(--text)] mb-6">Customer Support</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <Mail size={24} className="text-mst-red mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Email:</p>
                <a
                  href="mailto:support@masterstroke.academy"
                  className="text-mst-red font-medium hover:underline text-sm sm:text-base md:text-lg"
                >
                  support@masterstroke.academy
                </a>
              </div>
            </div>

            {/* <div className="flex items-start gap-4">
              <Phone size={24} className="text-mst-red mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Phone:</p>
                <a href="tel:9112228906" className="text-mst-red font-medium hover:underline text-lg">
                  9112228906
                </a>
              </div>
            </div> */}

            <div className="flex items-start gap-4">
              <WhatsAppIcon size={24} className="text-mst-red mt-1 flex-shrink-0" />

              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">
                  WhatsApp:
                </p>

                <a
                  href="https://wa.me/919112228906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mst-red font-medium hover:underline text-lg"
                >
                  +91 91122 28906
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={24} className="text-mst-red mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Support Hours:</p>
                <p className="text-[var(--text)]">Monday to Saturday</p>
                <p className="text-[var(--text)] font-medium">10:00 AM to 6:00 PM IST</p>
                <p className="text-[var(--text-muted)] text-sm mt-2">Closed on Sundays and Public Holidays.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-[var(--text)]">
              <span className="font-semibold">Response Timeline:</span> Our support team aims to respond to all
              customer inquiries within 24 to 48 business hours. Resolution times may vary depending on the
              complexity of the issue and the information provided by the user.
            </p>
          </div>
        </section>

        {/* Support Categories */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-[var(--text)] mb-6">Support Categories</h2>

          <p className="text-[var(--text)] leading-relaxed mb-6">
            You may contact us for assistance regarding:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Course Access",
                items: [
                  "Enrollment issues",
                  "Course unlocking problems",
                  "Learning progress concerns",
                  "Module access issues",
                  "Assessment-related queries",
                  "AI assessment review requests",
                ],
              },
              {
                title: "Payments",
                items: [
                  "Payment confirmation issues",
                  "Duplicate transactions",
                  "Failed transactions",
                  "Invoice requests",
                  "Payment verification",
                ],
              },
              {
                title: "Certifications",
                items: [
                  "Certificate eligibility",
                  "Certificate issuance",
                  "On-chain certification verification",
                  "Wallet-linked certification issues",
                ],
              },
              {
                title: "Web3 Wallet & Rewards",
                items: [
                  "Web3 wallet integration",
                  "Wallet linking issues",
                  "Reward distribution concerns",
                  "Blockchain verification support",
                ],
              },
              {
                title: "Validator & Ecosystem Programs",
                items: [
                  "Validator learning tracks",
                  "Ecosystem participation",
                  "Community initiatives",
                  "Technical onboarding assistance",
                ],
              },
            ].map((category, idx) => (
              <div key={idx} className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                <h4 className="font-bold text-[var(--text)] mb-3">{category.title}</h4>
                <ul className="space-y-2">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-[var(--text)]">
                      <span className="text-mst-red font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Reporting Technical Issues */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-[var(--text)] mb-6">Reporting Technical Issues</h2>

          <p className="text-[var(--text)] leading-relaxed mb-4">
            When reporting a technical issue, please include:
          </p>

          <ul className="space-y-3 mb-6">
            {[
              "Registered email address",
              "Transaction ID (if applicable)",
              "Wallet address (if applicable)",
              "Screenshots of the issue",
              "Device and browser details",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                <span className="text-mst-red font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-[var(--text)]">
              Providing complete information helps us resolve issues more efficiently.
            </p>
          </div>
        </section>

        {/* Security & Communication */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-black text-[var(--text)] mb-6">Official Communication</h2>

          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] mb-2">
                <span className="font-semibold">Security Notice:</span> All official communication from Masterstroke
                Academy will be conducted through authorized email addresses and official platform channels.
              </p>
              <p className="text-sm text-[var(--text)]">
                Users are advised not to share passwords, private keys, recovery phrases, seed phrases, OTPs, or
                other sensitive credentials with anyone claiming to represent Masterstroke Academy.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] font-semibold">
                ⚠️ Masterstroke Academy will never request your wallet recovery phrase, seed phrase, private keys,
                banking PIN, or account password through email, phone calls, messaging platforms, or any other
                communication channel.
              </p>
            </div>
          </div>
        </section>

        {/* Direct Contact Information */}
        <section className="bg-gradient-to-br from-mst-red/10 to-red-600/10 border border-mst-red/30 rounded-2xl p-5 sm:p-8">
          <h2 className="text-2xl font-black text-[var(--text)] mb-6">Direct Contact Information</h2>

          <div className="bg-[var(--surface)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Masterstroke Academy</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              <span className="text-mst-red font-semibold">A Product of</span> Masterstroke Technosoft Pvt. Ltd.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Email:</p>
                <a
                  href="mailto:support@masterstroke.academy"
                  className="text-mst-red font-medium hover:underline text-sm sm:text-base md:text-lg"
                >
                  support@masterstroke.academy
                </a>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Phone:</p>
                <a href="tel:9112228906" className="text-mst-red font-medium hover:underline text-lg">
                  9112228906
                </a>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Address:</p>
                <p className="text-[var(--text)] leading-relaxed">
                  T3, Kohinoor World Towers,
                  <br />
                  Old Pune-Mumbai Highway,
                  <br />
                  Opposite Empire Estate,
                  <br />
                  Pimpri, Pune – 411018,
                  <br />
                  Maharashtra, India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <div className="mt-12 text-center text-sm text-[var(--text-muted)] pb-8">
          <p>Last Updated: 19-06-2026</p>
          <p>© 2025 Masterstroke Technosoft Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
