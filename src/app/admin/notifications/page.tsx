"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  Bell,
  Send,
  Users,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Info,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

const AUDIENCE_ROLES = [
  { value: "All", label: "All Users (non-admin)" },
  { value: "STUDENT", label: "Students" },
  { value: "VALIDATOR", label: "Validators" },
  { value: "COURSE_ONLY", label: "Course Only" },
  { value: "WORKING_PROFESSIONAL", label: "Web3 Enthusiasts" },
  { value: "ADMIN", label: "Admins & Staff" },
];

export default function AdminPushNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["All"]);

  const [audienceStats, setAudienceStats] = useState<{
    totalSubscriptions: number;
    byRole: Record<string, number>;
  }>({
    totalSubscriptions: 0,
    byRole: {},
  });

  const [loadingStats, setLoadingStats] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");
  const [lastResult, setLastResult] = useState<{
    total: number;
    sent: number;
    failed: number;
    pruned: number;
  } | null>(null);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin-token")
          : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${BACKEND_URL}/api/notifications/audience-stats`,
        {
          headers,
          credentials: "include",
        },
      );

      if (res.ok) {
        const data = await res.json();
        setAudienceStats(data);
      }
    } catch (err) {
      console.warn("Failed to fetch audience statistics:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRoleToggle = (roleValue: string) => {
    if (roleValue === "All") {
      setSelectedRoles(["All"]);
      return;
    }

    const withoutAll = selectedRoles.filter((r) => r !== "All");
    if (withoutAll.includes(roleValue)) {
      const next = withoutAll.filter((r) => r !== roleValue);
      setSelectedRoles(next.length === 0 ? ["All"] : next);
    } else {
      setSelectedRoles([...withoutAll, roleValue]);
    }
  };

  const calculateTargetSubscribers = () => {
    if (selectedRoles.includes("All")) {
      let count = 0;
      for (const [role, num] of Object.entries(audienceStats.byRole)) {
        if (role !== "ADMIN" && role !== "S_ADMIN") {
          count += num;
        }
      }
      return count;
    }

    return selectedRoles.reduce(
      (sum, role) => sum + (audienceStats.byRole[role] || 0),
      0,
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin-token")
          : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${BACKEND_URL}/api/notifications/upload-image`, {
        method: "POST",
        headers,
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || "Failed to upload image to Cloudinary",
        );
      }

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim()) {
      setError("Please provide a notification title.");
      return;
    }
    if (!body.trim()) {
      setError("Please provide a notification message body.");
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(null);
    setLastResult(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin-token")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${BACKEND_URL}/api/notifications/send`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          url: url.trim() || "/",
          image: imageUrl.trim() || undefined,
          roles: selectedRoles,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `Server responded with status ${res.status}`,
        );
      }

      const result = await res.json();
      setLastResult(result);
      setSuccess(
        `Successfully sent push notification to ${result.sent} device(s)!` +
          (result.pruned > 0
            ? ` (${result.pruned} inactive subscriptions automatically pruned)`
            : ""),
      );
      setShowConfirmModal(false);
      fetchStats();
    } catch (err: any) {
      setError(err.message || "Failed to broadcast notification.");
    } finally {
      setSending(false);
    }
  };

  const targetCount = calculateTargetSubscribers();

  return (
    <DashboardShell role="admin" title="Push Notifications">
      <div className="space-y-8">
        {/* Header Description */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mst-red/10 text-mst-red">
                <Bell size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text)]">
                  Web Push Notification Broadcast
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Send real-time system alerts to users across installed PWA
                  apps, Android devices, and web browsers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchStats}
              disabled={loadingStats}
              className="flex items-center gap-2 self-start sm:self-auto rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/40 transition"
            >
              <RefreshCw
                size={14}
                className={loadingStats ? "animate-spin" : ""}
              />
              Refresh Subscribers
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-5 sm:grid-cols-4">
            <div>
              <p className="text-xs text-[var(--text-muted)]">
                Active Subscribed Devices
              </p>
              <p className="mt-1 text-2xl font-black text-mst-red">
                {audienceStats.totalSubscriptions}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Target Reach</p>
              <p className="mt-1 text-2xl font-black text-[var(--text)]">
                {targetCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Student Devices</p>
              <p className="mt-1 text-2xl font-black text-[var(--text)]">
                {audienceStats.byRole["STUDENT"] || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">
                Validator Devices
              </p>
              <p className="mt-1 text-2xl font-black text-[var(--text)]">
                {audienceStats.byRole["VALIDATOR"] || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Two-column layout: Form & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Compose Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-[var(--text)]">
                1. Target Audience
              </h3>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {AUDIENCE_ROLES.map((r) => {
                  const isChecked = selectedRoles.includes(r.value);
                  const count =
                    r.value === "All"
                      ? Object.entries(audienceStats.byRole).reduce(
                          (acc, [k, v]) =>
                            k !== "ADMIN" && k !== "S_ADMIN" ? acc + v : acc,
                          0,
                        )
                      : audienceStats.byRole[r.value] || 0;

                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => handleRoleToggle(r.value)}
                      className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition ${
                        isChecked
                          ? "border-mst-red bg-mst-red/5 text-[var(--text)] ring-1 ring-mst-red"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs font-semibold">{r.label}</span>
                        <div
                          className={`h-3 w-3 rounded-full border ${
                            isChecked
                              ? "border-mst-red bg-mst-red"
                              : "border-[var(--border)]"
                          }`}
                        />
                      </div>
                      <span className="mt-2 text-[10px] text-[var(--text-muted)]">
                        {count} {count === 1 ? "device" : "devices"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-[var(--border)] pt-6 space-y-5">
                <h3 className="text-base font-bold text-[var(--text)]">
                  2. Notification Content
                </h3>

                {/* Title */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-semibold text-[var(--text)]">
                      Notification Title *
                    </label>
                    <span className="text-[var(--text-muted)]">
                      {title.length} / 100
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Module 4 Assessment is Now Live!"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-mst-red focus:outline-none focus:ring-1 focus:ring-mst-red transition"
                  />
                </div>

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-semibold text-[var(--text)]">
                      Message Body *
                    </label>
                    <span className="text-[var(--text-muted)]">
                      {body.length} / 500
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="e.g. Complete your smart contract assessment on MST Chain to earn your on-chain certificate."
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-mst-red focus:outline-none focus:ring-1 focus:ring-mst-red transition resize-y"
                  />
                </div>

                {/* Target URL */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-semibold text-[var(--text)]">
                      Click Action URL
                    </label>
                    <span className="text-[var(--text-muted)]">
                      Page navigated to on tap
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="/learn or /dashboard/student"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-mst-red focus:outline-none focus:ring-1 focus:ring-mst-red transition font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Optional Banner Image */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-mst-red" />
                      Banner Image (Optional)
                    </label>
                    <span className="text-[var(--text-muted)]">
                      Displayed as rich visual card
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs font-semibold text-[var(--text)] hover:bg-[var(--border)]/40 hover:border-mst-red transition disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-mst-red" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={14} className="text-mst-red" />
                            Upload Image
                          </>
                        )}
                      </button>

                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Or paste Cloudinary / image URL"
                          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-mst-red focus:outline-none focus:ring-1 focus:ring-mst-red transition font-mono"
                        />
                      </div>

                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl("")}
                          title="Remove image"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {imageUrl && (
                      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2">
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-neutral-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt="Uploaded preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[var(--text)] truncate">
                            Image attached
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] truncate font-mono">
                            {imageUrl}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!title.trim() || !body.trim() || sending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-mst-red px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-mst-red/90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <Send size={16} />
                  Review & Broadcast Notification
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Notification Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text)]">
                  Live Preview
                </h3>
                <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-1 bg-[var(--background)]">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("desktop")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                      previewTab === "desktop"
                        ? "bg-mst-red text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <Laptop size={14} /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("mobile")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                      previewTab === "mobile"
                        ? "bg-mst-red text-white"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <Smartphone size={14} /> Mobile
                  </button>
                </div>
              </div>

              {/* Preview Container */}
              <div className="rounded-xl border border-[var(--border)] bg-neutral-900 p-6 text-white min-h-[220px] flex items-center justify-center">
                {previewTab === "desktop" ? (
                  /* Desktop Toast Mockup */
                  <div className="w-full max-w-sm rounded-xl bg-neutral-800/90 border border-neutral-700/60 p-4 shadow-2xl backdrop-blur-md animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-700/50">
                      <div className="flex items-center gap-2">
                        <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                          <Image
                            src="/icons/icon-192x192.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium text-neutral-300">
                          Masterstroke Academy
                        </span>
                      </div>
                      <span>Just now</span>
                    </div>

                    <div className="mt-3 flex items-start gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-950 p-1">
                        <Image
                          src="/icons/icon-192x192.png"
                          alt="Notification Icon"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">
                          {title || "Notification Title"}
                        </p>
                        <p className="mt-1 text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                          {body ||
                            "Notification body message will appear here in the system push tray."}
                        </p>
                        {imageUrl && (
                          <div className="mt-2.5 relative w-full h-32 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageUrl}
                              alt="Desktop Banner Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-mst-red">
                          <ExternalLink size={11} />
                          <span className="truncate">{url || "/"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mobile Android Tray Mockup */
                  <div className="w-full max-w-xs rounded-2xl bg-neutral-800 border border-neutral-700 p-4 shadow-2xl animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="relative h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src="/icons/icon-192x192.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium">MST Academy</span>
                        <span>•</span>
                        <span>Now</span>
                      </div>
                    </div>

                    <div className="mt-1">
                      <p className="text-xs font-bold text-white">
                        {title || "Notification Title"}
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-300 line-clamp-2">
                        {body ||
                          "Notification message body preview for mobile PWA tray."}
                      </p>
                      {imageUrl && (
                        <div className="mt-2 relative w-full h-24 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt="Mobile Banner Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-end border-t border-neutral-700/60 pt-2 text-[10px] text-mst-red">
                      Tap to open
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery info */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-xs text-[var(--text-muted)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
                  <Info size={14} className="text-mst-red" />
                  Delivery Behavior
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Delivered directly via W3C Web Push API standard.</li>
                  <li>
                    Shows in background even when browser or PWA is closed on
                    Android.
                  </li>
                  <li>
                    Stale or revoked browser endpoints are automatically pruned.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-mst-red">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mst-red/10">
                <Bell size={20} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text)]">
                Confirm Push Broadcast
              </h3>
            </div>

            <p className="text-sm text-[var(--text-muted)]">
              You are about to dispatch a Web Push Notification to{" "}
              <strong className="text-[var(--text)]">
                {targetCount} active device(s)
              </strong>{" "}
              across the selected audience:
            </p>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-2 text-xs">
              <p>
                <span className="font-semibold text-[var(--text-muted)]">
                  Audience:
                </span>{" "}
                <span className="font-bold text-[var(--text)]">
                  {selectedRoles.join(", ")}
                </span>
              </p>
              <p>
                <span className="font-semibold text-[var(--text-muted)]">
                  Title:
                </span>{" "}
                <span className="font-bold text-[var(--text)]">{title}</span>
              </p>
              <p>
                <span className="font-semibold text-[var(--text-muted)]">
                  URL:
                </span>{" "}
                <span className="font-mono text-mst-red">{url || "/"}</span>
              </p>
              {imageUrl && (
                <p>
                  <span className="font-semibold text-[var(--text-muted)]">
                    Banner Image:
                  </span>{" "}
                  <span className="text-emerald-500 font-semibold">Attached (Rich Visual Card)</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={sending}
                className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)] transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendNotification}
                disabled={sending}
                className="flex items-center gap-2 rounded-xl bg-mst-red px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-mst-red/90 transition cursor-pointer disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Confirm & Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
