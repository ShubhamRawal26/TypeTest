/**
 * Realistic Mechanical Keyboard Sound Synthesizer using the Web Audio API.
 * Emulates the tactile click, bottom-out "thock", and housing resonance of real mechanical switches.
 * Enabled by default with zero external audio files.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // Sound is ON by default
    this.setupAutoUnlock();
  }

  /**
   * Automatically unlock and resume Web Audio Context on the first user interaction
   */
  private setupAutoUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.isUnlocked = true;
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  public initContext() {
    if (this.ctx) return;
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.ctx = new AudioCtxClass();

      // Create white noise buffer for switch snap transients
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * 0.06);
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.9;
      }
    } catch {
      // AudioContext unavailable
    }
  }

  public playKeySound(key: string = '') {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Organic pitch variance (+/- 7%) for authentic mechanical typing
    const pitchJitter = 0.93 + Math.random() * 0.14;

    const isSpace = key === ' ' || key === 'Space';
    const isBackspace = key === 'Backspace';
    const isEnter = key === 'Enter';

    // 1. Mechanical switch click/snap transient (high-frequency tactile snap)
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime((isSpace ? 2800 : 3800) * pitchJitter, now);
      clickFilter.Q.setValueAtTime(isSpace ? 1.8 : 2.6, now);

      const clickGain = ctx.createGain();
      const clickVolume = isSpace ? 0.35 : 0.42;
      clickGain.gain.setValueAtTime(clickVolume, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.022 : 0.016));

      noise.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.025);
    }

    // 2. Keycap cavity bottom-out "thock" (damped resonance)
    const baseFreq = isSpace ? 145 : isBackspace ? 275 : isEnter ? 210 : 235;
    const thockFreq = baseFreq * pitchJitter;

    const osc = ctx.createOscillator();
    osc.type = isSpace ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(thockFreq * 1.6, now);
    osc.frequency.exponentialRampToValueAtTime(thockFreq * 0.6, now + (isSpace ? 0.045 : 0.035));

    const oscFilter = ctx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(isSpace ? 850 : 1100, now);

    const oscGain = ctx.createGain();
    const thockVolume = isSpace ? 0.48 : 0.4;
    oscGain.gain.setValueAtTime(thockVolume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.05 : 0.04));

    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);

    // 3. Switch housing plate impact (crisp mid-frequency body impulse)
    const plateOsc = ctx.createOscillator();
    plateOsc.type = 'triangle';
    plateOsc.frequency.setValueAtTime((isSpace ? 320 : 540) * pitchJitter, now);
    plateOsc.frequency.exponentialRampToValueAtTime(120, now + 0.02);

    const plateGain = ctx.createGain();
    plateGain.gain.setValueAtTime(isSpace ? 0.25 : 0.22, now);
    plateGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

    plateOsc.connect(plateGain);
    plateGain.connect(ctx.destination);

    plateOsc.start(now);
    plateOsc.stop(now + 0.025);
  }
}

export const audioEngine = new AudioEngine();
