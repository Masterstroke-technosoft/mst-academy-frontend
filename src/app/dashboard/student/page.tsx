"use client";

import { useAuth } from "@/components/AuthProvider";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, BookOpen, ChevronDown, ChevronRight, FileText, LayoutList, X, Save, CheckCircle2, Upload } from "lucide-react";
import { ReferAndEarnTab } from "@/components/dashboard/ReferAndEarnTab";
import { StudentProfile } from "@/components/dashboard/StudentProfile";
import { getCurriculum } from "@/lib/curriculum";
import { StudentCommandCenter } from "@/components/dashboard/StudentCommandCenter";

export default function StudentDashboardPage({
  role = "student",
  title = "Student Hub"
}: {
  role?: "student" | "validator" | "non-validator" | "working-professional",
  title?: string
} = {}) {
  const { user, ready, isAdmin } = useAuth();

  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHash = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  let referralRecords = [
    // { name: "Riya S.", joinedAt: "12 May 2026", status: "Completed course", eligible: true },
    // { name: "Aman K.", joinedAt: "14 May 2026", status: "Completed course", eligible: true },
    // { name: "Neha P.", joinedAt: "16 May 2026", status: "In progress", eligible: false },
    // { name: "Vikram T.", joinedAt: "18 May 2026", status: "Completed course", eligible: true },
    // { name: "Priya M.", joinedAt: "21 May 2026", status: "Completed course", eligible: true },
    // { name: "Rohit D.", joinedAt: "24 May 2026", status: "Completed course", eligible: true },
  ] as { name: string; joinedAt: string; status: string; eligible: boolean }[];
  const referralCode = user ? `MST-${user.id.slice(-6).toUpperCase()}` : "";
  const referralLink = user ? `https://masterstroke.academy/register?ref=${referralCode}` : "";
  // let [referralRecords, setReferralRecords] = useState([]);

  // api call 
  const [userBankDetails, setUserBankDetails] = useState<any>(null);

  useEffect(() => {
    async function BankUser() {
      if (!user) return;
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        const response = await fetch(`${baseURL}/api/bank-details/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "x-user-id": user.id,
            "x-user-email": user.email,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Response Status : ${response.status}`);
        }
        const result = await response.json();
        setUserBankDetails(result);
        console.log("sssssssssssssssssss", result);
      } catch (error: any) {
        console.error(error?.message ?? error);
      }
    }

    if (user) {
      BankUser();
    }
  }, [user]);



  // setReferralRecords()

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
      const courseId = "6a2934912b48a13769669f8e";
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

  // Assessment integration states
  const [editingAssessment, setEditingAssessment] = useState<any | null>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState<{
    text: string;
    options: string[];
    correctOptionIndex: number;
    marks: number;
    type: string;
    explanation: string;
  } | null>(null);
  const [customConfirm, setCustomConfirm] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [activeDropdownSubmoduleId, setActiveDropdownSubmoduleId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".add-question-container")) {
        return;
      }
      setActiveDropdownSubmoduleId(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const [editingItem, setEditingItem] = useState<{
    type: string;
    title: string;
    phaseId: string;
    moduleId?: number | string;
    subId?: string;
    description?: string;
    estimatedTime?: string;
    contentFile?: string;
    contentFileUpload?: File | null;
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
    contentFileUpload?: File | null;
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
    console.log("togglePhase")
    if (isExpanding && !id.startsWith("assess-")) {
      await fetchPhaseFull(id);
    }
  };

  const toggleModule = (id: string | number) => {
    console.log("toggleModule")
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubmodule = () => {
    console.log("ToggleSubmodule")
  }

  const handleOpenAssessment = async (submoduleId: string, submoduleTitle: string, openAddQuestionDirectly = false, setNum = 1) => {
    try {
      setLoadingAssessment(true);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/assignments/admin/submodule/${submoduleId}`, {
        method: "GET",
        credentials: "include",
        headers
      });

      let loadedAssessment: any = null;
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const raw = data.find((a: any) => a.setNumber === setNum);
          if (raw) {
            const parsedQuestions = (raw.questions || []).map((q: any, qIdx: number) => {
              const text = q.text || q.question_text || "";
              const type = q.type || "mcq";
              const marks = q.marks || 1;
              const explanation = q.explanation || "";

              let options: string[] = ["", "", "", ""];
              let correctOptionIndex = 0;

              if (Array.isArray(q.options)) {
                q.options.forEach((opt: any, idx: number) => {
                  if (idx < 4) {
                    if (typeof opt === "string") {
                      const prefixPattern = /^[A-D]\.\s*/;
                      options[idx] = opt.replace(prefixPattern, "");
                    } else if (opt && typeof opt === "object") {
                      options[idx] = opt.text || "";
                      if (opt.isCorrect) {
                        correctOptionIndex = idx;
                      }
                    }
                  }
                });
              }

              const correctLetter = q.correctAnswer || q.correct_answer || "A";
              const letterCode = correctLetter.charCodeAt(0) - 65;
              if (letterCode >= 0 && letterCode < 4) {
                correctOptionIndex = letterCode;
              }

              return {
                id: q.id || q._id || `q-${qIdx}-${Date.now()}`,
                number: qIdx,
                type,
                marks,
                text,
                options,
                correctOptionIndex,
                explanation
              };
            });

            loadedAssessment = {
              ...raw,
              questions: parsedQuestions
            };
          }
        }
      }

      if (!loadedAssessment) {
        loadedAssessment = {
          submoduleId,
          setNumber: setNum,
          title: `${submoduleTitle} Assignment - Set ${setNum}`,
          estimatedTime: 30,
          questions: []
        };
      }

      setEditingAssessment({
        ...loadedAssessment,
        submoduleTitle
      });

      if (openAddQuestionDirectly) {
        setQuestionForm({
          text: "",
          options: ["", "", "", ""],
          correctOptionIndex: 0,
          marks: 1,
          type: "mcq",
          explanation: ""
        });
        setActiveQuestionIndex(loadedAssessment.questions.length);
      }
    } catch (error) {
      console.error("Error fetching assessment:", error);
      setStatusMessage({
        type: "error",
        title: "Error Loading Assessment",
        message: "Failed to fetch assessment from the server."
      });
    } finally {
      setLoadingAssessment(false);
    }
  };

  const executeCreateAssessment = async (payload: any) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/assignments`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        setStatusMessage({
          type: "success",
          title: "Assessment Created",
          message: responseData.message || "Assessment saved successfully."
        });
        setEditingAssessment(null);
        await fetchCurriculum();
      } else {
        const errData = await response.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          title: "Save Failed",
          message: errData.message || response.statusText || "Failed to create assessment"
        });
      }
    } catch (error: any) {
      console.error("Error creating assessment:", error);
      setStatusMessage({
        type: "error",
        title: "Error Saving Assessment",
        message: error.message || String(error)
      });
    }
  };

  const executeUpdateAssessment = async (assignmentId: string, payload: any) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/assignments/${assignmentId}`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        setStatusMessage({
          type: "success",
          title: "Assessment Updated",
          message: responseData.message || "Assessment saved successfully."
        });
        setEditingAssessment(null);
        await fetchCurriculum();
      } else {
        const errData = await response.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          title: "Save Failed",
          message: errData.message || response.statusText || "Failed to update assessment"
        });
      }
    } catch (error: any) {
      console.error("Error updating assessment:", error);
      setStatusMessage({
        type: "error",
        title: "Error Saving Assessment",
        message: error.message || String(error)
      });
    }
  };

  const handleSaveAssessment = async () => {
    if (!editingAssessment) return;
    if (!editingAssessment.title.trim()) {
      setStatusMessage({
        type: "error",
        title: "Validation Error",
        message: "Please enter a title for the assessment."
      });
      return;
    }

    const payload = {
      submoduleId: editingAssessment.submoduleId,
      setNumber: editingAssessment.setNumber || 1,
      title: editingAssessment.title,
      estimatedTime: Number(editingAssessment.estimatedTime) || 30,
      questions: editingAssessment.questions.map((q: any, idx: number) => {
        const correctLetter = String.fromCharCode(65 + q.correctOptionIndex);
        return {
          id: q.id || `q-${idx + 1}`,
          number: idx,
          type: q.type || "mcq",
          marks: Number(q.marks) || 1,
          text: q.text || q.question_text || "",
          options: q.options.map((optVal: string, optIdx: number) => {
            const letter = String.fromCharCode(65 + optIdx);
            return {
              key: letter,
              text: optVal,
              isCorrect: q.correctOptionIndex === optIdx
            };
          }),
          correctAnswer: correctLetter,
          explanation: q.explanation || ""
        };
      })
    };

    if (editingAssessment._id) {
      await executeUpdateAssessment(editingAssessment._id, payload);
    } else {
      await executeCreateAssessment(payload);
    }
  };

  const executeDeleteAssignment = async (assignmentId: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
        headers
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          title: "Deleted Successfully",
          message: "Assessment deleted successfully"
        });
        setEditingAssessment(null);
        await fetchCurriculum();
      } else {
        const errData = await response.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          title: "Delete Failed",
          message: errData.message || response.statusText || "Failed to delete assessment"
        });
      }
    } catch (error: any) {
      console.error("Error deleting assessment:", error);
      setStatusMessage({
        type: "error",
        title: "Error Occurred",
        message: error.message || String(error)
      });
    }
  };

  const handleDeleteAssessment = async () => {
    const id = editingAssessment?._id || editingAssessment?.id;
    if (!editingAssessment || !id) {
      setStatusMessage({
        type: "error",
        title: "Delete Cancelled",
        message: "No assessment ID was found to delete."
      });
      return;
    }

    setCustomConfirm({
      title: "Delete Assessment",
      message: `Are you sure you want to delete the assessment "${editingAssessment.title}"?`,
      onConfirm: async () => {
        setCustomConfirm(null);
        await executeDeleteAssignment(id);
      }
    });
  };

  const handleDeleteAssessmentFromList = async (submoduleId: string, submoduleTitle: string) => {
    setCustomConfirm({
      title: "Delete Assessment",
      message: `Are you sure you want to delete the assessment for "${submoduleTitle}"?`,
      onConfirm: async () => {
        setCustomConfirm(null);
        try {
          setLoadingAssessment(true);
          const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
          const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const getRes = await fetch(`${baseURL}/api/assignments/admin/submodule/${submoduleId}`, {
            method: "GET",
            credentials: "include",
            headers
          });

          if (getRes.ok) {
            const data = await getRes.json();
            if (Array.isArray(data) && data.length > 0) {
              const assignmentId = data[0]._id || data[0].id;
              await executeDeleteAssignment(assignmentId);
            } else {
              setStatusMessage({
                type: "error",
                title: "Not Found",
                message: "No assessment found to delete."
              });
            }
          } else {
            setStatusMessage({
              type: "error",
              title: "Fetch Failed",
              message: "Failed to locate the assessment details."
            });
          }
        } catch (error: any) {
          console.error("Error deleting assessment:", error);
          setStatusMessage({
            type: "error",
            title: "Error Occurred",
            message: error.message || String(error)
          });
        } finally {
          setLoadingAssessment(false);
        }
      }
    });
  };

  const handleSaveQuestionForm = () => {
    if (!questionForm) return;
    if (!questionForm.text.trim()) {
      setStatusMessage({
        type: "error",
        title: "Validation Error",
        message: "Please enter question text."
      });
      return;
    }
    if (questionForm.options.some(opt => !opt.trim())) {
      setStatusMessage({
        type: "error",
        title: "Validation Error",
        message: "Please fill in all 4 options."
      });
      return;
    }

    const updatedQuestions = [...(editingAssessment?.questions || [])];
    const newQ = {
      id: updatedQuestions[activeQuestionIndex!]?.id || `q-${Date.now()}`,
      number: activeQuestionIndex!,
      type: questionForm.type || "mcq",
      marks: Number(questionForm.marks) || 1,
      text: questionForm.text,
      options: [...questionForm.options],
      correctOptionIndex: questionForm.correctOptionIndex,
      explanation: questionForm.explanation
    };

    if (activeQuestionIndex! < updatedQuestions.length) {
      updatedQuestions[activeQuestionIndex!] = newQ;
    } else {
      updatedQuestions.push(newQ);
    }

    setEditingAssessment({
      ...editingAssessment,
      questions: updatedQuestions
    });

    setQuestionForm(null);
    setActiveQuestionIndex(null);
  };

  const handleDeleteQuestion = (indexToDelete: number) => {
    setCustomConfirm({
      title: "Delete Question",
      message: "Are you sure you want to delete this question from the assessment?",
      onConfirm: () => {
        setCustomConfirm(null);
        const updatedQuestions = editingAssessment.questions
          .filter((_: any, idx: number) => idx !== indexToDelete)
          .map((q: any, idx: number) => ({
            ...q,
            number: idx
          }));

        setEditingAssessment({
          ...editingAssessment,
          questions: updatedQuestions
        });
      }
    });
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
        const courseId = "6a2934912b48a13769669f8e";
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

        const formData = new FormData();
        formData.append("moduleId", String(moduleId));
        formData.append("index", String(subIndex));
        formData.append("title", title);
        formData.append("description", description);
        formData.append("estimatedTime", estimatedTime);
        if (curriculumModal.contentFileUpload) {
          formData.append("contentFile", curriculumModal.contentFileUpload);
        }

        const uploadHeaders: Record<string, string> = {
          "Cache-Control": "no-store",
          "Pragma": "no-cache",
        };
        if (token) {
          uploadHeaders["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${baseURL}/api/submodules/admin`, {
          method: "POST",
          credentials: "include",
          headers: uploadHeaders,
          body: formData,
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
        parentId = phase.courseId || "6a2934912b48a13769669f8e";
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
        const formData = new FormData();
        formData.append("title", editingItem.title);
        formData.append("description", editingItem.description || "");
        formData.append("estimatedTime", editingItem.estimatedTime || "");
        formData.append("index", String(editingItem.index ?? 1));
        if (editingItem.contentFileUpload) {
          formData.append("contentFile", editingItem.contentFileUpload);
        }

        const uploadHeaders: Record<string, string> = {
          "Cache-Control": "no-store",
          "Pragma": "no-cache",
        };
        if (token) {
          uploadHeaders["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${baseURL}/api/submodules/admin/${editingItem.subId}`, {
          method: "PATCH",
          credentials: "include",
          headers: uploadHeaders,
          body: formData,
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

  if (ready && user && !isAdmin) {
    const curriculum = getCurriculum();
    return <StudentCommandCenter curriculum={curriculum} />;
  }

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
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <div className="relative add-question-container">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveDropdownSubmoduleId(activeDropdownSubmoduleId === sub.id ? null : sub.id);
                                            }}
                                            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-black hover:border-mst-red/30 hover:bg-mst-red/10 hover:text-mst-red transition-all shadow-sm"
                                          >
                                            <Plus className="h-3.5 w-3.5" /> Add Question
                                          </button>
                                          {activeDropdownSubmoduleId === sub.id && (
                                            <div className="absolute right-0 mt-1.5 z-50 w-32 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl py-1 text-xs text-[var(--text)] overflow-hidden">
                                              {[...Array(10)].map((_, i) => {
                                                const setNum = i + 1;
                                                return (
                                                  <button
                                                    key={setNum}
                                                    onClick={async (e) => {
                                                      e.stopPropagation();
                                                      setActiveDropdownSubmoduleId(null);
                                                      await handleOpenAssessment(sub.id, sub.title, true, setNum);
                                                    }}
                                                    className="w-full text-left px-3 py-2 hover:bg-[var(--border)]/30 font-semibold transition-colors text-[var(--text)]"
                                                  >
                                                    Set {setNum}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                        {/* <button
                                          onClick={() => handleOpenAssessment(sub.id, sub.title, false)}
                                          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-black hover:border-mst-red/30 hover:bg-mst-red/10 hover:text-mst-red transition-all shadow-sm"
                                        >
                                          <Edit2 className="h-3.5 w-3.5" /> Edit
                                        </button> */}
                                        <button
                                          onClick={() => handleDeleteAssessmentFromList(sub.id, sub.title)}
                                          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-black hover:border-mst-red/30 hover:bg-mst-red/10 hover:text-mst-red transition-all shadow-sm"
                                          title="Delete Assessment"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" /> Delete
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
          initialBankDetails={userBankDetails}
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

      {/* Loading Assessment Indicator */}
      {loadingAssessment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-mst-red" />
            <p className="text-sm font-bold text-[var(--text)]">Loading Assessment...</p>
          </div>
        </div>
      )}

      {/* Assessment Editor Modal */}
      {editingAssessment && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-6 bg-[var(--bg)]/50 shrink-0">
              <div>
                <span className="text-xs font-black uppercase text-mst-red tracking-wider">
                  Assessment Management &bull; {editingAssessment.submoduleTitle}
                </span>
                <h3 className="text-xl font-black text-[var(--text)] mt-0.5">
                  {editingAssessment._id ? "Edit Assessment" : "Create Assessment"}
                </h3>
              </div>
              <button
                onClick={() => setEditingAssessment(null)}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Assessment Meta Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[var(--bg)]/30 border border-[var(--border)]/60">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text)]">Assessment Title</label>
                  <input
                    type="text"
                    value={editingAssessment.title}
                    onChange={e => setEditingAssessment({ ...editingAssessment, title: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] focus:border-mst-red/50 focus:outline-none focus:ring-4 focus:ring-mst-red/10 transition-all"
                    placeholder="e.g. Blockchain Basics Set 1"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text)]">Estimated Time (mins)</label>
                  <input
                    type="number"
                    value={editingAssessment.estimatedTime}
                    onChange={e => setEditingAssessment({ ...editingAssessment, estimatedTime: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] focus:border-mst-red/50 focus:outline-none focus:ring-4 focus:ring-mst-red/10 transition-all"
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-3">
                  <h4 className="text-base font-black text-[var(--text)] flex items-center gap-2">
                    Questions List
                    <span className="rounded-full bg-mst-red/10 px-2.5 py-0.5 text-xs font-black text-mst-red">
                      {editingAssessment.questions.length} Questions
                    </span>
                  </h4>
                  <button
                    onClick={() => {
                      setQuestionForm({
                        text: "",
                        options: ["", "", "", ""],
                        correctOptionIndex: 0,
                        marks: 1,
                        type: "mcq",
                        explanation: ""
                      });
                      setActiveQuestionIndex(editingAssessment.questions.length);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add Question
                  </button>
                </div>

                {editingAssessment.questions.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)]/10">
                    <p className="text-sm font-semibold text-[var(--text-muted)]">No questions added yet. Click "Add Question" to build your assessment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editingAssessment.questions.map((q: any, idx: number) => (
                      <div key={q.id || idx} className="rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)] p-5 hover:border-purple-500/30 transition-all relative group shadow-sm">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-black text-purple-500">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-purple-500/80 bg-purple-500/5 px-2 py-0.5 rounded">
                              {q.type || "mcq"}
                            </span>
                            <span className="text-xs font-semibold text-[var(--text-muted)]">
                              Marks: {q.marks || 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setQuestionForm({
                                  text: q.text || "",
                                  options: [...q.options],
                                  correctOptionIndex: q.correctOptionIndex || 0,
                                  marks: q.marks || 1,
                                  type: q.type || "mcq",
                                  explanation: q.explanation || ""
                                });
                                setActiveQuestionIndex(idx);
                              }}
                              className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 rounded-lg hover:bg-blue-500/10 transition"
                              title="Edit Question"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(idx)}
                              className="p-1.5 text-[var(--text-muted)] hover:text-mst-red rounded-lg hover:bg-mst-red/10 transition"
                              title="Delete Question"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm font-bold text-[var(--text)] mb-3 leading-relaxed">
                          {q.text}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {q.options.map((optVal: any, optIdx: number) => {
                            const isCorrect = q.correctOptionIndex === optIdx;
                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-3 rounded-xl border p-2.5 pl-4 text-xs font-semibold ${isCorrect
                                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-500 shadow-sm"
                                  : "border-[var(--border)]/40 bg-[var(--bg)]/30 text-[var(--text-muted)]"
                                  }`}
                              >
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black uppercase ${isCorrect ? "bg-emerald-500 text-white" : "bg-[var(--border)] text-[var(--text-muted)]"
                                  }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="truncate">{optVal}</span>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="mt-4 pt-3 border-t border-[var(--border)]/30 text-xs text-[var(--text-muted)]">
                            <strong className="text-[var(--text)] font-bold">Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] p-6 bg-[var(--bg)]/50 shrink-0">
              <div>
                {editingAssessment._id && (
                  <button
                    onClick={handleDeleteAssessment}
                    className="flex items-center gap-1.5 rounded-xl border border-mst-red/20 bg-mst-red/5 px-5 py-2.5 text-xs font-bold text-mst-red hover:bg-mst-red/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Assessment
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingAssessment(null)}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAssessment}
                  className="flex items-center gap-2 rounded-xl bg-mst-red px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 transition-all"
                >
                  <Save className="h-4 w-4" /> Save Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Question Sub-Modal */}
      {questionForm !== null && activeQuestionIndex !== null && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5 bg-[var(--bg)]/50 shrink-0">
              <div>
                <h3 className="text-lg font-black text-[var(--text)]">
                  {activeQuestionIndex < (editingAssessment?.questions?.length || 0)
                    ? `Edit Question #${activeQuestionIndex + 1}`
                    : "Add New Question"}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Define multiple-choice choices and correct answer.</p>
              </div>
              <button
                onClick={() => {
                  setQuestionForm(null);
                  setActiveQuestionIndex(null);
                }}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-[var(--text)]">Type</label>
                  <input
                    type="text"
                    value={questionForm.type}
                    onChange={e => setQuestionForm({ ...questionForm, type: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--text)] focus:border-purple-500/50 focus:outline-none"
                    placeholder="e.g. mcq"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[var(--text)]">Marks</label>
                  <input
                    type="number"
                    value={questionForm.marks}
                    onChange={e => setQuestionForm({ ...questionForm, marks: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--text)] focus:border-purple-500/50 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[var(--text)]">Question Text</label>
                <textarea
                  value={questionForm.text}
                  onChange={e => setQuestionForm({ ...questionForm, text: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-purple-500/50 focus:outline-none min-h-[60px] h-16"
                  placeholder="e.g. What is a smart contract?"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-xs font-bold text-[var(--text)]">Answer Choices</label>
                <div className="space-y-2.5">
                  {questionForm.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl border p-1.5 pl-3 transition-all ${questionForm.correctOptionIndex === idx
                        ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                        : "border-[var(--border)] bg-[var(--bg)]"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => setQuestionForm({ ...questionForm, correctOptionIndex: idx })}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${questionForm.correctOptionIndex === idx
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-[var(--text-muted)] hover:border-[var(--text)]"
                          }`}
                      >
                        {questionForm.correctOptionIndex === idx && <CheckCircle2 className="h-3 w-3" />}
                      </button>
                      <span className="text-xs font-black uppercase text-[var(--text-muted)] w-4 text-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const newOpts = [...questionForm.options];
                          newOpts[idx] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOpts });
                        }}
                        className="flex-1 bg-transparent py-1.5 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:outline-none"
                        placeholder={`Choice ${String.fromCharCode(65 + idx)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[var(--text)]">Explanation (Optional)</label>
                <textarea
                  value={questionForm.explanation}
                  onChange={e => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-purple-500/50 focus:outline-none min-h-[50px] h-12"
                  placeholder="Explain why this option is correct..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] p-4 bg-[var(--bg)]/50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setQuestionForm(null);
                  setActiveQuestionIndex(null);
                }}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestionForm}
                className="flex items-center gap-1.5 rounded-xl bg-mst-red px-5 py-2 text-xs font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 transition-all"
              >
                <Save className="h-4 w-4" /> Save Question
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
                  <label className="mb-1.5 block text-sm font-bold text-[var(--text)]">Content HTML File</label>
                  {editingItem.contentFile && (
                    <p className="mb-2 text-xs text-[var(--text-muted)] break-all">
                      Current: {editingItem.contentFile}
                    </p>
                  )}
                  <label className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/50 px-4 py-3 cursor-pointer hover:bg-[var(--border)]/10 hover:border-mst-red/40 transition-all">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mst-red/10 text-mst-red shrink-0">
                      <Upload className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-[var(--text)]">
                      {editingItem.contentFileUpload
                        ? `Selected: ${editingItem.contentFileUpload.name}`
                        : "Upload a new .html file to replace content"}
                    </span>
                    <input
                      type="file"
                      accept=".html,.htm,.md,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditingItem({ ...editingItem, contentFileUpload: file });
                        }
                      }}
                    />
                  </label>
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
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs font-bold text-[var(--text)]">Content HTML File</label>
                      <label className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/50 px-4 py-2.5 cursor-pointer hover:bg-[var(--border)]/10 hover:border-mst-red/40 transition-all">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mst-red/10 text-mst-red shrink-0">
                          <Upload className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-[var(--text)] truncate">
                            {curriculumModal.contentFileUpload
                              ? `Selected: ${curriculumModal.contentFileUpload.name}`
                              : "Upload lesson HTML (.html)"}
                          </span>
                          <span className="block text-[9px] text-[var(--text-muted)]">
                            Full page with sidebar, styles, and diagrams
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".html,.htm,.md,.txt"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCurriculumModal({
                                ...curriculumModal,
                                contentFile: file.name,
                                contentFileUpload: file,
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
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

      {/* Custom Confirm Modal */}
      {customConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5 bg-[var(--bg)]/50">
              <h3 className="text-lg font-black text-[var(--text)]">{customConfirm.title}</h3>
              <button onClick={() => setCustomConfirm(null)} className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {customConfirm.message}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] p-5 bg-[var(--bg)]/50">
              <button
                onClick={() => setCustomConfirm(null)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--border)]/50 transition"
              >
                Cancel
              </button>
              <button
                onClick={customConfirm.onConfirm}
                className="flex items-center gap-2 rounded-xl bg-mst-red px-5 py-2 text-sm font-bold text-white shadow-lg shadow-mst-red/20 hover:brightness-110 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}