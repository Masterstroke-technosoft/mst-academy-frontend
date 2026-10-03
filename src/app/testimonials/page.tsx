import type { Metadata } from "next";
import Link from "next/link";
import {
  Quote,
  Star,
  Users,
  Award,
  Percent,
  Coins,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Student Reviews - Masterstroke Academy Blockchain Course | Real Outcomes",
  },
  description:
    "Read real reviews from Masterstroke Academy students - blockchain developers who learned Solidity, DeFi, and Web3 development and landed internships and jobs.",
  alternates: { canonical: "https://masterstroke.academy/testimonials" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Student Reviews | Masterstroke Academy",
    description:
      "Real outcomes from real students - blockchain developer careers built on MST Chain.",
    url: "https://masterstroke.academy/testimonials",
    images: [
      {
        url: "/api/og?title=Student%20Reviews%20%7C%20Masterstroke%20Academy",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Reviews | Masterstroke Academy",
    description:
      "Real outcomes from real students - blockchain developer careers built on MST Chain.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://masterstroke.academy/",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Testimonials",
      "item": "https://masterstroke.academy/testimonials",
    },
  ],
};

const testimonials = [
  {
    name: "Aarav Kapoor",
    role: "Final-year B.Tech, Computer Science",
    quote:
      "I had zero blockchain knowledge before joining. The structured phases meant I never felt lost - by Phase 3 I was deploying real smart contracts on MST Chain. The on-chain certificate is something I actually show recruiters.",
    badge: "Smart Contracts • MST Chain",
    initials: "AK",
    accent: "from-red-500/20 to-orange-500/10 border-red-500/30 text-mst-red",
  },
  {
    name: "Diya Sharma",
    role: "Blockchain Developer, Web3 Startup",
    quote:
      "What sets Masterstroke apart is the live code execution. Most courses show you slides - this one has you writing Solidity in the browser from day one. I got my internship offer through the leaderboard's PPO track.",
    badge: "Browser IDE • PPO Internship",
    initials: "DS",
    accent: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500",
  },
  {
    name: "Rohan Patel",
    role: "Smart Contract Auditor",
    quote:
      "The security auditing module alone was worth the enrollment. I learned to actually think like an attacker - reentrancy, access control, flash loan exploits. That's the skill that got me hired.",
    badge: "Security Audits • Exploits",
    initials: "RP",
    accent: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-500",
  },
  {
    name: "Sara Mehta",
    role: "Founder, DeFi Startup (MST Grant Recipient)",
    quote:
      "I built my capstone project during Phase 3 and pitched it at Demo Day. Six weeks later I had an MST ecosystem grant to build it out further. This course is genuinely a launchpad, not just a certificate.",
    badge: "Demo Day • $50K MST Grant",
    initials: "SM",
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-500",
  },
  {
    name: "Kabir Thakur",
    role: "Web3 Developer, Remote (US Client)",
    quote:
      "The curriculum's DeFi and NFT modules gave me a portfolio I could actually show. I'm now working remotely for a US-based Web3 startup, something I didn't think was possible six months ago.",
    badge: "DeFi & NFTs • Global Remote",
    initials: "KT",
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500",
  },
  {
    name: "Ananya Reddy",
    role: "Engineering Student, College-Integrated Batch",
    quote:
      "My college partnered with Masterstroke Academy, so I got the blockchain curriculum alongside my regular coursework. Having both my degree and an on-chain certificate is a combination none of my peers have.",
    badge: "College Integrated • On-Chain Credential",
    initials: "AR",
    accent: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-500",
  },
];

