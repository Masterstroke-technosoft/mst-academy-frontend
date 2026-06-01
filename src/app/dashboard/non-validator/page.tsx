"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StudentProfile } from "@/components/dashboard/StudentProfile";
import { ReferAndEarnTab } from "@/components/dashboard/ReferAndEarnTab";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import {
  Code2,
  BookOpen,
  Award,
  Rocket,
  ArrowRight,
  Blocks,
  Coins,
  Layers,
  Trophy,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";

function PlaceholderTab({ title, icon: Icon, description }: { title: string, icon: any, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm min-h-[400px]">
      <div className="rounded-2xl bg-mst-red/10 p-4">
        <Icon className="h-10 w-10 text-mst-red" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-[var(--text)]">{title}</h2>
      <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}

export default function NonValidatorDashboardPage() {
  const { user } = useAuth();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    
    // Check initial hash
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (!user) return null;

  if (activeHash === "#profile") {
    return (
      <DashboardShell role="non-validator" title="Profile">
        <StudentProfile user={user} />
      </DashboardShell>
    );
  }


  if (activeHash === "#assessments") {
    return (
      <DashboardShell role="non-validator" title="Assessments">
        <PlaceholderTab 
          title="My Assessments" 
          icon={ClipboardCheck} 
          description="Complete modules on your Learning Roadmap to unlock assessments and certify your skills." 
        />
      </DashboardShell>
    );
  }

  if (activeHash === "#progress") {
    return (
      <DashboardShell role="non-validator" title="Progress">
        <PlaceholderTab 
          title="Learning Progress" 
          icon={BarChart3} 
          description="Track your course completion, activity heatmap, and performance analytics here as you learn." 
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="non-validator" title="Developer Hub">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Animated red gradient glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-[500px] w-[500px] animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-mst-red/15 blur-[120px] dark:bg-mst-red/10" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[600px] w-[600px] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-[#e31e24]/10 blur-[100px]" />
        
        <div className="relative z-10 space-y-6">
          {/* Quick stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, label: "Total Modules", value: "21", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Code2, label: "Focus Area", value: "Development", color: "text-green-500", bg: "bg-green-500/10" },
              { icon: Blocks, label: "Track", value: "Blockchain Dev", color: "text-purple-500", bg: "bg-purple-500/10" },
              { icon: Trophy, label: "Certification", value: "In Progress", color: "text-amber-500", bg: "bg-amber-500/10" },
            ].map((stat) => (
              <div key={stat.label} className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-mst-red/30 hover:shadow-lg hover:shadow-mst-red/5">
                <div className="absolute inset-0 bg-gradient-to-br from-mst-red/0 via-transparent to-mst-red/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className={`inline-flex rounded-xl ${stat.bg} p-2.5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <p className="mt-3 text-2xl font-black text-[var(--text)]">{stat.value}</p>
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Developer program */}
          <section className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all hover:border-mst-red/30 hover:shadow-lg hover:shadow-mst-red/5">
            <div className="absolute inset-0 bg-gradient-to-br from-mst-red/0 via-transparent to-mst-red/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
          <div className="rounded-xl bg-mst-red/10 p-2.5">
            <Code2 size={22} className="text-mst-red" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Developer Program</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Master blockchain development across 21 modules with hands-on projects
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { title: "Smart Contracts", desc: "Solidity, testing, security auditing", icon: Code2 },
            { title: "DeFi Protocols", desc: "DEX, lending, yield farming", icon: Coins },
            { title: "NFTs & Gaming", desc: "ERC-721, ERC-1155, game mechanics", icon: Layers },
            { title: "Career Track", desc: "Grants, pitching, interview prep", icon: Rocket },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4 transition hover:border-mst-red/30">
              <item.icon size={18} className="mt-0.5 text-mst-red shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">{item.title}</h3>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
              </div>
            </div>
          </section>

          {/* Start building */}
          <section className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-muted)] p-6 shadow-sm transition-all hover:border-mst-red/30 hover:shadow-lg hover:shadow-mst-red/5">
            <div className="absolute inset-0 bg-gradient-to-br from-mst-red/0 via-transparent to-mst-red/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-500/10 p-2.5">
            <Rocket size={22} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Start Building</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Begin Phase 1 and progress through assessments and live coding challenges
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[var(--bg-muted)] p-4 border border-[var(--border)]">
          <Award size={18} className="text-amber-500" />
          <p className="text-sm text-[var(--text-muted)]">
            Upon enrollment completion, fractional MST Validator participation may be allocated for ecosystem contribution
          </p>
        </div>
        <Link
          href="/learn"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40"
        >
          <BookOpen size={16} />
          Open Learning Tree
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
