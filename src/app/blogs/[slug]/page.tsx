"use client";

import { useParams } from "next/navigation";
import Script from "next/script";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Script src={`${CMS_URL}/widget.js`} strategy="afterInteractive" />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div data-widget="post" data-token={SITE_TOKEN} data-slug={slug} />
      </div>
    </div>
  );
}
