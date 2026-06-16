let stream: MediaStream | null = null;

export const startCameraMonitoring = async (
  onViolation: (
    type: string,
    message: string
  ) => void
) => {
  try {
    stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });

    return stream;
  } catch {
    onViolation(
      "CAMERA_OFF",
      "Camera permission denied"
    );

    return null;
  }
};

export const stopCameraMonitoring = () => {
  stream?.getTracks().forEach((track) =>
    track.stop()
  );
};