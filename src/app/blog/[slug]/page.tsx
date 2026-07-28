"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";

interface BlogPost {
  _id: string;
  slug: string;
  heading: string;
  subHeading?: string;
  body: string;
  cardImage?: string;
  category?: string;
  author?: { name: string; bio?: string };
  publishedAt?: string;
  updatedAt?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    fetch(`${baseUrl}/api/blog-posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then(setPost)
      .catch(() => setError("Blog post not found"))
      .finally(() => setLoading(false));
  }, [slug]);

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
        <p className="text-[var(--text-muted)]">{error || "Post not found"}</p>
        <Link href="/blog" className="text-sm font-semibold text-mst-red hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  const sanitizedBody = DOMPurify.sanitize(post.body);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <article className="mx-auto max-w-3xl px-4 py-16">
        <Link href="/blog" className="text-sm font-semibold text-mst-red hover:underline">
          &larr; Back to Blog
        </Link>

        {post.cardImage && (
          <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl">
            <img
              src={post.cardImage}
              alt={post.heading}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-8 text-4xl font-black text-[var(--text)]">{post.heading}</h1>

        {post.subHeading && (
          <p className="mt-3 text-lg text-[var(--text-muted)]">{post.subHeading}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-sm text-[var(--text-muted)]">
          {post.author?.name && <span>{post.author.name}</span>}
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {post.category && (
            <span className="rounded-full bg-mst-red/10 px-3 py-1 text-xs font-semibold text-mst-red">
              {post.category}
            </span>
          )}
        </div>

        <div
          className="prose prose-lg mt-8 max-w-none text-[var(--text)] prose-headings:text-[var(--text)] prose-a:text-mst-red prose-strong:text-[var(--text)]"
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />
      </article>
    </div>
  );
}