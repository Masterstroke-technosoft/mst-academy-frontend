"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  Shield,
  BookOpen,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Network,
} from "lucide-react";

export default function ValidatorDashboardPage() {
  return (
    <DashboardShell role="validator" title="Validator Hub">
      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Shield, label: "Validator Status", value: "Active", color: "text-green-500", bg: "bg-green-500/10" },
          { icon: Cpu, label: "Node Uptime", value: "99.9%", color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Network, label: "Network Role", value: "Validator", color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: Award, label: "Certifications", value: "In Progress", color: "text-amber-500", bg: "bg-amber-500/10" },
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

      {/* Validator resources */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-mst-red/10 p-2.5">
            <Shield size={22} className="text-mst-red" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Validator Resources</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Access validator-specific tools, ecosystem documentation, and network monitoring
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { title: "Node Setup Guide", desc: "Configure and maintain your validator node", icon: Cpu },
            { title: "Staking Dashboard", desc: "Monitor staking performance and rewards", icon: Award },
            { title: "Network Health", desc: "Real-time network status and metrics", icon: Network },
            { title: "Community Forum", desc: "Connect with fellow validators", icon: Users },
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
      </section>

      {/* Curriculum access */}
      <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-muted)] p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-2.5">
            <BookOpen size={22} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Full Curriculum Access</h2>
            <p className="text-sm text-[var(--text-muted)]">
              All phases, modules, and assessments are unlocked for validators
            </p>
          </div>
        </div>
        <Link
          href="/learn"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40"
        >
          <BookOpen size={16} />
          Open Learning Tree
          <ArrowRight size={16} />
        </Link>
      </section>
    </DashboardShell>
  );
}
