"use client";

import { useState, useRef, useEffect } from "react";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Copy, Save, User } from "lucide-react";

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
  });
  const [photo, setPhoto] = useState<string | null>(safeUser.profilePhoto || null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            // Update state with API response data if available
            setFormData(prev => ({
              ...prev,
              fullName: data.user.fullName || data.user.name || prev.fullName,
              phone: data.user.phone || prev.phone,
              linkedin: data.user.linkedin || prev.linkedin,
              github: data.user.github || prev.github,
              walletAddress: data.user.walletAddress || prev.walletAddress,
              portfolio: data.user.portfolio || prev.portfolio,
            }));
            if (data.user.profilePhoto) {
              setPhoto(data.user.profilePhoto);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const referralCode = `MST-${safeUser.id.slice(-6).toUpperCase()}`;
  const referralLink = `https://masterstroke.academy/register?ref=${referralCode}`;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateProfile({
      ...formData,
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
        <h2 className="text-2xl font-black text-[var(--text)] sm:text-3xl mb-6">
          Your Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-8">
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
    </motion.section>
  );
}
