"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  startKeyboardMonitoring,
  stopKeyboardMonitoring,
} from "@/components/proctoring-service/keyboard-monitor";

import {
  startTabMonitoring,
  stopTabMonitoring,
} from "@/components/proctoring-service/tab-monitor";

import {
  startFullscreenMonitoring,
  stopFullscreenMonitoring,
  enterFullscreen,
  exitFullscreen
} from "@/components/proctoring-service/fullscreen-monitor";

import {
  startCameraMonitoring,
  stopCameraMonitoring,
} from "@/components/proctoring-service/camera-monitor";

import {
  startMicrophoneMonitoring,
  stopMicrophoneMonitoring,
} from "@/components/proctoring-service/microphone-monitor";

import {
  startBlurCameraMonitoring,
  stopBlurCameraMonitoring
} from "@/components/proctoring-service/blur-camera";


const SUSTAINED_TYPES = new Set([
  "CAMERA_OFF",
  "CAMERA_BLACK",
  "CAMERA_BLUR",
  "TAB_SWITCH",
  "MIC_OFF",
  "FULLSCREEN_EXIT",
]);

export function useProctoring() {
  const [violations, setViolations] = useState<any[]>([]);
  const [activeViolations, setActiveViolations] = useState<Set<string>>(new Set());
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
  const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(false);

  const violationCountRef = useRef(0);
  const activeViolationsRef = useRef<Set<string>>(new Set());

  const addViolation = useCallback((type: string, message: string) => {
    const isSustained = SUSTAINED_TYPES.has(type);

    if (isSustained && activeViolationsRef.current.has(type)) return;

    if (isSustained) {
      activeViolationsRef.current.add(type);
      setActiveViolations(new Set(activeViolationsRef.current));
    }

    setViolations((prev) => [{ type, message, timestamp: new Date() }, ...prev]);

    console.log("Violation:::::::", type, message);

    violationCountRef.current += 1;
    if (violationCountRef.current >= 3) {
      setAutoSubmitTriggered(true);
    }
  }, []);

  const resolveViolation = useCallback((type: string) => {
    if (!activeViolationsRef.current.has(type)) return;
    activeViolationsRef.current.delete(type);
    setActiveViolations(new Set(activeViolationsRef.current));
  }, []);

  useEffect(() => {
    // Monitor fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreenEnabled(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Try to enter fullscreen
    enterFullscreen(document.documentElement).catch((err) => {
      console.error("Failed to enter fullscreen:", err);
    });

    startKeyboardMonitoring(addViolation);
    startTabMonitoring(addViolation, resolveViolation);
    startFullscreenMonitoring(addViolation, resolveViolation);
    startCameraMonitoring(addViolation, resolveViolation);
    startMicrophoneMonitoring(addViolation, resolveViolation);
    startBlurCameraMonitoring(addViolation, resolveViolation);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      stopKeyboardMonitoring();
      stopTabMonitoring();
      stopFullscreenMonitoring();
      stopCameraMonitoring();
      stopMicrophoneMonitoring();
      stopBlurCameraMonitoring();
      exitFullscreen().catch(console.error);
    };
  }, [addViolation, resolveViolation]);

  const stopProctoring = useCallback(() => {
    stopKeyboardMonitoring();
    stopTabMonitoring();
    stopFullscreenMonitoring();
    stopCameraMonitoring();
    stopMicrophoneMonitoring();
    stopBlurCameraMonitoring();
    exitFullscreen().catch(console.error);
  }, []);

  return {
    violations,
    activeViolations,
    warningCount: violations.length,
    autoSubmitTriggered,
    stopProctoring,
    isFullscreenEnabled,
  };
}