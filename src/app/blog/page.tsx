
import Link from "next/link";
import { ChevronLeft, Newspaper } from "lucide-react";
import AmbientBlobs from "@/components/blog/AmbientBlobs";
import FadeIn from "@/components/blog/FadeIn";
import WidgetStyleInjector from "@/components/blog/WidgetStyleInjector";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms-api.masterstroke.academy/";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";


export const metadata = {
  title: "Blog — Masterstroke Academy",
  description:
    "Tutorials, product updates, and perspectives from the Masterstroke Academy team — for validators, builders, and everyone learning Web3 from scratch.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans overflow-x-hidden">
      <WidgetStyleInjector />

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-grid pb-12">
        <AmbientBlobs />
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
            <FadeIn delay={0.1}>
              <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1] sm:leading-[1.05] text-[var(--text)] tracking-tight">
                Insights on Web3 &<br className="hidden sm:block" />
                <span className="text-gradient-red">decentralized learning</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-5 max-w-2xl mx-auto text-[var(--text-muted)] text-base sm:text-lg">
                Tutorials, product updates, and perspectives from the Masterstroke Academy team — for validators,
                builders, and everyone learning Web3 from scratch.
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[var(--bg)] pointer-events-none" />
      </div>

      {/* ── Content ─────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn delay={0.4} className="space-y-4">
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
        </FadeIn>
      </div>
    </div>
  );
}
