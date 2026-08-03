// src/app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, FileText, Share2, Check, Copy, Flame } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms-api.masterstroke.academy/";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

const TOPICS = ["Web3", "Blockchain", "Validators", "DeFi", "Smart Contracts", "Tutorials"];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    const srcUrl = CMS_URL.endsWith("/") ? `${CMS_URL}widget.js` : `${CMS_URL}/widget.js`;
    script.src = srcUrl;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Framer motion scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent("Check out this article on Masterstroke Academy!");
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans relative pb-16">

      {/* Reading Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-mst-red origin-left z-50"
        style={{ scaleX }}
      />

      {/* ── Page Hero/Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-grid py-8">
        <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-mst-red/10 blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-subtle pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-mst-red hover:underline text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Blog
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-mst-red/30 bg-mst-red/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-mst-red">
            <FileText size={12} />
            Article
          </div>
        </div>
      </div>

      {/* ── Main Layout Grid ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Main article content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-4 sm:p-10 shadow-sm"
            >
              <div data-widget="post" data-token={SITE_TOKEN} data-slug={slug} />
            </motion.article>

            {/* Bottom Call to Action banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 bg-gradient-to-br from-[var(--surface-2)] to-[var(--bg-muted)] border border-[var(--border)] rounded-3xl p-8 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-mst-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mst-red/10 text-mst-red mb-4">
                  <Flame size={24} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-[var(--text)]">Accelerate Your Web3 Developer Journey</h3>
                <p className="text-[var(--text-muted)] text-sm max-w-xl mx-auto mt-3 leading-relaxed">
                  Master blockchain engineering with 21 comprehensive modules. Build smart contracts, launch dApps, and get certified on-chain.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link href="/academy-overview" className="w-full sm:w-auto">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="block w-full sm:inline-block bg-mst-red hover:bg-mst-red-dark text-white text-sm font-bold px-6 py-3 rounded-xl shadow-sm transition-colors duration-200 cursor-pointer text-center"
                    >
                      Explore Program
                    </motion.span>
                  </Link>
                  <Link href="/register" className="w-full sm:w-auto">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="block w-full sm:inline-block border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg-muted)] text-[var(--text)] text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer text-center"
                    >
                      Join Academy
                    </motion.span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sticky interaction sidebar */}
          <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:sticky lg:top-24">

            {/* Sharing shortcuts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-1.5 justify-center">
                <Share2 size={13} /> Share Article
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShareTwitter}
                  className="bg-[var(--bg)] hover:bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text)] text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-colors duration-200"
                >
                  Share to X
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className="bg-[var(--bg)] hover:bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text)] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors duration-200"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-green-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy Link
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Topic categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Explore Topics</h4>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <motion.span
                    key={topic}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg)] hover:border-mst-red/40 hover:bg-mst-red/5 px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] hover:text-mst-red transition-all duration-200 cursor-pointer"
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Quick Academy Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Academy Resources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Developer Program Overview", href: "/academy-overview" },
                  { label: "Ecosystem Learning Roadmap", href: "/learn" },
                  { label: "Interactive Leaderboard", href: "/leaderboard" },
                  { label: "Contact Developer Support", href: "/contact-us" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-xs text-[var(--text-muted)] hover:text-mst-red flex items-center gap-1.5 transition-colors duration-200"
                    >
                      <span className="text-mst-red font-bold text-sm leading-none">•</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Nav shortcut card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Navigation</h4>
              <Link href="/blog" className="flex items-center gap-2 text-xs font-bold text-mst-red hover:underline">
                <ChevronLeft size={14} /> Back to article feed
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
