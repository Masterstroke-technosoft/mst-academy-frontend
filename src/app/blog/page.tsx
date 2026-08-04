"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms-api.masterstroke.academy/";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

export default function BlogPage() {
  useEffect(() => {
    const script = document.createElement("script");
    const srcUrl = CMS_URL.endsWith("/") ? `${CMS_URL}widget.js` : `${CMS_URL}/widget.js`;
    script.src = srcUrl;
    script.async = true;
    document.body.appendChild(script);

    // Inject custom styles into the widget's shadow DOM once rendered
    const injectStyles = () => {
      const widgets = document.querySelectorAll("[data-widget]");
      widgets.forEach((widget) => {
        if (widget.shadowRoot) {
          if (widget.shadowRoot.querySelector(".mst-override-style")) return;

          const style = document.createElement("style");
          style.className = "mst-override-style";
          style.textContent = `
            .mst-list {
              grid-template-columns: repeat(auto-fill, minmax(min(215px, 100%), 1fr)) !important;
              gap: 16px !important;
            }
            .mst-card {
              position: relative !important;
              width: 100% !important;
              max-width: 100% !important;
              overflow: hidden !important;
              border: 1px solid var(--border, #e5e7eb) !important;
              background: var(--surface, #fff) !important;
              border-radius: 16px !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
              isolation: isolate !important;
              -webkit-backface-visibility: hidden !important;
              backface-visibility: hidden !important;
              -webkit-transform: translate3d(0, 0, 0) !important;
              transform: translate3d(0, 0, 0) !important;
            }
            .mst-card:hover {
              transform: translate3d(0, -4px, 0) !important;
              box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15) !important;
              border-color: rgba(239, 68, 68, 0.3) !important;
            }
            .mst-card-image {
              width: 100% !important;
              max-width: 100% !important;
              aspect-ratio: 16 / 9 !important;
              height: auto !important;
              object-fit: contain !important;
              background: var(--bg-muted, #f3f4f6) !important;
              display: block !important;
              border-top-left-radius: 15px !important;
              border-top-right-radius: 15px !important;
            }
            .mst-card-body {
              padding: 12px !important;
              gap: 6px !important;
            }
            .mst-card-category {
              color: #ef4444 !important; /* mst-red */
              font-size: 9px !important;
              font-weight: 700 !important;
              letter-spacing: 0.05em !important;
            }
            .mst-card-heading {
              color: var(--text, #111827) !important;
              font-size: 14px !important;
              font-weight: 700 !important;
              line-height: 1.4 !important;
              margin: 0 !important;
            }
            .mst-card-subheading {
              color: var(--text-muted, #4b5563) !important;
              font-size: 12px !important;
              line-height: 1.45 !important;
              margin: 0 !important;
            }
            .mst-card-meta {
              color: var(--text-muted, #9ca3af) !important;
              font-size: 10px !important;
            }
          `;
          widget.shadowRoot.appendChild(style);
        }
      });
    };

    const interval = setInterval(injectStyles, 300);

    const observer = new MutationObserver(() => {
      injectStyles();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.body.removeChild(script);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-grid pb-12">
        {/* drifting ambient glow blobs (GPU-accelerated transform animations) */}
        <motion.div
          className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-mst-red/20 blur-[100px]"
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-mst-red-light/20 blur-[90px]"
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-gradient-subtle pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12 sm:px-6 lg:px-8">
          <div className="flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-mst-red hover:underline text-sm font-medium transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Home
            </Link>
          </div>

          <div className="text-center mt-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1] sm:leading-[1.05] text-[var(--text)] tracking-tight"
            >
              Insights on Web3 &<br className="hidden sm:block" />
              <span className="text-gradient-red">decentralized learning</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-5 max-w-2xl mx-auto text-[var(--text-muted)] text-base sm:text-lg"
            >
              Tutorials, product updates, and perspectives from the Masterstroke
              Academy team — for validators, builders, and everyone learning
              Web3 from scratch.
            </motion.p>
          </div>
        </div>

        {/* bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[var(--bg)] pointer-events-none" />
      </div>

      {/* ── Content Dashboard Grid ─────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Recent Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mst-red/10 text-mst-red">
              <Newspaper size={16} />
            </div>
            <h2 className="text-lg font-black text-[var(--text)]">All posts</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
          </div>

          <div
            data-widget="latest-posts"
            data-token={SITE_TOKEN}
            data-link-base="/blog"
            className="w-full overflow-hidden block"
          />
        </motion.div>
      </div>
    </div>
  );
}
