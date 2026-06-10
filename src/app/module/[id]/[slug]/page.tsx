import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LessonViewer } from "@/components/lesson/LessonViewer";
import { getCurriculum, getModule, getSubmodule } from "@/lib/curriculum";
import { getLessonHtml } from "@/lib/content";
import { DynamicLessonLoader } from "@/components/lesson/DynamicLessonLoader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;
  const isNumeric = /^\d+$/.test(id);

  if (isNumeric) {
    const moduleId = parseInt(id, 10);
    const mod = getModule(moduleId);
    const submodule = getSubmodule(moduleId, slug);
    if (!mod || !submodule) return { title: "Lesson Not Found" };

    return {
      title: `${submodule.id}: ${submodule.title} — Module ${mod.id}`,
      description: submodule.subtitle || `Lesson ${submodule.id} of Module ${mod.id}: ${mod.title}. Part of the Masterstroke Academy blockchain developer program.`,
    };
  } else {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const modRes = await fetch(`${baseURL}/api/modules/${id}`);
      if (!modRes.ok) return { title: "Lesson" };
      const modJson = await modRes.json();
      const dbMod = modJson.data;

      const subRes = await fetch(`${baseURL}/api/submodules/${slug}`);
      if (!subRes.ok) return { title: "Lesson" };
      const subJson = await subRes.json();
      const dbSub = subJson.data;

      if (!dbMod || !dbSub) return { title: "Lesson Not Found" };

      return {
        title: `${dbSub.title} — Module ${dbMod.title}`,
        description: dbSub.description || dbSub.subtitle || `Lesson of Module: ${dbMod.title}.`,
      };
    } catch {
      return { title: "Lesson" };
    }
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const isNumeric = /^\d+$/.test(id);

  if (isNumeric) {
    const moduleId = parseInt(id, 10);
    const mod = getModule(moduleId);
    const submodule = getSubmodule(moduleId, slug);
    if (!mod || !submodule) notFound();

    const html = getLessonHtml(moduleId, slug);
    if (!html) notFound();

    const idx = mod.submodules.findIndex((s: any) => s.slug === slug);
    const prevSlug = idx > 0 ? mod.submodules[idx - 1].slug : undefined;
    const nextSlug =
      idx < mod.submodules.length - 1 ? mod.submodules[idx + 1].slug : undefined;

    const curriculum = getCurriculum();
    const allModuleIds = curriculum.modules.map((m) => m.id);
    const moduleSlugMap: Record<string | number, string[]> = {};
    for (const m of curriculum.modules) {
      moduleSlugMap[m.id] = m.submodules.map((s) => s.slug);
    }
    const phaseId = mod.phaseId;

    return (
      <LessonViewer
        moduleId={mod.id}
        mod={mod}
        submodule={submodule}
        html={html}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
        phaseId={phaseId}
        allModuleIds={allModuleIds}
        moduleSlugMap={moduleSlugMap}
      />
    );
  } else {
    return <DynamicLessonLoader id={id} slug={slug} />;
  }
}
