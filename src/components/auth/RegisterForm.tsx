"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  COLLEGES,
  DEMO_FEES,
  registerNonValidator,
  registerStudent,
  registerValidator,
  registerWorkingProfessional,
} from "@/lib/auth";
import {
  isValidIndianMobile,
  isPhoneVerified,
  sendOtp,
  verifyOtp,
  isValidEmail,
  isEmailVerified,
  sendEmailOtp,
  verifyEmailOtp,
  getOtpCooldownTime,
} from "@/lib/otp";
import { useAuth } from "@/components/AuthProvider";
import {
  AuthShell,
  DemoFee,
  DemoFeeNote,
  FieldLabel,
  HighlightBox,
  SelectInput,
  SubmitButton,
  TextInput,
} from "./AuthShell";
import { Eye, EyeOff, Upload } from "lucide-react";

type PlanId = "student" | "validator" | "normal" | "courseOnly";

const PLAN_OPTIONS: {
  id: PlanId;
  label: string;
  emoji: string;
  price: number;
  desc: string;
}[] = [
    {
      id: "validator",
      label: "Validator Fellowship",
      emoji: "🔐",
      price: DEMO_FEES.validator,
      desc: "Validator portal + 1 fraction + 19 years daily MSTC rewards.",
    },
    {
      id: "student",
      label: "Student Fellowship",
      emoji: "🎓",
      price: DEMO_FEES.student,
      desc: "Student ID scholarship + paid internship + 1 fraction rewards.",
    },
    {
      id: "normal",
      label: "Working Professional Fellowship",
      emoji: "👤",
      price: DEMO_FEES.normal,
      desc: "Paid internship + 1 fraction + industry mentor support.",
    },
    {
      id: "courseOnly",
      label: "Course Only",
      emoji: "📚",
      price: DEMO_FEES.courseOnly,
      desc: "Course only at foundation offer. No fraction. No internship.",
    },
  ];

const VALIDATOR_ID_PLACEHOLDER_URL = "https://example.com/validator-id-card.pdf";

