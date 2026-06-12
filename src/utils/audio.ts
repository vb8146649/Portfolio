// Web Audio API Synthesizer for UI Sound FX (Zero external files, pure code)
let audioCtx: AudioContext | null = null;
let isMuted = true;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  // Initialize context on user interaction
  if (!muted) {
    getAudioContext();
  }
};

export const getMuted = () => isMuted;

// Tiny tick for button hovers
export const playHoverSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime); // High pitch tick
    
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore web audio blocks
  }
};

// Satisfying mechanical keyboard click
export const playKeySound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Randomize pitch slightly for organic typing feel
    const pitch = 600 + Math.random() * 300;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore
  }
};

// Deep, warm validation click
export const playClickSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Ignore
  }
};

// High-tech synthesized arpeggio for successes/triggers
export const playSuccessSound = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    // Synthesize ascending futuristic arpeggio (C Major chord progression: C, E, G, C)
    playTone(523.25, now, 0.15);      // C5
    playTone(659.25, now + 0.08, 0.15); // E5
    playTone(783.99, now + 0.16, 0.15); // G5
    playTone(1046.50, now + 0.24, 0.3); // C6
  } catch (e) {
    // Ignore
  }
};
