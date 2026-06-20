


"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, Wallet, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

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
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    upiId: "",
  });

  const [dynamicReferralCode, setDynamicReferralCode] = useState(propReferralCode);
  const [dynamicReferrals, setDynamicReferrals] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const response = await fetch(`${baseURL}/api/users/profile`, {
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
          }
        }
      } catch (error) {
        console.error("Error fetching user profile in ReferAndEarnTab:", error);
      }
    };
    fetchProfile();
  }, []);

  const referralCode = dynamicReferralCode || propReferralCode;
  //const referralLink = referralCode ? `https://masterstroke.academy/register?ref=${referralCode}` : propReferralLink;

  const referralRecords = dynamicReferrals.length > 0
    ? dynamicReferrals.map(r => ({
      name: r.name || "Anonymous",
      joinedAt: r.joinedAt ? new Date(r.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A",
      status: r.status === "verified" ? "Completed course" : (r.status === "nonverified" ? "In progress" : r.status),
      eligible: r.status === "verified",
    }))
    : propReferralRecords;

  const successfulReferrals = referralRecords.filter((record) => record.eligible).length;
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
                Earn a flat <strong className="text-[var(--text)]">Rs 500</strong> per successful referral.
              </p>
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
                    Withdrawal unlocks after <strong className="text-[var(--text)]">5 successful referrals</strong> where each referee completes the full course.
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-center shadow-inner">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/80 dark:text-emerald-400/80">Successful</p>
                  <p className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">{successfulReferrals} <span className="text-sm opacity-60">/ 5</span></p>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/30">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                      <th className="py-4 pl-5 pr-3 font-black">Referee</th>
                      <th className="py-4 pr-3 font-black">Joined</th>
                      <th className="py-4 pr-3 font-black">Status</th>
                      <th className="py-4 pr-5 font-black text-right">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {referralRecords.map((record) => (
                      <tr key={`${record.name}-${record.joinedAt}`} className="group transition-colors hover:bg-[var(--surface)]">
                        <td className="py-4 pl-5 pr-3 font-bold text-[var(--text)]">{record.name}</td>
                        <td className="py-4 pr-3 text-[var(--text-muted)] font-medium">{record.joinedAt}</td>
                        <td className="py-4 pr-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black tracking-wider shadow-sm ${record.eligible ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-[#e31e24]/10 text-[#e31e24] border border-[#e31e24]/20"}`}>
                            {record.eligible ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                            {record.status}
                          </span>
                        </td>
                        <td className="py-4 pr-5 font-black text-[var(--text)] text-right">
                          {record.eligible ? <span className="text-emerald-600 dark:text-emerald-400">Rs 500</span> : <span className="text-[#e31e24]">Pending</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {withdrawRequested ? (
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
                  {requestStatus === "Confirmed" ? "Withdrawal Confirmed" : "Withdrawal Requested"}
                </h3>
                <p className="text-sm text-[var(--text-muted)] max-w-sm">
                  {requestStatus === "Confirmed"
                    ? "Your request has been verified and confirmed by the administrator. The reward of ₹1,500 has been successfully sent!"
                    : "We have received your bank details securely. The amount will be processed and credited to your account within 3-5 business days."}
                </p>
                {requestStatus !== "Confirmed" && (
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(true)}
                    className="mt-4 relative z-10 shrink-0 group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--border)] hover:scale-[1.02] active:scale-95"
                  >
                    Update Bank Details
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-[var(--border)] bg-gradient-to-r from-[var(--bg-muted)] to-[var(--surface)] p-6 shadow-sm sm:p-8">
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center sm:text-left">
                  <p className="text-lg font-black text-[var(--text)]">Ready to Cash Out?</p>
                  {/* <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {withdrawUnlocked
                      ? "You have successfully unlocked your withdrawal."
                      : `Complete ${5 - successfulReferrals} more successful referral(s) to unlock withdrawal.`}
                  </p> */}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const amount = successfulReferrals * 500;
                    if (amount === 0) {
                      alert("You have no successful referrals to withdraw. Complete at least 5 successful referrals first.");
                      return;
                    }
                    try {
                      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
                      const res = await fetch(`${baseURL}/api/bank-details/me`, {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                      });
                      if (res.ok) {
                        const data = await res.json();
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
              onClick={() => setShowWithdrawForm(false)}
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
                    <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 inline-block">
                      <p className="text-xs font-bold text-[var(--text-muted)]">Withdrawal Amount</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{successfulReferrals * 500}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawForm(false)}
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
                          const meData = await meRes.json();
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
                      const withdrawRes = await fetch(`${baseURL}/api/bank-details/withdrawal`, {
                        method: "POST",
                        credentials: "include",
                        headers,
                        body: JSON.stringify({ amount: successfulReferrals * 500 }),
                      });
                      if (!withdrawRes.ok) {
                        throw new Error(`Withdrawal request failed: ${withdrawRes.status}`);
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
                        value={bankDetails.accountHolderName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. 1234567890"
                      />
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
                        value={bankDetails.accountHolderName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-3.5 text-sm font-medium text-[var(--text)] placeholder-[var(--text-muted)]/50 backdrop-blur-md transition-all focus:border-[var(--text)] focus:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--text)]/10"
                        placeholder="e.g. 1234567890"
                      />
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
    </>
  );
}
