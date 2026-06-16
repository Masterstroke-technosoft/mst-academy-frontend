let audioContext: AudioContext | null = null;
let retryInterval: ReturnType<typeof setInterval> | null = null;

export const startMicrophoneMonitoring = async (
  onViolation: (type: string, message: string) => void,
  onResolve: (type: string) => void
) => {
  const tryGetMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      onResolve("MIC_OFF");
      if (retryInterval) {
        clearInterval(retryInterval);
        retryInterval = null;
      }
      if (!audioContext) {
        audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          requestAnimationFrame(checkAudio);
        };
        checkAudio();
      }
    } catch {
      onViolation("MIC_OFF", "Microphone unavailable");
    }
  };

  await tryGetMic();
  if (!audioContext) {
    retryInterval = setInterval(tryGetMic, 5000);
  }
};

export const stopMicrophoneMonitoring = async () => {
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
  }
  if (audioContext && audioContext.state !== "closed") {
    await audioContext.close();
  }
  audioContext = null;
};