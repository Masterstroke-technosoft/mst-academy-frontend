import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Scale,
  ShieldCheck,
  Zap,
  Code2,
  Award,
  Layers,
  HelpCircle,
  Check,
  X,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute:
      "Best Blockchain Course in India 2026 - Compared | Masterstroke Academy",
  },
  description:
    "An honest comparison of leading blockchain developer courses in India - curriculum depth, live coding, certification, and career outcomes.",
  alternates: { canonical: "https://masterstroke.academy/compare" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Best Blockchain Course in India 2026 - Compared",
    description:
      "Curriculum depth, live coding, certification, and career outcomes - compared honestly.",
    url: "https://masterstroke.academy/compare",
    images: [
      {
        url: "/api/og?title=Best%20Blockchain%20Course%20in%20India%202026%20%E2%80%94%20Compared",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Blockchain Course in India 2026 - Compared",
    description:
      "Curriculum depth, live coding, certification, and career outcomes - compared honestly.",
  },
};

const compareSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Best Blockchain Course in India 2026 - Compared",
    "url": "https://masterstroke.academy/compare",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Masterstroke Academy",
      "url": "https://masterstroke.academy",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://masterstroke.academy/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Compare",
        "item": "https://masterstroke.academy/compare",
      },
    ],
  },
];

const comparisonRows = [
  {
    feature: "Live Code Execution on Real Blockchain",
    detail: "Writing and executing smart contracts on a live L1 chain",
    mst: "Yes - MST Chain",
    mstHighlight: true,
    bootcamps: "Local Simulator / Ganache",
    university: "No (Slides / Theory)",
    videoCourses: "No (Pre-recorded videos)",
  },
  {
    feature: "Verifiable Credential",
    detail: "Tamper-proof credential verifiable by recruiters",
    mst: "On-Chain NFT / Smart Contract",
    mstHighlight: true,
    bootcamps: "PDF Certificate",
    university: "Paper / PDF Certificate",
    videoCourses: "Digital Badge / PDF",
  },
  {
    feature: "Curriculum Depth & Hours",
    detail: "Structured phases from zero to advanced",
    mst: "130+ Hours, 21 Modules, 123 Submodules",
    mstHighlight: true,
    bootcamps: "40–60 Hours",
    university: "30–50 Hours (Theory)",
    videoCourses: "10–25 Hours",
  },
  {
    feature: "Smart Contract Auditing & Security",
    detail: "Reentrancy, flash loans, access control exploits",
    mst: "Full Dedicated Module & Practice",
    mstHighlight: true,
    bootcamps: "Basic Syntax Only",
    university: "Overview / Minimal",
    videoCourses: "Rarely Covered",
  },
  {
    feature: "ZK Proofs & Advanced Protocols",
    detail: "Zero-knowledge cryptography and privacy dApps",
    mst: "Included in Phase 3",
    mstHighlight: true,
    bootcamps: "Not Included",
    university: "Academic Theory Only",
    videoCourses: "Not Included",
  },
  {
    feature: "PPO Internship Opportunities",
    detail: "Merit-based hiring pipeline with partner companies",
    mst: "Yes - Direct Leaderboard PPO",
    mstHighlight: true,
    bootcamps: "Job Board Listing Only",
    university: "Campus Placements (General)",
    videoCourses: "None",
  },
  {
    feature: "Venture Grant Funding Path",
    detail: "Seed funding for top capstone projects",
    mst: "Up to $50,000 MST Grants",
    mstHighlight: true,
    bootcamps: "None",
    university: "None",
    videoCourses: "None",
  },
  {
    feature: "Pricing Model",
    detail: "Entry barrier and access affordability",
    mst: "Free Enrollment to Start",
    mstHighlight: true,
    bootcamps: "₹50,000 – ₹1,50,000",
    university: "₹1,00,000 – ₹3,00,000",
    videoCourses: "₹500 – ₹5,000",
  },
];

const tradeOffs = [
  {
    title: "When Masterstroke Academy Is Right For You",
    subtitle: "For builders, engineers, and career switchers",
    accent: "border-emerald-500/30 bg-emerald-500/5",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    points: [
      "You want to actually write and deploy Solidity contracts in every lesson - not just watch videos.",
      "You value a publicly verifiable on-chain certificate that you can show to recruiters and clients.",
      "You want a merit-based track to PPO internships and $50,000 startup grant funding.",
      "You want a structured, college-compatible pathway from cryptography basics to DeFi and security audits.",
    ],
  },
  {
    title: "When Another Option Might Be Better",
    subtitle: "Honest appraisal of alternative formats",
    accent: "border-[var(--border)] bg-[var(--surface)]",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    points: [
      "You are an executive or business leader looking only for high-level slides without coding.",
      "You specifically need a university stamp on your resume rather than practical Web3 coding skill.",
      "You want a casual 2-hour video overview to understand what Bitcoin is, rather than a full developer course.",
      "You cannot commit time to hands-on coding exercises and project building.",
    ],
  },
];

