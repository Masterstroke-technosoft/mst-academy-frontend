"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { dashboardPath, setSession, logout, type AuthUser, type UserRole } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import {
  AuthShell,
  FieldLabel,
  SubmitButton,
  TextInput,
} from "./AuthShell";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState(() => searchParams.get("email") ?? "");
  const justRegistered = searchParams.get("registered") === "1";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  function normalizeRole(role?: string): UserRole {
    const value = (role || "student").toLowerCase();
    if (value === "admin" || value === "student" || value === "validator" || value === "non-validator") {
      return value as UserRole;
    }
    return "student";
  }

  async function loginWithApi(
    email: string,
    password: string
  ): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const token = data.accessToken || data.token || (data.data && data.data.token) || (data.data && data.data.accessToken);
        if (token) {
          localStorage.setItem("admin-token", token);
        }

        const apiUser = data?.user || data?.data?.user || data?.data || {};
        if (apiUser?.isActive === false) {
          return { ok: false, error: "Your account has been blocked. Please coordinate with support." };
        }

        const loggedInUser: AuthUser = {
          id: apiUser?.id || `user-${Date.now()}`,
          email: apiUser?.email || email,
          password,
          fullName: apiUser?.fullName || apiUser?.name || email.split("@")[0],
          role: normalizeRole(apiUser?.role || data?.role || data?.data?.role),
          registeredAt: apiUser?.registeredAt || new Date().toISOString(),
        };

        setSession(loggedInUser);
        return { ok: true, user: loggedInUser };
      } else {
        try {
          const errorData = await response.json();
          const errorMsg = errorData?.message || errorData?.error || "";
          if (
            errorMsg.toLowerCase().includes("block") ||
            errorMsg.toLowerCase().includes("deactive") ||
            errorMsg.toLowerCase().includes("deactivate") ||
            errorMsg.toLowerCase().includes("support")
          ) {
            return { ok: false, error: "Your account has been blocked. Please coordinate with support." };
          }
          if (errorMsg) {
            return { ok: false, error: errorMsg };
          }
        } catch (e) {
          // ignore parsing error
        }
        return { ok: false, error: "Invalid credentials." };
      }
    } catch (err) {
      console.error("Login API error, falling back to localStorage:", err);
    }

    const raw = localStorage.getItem("mst-academy-users");
    const users = raw ? (JSON.parse(raw) as AuthUser[]) : [];
    const found = users.find((user) => normalizeEmail(user.email) === normalizeEmail(email));

    if (!found) {
      return { ok: false, error: "Invalid credentials or server unavailable." };
    }

    if (found.isActive === false) {
      return { ok: false, error: "Your account has been blocked. Please coordinate with support." };
    }

    if (found.password !== password) {
      return { ok: false, error: "Incorrect password." };
    }

    setSession(found);
    return { ok: true, user: found };
  }

  async function handleLogout() {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      await fetch(`${baseURL}/api/auth/clear-session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    } catch (e) {
      console.error(e);
    }
    logout();
    setShowLogoutModal(false);
    setError("");
    router.push('/login');
    //refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginWithApi(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      if (result.error.toLowerCase().includes("active session")) {
        setShowLogoutModal(true);
      }
      return;
    }
    refresh();
    const next = searchParams.get("next");
    const destination = next && next.startsWith("/") ? next : dashboardPath(result.user.role);
    window.location.href = destination;
  }

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue your learning journey."
    >
      {justRegistered && (
        <p className="mb-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400">
          Registration successful! Please sign in to continue.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <TextInput
            id="email"
            type="email"
            autoComplete="off"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password" required>
              Password
            </FieldLabel>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-mst-red hover:underline mb-1.5"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <SubmitButton disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        New here?{" "}
        <Link href="/register" className="font-semibold text-mst-red hover:underline">
          Create an account
        </Link>
      </p>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 text-left align-middle shadow-xl transition-all">
            <h3 className="text-lg font-bold leading-6 text-[var(--text)]">
              Active Session Detected
            </h3>
            <div className="mt-2">
              <p className="text-sm text-[var(--text-muted)]">
                User already has an active session. Please logout first.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
