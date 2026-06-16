"use client";

import { useEffect, useState } from "react";

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
  enterFullscreen
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
}   from "@/components/proctoring-service/blur-camera";


export function useProctoring() {
  const [violations, setViolations] =
    useState<any[]>([]);

  const addViolation = (
    type: string,
    message: string
  ) => {
    setViolations((prev) => [
      {
        type,
        message,
        timestamp: new Date(),
      },
      ...prev,
    ]);

    console.log(type, message);

    // Send to NestJS here
  };

  useEffect(() => {
    // startKeyboardMonitoring(
    //   addViolation
    // );

    // enterFullscreen(document.documentElement).catch(console.error);

    startTabMonitoring(
      addViolation
    );

    startFullscreenMonitoring(
      addViolation
    );

    // startCameraMonitoring(
    //   addViolation
    // );

    startMicrophoneMonitoring(
      addViolation
    );

    startBlurCameraMonitoring(
      addViolation
    );

    return () => {
    //   stopKeyboardMonitoring();

      stopTabMonitoring();

    //   stopFullscreenMonitoring();

      stopCameraMonitoring();

      stopMicrophoneMonitoring();

      stopBlurCameraMonitoring();
    };
  }, []);

  return {
    violations,
    warningCount:
      violations.length,
  };
}