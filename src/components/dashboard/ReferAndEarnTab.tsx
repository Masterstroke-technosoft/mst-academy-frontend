


"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, Wallet, CheckCircle2, Sparkles, Percent, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { roleLabel, type CourseDiscount, type UserRole } from "@/lib/auth";

const DISCOUNT_ROLES: UserRole[] = ["student", "validator", "working_professional", "course_only"];

function GlassCard({
  children,
  className = "",
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:bg-[var(--surface)]/80 hover:shadow-2xl ${className}`}
      style={glow ? { boxShadow: `0 8px 32px ${glow}` } : undefined}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}


export function ReferAndEarnTab({
  referralCode: propReferralCode,
  referralLink: propReferralLink,
  referralRecords: propReferralRecords,
  successfulReferrals: propSuccessfulReferrals,
  withdrawUnlocked: propWithdrawUnlocked,
  initialBankDetails,
}: {
  referralCode: string;
  referralLink: string;
  referralRecords: readonly { name: string; joinedAt: string; status: string; eligible: boolean }[];
  successfulReferrals: number;
  withdrawUnlocked: boolean;
  initialBankDetails?: any;
}) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [withdrawRequested, setWithdrawRequested] = useState(false);
  const [requestStatus, setRequestStatus] = useState("Pending");
  const [error, setError] = useState<string | null>(null);
  const [holderNameError, setHolderNameError] = useState<string | null>(null);
  const [accountNumError, setAccountNumError] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    upiId: "",
  });

  const [dynamicReferralCode, setDynamicReferralCode] = useState(propReferralCode);
  const [dynamicReferrals, setDynamicReferrals] = useState<any[]>([]);
  const [dynamicReferralPercent, setDynamicReferralPercent] = useState<number>(0);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);

  const [courseDiscounts, setCourseDiscounts] = useState<CourseDiscount[]>([]);
  const [selfDiscountRole, setSelfDiscountRole] = useState<UserRole>("student");
  const [selfDiscountInput, setSelfDiscountInput] = useState<string>("0");
  const [isUpdatingDiscount, setIsUpdatingDiscount] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateSelfDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    const discountVal = parseInt(selfDiscountInput, 10);
    const maxDiscount = courseDiscounts.find(cd => cd.role === selfDiscountRole.toUpperCase())?.discount || 0;
    if (isNaN(discountVal) || discountVal < 0 || discountVal > maxDiscount) {
      showToast(`Please enter a valid discount percentage between 0 and ${maxDiscount}.`, "error");
      return;
    }

    try {
      setIsUpdatingDiscount(true);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/me/self-discount`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selfDiscountRole, selfDiscount: discountVal }),
      });

      const data = await response.json();
      if (response.ok) {
        setCourseDiscounts(prev => {
          const withoutRole = prev.filter(cd => cd.role !== selfDiscountRole);
          const existing = prev.find(cd => cd.role === selfDiscountRole);
          return [...withoutRole, { role: selfDiscountRole, discount: existing?.discount || 0, selfDiscount: discountVal }];
        });
        showToast(data.message || "Self discount updated successfully", "success");
      } else {
        showToast(data.message || "Failed to update self discount", "error");
      }
    } catch (err: any) {
      console.error("Error updating self discount:", err);
      showToast("Error updating self discount: " + (err.message || String(err)), "error");
    } finally {
      setIsUpdatingDiscount(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const response = await fetch(`${baseURL}/api/me`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            if (data.user.referralCode) {
              setDynamicReferralCode(data.user.referralCode);
            }
            if (data.user.referrals) {
              setDynamicReferrals(data.user.referrals);
            }
            if (typeof data.user.referralPercentage === 'number') {
              setDynamicReferralPercent(data.user.referralPercentage);
            }
            const fetchedDiscounts: CourseDiscount[] = Array.isArray(data.user.courseDiscounts)
              ? data.user.courseDiscounts
              : (Array.isArray(user?.courseDiscounts) ? user.courseDiscounts : []);
            setCourseDiscounts(fetchedDiscounts);
            const currentEntry = fetchedDiscounts.find(cd => cd.role === selfDiscountRole);
            setSelfDiscountInput(String(currentEntry?.selfDiscount || 0));
          }
        }
      } catch (error) {
        console.error("Error fetching user profile in ReferAndEarnTab:", error);
      }
    };

    const fetchCourseDetails = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const courseId = "6a2934912b48a13769669f8e";
        const response = await fetch(`${baseURL}/api/courses/${courseId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        });
        if (response.ok) {
          const data = await response.json();
          const courseData = data?.course || data?.data || data;
          if (courseData?.pricingPlans) {
            setPricingPlans(courseData.pricingPlans);
          }
        }
      } catch (error) {
        console.error("Error fetching course details in ReferAndEarnTab:", error);
      }
    };

    fetchProfile();
    fetchCourseDetails();
  }, []);

  useEffect(() => {
    if (user?.role && DISCOUNT_ROLES.includes(user.role as UserRole)) {
      setSelfDiscountRole(user.role as UserRole);
    }
  }, [user?.role]);

  const handleSelfDiscountRoleChange = (role: UserRole) => {
    setSelfDiscountRole(role);
    const existing = courseDiscounts.find(cd => cd.role === role);
    setSelfDiscountInput(String(existing?.selfDiscount || 0));
  };
  const adminDiscountForSelectedRole = courseDiscounts.find(cd => cd.role === selfDiscountRole.toUpperCase())?.discount || 0;
  //console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS", selfDiscountRole)

  const getCoursePrice = (role: string): number => {
    const normalizedRole = String(role || "").toLowerCase().trim();

    if (pricingPlans && pricingPlans.length > 0) {
      const matchedPlan = pricingPlans.find(plan => {
        const planRole = String(plan.role || "").toLowerCase().trim();
        if (planRole === normalizedRole) return true;
        if (normalizedRole === "student" && planRole === "student") return true;
        if (normalizedRole === "validator" && planRole === "validator") return true;
        if ((normalizedRole === "course_only" || normalizedRole === "course-only" || normalizedRole === "courseonly" || normalizedRole === "ojt") &&
            (planRole === "course_only" || planRole === "course-only" || planRole === "courseonly" || planRole === "ojt")) return true;
        if ((normalizedRole === "working_professional" || normalizedRole === "working-professional" || normalizedRole === "workingprofessional" || normalizedRole === "web3 enthusiast" || normalizedRole === "web3_enthusiast") &&
            (planRole === "working_professional" || planRole === "working-professional" || planRole === "workingprofessional" || planRole === "web3 enthusiast" || planRole === "web3_enthusiast")) return true;
        return false;
      });

      if (matchedPlan && matchedPlan.price !== undefined && matchedPlan.price !== null) {
        const numPrice = typeof matchedPlan.price === "number" ? matchedPlan.price : parseInt(String(matchedPlan.price).replace(/[^0-9]/g, ""), 10);
        if (!isNaN(numPrice)) {
          return numPrice;
        }
      }
    }

    // fallback hardcoded prices if unknown role or API not loaded yet
    if (normalizedRole === "validator") return 9999;
    if (normalizedRole === "course_only" || normalizedRole === "course-only" || normalizedRole === "courseonly" || normalizedRole === "ojt") return 4999;
    if (normalizedRole === "working_professional" || normalizedRole === "working-professional" || normalizedRole === "workingprofessional" || normalizedRole === "web3 enthusiast" || normalizedRole === "web3_enthusiast") return 24999;
    return 19999; // Default to student track
  };

  const referralPercent = dynamicReferralPercent || user?.referralPercentage || 0;

  const referralCode = dynamicReferralCode || propReferralCode;
  //const referralLink = referralCode ? `https://masterstroke.academy/register?ref=${referralCode}` : propReferralLink;

  const referralRecords = dynamicReferrals.length > 0
    ? dynamicReferrals.map(r => ({
      name: r.name || "Anonymous",
      joinedAt: r.joinedAt ? new Date(r.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A",
      status: r.status === "verified" ? "Completed course" : (r.status === "nonverified" ? "In progress" : r.status),
      eligible: r.status === "verified",
      role: r.role || "student",
    }))
    : propReferralRecords.map(r => ({
      name: r.name || "Anonymous",
      joinedAt: r.joinedAt,
      status: r.status === "verified" ? "Completed course" : (r.status === "nonverified" ? "In progress" : r.status),
      eligible: r.status === "verified",
      role: (r as any).role || "student",
    }));

  const getRecordReward = (record: any) => {
    const price = getCoursePrice(record.role);
    return Math.floor((price * referralPercent) / 100);
  };

  const successfulReferrals = referralRecords.filter((record) => record.eligible).length;
  const totalReward = referralRecords
    .filter(record => record.eligible)
    .reduce((sum, record) => sum + getRecordReward(record), 0);

  const withdrawUnlocked = successfulReferrals >= 5;

  useEffect(() => {
    if (!user) return;
    const fetchWithdrawalStatus = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseURL}/api/bank-details/withdrawal/me`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const myRequest = data?.data ?? data;
          if (myRequest && myRequest.status) {
            setWithdrawRequested(true);
            setRequestStatus(myRequest.status);
          }
        }
      } catch (error) {
        console.error("Error fetching withdrawal status:", error);
      }
    };
    fetchWithdrawalStatus();
  }, [user]);

  useEffect(() => {
    if (initialBankDetails) {
      setBankDetails({
        accountHolderName: initialBankDetails.accountHolderName || "",
        accountNumber: initialBankDetails.accountNumber || "",
        ifscCode: initialBankDetails.ifscCode || "",
        branchName: initialBankDetails.branchName || "",
        upiId: initialBankDetails.upiId || "",
      });
    }
  }, [initialBankDetails]);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 sm:mt-8"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30">
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity hover:opacity-100" />
              <Gift className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--text)] to-[var(--text-muted)]">
                Refer &amp; Earn
              </h2>
              <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">Invite friends, unlock rewards, and grow together.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard className="lg:col-span-1" glow="rgba(16,185,129,0.08)">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                Your referral code
              </p>
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="relative mt-4 overflow-hidden rounded-2xl p-[2px]">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-[spin_4s_linear_infinite] opacity-50" />
              <div className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-[var(--surface)] px-4 py-4 backdrop-blur-xl">
                <p className="font-mono text-xl font-black tracking-widest text-emerald-500 drop-shadow-sm">
                  {referralCode}
                </p>
              </div>
            </div>
            {/* <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
              Share link
            </p> */}
            <div className="mt-3 relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--border)] to-[var(--border)] opacity-20 transition duration-300 group-hover:opacity-50" />
              {/* <p className="relative break-all rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/80 px-4 py-3.5 text-xs font-medium leading-relaxed text-[var(--text-muted)] backdrop-blur-sm">
                {referralCode}
              </p> */}
            </div>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(referralCode);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e31e24] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#e31e24]/20 transition-all hover:scale-[1.02] hover:bg-red-600 hover:shadow-xl active:scale-95"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "Code Copied!" : "Copy Referral Code"}
            </button>
            <div className="mt-6 rounded-xl bg-emerald-500/5 px-4 py-3 text-center border border-emerald-500/10">
              <p className="text-xs text-[var(--text-muted)]">
                Earn <strong className="text-[var(--text)]">{referralPercent}%</strong> of the referee's course price per successful referral.
              </p>
            </div>

            <div className="mt-6 border-t border-[var(--border)] pt-6 space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                  Your Discount Details
                </p>
                <div className="mt-3">
                  <label htmlFor="discountCourse" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    Course
                  </label>
                  <select
                    id="discountCourse"
                    value={selfDiscountRole}
                    onChange={(e) => handleSelfDiscountRoleChange(e.target.value as UserRole)}
                    className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--text)] outline-none transition focus:border-[var(--border-strong)] cursor-pointer"
                  >
                    {DISCOUNT_ROLES.map((role) => (
                      <option key={role} value={role}>{roleLabel(role)}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Discount Given by Admin</span>
                  <span className="text-sm font-black text-[var(--text)]">{adminDiscountForSelectedRole}%</span>
                </div>
              </div>

              <div>
                <form onSubmit={handleUpdateSelfDiscount} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="selfDiscount" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                      Self Discount
                    </label>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      Active: {courseDiscounts.find(cd => cd.role === selfDiscountRole)?.selfDiscount || 0}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        id="selfDiscount"
                        min="0"
                        max={adminDiscountForSelectedRole}
                        value={selfDiscountInput}
                        onChange={(e) => setSelfDiscountInput(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-4 pr-12 py-2.5 text-sm font-bold text-[var(--text)] outline-none transition focus:border-[var(--border-strong)]"
                        placeholder="Set discount"
                      />
                      <span className="absolute right-8 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">%</span>
                    </div>
                    <button
                      type="submit"
                      disabled={isUpdatingDiscount}
                      className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {isUpdatingDiscount ? "Saving..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </GlassCard>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <GlassCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    Referral Records
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
                    Withdrawal unlocks after each referee purchase the full course.
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-center shadow-inner">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/80 dark:text-emerald-400/80">Successful</p>
                  <p className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">{successfulReferrals}</p>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/30">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                      <th className="py-4 pl-5 pr-3 font-black">Referee</th>
                      {/* <th className="py-4 pr-3 font-black">Joined</th> */}
                      <th className="py-4 pr-3 font-black">Status</th>
                      <th className="py-4 pr-5 font-black text-right">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {referralRecords.map((record) => (
                      <tr key={`${record.name}-${record.joinedAt}`} className="group transition-colors hover:bg-[var(--surface)]">
                        <td className="py-4 pl-5 pr-3 font-bold text-[var(--text)]">{record.name}</td>
                        {/* <td className="py-4 pr-3 text-[var(--text-muted)] font-medium">{record.joinedAt}</td> */}
                        <td className="py-4 pr-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black tracking-wider shadow-sm ${record.eligible ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-[#e31e24]/10 text-[#e31e24] border border-[#e31e24]/20"}`}>
                            {record.eligible ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                            {record.status}
                          </span>
                        </td>
                        <td className="py-4 pr-5 font-black text-[var(--text)] text-right">
                          {record.eligible ? (
                            <span className="text-emerald-600 dark:text-emerald-400">Rs {getRecordReward(record)}</span>
                          ) : (
                            <span className="text-[#e31e24]">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {withdrawRequested && requestStatus !== "Confirmed" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden flex flex-col items-center justify-center gap-3 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent px-6 py-10 text-center shadow-lg"
              >
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-[60px]" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 shadow-inner">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-[var(--text)]">
                  Withdrawal Requested
                </h3>
                <p className="text-sm text-[var(--text-muted)] max-w-sm">
                  We have received your bank details securely. The amount will be processed and credited to your account within 3-5 business days.
                </p>
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(true)}
                  className="mt-4 relative z-10 shrink-0 group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--border)] hover:scale-[1.02] active:scale-95"
                >
                  Update Bank Details
                </button>
              </motion.div>
            ) : (
              <div className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-[var(--border)] bg-gradient-to-r from-[var(--bg-muted)] to-[var(--surface)] p-6 shadow-sm sm:p-8">
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center sm:text-left">
                  <p className="text-lg font-black text-[var(--text)]">Ready to Cash Out?</p>
                  {requestStatus === "Confirmed" && (
                    <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                      Your previous payout was confirmed. You can submit a new withdrawal request anytime.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
                      const res = await fetch(`${baseURL}/api/bank-details/me`, {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                      });
                      if (res.ok) {
                        const text = await res.text();
                        const data = text ? JSON.parse(text) : null;
                        const existing = data?.data ?? data;
                        if (existing && (existing._id || existing.accountNumber)) {
                          setBankDetails({
                            accountHolderName: existing.accountHolderName || "",
                            accountNumber: existing.accountNumber || "",
                            ifscCode: existing.ifscCode || "",
                            branchName: existing.branchName || "",
                            upiId: existing.upiId || "",
                          });
                        }
                      }
                    } catch (error) {
                      console.error("Error fetching bank details:", error);
                    }
                    setError(null);
                    setShowWithdrawForm(true);
                  }}
                  // disabled={!withdrawUnlocked}
                  className="relative z-10 shrink-0 group inline-flex items-center gap-2.5 rounded-2xl bg-[#e31e24] px-8 py-4 text-sm font-black text-white shadow-xl shadow-[#e31e24]/20 transition-all hover:scale-[1.02] hover:bg-red-600 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-xl"
                >
                  <Wallet className="h-5 w-5" />
                  Request Withdrawal
                  {withdrawUnlocked && (
                    <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </motion.section>

      <AnimatePresence>
        {showWithdrawForm && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-xl"
              onClick={() => {
                setShowWithdrawForm(false);
                setError(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
              className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface)] p-8 shadow-2xl backdrop-blur-3xl"
            >
              {/* Decorative background glows */}
              <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-500/10 blur-[80px]" />

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-[var(--text)]">Withdrawal Details</h3>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">Securely enter your banking information below.</p>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                      </motion.div>
                    )}
                    <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 inline-block">
                      <p className="text-xs font-bold text-[var(--text-muted)]">Withdrawal Amount</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{totalReward}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdrawForm(false);
                      setError(null);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form
                  className="space-y-5"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!user) return;

                    const amount = successfulReferrals * 500;
                    if (amount <= 0) {
                      setError("Withdrawal amount is 0. Cannot proceed with withdrawal.");
                      return;
                    }

                    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
                    const headers = {
                      "x-user-id": user.id,
                      "x-user-email": user.email,
                      "x-user-name": user.fullName,
                      "Content-Type": "application/json",
                    };

                    try {
                      // Check if the user already has bank details saved
                      let hasBankDetails = false;
                      try {
                        const meRes = await fetch(`${baseURL}/api/bank-details/me`, {
                          method: "GET",
                          credentials: "include",
                          headers,
                        });
                        if (meRes.ok) {
                          const meText = await meRes.text();
                          const meData = meText ? JSON.parse(meText) : null;
                          const existing = meData?.data ?? meData;
                          hasBankDetails = !!(existing && (existing._id || existing.accountNumber));
                        }
                      } catch (checkError) {
                        console.error("Failed to check existing bank details:", checkError);
                      }

                      // Only add bank details if they have not been saved yet
                      if (!hasBankDetails) {
                        const bankRes = await fetch(`${baseURL}/api/bank-details`, {
                          method: "POST",
                          credentials: "include",
                          headers,
                          body: JSON.stringify({
                            accountHolderName: bankDetails.accountHolderName,
                            accountNumber: bankDetails.accountNumber,
                            ifscCode: bankDetails.ifscCode,
                            branchName: bankDetails.branchName,
                            upiId: bankDetails.upiId,
                          }),
                        });
                        if (!bankRes.ok) {
                          throw new Error(`Bank details failed: ${bankRes.status}`);
                        }
                      }

                      // Create the withdrawal payout request
                      const amount = successfulReferrals * 500;
                      if (amount > 0) {
                        const withdrawRes = await fetch(`${baseURL}/api/bank-details/withdrawal`, {
                          method: "POST",
                          credentials: "include",
                          headers,
                          body: JSON.stringify({ amount }),
                        });
                        if (!withdrawRes.ok) {
                          throw new Error(`Withdrawal request failed: ${withdrawRes.status}`);
                        }
                      }

                      setWithdrawRequested(true);
                      setRequestStatus("Pending");
                      setShowWithdrawForm(false);
                    } catch (error: any) {
                      console.error("Failed to submit withdrawal request:", error?.message ?? error);
                    }
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[a-zA-Z\s]+"
                        title="Account holder name must contain only alphabets and spaces"
                        value={bankDetails.accountHolderName}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/\d/.test(val)) {
                            setHolderNameError("Numbers/digits are not allowed in account holder name.");
                          } else {
                            setHolderNameError(null);
                          }
                          setBankDetails(prev => ({ ...prev, accountHolderName: val.replace(/[^a-zA-Z\s]/g, "") }));
                        }}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. John Doe"
                      />
                      {holderNameError && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                          {holderNameError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]+"
                        title="Bank account number must contain only numbers"
                        value={bankDetails.accountNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/[^0-9]/.test(val)) {
                            setAccountNumError("Only numbers/digits are allowed in bank account number.");
                          } else {
                            setAccountNumError(null);
                          }
                          setBankDetails(prev => ({ ...prev, accountNumber: val.replace(/[^0-9]/g, "") }));
                        }}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. 1234567890"
                      />
                      {accountNumError && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                          {accountNumError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        required
                        value={bankDetails.ifscCode}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. ABCD0123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bankDetails.branchName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, branchName: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. Main Branch"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        UPI ID <span className="font-semibold opacity-60">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={bankDetails.upiId}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, upiId: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. name@upi"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end pt-2 border-t border-[var(--border)]/50">
                    <button
                      type="submit"
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#e31e24] px-8 py-4 text-sm font-black text-white shadow-xl shadow-[#e31e24]/20 transition-all hover:scale-[1.02] hover:bg-red-600 hover:shadow-2xl sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      <CheckCircle2 className="relative z-10 h-5 w-5" />
                      <span className="relative z-10">Confirm & Withdraw</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div >
        )}
        {showUpdateForm && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-xl"
              onClick={() => setShowUpdateForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
              className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface)] p-8 shadow-2xl backdrop-blur-3xl"
            >
              <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-500/10 blur-[80px]" />

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-[var(--text)]">Update Bank Details</h3>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">Securely modify your banking information below.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (typeof window !== "undefined" && user) {
                      async function UpdateBankDetails() {
                        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
                        try {
                          const response = await fetch(`${baseURL}/api/bank-details/me`, {
                            method: "PATCH",
                            credentials: "include",
                            headers: {

                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              accountHolderName: bankDetails.accountHolderName,
                              accountNumber: bankDetails.accountNumber,
                              ifscCode: bankDetails.ifscCode,
                              branchName: bankDetails.branchName,
                              upiId: bankDetails.upiId,
                            }),
                          });
                          if (!response.ok) {
                            throw new Error(`Response Status : ${response.status}`);
                          }
                          const result = await response.json();
                          console.log("Bank details updated:", result);
                        } catch (error: any) {
                          console.error(error?.message ?? error);
                        }
                      }
                      UpdateBankDetails();
                      setShowUpdateForm(false);
                    }
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[a-zA-Z\s]+"
                        title="Account holder name must contain only alphabets and spaces"
                        value={bankDetails.accountHolderName}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/\d/.test(val)) {
                            setHolderNameError("Numbers/digits are not allowed in account holder name.");
                          } else {
                            setHolderNameError(null);
                          }
                          setBankDetails(prev => ({ ...prev, accountHolderName: val.replace(/[^a-zA-Z\s]/g, "") }));
                        }}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. John Doe"
                      />
                      {holderNameError && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                          {holderNameError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]+"
                        title="Bank account number must contain only numbers"
                        value={bankDetails.accountNumber}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/[^0-9]/.test(val)) {
                            setAccountNumError("Only numbers/digits are allowed in bank account number.");
                          } else {
                            setAccountNumError(null);
                          }
                          setBankDetails(prev => ({ ...prev, accountNumber: val.replace(/[^0-9]/g, "") }));
                        }}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. 1234567890"
                      />
                      {accountNumError && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                          {accountNumError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        required
                        value={bankDetails.ifscCode}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. ABCD0123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bankDetails.branchName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, branchName: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. Main Branch"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        UPI ID <span className="font-semibold opacity-60">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={bankDetails.upiId}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, upiId: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. name@upi"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end pt-2 border-t border-[var(--border)]/50">
                    <button
                      type="submit"
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#e31e24] px-8 py-4 text-sm font-black text-white shadow-xl shadow-[#e31e24]/20 transition-all hover:scale-[1.02] hover:bg-red-600 hover:shadow-2xl sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      <CheckCircle2 className="relative z-10 h-5 w-5" />
                      <span className="relative z-10">Update Details</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence >

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-24 right-6 z-[99999] flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-md transition-all ${toast.type === "success"
              ? "border-emerald-500/25 bg-emerald-950/80 text-emerald-400"
              : "border-red-500/25 bg-red-950/80 text-red-400"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            )}
            <span className="text-sm font-bold text-white">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
