"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function RefundPolicyPage() {
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
            Refund, Cancellation & Return Policy
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Effective as of January 2025 | Masterstroke Academy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <p className="text-[var(--text)] leading-relaxed mb-4">
            Masterstroke Academy is a digital education platform operated by{" "}
            <span className="font-semibold">Innoversity Innovation Pvt. Ltd.</span> Through the Academy,
            users gain access to educational content, assessments, blockchain certifications, ecosystem
            participation opportunities, validator learning pathways, rewards programs, and related digital
            services.
          </p>
          <p className="text-[var(--text)] leading-relaxed font-semibold text-mst-red">
            Please read this Refund, Cancellation & Return Policy carefully before making any purchase.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                1
              </span>
              Nature of Services
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-4">
              Masterstroke Academy provides:
            </p>
            <ul className="grid md:grid-cols-2 gap-3 mb-4">
              {[
                "Digital educational content",
                "Online learning modules",
                "Assessments and examinations",
                "Blockchain-related educational programs",
                "Validator learning pathways",
                "On-chain certifications",
                "Ecosystem participation opportunities",
                "Reward-based learning programs",
                "Future educational and ecosystem services",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
              <p className="text-sm text-[var(--text)]">
                <span className="font-semibold">Note:</span> All products and services offered through the
                platform are delivered digitally. No physical products are shipped or delivered.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                2
              </span>
              Digital Product Acknowledgement
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              By purchasing any course, membership, learning track, validator program, or educational service
              from Masterstroke Academy, you acknowledge and agree that:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "The product being purchased is digital in nature.",
                "Access may be granted immediately after successful payment.",
                "Educational content becomes available electronically.",
                "Digital products cannot be physically returned.",
                "Course materials may be accessed, viewed, or consumed immediately after activation.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)]">
                <span className="font-semibold">Important:</span> Accordingly, different refund rules apply
                compared to physical products.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                3
              </span>
              Refund Policy
            </h2>
            <ul className="space-y-3">
              {[
                "All purchases made through Innoversity Innovation Pvt. Ltd. for Innoversity Innovation Pvt. Ltd. are generally final.",
                "Due to the nature of digital educational products, learning resources, certifications, assessments, and platform access, refunds shall not be provided once access to the purchased service has been granted.",
                "Users are encouraged to review course descriptions, eligibility requirements, and program details carefully before making a purchase.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                4
              </span>
              Non-Refundable Services
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-4">
              The following are non-refundable:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {[
                "Course purchases",
                "Learning tracks",
                "Validator programs",
                "Student programs",
                "Professional programs",
                "Certification programs",
                "Premium content access",
                "Digital educational resources",
                "Downloadable materials",
                "Membership plans",
                "Reward-based educational programs",
                "Any other digital service offered through the platform",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">✕</span>
                  <span className="text-[var(--text)]">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <p className="text-[var(--text)] font-semibold mb-3">
                No refund requests shall be entertained solely because:
              </p>
              <ul className="space-y-2">
                {[
                  "The user changes their mind.",
                  "The user no longer wishes to continue learning.",
                  "The user does not complete the course.",
                  "The user fails an assessment.",
                  "The user becomes ineligible for certification.",
                  "The user does not participate actively.",
                  "The user does not utilize available course access.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <span className="text-mst-red">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                5
              </span>
              Cancellation Policy
            </h2>
            <ul className="space-y-3">
              {[
                "Users may discontinue use of the platform at any time.",
              ].map((item, idx) => (
                <li key={idx} className="text-[var(--text)]">{item}</li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] font-medium mt-6 mb-4">However:</p>
            <ul className="space-y-3">
              {[
                "Purchased courses cannot be cancelled after enrollment.",
                "Access rights remain active according to the purchased plan.",
                "No partial refunds shall be issued.",
                "No pro-rata refunds shall be issued.",
                "Cancellation does not create any entitlement to a refund.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                6
              </span>
              Duplicate Payments
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              In the event that a user is charged more than once for the same transaction due to a technical
              issue, payment gateway error, banking issue, or processing malfunction, the user must notify
              Masterstroke Academy promptly.
            </p>
            <p className="text-[var(--text-muted)] font-medium mb-4">Upon successful verification:</p>
            <ul className="space-y-3 mb-6">
              {[
                "The duplicate transaction may be reversed, or",
                "The excess amount may be refunded through the original payment method.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)]">
                <span className="font-semibold">Verification may require:</span> Transaction references,
                payment screenshots, or supporting documentation.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                7
              </span>
              Payment Successful but Access Not Granted
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              If payment has been successfully completed but the purchased course, program, or service is not
              activated, users must contact the support team.
            </p>
            <p className="text-[var(--text-muted)] font-medium mb-3">
              Users should provide:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Registered email address",
                "Transaction ID",
                "Payment screenshot",
                "Relevant account details",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] font-medium mb-3">
              After verification, Masterstroke Academy shall:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Activate the purchased service, or",
                "Coordinate with the payment provider to resolve the issue.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)]">
                <span className="font-semibold">Note:</span> Support requests should ideally be submitted
                within 7 days of the transaction.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                8
              </span>
              Technical Issues
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-4">
              Temporary service interruptions may occasionally occur due to:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Server maintenance",
                "Network issues",
                "Payment gateway downtime",
                "Blockchain congestion",
                "Wallet integration issues",
                "Third-party service disruptions",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {[
                "Such interruptions shall not automatically qualify for refunds.",
                "Masterstroke Academy will make reasonable efforts to restore services as quickly as possible.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 9 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                9
              </span>
              Rewards and Certification Eligibility
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Users acknowledge that:
            </p>
            <ul className="space-y-3">
              {[
                "Course enrollment does not guarantee rewards.",
                "Course enrollment does not automatically guarantee certification.",
                "Rewards may be subject to eligibility requirements.",
                "Certification may require successful completion of modules and assessments.",
                "Validator participation may require additional qualifications.",
                "Failure to satisfy eligibility requirements shall not constitute grounds for refund.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 10 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                10
              </span>
              Blockchain and Wallet Services
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Certain Academy services may require:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "A valid BridgeKey Wallet",
                "A compatible blockchain wallet address",
                "Participation within the MST Blockchain ecosystem",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Users are responsible for ensuring that wallet information submitted is accurate. Masterstroke
              Academy shall not be responsible for losses arising from:
            </p>
            <ul className="space-y-2 text-[var(--text)]">
              {[
                "Incorrect wallet addresses",
                "User wallet misconfiguration",
                "Loss of wallet credentials",
                "Third-party wallet failures",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 11 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                11
              </span>
              Return Policy
            </h2>
            <ul className="space-y-3">
              {[
                "As all services and products provided through Masterstroke Academy are digital in nature, returns are not applicable.",
                "No physical goods are sold through the platform.",
                "Accordingly, no return process exists for purchased services.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 12 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                12
              </span>
              Policy Updates
            </h2>
            <ul className="space-y-3">
              {[
                "Masterstroke Academy reserves the right to update or modify this Refund, Cancellation & Return Policy at any time.",
                "Any revisions shall become effective upon publication on the official website.",
                "Continued use of the platform after such updates constitutes acceptance of the revised policy.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 13 - Contact */}
          <section className="bg-gradient-to-br from-mst-red/10 to-red-600/10 border border-mst-red/30 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                13
              </span>
              Contact for Payment and Refund Queries
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-6">
              For payment-related concerns, transaction verification, duplicate payment issues, or service
              activation problems, please contact:
            </p>

            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="text-lg font-bold text-[var(--text)] mb-4">Masterstroke Academy</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                <span className="text-mst-red font-semibold">A Product of</span> Masterstroke Technosoft Pvt.
                Ltd.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Email:</p>
                  <p className="text-[var(--text)] font-medium">sarthaknimje.mst@gmail.com</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Phone:</p>
                  <p className="text-[var(--text)] font-medium">+91 9112228906</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">Address:</p>
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
          </section>
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center text-sm text-[var(--text-muted)] pb-8">
          <p>Last Updated: January 2025</p>
          <p>© 2025 Innoversity Innovation Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
