import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute:
      "Best Blockchain Course in India 2026 - Compared | Masterstroke Academy",
  },
  description:
    "Choosing a blockchain developer course in India means comparing curriculum depth, hands-on coding opportunities, certification value, and real career outcomes — not just price. Here's an honest, feature-by-feature comparison.",
  alternates: { canonical: "https://masterstroke.academy/compare" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Best Blockchain Course in India 2026 - Compared",
    description:
      "Choosing a blockchain developer course in India means comparing curriculum depth, hands-on coding opportunities, certification value, and real career outcomes — not just price.",
    url: "https://masterstroke.academy/compare",
    images: [
      {
        url: "/Academy_Logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Blockchain Course in India 2026 - Compared",
    description:
      "Choosing a blockchain developer course in India means comparing curriculum depth, hands-on coding opportunities, certification value, and real career outcomes — not just price.",
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
    feature: "Live code on a real blockchain",
    mst: "Yes — MST Chain from lesson 1",
    institute: "Rarely — mostly slides/video",
    selfStudy: "No structure",
  },
  {
    feature: "On-chain verifiable certificate",
    mst: "Yes — minted on MST Blockchain",
    institute: "PDF certificate only",
    selfStudy: "None",
  },
  {
    feature: "Structured 4-phase curriculum",
    mst: "Yes — 21 modules, 130+ hrs",
    institute: "Varies widely",
    selfStudy: "No structure",
  },
  {
    feature: "Internship / PPO pathway",
    mst: "Yes — leaderboard-based",
    institute: "Sometimes, generic placement cell",
    selfStudy: "No",
  },
  {
    feature: "Startup grant funding path",
    mst: "Yes — up to $50,000",
    institute: "Rare",
    selfStudy: "No",
  },
  {
    feature: "College integration",
    mst: "Yes",
    institute: "Uncommon",
    selfStudy: "N/A",
  },
  {
    feature: "Cost to start",
    mst: "Free",
    institute: "₹15,000 - ₹80,000+",
    selfStudy: "Free",
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
            {/* Back to Home Link */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-mst-red hover:underline text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Back to Home
              </Link>
            </div>

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

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-3xl mx-auto">
                Choosing a blockchain developer course in India means comparing curriculum depth, hands-on coding opportunities, certification value, and real career outcomes — not just price. Here&apos;s an honest, feature-by-feature comparison.
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
                          Feature
                        </th>
                        <th className="py-5 px-6 text-xs font-black uppercase tracking-wider text-mst-red bg-mst-red/5 border-x border-mst-red/20 w-1/3 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <Sparkles size={14} />
                            Masterstroke Academy
                          </div>
                        </th>
                        <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center w-1/5">
                          Typical Institute Course
                        </th>
                        <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center w-1/5">
                          Free YouTube/Self-Study
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {comparisonRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-[var(--bg-muted)]/40 transition-colors"
                        >
                          {/* Feature Name */}
                          <td className="py-4 px-6">
                            <p className="font-bold text-sm text-[var(--text)]">
                              {row.feature}
                            </p>
                          </td>

                          {/* Masterstroke Column (Highlighted) */}
                          <td className="py-4 px-6 bg-mst-red/5 border-x border-mst-red/20 text-center">
                            <span className="font-black text-xs sm:text-sm text-mst-red inline-flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={15} className="shrink-0 text-mst-red" />
                              {row.mst}
                            </span>
                          </td>

                          {/* Typical Institute Course Column */}
                          <td className="py-4 px-6 text-center text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                            {row.institute}
                          </td>

                          {/* Free YouTube/Self-Study Column */}
                          <td className="py-4 px-6 text-center text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                            {row.selfStudy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 2: The Honest Trade-Offs */}
            <section className="mb-20 max-w-4xl mx-auto">
              <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)] text-center mb-6">
                The Honest <span className="text-mst-red">Trade-Offs</span>
              </h2>

              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 shadow-sm">
                <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed">
                  Traditional institutes often have longer operating histories and larger alumni networks. Free self-study is genuinely free but lacks structure, live blockchain access, and any credential. Masterstroke Academy&apos;s trade-off is being newer — but it directly addresses the biggest gap in Indian blockchain education: real, live, on-chain coding experience with an outcome-linked path to internships and funding, not just a certificate at the end.
                </p>
              </div>
            </section>

            {/* Section 3: See the Difference for Yourself */}
            <section className="mt-16 sm:mt-24 max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl border border-mst-red/30 bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-8 sm:p-12 shadow-2xl text-center">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mst-red/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    See the Difference for Yourself
                  </h3>

                  <p className="mt-4 text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto">
                    Start free — no commitment required to explore the curriculum.
                  </p>

                  <div className="mt-8 flex items-center justify-center">
                    <Link
                      href="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-mst-red px-5 sm:px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-mst-red/25 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 text-center whitespace-nowrap"
                    >
                      <span>→</span>
                      <span>Compare by Trying It Free</span>
                    </Link>
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
