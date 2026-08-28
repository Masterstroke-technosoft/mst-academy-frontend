"use client";

import { useParams, useSearchParams } from "next/navigation";
import Script from "next/script";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "";

export default function BlogPreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const previewToken = searchParams.get("token") || "";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Script src={`${CMS_URL}/widget.js`} strategy="afterInteractive" />
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-bold text-amber-600 dark:text-amber-400">
        PREVIEW MODE — This is a draft post and is not publicly visible.
      </div>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div
          data-widget="post"
          data-token={SITE_TOKEN}
          data-slug={slug}
          data-preview="true"
          data-preview-token={previewToken}
        />
      </div>
    </div>
  );
}
