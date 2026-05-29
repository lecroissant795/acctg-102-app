import { CLICK_SOUND_TYPES } from "../constants/clickSound.js";

const MOBILE_MEDIA_QUERY = "(max-width: 768px)";
const CLICK_SOUND_STORAGE_KEY = "acctg-click-sound";
const CLICK_SOUND_SELECTOR =
  'button:not(:disabled), a[href], input[type="button"]:not(:disabled), input[type="submit"]:not(:disabled), input[type="reset"]:not(:disabled), [role="button"]:not([aria-disabled="true"])';

export { CLICK_SOUND_TYPES };

export const DEFAULT_CLICK_SOUND_SETTINGS = {
  muted: false,
  volume: 65,
};

const MAX_CLICK_SOUND_GAIN = 0.5;

let audioContext = null;

function clampVolume(value) {
  const volume = Number(value);
  if (!Number.isFinite(volume)) return DEFAULT_CLICK_SOUND_SETTINGS.volume;
  return Math.min(100, Math.max(0, Math.round(volume)));
}

export function getClickSoundSettings() {
  if (typeof window === "undefined") return DEFAULT_CLICK_SOUND_SETTINGS;

  try {
    const raw = localStorage.getItem(CLICK_SOUND_STORAGE_KEY);
    if (!raw) return DEFAULT_CLICK_SOUND_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      muted: Boolean(parsed.muted),
      volume: clampVolume(parsed.volume),
    };
  } catch {
    return DEFAULT_CLICK_SOUND_SETTINGS;
  }
}

export function saveClickSoundSettings(settings) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    CLICK_SOUND_STORAGE_KEY,
    JSON.stringify({
      muted: Boolean(settings.muted),
      volume: clampVolume(settings.volume),
    })
  );
}

export function getClickSoundGain(volume = DEFAULT_CLICK_SOUND_SETTINGS.volume) {
  return (clampVolume(volume) / 100) * MAX_CLICK_SOUND_GAIN;
}

export function isMobileClickSoundEnabled() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

export function isClickSoundTarget(element) {
  if (!(element instanceof Element)) return false;

  const target = element.closest(CLICK_SOUND_SELECTOR);
  if (!target) return false;

  if (target.matches("button[disabled], input:disabled, [aria-disabled='true']")) {
    return false;
  }

  return true;
}

export function resolveClickSoundType(element) {
  if (!(element instanceof Element)) return CLICK_SOUND_TYPES.foam;

  const target = element.closest(CLICK_SOUND_SELECTOR);
  if (!target) return CLICK_SOUND_TYPES.foam;

  if (target.matches('[data-click-sound="nav"]')) {
    return CLICK_SOUND_TYPES.nav;
  }

  return CLICK_SOUND_TYPES.foam;
}

async function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  return audioContext;
}

export function playFoamClickSound(context, volume = DEFAULT_CLICK_SOUND_SETTINGS.volume) {
  const now = context.currentTime;
  const duration = 0.09;
  const pitchJitter = 0.92 + Math.random() * 0.16;

  const master = context.createGain();
  master.gain.value = getClickSoundGain(volume);
  master.connect(context.destination);

  const bodyOsc = context.createOscillator();
  const bodyGain = context.createGain();
  bodyOsc.type = "sine";
  bodyOsc.frequency.setValueAtTime(168 * pitchJitter, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(70, now + 0.035);
  bodyGain.gain.setValueAtTime(0.0001, now);
  bodyGain.gain.linearRampToValueAtTime(0.26, now + 0.004);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  bodyOsc.connect(bodyGain);
  bodyGain.connect(master);
  bodyOsc.start(now);
  bodyOsc.stop(now + duration);

  const bufferSize = Math.max(1, Math.floor(context.sampleRate * 0.025));
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let index = 0; index < bufferSize; index += 1) {
    samples[index] = (Math.random() * 2 - 1) * Math.exp(-index / (bufferSize * 0.22));
  }

  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 620;
  noiseFilter.Q.value = 0.85;

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.linearRampToValueAtTime(0.11, now + 0.002);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(now);
  noise.stop(now + 0.05);

  const tapOsc = context.createOscillator();
  const tapGain = context.createGain();
  tapOsc.type = "triangle";
  tapOsc.frequency.setValueAtTime(430 * pitchJitter, now);
  tapOsc.frequency.exponentialRampToValueAtTime(175, now + 0.02);
  tapGain.gain.setValueAtTime(0.0001, now);
  tapGain.gain.linearRampToValueAtTime(0.055, now + 0.003);
  tapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
  tapOsc.connect(tapGain);
  tapGain.connect(master);
  tapOsc.start(now);
  tapOsc.stop(now + 0.06);
}

