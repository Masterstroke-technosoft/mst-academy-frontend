"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import {
  COLLEGES,
  DEMO_FEES,
  registerNonValidator,
  registerStudent,
  registerValidator,
  registerWorkingProfessional,
  login,
  setSession,
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
import { useCurrencyRate } from "@/hooks/useCurrencyRate";
import { convertINRtoUSD } from "@/lib/currency";
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
import { Eye, EyeOff, Upload, AlertCircle, Clock, CheckCircle2, X } from "lucide-react";

type PlanId = "student" | "validator" | "normal" | "courseOnly";

const PLAN_OPTIONS: {
  id: PlanId;
  label: string;
  emoji: string;
  price: number;
  desc: string;
}[] = [
    {
      id: "courseOnly",
      label: "OJT",
      emoji: "📚",
      price: DEMO_FEES.courseOnly,
      desc: "On Job Training (OJT) program with structured learning and practical experience.",
    },
    {
      id: "validator",
      label: "Validator Fellowship",
      emoji: "🔐",
      price: DEMO_FEES.validator,
      desc: "Validator portal + 19 years daily MSTC rewards.",
    },
    {
      id: "student",
      label: "Student Fellowship",
      emoji: "🎓",
      price: DEMO_FEES.student,
      desc: "Student ID scholarship + paid internship",
    },
    {
      id: "normal",
      label: "Web3 Enthusiast Fellowship",
      emoji: "👤",
      price: DEMO_FEES.normal,
      desc: "Paid internship + industry mentor support.",
    },
  ];

const VALIDATOR_ID_PLACEHOLDER_URL = "https://example.com/validator-id-card.pdf";

function PlanHighlight({ plan }: { plan: PlanId }) {
  if (plan === "validator") {
    return (
      <HighlightBox>
        <strong>Validator Fellowship:</strong> Dedicated validator portal + stakeholder access
      </HighlightBox>
    );
  }

  if (plan === "student") {
    return (
      <HighlightBox>
        <strong>Student Fellowship:</strong> Valid student ID unlocks scholarship pricing
      </HighlightBox>
    );
  }

  if (plan === "normal") {
    return (
      <HighlightBox>
        <strong>Web3 Enthusiast Fellowship:</strong> Lifetime access to the full course +{" "}
        <strong>paid internship</strong> + industry mentor support.
      </HighlightBox>
    );
  }

  return (
    <HighlightBox>
      <strong>OJT:</strong> On Job Training (OJT) program with structured learning and practical experience.
    </HighlightBox>
  );
}

const isPasswordValid = (p: string) => {
  return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);
};


