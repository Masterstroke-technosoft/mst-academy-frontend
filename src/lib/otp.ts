"use client";

const OTP_KEY = "mst-academy-otp-pending";
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RATE_LIMIT_KEY = "mst-academy-otp-rate-limit";
const OTP_MAX_ATTEMPTS = 2;
const OTP_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

interface PendingOtp {
  phone: string;
  code: string;
  expiresAt: number;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

export function isValidIndianMobile(phone: string): boolean {
  const digits = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRateLimitData(email: string): { attempts: number; resetAt: number } | null {
  if (typeof window === "undefined") return null;

  try {
    const key = `${OTP_RATE_LIMIT_KEY}-${email}`;
    const data = sessionStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function setRateLimitData(email: string, attempts: number, resetAt: number): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${OTP_RATE_LIMIT_KEY}-${email}`;
    sessionStorage.setItem(key, JSON.stringify({ attempts, resetAt }));
  } catch {
    // ignore storage errors
  }
}

export function getOtpCooldownTime(email: string): number {

  const normalized = email.trim().toLowerCase();
  const data = getRateLimitData(normalized);

  if (!data) return 0;
  if (data.attempts < OTP_MAX_ATTEMPTS) return 0;

  const now = Date.now();
  if (now < data.resetAt) {
    return Math.ceil((data.resetAt - now) / 1000); // return seconds remaining
  }

  // Reset has expired, clear the rate limit
  if (typeof window !== "undefined") {
    const key = `${OTP_RATE_LIMIT_KEY}-${normalized}`;
    sessionStorage.removeItem(key);
  }

  return 0;
}

export async function sendEmailOtp(email: string):
  Promise<
    | { ok: true; demoCode: string }
    | { ok: false; error: string }
  > {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (typeof window === "undefined") {
    return { ok: false, error: "OTP is only available in the browser." };
  }

  const normalized = email.trim().toLowerCase();
  if (!isValidEmail(normalized)) {
    return {
      ok: false,
      error: "Enter a valid email address.",
    };
  }

  // Check rate limit
  const cooldownSeconds = getOtpCooldownTime(normalized);
  if (cooldownSeconds > 0) {
    const minutes = Math.ceil(cooldownSeconds / 60);
    return {
      ok: false,
      error: `Too many OTP requests. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { ok: false, error: data.message || "Failed to send OTP" };
    }

    // Update rate limit counter
    const currentData = getRateLimitData(normalized) || { attempts: 0, resetAt: 0 };
    const newAttempts = currentData.attempts + 1;
    const resetAt = newAttempts >= OTP_MAX_ATTEMPTS
      ? Date.now() + OTP_COOLDOWN_MS
      : currentData.resetAt;

    setRateLimitData(normalized, newAttempts, resetAt);

    // Store a temporary flag to track that OTP was sent
    sessionStorage.setItem(
      `${OTP_KEY}-sent`,
      JSON.stringify({ email: normalized, at: Date.now() })
    );

    // Generate a demo code for development/demo purposes
    const demoCode = generateCode();
    return { ok: true, demoCode };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      ok: false,
      error: "Network error. Please check your connection.",
    };
  }
}

export async function verifyEmailOtp(
  email: string,
  code: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (typeof window === "undefined") return false;

  const normalized = email.trim().toLowerCase();
  const entered = code.replace(/\D/g, "").trim();
  if (entered.length !== 6) return false;

  try {
    const response = await fetch(`${baseUrl}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, otp: entered }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    if (!data.success) {
      return false;
    }

    sessionStorage.setItem(
      `${OTP_KEY}-verified`,
      JSON.stringify({ email: normalized, at: Date.now() })
    );
    sessionStorage.removeItem(`${OTP_KEY}-sent`);
    return true;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
}

export function isEmailVerified(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(`${OTP_KEY}-verified`);
    if (!raw) return false;
    const v = JSON.parse(raw) as { email: string };
    return v.email === email.trim().toLowerCase();
  } catch {
    return false;
  }
}

export function sendOtp(phone: string):
  | { ok: true; demoCode: string }
  | { ok: false; error: string } {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (typeof window === "undefined") {
    return { ok: false, error: "OTP is only available in the browser." };
  }

  const normalized = normalizePhone(phone);
  if (!isValidIndianMobile(phone)) {
    return {
      ok: false,
      error: "Enter a valid 10-digit Indian mobile number.",
    };
  }

  const code = generateCode();
  const pending: PendingOtp = {
    phone: normalized,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  };
  sessionStorage.setItem(OTP_KEY, JSON.stringify(pending));

  return { ok: true, demoCode: code };
}

export function verifyOtp(phone: string, code: string): boolean {
  if (typeof window === "undefined") return false;

  const normalized = normalizePhone(phone);
  const entered = code.replace(/\D/g, "").trim();
  if (entered.length !== 6) return false;

  try {
    const raw = sessionStorage.getItem(OTP_KEY);
    if (!raw) return false;
    const pending = JSON.parse(raw) as PendingOtp;
    if (Date.now() > pending.expiresAt) return false;
    if (pending.phone !== normalized) return false;
    if (pending.code !== entered) return false;
    sessionStorage.setItem(
      `${OTP_KEY}-verified`,
      JSON.stringify({ phone: normalized, at: Date.now() })
    );
    sessionStorage.removeItem(OTP_KEY);
    return true;
  } catch {
    return false;
  }
}

export function isPhoneVerified(phone: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(`${OTP_KEY}-verified`);
    if (!raw) return false;
    const v = JSON.parse(raw) as { phone: string };
    return v.phone === normalizePhone(phone);
  } catch {
    return false;
  }
}
