"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";

export const CameraPreview = forwardRef(
  ({ autoRequest = false }: { autoRequest?: boolean }, ref: any) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [checking, setChecking] = useState(false);

    async function enable() {
      setChecking(true);
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play().catch(() => {});
        }
        setEnabled(true);
      } catch {
        setEnabled(false);
      } finally {
        setChecking(false);
      }
    }

    useImperativeHandle(ref, () => ({ enable }));

    useEffect(() => {
      if (autoRequest) enable();
      return () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If autoRequest was attempted but didn't enable (browser blocked),
    // allow the first user gesture to trigger the camera prompt.
    useEffect(() => {
      if (!autoRequest) return;
      if (enabled || checking) return;

      const onFirstGesture = () => {
        enable();
      };

      document.addEventListener("pointerdown", onFirstGesture, { once: true, capture: true });
      return () => document.removeEventListener("pointerdown", onFirstGesture, { capture: true } as any);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRequest, enabled, checking]);

    return (
      <div className="mt-4 flex items-center gap-3">
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm">
          {enabled ? (
            <video ref={videoRef} muted playsInline className="h-20 w-28 object-cover" />
          ) : (
            <div className="flex h-20 w-28 items-center justify-center bg-[var(--bg-muted)] text-[var(--text-muted)]">
              <VideoOff className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-[var(--text)]">Camera Preview</p>
          <p className="text-xs text-[var(--text-muted)]">{enabled ? "Camera enabled" : "Camera disabled"}</p>
          <div className="mt-2">
            <button
              type="button"
              onClick={enable}
              disabled={checking || enabled}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold transition hover:bg-[var(--bg-muted)] disabled:opacity-50"
            >
              {checking ? "Checking…" : enabled ? "Enabled" : "Enable Camera"}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

CameraPreview.displayName = "CameraPreview";
