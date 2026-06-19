let stream: MediaStream | null = null;
let retryInterval: ReturnType<typeof setInterval> | null = null;

export const startCameraMonitoring = async (
  onViolation: (type: string, message: string) => void,
  onResolve: (type: string) => void
) => {
  const tryGetCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      onResolve("CAMERA_OFF");
      if (retryInterval) {
        clearInterval(retryInterval);
        retryInterval = null;
      }
      return stream;
    } catch {
      onViolation("CAMERA_OFF", "Camera permission denied");
      return null;
    }
  };

  const result = await tryGetCamera();
  if (!result) {
    retryInterval = setInterval(tryGetCamera, 5000);
  }
  return result;
};

export const stopCameraMonitoring = () => {
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
  }
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
};