"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Typewriter } from "@/components/marketing/Typewriter";
import { RevealSection } from "@/components/marketing/RevealSection";

interface PlanFunnelPageProps {
  planId: "validator" | "student" | "normal" | "courseOnly";
  name: string;
  subtitle: string;
  hero: string;
  originalPrice: number;
  offerPrice: number;
  discountLabel: string;
  seatsLeft: number;
  internshipIncluded: boolean;
  fractionIncluded: boolean;
  validatorPortalAccess?: boolean;
  highlights: string[];
  outcomes: string[];
  transformation: string[];
  internshipTrack: string[];
  mentorSupport: string[];
  workflow: string[];
  testimonials: { name: string; role: string; text: string }[];
  faqs: { q: string; a: string }[];
}

export function PlanFunnelPage({
  planId,
  name,
  subtitle,
  hero,
  originalPrice,
  offerPrice,
  discountLabel,
  seatsLeft,
  internshipIncluded,
  fractionIncluded,
  validatorPortalAccess = false,
  highlights,
  outcomes,
  transformation,
  internshipTrack,
  mentorSupport,
  workflow,
  testimonials,
  faqs,
}: PlanFunnelPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const discountAmount = useMemo(() => originalPrice - offerPrice, [originalPrice, offerPrice]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <RevealSection>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 shadow-xl backdrop-blur-md sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-mst-red/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
            <p className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-mst-red">
              <Sparkles className="h-3.5 w-3.5" />
              Enrollment Funnel
            </p>
            <h1 className="mt-5 text-3xl font-black text-[var(--text)] sm:text-5xl">{name}</h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">{subtitle}</p>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">{hero}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-500">
              Limited intake: only {seatsLeft} seats left for this batch
            </div>
            <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-mst-red"
                style={{ width: `${Math.max(8, Math.min(98, ((60 - seatsLeft) / 60) * 100))}%` }}
              />
            </div>
            <p className="mt-4 text-xl font-black text-[var(--text)] sm:text-2xl">
              <Typewriter
                strings={[
                  "Real knowledge with execution.",
                  "Paid internship with real projects.",
                  "Mentorship that drives placement outcomes.",
                  "Learn. Build. Ship. Grow.",
                ]}
                speedMs={36}
                pauseMs={950}
                className="text-gradient-red"
              />
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                { label: "Internship", value: internshipIncluded ? "Included" : "Not included", icon: Briefcase },
                { label: "Mentor interaction", value: "Weekly", icon: Users },
                { label: "Project exposure", value: "Real-world", icon: Trophy },
                { label: "Fraction + MSTC", value: fractionIncluded ? "Included" : "Not included", icon: Zap },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4">
                  <item.icon className="h-4 w-4 text-mst-red" />
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{item.label}</p>
                  <p className="mt-1 text-lg font-black text-[var(--text)]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-mst-red/30 bg-mst-red/5 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Special pricing</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-[var(--text-muted)] line-through">
                  Rs {originalPrice.toLocaleString("en-IN")}
                </p>
                <p className="text-3xl font-black text-gradient-red">
                  Rs {offerPrice.toLocaleString("en-IN")}
                </p>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
                  Save Rs {discountAmount.toLocaleString("en-IN")} ({discountLabel})
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                {planId === "student" ? "Student discount is activated after valid student ID verification." : "Offer valid for current enrollment window."}
              </p>
            </div>

            <div className="mt-8">
              <Link
                href={`/register?plan=${planId}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mst-red to-red-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-mst-red/20 transition hover:brightness-110"
              >
                Buy Course Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-lg font-black text-[var(--text)]">How your workflow runs</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((step, idx) => (
                <div
                  key={step}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition hover:-translate-y-1 hover:border-mst-red/40"
                >
                  <p className="text-[10px] font-black uppercase tracking-wider text-mst-red">Step {idx + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="flex items-center gap-2 text-lg font-black text-[var(--text)]">
                <BadgeCheck className="h-5 w-5 text-mst-red" />
                What you get after enrollment
              </h2>
              <div className="mt-4 space-y-2.5">
                {highlights.map((point) => (
                  <p key={point} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mst-red" />
                    {point}
                  </p>
                ))}
                {fractionIncluded && (
                  <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mst-red" />
                    1 fraction allocation with 19 years daily MSTC reward-coin participation.
                  </p>
                )}
                {validatorPortalAccess && (
                  <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mst-red" />
                    Dedicated validator portal and stakeholder role within MST Blockchain ecosystem.
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="flex items-center gap-2 text-lg font-black text-[var(--text)]">
                <Rocket className="h-5 w-5 text-emerald-500" />
                Outcomes you can expect
              </h2>
              <div className="mt-4 space-y-2.5">
                {outcomes.map((point) => (
                  <p key={point} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="flex items-center gap-2 text-base font-black text-[var(--text)]">
                <Target className="h-4 w-4 text-purple-400" />
                Transformation Path
              </h3>
              <div className="mt-3 space-y-2">
                {transformation.map((item) => (
                  <p key={item} className="text-sm text-[var(--text-muted)]">• {item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="flex items-center gap-2 text-base font-black text-[var(--text)]">
                <Briefcase className="h-4 w-4 text-mst-red" />
                Paid Internship Track
              </h3>
              <div className="mt-3 space-y-2">
                {internshipIncluded ? (
                  internshipTrack.map((item) => (
                    <p key={item} className="text-sm text-[var(--text-muted)]">• {item}</p>
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">
                    • This plan is focused on leadership, validation, and long-term reward participation, not internship execution.
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="flex items-center gap-2 text-base font-black text-[var(--text)]">
                <Zap className="h-4 w-4 text-amber-500" />
                Industry Mentor Support
              </h3>
              <div className="mt-3 space-y-2">
                {mentorSupport.map((item) => (
                  <p key={item} className="text-sm text-[var(--text-muted)]">• {item}</p>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-lg font-black text-[var(--text)]">Student success stories</h2>
            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-5">
              <p className="text-base leading-relaxed text-[var(--text)]">
                “{testimonials[activeTestimonial]?.text}”
              </p>
              <p className="mt-4 text-sm font-bold text-mst-red">{testimonials[activeTestimonial]?.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{testimonials[activeTestimonial]?.role}</p>
              <div className="mt-4 flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition ${idx === activeTestimonial ? "bg-mst-red" : "bg-[var(--border)]"}`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-lg font-black text-[var(--text)]">Frequently asked questions</h2>
            <div className="mt-4 space-y-2">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q} className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="text-sm font-bold text-[var(--text)]">{item.q}</span>
                      <ChevronDown className={`h-4 w-4 text-[var(--text-muted)] transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && <p className="px-4 pb-4 text-sm text-[var(--text-muted)]">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="mt-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Start now and unlock guided learning, practical execution, and mentorship-driven outcomes.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/register?plan=${planId}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mst-red via-red-600 to-mst-red px-7 py-3 text-sm font-bold text-white shadow-lg shadow-mst-red/25 transition hover:shadow-xl"
              >
                Buy Course Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </RevealSection>
      </div>

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-[130] border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{name}</p>
              <p className="text-sm text-[var(--text)]">
                <span className="line-through text-[var(--text-muted)]">Rs {originalPrice.toLocaleString("en-IN")}</span>{" "}
                <span className="ml-2 font-black text-mst-red">Rs {offerPrice.toLocaleString("en-IN")}</span>
              </p>
            </div>
            <Link
              href={`/register?plan=${planId}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mst-red to-red-600 px-5 py-2.5 text-xs font-bold text-white"
            >
              Buy Course Now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
