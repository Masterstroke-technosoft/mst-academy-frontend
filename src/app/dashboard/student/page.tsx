"use client";

import { useAuth } from "@/components/AuthProvider";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, BookOpen, ChevronDown, ChevronRight, FileText, LayoutList, X, Save, CheckCircle2, Upload } from "lucide-react";
import { ReferAndEarnTab } from "@/components/dashboard/ReferAndEarnTab";
import { StudentProfile } from "@/components/dashboard/StudentProfile";

export default function StudentDashboardPage({
  role = "student",
  title = "Student Hub"
}: {
  role?: "student" | "validator" | "non-validator",
  title?: string
} = {}) {
  const { user, isAdmin } = useAuth();

  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHash = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const referralCode = user ? `MST-${user.id.slice(-6).toUpperCase()}` : "";
  const referralLink = user ? `https://masterstroke.academy/register?ref=${referralCode}` : "";
  const referralRecords = [
    { name: "Riya S.", joinedAt: "12 May 2026", status: "Completed course", eligible: true },
    { name: "Aman K.", joinedAt: "14 May 2026", status: "Completed course", eligible: true },
    { name: "Neha P.", joinedAt: "16 May 2026", status: "In progress", eligible: false },
    { name: "Vikram T.", joinedAt: "18 May 2026", status: "Completed course", eligible: true },
    { name: "Priya M.", joinedAt: "21 May 2026", status: "Completed course", eligible: true },
    { name: "Rohit D.", joinedAt: "24 May 2026", status: "Completed course", eligible: true },
  ] as const;
  const successfulReferrals = referralRecords.filter((record) => record.eligible).length;
  const withdrawUnlocked = successfulReferrals >= 5;

  // Load actual data for phases
  const [phases, setPhases] = useState<any[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(true);

  const fetchPhaseFull = async (phaseId: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const fullRes = await fetch(`${baseURL}/api/phases/full/${phaseId}`, {
        method: "GET",
        credentials: "include",
        headers
      });
      if (fullRes.ok) {
        const fullData = await fullRes.json();
        const fullPhaseObj = fullData.data || fullData;

        // Map modules and submodules
        const rawModules = fullPhaseObj.modules || [];
        const mappedModules = rawModules.map((mod: any) => {
          const rawSubmodules = mod.submodules || [];
          const mappedSubmodules = rawSubmodules.map((sub: any) => ({
            id: sub.id || sub._id,
            title: sub.title,
            description: sub.description || "",
            estimatedTime: sub.estimatedTime || "",
            contentFile: sub.contentFile || "",
            hasAssessment: sub.hasAssessment || false,
            questionsCount: sub.totalMarks || sub.questionsCount || 0,
            index: sub.index,
            moduleId: sub.moduleId
          }));

          return {
            id: mod.id || mod._id,
            title: mod.title,
            description: mod.description || "",
            index: mod.index,
            phaseId: mod.phaseId,
            submodules: mappedSubmodules
          };
        });

        // Update specific phase in state
        setPhases(prevPhases => prevPhases.map(p => {
          if (p.id === phaseId) {
            return {
              ...p,
              modules: mappedModules
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error(`Error fetching full hierarchy for phase ${phaseId}:`, err);
    }
  };

  const fetchCurriculum = async () => {
    try {
      setLoadingCurriculum(true);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const courseId = "6a1a8a4b72fa89699a4f016a";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 1. Fetch course phases
      const res = await fetch(`${baseURL}/api/phases/course/${courseId}`, {
        method: "GET",
        credentials: "include",
        headers
      });
      if (!res.ok) throw new Error(`Failed to fetch phases list: ${res.status}`);
      const resData = await res.json();
      const rawPhases = resData.data || resData || [];

      // Sort phases by their index to ensure correct order (Phase 1, Phase 2, etc.)
      const sortedPhases = [...rawPhases].sort((a: any, b: any) => (a.index || 0) - (b.index || 0));

      const colors = [
        { color: "text-mst-red", gradient: "from-mst-red/20 to-purple-500/20" },
        { color: "text-blue-500", gradient: "from-blue-500/20 to-cyan-500/20" },
        { color: "text-emerald-500", gradient: "from-emerald-500/20 to-teal-500/20" },
        { color: "text-amber-500", gradient: "from-amber-500/20 to-orange-500/20" }
      ];

      const initialPhases = sortedPhases.map((phase: any, index: number) => {
        const colorObj = colors[index % colors.length];
        const displayTitle = phase.title ? (
          phase.title.endsWith(":") || phase.title.includes(":")
            ? `${phase.title} ${phase.description || ""}`
            : `${phase.title}${phase.description ? ': ' + phase.description : ''}`
        ).trim() : (phase.description || "");

        return {
          id: phase.id || phase._id,
          title: displayTitle,
          rawTitle: phase.title || "",
          description: phase.description || "",
          estimatedTime: phase.estimatedTime || "",
          index: phase.index || index + 1,
          courseId: phase.courseId || courseId,
          color: colorObj.color,
          gradient: colorObj.gradient,
          modules: []
        };
      });

      setPhases(initialPhases);
      setLoadingCurriculum(false);

      // 2. Fetch full hierarchy for each phase in parallel to populate details
      await Promise.all(
        initialPhases.map(async (phase: any) => {
          await fetchPhaseFull(phase.id);
        })
      );
    } catch (error) {
      console.error("Error fetching curriculum data:", error);
      setLoadingCurriculum(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({ "phase-1": true, "assess-phase-1": true });
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ "1": true, "assess-1": true });
  const [addingQuestionTo, setAddingQuestionTo] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ text: '', options: ['', '', '', ''], correctOption: 0 });
  const [editingItem, setEditingItem] = useState<{
    type: string;
    title: string;
    phaseId: string;
    moduleId?: number | string;
    subId?: string;
    description?: string;
    estimatedTime?: string;
    contentFile?: string;
    index?: number;
    parentId?: string;
  } | null>(null);
  const [curriculumModal, setCurriculumModal] = useState<{
    type: "create-phase" | "create-module" | "create-submodule" | null;
    phaseId?: string;
    moduleId?: string | number;
    title: string;
    description: string;
    estimatedTime: string;
    contentFile: string;
  } | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "Phase" | "Module" | "Submodule";
    id: string;
    phaseId?: string;
    moduleId?: string | number;
    title: string;
  } | null>(null);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const togglePhase = async (id: string) => {
    const isExpanding = !expandedPhases[id];
    setExpandedPhases(prev => ({ ...prev, [id]: isExpanding }));
    if (isExpanding && !id.startsWith("assess-")) {
      await fetchPhaseFull(id);
    }
  };

  const toggleModule = (id: string | number) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddQuestion = (subId: string) => {
    setAddingQuestionTo(subId);
    setNewQuestion({ text: '', options: ['', '', '', ''], correctOption: 0 });
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.text.trim()) {
      alert("Please enter the question text.");
      return;
    }
    if (newQuestion.options.some(opt => !opt.trim())) {
      alert("Please fill in all 4 options.");
      return;
    }

    setPhases(phases.map((p: any) => ({
      ...p,
      modules: p.modules.map((m: any) => ({
        ...m,
        submodules: m.submodules.map((sub: any) => {
          if (sub.id === addingQuestionTo) {
            return {
              ...sub,
              questionsCount: (sub.questionsCount || 0) + 1,
              hasAssessment: true
            };
          }
          return sub;
        })
      }))
    })));

    setAddingQuestionTo(null);
  };

  const handleAddPhase = () => {
    setCurriculumModal({
      type: "create-phase",
      title: "",
      description: "",
      estimatedTime: "",
      contentFile: ""
    });
  };

  const handleAddModule = (phaseId: string) => {
    setCurriculumModal({
      type: "create-module",
      phaseId,
      title: "",
      description: "",
      estimatedTime: "",
      contentFile: ""
    });
  };

  const handleAddSubmodule = (phaseId: string, moduleId: string | number) => {
    setCurriculumModal({
      type: "create-submodule",
      phaseId,
      moduleId,
      title: "",
      description: "",
      estimatedTime: "30 minutes",
      contentFile: ""
    });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curriculumModal) return;

    const { type, phaseId, moduleId, title, description, estimatedTime, contentFile } = curriculumModal;
    if (!title.trim() || !description.trim()) {
      setStatusMessage({
        type: "error",
        title: "Validation Error",
        message: "Please enter title and description."
      });
      return;
    }
    if (type === "create-phase" && !estimatedTime.trim()) {
      setStatusMessage({
        type: "error",
        title: "Validation Error",
        message: "Please enter estimated time for the phase."
      });
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Pragma": "no-cache"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (type === "create-phase") {
        const courseId = "6a1a8a4b72fa89699a4f016a";
        const response = await fetch(`${baseURL}/api/phases/admin`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({
            title,
            courseId,
            index: phases.length + 1,
            description,
            estimatedTime
          })
        });
        if (response.ok) {
          await fetchCurriculum();
          setCurriculumModal(null);
          setStatusMessage({
            type: "success",
            title: "Success",
            message: "Phase created successfully"
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          setStatusMessage({
            type: "error",
            title: "Failed to Create Phase",
            message: errData.message || JSON.stringify(errData) || response.statusText
          });
        }
      } else if (type === "create-module") {
        const parentPhase = phases.find(p => p.id === phaseId);
        const modIndex = parentPhase ? (parentPhase.modules || []).length + 1 : 1;

        const response = await fetch(`${baseURL}/api/modules/admin`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({
            title,
            phaseId,
            index: modIndex,
            description,
            estimateTime: "12 hours"
          })
        });
        if (response.ok) {
          await fetchCurriculum();
          setExpandedPhases(prev => ({ ...prev, [phaseId!]: true }));
          setCurriculumModal(null);
          setStatusMessage({
            type: "success",
            title: "Success",
            message: "Module created successfully"
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          setStatusMessage({
            type: "error",
            title: "Failed to Create Module",
            message: errData.message || JSON.stringify(errData) || response.statusText
          });
        }
      } else if (type === "create-submodule") {
        let subIndex = 1;
        for (const p of phases) {
          if (p.modules) {
            const m = p.modules.find((mod: any) => mod.id === moduleId);
            if (m) {
              subIndex = (m.submodules || []).length + 1;
              break;
            }
          }
        }

        const response = await fetch(`${baseURL}/api/submodules/admin`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({
            title,
            moduleId,
            index: subIndex,
            description,
            estimatedTime,
            contentFile
          })
        });
        if (response.ok) {
          await fetchCurriculum();
          setExpandedModules(prev => ({ ...prev, [moduleId!]: true }));
          setCurriculumModal(null);
          setStatusMessage({
            type: "success",
            title: "Success",
            message: "Submodule created successfully"
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          setStatusMessage({
            type: "error",
            title: "Failed to Create Submodule",
            message: errData.message || JSON.stringify(errData) || response.statusText
          });
        }
      }
    } catch (error: any) {
      console.error(`Error submitting form for ${type}:`, error);
      setStatusMessage({
        type: "error",
        title: "Error Occurred",
        message: error.message || String(error)
      });
    }
  };

  const handleDeletePhase = (phaseId: string, title: string) => {
    setDeleteConfirmation({
      type: "Phase",
      id: phaseId,
      title
    });
  };

  const handleDeleteModule = (phaseId: string, moduleId: number | string, title: string) => {
    setDeleteConfirmation({
      type: "Module",
      id: String(moduleId),
      phaseId,
      title
    });
  };

  const handleDeleteSubmodule = (phaseId: string, moduleId: number | string, subId: string, title: string) => {
    setDeleteConfirmation({
      type: "Submodule",
      id: subId,
      phaseId,
      moduleId,
      title
    });
  };

  const executeDeletePhase = async (phaseId: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Pragma": "no-cache"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/phases/admin/${phaseId}`, {
        method: "DELETE",
        credentials: "include",
        headers
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          title: "Deleted Successfully",
          message: "Phase and all related modules and submodules deleted successfully"
        });
        await fetchCurriculum();
      } else {
        const errData = await response.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          title: "Delete Failed",
          message: errData.message || JSON.stringify(errData) || response.statusText || "Failed to delete phase"
        });
      }
    } catch (error: any) {
      console.error("Error deleting phase:", error);
      setStatusMessage({
        type: "error",
        title: "Error Occurred",
        message: error.message || String(error)
      });
    }
  };

  const executeDeleteModule = async (phaseId: string, moduleId: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Pragma": "no-cache"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/modules/admin/${moduleId}`, {
        method: "DELETE",
        credentials: "include",
        headers
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          title: "Deleted Successfully",
          message: "Module and all related submodules deleted successfully"
        });
        await fetchCurriculum();
      } else {
        const errData = await response.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          title: "Delete Failed",
          message: errData.message || JSON.stringify(errData) || response.statusText || "Failed to delete module"
        });
      }
    } catch (error: any) {
      console.error("Error deleting module:", error);
      setStatusMessage({
        type: "error",
        title: "Error Occurred",
        message: error.message || String(error)
      });
    }
  };

  const executeDeleteSubmodule = async (phaseId: string, moduleId: string | number, subId: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Pragma": "no-cache"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/submodules/admin/${subId}`, {
        method: "DELETE",
        credentials: "include",
        headers
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          title: "Deleted Successfully",
          message: "Submodule deleted successfully"
        });
        await fetchCurriculum();
      } else {
        const errData = await response.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          title: "Delete Failed",
          message: errData.message || JSON.stringify(errData) || response.statusText || "Failed to delete submodule"
        });
      }
    } catch (error: any) {
      console.error("Error deleting submodule:", error);
      setStatusMessage({
        type: "error",
        title: "Error Occurred",
        message: error.message || String(error)
      });
    }
  };

  const handleEdit = (type: string, title: string, phaseId: string, moduleId?: number | string, subId?: string) => {
    let description = "";
    let estimatedTime = "";
    let contentFile = "";
    let index = 1;
    let parentId = "";

    if (type === "Phase" || type === "Assessment") {
      const phase = phases.find(p => p.id === phaseId);
      if (phase) {
        description = phase.description || "";
        estimatedTime = phase.estimatedTime || "";
        index = phase.index || 1;
        parentId = phase.courseId || "6a1a8a4b72fa89699a4f016a";
      }
    } else if (type === "Module") {
      const phase = phases.find(p => p.id === phaseId);
      const mod = phase?.modules?.find((m: any) => m.id === moduleId);
      if (mod) {
        description = mod.description || "";
        index = mod.index || 1;
        parentId = phaseId;
      }
    } else if (type === "Submodule") {
      const phase = phases.find(p => p.id === phaseId);
      const mod = phase?.modules?.find((m: any) => m.id === moduleId);
      const sub = mod?.submodules?.find((s: any) => s.id === subId);
      if (sub) {
        description = sub.description || "";
        estimatedTime = sub.estimatedTime || "";
        contentFile = sub.contentFile || "";
        index = sub.index || 1;
        parentId = String(moduleId);
      }
    }

    setEditingItem({
      type,
      title,
      phaseId,
      moduleId,
      subId,
      description,
      estimatedTime,
      contentFile,
      index,
      parentId
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !editingItem.title.trim()) return;

    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Pragma": "no-cache"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (editingItem.type === "Phase") {
        const response = await fetch(`${baseURL}/api/phases/admin/${editingItem.phaseId}`, {
          method: "PATCH",
          credentials: "include",
          headers,
          body: JSON.stringify({
            title: editingItem.title,
            description: editingItem.description,
            estimatedTime: editingItem.estimatedTime,
            index: editingItem.index
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || response.statusText || "Failed to update phase");
        }
      } else if (editingItem.type === "Module") {
        const response = await fetch(`${baseURL}/api/modules/admin/${editingItem.moduleId}`, {
          method: "PATCH",
          credentials: "include",
          headers,
          body: JSON.stringify({
            title: editingItem.title,
            description: editingItem.description,
            index: editingItem.index
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || response.statusText || "Failed to update module");
        }
      } else if (editingItem.type === "Submodule") {
        const response = await fetch(`${baseURL}/api/submodules/admin/${editingItem.subId}`, {
          method: "PATCH",
          credentials: "include",
          headers,
          body: JSON.stringify({
            title: editingItem.title,
            description: editingItem.description,
            estimatedTime: editingItem.estimatedTime,
            contentFile: editingItem.contentFile,
            index: editingItem.index
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || response.statusText || "Failed to update submodule");
        }
      }

      await fetchCurriculum();
      setEditingItem(null);
    } catch (error: any) {
      console.error("Error saving edits:", error);
      setStatusMessage({
        type: "error",
        title: "Update Failed",
        message: `Error updating ${editingItem.type}: ${error.message || error}`
      });
    }
  };

  return (
    <DashboardShell role={role} title={title}>
      {isAdmin ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[var(--text)]">Curriculum Management</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Manage your curriculum phases, modules, and submodules.</p>
            </div>
            <button
              onClick={handleAddPhase}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-mst-red to-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all"
            >
              <Plus className="h-4 w-4" /> Create Phase
            </button>
          </div>

          {loadingCurriculum ? (
            <div className="flex items-center justify-center p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
            </div>
          ) : phases.length === 0 ? (
            <div className="text-center p-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50">
              <p className="text-sm font-medium text-[var(--text-muted)]">No phases found. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {phases.map(phase => (
                <div key={phase.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(227,30,36,0.05)]">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--border)]/30 transition-colors"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedPhases[phase.id] ? <ChevronDown className="h-5 w-5 text-mst-red transition-transform" /> : <ChevronRight className="h-5 w-5 text-[var(--text-muted)] transition-transform" />}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${phase.gradient} shadow-inner`}>
                        <LayoutList className={`h-5 w-5 ${phase.color}`} />
                      </div>
                      <h3 className="text-base font-black tracking-tight text-[var(--text)]">{phase.title}</h3>
                    </div>
                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleAddModule(phase.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--border)]/50 to-[var(--border)]/20 px-3 py-1.5 text-xs font-bold text-[var(--text)] shadow-sm hover:from-mst-red/20 hover:to-mst-red/5 hover:text-mst-red transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Module
                      </button>
                      <button onClick={() => handleEdit("Phase", phase.title, phase.id)} className="p-1.5 text-[var(--text-muted)] hover:text-purple-500 rounded-lg hover:bg-purple-500/10 transition">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeletePhase(phase.id, phase.title)} className="p-1.5 text-[var(--text-muted)] hover:text-mst-red rounded-lg hover:bg-mst-red/10 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {expandedPhases[phase.id] && (
                    <div className="border-t border-[var(--border)] bg-[var(--bg)]/40 p-5 space-y-3">
                      {phase.modules.length === 0 ? (
                        <p className="text-sm font-medium text-[var(--text-muted)] pl-[4.25rem] py-2">No modules yet. Add one to get started.</p>
                      ) : (
                        phase.modules.map((mod: any) => (
                          <div key={mod.id} className="ml-[4.25rem] rounded-xl border border-[var(--border)]/60 bg-[var(--surface)] shadow-sm overflow-hidden transition-all hover:border-[var(--border)]">
                            <div
                              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                              onClick={() => toggleModule(mod.id)}
                            >
                              <div className="flex items-center gap-3">
                                {expandedModules[mod.id] ? <ChevronDown className="h-4 w-4 text-purple-500 transition-transform" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)] transition-transform" />}
                                <BookOpen className="h-4 w-4 text-purple-400" />
                                <span className="font-bold text-sm text-[var(--text)]">{mod.title}</span>
                              </div>
                              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => handleAddSubmodule(phase.id, mod.id)}
                                  className="flex items-center gap-1 rounded-md bg-[var(--border)]/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] hover:bg-purple-500/10 hover:text-purple-500 transition-all"
                                >
                                  <Plus className="h-3 w-3" /> Submodule
                                </button>
                                <button onClick={() => handleEdit("Module", mod.title, phase.id, mod.id)} className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 rounded-md hover:bg-blue-500/10 transition">
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleDeleteModule(phase.id, mod.id, mod.title)} className="p-1.5 text-[var(--text-muted)] hover:text-mst-red rounded-md hover:bg-mst-red/10 transition">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {expandedModules[mod.id] && (
                              <div className="border-t border-[var(--border)]/40 bg-gradient-to-b from-[var(--bg)]/50 to-transparent p-2 pl-[2.25rem] space-y-1">
                                {mod.submodules.length === 0 ? (
                                  <p className="text-xs font-medium text-[var(--text-muted)] py-2">No submodules added.</p>
                                ) : (
                                  mod.submodules.map((sub: any) => (
                                    <div key={sub.id} className="group flex items-center justify-between rounded-lg p-2.5 hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)]/60 transition-all">
                                      <div className="flex items-start gap-2.5">
                                        <FileText className="h-3.5 w-3.5 text-emerald-500 mt-0.5" />
                                        <div>
                                          <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors block">{sub.title}</span>
                                          {sub.description && (
                                            <p className="text-xs text-[var(--text-muted)]/70 mt-0.5">{sub.description}</p>
                                          )}
                                          {(sub.estimatedTime || sub.contentFile) && (
                                            <div className="flex gap-2 mt-1 text-[10px] text-[var(--text-muted)]/50">
                                              {sub.estimatedTime && <span>⏱️ {sub.estimatedTime}</span>}
                                              {sub.contentFile && <span>📄 {sub.contentFile}</span>}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit("Submodule", sub.title, phase.id, mod.id, sub.id)} className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 rounded-md hover:bg-blue-500/10 transition">
                                          <Edit2 className="h-3 w-3" />
                                        </button>
                                        <button onClick={() => handleDeleteSubmodule(phase.id, mod.id, sub.id, sub.title)} className="p-1.5 text-[var(--text-muted)] hover:text-mst-red rounded-md hover:bg-mst-red/10 transition">
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Assessment Management */}
          <div className="pt-8 mt-8 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-[var(--text)]">Assessment Management</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Manage questions and assessments for your curriculum submodules.</p>
              </div>
            </div>

            <div className="space-y-4">
              {phases.map(phase => (
                <div key={`assess-phase-${phase.id}`} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(227,30,36,0.05)]">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--border)]/30 transition-colors"
                    onClick={() => togglePhase(`assess-${phase.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedPhases[`assess-${phase.id}`] ? <ChevronDown className="h-5 w-5 text-mst-red transition-transform" /> : <ChevronRight className="h-5 w-5 text-[var(--text-muted)] transition-transform" />}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${phase.gradient} shadow-inner`}>
                        <LayoutList className={`h-5 w-5 ${phase.color}`} />
                      </div>
                      <h3 className="text-base font-black tracking-tight text-[var(--text)]">{phase.title}</h3>
                    </div>
                  </div>

                  {expandedPhases[`assess-${phase.id}`] && (
                    <div className="border-t border-[var(--border)] bg-[var(--bg)]/40 p-5 space-y-3">
                      {phase.modules.length === 0 ? (
                        <p className="text-sm font-medium text-[var(--text-muted)] pl-[4.25rem] py-2">No modules available.</p>
                      ) : (
                        phase.modules.map((mod: any) => (
                          <div key={`assess-mod-${mod.id}`} className="ml-[4.25rem] rounded-xl border border-[var(--border)]/60 bg-[var(--surface)] shadow-sm overflow-hidden transition-all hover:border-[var(--border)]">
                            <div
                              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                              onClick={() => toggleModule(`assess-${mod.id}`)}
                            >
                              <div className="flex items-center gap-3">
                                {expandedModules[`assess-${mod.id}`] ? <ChevronDown className="h-4 w-4 text-purple-500 transition-transform" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)] transition-transform" />}
                                <BookOpen className="h-4 w-4 text-purple-400" />
                                <span className="font-bold text-sm text-[var(--text)]">{mod.title}</span>
                              </div>
                            </div>

                            {expandedModules[`assess-${mod.id}`] && (
                              <div className="border-t border-[var(--border)]/40 bg-gradient-to-b from-[var(--bg)]/50 to-transparent p-2 pl-[2.25rem] space-y-2">
                                {mod.submodules.length === 0 ? (
                                  <p className="text-xs font-medium text-[var(--text-muted)] py-2">No submodules added.</p>
                                ) : (
                                  mod.submodules.map((sub: any) => (
                                    <div key={`assess-sub-${sub.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl p-3 sm:p-4 bg-[var(--surface)] border border-[var(--border)]/60 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/5 transition-all">
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-2">
                                          <FileText className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <div>
                                          <span className="block text-sm font-bold text-[var(--text)]">{sub.title}</span>
                                          <span className="mt-1 flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                                            <span className={`flex items-center gap-1 ${sub.hasAssessment ? 'text-emerald-500' : 'text-orange-500'}`}>
                                              <span className="relative flex h-2 w-2">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${sub.hasAssessment ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${sub.hasAssessment ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                                              </span>
                                              {sub.hasAssessment ? 'Assessment Enabled' : 'No Assessment'}
                                            </span>
                                            • {sub.questionsCount || 0} Questions
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 self-end sm:self-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                          onClick={() => handleAddQuestion(sub.id)}
                                          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-mst-red/30 hover:bg-mst-red/10 hover:text-mst-red transition-all shadow-sm"
                                        >
                                          <Plus className="h-3.5 w-3.5" /> Add Question
                                        </button>
                                        <button
                                          onClick={() => handleEdit("Assessment", sub.title, phase.id, mod.id, sub.id)}
                                          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500 transition-all shadow-sm"
                                        >
                                          <Edit2 className="h-3.5 w-3.5" /> Edit
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeHash === "#refer" ? (
        <ReferAndEarnTab
          referralCode={referralCode}
          referralLink={referralLink}
          referralRecords={referralRecords}
          successfulReferrals={successfulReferrals}
          withdrawUnlocked={withdrawUnlocked}
        />
      ) : activeHash === "#profile" ? (
        <StudentProfile user={user} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm min-h-[400px]">
          <div className="rounded-2xl bg-mst-red/10 p-4">
            <BookOpen className="h-10 w-10 text-mst-red" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-[var(--text)]">{title}</h2>
          <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)]">Welcome to the {title}. Curriculum will appear here.</p>
        </div>
      )}

      {/* Add Question Modal */}
      {addingQuestionTo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-6 bg-[var(--bg)]/50">
              <div>
                <h3 className="text-xl font-black text-[var(--text)]">Add Assessment Question</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Create a new multiple-choice question for this sub-module.</p>
              </div>
              <button
                onClick={() => setAddingQuestionTo(null)}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--text)]">Question Text</label>
                <textarea
                  value={newQuestion.text}
                  onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all min-h-[100px]"
                  placeholder="e.g., What was the primary purpose of the ARPANET?"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-[var(--text)]">Answer Options</label>
                <div className="space-y-3">
                  {newQuestion.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl border p-2 pl-4 transition-all ${newQuestion.correctOption === idx ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-[var(--border)] bg-[var(--bg)] focus-within:border-purple-500/50 focus-within:ring-4 focus-within:ring-purple-500/10'}`}
                    >
                      <button
                        type="button"
                        onClick={() => setNewQuestion({ ...newQuestion, correctOption: idx })}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${newQuestion.correctOption === idx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-[var(--text-muted)] hover:border-[var(--text)]'}`}
                      >
                        {newQuestion.correctOption === idx && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>
                      <span className="text-xs font-black uppercase text-[var(--text-muted)] w-4 text-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const newOpts = [...newQuestion.options];
                          newOpts[idx] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: newOpts });
                        }}
                        className="flex-1 bg-transparent py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:outline-none"
                        placeholder={`Option ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Select the circle next to the correct answer.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] p-6 bg-[var(--bg)]/50">
              <button
                onClick={() => setAddingQuestionTo(null)}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                className="flex items-center gap-2 rounded-xl bg-mst-red px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 transition-all"
              >
                <Save className="h-4 w-4" />
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Title Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5 bg-[var(--bg)]/50">
              <h3 className="text-lg font-black text-[var(--text)]">Edit {editingItem.type}</h3>
              <button onClick={() => setEditingItem(null)} className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[var(--text)]">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  autoFocus
                />
              </div>

              {(editingItem.type === "Phase" || editingItem.type === "Module" || editingItem.type === "Submodule") && (
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[var(--text)]">Description</label>
                  <textarea
                    value={editingItem.description || ""}
                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[80px]"
                    placeholder="Enter description..."
                  />
                </div>
              )}

              {(editingItem.type === "Phase" || editingItem.type === "Submodule") && (
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[var(--text)]">Estimated Time</label>
                  <input
                    type="text"
                    value={editingItem.estimatedTime || ""}
                    onChange={e => setEditingItem({ ...editingItem, estimatedTime: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="e.g., 3 weeks or 45 minutes"
                  />
                </div>
              )}

              {editingItem.type === "Submodule" && (
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[var(--text)]">Content File URL / Path</label>
                  <input
                    type="text"
                    value={editingItem.contentFile || ""}
                    onChange={e => setEditingItem({ ...editingItem, contentFile: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="e.g., phase1/intro.md"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] p-5 bg-[var(--bg)]/50">
              <button onClick={() => setEditingItem(null)} className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="flex items-center gap-2 rounded-xl bg-mst-red px-5 py-2 text-sm font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 transition-all">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Modal */}
      {curriculumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5 bg-[var(--bg)]/50">
              <h3 className="text-lg font-black text-[var(--text)]">
                {curriculumModal.type === "create-phase" && "Create New Phase"}
                {curriculumModal.type === "create-module" && "Create New Module"}
                {curriculumModal.type === "create-submodule" && "Create New Submodule"}
              </h3>
              <button
                onClick={() => setCurriculumModal(null)}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} noValidate>
              <div className="p-4 sm:p-5 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[var(--text)]">Title</label>
                  <input
                    type="text"
                    required
                    value={curriculumModal.title}
                    onChange={e => setCurriculumModal({ ...curriculumModal, title: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2.5 text-xs text-[var(--text)] focus:border-mst-red/50 focus:outline-none focus:ring-4 focus:ring-mst-red/10 transition-all"
                    placeholder="e.g., Intro to Ethereum"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[var(--text)]">Description</label>
                  <textarea
                    required
                    value={curriculumModal.description}
                    onChange={e => setCurriculumModal({ ...curriculumModal, description: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2.5 text-xs text-[var(--text)] focus:border-mst-red/50 focus:outline-none focus:ring-4 focus:ring-mst-red/10 transition-all min-h-[50px] h-12"
                    placeholder="Enter description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(curriculumModal.type === "create-phase" || curriculumModal.type === "create-submodule") && (
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[var(--text)]">Estimated Time</label>
                      <input
                        type="text"
                        required
                        value={curriculumModal.estimatedTime}
                        onChange={e => setCurriculumModal({ ...curriculumModal, estimatedTime: e.target.value })}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2.5 text-xs text-[var(--text)] focus:border-mst-red/50 focus:outline-none focus:ring-4 focus:ring-mst-red/10 transition-all"
                        placeholder="e.g., 30 minutes"
                      />
                    </div>
                  )}

                  {curriculumModal.type === "create-submodule" && (
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">Manual File Path</label>
                      <input
                        type="text"
                        value={curriculumModal.contentFile}
                        onChange={e => setCurriculumModal({ ...curriculumModal, contentFile: e.target.value })}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2.5 text-xs text-[var(--text)] focus:border-mst-red/50 focus:outline-none focus:ring-4 focus:ring-mst-red/10 transition-all"
                        placeholder="e.g., variables.md"
                      />
                    </div>
                  )}
                </div>

                {curriculumModal.type === "create-submodule" && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[var(--text)]">Content File Upload</label>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-1 items-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/50 px-4 py-2.5 text-left cursor-pointer hover:bg-[var(--border)]/10 hover:border-mst-red/40 transition-all">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mst-red/10 text-mst-red shrink-0">
                          <Upload className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-[var(--text)] truncate">
                            {curriculumModal.contentFile ? `Selected: ${curriculumModal.contentFile}` : "Upload file (.md, .html)"}
                          </span>
                          <span className="block text-[9px] text-[var(--text-muted)]">
                            Click to select
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".md,.html,.txt,.json"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCurriculumModal({ ...curriculumModal, contentFile: file.name });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] p-4 bg-[var(--bg)]/50">
                <button
                  type="button"
                  onClick={() => setCurriculumModal(null)}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-mst-red px-5 py-2 text-sm font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5 bg-[var(--bg)]/50">
              <h3 className="text-lg font-black text-[var(--text)]">Delete {deleteConfirmation.type}</h3>
              <button onClick={() => setDeleteConfirmation(null)} className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Are you sure you want to delete the {deleteConfirmation.type.toLowerCase()}{" "}
                <strong className="text-[var(--text)]">"{deleteConfirmation.title}"</strong>?
                {deleteConfirmation.type === "Phase" && " All related modules and submodules will also be permanently deleted."}
                {deleteConfirmation.type === "Module" && " All related submodules will also be permanently deleted."}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] p-5 bg-[var(--bg)]/50">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const { type, id, phaseId, moduleId } = deleteConfirmation;
                  setDeleteConfirmation(null);
                  if (type === "Phase") {
                    await executeDeletePhase(id);
                  } else if (type === "Module") {
                    await executeDeleteModule(phaseId!, id);
                  } else if (type === "Submodule") {
                    await executeDeleteSubmodule(phaseId!, moduleId!, id);
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-mst-red px-5 py-2 text-sm font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 transition-all"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Message Modal */}
      {statusMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--border)]">
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                ) : (
                  <X className="h-6 w-6 text-mst-red" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--text)]">{statusMessage.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">{statusMessage.message}</p>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="w-full rounded-xl bg-mst-red py-2.5 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
