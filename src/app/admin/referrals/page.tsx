// 


"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Users, CheckCircle2, XCircle, Clock, Wallet, Check, AlertCircle } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  userName: string;
  email?: string;
  amount?: number;
  status?: string;
  date?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  upiId?: string;
  bankDetails?: {
    holderName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
    upi?: string;
  };
  referrals?: { name: string; status: string; eligible: boolean }[];
}

const INITIAL_REQUESTS: WithdrawalRequest[] = [
  // {
  //   id: "req-mock-1",
  //   userName: "Admin",
  //   email: "admin4@gmail.com",
  //   amount: 1500,
  //   status: "Pending",
  //   date: "12 Jun 2026",
  //   bankDetails: {
  //     holderName: "",
  //     accountNumber: "",
  //     ifsc: "",
  //     branch: "",
  //     upi: "",
  //   },
  //   referrals: [
  //     { name: "Riya S.", status: "Purchased course", eligible: true },
  //     { name: "Aman K.", status: "Purchased course", eligible: true }
  //   ]
  // },
  // {
  //   id: "req-mock-2",
  //   userName: "mukesh",
  //   email: "aditya120@gmail.com",
  //   amount: 1000,
  //   status: "Pending",
  //   date: "12 Jun 2026",
  //   bankDetails: {
  //     holderName: "",
  //     accountNumber: "",
  //     ifsc: "",
  //     branch: "",
  //     upi: "",
  //   },
  //   referrals: [
  //     { name: "Suresh M.", status: "Purchased course", eligible: true },
  //     { name: "Ramesh K.", status: "Registered", eligible: false }
  //   ]
  // },
  // {
  //   id: "req-mock-3",
  //   userName: "Demo Admin",
  //   email: "abc111@gmail.com",
  //   amount: 2000,
  //   status: "Pending",
  //   date: "12 Jun 2026",
  //   bankDetails: {
  //     holderName: "",
  //     accountNumber: "",
  //     ifsc: "",
  //     branch: "",
  //     upi: "",
  //   },
  //   referrals: [
  //     { name: "Vikram T.", status: "Purchased course", eligible: true }
  //   ]
  // }
];

