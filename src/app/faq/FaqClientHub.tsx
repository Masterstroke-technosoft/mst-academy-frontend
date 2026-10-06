"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  HelpCircle,
  Search,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  Building,
  Sparkles,
  X,
} from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  titleHighlight: string;
  items: FaqItem[];
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  about: GraduationCap,
  curriculum: BookOpen,
  assessments: Award,
  enrollment: Layers,
  company: Building,
};

export function FaqClientHub({ categories }: { categories: FaqCategory[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({
    "about-0": true,
    "curriculum-0": false,
    "assessments-0": false,
    "enrollment-0": false,
    "company-0": false,
  });

  const toggleFaq = (key: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();

    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(query) ||
            item.a.toLowerCase().includes(query)
        );
        return {
          ...cat,
          items: filteredItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Search Input Bar */}
      <div className="relative mx-auto max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., certificate, Solidity, refund, grants)..."
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-4 pl-12 pr-12 text-sm text-[var(--text)] placeholder-[var(--text-muted)] shadow-sm outline-none transition-all duration-200 focus:border-mst-red focus:ring-2 focus:ring-mst-red/20"
          />
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-xs text-[var(--text-muted)] text-center">
            Found{" "}
            <span className="font-bold text-mst-red">
              {filteredCategories.reduce((acc, c) => acc + c.items.length, 0)}
            </span>{" "}
            questions matching &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* Categories & Accordion List */}
      <div className="space-y-16">
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <HelpCircle size={36} className="mx-auto text-[var(--text-muted)] opacity-50 mb-3" />
            <p className="text-base font-bold text-[var(--text)]">No questions found</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Try searching with different keywords or browse all categories below.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-mst-red px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id] || HelpCircle;
            return (
              <section key={category.id} id={category.id} className="scroll-mt-24">
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mst-red/10 text-mst-red">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text)]">
                      {category.title}{" "}
                      <span className="text-mst-red">{category.titleHighlight}</span>
                    </h2>
                  </div>
                </div>

                {/* Question Cards */}
                <div className="space-y-4">
                  {category.items.map((item, idx) => {
                    const key = `${category.id}-${idx}`;
                    const isOpen = searchQuery.trim() ? true : !!openMap[key];

                    return (
                      <div
                        key={idx}
                        className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                          isOpen
                            ? "border-mst-red/40 bg-[var(--surface)] shadow-md"
                            : "border-[var(--border)] bg-[var(--surface)]/70 hover:border-mst-red/30"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(key)}
                          className="flex w-full items-center justify-between gap-4 p-5 text-left transition sm:p-6 cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <span className="flex items-center gap-3 text-base font-bold text-[var(--text)] sm:text-lg">
                            <HelpCircle className="h-5 w-5 shrink-0 text-mst-red" />
                            {item.q}
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
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-[var(--border)] px-5 pb-6 pt-4 text-sm leading-relaxed text-[var(--text-muted)] sm:px-6 sm:text-base">
                              {item.a}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
