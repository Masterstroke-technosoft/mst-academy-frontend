"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = "",
  durationMs = 1400,
  className = "",
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, durationMs]);

  return (
    <span className={className}>
      {value}
      {suffix}
    </span>
  );
}
