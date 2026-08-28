"use client";

import { useEffect } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

export default function BlogIndexPage() {
  useEffect(() => {
    // The CMS widget uses a Shadow DOM, so global CSS won't affect it.
    // We must poll until the shadowRoot is available and inject our custom CSS.
    const interval = setInterval(() => {
      const widget = document.querySelector('[data-widget="latest-posts"]');
      if (widget && widget.shadowRoot) {
        if (!widget.shadowRoot.querySelector('#custom-widget-style')) {
          const style = document.createElement('style');
          style.id = 'custom-widget-style';
          style.textContent = `
            .mst-card-image {
              object-fit: contain !important;
              background-color: #f9fafb !important;
              aspect-ratio: 16/9 !important;
              width: 100% !important;
              height: auto !important;
            }
            .mst-card {
              border: 1px solid black !important;
              transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
            }
            .mst-card:hover {
              transform: translateY(-4px) !important;
              box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1) !important;
              border-color: #e31e24 !important;
            }
          `;
          widget.shadowRoot.appendChild(style);
        }
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] selection:bg-[var(--mst-red)] selection:text-white">
      <Script src={`${CMS_URL}/widget.js`} strategy="afterInteractive" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[var(--bg-muted)] to-[var(--bg)] pt-24 pb-16 border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.05]"></div>
        
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--mst-red)]/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-purple)]/10 rounded-full blur-3xl translate-y-1/2"></div>

        <div className="mx-auto max-w-4xl px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(227,30,36,0.1)] text-[var(--mst-red)] text-sm font-bold mb-8 border border-[rgba(227,30,36,0.2)] backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Masterstroke Updates</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-[var(--text)] mb-6 tracking-tight leading-tight">
              Our Latest <span className="text-gradient-red">Blogs</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Explore in-depth tutorials, industry trends, and the latest updates from Masterstroke Academy to elevate your skills to the next level.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Posts Widget */}
      <div className="mx-auto max-w-6xl px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div
            data-widget="latest-posts"
            data-token={SITE_TOKEN}
            data-link-base="/blogs"
            className="w-full min-h-[400px]"
          />
        </motion.div>
      </div>
    </div>
  );
}
