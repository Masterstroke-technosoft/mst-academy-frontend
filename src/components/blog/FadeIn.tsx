"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  /** Animate when scrolled into view instead of on mount (for below-the-fold content). */
  onView?: boolean;
}

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
  none: {},
};


export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  onView = false,
}: FadeInProps) {
  const initial = { opacity: 0, ...OFFSET[direction] };
  const animate = { opacity: 1, x: 0, y: 0 };

  if (onView) {
    return (
      <motion.div
        initial={initial}
        whileInView={animate}
        viewport={{ once: true }}
        transition={{ duration, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div initial={initial} animate={animate} transition={{ duration, delay }} className={className}>
      {children}
    </motion.div>
  );
}
