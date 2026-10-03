import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  Code2,
  ShieldCheck,
  Layers,
  Rocket,
  TrendingUp,
  Trophy,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  DollarSign,
  Globe2,
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute:
      "Career Outcomes & Placements - Blockchain Developer Jobs After Masterstroke Academy",
  },
  description:
    "See real career outcomes from Masterstroke Academy graduates - blockchain developer jobs, salaries, PPO internships, and startup funding in India.",
  alternates: { canonical: "https://masterstroke.academy/placements" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Career Outcomes | Masterstroke Academy",
    description:
      "Blockchain developer roles, salary ranges, and PPO internship pathways for Masterstroke Academy graduates.",
    url: "https://masterstroke.academy/placements",
    images: [
      {
        url: "/api/og?title=Career%20Outcomes%20%7C%20Masterstroke%20Academy",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Outcomes | Masterstroke Academy",
    description:
      "Blockchain developer roles, salary ranges, and PPO internship pathways for Masterstroke Academy graduates.",
  },
};

const placementSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Career Outcomes & Placements",
    "description":
      "Blockchain developer jobs, salaries, and PPO internship pathways after Masterstroke Academy.",
    "url": "https://masterstroke.academy/placements",
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
        "name": "Placements",
        "item": "https://masterstroke.academy/placements",
      },
    ],
  },
];

const careerPaths = [
  {
    title: "Smart Contract Developer",
    subtitle: "Most common outcome",
    icon: Code2,
    badge: "Solidity & DeFi",
    salaryBadge: "₹6L – ₹12L PA (Entry)",
    accentColor: "from-red-500/15 to-orange-500/10 border-red-500/30 text-mst-red",
    iconBg: "bg-mst-red/10 text-mst-red",
    description:
      "The most common outcome. Graduates write, test, and deploy Solidity smart contracts for DeFi protocols, NFT platforms, and enterprise blockchain projects. Entry-level salaries in India range from ₹6L to ₹12L per annum.",
  },
  {
    title: "Blockchain Security Auditor",
    subtitle: "Highest salary potential",
    icon: ShieldCheck,
    badge: "Vulnerability & Audits",
    salaryBadge: "₹20L – ₹50L PA (Experienced)",
    accentColor: "from-purple-500/15 to-indigo-500/10 border-purple-500/30 text-purple-500",
    iconBg: "bg-purple-500/10 text-purple-500",
    description:
      "Graduates who complete the security auditing modules are well-positioned for auditing roles - reviewing smart contracts for vulnerabilities before mainnet deployment. This specialisation commands some of the highest salaries in blockchain development, ₹20L-₹50L at experienced levels.",
  },
  {
    title: "Full-Stack Web3 Developer",
    subtitle: "End-to-End dApp Architecture",
    icon: Layers,
    badge: "Frontend + Contracts",
    salaryBadge: "₹8L – ₹18L PA",
    accentColor: "from-blue-500/15 to-cyan-500/10 border-blue-500/30 text-blue-500",
    iconBg: "bg-blue-500/10 text-blue-500",
    description:
      "Combining smart contract skills with frontend integration (React, Ethers.js, wallet connectivity), graduates in this path build complete decentralised applications end-to-end.",
  },
  {
    title: "Funded Founder",
    subtitle: "Web3 Startup Ecosystem",
    icon: Rocket,
    badge: "Demo Day & Grants",
    salaryBadge: "Up to $50,000 Grant",
    accentColor: "from-amber-500/15 to-yellow-500/10 border-amber-500/30 text-amber-500",
    iconBg: "bg-amber-500/10 text-amber-500",
    description:
      "Top capstone projects presented at Demo Day are eligible for MST ecosystem grants up to $50,000. Several graduates have used this path to launch their own Web3 startups rather than joining an existing company.",
  },
];

const salaryTableData = [
  {
    role: "Junior Blockchain Developer",
    experience: "0-1 year",
    salary: "₹6L - ₹12L PA",
    tag: "Entry Level",
    highlight: false,
  },
  {
    role: "Blockchain Developer",
    experience: "1-3 years",
    salary: "₹12L - ₹25L PA",
    tag: "Mid Level",
    highlight: false,
  },
  {
    role: "Security Auditor",
    experience: "1-3 years",
    salary: "₹20L - ₹50L PA",
    tag: "High Demand",
    highlight: true,
  },
  {
    role: "Remote Web3 Roles",
    experience: "Any level",
    salary: "$80K - $150K USD",
    tag: "Global Remote",
    highlight: true,
  },
];

