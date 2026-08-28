"use client";

import Script from "next/script";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Script src={`${CMS_URL}/widget.js`} strategy="afterInteractive" />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-black text-[var(--text)]">Blog</h1>
        <p className="mt-3 text-[var(--text-muted)]">
          Insights, tutorials, and updates from Masterstroke Academy.
        </p>
        <div
          data-widget="latest-posts"
          data-token={SITE_TOKEN}
          data-link-base="/blog"
          className="mt-10"
        />
      </div>
    </div>
  );
}
