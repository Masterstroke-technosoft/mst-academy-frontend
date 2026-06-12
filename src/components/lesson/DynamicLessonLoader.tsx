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
  // Strip table of contents sections
  clean = clean.replace(/<(?:div|section)[^>]*(?:class="[^"]*toc|id="[^"]*table-of-contents")[^>]*>[\s\S]*?<\/(?:div|section)>/gi, "");
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

function extractTableOfContents(htmlStr: string): Array<{ id: string; title: string }> {
  const toc: Array<{ id: string; title: string }> = [];
  
  // Look for table of contents section
  const tocMatch = htmlStr.match(/<(?:div|section)[^>]*(?:class="[^"]*toc|id="[^"]*toc)[^>]*>([\s\S]*?)<\/(?:div|section)>/i);
  const tocContent = tocMatch ? tocMatch[1] : htmlStr;
  
  // Extract all anchor tags from TOC section
  const anchorRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = anchorRegex.exec(tocContent)) !== null) {
    const href = match[1];
    const title = match[2].trim();
    
    // Use the href as id if it's a hash link, otherwise create one from title
    const id = href.startsWith('#') ? href.substring(1) : title.toLowerCase().replace(/\s+/g, '-');
    
    if (title && id) {
      toc.push({ id, title });
    }
  }
  
  // If we didn't find TOC items via links, try to find headings
  if (toc.length === 0) {
    const headingRegex = /<h[1-6][^>]*id="([^"]*)"[^>]*>([^<]+)<\/h[1-6]>/gi;
    while ((match = headingRegex.exec(htmlStr)) !== null) {
      const id = match[1];
      const title = match[2].trim();
      if (title && id) {
        toc.push({ id, title });
      }
    }
  }
  
  return toc;
}

export function DynamicLessonLoader({ id, slug }: DynamicLessonLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string>("");
  const [mockMod, setMockMod] = useState<any>(null);
  const [mockSubmodule, setMockSubmodule] = useState<any>(null);

  useEffect(() => {
    async function loadHtml() {
      try {
        console.log("Loading lesson content for module ID:", id, "and slug:", slug);
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const fileUrl = `${baseURL}/api/submodules/${slug}`;
        const fileResponse = await fetch(fileUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        })
        const fileRes1 = await fileResponse.json()
        const fileRes = fileRes1.data.contentFile
        console.log("Anuja2 ", fileRes);
        
        // Set the submodule data from the API response
        setMockSubmodule(fileRes1.data);

        const textFile = await fetch(`${baseURL}/${fileRes}`)

        const htmlText = await textFile.text();
        // Extract only the core lesson content
        const extractedHtml = extractContent(htmlText);
        const cleanedHtml = cleanLessonHtml(extractedHtml);
        setHtml(cleanedHtml);
        
        // Extract table of contents from the HTML
        const extractedToc = extractTableOfContents(htmlText);
        
        // Set the submodule data with the extracted TOC
        setMockSubmodule({
          ...fileRes1.data,
          toc: extractedToc.length > 0 ? extractedToc : fileRes1.data.toc
        });

        const moduleData = await fetch(`${baseURL}/api/modules/full/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        })
        const moduleDataResult = await moduleData.json()
        setMockMod(moduleDataResult.module)
        console.log(moduleDataResult.module, "sdsdsdeeeeeeeeee");
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

  // Default fallback submodule structure in case API data is missing
  const defaultSubmodule = mockSubmodule || {
    id: slug,
    slug: slug,
    title: "Lesson",
    subtitle: "",
    toc: []
  };

  return (
    <LessonViewer
      moduleId={1}
      mod={mockMod}
      submodule={defaultSubmodule}
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
