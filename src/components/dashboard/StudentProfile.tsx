"use client";

import { useState, useRef, useEffect } from "react";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2, Copy, Save, User, AlertCircle } from "lucide-react";

export function StudentProfile({ user }: { user: AuthUser | null }) {
  const { updateProfile } = useAuth();
  const safeUser = user ?? {
    id: "",
    email: "",
    fullName: "",
    role: "student" as const,
    registeredAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState({
    fullName: safeUser.fullName || "",
    phone: safeUser.phone || "",
    linkedin: safeUser.linkedin || "",
    github: safeUser.github || "",
    walletAddress: safeUser.walletAddress || "",
    portfolio: safeUser.portfolio || "",
    _id: "",
    name: "",
    email: "",
    role: "",
    isActive: false,
    isStudentVerified: false,
    studentVerificationStatus: safeUser.studentVerificationStatus || "",
    studentRejectionNote: safeUser.studentRejectionNote || "",
    referredBy: null as string | null,
    referrals: [] as any[],
    createdAt: "",
    updatedAt: "",
    __v: 0,
    referralCode: "",
    cvFile: safeUser.cvFile || "",
    cvFileName: safeUser.cvFileName || "",
  });
  const [photo, setPhoto] = useState<string | null>(safeUser.profilePhoto || null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [hasSubmittedPayment, setHasSubmittedPayment] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let profilePaymentVerified = false;

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
            const rejectionNote = data.user.studentRejectionNote || data.user.rejectionNote || "";
            const isActuallyVerified = rejectionNote ? false : !!data.user.isStudentVerified;

            setFormData(prev => ({
              ...prev,
              fullName: data.user.fullName || data.user.name || prev.fullName,
              phone: data.user.phone || prev.phone,
              linkedin: data.user.linkedin || prev.linkedin,
              github: data.user.github || prev.github,
              walletAddress: data.user.walletAddress || prev.walletAddress,
              portfolio: data.user.portfolio || prev.portfolio,
              _id: data.user._id || prev._id,
              name: data.user.name || prev.name,
              email: data.user.email || prev.email,
              role: data.user.role || prev.role,
              isActive: data.user.isActive !== undefined ? data.user.isActive : prev.isActive,
              isStudentVerified: isActuallyVerified,
              studentVerificationStatus: data.user.studentVerificationStatus || prev.studentVerificationStatus,
              studentRejectionNote: rejectionNote,
              referredBy: data.user.referredBy !== undefined ? data.user.referredBy : prev.referredBy,
              referrals: data.user.referrals || prev.referrals,
              createdAt: data.user.createdAt || prev.createdAt,
              updatedAt: data.user.updatedAt || prev.updatedAt,
              __v: data.user.__v !== undefined ? data.user.__v : prev.__v,
              referralCode: data.user.referralCode || prev.referralCode,
              cvFile: data.user.cvFile || prev.cvFile,
              cvFileName: data.user.cvFileName || prev.cvFileName,
            }));
            if (data.user.profilePhoto) {
              setPhoto(data.user.profilePhoto);
            }
            if (data.user.isPaymentVerified || data.user.paymentVerified) {
              profilePaymentVerified = true;
              setIsPaymentVerified(true);
            }
            // Update auth provider user state with latest info
            updateProfile({
              isStudentVerified: isActuallyVerified,
              studentRejectionNote: rejectionNote,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const checkPaymentStatus = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${baseURL}/api/node-purchase`, {
          credentials: "include",
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          let list: any[] = [];
          if (Array.isArray(data)) {
            list = data;
          } else if (data?.purchase) {
            list = [data.purchase];
          } else if (data?.data) {
            list = Array.isArray(data.data) ? data.data : [];
          } else if (data?.purchases) {
            list = Array.isArray(data.purchases) ? data.purchases : [];
          }
          if (list.length > 0) {
            setHasSubmittedPayment(true);
            const isApproved = list.some(item => item.status === "APPROVED");
            setIsPaymentVerified(isApproved || profilePaymentVerified);
          } else {
            setHasSubmittedPayment(false);
            setIsPaymentVerified(profilePaymentVerified);
          }
        } else {
          setIsPaymentVerified(profilePaymentVerified);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setIsPaymentVerified(profilePaymentVerified);
      }
    };

    const loadAll = async () => {
      await fetchProfile();
      await checkPaymentStatus();
    };
    loadAll();
  }, []);

  const referralCode = formData.referralCode || (safeUser.id ? `MST-${safeUser.id.slice(-6).toUpperCase()}` : "");
  const referralLink = `Comming Soon`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          cvFile: reader.result as string,
          cvFileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const formDataToSend = new FormData();
        formDataToSend.append("idCardImage", file);
        formDataToSend.append("studentRejectionNote", "");
        formDataToSend.append("isStudentVerified", "false");

        const response = await fetch(`${baseURL}/api/users/profile`, {
          method: "PATCH",
          body: formDataToSend,
          credentials: "include",
        });

        if (!response.ok) {
          await fetch(`${baseURL}/api/users/profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentRejectionNote: "",
              isStudentVerified: false
            }),
            credentials: "include",
          });
        }

        setFormData((prev) => ({
          ...prev,
          isStudentVerified: false,
          studentRejectionNote: "",
        }));

        updateProfile({
          isStudentVerified: false,
          studentRejectionNote: "",
        });

        showToast("ID Card re-uploaded successfully. Verification status is now pending.", "success");
      } catch (error) {
        console.error("Error re-uploading ID card:", error);
        showToast("Failed to re-upload ID card. Please try again.", "error");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateProfile({
      fullName: formData.fullName,
      phone: formData.phone,
      linkedin: formData.linkedin,
      github: formData.github,
      walletAddress: formData.walletAddress,
      portfolio: formData.portfolio,
      profilePhoto: photo || undefined,
    });
    setSaving(false);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 backdrop-blur-md sm:p-8"
      style={{ boxShadow: "0 0 60px rgba(168,85,247,0.08)" }}
    >
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-mst-red/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-black text-[var(--text)] sm:text-3xl">
            Your Profile
          </h2>

          {/* Verification Badges */}
          {(formData.role?.toLowerCase() === "student" || formData.role?.toLowerCase() === "validator") && (
            <div className="flex flex-wrap items-center gap-2">
              {formData.isStudentVerified && !formData.studentRejectionNote ? (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified {formData.role?.toLowerCase() === "validator" ? "Validator" : "Student"}</span>
                </div>
              ) : formData.studentRejectionNote ? (
                <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-black text-red-500">
                  <span>Verification Rejected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-black text-amber-500">
                  <span>Verification Pending</span>
                </div>
              )}
              {isPaymentVerified ? (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Payment Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-black text-amber-500">
                  <span>Payment Pending</span>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Rejection Banner */}
          {formData.studentRejectionNote && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5 text-sm text-red-500 backdrop-blur-md shadow-lg shadow-red-500/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-extrabold text-base">Verification Rejected</span>
              </div>
              <p className="text-red-400 mb-3 font-medium">
                Your verification request was rejected with the following note:
              </p>
              <div className="rounded-xl bg-red-950/20 border border-red-500/15 p-4 mb-4 text-[var(--text)] font-semibold leading-relaxed">
                {formData.studentRejectionNote}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById("idCardReuploadInputTop")?.click()}
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-md shadow-red-600/10"
                >
                  Reverify
                </button>
                <input
                  id="idCardReuploadInputTop"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleIdCardReupload}
                />
              </div>
            </div>
          )}

          {/* Photo Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-[var(--border)] bg-gradient-to-br from-mst-red to-orange-500 shadow-lg shadow-mst-red/20">
              {photo ? (
                <img src={photo} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white">
                  <User size={48} />
                </div>
              )}
              <div
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="text-white" size={24} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text)]">Profile Photo</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)] max-w-sm">
                Upload a professional headshot. Recommended size is 256x256 pixels. JPG or PNG allowed.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--border)]"
              >
                Change Photo
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Email Address
              </label>
              <input
                type="email"
                value={safeUser.email}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                GitHub Profile
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Portfolio Website (Optional)
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red"
              />
            </div>

            {/* Wallet Address */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Wallet Address (Web3)
              </label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="0x..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-mst-red focus:ring-1 focus:ring-mst-red"
              />
            </div>

            {/* User ID */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                User ID
              </label>
              <input
                type="text"
                value={formData._id}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Account Status */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Account Status (Active)
              </label>
              <input
                type="text"
                value={formData.isActive ? "Yes" : "No"}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Student Verified Status */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                {formData.role?.toLowerCase() === "validator" ? "Validator Verification" : "Student Verification"}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={formData.isStudentVerified && !formData.studentRejectionNote ? "Verified" : formData.studentRejectionNote ? "Rejected" : "Not Verified"}
                  disabled
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none opacity-70 cursor-not-allowed ${formData.isStudentVerified && !formData.studentRejectionNote
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                      : formData.studentRejectionNote
                        ? "border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400"
                        : "border-[var(--border)] bg-[var(--border)]/30 text-[var(--text-muted)]"
                    }`}
                />
                {formData.isStudentVerified && !formData.studentRejectionNote && (
                  <CheckCircle2 className="absolute right-4 h-5 w-5 text-emerald-500" />
                )}
              </div>
              {formData.studentRejectionNote && (
                <div className="relative group mt-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500 transition-all hover:bg-red-500/10">
                  <span className="font-extrabold block mb-1">Rejection Reason:</span>
                  <p className="mb-3">{formData.studentRejectionNote}</p>
                  <button
                    type="button"
                    onClick={() => document.getElementById("idCardReuploadInput")?.click()}
                    className="rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Re-upload ID Card
                  </button>
                  <input
                    id="idCardReuploadInput"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleIdCardReupload}
                  />
                </div>
              )}
            </div>

            {/* Payment Verified Status */}
            {(formData.role?.toLowerCase() === "student" || formData.role?.toLowerCase() === "validator") && (
              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                  Payment Status
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={isPaymentVerified ? "Verified" : "Pending Verification"}
                    disabled
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none opacity-70 cursor-not-allowed ${isPaymentVerified
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                        : "border-[var(--border)] bg-[var(--border)]/30 text-[var(--text-muted)]"
                      }`}
                  />
                  {isPaymentVerified && (
                    <CheckCircle2 className="absolute right-4 h-5 w-5 text-emerald-500" />
                  )}
                </div>
              </div>
            )}

            {/* Referred By */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Referred By
              </label>
              <input
                type="text"
                value={formData.referredBy || "None"}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Referrals Count */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Total Referrals
              </label>
              <input
                type="text"
                value={formData.referrals ? formData.referrals.length : 0}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Created At */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Created At
              </label>
              <input
                type="text"
                value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : ""}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Updated At */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Updated At
              </label>
              <input
                type="text"
                value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : ""}
                disabled
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--border)]/30 px-4 py-3 text-sm text-[var(--text-muted)] outline-none opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Upload CV */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[var(--text-muted)]">
                Upload CV
              </label>
              <div className="flex items-center gap-3 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5">
                <label
                  htmlFor="cvUploadInput"
                  className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--border)] transition-all shrink-0 shadow-sm"
                >
                  Choose File
                </label>
                <span className="text-sm text-[var(--text-muted)] truncate">
                  {formData.cvFileName ? formData.cvFileName : "No file chosen"}
                </span>
                <input
                  id="cvUploadInput"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleCvUpload}
                />
              </div>
            </div>
          </div>

          {/* Referral Section */}
          <div className="rounded-xl border border-dashed border-[var(--border)] p-4 bg-mst-red/5">
            <h3 className="mb-1 text-sm font-bold text-[var(--text)]">Your Referral Link</h3>
            <p className="mb-3 text-xs text-[var(--text-muted)]">Share this link with friends. You both get rewards!</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-muted)]"
              />
              <button
                type="button"
                disabled
                onClick={copyReferral}
                className="flex items-center gap-2 rounded-lg bg-mst-red px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex justify-end border-t border-[var(--border)] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-mst-red px-8 py-3 font-bold text-white shadow-lg shadow-mst-red/25 transition hover:shadow-mst-red/40 hover:brightness-110 active:scale-95 disabled:opacity-70"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-md transition-all ${
              toast.type === "success"
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
    </motion.section>
  );
}
