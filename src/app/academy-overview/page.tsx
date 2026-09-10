import type { Metadata } from "next";
import { getCurriculum } from "@/lib/curriculum";
import { AcademyOverview } from "@/components/marketing/AcademyOverview";

export const metadata: Metadata = {
  title: { absolute: 'Blockchain Course Syllabus — 21 Modules, 130+ Hours' },
  description:
    'Full blockchain developer course syllabus: Solidity, DeFi, security audits, ZK proofs and RWA across 21 modules and 130+ hours. Free to browse.',
  alternates: { canonical: '/academy-overview' },
  openGraph: {
    title: 'Blockchain Course Syllabus — 21 Modules, 130+ Hours',
    description: 'Every phase, module and submodule — from fundamentals to capstone deployment and Demo Day.',
    url: 'https://masterstroke.academy/academy-overview',
  },
};

export default async function AcademyOverviewPage() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  let result: any = null;
  //const token = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTA4MWI4MTM2YjI4NzJmYzk5NjdjMjYiLCJlbWFpbCI6ImFkaXR5YTExMkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4MDEzMTc1MywiZXhwIjoxNzgwNzM2NTUzfQ.hhPiWUrifjyEOoo_3y5ar9LWxjOVBIK9j7daTDjlELc; Path=/; HttpOnly; Expires=Sat, 06 Jun 2026 09:02:31 GMT";
  try {
    const response = await fetch(`${baseURL}/api/academy-overview`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Response Status : ${response.status}`);
    }
    result = await response.json();
  } catch (error: any) {
    console.error("Failed to fetch academy overview:", error?.message ?? error);
  }

  const curriculum = (result && result.success !== false && (Array.isArray(result) || typeof result === "object"))
    ? (Array.isArray(result) ? result[0] : result)
    : null;
  return <AcademyOverview curriculum={curriculum ?? getCurriculum()} />;
}
