"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsConditionsPage() {
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
            Terms & Conditions
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
            Welcome to <span className="font-semibold">Masterstroke Academy.</span>
          </p>
          <p className="text-[var(--text)] leading-relaxed mb-4">
            Masterstroke Academy ("Academy", "Platform", "we", "our", or "us") is a product of{" "}
            <span className="font-semibold">Masterstroke Technosoft Pvt. Ltd.</span>
          </p>
          <p className="text-[var(--text)] leading-relaxed mb-4">
            These Terms & Conditions ("Terms") govern your access to and use of Masterstroke Academy, MST
            Blockchain ecosystem services, educational programs, certifications, validator pathways, rewards
            programs, websites, applications, and related services (collectively referred to as the "Services").
          </p>
          <p className="text-[var(--text)] leading-relaxed font-semibold text-mst-red">
            By accessing, registering, enrolling, connecting a wallet, or using any part of the Services, you
            acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not
            agree with these Terms, you must discontinue use of the Services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Section 1 - Definitions */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                1
              </span>
              Definitions
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              For the purposes of these Terms:
            </p>
            <div className="space-y-3">
              {[
                { term: "Academy", def: "refers to Masterstroke Academy." },
                { term: "Company", def: "refers to Masterstroke Technosoft Pvt. Ltd." },
                { term: "User", def: "refers to any individual accessing or using the Services." },
                { term: "BridgeKey Wallet", def: "refers to the wallet solution used within the MST ecosystem." },
                { term: "MST Blockchain", def: "refers to the public EVM-compatible blockchain ecosystem operated and supported by the Masterstroke ecosystem." },
                { term: "Certification", def: "refers to digital or blockchain-based certificates issued through the Academy." },
                { term: "Rewards", def: "refers to incentives, recognition programs, ecosystem rewards, or other benefits distributed through the Academy." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-mst-red font-bold min-w-fit">{item.term}:</span>
                  <span className="text-[var(--text)]">{item.def}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 - Eligibility */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                2
              </span>
              Eligibility
            </h2>
            <ul className="space-y-3">
              {[
                "The Services may be accessed by individuals of any age.",
                "Users below the age of majority should use the Services under the supervision of a parent or legal guardian.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] font-medium mt-4 mb-3">By using the Services, you represent that:</p>
            <ul className="space-y-2">
              {[
                "Information provided is accurate and complete.",
                "You have the legal capacity to enter into these Terms.",
                "Your use of the Services complies with applicable laws.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 - Account Registration */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                3
              </span>
              Account Registration
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">Certain features require account creation.</p>
            <p className="text-[var(--text-muted)] font-medium mb-3">Users may be required to provide:</p>
            <ul className="grid md:grid-cols-2 gap-2 mb-6">
              {[
                "Full Name",
                "Email Address",
                "Mobile Number",
                "Profile Photograph",
                "Wallet Address",
                "Student Verification Information",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] font-medium mb-3">Users are responsible for:</p>
            <ul className="space-y-2">
              {[
                "Maintaining account security.",
                "Protecting login credentials.",
                "Maintaining accurate information.",
                "Preventing unauthorized account access.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-[var(--text)]">
                Users are solely responsible for activities conducted through their accounts.
              </p>
            </div>
          </section>

          {/* Section 4 - Student Verification */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                4
              </span>
              Student Verification
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Certain programs, pricing plans, rewards, or benefits may require student verification. For verification
              purposes, the Academy may request:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Valid College Identification Card",
                "Submission of fraudulent, altered, expired, or misleading verification documents",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] font-semibold mb-2">
                Fraudulent submissions may result in:
              </p>
              <ul className="space-y-1 ml-3">
                {[
                  "Rejection of verification",
                  "Suspension of benefits",
                  "Account restrictions",
                  "Termination of access",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <span className="text-mst-red font-bold">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 - BridgeKey Wallet */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                5
              </span>
              BridgeKey Wallet Requirement
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Certain Academy features require users to connect a valid BridgeKey Wallet. Such features may include:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Reward distribution",
                "Certification issuance",
                "Ecosystem participation",
                "Validator pathways",
                "Blockchain-based activities",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] font-medium mb-3">Users are solely responsible for:</p>
            <ul className="space-y-2 mb-6">
              {[
                "Maintaining wallet access",
                "Protecting wallet credentials",
                "Securing recovery phrases",
                "Managing wallet security",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-[var(--text)] font-semibold">
                ⚠️ Masterstroke Academy will never request private keys, recovery phrases, or wallet seed phrases.
              </p>
              <p className="text-sm text-[var(--text)]">
                Loss of wallet credentials may result in permanent loss of access to associated blockchain assets,
                rewards, or certificates.
              </p>
            </div>
          </section>

          {/* Section 6 - Course Enrollment */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                6
              </span>
              Course Enrollment and Access
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Upon successful enrollment and payment, users may receive access to educational content and platform
              features.
            </p>
            <p className="text-[var(--text-muted)] font-medium mb-3">Access may include:</p>
            <ul className="space-y-2 mb-6">
              {[
                "Learning modules",
                "Assessments",
                "Educational resources",
                "Certification pathways",
                "Ecosystem participation opportunities",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] font-medium mb-3">Access rights are:</p>
            <ul className="space-y-2 mb-6">
              {["Personal", "Non-transferable", "Non-sublicensable"].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)] font-semibold mb-2">Users may not:</p>
              <ul className="space-y-1 ml-3">
                {[
                  "Share accounts",
                  "Resell access",
                  "Redistribute content",
                  "Provide access to third parties",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <span className="text-mst-red font-bold">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 7 - Lifetime Access */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                7
              </span>
              Lifetime Access
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Where a course is advertised as providing "Lifetime Access," such access means availability for as long
              as the course, platform, and associated services continue to be maintained and offered by the Academy.
            </p>
            <p className="text-[var(--text-muted)] font-medium mb-3">The Company reserves the right to:</p>
            <ul className="space-y-2">
              {[
                "Modify content",
                "Update modules",
                "Retire outdated content",
                "Reorganize learning structures",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[var(--text-muted)] mt-4 italic">
              ...without creating refund obligations.
            </p>
          </section>

          {/* Section 8 - Assessments */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                8
              </span>
              Assessments and Completion Requirements
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Course completion requirements may include:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Completion of all modules",
                "Participation in learning activities",
                "Successful assessment performance",
                "Compliance with Academy policies",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-[var(--text)]">
                The Academy reserves the right to determine eligibility for completion and certification.
              </p>
            </div>
          </section>

          {/* Section 9 - Certifications */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                9
              </span>
              Certifications
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">The Academy may issue digital and blockchain-based certifications.</p>
            <p className="text-[var(--text-muted)] font-medium mb-3">Certification eligibility may require:</p>
            <ul className="space-y-2 mb-6">
              {[
                "Successful completion of required modules",
                "Passing designated assessments",
                "Compliance with Academy standards",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-[var(--text)]">
                Certification issuance is not guaranteed merely by enrollment.
              </p>
            </div>
            <p className="text-[var(--text-muted)] font-medium mb-3">The Academy reserves the right to:</p>
            <ul className="space-y-2">
              {[
                "Deny certification",
                "Revoke certification",
                "Suspend certification eligibility",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[var(--text-muted)] mt-4 italic">
              ...where fraud, misconduct, abuse, or policy violations are identified.
            </p>
          </section>

          {/* Section 10 - On-Chain Certifications */}
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                10
              </span>
              On-Chain Certifications
            </h2>
            <p className="text-[var(--text)] leading-relaxed mb-4">
              Certain certifications may be issued and permanently recorded on the MST Blockchain. Users acknowledge
              that:
            </p>
            <ul className="space-y-3">
              {[
                "Blockchain records may be publicly verifiable.",
                "On-chain certifications may remain permanently accessible.",
                "Blockchain records generally cannot be altered or deleted.",
                "Wallet-linked certifications depend on the wallet address provided by the user.",
                "The Academy is not responsible for errors caused by incorrect wallet addresses submitted by users.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                  <span className="text-mst-red font-bold mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Sections 11-25 - Continued */}
          {[
            {
              num: 11,
              title: "Rewards Programs",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    The Academy may provide rewards, incentives, recognition programs, ecosystem benefits, or similar
                    opportunities.
                  </p>
                  <div>
                    <p className="text-[var(--text-muted)] font-medium mb-2">Eligibility may depend on:</p>
                    <ul className="space-y-2">
                      {["Course completion", "Assessment performance", "Participation requirements", "Program-specific criteria"].map(
                        (item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                            <span className="text-mst-red font-bold">•</span>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)] mb-2">
                      <span className="font-semibold">Important:</span> Participation does not guarantee reward allocation.
                    </p>
                    <p className="text-sm text-[var(--text)]">
                      The Academy reserves the right to modify reward structures, suspend reward programs, change eligibility
                      criteria, or cancel reward campaigns without prior notice where necessary.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              num: 12,
              title: "Validator Pathways",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    The Academy may provide educational pathways designed to prepare users for validator participation within
                    the MST ecosystem.
                  </p>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)] mb-2">
                      <span className="font-semibold">Note:</span> Participation in educational programs does not automatically
                      grant:
                    </p>
                    <ul className="space-y-1 ml-3">
                      {["Validator status", "Validator approval", "Validator rewards", "Network authority"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[var(--text)]">
                    Additional technical, operational, compliance, or ecosystem requirements may apply. The Company reserves sole
                    discretion regarding validator-related participation programs.
                  </p>
                </div>
              ),
            },
            {
              num: 13,
              title: "Intellectual Property Rights",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    All materials available through the Services remain the exclusive property of Masterstroke Technosoft Pvt. Ltd.
                    or its licensors.
                  </p>
                  <div className="bg-[var(--bg-muted)] rounded-lg p-4 border border-[var(--border)]">
                    <p className="text-sm text-[var(--text)] font-medium mb-2">This includes:</p>
                    <ul className="space-y-1 grid md:grid-cols-2 gap-2">
                      {[
                        "Course content",
                        "Text materials",
                        "Videos",
                        "Graphics",
                        "Assessments",
                        "Software",
                        "Branding",
                        "Trademarks",
                        "Logos",
                        "Documentation",
                        "Educational frameworks",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-mst-red font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[var(--text)]">
                    Users receive a limited, revocable, non-exclusive license solely for personal educational use. No ownership
                    rights are transferred.
                  </p>
                </div>
              ),
            },
            {
              num: 14,
              title: "Prohibited Activities",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">Users shall not:</p>
                  <ul className="space-y-2">
                    {[
                      "Copy Academy content",
                      "Record premium content for redistribution",
                      "Share account credentials",
                      "Circumvent security measures",
                      "Reverse engineer platform systems",
                      "Upload malicious software",
                      "Engage in fraud",
                      "Manipulate reward systems",
                      "Misrepresent identity",
                      "Impersonate another person",
                      "Violate applicable laws",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)] font-semibold">
                      Violations may result in immediate suspension or termination.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              num: 15,
              title: "Blockchain and Digital Asset Risks",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    Users acknowledge that blockchain technologies involve inherent risks. Such risks may include:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Network failures",
                      "Smart contract vulnerabilities",
                      "Cybersecurity incidents",
                      "Wallet compromise",
                      "Private key loss",
                      "Market volatility",
                      "Regulatory changes",
                      "Transaction delays",
                      "Blockchain congestion",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)]">
                      Participation in blockchain-related activities occurs entirely at the user's own risk.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              num: 16,
              title: "Educational Disclaimer",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    All content provided through Masterstroke Academy is intended solely for educational and informational purposes.
                    Nothing contained within the Services constitutes:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Financial advice",
                      "Investment advice",
                      "Trading advice",
                      "Tax advice",
                      "Legal advice",
                      "Professional consulting advice",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)]">
                      Users remain solely responsible for their decisions and actions. Professional advisors should be consulted
                      where appropriate.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              num: 17,
              title: "Platform Availability",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    The Academy strives to maintain uninterrupted access to Services.
                  </p>
                  <p className="text-[var(--text-muted)] font-medium mb-2">However, we do not guarantee:</p>
                  <ul className="space-y-2 mb-4">
                    {["Continuous availability", "Error-free operation", "Uninterrupted access"].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[var(--text-muted)] font-medium mb-2">Services may be temporarily unavailable due to:</p>
                  <ul className="space-y-2">
                    {[
                      "Maintenance",
                      "Security upgrades",
                      "Infrastructure issues",
                      "Third-party failures",
                      "Blockchain network issues",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              num: 18,
              title: "Third-Party Services",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    The Services may integrate with third-party services, including:
                  </p>
                  <ul className="space-y-2 mb-4">
                    {["Payment providers", "Wallet providers", "Blockchain infrastructure", "Communication platforms"].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)]">
                      The Company is not responsible for the policies, practices, availability, or conduct of third-party services.
                      Users interact with third-party services at their own discretion.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              num: 19,
              title: "Limitation of Liability",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    To the fullest extent permitted by law, Masterstroke Technosoft Pvt. Ltd., its directors, employees, affiliates,
                    contractors, and partners shall not be liable for:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-2 mb-4">
                    {[
                      "Indirect damages",
                      "Consequential damages",
                      "Special damages",
                      "Incidental damages",
                      "Loss of profits",
                      "Loss of data",
                      "Loss of opportunities",
                      "Loss of digital assets",
                      "Business interruption",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)]">
                      ...arising from use of the Services. Use of the Services is entirely at the user's own risk.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              num: 20,
              title: "Indemnification",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    Users agree to indemnify and hold harmless Masterstroke Technosoft Pvt. Ltd. from claims, liabilities, losses,
                    damages, costs, and expenses arising from:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Violation of these Terms",
                      "Misuse of the Services",
                      "Fraudulent conduct",
                      "Violation of applicable laws",
                      "Infringement of third-party rights",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              num: 21,
              title: "Suspension and Termination",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    The Academy reserves the right to suspend, restrict, or terminate access where users:
                  </p>
                  <ul className="space-y-2 mb-4">
                    {[
                      "Violate these Terms",
                      "Engage in abuse",
                      "Commit fraud",
                      "Disrupt platform operations",
                      "Compromise platform security",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-sm text-[var(--text)]">
                      Termination may occur without prior notice where necessary to protect the platform or users.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              num: 22,
              title: "Modifications to Services",
              content: (
                <div className="space-y-4">
                  <p className="text-[var(--text)] leading-relaxed">
                    The Company reserves the right to:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Add features",
                      "Remove features",
                      "Modify programs",
                      "Update content",
                      "Change pricing",
                      "Discontinue services",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[var(--text)]">
                        <span className="text-mst-red font-bold">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[var(--text-muted)] mt-4 italic">...at its sole discretion.</p>
                </div>
              ),
            },
            {
              num: 23,
              title: "Governing Law",
              content: (
                <p className="text-[var(--text)]">
                  These Terms shall be governed by and interpreted in accordance with the laws of India.
                </p>
              ),
            },
            {
              num: 24,
              title: "Jurisdiction",
              content: (
                <p className="text-[var(--text)]">
                  Any dispute, controversy, or claim arising out of or relating to these Terms or the Services shall be subject to
                  the exclusive jurisdiction of the competent courts located in Pune, Maharashtra, India.
                </p>
              ),
            },
          ].map((section, idx) => (
            <section key={idx} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
              <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                  {section.num}
                </span>
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-mst-red/10 to-red-600/10 border border-mst-red/30 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-[var(--text)] mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mst-red/20 text-mst-red font-bold">
                25
              </span>
              Contact Us
            </h2>

            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="text-lg font-bold text-[var(--text)] mb-4">Masterstroke Academy</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                <span className="text-mst-red font-semibold">A Product of</span> Masterstroke Technosoft Pvt. Ltd.
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
                  <p className="text-[var(--text)] font-medium">sarthaknimje.mst@gmail.com</p>
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
          <p>© 2025 Masterstroke Technosoft Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