function PlanHighlight({ plan }: { plan: PlanId }) {
  if (plan === "validator") {
    return (
      <HighlightBox>
        <strong>Validator Fellowship:</strong> Dedicated validator portal + stakeholder access +{" "}
        <strong>1 fraction with 19 years daily MSTC rewards</strong>. Internship is not included in validator track.
      </HighlightBox>
    );
  }

  if (plan === "student") {
    return (
      <HighlightBox>
        <strong>Student Fellowship:</strong> Valid student ID unlocks scholarship pricing +{" "}
        <strong>paid internship</strong> + <strong>1 fraction with 19 years daily MSTC rewards</strong>.
      </HighlightBox>
    );
  }

  if (plan === "normal") {
    return (
      <HighlightBox>
        <strong>Working Professional Fellowship:</strong> Lifetime access to the full course +{" "}
        <strong>paid internship</strong> + <strong>1 fraction with 19 years daily MSTC rewards</strong> + industry mentor support.
      </HighlightBox>
    );
  }

  return (
    <HighlightBox>
      <strong>Course Only:</strong> Lifetime access to the course at <strong>₹4,999</strong>. No fraction.
      No internship. Full lifetime course access only.
    </HighlightBox>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const [plan, setPlan] = useState<PlanId>("courseOnly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [college, setCollege] = useState<string>(COLLEGES[0]);
  const [collegeOther, setCollegeOther] = useState("");
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [validatorIdFile, setValidatorIdFile] = useState<File | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState(0);

  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((p) => p.id === plan)!,
    [plan]
  );

  useEffect(() => {
    const raw = searchParams.get("plan");
    if (raw) {
      const normalized = raw.trim() as PlanId;
      if (PLAN_OPTIONS.some((p) => p.id === normalized)) setPlan(normalized);
    }
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCodeInput(ref);
    }
  }, [searchParams]);

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
    setOtpLoading(true);
    const result = await sendEmailOtp(email);
    setOtpLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOtpSent(true);
    setDemoOtp(result.demoCode);
    setEmailVerified(false);
  }

  async function handleVerifyOtp() {
    setError("");
    setVerifyOtpLoading(true);
    const isValid = await verifyEmailOtp(email, otpCode);
    setVerifyOtpLoading(false);
    if (isValid) {
      setEmailVerified(true);
      setDemoOtp("");
    } else {
      setError("Invalid or expired OTP. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!emailVerified && !isEmailVerified(email)) {
      setLoading(false);
      setError("Please verify your email address with OTP first.");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    const referralCode = referralCodeInput.trim() || undefined;

    let result:
      | { ok: true; user: { role: string } }
      | { ok: false; error: string };

    if (plan === "validator") {
      if (!validatorIdFile) {
        setLoading(false);
        setError("Validator ID card upload is required.");
        return;
      }

      result = await registerValidator({
        fullName,
        email,
        phone,
        password,
        idCardFile: validatorIdFile,
        referralCode,
        transactionId: transactionId.trim() || undefined,
      });
    } else if (plan === "student") {
      if (!studentIdFile) {
        setLoading(false);
        setError("Student ID card upload is required.");
        return;
      }
      if (college === "Other" && !collegeOther.trim()) {
        setLoading(false);
        setError("Please enter your college name.");
        return;
      }

      result = await registerStudent({
        fullName,
        email,
        phone,
        password,
        college: college === "Other" ? collegeOther : college,
        idCardFile: studentIdFile,
        referralCode,
        transactionId: transactionId.trim() || undefined,
      });
    } else if (plan === "normal") {
      result = await registerWorkingProfessional({
        fullName,
        email,
        phone,
        password,
        referralCode,
        transactionId: transactionId.trim() || undefined,
      });
    } else {
      result = await registerNonValidator({
        fullName,
        email,
        password,
        phone,
        referralCode,
        transactionId: transactionId.trim() || undefined,
      });
    }

    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    // The account is created on the backend, but registration does not log the
    // user in (no auth token is issued here — only the login flow stores one).
    // Clear the partial session set during registration and send the user to
    // /login with their email prefilled so they sign in for real before hitting
    // any authenticated pages.
    logout();
    router.push(`/login?email=${encodeURIComponent(email)}&registered=1`);
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Choose your track and price — then enroll."
    >
      {/* <div className="mb-5">
        <DemoFeeNote />
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common fields */}
        <div>
          <FieldLabel htmlFor="fullName" required>
            Full Name
          </FieldLabel>
          <TextInput
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

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
              ⏱️ Too many requests. Please wait {otpCooldownSeconds}s before sending another OTP.
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

        <div>
          <FieldLabel htmlFor="phone" required>
            Mobile Number
          </FieldLabel>
          <TextInput
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
          />
        </div>

        {/* Plan toggle */}
        <div>
          <FieldLabel required>I am choosing</FieldLabel>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PLAN_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPlan(p.id);
                  setError("");
                }}
                className={`relative flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center transition-all ${plan === p.id
                  ? "border-mst-red bg-mst-red/5 shadow-md shadow-mst-red/10"
                  : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-muted)]/40"
                  }`}
              >
                <span className="text-xl">{p.emoji}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${plan === p.id ? "text-mst-red" : "text-[var(--text)]"
                    }`}
                >
                  {p.id === "courseOnly" ? "Course Only" : p.label.split(" ")[0]}
                </span>
                <span className="text-[10px] font-semibold leading-tight text-[var(--text-muted)]">
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
                {plan === p.id && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mst-red text-[8px] text-white">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <PlanHighlight plan={plan} />
          </div>
        </div>

        <div className="space-y-4">
          {/* Plan-specific fields */}
          {plan === "student" && (
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="college" required>
                  College
                </FieldLabel>
                <SelectInput
                  id="college"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                >
                  {COLLEGES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </SelectInput>
              </div>

              {college === "Other" && (
                <div>
                  <FieldLabel htmlFor="collegeOther" required>
                    Enter College Name
                  </FieldLabel>
                  <TextInput
                    id="collegeOther"
                    required
                    value={collegeOther}
                    onChange={(e) => setCollegeOther(e.target.value)}
                    placeholder="Your college name"
                  />
                </div>
              )}

              <div>
                <FieldLabel htmlFor="studentId" required>
                  Student ID Card Upload
                </FieldLabel>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="studentId"
                    className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--border)] transition-all shrink-0 shadow-sm"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-[var(--text-muted)] truncate">
                    {studentIdFile ? studentIdFile.name : "No file chosen"}
                  </span>
                  <input
                    id="studentId"
                    type="file"
                    accept="image/*,.pdf"
                    required
                    className="hidden"
                    onChange={(e) =>
                      setStudentIdFile(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {plan === "validator" && (
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="validatorId" required>
                  Validator ID Card Upload
                </FieldLabel>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="validatorId"
                    className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--border)] transition-all shrink-0 shadow-sm"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-[var(--text-muted)] truncate">
                    {validatorIdFile ? validatorIdFile.name : "No file chosen"}
                  </span>
                  <input
                    id="validatorId"
                    type="file"
                    accept="image/*,.pdf"
                    required
                    className="hidden"
                    onChange={(e) =>
                      setValidatorIdFile(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>

              <p className="text-sm text-[var(--text-muted)]">
                Don&apos;t have a Validator ID Card?{" "}
                <a
                  href={VALIDATOR_ID_PLACEHOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-mst-red hover:underline"
                >
                  Download Validator ID Card
                </a>
              </p>
            </div>
          )}

          {/* Fee display */}
          <DemoFee amount={selectedPlan.price} />
        </div>

        {/* Pay Now & QR Code */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-5">
          <FieldLabel required>Pay Now</FieldLabel>
          <div className="flex flex-col items-center gap-4 text-center">

            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-3 shadow-md transition-transform hover:scale-[1.02]">
              <img
                src="./MasterstrokePaymentQRCode.jpg"
                alt="Payment QR Code"
                className="h-[180px] w-[180px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div>
          <FieldLabel htmlFor="referralCode">Referral Code</FieldLabel>
          <TextInput
            id="referralCode"
            value={referralCodeInput}
            onChange={(e) => setReferralCodeInput(e.target.value)}
            placeholder="Enter referral code (optional)"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Leave this empty if you do not have a referral code.
          </p>
        </div>

        {/* Password */}
        <div>
          <FieldLabel htmlFor="password" required>
            Password
          </FieldLabel>
          <div className="relative">
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
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
            Confirm Password
          </FieldLabel>
          <div className="relative">
            <TextInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
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

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <SubmitButton disabled={loading}>
          {loading ? "Creating account..." : "Complete Registration"}
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-mst-red hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

