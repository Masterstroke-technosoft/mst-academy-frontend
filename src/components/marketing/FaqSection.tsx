"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { RevealSection } from "@/components/marketing/RevealSection";
import type { FaqItem } from "@/lib/faqs";

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  faqs: FaqItem[];
  id?: string;
  className?: string;
}

function renderTitleWithGradient(title?: React.ReactNode) {
  if (!title) return null;
  if (typeof title !== "string") return title;
  const words = title.trim().split(" ");
  if (words.length <= 1) {
    return <span className="text-gradient-red">{title}</span>;
  }
  const lastWord = words.pop();
  return (
    <>
      {words.join(" ")}{" "}
      <span className="text-gradient-red">{lastWord}</span>
    </>
  );
}

export function FaqSection({
  title = "Frequently Asked Questions",
  subtitle = "Have questions about Masterstroke Academy? Find clear answers below.",
  tag = "Got Questions?",
  faqs,
  id = "faqs",
  className = "",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={id} className={`relative border-b border-[var(--border)] pt-8 pb-16 sm:pt-10 sm:pb-24 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <RevealSection className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(227,30,36,0.2)] bg-[rgba(227,30,36,0.1)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--mst-red)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{tag}</span>
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
            {renderTitleWithGradient(title)}
          </h2>
          <p className="mt-4 text-base text-[var(--text-muted)] sm:text-lg">
            {subtitle}
          </p>
        </RevealSection>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <RevealSection key={faq.q} delay={i * 50}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-mst-red/40 bg-[var(--surface)] shadow-lg"
                      : "border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--border-strong)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition sm:p-6"
                  >
                    <span className="flex items-center gap-3 text-base font-bold text-[var(--text)] sm:text-lg">
                      <HelpCircle className="h-5 w-5 shrink-0 text-mst-red" />
                      {faq.q}
                    </span>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-muted)] transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-mst-red/10 text-mst-red" : "text-[var(--text-muted)]"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[var(--border)] px-5 pb-6 pt-4 text-sm leading-relaxed text-[var(--text-muted)] sm:px-6 sm:text-base">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
