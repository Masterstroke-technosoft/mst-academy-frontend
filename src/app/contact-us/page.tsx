"use client";

import Link from "next/link";
import { ChevronLeft, Mail, Phone, MapPin, Clock } from "lucide-react";

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
            regarding courses, certifications, payments, wallet integration, and participation in the MST
            Blockchain ecosystem.
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
              <span className="text-mst-red font-semibold">A Product of</span> Innoversity Innovation Pvt. Ltd.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-mst-red mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Registered Office:</p>
                  <p className="text-[var(--text)] leading-relaxed">
                    Kohinoor World Towers,
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
                  href="mailto:sarthaknimje.mst@gmail.com"
                  className="text-mst-red font-medium hover:underline text-lg"
                >
                  sarthaknimje.mst@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone size={24} className="text-mst-red mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Phone:</p>
                <a href="tel:9112228906" className="text-mst-red font-medium hover:underline text-lg">
                  9112228906
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
                ],
              },
              {
                title: "Assessment-related Queries",
                items: ["Assessment queries", "Grading concerns", "Exam scheduling"],
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
                title: "Wallet & Rewards",
                items: [
                  "BridgeKey Wallet integration",
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
                Users are advised not to share passwords, private keys, seed phrases, OTPs, or other sensitive
                credentials with anyone claiming to represent Masterstroke Academy.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] font-semibold">
                ⚠️ Masterstroke Academy will never request your wallet seed phrase, private keys, banking PIN, or
                password through email, phone calls, or messaging platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Direct Contact Information */}
        <section className="bg-gradient-to-br from-mst-red/10 to-red-600/10 border border-mst-red/30 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-[var(--text)] mb-6">Direct Contact Information</h2>

          <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Masterstroke Academy</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              <span className="text-mst-red font-semibold">A Product of</span> Innoversity Innovation Pvt. Ltd.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Email:</p>
                <a
                  href="mailto:sarthaknimje.mst@gmail.com"
                  className="text-mst-red font-medium hover:underline text-lg"
                >
                  sarthaknimje.mst@gmail.com
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
          <p>© 2025 Innoversity Innovation Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
