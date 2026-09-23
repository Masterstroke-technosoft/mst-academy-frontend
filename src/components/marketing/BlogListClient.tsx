"use client";

import { useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Clock, ArrowRight, User } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "https://cms-api.masterstroke.academy";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "site_token_demo_mst_academy_1785489667016";

interface BlogListClientProps {
  initialPosts?: BlogPost[];
}

export function BlogListClient({ initialPosts = [] }: BlogListClientProps) {
  useEffect(() => {
    // The CMS widget uses a Shadow DOM, so global CSS won't affect it.
    const interval = setInterval(() => {
      const widget = document.querySelector('[data-widget="latest-posts"]');
      if (widget && widget.shadowRoot) {
        if (!widget.shadowRoot.querySelector("#custom-widget-style")) {
          const style = document.createElement("style");
          style.id = "custom-widget-style";
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
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--mst-red)]/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-purple)]/10 rounded-full blur-3xl translate-y-1/2" />

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

      {/* Server-Rendered Post Cards Grid for 100% Crawlability & Immediate Display */}
      <div className="mx-auto max-w-6xl px-4 py-16 relative">
        {initialPosts && initialPosts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {initialPosts.map((post) => {
              const title = post.title || post.heading || "Blog Post";
              const excerpt =
                post.excerpt || post.metaDescription || post.subHeading || post.description || "";
              const authorName =
                typeof post.author === "string"
                  ? post.author
                  : post.author?.name || "Masterstroke Academy";
              const coverImg = post.coverImage || post.image || post.featuredImage;
              const dateStr = post.publishedAt || post.createdAt;
              const formattedDate = dateStr
                ? new Date(dateStr).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null;

              return (
                <article
                  key={post.slug}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-mst-red/40 hover:shadow-xl"
                >
                  {coverImg && (
                    <div className="relative aspect-video w-full overflow-hidden bg-[var(--surface-2)]">
                      <img
                        src={coverImg}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {post.category && (
                        <span className="absolute left-3 top-3 rounded-full border border-[rgba(227,30,36,0.3)] bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                          {post.category}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      {formattedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formattedDate}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {typeof post.readTime === "number" ? `${post.readTime} min` : post.readTime}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-[var(--text)] transition group-hover:text-mst-red line-clamp-2">
                      <Link href={`/blogs/${post.slug}`}>{title}</Link>
                    </h2>

                    {excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3 flex-1">
                        {excerpt}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                        <User className="h-3.5 w-3.5 text-mst-red" />
                        {authorName}
                      </span>
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-mst-red transition hover:gap-1.5"
                      >
                        Read Article
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            data-widget="latest-posts"
            data-token={SITE_TOKEN}
            data-link-base="/blogs"
            className="w-full min-h-[400px]"
          />
        )}
      </div>
    </div>
  );
}
