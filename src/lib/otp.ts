"use client";

const OTP_KEY = "mst-academy-otp-pending";
const OTP_TTL_MS = 10 * 60 * 1000;

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

export function sendEmailOtp(email: string):
  | { ok: true; demoCode: string }
  | { ok: false; error: string } {
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

  const code = generateCode();
  const pending = {
    email: normalized,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  };
  sessionStorage.setItem(OTP_KEY, JSON.stringify(pending));

  return { ok: true, demoCode: code };
}

export function verifyEmailOtp(email: string, code: string): boolean {
  if (typeof window === "undefined") return false;

  const normalized = email.trim().toLowerCase();
  const entered = code.replace(/\D/g, "").trim();
  if (entered.length !== 6) return false;

  try {
    const raw = sessionStorage.getItem(OTP_KEY);
    if (!raw) return false;
    const pending = JSON.parse(raw);
    if (Date.now() > pending.expiresAt) return false;
    if (pending.email !== normalized) return false;
    if (pending.code !== entered) return false;
    sessionStorage.setItem(
      `${OTP_KEY}-verified`,
      JSON.stringify({ email: normalized, at: Date.now() })
    );
    sessionStorage.removeItem(OTP_KEY);
    return true;
  } catch {
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
