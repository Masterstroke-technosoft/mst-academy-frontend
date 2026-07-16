"use client";

import { useEffect, useState } from "react";
import { LessonViewer } from "./LessonViewer";
import { normalizeContentFilePath } from "@/lib/content-file";
import { Lock } from "lucide-react";

interface DynamicLessonLoaderProps {
  id: string;
  slug: string;
}

function cleanLessonHtml(htmlStr: string): string {
  if (!htmlStr) return "";
  let clean = htmlStr.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  clean = clean.replace(/<link[^>]*>/gi, "");
  clean = clean.replace(
    /<(?:div|section)[^>]*(?:class="[^"]*toc|id="[^"]*table-of-contents")[^>]*>[\s\S]*?<\/(?:div|section)>/gi,
    ""
  );
  return clean;
}

function extractContent(htmlStr: string): string {
  const contentMatch = htmlStr.match(
    /<div[^>]*class="[^"]*lesson-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  if (contentMatch) return contentMatch[1];

  const mainMatch = htmlStr.match(/<main[^>]*class="[^"]*main-content[^"]*"[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  const articleMatch = htmlStr.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return articleMatch[1];

  const bodyMatch = htmlStr.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];

  return htmlStr;
}

function extractTableOfContents(htmlStr: string): Array<{ id: string; title: string }> {
  const toc: Array<{ id: string; title: string }> = [];

  const tocMatch = htmlStr.match(
    /<(?:div|section|aside|nav)[^>]*(?:class="[^"]*toc|class="[^"]*sidebar[^"]*")[^>]*>([\s\S]*?)<\/(?:div|section|aside|nav)>/i
  );
  const tocContent = tocMatch ? tocMatch[1] : htmlStr;

  const anchorRegex = /<a[^>]*href="#([^"]*)"[^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = anchorRegex.exec(tocContent)) !== null) {
    const id = match[1].trim();
    const title = match[2].trim();
    if (title && id) toc.push({ id, title });
  }

  if (toc.length === 0) {
    const headingRegex = /<h[1-6][^>]*id="([^"]*)"[^>]*>([^<]+)<\/h[1-6]>/gi;
    while ((match = headingRegex.exec(htmlStr)) !== null) {
      const id = match[1];
      const title = match[2].trim();
      if (title && id) toc.push({ id, title });
    }
  }

  return toc;
}

export function DynamicLessonLoader({ id, slug }: DynamicLessonLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string>("");
  const [contentFile, setContentFile] = useState<string | undefined>();
  const [mockMod, setMockMod] = useState<any>(null);
  const [mockSubmodule, setMockSubmodule] = useState<any>(null);
  const [prevSlug, setPrevSlug] = useState<string | undefined>();
  const [nextSlug, setNextSlug] = useState<string | undefined>();
  const [showLockModal, setShowLockModal] = useState(false);

  useEffect(() => {
    async function loadHtml() {
      try {
        setLoading(true);
        setError(null);

        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const subRes = await fetch(`${baseURL}/api/submodules/${slug}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!subRes.ok) {
          setShowLockModal(true);
          throw new Error("Unable to load lesson details.");
        }

        const subJson = await subRes.json();
        const subData = subJson.data;
        if (!subData) {
          throw new Error("Lesson not found.");
        }

        const modRes = await fetch(`${baseURL}/api/modules/full/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!modRes.ok) {
          throw new Error("Unable to load module details.");
        }

        const modJson = await modRes.json();
        const moduleData = modJson.module;
        setMockMod(moduleData);

        const submodules = moduleData?.submodules?.data || [];
        const currentIndex = submodules.findIndex(
          (sub: any) => String(sub._id || sub.id) === String(slug) || String(sub._id) === String(subData._id)
        );

        if (currentIndex > 0) {
          setPrevSlug(String(submodules[currentIndex - 1]._id || submodules[currentIndex - 1].id));
        } else {
          setPrevSlug(undefined);
        }

        if (currentIndex >= 0 && currentIndex < submodules.length - 1) {
          setNextSlug(String(submodules[currentIndex + 1]._id || submodules[currentIndex + 1].id));
        } else {
          setNextSlug(undefined);
        }

        const submodulePayload = {
          ...subData,
          slug: String(subData._id || slug),
          index: subData.index ?? currentIndex + 1,
        };

        if (subData.contentFile) {
          const normalizedContentFile = normalizeContentFilePath(String(subData.contentFile));
          setContentFile(normalizedContentFile);
          setHtml("");

          const fileRes = await fetch(`${baseURL}/${normalizedContentFile}`, {
            credentials: "include",
          });

          if (fileRes.ok) {
            const htmlText = await fileRes.text();
            submodulePayload.toc = extractTableOfContents(htmlText);
          }

          setMockSubmodule(submodulePayload);
          return;
        }

        setContentFile(undefined);
        throw new Error("This lesson has no content yet.");
      } catch (err: any) {
        setError(err.message || "Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    }

    loadHtml();
  }, [id, slug]);

  if (showLockModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="w-full max-w-md transform overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--surface)] p-8 shadow-2xl transition-all">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-mst-red border border-mst-red/20 shadow-inner">
              <Lock size={32} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-[var(--text)]">Lesson Locked</h3>
            <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed font-medium">
              You cannot proceed to the next submodule or module until you have successfully completed and passed the assessment for the current lesson.
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/learn";
              }}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-mst-red to-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition-all hover:shadow-mst-red/40 hover:scale-[1.01]"
            >
              Go to Learning Tree
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-mst-red border-t-transparent" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (error || (!html && !contentFile)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--bg)] p-6">
        <div className="text-center">
          <p className="text-lg font-bold text-red-500">Error loading lesson</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{error || "Lesson not found."}</p>
        </div>
      </div>
    );
  }

  const defaultSubmodule = mockSubmodule || {
    id: slug,
    slug,
    title: "Lesson",
    subtitle: "",
    toc: [],
  };

  return (
    <LessonViewer
      moduleId={id}
      mod={mockMod}
      submodule={defaultSubmodule}
      html={html}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
      phaseId="phase-1"
      allModuleIds={[id]}
      moduleSlugMap={{ [id]: mockMod?.submodules?.data?.map((s: any) => String(s._id || s.id)) || [] }}
      contentFile={contentFile}
    />
  );
}