export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { rate: usdRate } = useCurrencyRate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [plan, setPlan] = useState<PlanId>("courseOnly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [college, setCollege] = useState<string>("");
  const [collegeOther, setCollegeOther] = useState("");
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [validatorIdFile, setValidatorIdFile] = useState<File | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [gstNumber, setGstNumber] = useState("");
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
  const [otpError, setOtpError] = useState("");

  // Step 2: optional payment, shown only after registration succeeds or when navigating with step=payment.
  const initialStep = searchParams.get("step") === "payment" ? "payment" : "form";
  const [step, setStep] = useState<"form" | "payment">(initialStep);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(null);

  const [allocationStatus, setAllocationStatus] = useState<any>(null);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [isSubmittingAllocation, setIsSubmittingAllocation] = useState(false);
  const [screenshotFileName, setScreenshotFileName] = useState("");
  const [allocationErrors, setAllocationErrors] = useState<Record<string, string>>({});
  const [allocationToast, setAllocationToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [allocationForm, setAllocationForm] = useState({
    accountHolderName: "",
    category: "",
    amountPaid: "",
    paymentDate: "",
    transactionId: "",
    paymentMethod: "UPI",
    paymentScreenshotUrl: "",
    additionalNotes: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setAllocationToast({ message, type });
    setTimeout(() => setAllocationToast(null), 4000);
  };

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((p) => p.id === plan)!,
    [plan]
  );

  const categoryByPlan: Record<PlanId, string> = {
    student: "STUDENT",
    validator: "VALIDATOR",
    normal: "WORKING_PROFESSIONAL",
    courseOnly: "NON_VALIDATOR",
  };

  const checkAllocationStatus = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") || localStorage.getItem("token") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let currentUserId = user?.id || (user as any)?._id;
      if (!currentUserId) {
        const meRes = await fetch(`${baseURL}/api/me`, { credentials: "include", headers });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user) {
            currentUserId = meData.user.id || meData.user._id;
            if (meData.user.fullName && !fullName) {
              setFullName(meData.user.fullName);
            }
            if (meData.user.role) {
              const r = meData.user.role.toLowerCase();
              if (r === "validator") setPlan("validator");
              else if (r === "student") setPlan("student");
              else if (r === "working-professional" || r === "working_professional") setPlan("normal");
              else setPlan("courseOnly");
            }
            if (typeof meData.user.discountPercentage === "number") {
              setDiscountPercentage(meData.user.discountPercentage);
            }
          }
        }
      }

      if (currentUserId) {
        const res = await fetch(`${baseURL}/api/node-purchase/me?id=${currentUserId}`, {
          credentials: "include",
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          let list: any[] = [];
          if (Array.isArray(data)) list = data;
          else if (data?.purchase) list = [data.purchase];
          else if (data?.data) list = Array.isArray(data.data) ? data.data : [data.data];
          else if (data?.purchases) list = Array.isArray(data.purchases) ? data.purchases : [];
          else if (data?.status) list = [data];

          if (list.length > 0) {
            const sorted = [...list].sort((a, b) => {
              const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
              const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
              return tb - ta;
            });
            const latest = sorted[0];
            setAllocationStatus({
              id: latest._id || latest.id,
              status: latest.status,
              rejectionNote: latest.rejectionNote,
              accountHolderName: latest.accountHolderName,
              category: latest.category,
              amountPaid: latest.amountPaid,
              paymentDate: latest.paymentDate,
              transactionId: latest.transactionId,
              paymentMethod: latest.paymentMethod,
              additionalNotes: latest.additionalNotes,
              paymentScreenshotUrl: latest.paymentScreenshotUrl,
              address: latest.address,
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to check allocation status:", err);
    }
  };

  useEffect(() => {
    if (step === "payment") {
      checkAllocationStatus();
    }
  }, [step, user, baseURL]);

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
    setOtpError("");
    if (!isValidEmail(email)) {
      setOtpError("Please enter a valid email address.");
      return;
    }
    setOtpLoading(true);
    const result = await sendEmailOtp(email);
    setOtpLoading(false);
    if (!result.ok) {
      setOtpError(result.error);
      return;
    }
    setOtpSent(true);
    setDemoOtp(result.demoCode);
    setEmailVerified(false);
  }

  async function handleVerifyOtp() {
    setError("");
    setOtpError("");
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setVerifyOtpLoading(true);
    const result = await verifyEmailOtp(email, otpCode);
    setVerifyOtpLoading(false);
    if (result.ok) {
      setEmailVerified(true);
      setDemoOtp("");
      setOtpError("");
    } else {
      setOtpError(result.error || "Invalid or expired OTP. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (/\d/.test(fullName)) {
      setLoading(false);
      setError("Full name must not contain numbers.");
      return;
    }

    if (!isValidEmail(email)) {
      setLoading(false);
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setLoading(false);
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!emailVerified && !isEmailVerified(email)) {
      setLoading(false);
      const msg = "Please verify your email address with OTP first.";
      setError(msg);
      setOtpError(msg);
      document.getElementById("email")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!isPasswordValid(password)) {
      setLoading(false);
      setError("Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    let recaptchaToken: string | null | undefined;
    try {
      recaptchaToken = await recaptchaRef.current?.executeAsync();
      if (!recaptchaToken) {
        setLoading(false);
        setError("reCAPTCHA verification failed. Please try again.");
        return;
      }
    } catch (err) {
      setLoading(false);
      setError("reCAPTCHA verification failed. Please try again.");
      console.error("reCAPTCHA error:", err);
      return;
    }

    const referralCode = referralCodeInput.trim() || undefined;
    const gst = gstNumber.trim() || undefined;

    let result:
      | { ok: true; user: { id: string; role: string; discountPercentage?: number } }
      | { ok: false; error: string };

    if (plan === "validator") {
      result = await registerValidator({
        fullName,
        email,
        phone,
        password,
        idCardFile: validatorIdFile || undefined,
        referralCode,
        transactionId: transactionId.trim() || undefined,
        gstNumber: gst,
        recaptchaToken: recaptchaToken || undefined,
      });
    } else if (plan === "student") {
      if (!studentIdFile) {
        setLoading(false);
        setError("Student ID card upload is required.");
        document.getElementById("studentId")?.parentElement?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!college) {
        setLoading(false);
        setError("Please select your college.");
        document.getElementById("college")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (college === "Other" && !collegeOther.trim()) {
        setLoading(false);
        setError("Please enter your college name.");
        document.getElementById("collegeOther")?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        gstNumber: gst,
        recaptchaToken: recaptchaToken || undefined,
      });
    } else if (plan === "normal") {
      result = await registerWorkingProfessional({
        fullName,
        email,
        phone,
        password,
        referralCode,
        transactionId: transactionId.trim() || undefined,
        gstNumber: gst,
        recaptchaToken: recaptchaToken || undefined,
      });
    } else {
      result = await registerNonValidator({
        fullName,
        email,
        password,
        phone,
        referralCode,
        transactionId: transactionId.trim() || undefined,
        gstNumber: gst,
        recaptchaToken: recaptchaToken || undefined,
      });
    }

    setLoading(false);
    recaptchaRef.current?.reset();

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (result.user && typeof result.user.discountPercentage === "number") {
      setDiscountPercentage(result.user.discountPercentage);
    }

    // Account is created; move to the optional payment step
    setStep("payment");
  }

  // Sends the user to /login once registration (and optionally payment) is done.
  function finishRegistration(paymentStatus?: "submitted") {
    logout();
    if (typeof window !== "undefined") {
      localStorage.setItem("justRegisteredCompleted", "true");
    }
    const params = new URLSearchParams({ email, registered: "1" });
    if (paymentStatus) params.set("payment", paymentStatus);
    router.push(`/login?${params.toString()}`);
  }

  const compressImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Your file size is more than 5MB. Please upload a proper file up to 5MB.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
          const compressedBase64 = await compressImage(rawBase64);
          setAllocationForm((prev) => ({ ...prev, paymentScreenshotUrl: compressedBase64 }));
          setScreenshotFileName(file.name);
        } catch (err) {
          console.error("Compression failed, using raw base64:", err);
          setAllocationForm((prev) => ({ ...prev, paymentScreenshotUrl: rawBase64 }));
          setScreenshotFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAllocationModal = () => {
    const discountPercent = discountPercentage !== null ? discountPercentage : 0;
    const base = selectedPlan.price;
    const discountAmount = (base * discountPercent) / 100;
    const discountedBase = base - discountAmount;
    const total = Math.round(discountedBase * 1.18 * 100) / 100;

    if (allocationStatus?.status === "REJECTED") {
      setAllocationForm({
        accountHolderName: allocationStatus.accountHolderName || fullName || user?.fullName || "",
        category: allocationStatus.category || categoryByPlan[plan] || "NON_VALIDATOR",
        amountPaid: allocationStatus.amountPaid != null ? String(allocationStatus.amountPaid) : String(total),
        paymentDate: allocationStatus.paymentDate ? allocationStatus.paymentDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        transactionId: allocationStatus.transactionId || "",
        paymentMethod: allocationStatus.paymentMethod || "UPI",
        paymentScreenshotUrl: allocationStatus.paymentScreenshotUrl || "",
        additionalNotes: allocationStatus.additionalNotes || "",
        addressLine1: allocationStatus.address?.addressLine1 || "",
        addressLine2: allocationStatus.address?.addressLine2 || "",
        city: allocationStatus.address?.city || "",
        district: allocationStatus.address?.district || "",
        state: allocationStatus.address?.state || "",
        pincode: allocationStatus.address?.pincode || "",
        country: allocationStatus.address?.country || "India",
      });
      setScreenshotFileName(allocationStatus.paymentScreenshotUrl ? "Existing screenshot on file" : "");
    } else {
      setAllocationForm((prev) => ({
        ...prev,
        accountHolderName: prev.accountHolderName || fullName || user?.fullName || "",
        category: prev.category || categoryByPlan[plan] || "NON_VALIDATOR",
        amountPaid: prev.amountPaid || String(total),
        paymentDate: prev.paymentDate || new Date().toISOString().slice(0, 10),
        country: prev.country || "India",
      }));
    }
    setAllocationErrors({});
    setIsAllocationModalOpen(true);
  };

  const handleAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!allocationForm.accountHolderName.trim()) errors.accountHolderName = "Account holder name is required";
    if (!allocationForm.category) errors.category = "Category is required";
    if (!allocationForm.amountPaid || isNaN(Number(allocationForm.amountPaid)) || Number(allocationForm.amountPaid) <= 0) {
      errors.amountPaid = "Amount paid is required and must be greater than 0";
    }
    if (!allocationForm.paymentDate) errors.paymentDate = "Payment date is required";
    if (!allocationForm.transactionId.trim()) errors.transactionId = "Transaction ID is required";
    if (!allocationForm.paymentMethod) errors.paymentMethod = "Payment method is required";
    if (!allocationForm.paymentScreenshotUrl.trim() && !(allocationStatus?.status === "REJECTED" && allocationStatus.paymentScreenshotUrl)) {
      errors.paymentScreenshotUrl = "Payment screenshot is required";
    }
    if (!allocationForm.addressLine1.trim()) errors.addressLine1 = "Address line 1 is required";
    if (!allocationForm.city.trim()) errors.city = "City is required";
    if (!allocationForm.district.trim()) errors.district = "District is required";
    if (!allocationForm.state.trim()) errors.state = "State is required";
    if (!allocationForm.pincode.trim()) errors.pincode = "Pincode is required";
    if (!allocationForm.country.trim()) errors.country = "Country is required";

    if (Object.keys(errors).length > 0) {
      setAllocationErrors(errors);
      return;
    }

    setAllocationErrors({});
    setIsSubmittingAllocation(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") || localStorage.getItem("token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        accountHolderName: allocationForm.accountHolderName,
        category: allocationForm.category,
        amountPaid: Number(allocationForm.amountPaid),
        paymentDate: new Date(allocationForm.paymentDate).toISOString(),
        transactionId: allocationForm.transactionId,
        paymentMethod: allocationForm.paymentMethod,
        paymentScreenshotUrl: allocationForm.paymentScreenshotUrl || allocationStatus?.paymentScreenshotUrl,
        additionalNotes: allocationForm.additionalNotes.trim() || undefined,
        addressLine1: allocationForm.addressLine1,
        addressLine2: allocationForm.addressLine2,
        city: allocationForm.city,
        district: allocationForm.district,
        state: allocationForm.state,
        pincode: allocationForm.pincode,
        country: allocationForm.country,
      };

      let res;
      if (allocationStatus?.status === "REJECTED" && allocationStatus.id) {
        res = await fetch(`${baseURL}/api/node-purchase/${allocationStatus.id}/resubmit`, {
          method: "PATCH",
          credentials: "include",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${baseURL}/api/node-purchase`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showToast("Payment request submitted successfully!", "success");
        setIsAllocationModalOpen(false);
        setAllocationStatus({
          status: "PENDING",
          ...payload,
        });
        checkAllocationStatus();
      } else {
        let errMsg = "Failed to submit payment request";
        try {
          const errData = await res.json();
          errMsg = errData.message || errData.error || errMsg;
        } catch { }
        showToast(errMsg, "error");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      showToast(err?.message || "Failed to submit payment request", "error");
    } finally {
      setIsSubmittingAllocation(false);
    }
  };

  if (step === "payment") {
    const discountPercent = discountPercentage !== null ? discountPercentage : 0;
    const base = selectedPlan.price;
    const discountAmount = (base * discountPercent) / 100;
    const discountedBase = base - discountAmount;
    const gst = discountedBase * 0.18;
    const total = discountedBase * 1.18;
    const isPending = allocationStatus?.status === "PENDING";
    const isRejected = allocationStatus?.status === "REJECTED";

    return (
      <AuthShell
        title="Complete Payment"
        subtitle="Optional - activate your plan now, or do it later from your dashboard."
        maxWidth="max-w-2xl"
      >
        {isPending ? (
          <div className="mb-5 rounded-2xl border p-4 text-xs font-semibold shadow-sm" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
            <div className="flex items-center gap-2" style={{ color: '#e31e24' }}>
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-bold text-sm">Payment Verification Pending</span>
            </div>
            <p className="mt-1.5 leading-relaxed text-xs font-normal" style={{ color: '#e31e24' }}>
              We&apos;re verifying your payment in between working hours. Your curriculum will unlock once it&apos;s approved. Please ignore if already paid.
            </p>
          </div>
        ) : isRejected ? (
          <div className="mb-5 rounded-2xl border p-4 text-xs font-semibold shadow-sm" style={{ backgroundColor: '#fff5f5', borderColor: '#f5c6cb' }}>
            <div className="flex items-center gap-2" style={{ color: '#e31e24' }}>
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-bold text-sm">Payment Rejected</span>
            </div>
            <p className="mt-1.5 leading-relaxed text-xs font-normal" style={{ color: '#e31e24' }}>
              {allocationStatus.rejectionNote
                ? `Reason: ${allocationStatus.rejectionNote}. Please resubmit with correct details.`
                : "Your payment could not be verified. Please resubmit with correct details."}
            </p>
          </div>
        ) : (
          <div className="mb-5 rounded-xl bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-700 dark:text-green-400">
            Account created! Complete your payment below to activate {selectedPlan.label}, or skip and pay later.
          </div>
        )}

        <div className="space-y-4">
          <DemoFee amount={base} discountedAmount={discountedBase} discountPercent={discountPercent} />

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-5">
            <FieldLabel>Scan to Pay</FieldLabel>
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 text-left">
              <div className="flex flex-col items-center justify-center gap-2 text-center shrink-0 w-full md:max-w-[200px]">
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-3 shadow-md transition-transform hover:scale-[1.02]">
                  <img
                    src="./MasterstrokePaymentQRCode.jpg"
                    alt="Payment QR Code"
                    className="h-[140px] w-[140px] object-contain"
                  />
                </div>
              </div>

              <div className="w-full md:w-auto min-w-[240px] flex-grow rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-mst-red mb-3">
                    Plan: {selectedPlan.label}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[var(--border)] pb-1.5">
                      <span className="text-[var(--text-muted)]">Role Amount:</span>
                      <span className="font-bold text-[var(--text)]">₹{base.toLocaleString('en-IN')}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between border-b border-[var(--border)] pb-1.5 text-green-600">
                        <span>Discount ({discountPercent}%):</span>
                        <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-[var(--border)] pb-1.5">
                      <span className="text-[var(--text-muted)]">18% GST:</span>
                      <span className="font-bold text-[var(--text)]">₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-baseline pt-3 mt-4 border-t border-[var(--border)]">
                  <span className="font-black text-xs text-[var(--text)]">Total (Incl. GST):</span>
                  <span className="font-black text-mst-red text-base whitespace-nowrap">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => finishRegistration()}
              className="w-full rounded-xl bg-gradient-to-r from-mst-red to-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 transition hover:shadow-mst-red/40 hover:brightness-110 active:scale-[0.99]"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => finishRegistration()}
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] py-3.5 text-sm font-semibold text-[var(--text)] transition hover:border-mst-red"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Course Allocation Modal */}
        {isAllocationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 shrink-0">
                <div>
                  <h3 className="text-lg font-black text-[var(--text)]">
                    {allocationStatus?.status === "REJECTED" ? "Resubmit Payment Details" : "Course Allocation Form"}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Submit your payment details and screenshot for verification.
                  </p>
                </div>
                <button
                  onClick={() => setIsAllocationModalOpen(false)}
                  className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAllocationSubmit} className="space-y-3.5 py-4 flex-1">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Account Holder Name <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={allocationForm.accountHolderName}
                      onChange={(e) => setAllocationForm({ ...allocationForm, accountHolderName: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.accountHolderName ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                      placeholder="e.g. John Doe"
                    />
                    {allocationErrors.accountHolderName && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.accountHolderName}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Category <span className="text-mst-red">*</span>
                    </label>
                    <select
                      value={allocationForm.category}
                      onChange={(e) => setAllocationForm({ ...allocationForm, category: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.category ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    >
                      <option value="">Select Category</option>
                      <option value="STUDENT">Student Fellowship</option>
                      <option value="VALIDATOR">Validator Fellowship</option>
                      <option value="WORKING_PROFESSIONAL">Web3 Enthusiast</option>
                      <option value="NON_VALIDATOR">OJT (Course Only)</option>
                    </select>
                    {allocationErrors.category && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.category}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3.5">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Amount Paid (INR) <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="number"
                      value={allocationForm.amountPaid}
                      onChange={(e) => setAllocationForm({ ...allocationForm, amountPaid: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.amountPaid ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                      placeholder="5898.82"
                    />
                    {allocationErrors.amountPaid && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.amountPaid}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Payment Date <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="date"
                      value={allocationForm.paymentDate}
                      onChange={(e) => setAllocationForm({ ...allocationForm, paymentDate: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.paymentDate ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    />
                    {allocationErrors.paymentDate && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.paymentDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Payment Method <span className="text-mst-red">*</span>
                    </label>
                    <select
                      value={allocationForm.paymentMethod}
                      onChange={(e) => setAllocationForm({ ...allocationForm, paymentMethod: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.paymentMethod ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    >
                      <option value="UPI">UPI / QR Code</option>
                      <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                      <option value="CARD">Debit / Credit Card</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {allocationErrors.paymentMethod && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.paymentMethod}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Transaction ID / UTR / Reference No <span className="text-mst-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={allocationForm.transactionId}
                    onChange={(e) => setAllocationForm({ ...allocationForm, transactionId: e.target.value })}
                    className={`w-full rounded-lg border ${allocationErrors.transactionId ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    placeholder="e.g. 123456789012"
                  />
                  {allocationErrors.transactionId && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.transactionId}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Address Line 1 <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={allocationForm.addressLine1}
                      onChange={(e) => setAllocationForm({ ...allocationForm, addressLine1: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.addressLine1 ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                      placeholder="Street address, house no."
                    />
                    {allocationErrors.addressLine1 && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.addressLine1}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={allocationForm.addressLine2}
                      onChange={(e) => setAllocationForm({ ...allocationForm, addressLine2: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all"
                      placeholder="Apartment, suite, landmark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3.5">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      City <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={allocationForm.city}
                      onChange={(e) => setAllocationForm({ ...allocationForm, city: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.city ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                      placeholder="City"
                    />
                    {allocationErrors.city && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      District <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={allocationForm.district}
                      onChange={(e) => setAllocationForm({ ...allocationForm, district: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.district ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                      placeholder="District"
                    />
                    {allocationErrors.district && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      State <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={allocationForm.state}
                      onChange={(e) => setAllocationForm({ ...allocationForm, state: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.state ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                      placeholder="State"
                    />
                    {allocationErrors.state && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Pincode <span className="text-mst-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={allocationForm.pincode}
                      onChange={(e) => setAllocationForm({ ...allocationForm, pincode: e.target.value })}
                      className={`w-full rounded-lg border ${allocationErrors.pincode ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                      placeholder="400001"
                    />
                    {allocationErrors.pincode && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.pincode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                    Country <span className="text-mst-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={allocationForm.country}
                    onChange={(e) => setAllocationForm({ ...allocationForm, country: e.target.value })}
                    className={`w-full rounded-lg border ${allocationErrors.country ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all`}
                    placeholder="India"
                  />
                  {allocationErrors.country && (
                    <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.country}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Upload payment screenshot (Max 5MB){" "}
                      {allocationStatus?.status === "REJECTED" && allocationStatus.paymentScreenshotUrl ? null : (
                        <span className="text-mst-red">*</span>
                      )}
                    </label>
                    <div className={`flex items-center gap-3 w-full rounded-lg border ${allocationErrors.paymentScreenshotUrl ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--bg-muted)] px-3 py-1.5`}>
                      <label
                        htmlFor="regScreenshotUploadInput"
                        className="cursor-pointer rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[10px] font-bold text-[var(--text)] hover:bg-[var(--border)] transition-all shrink-0 shadow-sm"
                      >
                        Choose File
                      </label>
                      <span className="text-[10px] text-[var(--text-muted)] truncate">
                        {screenshotFileName ? screenshotFileName : "No file chosen"}
                      </span>
                      <input
                        id="regScreenshotUploadInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleScreenshotUpload}
                      />
                    </div>
                    {allocationStatus?.status === "REJECTED" && allocationStatus.paymentScreenshotUrl && !allocationErrors.paymentScreenshotUrl && (
                      <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">Leave empty to keep your previous screenshot.</p>
                    )}
                    {allocationErrors.paymentScreenshotUrl && (
                      <p className="mt-0.5 text-[10px] text-red-500">{allocationErrors.paymentScreenshotUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[var(--text)]">
                      Additional Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={allocationForm.additionalNotes}
                      onChange={(e) => setAllocationForm({ ...allocationForm, additionalNotes: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text)] focus:border-mst-red focus:outline-none transition-all"
                      placeholder="Payment completed successfully"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAllocationModalOpen(false)}
                    className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAllocation}
                    className="rounded-xl bg-mst-red hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAllocation
                      ? (allocationStatus?.status === "REJECTED" ? 'Resubmitting...' : 'Submitting...')
                      : (allocationStatus?.status === "REJECTED" ? 'Resubmit Payment' : 'Request Allocation')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {allocationToast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${allocationToast.type === "success"
            ? "border-green-500/30 bg-emerald-950/95 text-emerald-400"
            : "border-red-500/30 bg-red-950/95 text-red-400"
            }`}>
            {allocationToast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
            <span className="text-sm font-extrabold">{allocationToast.message}</span>
          </div>
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle={
        <p className="mt-0.5 text-s text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-mst-red hover:underline">
            Sign in
          </Link>
        </p>
      }
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
            className={/\d/.test(fullName) ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
          {/\d/.test(fullName) && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              Full name must not contain numbers.
            </p>
          )}
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
                setOtpError("");
                setError("");
              }}
              placeholder="you@example.com"
              className={`flex-1 ${(email.length > 0 && !isValidEmail(email)) || (otpError && !otpSent) ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              disabled={emailVerified}
            />
            {!emailVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !isValidEmail(email) || otpCooldownSeconds > 0}
                className="shrink-0 rounded-xl bg-[var(--bg-muted)] px-4 py-3 text-xs font-bold text-[var(--text)] transition hover:bg-mst-red/10 hover:text-mst-red disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {otpLoading ? "Sending" : otpCooldownSeconds > 0 ? `${otpCooldownSeconds}s` : otpSent ? "Resend" : "Send OTP"}
              </button>
            )}
          </div>
          {email.length > 0 && !isValidEmail(email) && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              Please enter a valid email address.
            </p>
          )}
          {otpError && !otpSent && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              {otpError}
            </p>
          )}
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
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError("");
                }}
                placeholder="6-digit code"
                className={`flex-1 tracking-[0.3em] ${otpError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyOtpLoading || !otpCode}
                className="shrink-0 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-3 text-xs font-bold text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {verifyOtpLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
            {otpError && (
              <p className="mt-2 text-xs text-red-500 font-medium">
                {otpError}
              </p>
            )}
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
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile number"
            className={phone.length > 0 && !/^\d{10}$/.test(phone) ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          />
          {phone.length > 0 && !/^\d{10}$/.test(phone) && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              Mobile number must be exactly 10 digits.
            </p>
          )}
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
                  {p.id === "courseOnly" ? "OJT" : p.label.split(" ")[0]}
                </span>
                <span className="text-[10px] font-semibold leading-tight text-[var(--text-muted)]">
                  {usdRate ? `₹${p.price.toLocaleString("en-IN")} / $${convertINRtoUSD(p.price, usdRate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `₹${p.price.toLocaleString("en-IN")}`}
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
                  <option value="" disabled>--Please select your college--</option>
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
                  Student ID Card Upload (Max 5MB)
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
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        alert("Your file size is more than 5MB. Please upload a proper file up to 5MB.");
                        e.target.value = "";
                        setStudentIdFile(null);
                      } else {
                        setStudentIdFile(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* {plan === "validator" && (
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="validatorId" required>
                  Validator ID Card Upload (Max 5MB)
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
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        alert("Your file size is more than 5MB. Please upload a proper file up to 5MB.");
                        e.target.value = "";
                        setValidatorIdFile(null);
                      } else {
                        setValidatorIdFile(file);
                      }
                    }}
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
          )} */}

          {/* Fee display */}
          <DemoFee amount={selectedPlan.price} />
        </div>

        {/* GSTIN */}
        <div>
          <FieldLabel htmlFor="gstNumber">GSTIN (if required)</FieldLabel>
          <TextInput
            id="gstNumber"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            placeholder="Enter GSTIN (optional)"
          />
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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pr-10 ${password.length > 0 && !isPasswordValid(password) ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password.length > 0 && !isPasswordValid(password) && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              Password must be at least 8 characters, and contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.
            </p>
          )}
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

        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          size="invisible"
        />

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