const stats = [
  {
    value: "1,000+",
    label: "Enrolled Students",
    subtext: "Learners building on Web3 across India",
    icon: Users,
    color: "text-blue-500",
    bgGradient: "from-blue-500/10 to-transparent",
    border: "border-blue-500/20",
  },
  {
    value: "500+",
    label: "On-Chain Certificates Issued",
    subtext: "Tamper-proof credentials on MST Chain",
    icon: Award,
    color: "text-mst-red",
    bgGradient: "from-red-500/10 to-transparent",
    border: "border-red-500/20",
  },
  {
    value: "70%",
    label: "Minimum Assessment Pass Rate",
    subtext: "Rigorous standards for job-readiness",
    icon: Percent,
    color: "text-emerald-500",
    bgGradient: "from-emerald-500/10 to-transparent",
    border: "border-emerald-500/20",
  },
  {
    value: "$50K",
    label: "Max Grant Funding Available",
    subtext: "Ecosystem grants for top Demo Day projects",
    icon: Coins,
    color: "text-amber-500",
    bgGradient: "from-amber-500/10 to-transparent",
    border: "border-amber-500/20",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* Schema.org BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        {/* Subtle decorative background grid and glows */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-mst-red/10 via-purple-500/5 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-2/3 -left-32 h-72 w-72 rounded-full bg-mst-red/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-mst-red transition-colors">
                Home
              </Link>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-[var(--text)] font-semibold">Testimonials</span>
            </nav>

            {/* Hero / Header Section */}
            <header className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mst-red shadow-sm mb-6">
                <Sparkles size={14} className="animate-pulse" />
                Verified Student Reviews
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[var(--text)]">
                Real Students. <span className="text-mst-red">Real Blockchain Careers.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
                Masterstroke Academy has helped students across India go from zero blockchain knowledge to job-ready Web3 developers. Here&apos;s what they have to say about the curriculum, the community, and the outcomes.
              </p>
            </header>

            {/* Section 1: By the Numbers */}
            <section className="mt-16 sm:mt-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black sm:text-3xl tracking-tight text-[var(--text)]">
                  By the <span className="text-mst-red">Numbers</span>
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Measurable impact and milestones powering our student ecosystem
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-[var(--surface)] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl ${stat.bgGradient} rounded-bl-full pointer-events-none`} />
                      <div className="flex items-center justify-between mb-4">
                        <div className={`rounded-xl p-2.5 bg-[var(--bg-muted)] ${stat.color}`}>
                          <Icon size={22} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)]">
                          Verified
                        </span>
                      </div>
                      <div className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="mt-2 text-sm font-bold text-[var(--text)]">
                        {stat.label}
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-muted)] leading-normal">
                        {stat.subtext}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 2: What Our Students Say */}
            <section className="mt-20 sm:mt-28">
              <div className="mx-auto max-w-3xl text-center mb-12">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mst-red mb-3">
                  <Quote size={14} />
                  Student Stories
                </div>
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  What Our <span className="text-mst-red">Students Say</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
                  Read authentic experiences from learners who built contracts, earned grants, and launched Web3 careers.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm hover:border-mst-red/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    {/* Top row: Stars & Badge */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={15} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border)]">
                          {t.badge}
                        </span>
                      </div>

                      {/* Quote Text */}
                      <p className="text-sm leading-relaxed text-[var(--text)]/90 italic relative">
                        <span className="text-mst-red font-serif text-lg font-bold mr-1">&ldquo;</span>
                        {t.quote}
                        <span className="text-mst-red font-serif text-lg font-bold ml-1">&rdquo;</span>
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br border ${t.accent}`}>
                        {t.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-[var(--text)] truncate">
                            {t.name}
                          </p>
                          <ShieldCheck size={14} className="text-mst-red flex-shrink-0" />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                          {t.role}
                        </p>
                      </div>
                    </div>
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
                    Begin Your Web3 Journey
                  </div>

                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    Ready to Write Your Own Success Story?
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    Join 1,000+ students building real blockchain skills on MST Chain.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-mst-red px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/25 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Start Free at Masterstroke Academy
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/academy-overview"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all duration-200"
                    >
                      Browse Full Syllabus
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Free Enrollment
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Browser IDE (No Setup)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      On-Chain Certificate
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
