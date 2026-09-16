// Minimal, lightweight Web Audio synthesizer for cybersecurity terminal feedback

let audioCtx: AudioContext | null = null;
let soundEnabled = false; // Default mute to be polite, user can toggle on

export function toggleSound(force?: boolean): boolean {
  if (force !== undefined) {
    soundEnabled = force;
  } else {
    soundEnabled = !soundEnabled;
  }
  if (soundEnabled && !audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    } catch {
      // ignore
    }
  }
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function playBlip(freq = 600, duration = 0.05, type: OscillatorType = 'sine') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // audio failure silent fallback
  }
}

export function playSelectSound() {
  playBlip(750, 0.04, 'triangle');
}

export function playSuccessSound() {
  playBlip(980, 0.08, 'sine');
  setTimeout(() => playBlip(1250, 0.1, 'sine'), 50);
}
