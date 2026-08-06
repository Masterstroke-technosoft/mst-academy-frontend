"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";


export default function CtaBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-12 bg-gradient-to-br from-[var(--surface-2)] to-[var(--bg-muted)] border border-[var(--border)] rounded-3xl p-8 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-mst-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mst-red/10 text-mst-red mb-4">
          <Flame size={24} className="animate-pulse" />
        </div>
        <h3 className="text-2xl font-black text-[var(--text)]">Accelerate Your Web3 Developer Journey</h3>
        <p className="text-[var(--text-muted)] text-sm max-w-xl mx-auto mt-3 leading-relaxed">
          Master blockchain engineering with 21 comprehensive modules. Build smart contracts, launch dApps, and get
          certified on-chain.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/academy-overview" className="w-full sm:w-auto">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="block w-full sm:inline-block bg-mst-red hover:bg-mst-red-dark text-white text-sm font-bold px-6 py-3 rounded-xl shadow-sm transition-colors duration-200 cursor-pointer text-center"
            >
              Explore Program
            </motion.span>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="block w-full sm:inline-block border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg-muted)] text-[var(--text)] text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer text-center"
            >
              Join Academy
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
