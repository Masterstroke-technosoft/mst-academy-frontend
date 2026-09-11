"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  strings: string[];
  speedMs?: number;
  pauseMs?: number;
  className?: string;
}

export function Typewriter({
  strings,
  speedMs = 45,
  pauseMs = 900,
  className = "",
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(strings[0] ?? "");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const current = strings[index] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % strings.length);
    } else {
      timeout = setTimeout(() => {
        setText((prev) =>
          deleting
            ? prev.slice(0, -1)
            : current.slice(0, prev.length + 1)
        );
      }, deleting ? speedMs / 2 : speedMs);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, strings, speedMs, pauseMs, mounted]);

  return (
    <span className={className}>
      {text}
      {mounted && <span className="animate-pulse text-mst-red ml-0.5 inline-block">|</span>}
    </span>
  );
}
