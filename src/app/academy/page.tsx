import { getAllModules, getPhases } from "@/lib/curriculum";
import { LandingPage } from "@/components/marketing/LandingPage";

export default function AcademyPage() {
  const phases = getPhases();
  const modules = getAllModules();
  const submoduleCount = 123;

  return (
    <LandingPage
      phases={phases}
      moduleCount={modules.length}
      submoduleCount={submoduleCount}
    />
  );
}
