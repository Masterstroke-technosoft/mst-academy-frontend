
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, FileText, Eye } from "lucide-react";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import FadeIn from "@/components/blog/FadeIn";
import ShareButtons from "@/components/blog/ShareButtons";
import CtaBanner from "@/components/blog/CtaBanner";
import TopicsCard from "@/components/blog/TopicsCard";
import AcademyLinksCard from "@/components/blog/AcademyLinksCard";
import WidgetStyleInjector from "@/components/blog/WidgetStyleInjector";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms-api.masterstroke.academy/";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

// Drafts must never be indexed or unfurled as if they were public content.
export const metadata: Metadata = {
  title: "Draft Preview — Masterstroke Academy",
  robots: { index: false, follow: false },
};

export default async function BlogPreviewPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { token: previewToken = "" } = await searchParams;

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans relative pb-16">
      <WidgetStyleInjector />
      <ReadingProgressBar />

      {/* Preview mode banner */}
      <div className="sticky top-0 z-20 flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm font-semibold text-amber-600 backdrop-blur-sm dark:text-amber-400">
        <Eye size={15} className="animate-pulse" />
        PREVIEW MODE — This is a draft post and is not publicly visible.
      </div>

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-grid py-8">
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
            <article className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-4 sm:p-10 shadow-sm">
              <FadeIn>
                <div
                  data-widget="post"
                  data-token={SITE_TOKEN}
                  data-slug={slug}
                  data-preview="true"
                  data-preview-token={previewToken}
                />
              </FadeIn>
            </article>

            <CtaBanner />
          </div>

          {/* Sticky interaction sidebar */}
          <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:sticky lg:top-24">
            <FadeIn direction="right" delay={0.3}>
              <ShareButtons label="Share Preview" tweetText="Previewing draft post on Masterstroke Academy!" />
            </FadeIn>

            <FadeIn direction="right" delay={0.35}>
              <TopicsCard />
            </FadeIn>

            <FadeIn direction="right" delay={0.4}>
              <AcademyLinksCard />
            </FadeIn>

            <FadeIn direction="right" delay={0.45}>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                  Navigation
                </h4>
                <Link href="/blog" className="flex items-center gap-2 text-xs font-bold text-mst-red hover:underline">
                  <ChevronLeft size={14} /> Back to article feed
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
