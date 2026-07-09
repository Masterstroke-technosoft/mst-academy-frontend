import type { EmailFormState } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export const sendTestEmail = async (formData: FormData) => {
  const response = await fetch(`${BACKEND_URL}/api/email/test`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to send test email: ${response.statusText}`);
  }

  return response.json();
};

export const sendBulkEmail = async (formData: FormData) => {
  const response = await fetch(`${BACKEND_URL}/api/email/send`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to send bulk email: ${response.statusText}`);
  }

  return response.json();
};
