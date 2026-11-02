/**
 * Procedural Web Audio Sound Synthesizer for Black Myth: Destined One
 * 100% procedural with zero external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmInterval: number | null = null;
  private currentBgm: string = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Ancient Bronze Buddhist Temple Bell
   */
  public playTempleBell(freq = 110, duration = 3.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const partials = [
      { ratio: 1.0, gain: 0.8 },
      { ratio: 2.76, gain: 0.5 },
      { ratio: 5.4, gain: 0.3 },
      { ratio: 8.93, gain: 0.15 },
    ];

    partials.forEach(({ ratio, gain }) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, t);

      g.gain.setValueAtTime(gain * 0.4, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(g);
      g.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + duration);
    });
  }

  /**
   * Ruyi Jingu Bang Staff Swing Whoosh
   */
  public playStaffSwing(isHeavy = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = isHeavy ? 0.35 : 0.18;

    // Filtered noise swoosh
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.0, t);
    filter.frequency.setValueAtTime(isHeavy ? 180 : 350, t);
    filter.frequency.exponentialRampToValueAtTime(isHeavy ? 750 : 1200, t + dur * 0.5);
    filter.frequency.exponentialRampToValueAtTime(isHeavy ? 200 : 400, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(isHeavy ? 0.45 : 0.25, t + dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    // Whistling air tone
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isHeavy ? 140 : 280, t);
    osc.frequency.exponentialRampToValueAtTime(isHeavy ? 380 : 620, t + dur * 0.4);
    osc.frequency.exponentialRampToValueAtTime(isHeavy ? 100 : 200, t + dur);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(isHeavy ? 0.3 : 0.15, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + dur);
    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Combat Hit Impact
   */
  public playHit(type: 'light' | 'heavy' | 'stagger' | 'critical' | 'playerHit') {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Sub-bass thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = type === 'critical' ? 'sawtooth' : 'triangle';

    const startFreq = type === 'critical' ? 220 : type === 'heavy' ? 180 : type === 'stagger' ? 320 : 140;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + (type === 'critical' ? 0.4 : 0.2));

    const peakVol = type === 'critical' ? 0.7 : type === 'heavy' ? 0.5 : type === 'playerHit' ? 0.4 : 0.3;
    oscGain.gain.setValueAtTime(peakVol, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + (type === 'critical' ? 0.5 : 0.25));

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.6);

    // Metallic chime/clang of iron staff
    if (type !== 'playerHit') {
      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metalOsc.type = 'square';
      metalOsc.frequency.setValueAtTime(type === 'critical' ? 840 : 580, t);
      metalOsc.frequency.exponentialRampToValueAtTime(type === 'critical' ? 280 : 190, t + 0.15);

      metalGain.gain.setValueAtTime(type === 'critical' ? 0.35 : 0.2, t);
      metalGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      metalOsc.connect(metalGain);
      metalGain.connect(this.masterGain);
      metalOsc.start(t);
      metalOsc.stop(t + 0.3);
    }
  }

  /**
   * Perfect Dodge (Can Ying / Ghost Decoy)
   */
  public playPerfectDodge() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Ethereal rising chime
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      g.gain.setValueAtTime(0.2, t + idx * 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4 + idx * 0.04);

      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(t + idx * 0.04);
      osc.stop(t + 0.5 + idx * 0.04);
    });
  }

  /**
   * Immobilize Spell (Ding Shen Shu) - Sanskrit freeze ring
   */
  public playImmobilize() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // High pure Sanskrit ring
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(1174.66, t); // D6
    osc2.frequency.setValueAtTime(1760.00, t); // A6

    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

    osc1.connect(g);
    osc2.connect(g);
    g.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1.8);
    osc2.stop(t + 1.8);
  }

  /**
   * Cloud Step (Ju Qi Cheng Feng)
   */
  public playCloudStep() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Soft wind vaporization
    const dur = 0.5;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(2400, t + 0.25);
    filter.frequency.exponentialRampToValueAtTime(300, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + dur);
  }

  /**
   * Pluck of Many (Shen Wai Shen Fa)
   */
  public playPluckOfMany() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // 3 rapid hair pluck pops
    [0, 0.08, 0.16].forEach((offset, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350 + idx * 120, t + offset);
      osc.frequency.exponentialRampToValueAtTime(950 + idx * 80, t + offset + 0.08);

      g.gain.setValueAtTime(0.3, t + offset);
      g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.12);

      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(t + offset);
      osc.stop(t + offset + 0.15);
    });
  }

  /**
   * Red Tides Transformation (Guangzhi's Flame Form)
   */
  public playTransformation() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Roaring ignition
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.linearRampToValueAtTime(220, t + 0.3);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.8);

    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 1.0);
  }

  /**
   * Gourd Drink Sip (Healing)
   */
  public playGourdDrink() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Warm healing ascending harp chord
    [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      g.gain.setValueAtTime(0.25, t + idx * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5 + idx * 0.08);

      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(t + idx * 0.08);
      osc.stop(t + 0.6 + idx * 0.08);
    });
  }

  /**
   * Boss Attack Roar / Windup
   */
  public playBossRoar() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.linearRampToValueAtTime(110, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.7);

    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  /**
   * Procedural Ambient Background Music (Dark Mythological Taoist / Buddhist soundscape)
   */
  public startBGM(type: 'title' | 'combat' | 'victory') {
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;
    if (this.currentBgm === type) return;

    this.stopBGM();
    this.currentBgm = type;

    const t = this.ctx.currentTime;

    if (type === 'title') {
      // Atmospheric drone in D minor pentatonic: D2, A2, D3, F3
      const notes = [73.42, 110.0, 146.83, 174.61];
      notes.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        g.gain.setValueAtTime(0.08, t);
        osc.connect(g);
        g.connect(this.bgmGain!);
        osc.start();
        this.bgmOscillators.push(osc);
      });

      // Periodic singing bowl chime
      this.bgmInterval = window.setInterval(() => {
        if (Math.random() > 0.4) {
          const freqs = [293.66, 329.63, 392.0, 440.0, 523.25];
          const f = freqs[Math.floor(Math.random() * freqs.length)];
          this.playTempleBell(f, 4.0);
        }
      }, 4500);
    } else if (type === 'combat') {
      // Tense war drum rhythm & dark brass drone
      const baseDrone = this.ctx.createOscillator();
      const baseGain = this.ctx.createGain();
      baseDrone.type = 'sawtooth';
      baseDrone.frequency.setValueAtTime(55, t); // A1

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, t);

      baseGain.gain.setValueAtTime(0.12, t);
      baseDrone.connect(filter);
      filter.connect(baseGain);
      baseGain.connect(this.bgmGain);
      baseDrone.start();
      this.bgmOscillators.push(baseDrone);

      // Periodic Taiko Drum Strike
      let beat = 0;
      this.bgmInterval = window.setInterval(() => {
        beat = (beat + 1) % 4;
        if (!this.ctx || !this.bgmGain || this.isMuted) return;
        const now = this.ctx.currentTime;

        const drumOsc = this.ctx.createOscillator();
        const drumGain = this.ctx.createGain();
        drumOsc.type = 'triangle';
        const startP = beat === 0 ? 110 : 80;
        drumOsc.frequency.setValueAtTime(startP, now);
        drumOsc.frequency.exponentialRampToValueAtTime(35, now + 0.3);

        drumGain.gain.setValueAtTime(beat === 0 ? 0.35 : 0.2, now);
        drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        drumOsc.connect(drumGain);
        drumGain.connect(this.bgmGain);
        drumOsc.start(now);
        drumOsc.stop(now + 0.4);
      }, 550);
    } else if (type === 'victory') {
      // Ascending triumphant chime chords
      const victoryNotes = [220, 277.18, 329.63, 440, 554.37];
      victoryNotes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.15);

        g.gain.setValueAtTime(0.15, t + idx * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, t + 4.0);

        osc.connect(g);
        g.connect(this.bgmGain!);
        osc.start(t + idx * 0.15);
        this.bgmOscillators.push(osc);
      });
    }
  }

  public stopBGM() {
    this.bgmOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.bgmOscillators = [];
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgm = 'none';
  }
}

export const sound = new SoundEngine();