export default function ComparePage() {
  return (
    <>
      {/* Schema.org WebPage & BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        {/* Decorative background glows */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-mst-red/10 via-purple-500/5 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-2/3 -left-32 h-72 w-72 rounded-full bg-mst-red/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav
              className="mb-8 flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-mst-red transition-colors">
                Home
              </Link>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-[var(--text)] font-semibold">Compare</span>
            </nav>

            {/* Header Section */}
            <header className="mx-auto max-w-3xl text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mst-red shadow-sm mb-6">
                <Scale size={14} className="animate-pulse" />
                2026 Course Benchmark
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[var(--text)]">
                Best Blockchain Course in India 2026 -{" "}
                <span className="text-mst-red">Compared</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
                An honest comparison of leading blockchain developer programs, training bootcamps, and university certifications across curriculum depth, live coding, certification, and career outcomes.
              </p>
            </header>

            {/* Section 1: Comparison Table */}
            <section className="mb-20">
              <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]/70">
                        <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] w-1/4">
                          Feature / Parameter
                        </th>
                        <th className="py-5 px-6 text-xs font-black uppercase tracking-wider text-mst-red bg-mst-red/5 border-x border-mst-red/20 w-1/4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <Sparkles size={14} />
                            Masterstroke Academy
                          </div>
                        </th>
                        <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center w-1/6">
                          Tech Bootcamps
                        </th>
                        <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center w-1/6">
                          University Programs
                        </th>
                        <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center w-1/6">
                          Video MOOCs
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {comparisonRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-[var(--bg-muted)]/40 transition-colors"
                        >
                          {/* Feature Name & Detail */}
                          <td className="py-4 px-6">
                            <p className="font-bold text-sm text-[var(--text)]">
                              {row.feature}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              {row.detail}
                            </p>
                          </td>

                          {/* Masterstroke Column (Highlighted) */}
                          <td className="py-4 px-6 bg-mst-red/5 border-x border-mst-red/20 text-center">
                            <span className="font-black text-xs sm:text-sm text-mst-red inline-flex items-center justify-center gap-1">
                              <CheckCircle2 size={15} className="shrink-0 text-mst-red" />
                              {row.mst}
                            </span>
                          </td>

                          {/* Bootcamps Column */}
                          <td className="py-4 px-6 text-center text-xs text-[var(--text-muted)]">
                            {row.bootcamps}
                          </td>

                          {/* University Column */}
                          <td className="py-4 px-6 text-center text-xs text-[var(--text-muted)]">
                            {row.university}
                          </td>

                          {/* Video MOOCs Column */}
                          <td className="py-4 px-6 text-center text-xs text-[var(--text-muted)]">
                            {row.videoCourses}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 2: The Honest Trade-Offs */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mst-red mb-3">
                  <Scale size={14} />
                  Decision Guide
                </div>
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  The Honest <span className="text-mst-red">Trade-Offs</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
                  We believe in transparency. Here is how to evaluate which format aligns best with your immediate goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tradeOffs.map((box, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3xl border p-8 shadow-sm ${box.accent}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${box.iconBg} ${box.iconColor}`}>
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text)]">
                          {box.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)]">
                          {box.subtitle}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3.5 mt-6">
                      {box.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3 text-sm text-[var(--text)]/90 leading-relaxed">
                          <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${box.iconColor}`} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom CTA Card */}
            <section className="mt-20 sm:mt-28">
              <div className="relative overflow-hidden rounded-3xl border border-mst-red/30 bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-8 sm:p-12 shadow-2xl text-center">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mst-red/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

                <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-mst-red mb-4">
                    <Sparkles size={14} />
                    Start Coding on MST Chain
                  </div>

                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    Ready to Build on a Real Blockchain?
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    Join 1,000+ students learning Solidity, DeFi, and ZK Proofs on MST Chain.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-mst-red px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/25 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Start Free Today
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/academy-overview"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all duration-200"
                    >
                      View Full Curriculum
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Browser IDE (No Setup)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      On-Chain Certificate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      $50K Grants Pathway
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
