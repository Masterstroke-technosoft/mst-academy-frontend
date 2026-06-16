let audioContext: AudioContext | null =
  null;

export const startMicrophoneMonitoring =
  async (
    onViolation: (
      type: string,
      message: string
    ) => void
  ) => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      audioContext = new AudioContext();

      const analyser =
        audioContext.createAnalyser();

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      source.connect(analyser);

      analyser.fftSize = 256;

      const dataArray =
        new Uint8Array(
          analyser.frequencyBinCount
        );

      const checkAudio = () => {
        analyser.getByteFrequencyData(
          dataArray
        );

        // const avg =
        //   dataArray.reduce(
        //     (a, b) => a + b,
        //     0
        //   ) / dataArray.length;

        // if (avg > 70) {
        //   onViolation(
        //     "HIGH_BACKGROUND_NOISE",
        //     `Noise level ${Math.round(avg)}`
        //   );
        // }

        requestAnimationFrame(
          checkAudio
        );
      };

      checkAudio();
    } catch {
      onViolation(
        "MIC_OFF",
        "Microphone unavailable"
      );
    }
  };

export const stopMicrophoneMonitoring =
  async () => {
    if (audioContext && audioContext.state !== "closed") {
      await audioContext.close();
    }
    audioContext = null;
  };