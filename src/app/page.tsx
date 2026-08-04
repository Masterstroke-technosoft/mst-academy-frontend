import { getAllModules, getPhases } from "@/lib/curriculum";
import { LandingPage } from "@/components/marketing/LandingPage";

export default function HomePage() {
  const phases = getPhases();
  const modules = getAllModules();
  const submoduleCount = modules.reduce(
    (n, m) => n + m.submodules.length,
    0
  );

  return (
    <LandingPage
      phases={phases}
      moduleCount={modules.length}
      submoduleCount={submoduleCount}
    />
  );
}
