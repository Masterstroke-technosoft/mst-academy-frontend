"use client";

import { useEffect, useRef } from "react";

export type CameraViolationType = "CAMERA_OFF" | "CAMERA_BLUR" | "CAMERA_BLACK" | "MULTIPLE_FACES" | "NO_FACE";

export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

export function CameraRequiredNotice({ ok }: { ok: boolean }) {
  if (ok) return null;
  return (
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-500">
      Camera access is required for this assessment. Please allow camera permissions to continue.
    </div>
  );
}

interface AssessmentCameraProctorProps {
  active: boolean;
  onViolation: (type: CameraViolationType) => void;
  placement?: "top" | "bottom";
}

export function AssessmentCameraProctor({ active, onViolation, placement = "top" }: AssessmentCameraProctorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const offCountRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        offCountRef.current = 0;

        checkIntervalRef.current = setInterval(() => {
          const track = stream.getVideoTracks()[0];
          if (!track || track.readyState === "ended") {
            offCountRef.current += 1;
            if (offCountRef.current >= 2) {
              onViolation("CAMERA_OFF");
              offCountRef.current = 0;
            }
          } else {
            offCountRef.current = 0;
          }
        }, 3000);
      } catch {
        onViolation("CAMERA_OFF");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [active, onViolation]);

  const positionClass = placement === "bottom"
    ? "fixed bottom-4 right-4 z-50"
    : "fixed top-4 right-4 z-50";

  return (
    <div className={positionClass}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-20 w-28 rounded-lg border border-[var(--border)] object-cover opacity-80"
      />
    </div>
  );
}