export default function PlacementsPage() {
  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placementSchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        {/* Subtle decorative background grid and ambient glows */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-mst-red/10 via-purple-500/5 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-2/3 -left-32 h-72 w-72 rounded-full bg-mst-red/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav
              className="mb-8 flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-mst-red transition-colors">
                Home
              </Link>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-[var(--text)] font-semibold">Placements</span>
            </nav>

            {/* Hero / Header Section */}
            <header className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mst-red shadow-sm mb-6">
                <Briefcase size={14} className="animate-pulse" />
                Career Outcomes & Placements
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[var(--text)]">
                From Blockchain Developer Course to{" "}
                <span className="text-mst-red">Blockchain Developer Career</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
                Masterstroke Academy is built around one outcome: turning students into hireable, job-ready blockchain developers. Here&apos;s what happens after graduation - the roles, the companies, the salaries, and the funding path for founders.
              </p>
            </header>

            {/* Section 1: Career Paths After Masterstroke Academy */}
            <section className="mt-16 sm:mt-24">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mst-red mb-3">
                  <TrendingUp size={14} />
                  Graduate Specialisations
                </div>
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  Career Paths After <span className="text-mst-red">Masterstroke Academy</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
                  High-growth opportunities available to graduates across Web3 protocols, auditing firms, and venture ecosystems.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {careerPaths.map((path, idx) => {
                  const Icon = path.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm hover:border-mst-red/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-center gap-3.5">
                            <div className={`rounded-xl p-3 ${path.iconBg}`}>
                              <Icon size={24} />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-[var(--text)]">
                                {path.title}
                              </h3>
                              <p className="text-xs text-[var(--text-muted)]">
                                {path.subtitle}
                              </p>
                            </div>
                          </div>
                          <span className="hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border)]">
                            {path.badge}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-[var(--text)]/85 mb-6">
                          {path.description}
                        </p>
                      </div>

                      {/* Footer Salary Highlight */}
                      <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5">
                          <DollarSign size={14} className="text-mst-red" />
                          Target Compensation
                        </span>
                        <span className="text-xs font-bold text-mst-red px-3 py-1 rounded-full bg-mst-red/10 border border-mst-red/20">
                          {path.salaryBadge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 2: PPO Internship Track */}
            <section className="mt-16 sm:mt-24">
              <div className="relative overflow-hidden rounded-3xl border border-mst-red/30 bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-8 sm:p-12 shadow-xl">
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-mst-red/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative z-10 max-w-4xl mx-auto">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-mst-red mb-4">
                        <Trophy size={14} />
                        Merit-Driven Hiring
                      </div>

                      <h2 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                        PPO <span className="text-mst-red">Internship Track</span>
                      </h2>

                      <p className="mt-4 text-sm sm:text-base text-[var(--text)]/90 leading-relaxed">
                        Top performers on the Masterstroke Academy leaderboard qualify for Pre-Placement Offer (PPO) internship opportunities with MST partner companies. Your rank - driven by module completion, assessment scores, and project quality - directly determines your eligibility. This is not a generic placement cell; it&apos;s a merit-based pipeline tied to actual demonstrated skill.
                      </p>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                          <p className="text-xs text-[var(--text-muted)] font-medium">Rank Metric 1</p>
                          <p className="text-sm font-bold text-[var(--text)] mt-0.5">Module Completion</p>
                        </div>
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                          <p className="text-xs text-[var(--text-muted)] font-medium">Rank Metric 2</p>
                          <p className="text-sm font-bold text-[var(--text)] mt-0.5">Assessment Scores</p>
                        </div>
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                          <p className="text-xs text-[var(--text-muted)] font-medium">Rank Metric 3</p>
                          <p className="text-sm font-bold text-[var(--text)] mt-0.5">Capstone Quality</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                      <Link
                        href="/leaderboard"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-mst-red px-6 py-3 text-sm font-bold text-white shadow-lg shadow-mst-red/25 hover:bg-red-600 transition-all duration-200 text-center"
                      >
                        <Trophy size={16} />
                        View Live Leaderboard
                      </Link>
                      <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all duration-200 text-center"
                      >
                        Enroll for PPO Track
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Salary Ranges for Masterstroke Academy Graduates */}
            <section className="mt-16 sm:mt-24">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mst-red mb-3">
                  <DollarSign size={14} />
                  Industry Compensation
                </div>
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  Salary Ranges for <span className="text-mst-red">Masterstroke Academy Graduates</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
                  Current compensation benchmarks across blockchain development, smart contract auditing, and global remote engineering.
                </p>
              </div>

              {/* Table Container */}
              <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]/70">
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Role
                        </th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Experience
                        </th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Salary Range (India / Remote)
                        </th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right">
                          Market Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {salaryTableData.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-[var(--bg-muted)]/40 transition-colors"
                        >
                          <td className="py-4 px-6 font-bold text-sm text-[var(--text)]">
                            <div className="flex items-center gap-2">
                              {row.role}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[var(--text-muted)]">
                            {row.experience}
                          </td>
                          <td className="py-4 px-6 text-sm font-extrabold text-[var(--text)]">
                            <span
                              className={
                                row.highlight
                                  ? "text-mst-red font-black"
                                  : "text-[var(--text)]"
                              }
                            >
                              {row.salary}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span
                              className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                                row.highlight
                                  ? "bg-mst-red/10 text-mst-red border-mst-red/20"
                                  : "bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border)]"
                              }`}
                            >
                              {row.tag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                    Career Launchpad
                  </div>

                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    Start Your Path to a Blockchain Career
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    4 phases, on-chain certificate, PPO internship eligibility, and a path to $50K in grant funding.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/academy-overview"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-mst-red px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/25 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      View Full Curriculum
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all duration-200"
                    >
                      Enroll Free
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      PPO Internship Track
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      $50K Grants
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      On-Chain Verification
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
