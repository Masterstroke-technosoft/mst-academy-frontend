"use client";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* audio not available */
  }
}

export function playClick() {
  playTone(800, 0.06, "sine", 0.08);
}

export function playSelect() {
  playTone(600, 0.08, "sine", 0.1);
  setTimeout(() => playTone(900, 0.08, "sine", 0.1), 60);
}

export function playSuccess() {
  playTone(523, 0.15, "sine", 0.12);
  setTimeout(() => playTone(659, 0.15, "sine", 0.12), 120);
  setTimeout(() => playTone(784, 0.2, "sine", 0.12), 240);
}

export function playError() {
  playTone(300, 0.2, "square", 0.08);
  setTimeout(() => playTone(250, 0.3, "square", 0.08), 200);
}

export function playWarning() {
  playTone(440, 0.15, "triangle", 0.1);
  setTimeout(() => playTone(440, 0.15, "triangle", 0.1), 200);
}

export function playSubmit() {
  playTone(440, 0.1, "sine", 0.1);
  setTimeout(() => playTone(554, 0.1, "sine", 0.1), 80);
  setTimeout(() => playTone(659, 0.1, "sine", 0.1), 160);
  setTimeout(() => playTone(880, 0.25, "sine", 0.12), 240);
}

export function playTick() {
  playTone(1000, 0.03, "sine", 0.05);
}

export function playNavigate() {
  playTone(700, 0.05, "sine", 0.06);
}

export function playExpand() {
  playTone(400, 0.08, "sine", 0.08);
  setTimeout(() => playTone(550, 0.1, "sine", 0.1), 70);
  setTimeout(() => playTone(720, 0.12, "sine", 0.1), 140);
}

export function playViolated() {
  playTone(180, 0.35, "sawtooth", 0.12);
  setTimeout(() => playTone(140, 0.4, "sawtooth", 0.1), 280);
}
