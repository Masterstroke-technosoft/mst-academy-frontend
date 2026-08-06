import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: { absolute: 'Sign Up | Masterstroke Academy' },
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="px-4 py-10 text-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
