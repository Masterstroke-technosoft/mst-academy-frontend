"use client";

import { useEffect, useState } from "react";
import { LessonViewer } from "./LessonViewer";

interface DynamicLessonLoaderProps {
  id: string;
  slug: string;
}

function cleanLessonHtml(htmlStr: string): string {
  if (!htmlStr) return "";
  // Strip style tags and their contents
  let clean = htmlStr.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  // Strip link tags
  clean = clean.replace(/<link[^>]*>/gi, "");
  return clean;
}

function extractContent(htmlStr: string): string {
  // Try to find the inner lesson-content block first
  const contentMatch = htmlStr.match(/<div[^>]*class="[^"]*lesson-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (contentMatch) {
    // Return the inner contents of lesson-content div
    return contentMatch[1];
  }

  // Fallback to article tag content
  const articleMatch = htmlStr.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    return articleMatch[1];
  }

  return htmlStr;
}

export function DynamicLessonLoader({ id, slug }: DynamicLessonLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    async function loadHtml() {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const contentFile = "uploads/learning-content-files/1780482835900-671635248.html";
        const fileUrl = `${baseURL}/${contentFile}`;
        const fileRes = await fetch(fileUrl);
        if (!fileRes.ok) throw new Error("Failed to load HTML content file");
        const htmlText = await fileRes.text();

        // Extract only the core lesson content
        const extractedHtml = extractContent(htmlText);
        setHtml(cleanLessonHtml(extractedHtml));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadHtml();
  }, []);

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

  if (error || !html) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--bg)] p-6">
        <div className="text-center">
          <p className="text-lg font-bold text-red-500">Error loading lesson</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{error || "Lesson not found."}</p>
        </div>
      </div>
    );
  }

  const mockMod = {
    id: 1,
    title: "Introduction to Blockchain",
    phaseId: "phase-1",
    submodules: [
      {
        id: "1.1",
        slug: "1.1",
        title: "The Birth of the Internet",
      }
    ]
  };

  const mockSubmodule = {
    id: "1.1",
    slug: "1.1",
    title: "The Birth of the Internet",
    subtitle: "From a Cold War military experiment to a global network that changed everything — and why its original design still matters for blockchain.",
    toc: [
      { id: "section-1", title: "Learning Objectives" },
      { id: "section-2", title: "1.1: The Birth of the Internet" },
      { id: "section-3", title: "1.2: A Decentralized Network" },
      { id: "section-4", title: "1.3: How TCP/IP Works" },
      { id: "section-5", title: "1.4: Glossary & Key Terms" }
    ]
  };

  return (
    <LessonViewer
      moduleId={1}
      mod={mockMod}
      submodule={mockSubmodule}
      html={html}
      prevSlug={undefined}
      nextSlug={undefined}
      phaseId="phase-1"
      allModuleIds={[1]}
      moduleSlugMap={{ 1: ["1.1"] }}
      contentFile="dummy"
    />
  );
}
