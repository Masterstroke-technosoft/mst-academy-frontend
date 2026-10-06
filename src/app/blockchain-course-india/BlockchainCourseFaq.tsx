"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function BlockchainCourseFaq({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-mst-red/40 bg-[var(--surface)] shadow-lg"
                : "border-[var(--border)] bg-[var(--surface)]/70 hover:border-mst-red/30"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition sm:p-6"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3 text-base font-bold text-[var(--text)] sm:text-lg">
                <HelpCircle className="h-5 w-5 shrink-0 text-mst-red" />
                {faq.q}
              </span>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-muted)] transition-transform duration-300 ${
                  isOpen
                    ? "rotate-180 bg-mst-red/10 text-mst-red"
                    : "text-[var(--text-muted)]"
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
        );
      })}
    </div>
  );
}
