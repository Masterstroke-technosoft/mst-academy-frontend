"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Last Updated: 19-06-2026 | Masterstroke Academy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <p className="text-[var(--text)] leading-relaxed mb-4">
            <span className="font-semibold">Masterstroke Academy</span> ("Academy", "we", "our", or "us") is
            a product of <span className="font-semibold">Innoversity Innovation Pvt. Ltd.</span>
          </p>
          <p className="text-[var(--text)] leading-relaxed mb-4">
            This Privacy Policy explains how we collect, use, store, process, disclose, and protect
            information when users access or use Masterstroke Academy, the MST Blockchain ecosystem, BridgeKey
            Wallet integrations, educational programs, certifications, rewards systems, validator pathways,
            websites, applications, and related services (collectively referred to as the "Services").
          </p>
          <p className="text-[var(--text)] leading-relaxed font-semibold text-mst-red">
            By accessing or using our Services, you acknowledge that you have read, understood, and agreed to
            this Privacy Policy.
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
              Scope of this Privacy Policy
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-4">
              This Privacy Policy applies to all users who:
            </p>
            <ul className="space-y-2">
              {[
                "Visit Masterstroke Academy websites and portals",
                "Register for an Academy account",
                "Enroll in educational programs",
                "Participate in assessments and certifications",
                "Connect or use BridgeKey Wallet",
                "Participate in MST Blockchain ecosystem activities",
                "Receive rewards through Academy programs",
                "Apply for validator pathways and ecosystem opportunities",
                "Communicate with our support team",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                2
              </span>
              Information We Collect
            </h2>

            <div className="space-y-8">
              {/* Subsection: Information You Provide */}
              <div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-4">Information You Provide Directly</h3>
                <p className="text-[var(--text-muted)] mb-4">
                  We may collect information that you voluntarily provide during registration, enrollment,
                  participation, support requests, and use of our Services.
                </p>

                <div className="space-y-6">
                  {/* Identity Information */}
                  <div className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Identity Information</h4>
                    <ul className="space-y-2">
                      {["Full Name", "Username"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Profile Information */}
                  <div className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Profile Information</h4>
                    <ul className="space-y-2">
                      {["Profile Photograph"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Contact Information</h4>
                    <ul className="space-y-2">
                      {["Email Address", "Mobile Number"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Student Verification */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Student Verification Information</h4>
                    <p className="text-sm text-[var(--text)] mb-3">
                      To verify eligibility for student-related programs and offerings, we may collect:
                    </p>
                    <ul className="space-y-2">
                      {["College ID Card", "Student Verification Information"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--text-muted)] mt-3 italic">
                      Verification documents are collected solely for validation purposes and to maintain
                      program integrity.
                    </p>
                  </div>

                  {/* Account Information */}
                  <div className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Account Information</h4>
                    <ul className="space-y-2">
                      {["Login Credentials", "Passwords (stored using industry-standard security practices)", "Account Preferences"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Wallet Information */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Wallet Information</h4>
                    <p className="text-sm text-[var(--text)] mb-3">
                      Because Masterstroke Academy integrates with the MST ecosystem, we may collect:
                    </p>
                    <ul className="space-y-2 mb-3">
                      {[
                        "BridgeKey Wallet Address",
                        "Blockchain Wallet Address",
                        "Wallet Interaction Records",
                        "Reward Distribution Records",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--text-muted)] italic">
                      Wallet addresses may be required for participation in certain programs, rewards,
                      certifications, and ecosystem activities.
                    </p>
                  </div>

                  {/* Educational Information */}
                  <div className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Educational Information</h4>
                    <p className="text-sm text-[var(--text)] mb-3">
                      We may collect information related to learning activities, including:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Course Enrollments",
                        "Module Completion Status",
                        "Assessment Attempts",
                        "Assessment Scores",
                        "Learning Progress",
                        "Certification Eligibility Status",
                        "Certification Records",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Communication Information */}
                  <div className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                    <h4 className="font-semibold text-[var(--text)] mb-3">Communication Information</h4>
                    <p className="text-sm text-[var(--text)] mb-3">
                      When you contact us, we may collect:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Email Communications",
                        "Support Requests",
                        "Feedback",
                        "Survey Responses",
                        "Customer Service Interactions",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                3
              </span>
              Information Automatically Collected
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              When you use our Services, certain technical information may be collected automatically.
            </p>
            <p className="text-[var(--text-muted)] font-medium mb-4">This may include:</p>
            <ul className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                "IP Address",
                "Browser Information",
                "Device Information",
                "Operating System",
                "Login History",
                "Access Times",
                "Pages Visited",
                "Platform Usage Information",
                "Error Logs",
                "Security Logs",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)]">
                Such information helps us improve platform performance, security, and user experience.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                4
              </span>
              Blockchain Information
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Certain Academy features operate through the MST Blockchain ecosystem. Because blockchain
              technology functions differently from traditional databases, users acknowledge that certain
              information may become permanently recorded on-chain.
            </p>
            <p className="text-[var(--text-muted)] font-medium mb-4">Such information may include:</p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Wallet Addresses",
                "Certification Records",
                "Verification Records",
                "Reward Distribution Records",
                "Validator Participation Records",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] mb-2">
                <span className="font-semibold">Important:</span> Blockchain records may be:
              </p>
              <ul className="space-y-1 ml-4 text-sm text-[var(--text)]">
                {[
                  "Publicly visible",
                  "Independently verifiable",
                  "Immutable and permanently stored",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-mst-red font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-3 italic">
                Masterstroke Academy does not control the public nature of blockchain records once they have
                been written to the blockchain.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                5
              </span>
              BridgeKey Wallet Integration
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Certain Services may require integration with BridgeKey Wallet. By connecting a wallet, users
              acknowledge that:
            </p>
            <ul className="space-y-3 mb-6 text-[var(--text)]">
              {[
                "Wallet addresses may be associated with Academy activities.",
                "Transactions may be publicly visible on blockchain explorers.",
                "Reward distributions may be traceable on-chain.",
                "Certification records may be linked to wallet addresses.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-[var(--text)]">
                <span className="font-semibold">Security Responsibility:</span> Users remain solely
                responsible for securing their wallet credentials, seed phrases, recovery phrases, and
                private keys.
              </p>
              <p className="text-sm text-[var(--text)] font-semibold text-red-600">
                ⚠️ Masterstroke Academy will never request a user's private keys or recovery phrases.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                6
              </span>
              How We Use Information
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-6">
              We may use collected information for the following purposes:
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Service Delivery",
                  items: [
                    "Create and manage accounts",
                    "Provide course access",
                    "Deliver educational content",
                    "Track progress",
                    "Conduct assessments",
                    "Issue certifications",
                  ],
                },
                {
                  title: "Ecosystem Participation",
                  items: [
                    "Verify eligibility",
                    "Enable reward distribution",
                    "Facilitate validator pathways",
                    "Record achievements",
                    "Manage participation programs",
                  ],
                },
                {
                  title: "Support and Communication",
                  items: [
                    "Respond to inquiries",
                    "Resolve technical issues",
                    "Provide account assistance",
                    "Send important notifications",
                  ],
                },
                {
                  title: "Security",
                  items: [
                    "Detect fraud",
                    "Prevent abuse",
                    "Monitor suspicious activity",
                    "Protect platform integrity",
                  ],
                },
                {
                  title: "Legal Compliance",
                  items: [
                    "Comply with applicable laws",
                    "Respond to lawful requests",
                    "Protect legal rights",
                    "Resolve disputes",
                  ],
                },
              ].map((section, idx) => (
                <div key={idx} className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                  <h4 className="font-semibold text-[var(--text)] mb-3">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                7
              </span>
              MST Rewards and Incentives
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Masterstroke Academy may offer rewards, incentives, recognition programs, or ecosystem benefits
              to eligible users. Information may be processed to:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Verify eligibility",
                "Calculate rewards",
                "Prevent abuse",
                "Distribute rewards",
                "Maintain program records",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-[var(--text)]">
                <span className="font-semibold">Important:</span> Participation in reward programs does not
                guarantee reward issuance.
              </p>
              <p className="text-sm text-[var(--text)]">
                Eligibility requirements may change from time to time.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                8
              </span>
              Certifications and On-Chain Records
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Masterstroke Academy may issue blockchain-based certifications. Users acknowledge and agree
              that:
            </p>
            <ul className="space-y-3">
              {[
                "Certification records may be stored on the MST Blockchain.",
                "Certification data may be publicly verifiable.",
                "On-chain records may remain permanently available.",
                "Blockchain entries cannot generally be altered or deleted once confirmed.",
                "Certification issuance remains subject to applicable eligibility criteria and successful completion requirements.",
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
              Information Sharing
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-6 font-semibold">
              We do not sell personal information.
            </p>
            <p className="text-[var(--text)] leading-relaxed mb-6">
              We may share information only when necessary for legitimate business purposes. This may include
              sharing information with:
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Service Providers",
                  desc: "Third-party providers that assist with:",
                  items: [
                    "Hosting",
                    "Infrastructure",
                    "Technical support",
                    "Security monitoring",
                    "Communication services",
                  ],
                },
                {
                  title: "Payment Service Providers",
                  desc: "Information necessary to process payments, verify transactions, and prevent fraud.",
                  note: "Masterstroke Academy does not store complete payment card credentials, banking PINs, or similar sensitive payment authentication information.",
                },
                {
                  title: "Legal Authorities",
                  desc: "Where required by law, regulation, court order, or lawful government request.",
                },
                {
                  title: "Business Transfers",
                  desc: "If Innoversity Innovation Pvt. Ltd. undergoes a merger, acquisition, restructuring, or asset transfer, user information may be transferred as part of that transaction.",
                },
              ].map((section, idx) => (
                <div key={idx} className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                  <h4 className="font-semibold text-[var(--text)] mb-2">{section.title}</h4>
                  <p className="text-sm text-[var(--text)] mb-2">{section.desc}</p>
                  {section.items && (
                    <ul className="space-y-1 ml-3">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 italic">{section.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                10
              </span>
              Data Security
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              We implement reasonable administrative, technical, and organizational safeguards designed to
              protect user information.
            </p>
            <p className="text-[var(--text-muted)] font-medium mb-4">Security measures may include:</p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Secure authentication systems",
                "Access controls",
                "Encryption where appropriate",
                "Security monitoring",
                "Regular platform maintenance",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] mb-2">
                However, no system connected to the internet can be guaranteed to be completely secure.
              </p>
              <p className="text-sm text-[var(--text)]">
                Users acknowledge that information transmission over the internet involves inherent risks.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                11
              </span>
              Data Retention
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              We retain information for as long as reasonably necessary to:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Provide Services",
                "Maintain educational records",
                "Verify certifications",
                "Administer rewards",
                "Meet legal obligations",
                "Resolve disputes",
                "Protect platform security",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)]">
                <span className="font-semibold">Note:</span> Certain blockchain records may remain permanently
                available due to the nature of distributed ledger technology.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                12
              </span>
              Account Deletion and Blockchain Limitations
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Users may contact us regarding account-related requests. However, users acknowledge that:
            </p>
            <ul className="space-y-3 mb-6 text-[var(--text)]">
              {[
                "Certification records may remain permanently stored on-chain.",
                "Reward records may remain permanently stored on-chain.",
                "Blockchain transactions generally cannot be deleted.",
                "Historical blockchain records may continue to exist independently of Academy systems.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)]">
                Where deletion is legally permissible, Masterstroke Academy may remove information from its
                internal systems while blockchain records remain unaffected.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                13
              </span>
              Children's Privacy
            </h2>
            <ul className="space-y-3">
              {[
                "Masterstroke Academy may be used by individuals of any age.",
                "Where applicable, participation by minors should occur under the supervision and guidance of parents or legal guardians.",
                "For student verification programs, College ID documentation may be requested where required.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 14 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                14
              </span>
              User Responsibilities
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-4">
              Users are responsible for:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text)]">
              {[
                "Maintaining account security",
                "Protecting passwords",
                "Protecting wallet credentials",
                "Providing accurate information",
                "Keeping contact information updated",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] font-semibold">
                ⚠️ Users must not share passwords, wallet recovery phrases, or private keys with anyone.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                15
              </span>
              Changes to this Privacy Policy
            </h2>
            <ul className="space-y-3">
              {[
                "Masterstroke Academy may update this Privacy Policy from time to time.",
                "Updated versions shall become effective upon publication on the official website.",
                "Continued use of the Services following publication of changes constitutes acceptance of the revised Privacy Policy.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 16 - Contact */}
          <section className="bg-gradient-to-br from-mst-red/10 to-red-600/10 border border-mst-red/30 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                16
              </span>
              Contact Us
            </h2>
            <p className="text-[var(--text-muted)] font-medium mb-6">
              For privacy-related questions, requests, or concerns, please contact:
            </p>

            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="text-lg font-bold text-[var(--text)] mb-4">Masterstroke Academy</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                <span className="text-mst-red font-semibold">A Product of</span> Masterstroke Technosoft Pvt.
                Ltd.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Address:</p>
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

                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Email:</p>
                  <p className="text-[var(--text)] font-medium">support@masterstroke.academy</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Phone:</p>
                  <p className="text-[var(--text)] font-medium">9112228906</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center text-sm text-[var(--text-muted)] pb-8">
          <p>Last Updated: 19-06-2026</p>
          <p>© 2025 Innoversity Innovation Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
