let stream: MediaStream | null = null;
let analysisInterval: ReturnType<typeof setInterval> | null = null;

const ANALYSIS_INTERVAL_MS = 3000;
const DARK_THRESHOLD = 20;       // avg brightness below this = black camera
const BLUR_THRESHOLD = 80;       // laplacian variance below this = blurry

function analyzeFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  onViolation: (type: string, message: string) => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx || video.readyState < 2) return;

  canvas.width = 160;
  canvas.height = 120;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelCount = canvas.width * canvas.height;

  // Convert to grayscale and collect brightness values
  const gray: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }

  // Black camera: average brightness check
  const avgBrightness = gray.reduce((a, b) => a + b, 0) / pixelCount;
  if (avgBrightness < DARK_THRESHOLD) {
    onViolation("CAMERA_BLACK", "Camera appears dark or covered");
    return;
  }

  // Blur detection: Laplacian variance
  const w = canvas.width;
  const h = canvas.height;
  let laplacianSum = 0;
  let laplacianSumSq = 0;
  let count = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const lap =
        -gray[idx - w - 1] - gray[idx - w] - gray[idx - w + 1]
        - gray[idx - 1] + 8 * gray[idx] - gray[idx + 1]
        - gray[idx + w - 1] - gray[idx + w] - gray[idx + w + 1];
      laplacianSum += lap;
      laplacianSumSq += lap * lap;
      count++;
    }
  }

  const mean = laplacianSum / count;
  const variance = laplacianSumSq / count - mean * mean;

  if (variance < BLUR_THRESHOLD) {
    onViolation("CAMERA_BLUR", "Camera feed appears blurry or obstructed");
  }
}

export const startBlurCameraMonitoring = async (
  onViolation: (type: string, message: string) => void
) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();

    const canvas = document.createElement("canvas");

    analysisInterval = setInterval(() => {
      analyzeFrame(video, canvas, onViolation);
    }, ANALYSIS_INTERVAL_MS);

    return stream;
  } catch {
    onViolation("CAMERA_OFF", "Camera permission denied");
    return null;
  }
};

export const stopBlurCameraMonitoring = () => {
  if (analysisInterval) {
    clearInterval(analysisInterval);
    analysisInterval = null;
  }
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
};
