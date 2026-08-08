"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TutorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/submissions");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-[var(--text-muted)] bg-[var(--bg)]">
      Loading Dashboard…
    </div>
  );
}
