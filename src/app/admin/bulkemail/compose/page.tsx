"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useBulkEmailStore } from "@/components/bulkemail/store";
import { sendTestEmail, sendBulkEmail } from "@/components/bulkemail/api";
import sanitizeHtml from "sanitize-html";
import dynamic from "next/dynamic";
import type { TipTapEditorHandle } from "@/components/bulkemail/TipTapEditor";

const TipTapEditor = dynamic(() => import("@/components/bulkemail/TipTapEditor"), { ssr: false });

// Define sanitize options once
const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'span']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'style', 'width', 'height'],
    a: ['href', 'target', 'rel'],
    '*': ['style', 'class']
  },
  allowedSchemesByTag: {
    img: ['data', 'http', 'https'],
  },
};

// Define available roles
const ROLES = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'VALIDATOR', label: 'Validator' },
  { value: 'COURSE_ONLY', label: 'Course Only' },
  { value: 'WORKING_PROFESSIONAL', label: 'Working Professional' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'All', label: 'All (non-admin)' },
];

export default function ComposeEmailPage() {
  const {
    form,
    setSubject,
    setBody,
    setRecipientMode,
    setTestEmails,
    resetForm,
  } = useBulkEmailStore();

  const [selectedRoles, setSelectedRoles] = useState<string[]>(['All']);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [testEmailsInput, setTestEmailsInput] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<TipTapEditorHandle>(null);

  useEffect(() => {
    setMounted(true);
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const allUsers: any[] = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await fetch(`${baseURL}/api/admin/users?page=${page}&limit=100`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const pageUsers = data.users || data.data?.users || data.data || [];
        allUsers.push(...pageUsers);
        totalPages = data.pagination?.totalPages || 1;
        page++;
      }

      setUsers(allUsers);
    } catch (err) {
      console.error('[Compose Page] Failed to fetch users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Calculate recipient count based on selected roles
  const recipientCount = useMemo(() => {
    if (selectedRoles.includes('All')) {
      return users.filter(u => u.role !== 'ADMIN' && u.role !== 'S_ADMIN').length;
    }
    return users.filter(u => {
      if (selectedRoles.includes('ADMIN')) {
        return u.role === 'ADMIN' || u.role === 'S_ADMIN';
      }
      return selectedRoles.includes(u.role);
    }).length;
  }, [users, selectedRoles]);

  const parseTestEmails = (input: string): string[] => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return input
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0 && emailRegex.test(email));
  };

  const handleTestEmailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTestEmailsInput(input);
    setTestEmails(parseTestEmails(input));
  };

  const buildFormData = (): FormData => {
    const formData = new FormData();
    formData.append("subject", form.subject);
    formData.append("body", sanitizeHtml(form.body, sanitizeOptions));

    return formData;
  };

  const handleSendTest = async () => {
    if (form.testEmails.length === 0) {
      setError("Please enter at least one valid test email");
      return;
    }
    if (!form.subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    if (!form.body || form.body === "<p></p>" || form.body.replace(/<[^>]*>/g, "").trim().length === 0) {
      setError("Please enter an email body");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = buildFormData();
      formData.append("testEmails", JSON.stringify(form.testEmails));
      await sendTestEmail(formData);
      setSuccess(`Test email(s) sent successfully to ${form.testEmails.length} recipient(s)!`);
    } catch (err) {
      console.error('[Compose Page] Failed to send test emails:', err);
      setError(err instanceof Error ? err.message : "Failed to send test email");
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulk = async () => {
    if (!form.subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    if (!form.body || form.body === "<p></p>" || form.body.replace(/<[^>]*>/g, "").trim().length === 0) {
      setError("Please enter an email body");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowConfirmModal(false);

    try {
      const formData = buildFormData();
      formData.append("roles", JSON.stringify(selectedRoles));
      await sendBulkEmail(formData);
      setSuccess(`Bulk email sending started for ${recipientCount} recipient(s)! Please check backend logs for progress.`);
      resetForm();
      setTestEmailsInput("");
    } catch (err) {
      console.error('[Compose Page] Failed to send bulk email:', err);
      setError(err instanceof Error ? err.message : "Failed to send bulk email");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <DashboardShell role="admin" title="Compose Bulk Email">
      <div className="space-y-6">
        {error && (
          <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "8px" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: "12px", backgroundColor: "#dcfce7", color: "#16a34a", borderRadius: "8px" }}>
            {success}
          </div>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Recipient Mode</label>
          <div style={{ display: "flex", gap: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="radio"
                name="recipientMode"
                value="test"
                checked={form.recipientMode === "test"}
                onChange={() => setRecipientMode("test")}
              />
              Test Mode
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="radio"
                name="recipientMode"
                value="all"
                checked={form.recipientMode === "all"}
                onChange={() => setRecipientMode("all")}
              />
              Send to Selected Roles
            </label>
          </div>
        </div>

        {form.recipientMode === "test" && (
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
              Test Emails (comma-separated)
            </label>
            <input
              type="text"
              value={testEmailsInput}
              onChange={handleTestEmailsChange}
              placeholder="email1@example.com, email2@example.com"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            {form.testEmails.length > 0 && (
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#6b7280" }}>
                Parsed {form.testEmails.length} valid email(s)
              </div>
            )}
          </div>
        )}

        {form.recipientMode === "all" && (
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Select Recipient Roles</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {ROLES.map((role) => (
                <label key={role.value} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (role.value === 'All') {
                          setSelectedRoles(['All']);
                        } else {
                          setSelectedRoles([...selectedRoles.filter(r => r !== 'All'), role.value]);
                        }
                      } else {
                        setSelectedRoles(selectedRoles.filter(r => r !== role.value));
                      }
                    }}
                  />
                  {role.label}
                </label>
              ))}
            </div>
            <div style={{ marginTop: "8px", fontSize: "14px" }}>
              {loadingUsers ? (
                <span>Loading users...</span>
              ) : (
                <span>Estimated recipients: <strong>{recipientCount}</strong></span>
              )}
            </div>
          </div>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Subject</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <label style={{ fontWeight: "bold" }}>Body</label>
            <label style={{
              padding: "4px 12px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}>
              Upload Logo
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    editorRef.current?.insertImageAtCursor(base64, file.name, "200px");
                  };
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <TipTapEditor
            ref={editorRef}
            content={form.body}
            onChange={setBody}
            placeholder="Write your email body here..."
          />
        </div>

        <div style={{ marginTop: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "16px" }}>
            Email Preview
          </label>
          <div
            style={{
              width: "600px",
              maxWidth: "100%",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              overflow: "hidden",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {/* Email client header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>From: MasterStroke Academy &lt;noreply@masterstroke.academy&gt;</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>To: recipient@example.com</div>
              {form.subject && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#111827" }}>{form.subject}</div>
              )}
            </div>

            {/* Email body */}
            <div className="email-preview-content" style={{ padding: "20px 24px", lineHeight: "1.6", fontSize: "14px", color: "#374151" }}>
              <style dangerouslySetInnerHTML={{ __html: `
                .email-preview-content h1 {
                  font-size: 2.25rem !important;
                  font-weight: 800 !important;
                  line-height: 1.25 !important;
                  margin-top: 1.5rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .email-preview-content h2 {
                  font-size: 1.875rem !important;
                  font-weight: 700 !important;
                  line-height: 1.3 !important;
                  margin-top: 1.25rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .email-preview-content h3 {
                  font-size: 1.5rem !important;
                  font-weight: 600 !important;
                  line-height: 1.35 !important;
                  margin-top: 1rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .email-preview-content p {
                  margin-top: 0.5rem;
                  margin-bottom: 0.5rem;
                }
                .email-preview-content ul {
                  list-style-type: disc !important;
                  padding-left: 1.5rem !important;
                }
                .email-preview-content ol {
                  list-style-type: decimal !important;
                  padding-left: 1.5rem !important;
                }
                .email-preview-content li {
                  display: list-item !important;
                }
                .email-preview-content a {
                  color: #3b82f6 !important;
                  text-decoration: underline !important;
                  cursor: pointer !important;
                }
                .email-preview-content a:hover {
                  color: #1d4ed8 !important;
                }
              `}} />
              {form.body ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(form.body, sanitizeOptions) }} />
              ) : (
                <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Email body will appear here</p>
              )}
            </div>

            {/* Email footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", backgroundColor: "#f9fafb", fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>
              This is a preview of how your email will appear to recipients.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={handleSendTest}
            disabled={loading || form.recipientMode !== "test"}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: form.recipientMode === "test" ? "pointer" : "not-allowed",
              opacity: loading || form.recipientMode !== "test" ? 0.5 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Test"}
          </button>
          {form.recipientMode === "all" && (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={loading || selectedRoles.length === 0}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: selectedRoles.length > 0 ? "pointer" : "not-allowed",
                opacity: loading || selectedRoles.length === 0 ? 0.5 : 1,
              }}
            >
              {loading ? "Sending..." : "Send to All"}
            </button>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "bold" }}>
              Confirm Send
            </h3>
            <p style={{ margin: "0 0 16px 0", color: "#6b7280" }}>
              Are you sure you want to send this email to approximately <strong>{recipientCount}</strong> recipients?
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBulk}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "Sending..." : "Confirm Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
