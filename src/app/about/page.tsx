import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Target,
  Network,
  Award,
  Users,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute:
      "About Masterstroke Academy - India's Blockchain Developer Education Platform",
  },
  description:
    "Masterstroke Academy is India's structured blockchain developer program, built on MST Chain by Masterstroke Technosoft Private Limited.",
  alternates: { canonical: "https://masterstroke.academy/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About Masterstroke Academy",
    description:
      "India's structured blockchain developer education platform, built on MST Chain.",
    url: "https://masterstroke.academy/about",
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
    title: "About Masterstroke Academy",
    description:
      "India's structured blockchain developer education platform, built on MST Chain.",
  },
};

const aboutSchema = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Masterstroke Academy",
    "url": "https://masterstroke.academy/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "Masterstroke Academy",
      "url": "https://masterstroke.academy",
      "logo": "https://masterstroke.academy/Acadmy Logo.png",
      "parentOrganization": {
        "@type": "Organization",
        "name": "Masterstroke Technosoft Private Limited",
      },
      "sameAs": [
        "https://twitter.com/MasterstrokeAcademy",
        "https://linkedin.com/company/masterstroke-academy",
      ],
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
        "name": "About",
        "item": "https://masterstroke.academy/about",
      },
    ],
  },
];

const differentiators = [
  {
    title: "Live, not theoretical",
    description:
      "Every module includes hands-on coding executed on a real blockchain from lesson one.",
    icon: Zap,
    badge: "Interactive Browser IDE",
    accent: "text-mst-red",
    bg: "bg-mst-red/10",
  },
  {
    title: "Credential that means something",
    description:
      "Our on-chain certificate is publicly verifiable - not a PDF that anyone can claim to have earned.",
    icon: Award,
    badge: "On-Chain Tamper-Proof",
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Outcomes-focused",
    description:
      "PPO internship pathways and MST ecosystem grants up to $50,000 turn course completion into real career and funding outcomes.",
    icon: Target,
    badge: "PPO & Grants",
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Built for India's institutions",
    description:
      "Our college-integration program lets engineering students earn blockchain credentials alongside their degree.",
    icon: Building2,
    badge: "College Integrated",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        {/* Decorative background glows */}
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

            {/* Header Section */}
            <header className="mx-auto max-w-3xl text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mst-red shadow-sm mb-6">
                <Sparkles size={14} className="animate-pulse" />
                Empowering India&apos;s Web3 Builders
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[var(--text)]">
                About <span className="text-mst-red">Masterstroke Academy</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
                Masterstroke Academy is India&apos;s structured blockchain developer education platform, built to close the gap between blockchain&apos;s explosive growth and the shortage of skilled developers who can actually build on it.
              </p>
            </header>

            {/* Section 1: Our Mission */}
            <section className="mb-16">
              <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mst-red/10 text-mst-red">
                    <Target size={22} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text)]">
                    Our <span className="text-mst-red">Mission</span>
                  </h2>
                </div>

                <p className="text-base sm:text-lg leading-relaxed text-[var(--text)]/90">
                  India ranks #1 globally in crypto adoption and is the world&apos;s second-largest Web3 developer base - yet most blockchain education available in India is theory-heavy, video-based, and disconnected from real, on-chain experience. Masterstroke Academy exists to fix that: every lesson includes live code execution on a real blockchain, every graduate receives a verifiable on-chain credential, and every top performer has a real path to internships and funding.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--border)]">
                  <div className="rounded-xl bg-[var(--bg-muted)] p-4">
                    <p className="text-2xl font-black text-mst-red">#1</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Global Crypto Adoption Rank</p>
                  </div>
                  <div className="rounded-xl bg-[var(--bg-muted)] p-4">
                    <p className="text-2xl font-black text-blue-500">2nd</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Largest Web3 Developer Base</p>
                  </div>
                  <div className="rounded-xl bg-[var(--bg-muted)] p-4">
                    <p className="text-2xl font-black text-emerald-500">100%</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Live Hands-on Execution</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Built on MST Chain */}
            <section className="mb-16">
              <div className="relative overflow-hidden rounded-3xl border border-mst-red/30 bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-8 sm:p-10 shadow-md">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-mst-red/15 blur-3xl" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mst-red text-white shadow-md">
                    <Network size={22} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text)]">
                    Built on <span className="text-mst-red">MST Chain</span>
                  </h2>
                </div>

                <p className="text-base sm:text-lg leading-relaxed text-[var(--text)]/90">
                  Masterstroke Academy runs on MST Chain, an EVM-compatible hybrid Layer-1 blockchain purpose-built for India. This means every smart contract our students write, test, and deploy runs on infrastructure designed for the scale and cost-sensitivity of the Indian market - not a simulated or sandboxed environment.
                </p>
              </div>
            </section>

            {/* Section 3: What Makes Us Different */}
            <section className="mb-16">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-mst-red mb-3">
                  <ShieldCheck size={14} />
                  Core Differentiators
                </div>
                <h2 className="text-2xl font-black sm:text-4xl tracking-tight text-[var(--text)]">
                  What Makes <span className="text-mst-red">Us Different</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
                  A program designed from day one around actual developer capability and demonstrable credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-muted)]">
                            {item.badge}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--text)] mb-2">
                          {item.title}
                        </h3>

                        <p className="text-sm leading-relaxed text-[var(--text)]/85">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: Company Information */}
            <section className="mb-16">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mst-red/10 text-mst-red">
                    <Building2 size={22} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text)]">
                    Company <span className="text-mst-red">Information</span>
                  </h2>
                </div>

                <p className="text-base sm:text-lg leading-relaxed text-[var(--text)]/90 mb-8">
                  Masterstroke Academy is operated by Masterstroke Technosoft Private Limited.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--border)]">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-mst-red mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Registered Office</p>
                        <p className="text-sm text-[var(--text)] mt-1 leading-relaxed">
                          T3, Kohinoor World Towers, Old Pune-Mumbai Highway, Opposite Empire Estate, Pimpri, Pune – 411018, Maharashtra, India.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail size={18} className="text-mst-red mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Official Inquiries</p>
                        <a
                          href="mailto:support@masterstroke.academy"
                          className="text-sm font-semibold text-mst-red hover:underline block mt-1"
                        >
                          support@masterstroke.academy
                        </a>
                      </div>
                    </div>
                  </div>
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
                    Web3 Developer Movement
                  </div>

                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    Join India&apos;s Blockchain Developer Movement
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    1,000+ students already building on MST Chain.
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

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      Built for India
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      Live On-Chain Coding
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      PPO & Grants Track
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
