"use client";

import { motion } from "framer-motion";

export default function AmbientBlobs() {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-mst-red/20 blur-[100px]"
        animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-mst-red-light/20 blur-[90px]"
        animate={{ x: [0, -30, 40, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
