import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Award,
  Briefcase,
  Coins,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  BookOpen,
  Clock,
  Check,
  Shield,
  Zap,
} from "lucide-react";
import { BlockchainCourseFaq } from "./BlockchainCourseFaq";

export const metadata: Metadata = {
  title: {
    absolute:
      "Blockchain Developer Course India | Live Code, On-Chain Certificate | Masterstroke Academy",
  },
  description:
    "India's most structured blockchain developer course — 130+ hrs of live Solidity coding, on-chain certificate, PPO internship & $50K grant path. Start free.",
  alternates: {
    canonical: "https://masterstroke.academy/blockchain-course-india",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Blockchain Developer Course India | Live Code, On-Chain Certificate | Masterstroke Academy",
    description:
      "India's most structured blockchain developer course — 130+ hrs of live Solidity coding, on-chain certificate, PPO internship & $50K grant path. Start free.",
    url: "https://masterstroke.academy/blockchain-course-india",
    images: [
      {
        url: "/Academy_Logo.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blockchain Developer Course India | Live Code, On-Chain Certificate | Masterstroke Academy",
    description:
      "India's most structured blockchain developer course — 130+ hrs of live Solidity coding, on-chain certificate, PPO internship & $50K grant path. Start free.",
  },
};

const courseSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Blockchain Developer Course India",
    "description":
      "130+ hours of live Solidity coding, on-chain certificate, PPO internship path, and MST grant funding.",
    "url": "https://masterstroke.academy/blockchain-course-india",
    "provider": {
      "@type": "Organization",
      "name": "Masterstroke Academy",
      "url": "https://masterstroke.academy",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT130H",
      "offers": {
        "@type": "Offer",
        "category": "Paid",
        "priceCurrency": "INR",
        "url": "https://masterstroke.academy/register",
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this blockchain course free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes, enrollment is free to start. Fellowship plans unlock full curriculum access and internship eligibility.",
        },
      },
      {
        "@type": "Question",
        "name": "Do I need coding experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "No. The course starts from internet and cryptography fundamentals before introducing Solidity.",
        },
      },
      {
        "@type": "Question",
        "name": "What makes this different from other blockchain courses in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Live code execution on a real blockchain, an on-chain certificate, and a direct path to internships and grant funding - not just a certificate at the end.",
        },
      },
    ],
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
        "name": "Blockchain Course India",
        "item": "https://masterstroke.academy/blockchain-course-india",
      },
    ],
  },
];

const differentiators = [
  {
    title: "Live code execution, not slides",
    badge: "Interactive Browser IDE",
    description:
      "Every lesson includes hands-on coding directly in your browser, executed on MST Chain - an EVM-compatible hybrid Layer-1 built for India.",
    icon: Code2,
    accent: "text-mst-red",
    bg: "bg-mst-red/10",
    border: "border-mst-red/20",
  },
  {
    title: "On-chain certificate",
    badge: "Tamper-Proof Credential",
    description:
      "Your credential is minted directly on the blockchain - publicly verifiable, tamper-proof, and unlike any paper certificate offered by traditional training institutes.",
    icon: Award,
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "PPO internship path",
    badge: "Merit-Based Pipeline",
    description:
      "Top leaderboard performers are considered for internships with MST partner companies - your performance in the course directly opens doors.",
    icon: Briefcase,
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    title: "$50,000 grant funding",
    badge: "Ecosystem Venture Fund",
    description:
      "Graduate with a live capstone project and pitch it at Demo Day for MST ecosystem grant funding - turning your course project into a real startup.",
    icon: Coins,
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    title: "College-integrated syllabus",
    badge: "Academic & Industry Aligned",
    description:
      "Structured to align with academic and industry standards, so engineering students can pursue this alongside their degree.",
    icon: GraduationCap,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const stats = [
  {
    value: "4",
    label: "Phases",
    color: "text-mst-red",
    icon: Layers,
  },
  {
    value: "21",
    label: "Modules",
    color: "text-blue-500",
    icon: BookOpen,
  },
  {
    value: "123",
    label: "Submodules",
    color: "text-purple-500",
    icon: Code2,
  },
  {
    value: "130+",
    label: "Hours of Content",
    color: "text-emerald-500",
    icon: Clock,
  },
];

const faqs = [
  {
    q: "Is this blockchain course free?",
    a: "Yes, enrollment is free to start. Fellowship plans unlock full curriculum access and internship eligibility.",
  },
  {
    q: "Do I need coding experience?",
    a: "No. The course starts from internet and cryptography fundamentals before introducing Solidity.",
  },
  {
    q: "What makes this different from other blockchain courses in India?",
    a: "Live code execution on a real blockchain, an on-chain certificate, and a direct path to internships and grant funding - not just a certificate at the end.",
  },
];

export default function BlockchainCourseIndiaPage() {
  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
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

            {/* Hero / Header Section */}
            <header className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mst-red shadow-sm mb-6">
                <Sparkles size={14} className="animate-pulse" />
                India&apos;s #1 Web3 Developer Program
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[var(--text)]">
                The Blockchain Developer Course{" "}
                <span className="text-mst-red">India&apos;s Top Engineering Students Choose</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-3xl mx-auto">
                If you searched for a blockchain developer course in India, here&apos;s what sets Masterstroke Academy apart from every training institute, bootcamp, and online certification program you&apos;ll find: this is the only program where you write real Solidity code on a real, live blockchain - MST Chain - from your very first lesson.
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
                  Explore Curriculum
                </Link>
              </div>
            </header>

            {/* Section 1: Why This Blockchain Course Is Different */}
            <section className="mt-16 sm:mt-24">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mst-red mb-3">
                  <Zap size={14} />
                  Program Advantages
                </div>
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  Why This Blockchain Course <span className="text-mst-red">Is Different</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
                  Built specifically for engineering students and aspiring Web3 builders in India.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {differentiators.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm hover:border-mst-red/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className={`rounded-xl p-3 ${item.bg} ${item.accent}`}>
                            <Icon size={22} />
                          </div>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border)]">
                            {item.badge}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--text)] mb-3">
                          {item.title}
                        </h3>

                        <p className="text-sm leading-relaxed text-[var(--text)]/85">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center text-xs font-semibold text-mst-red gap-1.5">
                        <Check size={14} className="stroke-[3]" />
                        Included in curriculum
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 2: Curriculum Snapshot */}
            <section className="mt-16 sm:mt-24">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  Curriculum <span className="text-mst-red">Snapshot</span>
                </h2>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-muted)]">
                        <Icon size={24} className={stat.color} />
                      </div>
                      <div className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="mt-1.5 text-sm sm:text-base font-bold text-[var(--text)]">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3: Frequently Asked Questions */}
            <section className="mt-16 sm:mt-24">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mst-red mb-3">
                  <Shield size={14} />
                  Clear Answers
                </div>
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  Frequently Asked <span className="text-mst-red">Questions</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
                  Common questions about enrollment, prerequisites, and how Masterstroke Academy compares.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <BlockchainCourseFaq faqs={faqs} />
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
                    Enrollment Open
                  </div>

                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    Enroll in India&apos;s Most Structured Blockchain Course
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    Start free. Upgrade anytime for full access and internship eligibility.
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
                      Browse Full Syllabus
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      Live Solidity IDE
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      On-Chain Certificate
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      PPO Internship Track
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
