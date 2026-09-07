// ==============================================================================
// IGNIS Ground Station Web Audio Synthesizer
// Zero external MP3 asset dependency - fully self-contained Web Audio API
// ==============================================================================

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;

/**
 * Play a subtle, non-annoying synthetic tone matching alert priority.
 * Designed specifically for command-center environments.
 */
export function playAlertSound(severity: AlertSeverity = "CRITICAL"): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const sev = (severity || "CRITICAL").toUpperCase();
    const now = ctx.currentTime;

    if (sev === "CRITICAL" || sev.includes("CRIT")) {
      // Rapid two-tone tactical blip (880Hz -> 1760Hz, 160ms total)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
      osc1.frequency.setValueAtTime(880, now + 0.09);
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.16);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(880, now + 0.16);

      // Subtle command center volume (0.12)
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.24);
      osc2.stop(now + 0.24);
    } else if (sev === "HIGH") {
      // Clean dual pulse (660Hz -> 990Hz, 120ms)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(990, now + 0.06);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } else {
      // Gentle soft single notification chime (520Hz, 90ms)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch {
    // Gracefully ignore audio autoplay block before user interaction
  }
}

/**
 * Backward compatibility alias for existing components
 */
export function playTacticalAlertSound(): void {
  playAlertSound("CRITICAL");
}
