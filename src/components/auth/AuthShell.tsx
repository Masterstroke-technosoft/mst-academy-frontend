import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--bg)] px-4 py-12">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-mst-red"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mst-red to-red-700 shadow-lg shadow-mst-red/20">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text)]">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-xs text-[var(--text-muted)] max-w-sm">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DemoFeeNote() {
  return (
    <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold" style={{ color: "#854d0e" }}>
      Fee display only. Payment gateway integration pending.
    </p>
  );
}

export function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="rounded-xl border-l-4 border-mst-red bg-mst-red/5 px-4 py-3 text-sm leading-relaxed text-[var(--text)]">
      {children}
    </blockquote>
  );
}

export function DemoFee({ amount }: { amount: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
        Program Fee
      </p>
      <p className="mt-1 text-2xl font-black text-mst-red">
        ₹{amount.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-semibold text-[var(--text)]"
    >
      {children}
      {required && <span className="text-mst-red"> *</span>}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)]/50 focus:border-mst-red focus:ring-2 focus:ring-mst-red/20 ${props.className ?? ""}`}
    />
  );
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-2 focus:ring-mst-red/20 ${props.className ?? ""}`}
    />
  );
}

export function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-xl bg-gradient-to-r from-mst-red to-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-gradient-to-r from-mst-red to-red-600 text-white shadow-md shadow-mst-red/20"
          : "bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
      }`}
    >
      {children}
    </button>
  );
}
