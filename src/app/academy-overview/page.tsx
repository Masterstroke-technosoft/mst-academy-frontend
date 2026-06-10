import type { Metadata } from "next";
import { getCurriculum } from "@/lib/curriculum";
import { AcademyOverview } from "@/components/marketing/AcademyOverview";

export const metadata: Metadata = {
  title: "Curriculum Overview | Masterstroke Academy",
  description:
    "Explore the full Masterstroke Academy programme — 4 phases, 21 modules, 122+ submodules, and 130+ hours of structured Web3 learning.",
};

export default async function AcademyOverviewPage() {
  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  let result: any = null;
  const token = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTA4MWI4MTM2YjI4NzJmYzk5NjdjMjYiLCJlbWFpbCI6ImFkaXR5YTExMkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4MDEzMTc1MywiZXhwIjoxNzgwNzM2NTUzfQ.hhPiWUrifjyEOoo_3y5ar9LWxjOVBIK9j7daTDjlELc; Path=/; HttpOnly; Expires=Sat, 06 Jun 2026 09:02:31 GMT";
  const response = await fetch(`${baseURL}/api/academy-overview`, {
    method: "GET",
    headers: {
      "Cookie": token,
      // "Authorization" : `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  try {
    if (!response.ok) {
      throw new Error(`Response Status : ${response.status}`);
    }
    result = await response.json();
    console.log(result);
  } catch (error: any) {
    console.error(error?.message ?? error);
  }

  const curriculum = Array.isArray(result) ? result[0] : result;
  return <AcademyOverview curriculum={curriculum ?? getCurriculum()} />;
}
