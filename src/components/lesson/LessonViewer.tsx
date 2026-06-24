"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  List,
  ArrowUp,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Volume2,
  VolumeOff,
  Lock,
} from "lucide-react";
import type { ModuleMeta, SubmoduleMeta } from "@/lib/types";
import {
  markLessonComplete,
  isSubmoduleLocked,
  getModuleStatus,
} from "@/lib/progress";
import { getLessonDisplayTitle, getCardSubmoduleTitle } from "@/lib/display-titles";
import { resolveContentFileUrl } from "@/lib/content-file";

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const lang = language.includes("sol") ? "solidity" : language || "javascript";

  return (
    <div className="group relative my-5 overflow-hidden rounded-2xl border border-[var(--border-strong)] shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between bg-[var(--bg-muted)] px-4 py-2.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/60" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/60" />
            <span className="h-3 w-3 rounded-full bg-green-400/60" />
          </div>
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{lang}</span>
        </div>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{ margin: 0, padding: "1.25rem", fontSize: "0.85rem", borderRadius: 0 }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

import { sanitizeHtml } from "@/lib/text";

function cleanHtml(html: string): string {
  const s = sanitizeHtml(html);
  return s
    .replace(/<p>\s*[-–—]\s+/g, "<p>• ")
    .replace(/<li>\s*[-–—]\s+/g, "<li>")
    .replace(/>\s*-\s{2,}/g, "> ")
    .replace(/<p>\s*[-–—]\s*/g, "<p>")
    .replace(/<br\s*\/?>\s*[-–—]\s+/g, "<br>• ");
}

function LessonContent({ html }: { html: string }) {
  const normalizedHtml = cleanHtml(html);
  const parts = normalizedHtml.split(/(<pre[\s\S]*?<\/pre>)/gi);

  return (
    <div className="lesson-content space-y-4" suppressHydrationWarning>
      {parts.map((part, i) => {
        const preMatch = part.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
        if (preMatch) {
          const inner = preMatch[1].replace(/<\/?code[^>]*>/gi, "").trim();
          const lang = inner.includes("pragma solidity")
            ? "solidity"
            : inner.includes("function") && inner.includes("{")
              ? "javascript"
              : "text";
          const shouldCollapse = inner.split("\n").length > 8;
          return (
            <details
              key={i}
              open={!shouldCollapse}
              className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-lg"
              suppressHydrationWarning
            >
              <summary className="cursor-pointer bg-[var(--bg-muted)] px-5 py-4 text-sm font-semibold text-[var(--text)] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen size={16} className="text-mst-red" />
                  {shouldCollapse ? "View code example" : "Code example"}
                  <span className="rounded-full bg-mst-red/10 px-2 py-0.5 text-[10px] font-bold text-mst-red uppercase">
                    {lang}
                  </span>
                </span>
                <ChevronDown size={16} className="text-[var(--text-muted)] transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-[var(--border)]">
                <CodeBlock code={inner} language={lang} />
              </div>
            </details>
          );
        }
        return (
          <div
            key={i}
            className="lesson-html-content"
            dangerouslySetInnerHTML={{ __html: part }}
            suppressHydrationWarning
          />
        );
      })}
    </div>
  );
}

function VoiceReader({ articleRef }: { articleRef: React.RefObject<HTMLDivElement | null> }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const activeRef = useRef(false);

  useEffect(() => {
     
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoiceReady(true);
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
      activeRef.current = false;
    };
  }, []);

  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ||
      voices.find((v) => v.lang.startsWith("en-") && !v.localService) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null
    );
  }, []);

  const splitIntoChunks = useCallback((text: string): string[] => {
    const maxLen = 3000;
    const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
    const chunks: string[] = [];
    let current = "";
    for (const s of sentences) {
      if ((current + s).length > maxLen && current.length > 0) {
        chunks.push(current.trim());
        current = s;
      } else {
        current += s;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }, []);

  const speakChunk = useCallback((idx: number) => {
    if (!activeRef.current || idx >= chunksRef.current.length) {
      setSpeaking(false);
      activeRef.current = false;
      return;
    }
    chunkIndexRef.current = idx;
    const utterance = new SpeechSynthesisUtterance(chunksRef.current[idx]);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    const voice = getVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => speakChunk(idx + 1);
    utterance.onerror = (e) => {
      if (e.error !== "canceled") speakChunk(idx + 1);
    };
    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  const start = useCallback(() => {
    const content = articleRef.current?.querySelector(".lesson-content");
    if (!content) return;
    const text = content.textContent || "";
    if (!text.trim()) return;

    window.speechSynthesis.cancel();
    const chunks = splitIntoChunks(text);
    chunksRef.current = chunks;
    chunkIndexRef.current = 0;
    activeRef.current = true;
    setSpeaking(true);
    setPaused(false);
    speakChunk(0);
  }, [articleRef, splitIntoChunks, speakChunk]);

  const stop = useCallback(() => {
    activeRef.current = false;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [paused]);

  if (!supported) return null;

  return (
    <div className="flex items-center gap-1">
      {speaking ? (
        <>
          <button
            type="button"
            onClick={togglePause}
            title={paused ? "Resume" : "Pause"}
            className="flex items-center gap-1.5 rounded-lg bg-mst-red/15 px-3 py-2 text-xs font-bold text-mst-red border border-mst-red/30 transition hover:bg-mst-red/25"
          >
            <Volume2 size={14} className="animate-pulse" />
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={stop}
            title="Stop reading"
            className="flex items-center rounded-lg px-2 py-2 text-xs text-mst-red border border-mst-red/30 transition hover:bg-mst-red/10"
          >
            <VolumeOff size={14} />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={start}
          disabled={!voiceReady}
          title={voiceReady ? "Read aloud" : "Loading voices..."}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:border-mst-red hover:text-mst-red hover:bg-mst-red/5 disabled:opacity-40"
        >
          <Volume2 size={14} />
          <span className="hidden sm:inline">Listen</span>
        </button>
      )}
    </div>
  );
}

interface LessonViewerProps {
  moduleId: any;
  mod: any;
  submodule: any;
  html: string;
  prevSlug?: string;
  nextSlug?: string;
  phaseId: string;
  allModuleIds: any[];
  moduleSlugMap: Record<string | number, string[]>;
  contentFile?: string;
}

export function LessonViewer({
  moduleId,
  mod,
  submodule,
  html,
  prevSlug,
  nextSlug,
  allModuleIds,
  moduleSlugMap,
  contentFile,
}: LessonViewerProps) {
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [validToc, setValidToc] = useState<{ id: string; title: string }[]>(submodule.toc || []);
  const [tocOpen, setTocOpen] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [leftTocOpen, setLeftTocOpen] = useState(true);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const readTime = estimateReadTime(html);

  useEffect(() => { setMounted(true); }, []);

  const handleAssessment = useCallback(async () => {
    if (assessmentLoading) return;
    setAssessmentLoading(true);
    setAssessmentError(null);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const savedAssignmentId = typeof window !== "undefined" ? localStorage.getItem("assignment-id") : null;
      let response;
      if (savedAssignmentId) {
        response = await fetch(`${baseURL}/api/assignments/student/${savedAssignmentId}`, {
          method: "GET",
          credentials: "include",
          headers,
        });
      }

      if (!response || !response.ok) {
        response = await fetch(`${baseURL}/api/assignments/submodule/${submodule._id}`, {
          method: "GET",
          credentials: "include",
          headers,
        });
      }

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Your session has expired. Please log in again."
            : `Unable to load assessment (${response.status}).`
        );
      }
      const data = await response.json();
      if (data && data._id && typeof window !== "undefined") {
        localStorage.setItem("all-assignment-ids", JSON.stringify([data._id]));
        localStorage.setItem("assignment-id", data._id);
      }
      router.push(`/module/${moduleId}/${submodule._id}/assessment`);
    } catch (error) {
      console.error(error);
      setAssessmentError(
        error instanceof Error ? error.message : "Unable to load assessment."
      );
    } finally {
      setAssessmentLoading(false);
    }
  }, [assessmentLoading, moduleId, router, submodule._id]);

  const getSlugs = useCallback(
    (id: number) => moduleSlugMap?.[id] ?? [],
    [moduleSlugMap]
  );
  console.log("Prakhar", mod)
  const slugs = mod?.submodules?.data?.map((s: any) => s.slug ?? s._id) ?? [];
  const modStatus = mounted && allModuleIds
    ? getModuleStatus(moduleId, allModuleIds, slugs, getSlugs)
    : "active";
  const moduleLocked = modStatus === "locked";

  const normalizeText = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/["""'\u200B-\u200F]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const slugifyText = (value: string) =>
    normalizeText(value).replace(/\s+/g, "-");

  const scrollToHeading = useCallback((id: string) => {
    let target: HTMLElement | null = document.getElementById(id);

    if (!target) {
      const container = articleRef.current || document;
      try { target = container.querySelector(`[id="${id}"]`) as HTMLElement | null; } catch { /* */ }
    }

    if (!target) {
      const searchRoot = articleRef.current || document;
      const allH = searchRoot.querySelectorAll("h1,h2,h3,h4,h5,h6,.section-title,.sub-title");
      const norm = id.toLowerCase().replace(/[^a-z0-9]/g, "");
      for (const h of allH) {
        const hId = (h.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const hTxt = (h.textContent || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (hId === norm || hTxt === norm || (norm.length > 4 && hTxt.includes(norm)) || (norm.length > 4 && norm.includes(hTxt.slice(0, 15)))) {
          target = h as HTMLElement;
          break;
        }
      }
    }

    if (!target) return;

    const navbarHeight = 64;
    const headerHeight = 100;
    const offset = navbarHeight + headerHeight + 16;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });

    setActiveHeading(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => markLessonComplete(moduleId, submodule.slug), 3000);
    return () => clearTimeout(t);
  }, [moduleId, submodule.slug]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const text = anchor.textContent?.toLowerCase() ?? "";
      const href = anchor.getAttribute("href") ?? "";
      if (text.includes("assessment") || href.toLowerCase().includes("assessment")) {
        e.preventDefault();
        handleAssessment();
      }
    };
    article.addEventListener("click", handleClick);
    return () => article.removeEventListener("click", handleClick);
  }, [handleAssessment]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollMax = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollMax > 10 ? Math.min(100, Math.round((scrollTop / scrollMax) * 100)) : 0;
      setReadProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (contentFile) {
      setValidToc(submodule.toc || []);
      return;
    }
    // When active heading changes, ensure the corresponding TOC item is visible and centered
    if (!navRef.current || !activeHeading) return;
    try {
      const activeEl = navRef.current.querySelector(".bg-mst-red, .text-mst-red, [data-active='true']") as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    } catch { }
    // fallthrough to existing effect code
    const content = articleRef.current?.querySelector(".lesson-content");
    if (!content) return;

    const headings = Array.from(
      content.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ) as HTMLElement[];

    const sectionTitles = Array.from(
      content.querySelectorAll(".section-title, .sub-title")
    ) as HTMLElement[];

    const allElements = [...headings];
    for (const st of sectionTitles) {
      if (!allElements.includes(st)) allElements.push(st);
    }

    allElements.sort((a, b) => {
      const pos = a.compareDocumentPosition(b);
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    if (allElements.length === 0) {
      setValidToc([]);
      return;
    }

    const headingRecords = allElements
      .map((heading, index) => {
        const rawText = heading.textContent || "";
        const headingText = normalizeText(rawText);
        if (!headingText || headingText.length < 3) return null;
        const defaultId = `lesson-heading-${index}-${slugifyText(headingText).slice(0, 40)}`;
        if (!heading.id) heading.id = defaultId;
        heading.style.scrollMarginTop = "12rem";
        return {
          heading,
          id: heading.id,
          text: headingText,
          title: rawText.trim(),
        };
      })
      .filter((record): record is { heading: HTMLElement; id: string; text: string; title: string } => Boolean(record));

    const seen = new Set<string>();
    const uniqueRecords = headingRecords.filter((r) => {
      if (seen.has(r.text)) return false;
      seen.add(r.text);
      return true;
    });

    const matchedItems = submodule.toc
      .map((item: any) => {
        const normalizedItem = normalizeText(item.title);
        const match = uniqueRecords.find((record) => {
          return (
            record.text === normalizedItem ||
            record.text.startsWith(normalizedItem) ||
            normalizedItem.startsWith(record.text) ||
            record.text.includes(normalizedItem) ||
            normalizedItem.includes(record.text)
          );
        });
        if (match) {
          match.heading.id = item.id;
          return { id: item.id, title: item.title };
        }
        return null;
      })
      .filter((item: any): item is { id: string; title: string } => Boolean(item));

    if (matchedItems.length > 0) {
      setValidToc(matchedItems);
    } else {
      setValidToc(
        uniqueRecords.map((record) => ({
          id: record.id,
          title: record.title.length > 60 ? record.title.slice(0, 57) + "..." : record.title,
        }))
      );
    }

    const observeTargets = matchedItems.length > 0
      ? uniqueRecords.filter((r) => matchedItems.some((m: any) => {
        const el = document.getElementById(m.id);
        return el === r.heading;
      }))
      : uniqueRecords;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target.id) {
          setActiveHeading(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -70% 0px",
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    uniqueRecords.forEach((record) => {
      if (record.heading.id) observer.observe(record.heading);
    });

    return () => observer.disconnect();
  }, [submodule.toc, html, mounted]);

  const lessonTitle = getLessonDisplayTitle(submodule.title, "Topic: ");
  console.log("Submodule in LessonViewerrrrrrrrrrrrrrrrrrr5555555555555555555555555:", lessonTitle);

  if (contentFile) {
    const contentUrl = resolveContentFileUrl(contentFile);

    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col bg-[var(--bg)]" suppressHydrationWarning>
        <iframe
          key={contentUrl}
          src={contentUrl}
          title={lessonTitle}
          className="w-full flex-1 min-h-0 border-0 bg-white"
        />

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 lg:px-8">
          {prevSlug ? (
            <Link
              href={`/module/${moduleId}/${prevSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-mst-red/40 hover:bg-[var(--bg-muted)]"
            >
              <ChevronLeft size={16} /> Previous Lesson
            </Link>
          ) : (
            <Link
              href={`/module/${moduleId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-mst-red hover:underline"
            >
              <ChevronLeft size={16} /> Back to Module
            </Link>
          )}
          <button
            type="button"
            onClick={handleAssessment}
            disabled={assessmentLoading}
            className="rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {assessmentLoading ? "Loading assessment..." : "Continue to Assessment"}
          </button>
          {assessmentError && (
            <p className="w-full text-center text-xs text-red-500">{assessmentError}</p>
          )}
          {nextSlug ? (
            <Link
              href={`/module/${moduleId}/${nextSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-mst-red/40 hover:bg-[var(--bg-muted)]"
            >
              Next Lesson <ChevronRight size={16} />
            </Link>
          ) : (
            <span />
          )}
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[var(--bg)]" suppressHydrationWarning>
      {/* Left Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--sidebar-bg)] lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:overflow-y-auto lg:self-start">
        {/* Module info */}
        <div className="border-b border-white/10 p-5">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-mst-red transition"
          >
            <ChevronLeft size={12} />
            Phase Tree
          </Link>
          <Link
            href={`/module/${moduleId}`}
            className="mt-3 block text-sm font-bold text-white hover:text-mst-red transition"
          >
            Module {moduleId}: {mod.title}
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span className="rounded-lg bg-mst-red/20 px-2.5 py-1 text-xs font-bold text-mst-red">
              {submodule.index}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-white/40">
              <Clock size={10} />
              {readTime} min read
            </span>
          </div>
        </div>

        {/* On this page - TOC */}
        {validToc.length > 0 && (
          <div className="border-b border-white/10">
            <button
              type="button"
              onClick={() => setLeftTocOpen(!leftTocOpen)}
              className="flex w-full items-center justify-between px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white/70 transition"
            >
              <span className="flex items-center gap-2">
                <List size={12} />
                On this page
              </span>
              {leftTocOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {leftTocOpen && (
              <nav ref={navRef as any} className="px-3 pb-3 space-y-0.5 max-h-[40vh] overflow-y-auto">
                {validToc.map((item, idx) => {
                  const isAssessmentItem = normalizeText(item.title).includes("assessment");
                  if (isAssessmentItem) {
                    return (
                      <Link
                        key={item.id}
                        href={`/module/${moduleId}/${submodule._id}/assessment`}
                        className={`group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition text-white/60 hover:bg-white/5 hover:text-white`}
                      >
                        <span className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold bg-white/10 text-white/40`}>
                          {idx + 1}
                        </span>
                        <span className="leading-tight line-clamp-2">{item.title}</span>
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      className={`group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${activeHeading === item.id
                        ? "bg-mst-red/15 text-mst-red font-semibold"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}>
                      <span className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold ${activeHeading === item.id
                        ? "bg-mst-red text-white"
                        : "bg-white/10 text-white/40 group-hover:bg-white/15"
                        }`}>
                        {idx + 1}
                      </span>
                      <span className="leading-tight line-clamp-2">{item.title}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
        )}

        {/* NOTE: 'All Lessons' list removed from left sidebar per UX request. */}

        {/* Bottom actions */}
        <div className="space-y-2 border-t border-white/10 p-4">
          <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
            <span>Reading progress</span>
            <span className="font-bold text-mst-red">{readProgress}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-mst-red to-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${readProgress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col bg-[var(--bg-elevated)]">
        {/* Reading progress bar */}
        <div className="h-1 w-full bg-[var(--border)]">
          <div
            className="h-full bg-gradient-to-r from-mst-red to-orange-500 transition-all duration-300"
            style={{ width: `${readProgress}%` }}
          />
        </div>

        {/* Sticky header */}
        <header className="sticky top-16 z-30 flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm px-4 py-4 lg:px-10">
          <div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Link
                href={`/module/${moduleId}`}
                className="text-mst-red hover:underline font-medium"
              >
                Module {moduleId}
              </Link>
              <ChevronRight size={14} />
              <span className="font-semibold text-[var(--text)]">
                {submodule.index}
              </span>
            </div>
            <h1 className="mt-1.5 text-xl font-black text-[var(--text)] lg:text-2xl">
              {lessonTitle}
            </h1>
            <div className="mt-1.5 flex items-center gap-4">
              {submodule.subtitle && (
                <p className="text-sm text-[var(--text-muted)] max-w-2xl">
                  {submodule.subtitle}
                </p>
              )}
              <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--text-muted)]">
                <Clock size={12} />
                {readTime} min
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <VoiceReader articleRef={articleRef} />
            <span className="hidden text-xs font-medium text-[var(--text-muted)] sm:block">
              {readProgress}%
            </span>
            {/* Mobile TOC toggle */}
            <button
              type="button"
              onClick={() => setTocOpen(!tocOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)] transition hover:border-mst-red lg:hidden"
            >
              <List size={14} />
              {tocOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </header>

        {/* Mobile TOC dropdown */}
        {tocOpen && (
          <div className="border-b border-[var(--border)] bg-[var(--surface)] p-4 lg:hidden">
            <ul className="space-y-1">
              {validToc.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      scrollToHeading(item.id);
                      setTocOpen(false);
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${activeHeading === item.id
                      ? "bg-mst-red/10 text-mst-red font-semibold"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
                      }`}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article content */}
        <article ref={articleRef} className="flex-1 px-4 py-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-4xl">
            {mounted ? (
              <LessonContent html={html} />
            ) : (
              <div
                className="lesson-content space-y-4"
                dangerouslySetInnerHTML={{ __html: cleanHtml(html) }}
                suppressHydrationWarning
              />
            )}
          </div>

          {/* Scroll to top */}
          {readProgress > 20 && (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-24 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-mst-red text-white shadow-lg shadow-mst-red/30 transition hover:shadow-mst-red/50 hover:scale-110"
            >
              <ArrowUp size={18} />
            </button>
          )}
        </article>

        {/* Footer navigation */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 lg:px-10">
          {prevSlug ? (
            <Link
              href={`/module/${moduleId}/${prevSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-mst-red/40 hover:bg-[var(--bg-muted)]"
            >
              <ChevronLeft size={16} /> Previous Lesson
            </Link>
          ) : (
            <span />
          )}
          {/* <Link
            href={`/module/${moduleId}/${submodule.slug}/assessment`}
            className="rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40"
          >
            <span className="flex items-center gap-2">
              <ClipboardCheck size={16} />
              Continue to Assessment
            </span>
          </Link> */}
          <button
            type="button"
            onClick={handleAssessment}
            disabled={assessmentLoading}
            className="rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {assessmentLoading ? "Loading assessment..." : "Continue to Assessment"}
          </button>
          {assessmentError && (
            <p className="w-full text-center text-xs text-red-500">{assessmentError}</p>
          )}
          {nextSlug ? (
            <Link
              href={`/module/${moduleId}/${nextSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-mst-red/40 hover:bg-[var(--bg-muted)]"
            >
              Next Lesson <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              href={`/module/${moduleId}`}
              className="text-sm font-medium text-mst-red hover:underline"
            >
              Back to Module
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}