export default function ReferralAnalyticsPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);

  useEffect(() => {
    setMounted(true);

    const loadRequestsAndBankDetails = async () => {
      try {
        let list = []
        // if (typeof window !== "undefined") {
        //   const stored = localStorage.getItem("referral_withdrawal_requests");
        //   if (stored) {
        //     list = JSON.parse(stored);
        //   }
        // }

        // if (list.length === 0) {
        //   list = [...INITIAL_REQUESTS];
        // }

        try {
          const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
          const resDetails = await fetch(`${baseURL}/api/bank-details/admin/all`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (resDetails.ok) {
            const apiBankDetails = await resDetails.json();
            // const updatedRequests = await Promise.all(
            //   list.map(async (req) => {
            //     const matched = apiBankDetails.find(
            //       (bd: any) =>
            //         (bd.userEmail && bd.userEmail.toLowerCase() === req.email.toLowerCase()) ||
            //         (bd.userName && bd.userName.toLowerCase() === req.userName.toLowerCase())
            //     );

            //     if (matched && matched.userId) {
            //       try {
            //         const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            //         const resUserDetail = await fetch(`${baseURL}/api/bank-details/admin/${matched.userId}`, {
            //           method: "GET",
            //           credentials: "include",
            //           headers: {
            //             "Content-Type": "application/json",
            //           },
            //         });
            //         if (resUserDetail.ok) {
            //           const userDetail = await resUserDetail.json();
            //           return {
            //             ...req,
            //             bankDetails: {
            //               holderName: userDetail.accountHolderName || req.bankDetails?.holderName || "",
            //               accountNumber: userDetail.accountNumber || req.bankDetails?.accountNumber || "",
            //               ifsc: userDetail.ifscCode || req.bankDetails?.ifsc || "",
            //               branch: userDetail.branchName || req.bankDetails?.branch || "",
            //               upi: userDetail.upiId || req.bankDetails?.upi || "",
            //             }
            //           };
            //         }
            //       } catch (err) {
            //         console.error(`Failed to load bank details for user ${matched.userId}`, err);
            //       }
            //       return {
            //         ...req,
            //         bankDetails: {
            //           holderName: matched.accountHolderName || req.bankDetails?.holderName || "",
            //           accountNumber: matched.accountNumber || req.bankDetails?.accountNumber || "",
            //           ifsc: matched.ifscCode || req.bankDetails?.ifsc || "",
            //           branch: matched.branchName || req.bankDetails?.branch || "",
            //           upi: matched.upiId || req.bankDetails?.upi || "",
            //         }
            //       };
            //     }
            //     return {
            //       ...req,
            //       bankDetails: {
            //         holderName: req.bankDetails?.holderName || "",
            //         accountNumber: req.bankDetails?.accountNumber || "",
            //         ifsc: req.bankDetails?.ifsc || "",
            //         branch: req.bankDetails?.branch || "",
            //         upi: req.bankDetails?.upi || "",
            //       }
            //     };
            //   })
            // );
            list = apiBankDetails.map((item: any) => ({
              ...item,
              id: item.withdrawalRequestId || item._id || item.id,
              status: item.withdrawalStatus || item.status || "Pending",
              referrals: item.referrals?.map((ref: any) => ({
                ...ref,
                eligible: ref.status === "verified"
              })) || []
            }));
          }
        } catch (err) {
          console.error("Failed to load bank details from API", err);
        }

        setRequests(list);
      } catch (error) {
        console.error("Failed to load requests", error);
      }
    };

    loadRequestsAndBankDetails();
  }, []);

  const handleConfirmRequest = async (requestId: string) => {
    const reqObj = requests.find(r => r.id === requestId);
    if (!reqObj) return;

    const referrals = reqObj.referrals || [];
    const hasVerified = referrals.some(r => r.status === "verified" || r.eligible);
    const hasNonVerified = referrals.some(r => r.status !== "verified" && !r.eligible);

    if (hasVerified && hasNonVerified) {
      setToast({
        message: "Cannot confirm request. One referral is verified and one is non-verified.",
        type: "warning"
      });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(`${baseURL}/api/bank-details/withdrawal/${requestId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Confirmed" }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("PATCH API error response:", errorText);
        let displayMessage = errorText;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed && parsed.message) {
            displayMessage = parsed.message;
          }
        } catch (e) {
          // fallback to raw text if not JSON
        }
        setToast({
          message: displayMessage || res.statusText || String(res.status),
          type: "error"
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }

      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "Confirmed" } : req))
      );
      setToast({
        message: `Success! Payout request of ₹${reqObj?.amount} for ${reqObj?.userName} has been successfully verified & confirmed.`,
        type: "success"
      });
      setTimeout(() => setToast(null), 4000);

    } catch (error: any) {
      console.error("Failed to confirm withdrawal request via API:", error?.message ?? error);
      setToast({
        message: error.message || "Failed to confirm withdrawal request.",
        type: "error"
      });
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (!mounted) return null;

  return (
    <DashboardShell role="admin" title="Referral Analytics">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          toast.type === "success"
            ? "border-green-500/30 bg-emerald-950/95 text-emerald-400"
            : toast.type === "warning"
            ? "border-amber-500/30 bg-amber-950/95 text-amber-400"
            : "border-red-500/30 bg-red-950/95 text-red-400"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : toast.type === "warning" ? (
            <AlertCircle className="h-5 w-5 text-amber-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          <span className="text-sm font-extrabold">{toast.message}</span>
        </div>
      )}
      <div className="space-y-6">
        {/* Page summary header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <Wallet size={22} className="text-emerald-500" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Withdrawal &amp; Referral Requests</h2>
              <p className="text-sm text-[var(--text-muted)]">Verify course purchases and confirm referral reward payouts</p>
            </div>
          </div>
        </div>

        {/* Request cards list */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center text-[var(--text-muted)]">
              <AlertCircle className="h-10 w-10 text-[var(--text-muted)] opacity-50 mb-3" />
              <p className="text-sm font-semibold">No referral withdrawal requests found.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                  <div>
                    <span className="text-sm font-bold text-[var(--text)]">{req.userName}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${req.status === "Confirmed"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                    }`}>
                    {req.status === "Confirmed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {req.status}
                  </span>
                </div>

                <div className="grid gap-6 mt-6 md:grid-cols-2">
                  {/* Bank Details section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Bank Details</h3>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Holder Name</span>
                        <span className="font-semibold text-[var(--text)]">{req.accountHolderName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Account Number</span>
                        <span className="font-mono font-semibold text-[var(--text)]">{req.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">IFSC Code</span>
                        <span className="font-mono font-semibold text-[var(--text)]">{req.ifscCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Branch</span>
                        <span className="font-semibold text-[var(--text)]">{req.branchName}</span>
                      </div>
                      {req.upiId && (
                        <div className="flex justify-between border-t border-[var(--border)]/50 pt-2">
                          <span className="text-[var(--text-muted)]">UPI ID</span>
                          <span className="font-semibold text-[var(--text)]">{req.upiId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Referrals & Verification section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Referrals Status</h3>
                    <div className="space-y-2">
                      {req.referrals?.map((ref, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/30 px-4 py-2.5 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--text)]">{ref.name}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${ref.eligible
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                              }`}>
                              {ref.status}
                            </span>
                          </div>

                          <div className="flex items-center">
                            {ref.eligible ? (
                              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Valid (+₹500)
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
                                <XCircle className="h-3.5 w-3.5" />
                                No Reward
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm Action Button */}
                {req.status !== "Confirmed" && (
                  <div className="mt-6 flex justify-end border-t border-[var(--border)]/50 pt-4">
                    <button
                      type="button"
                      onClick={() => handleConfirmRequest(req.id)}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:bg-emerald-600 hover:shadow-xl"
                    >
                      <Check className="h-4 w-4" />
                      Verify &amp; Confirm Request (Payout ₹{req.amount})
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