export function playNavClickSound(context, volume = DEFAULT_CLICK_SOUND_SETTINGS.volume) {
  const now = context.currentTime;
  const pitchJitter = 0.94 + Math.random() * 0.1;

  const master = context.createGain();
  master.gain.value = getClickSoundGain(volume) * 0.9;
  master.connect(context.destination);

  const tickOsc = context.createOscillator();
  const tickGain = context.createGain();
  tickOsc.type = "sine";
  tickOsc.frequency.setValueAtTime(2150 * pitchJitter, now);
  tickOsc.frequency.exponentialRampToValueAtTime(1450, now + 0.004);
  tickGain.gain.setValueAtTime(0.0001, now);
  tickGain.gain.linearRampToValueAtTime(0.14, now + 0.0003);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.007);
  tickOsc.connect(tickGain);
  tickGain.connect(master);
  tickOsc.start(now);
  tickOsc.stop(now + 0.008);

  const clackOsc = context.createOscillator();
  const clackGain = context.createGain();
  const clackFilter = context.createBiquadFilter();
  clackFilter.type = "bandpass";
  clackFilter.frequency.value = 760 * pitchJitter;
  clackFilter.Q.value = 1.4;
  clackOsc.type = "triangle";
  clackOsc.frequency.setValueAtTime(820 * pitchJitter, now);
  clackOsc.frequency.exponentialRampToValueAtTime(360, now + 0.018);
  clackGain.gain.setValueAtTime(0.0001, now);
  clackGain.gain.linearRampToValueAtTime(0.18, now + 0.0008);
  clackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
  clackOsc.connect(clackFilter);
  clackFilter.connect(clackGain);
  clackGain.connect(master);
  clackOsc.start(now);
  clackOsc.stop(now + 0.03);

  const bufferSize = Math.max(1, Math.floor(context.sampleRate * 0.005));
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let index = 0; index < bufferSize; index += 1) {
    const falloff = 1 - index / bufferSize;
    samples[index] = (Math.random() * 2 - 1) * falloff * falloff;
  }

  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer;

  const snapFilter = context.createBiquadFilter();
  snapFilter.type = "highpass";
  snapFilter.frequency.value = 2800;
  snapFilter.Q.value = 0.9;

  const snapGain = context.createGain();
  snapGain.gain.setValueAtTime(0.0001, now);
  snapGain.gain.linearRampToValueAtTime(0.06, now + 0.0002);
  snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);
  noise.connect(snapFilter);
  snapFilter.connect(snapGain);
  snapGain.connect(master);
  noise.start(now);
  noise.stop(now + 0.007);
}

export async function previewClickSound(volume = DEFAULT_CLICK_SOUND_SETTINGS.volume) {
  const context = await getAudioContext();
  if (!context) return;

  playFoamClickSound(context, volume);
}

export async function previewNavClickSound(volume = DEFAULT_CLICK_SOUND_SETTINGS.volume) {
  const context = await getAudioContext();
  if (!context) return;

  playNavClickSound(context, volume);
}

export async function triggerMobileClickSound(event) {
  if (!isMobileClickSoundEnabled()) return;
  if (!isClickSoundTarget(event.target)) return;

  const settings = getClickSoundSettings();
  if (settings.muted || settings.volume <= 0) return;

  const context = await getAudioContext();
  if (!context) return;

  const soundType = resolveClickSoundType(event.target);
  if (soundType === CLICK_SOUND_TYPES.nav) {
    playNavClickSound(context, settings.volume);
    return;
  }

  playFoamClickSound(context, settings.volume);
}
