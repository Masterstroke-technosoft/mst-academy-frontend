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
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
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
  }, [text, deleting, index, strings, speedMs, pauseMs]);

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse text-mst-red">|</span>
    </span>
  );
}
