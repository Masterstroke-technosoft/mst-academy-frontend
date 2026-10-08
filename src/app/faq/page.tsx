import type { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import siteWideFaq from "@/lib/schema/site-wide-faq.json";
import { FaqClientHub, type FaqCategory } from "./FaqClientHub";

export const metadata: Metadata = {
  title: {
    absolute:
      "FAQ - Blockchain Course, Certificate & Career Questions | Masterstroke Academy",
  },
  description:
    "Answers to every common question about Masterstroke Academy's blockchain developer course - curriculum, certificate, pricing, career outcomes, and MST Chain.",
  alternates: { canonical: "https://masterstroke.academy/faq" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAQ | Masterstroke Academy",
    description:
      "Every common question about the blockchain developer course, certificate, and career outcomes - answered.",
    url: "https://masterstroke.academy/faq",
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
    title: "FAQ | Masterstroke Academy",
    description:
      "Every common question about the blockchain developer course, certificate, and career outcomes - answered.",
  },
};

const breadcrumbSchema = {
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
      "name": "FAQ",
      "item": "https://masterstroke.academy/faq",
    },
  ],
};

// Map questions exactly as validated in site-wide-faq.json
const rawQuestions = siteWideFaq.mainEntity;

const findAnswer = (questionName: string, fallbackIndex?: number) => {
  const match = rawQuestions.find(
    (item) => item.name.toLowerCase().trim() === questionName.toLowerCase().trim()
  );
  if (match) return match.acceptedAnswer.text;
  if (fallbackIndex !== undefined && rawQuestions[fallbackIndex]) {
    return rawQuestions[fallbackIndex].acceptedAnswer.text;
  }
  return "";
};

const categories: FaqCategory[] = [
  {
    id: "about",
    title: "About the",
    titleHighlight: "Course",
    items: [
      {
        q: "What is Masterstroke Academy?",
        a: findAnswer("What is Masterstroke Academy?", 0),
      },
      {
        q: "Is the blockchain course free?",
        a: findAnswer("Is the Masterstroke Academy blockchain course free?", 1),
      },
      {
        q: "Do I need prior coding or blockchain experience?",
        a: findAnswer("Do I need prior coding or blockchain experience to join?", 2),
      },
      {
        q: "How many modules and hours does the course include?",
        a: findAnswer("How many modules and hours does the course include?", 3),
      },
      {
        q: "What is the structure of the 4 phases?",
        a: findAnswer("What is the structure of the 4 phases?", 4),
      },
    ],
  },
  {
    id: "curriculum",
    title: "Curriculum &",
    titleHighlight: "Topics",
    items: [
      {
        q: "What Solidity topics does the curriculum cover?",
        a: findAnswer("What topics are covered in Solidity and smart contract development?", 9),
      },
      {
        q: "Does the course cover DeFi development?",
        a: findAnswer("Does the course cover DeFi development?", 10),
      },
      {
        q: "Does the course cover NFTs and DAOs?",
        a: findAnswer("Does the course cover NFTs and DAOs?", 11),
      },
      {
        q: "What is ZK Proofs and does the course cover it?",
        a: findAnswer("What is ZK Proofs and does the course cover it?", 12),
      },
      {
        q: "What blockchain is used for live coding and deployment?",
        a: findAnswer("What blockchain is used for live coding and deployment?", 8),
      },
    ],
  },
  {
    id: "assessments",
    title: "Assessments &",
    titleHighlight: "Certification",
    items: [
      {
        q: "What is the assessment pass rate?",
        a: findAnswer("What is the assessment pass rate?", 5),
      },
      {
        q: "What certificate do I receive on completing the course?",
        a: findAnswer("What certificate do I receive on completing the course?", 6),
      },
      {
        q: "Can I get funding after completing the course?",
        a: findAnswer("Can I get funding after completing the course?", 7),
      },
    ],
  },
  {
    id: "enrollment",
    title: "Enrollment &",
    titleHighlight: "Plans",
    items: [
      {
        q: "What is the Fellowship plan?",
        a: findAnswer("What is the Fellowship plan?", 14),
      },
      {
        q: "How does the leaderboard and streak system work?",
        a: findAnswer("How does the leaderboard and streak system work?", 15),
      },
      {
        q: "How long does it take to complete the full curriculum?",
        a: findAnswer("How long does it take to complete the full curriculum?", 18),
      },
    ],
  },
  {
    id: "company",
    title: "Company &",
    titleHighlight: "Policies",
    items: [
      {
        q: "Who operates Masterstroke Academy?",
        a: findAnswer("Who operates Masterstroke Academy?", 16),
      },
      {
        q: "Is there a refund policy?",
        a: findAnswer("Is there a refund policy?", 17),
      },
      {
        q: "Is the course integrated with college curricula in India?",
        a: findAnswer("Is the course integrated with college curricula in India?", 13),
      },
      {
        q: "What makes Masterstroke Academy different from other blockchain courses in India?",
        a: findAnswer("What makes Masterstroke Academy different from other blockchain courses in India?", 19),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* Schema.org FAQPage Structured Data (Complete site-wide FAQ schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteWideFaq) }}
      />
      {/* Schema.org BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        {/* Subtle decorative background grid and ambient glows */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-mst-red/10 via-purple-500/5 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-2/3 -left-32 h-72 w-72 rounded-full bg-mst-red/10 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
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
            <header className="mx-auto max-w-3xl text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mst-red shadow-sm mb-6">
                <HelpCircle size={14} className="animate-pulse" />
                Knowledge & Help Hub
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[var(--text)]">
                Frequently Asked <span className="text-mst-red">Questions</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-3xl mx-auto">
                Everything you need to know about Masterstroke Academy&apos;s blockchain developer program, organised by topic. Use the content from site-wide-faq.json (already provided) for the full 20-question set below, organised into these categories.
              </p>

              {/* Quick Jump Category Pills */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:border-mst-red/40 hover:text-mst-red hover:bg-[var(--bg-muted)] transition-all shadow-sm"
                  >
                    {cat.title} {cat.titleHighlight}
                  </a>
                ))}
              </div>
            </header>

            {/* Main Interactive FAQ Hub */}
            <FaqClientHub categories={categories} />

            {/* Bottom CTA Card */}
            <section className="mt-20 sm:mt-28">
              <div className="relative overflow-hidden rounded-3xl border border-mst-red/30 bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-8 sm:p-12 shadow-2xl text-center">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mst-red/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

                <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-mst-red mb-4">
                    <Sparkles size={14} />
                    Start Learning Today
                  </div>

                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    Still Have Questions?
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    Our support team is available Mon–Sat, 10am–6pm IST. Or jump straight in with free enrollment on MST Chain.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-mst-red px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/25 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Enroll Free Now
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/contact-us"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all duration-200"
                    >
                      Contact Support
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      Free Registration
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      Live IDE Access
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      24/48hr Reply
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
