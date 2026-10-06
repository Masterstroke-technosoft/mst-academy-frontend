"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  tag: string;
}

export function GlossaryClientHub({ terms }: { terms: GlossaryTerm[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");

  // Available first letters
  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    terms.forEach((t) => {
      const firstChar = t.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      }
    });
    return ["ALL", ...Array.from(letters).sort()];
  }, [terms]);

  // Filter terms by search & selected letter
  const filteredTerms = useMemo(() => {
    return terms.filter((item) => {
      const matchesLetter =
        selectedLetter === "ALL" ||
        item.term.toUpperCase().startsWith(selectedLetter);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesLetter && matchesSearch;
    });
  }, [terms, searchQuery, selectedLetter]);

  return (
    <div className="space-y-10">
      {/* Search Bar & Quick Alphabet Bar */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative mx-auto max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setSelectedLetter("ALL");
            }}
            placeholder="Search Web3 terms (e.g. Solidity, EVM, Gas, DeFi, ZK Proof)..."
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

        {/* Alphabet Quick Filter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
          {alphabet.map((letter) => {
            const isActive = selectedLetter === letter && !searchQuery;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => {
                  setSelectedLetter(letter);
                  setSearchQuery("");
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-mst-red text-white shadow-md shadow-mst-red/25 scale-105"
                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-mst-red/40 hover:text-[var(--text)]"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-2">
        <p>
          Showing <span className="font-bold text-[var(--text)]">{filteredTerms.length}</span> of{" "}
          <span className="font-bold text-[var(--text)]">{terms.length}</span> terms
        </p>
        {(searchQuery || selectedLetter !== "ALL") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedLetter("ALL");
            }}
            className="font-bold text-mst-red hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <BookOpen size={36} className="mx-auto text-[var(--text-muted)] opacity-50 mb-3" />
          <p className="text-base font-bold text-[var(--text)]">No terms found</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Try searching for another term or clear your search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedLetter("ALL");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-mst-red px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
          >
            Show All Terms
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTerms.map((item, idx) => {
            return (
              <article
                key={idx}
                id={item.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm hover:border-mst-red/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Category Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-muted)]">
                      {item.category}
                    </span>
                  </div>

                  {/* Term Heading (H2/H3) */}
                  <h2 className="text-lg sm:text-xl font-black text-[var(--text)] group-hover:text-mst-red transition-colors">
                    {item.term}
                  </h2>

                  {/* Definition Body */}
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text)]/85">
                    {item.definition}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="font-mono text-[11px] opacity-75">#{item.tag}</span>
                  <Link
                    href="/academy-overview"
                    className="inline-flex items-center gap-1 font-semibold text-mst-red hover:underline text-[11px]"
                  >
                    Learn in Curriculum
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
