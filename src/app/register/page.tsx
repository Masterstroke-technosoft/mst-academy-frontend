import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="px-4 py-10 text-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
