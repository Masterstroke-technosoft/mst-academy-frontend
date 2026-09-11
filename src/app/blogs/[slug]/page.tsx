import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Calendar, User, Clock, ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { getPostBySlug, generateArticleSchema } from "@/lib/blog";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "https://cms-api.masterstroke.academy";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "site_token_demo_mst_academy_1785489667016";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: { absolute: "Blog Post Not Found | Masterstroke Academy" },
      description: "The requested blog post could not be found.",
    };
  }

  const title = post.metaTitle || post.title || post.heading || "Blog Post";
  const description =
    post.metaDescription ||
    post.subHeading ||
    post.excerpt ||
    post.description ||
    "Read the latest Web3, Solidity, and Blockchain development insights from Masterstroke Academy.";

  const canonicalUrl = `https://masterstroke.academy/blogs/${slug}`;
  const ogImage = post.coverImage || post.image || post.featuredImage;

  return {
    title: { absolute: `${title} | Masterstroke Academy` },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: `${title} | Masterstroke Academy`,
      description,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : undefined,
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.modifiedAt,
      authors: typeof post.author === "string" ? [post.author] : [post.author?.name || "Masterstroke Academy"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Masterstroke Academy`,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = post.heading || post.title || post.metaTitle || "Blog Post";
  const subtitle = post.subHeading || post.metaDescription || post.excerpt || post.description || "";
  const content = post.content || post.body || post.html || "";
  const authorName =
    typeof post.author === "string"
      ? post.author
      : post.author?.name || "Masterstroke Academy";
  const authorAvatar =
    typeof post.author === "object" ? post.author?.avatar : null;
  const coverImage = post.coverImage || post.image || post.featuredImage;
  const dateStr = post.publishedAt || post.createdAt;
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const jsonLd = generateArticleSchema(post, slug);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--mst-red)] selection:text-white">
      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--bg-muted)] to-[var(--bg)] pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute top-0 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-[var(--mst-red)]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-[var(--accent-purple)]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          {/* Back to blogs link */}
          <Link
            href="/blogs"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--mst-red)]"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to All Blogs
          </Link>

          {/* Tag / Category Badge */}
          {(post.category || (post.tags && post.tags.length > 0)) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(227,30,36,0.2)] bg-[rgba(227,30,36,0.1)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--mst-red)]">
                  <Sparkles className="h-3 w-3" />
                  {post.category}
                </span>
              )}
              {post.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* H1 Heading */}
          <h1 className="text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
            {title}
          </h1>

          {/* Subheading / Excerpt */}
          {subtitle && (
            <p className="mt-4 text-base font-normal leading-relaxed text-[var(--text-muted)] sm:text-lg md:text-xl">
              {subtitle}
            </p>
          )}

          {/* Metadata Row */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-muted)] sm:gap-6">
            <div className="flex items-center gap-2">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--border)]"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] ring-1 ring-[var(--border)]">
                  <User className="h-4 w-4 text-[var(--mst-red)]" />
                </div>
              )}
              <span className="font-semibold text-[var(--text)]">{authorName}</span>
            </div>

            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                <time dateTime={dateStr}>{formattedDate}</time>
              </div>
            )}

            {post.readTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                <span>{typeof post.readTime === "number" ? `${post.readTime} min read` : post.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {coverImage && (
        <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] shadow-xl">
            <img
              src={coverImage}
              alt={title}
              className="h-auto max-h-[500px] w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Article Body (Server Rendered HTML for SEO & Instant Load) */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {content ? (
          <article
            className="prose prose-lg dark:prose-invert max-w-none text-[var(--text)] leading-relaxed
              [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:text-[var(--text)] [&>h2]:sm:text-3xl
              [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[var(--text)] [&>h3]:sm:text-2xl
              [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-[var(--text)]/90
              [&>ul]:my-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:text-[var(--text)]/90
              [&>ol]:my-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2 [&>ol>li]:text-[var(--text)]/90
              [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[var(--mst-red)] [&>blockquote]:bg-[var(--bg-muted)] [&>blockquote]:p-4 [&>blockquote]:italic [&>blockquote]:rounded-r-lg
              [&>pre]:my-6 [&>pre]:rounded-xl [&>pre]:bg-[var(--surface-2)] [&>pre]:p-4 [&>pre]:border [&>pre]:border-[var(--border)]
              [&>img]:my-8 [&>img]:rounded-xl [&>img]:border [&>img]:border-[var(--border)] [&>img]:w-full
              [&>a]:text-[var(--mst-red)] [&>a]:underline hover:[&>a]:text-[var(--mst-red-light)]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          /* Client widget fallback if content is served via widget */
          <div>
            <Script src={`${CMS_URL}/widget.js`} strategy="afterInteractive" />
            <div data-widget="post" data-token={SITE_TOKEN} data-slug={slug} />
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-lg sm:p-10">
          <BookOpen className="mx-auto h-10 w-10 text-[var(--mst-red)]" />
          <h3 className="mt-4 text-2xl font-bold text-[var(--text)]">
            Ready to Build on Blockchain?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-muted)] sm:text-base">
            Join Masterstroke Academy to master Solidity, smart contract security, DeFi protocols, and earn on-chain verifiable credentials.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/academy-overview"
              className="rounded-xl bg-[var(--mst-red)] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--mst-red-dark)] hover:shadow-lg"
            >
              Explore Curriculum
            </Link>
            <Link
              href="/blogs"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--bg-muted)]"
            >
              Read More Articles
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
