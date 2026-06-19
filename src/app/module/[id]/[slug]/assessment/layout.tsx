"use client";

import { useEffect } from "react";

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const navbar = document.querySelector("header.sticky");
    if (navbar) (navbar as HTMLElement).style.display = "none";

    return () => {
      document.body.style.overflow = "";
      if (navbar) (navbar as HTMLElement).style.display = "";
    };
  }, []);

  return (
    <div className="assessment-lockdown fixed inset-0 z-[100] flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {children}
    </div>
  );
}
