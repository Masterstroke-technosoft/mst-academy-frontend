"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  status: string;
  publishedAt?: string;
}

export default function BlogPreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const token = searchParams.get("token") || "";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug || !token) {
      setError("Preview token is required");
      setLoading(false);
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    fetch(`${baseUrl}/api/blog-posts/preview/${slug}?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Preview not found");
        return res.json();
      })
      .then(setPost)
      .catch(() => setError("Preview not found or invalid token"))
      .finally(() => setLoading(false));
  }, [slug, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mst-red border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--text-muted)]">{error || "Preview not found"}</p>
        <Link href="/blog" className="text-sm font-semibold text-mst-red hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  const sanitizedBody = DOMPurify.sanitize(post.body);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-bold text-amber-600 dark:text-amber-400">
        PREVIEW MODE — This is a draft post and is not publicly visible.
      </div>

      <article className="mx-auto max-w-3xl px-4 py-16">
        <Link href="/blog" className="text-sm font-semibold text-mst-red hover:underline">
          &larr; Back to Blog
        </Link>

        {post.coverImage && (
          <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-8 text-4xl font-black text-[var(--text)]">{post.title}</h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-[var(--text-muted)]">
          {post.author && <span>{post.author}</span>}
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            {post.status?.toUpperCase()}
          </span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-mst-red/10 px-3 py-1 text-xs font-semibold text-mst-red"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="prose prose-lg mt-8 max-w-none text-[var(--text)] prose-headings:text-[var(--text)] prose-a:text-mst-red prose-strong:text-[var(--text)]"
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />
      </article>
    </div>
  );
}
