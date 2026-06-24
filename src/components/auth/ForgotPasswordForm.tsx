"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthShell,
  FieldLabel,
  SubmitButton,
  TextInput,
} from "./AuthShell";
import { Eye, EyeOff } from "lucide-react";
import {
  isValidEmail,
  getOtpCooldownTime,
} from "@/lib/otp";
import type { AuthUser } from "@/lib/auth";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState(0);

  useEffect(() => {
    if (!email) {
      setOtpCooldownSeconds(0);
      return;
    }

    const checkCooldown = () => {
      const seconds = getOtpCooldownTime(email);
      setOtpCooldownSeconds(seconds);
    };

    checkCooldown();

    if (otpCooldownSeconds > 0) {
      const interval = setInterval(checkCooldown, 1000);
      return () => clearInterval(interval);
    }
  }, [email, otpCooldownSeconds]);

  async function handleSendOtp() {
    setError("");
    setSuccess("");
    setOtpLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseURL}/api/auth/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setOtpLoading(false);
      if (response.ok && data.success) {
        setOtpSent(true);
        setSuccess("OTP sent successfully");
        setEmailVerified(false);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setOtpLoading(false);
      setError("Network error. Please check your connection.");
      console.error("Error sending OTP:", error);
    }
  }

  async function handleVerifyOtp() {
    setError("");
    setSuccess("");
    setVerifyOtpLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseURL}/api/auth/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      const data = await response.json();
      setVerifyOtpLoading(false);
      if (response.ok && data.success) {
        setEmailVerified(true);
        setSuccess("OTP verified successfully");
        setDemoOtp("");
        setError("");
      } else {
        setError(data.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      setVerifyOtpLoading(false);
      setError("Network error. Please check your connection.");
      console.error("Error verifying OTP:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailVerified) {
      setError("Please verify your email address first.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseURL}/api/auth/forgot-password/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Fallback update local storage if user was stored locally
        try {
          const raw = localStorage.getItem("mst-academy-users");
          const users = raw ? (JSON.parse(raw) as AuthUser[]) : [];
          const index = users.findIndex((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
          if (index !== -1) {
            users[index].password = password;
            localStorage.setItem("mst-academy-users", JSON.stringify(users));
          }
        } catch (e) {
          console.warn("Could not update local fallback users", e);
        }

        setSuccess("Password reset successfully! Redirecting to login...");
        setLoading(false);
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }, 2000);
        return;
      } else {
        setError(data.message || "Password reset failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("API reset-password failed:", err);
      setError("Network error. Failed to reset password.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Verify your email and set a new password."
    >
      {success && (
        <p className="mb-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400">
          {success}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <div className="flex gap-2">
            <TextInput
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailVerified(false);
                setOtpSent(false);
              }}
              placeholder="you@example.com"
              className="flex-1"
              disabled={emailVerified}
            />
            {!emailVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !isValidEmail(email) || otpCooldownSeconds > 0}
                className="shrink-0 rounded-xl bg-[var(--bg-muted)] px-4 py-3 text-xs font-bold text-[var(--text)] transition hover:bg-mst-red/10 hover:text-mst-red disabled:opacity-50"
              >
                {otpLoading ? "…" : otpCooldownSeconds > 0 ? `${otpCooldownSeconds}s` : otpSent ? "Resend" : "Send OTP"}
              </button>
            )}
          </div>
          {emailVerified && (
            <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
              ✓ Email verified
            </p>
          )}
          {!emailVerified && otpCooldownSeconds > 0 && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              ⏱️ Too many requests. Please wait {otpCooldownSeconds}s.
            </p>
          )}
        </div>

        {otpSent && !emailVerified && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4">
            <FieldLabel htmlFor="otp" required>
              Enter OTP
            </FieldLabel>
            <div className="mt-2 flex gap-2">
              <TextInput
                id="otp"
                inputMode="numeric"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit code"
                className="flex-1 tracking-[0.3em]"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyOtpLoading || !otpCode}
                className="shrink-0 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-3 text-xs font-bold text-white disabled:opacity-50"
              >
                {verifyOtpLoading ? "…" : "Verify"}
              </button>
            </div>
          </div>
        )}

        {emailVerified && (
          <>
            <div>
              <FieldLabel htmlFor="password" required>
                New Password
              </FieldLabel>
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
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

            <div>
              <FieldLabel htmlFor="confirmPassword" required>
                Confirm New Password
              </FieldLabel>
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <SubmitButton disabled={loading}>
              {loading ? "Resetting password..." : "Reset Password"}
            </SubmitButton>
          </>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-mst-red hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
