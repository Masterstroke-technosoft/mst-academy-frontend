"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  publishedAt?: string;
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    fetch(`${baseUrl}/api/blog-posts`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
        setPosts(Array.isArray(data) ? data : data.data || []);
      })
      .catch(() => setError("Failed to load blog posts"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-black text-[var(--text)]">Blog</h1>
        <p className="mt-3 text-[var(--text-muted)]">
          Insights, tutorials, and updates from Masterstroke Academy.
        </p>

        {loading && (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mst-red border-t-transparent" />
          </div>
        )}

        {error && (
          <p className="mt-12 text-center text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="mt-12 text-center text-[var(--text-muted)]">
            No blog posts yet. Check back soon!
          </p>
        )}

        <div className="mt-10 grid gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {post.coverImage && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-[var(--text)] group-hover:text-mst-red transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  {post.author && <span>{post.author}</span>}
                  {post.publishedAt && (
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-mst-red/10 px-2 py-0.5 text-[10px] font-semibold text-mst-red"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
