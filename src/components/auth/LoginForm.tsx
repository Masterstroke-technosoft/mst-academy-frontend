"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardPath, setSession, type AuthUser, type UserRole } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import {
  AuthShell,
  FieldLabel,
  SubmitButton,
  TextInput,
} from "./AuthShell";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (found.password !== password) {
      return { ok: false, error: "Incorrect password." };
    }

    setSession(found);
    return { ok: true, user: found };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginWithApi(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    refresh();
    router.push(dashboardPath(result.user.role));
  }

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue your learning journey."
    >
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
          <FieldLabel htmlFor="password" required>
            Password
          </FieldLabel>
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
    </AuthShell>
  );
}
