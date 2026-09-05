'use client';

// Procedural Ambient Relaxation Audio Engine using Web Audio API
// High-fidelity, smooth, loopable, 100% offline capable and zero CORS issues!

export type SoundTrackId = 'piano' | 'rain' | 'ocean' | 'forest' | 'zen';

export interface SoundTrack {
  id: SoundTrackId;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'piano',
    name: 'Meditatsiya Pianinosi',
    icon: '🎹',
    description: 'Sokin va iliq pianino akkordlari',
    color: '#0F766E',
  },
  {
    id: 'rain',
    name: 'Yumshoq Yomg‘ir',
    icon: '🌧️',
    description: 'Tinchlantiruvchi yomg‘ir tomchilari',
    color: '#0284C7',
  },
  {
    id: 'ocean',
    name: 'Dengiz To‘lqinlari',
    icon: '🌊',
    description: 'Sohilga urilayotgan mayin to‘lqinlar',
    color: '#2563EB',
  },
  {
    id: 'forest',
    name: 'O‘rmon va Qushlar',
    icon: '🍃',
    description: 'Yengil shabboda va qushlar sadosi',
    color: '#16A34A',
  },
  {
    id: 'zen',
    name: 'Zen Tinchlik Nafasi',
    icon: '✨',
    description: 'Chuqur dam olish va tinchlanish garmoniyasi',
    color: '#7C3AED',
  },
];

class RelaxationAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentTrack: SoundTrackId = 'piano';
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private intervals: NodeJS.Timeout[] = [];
  private volume = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getCurrentTrack() {
    return this.currentTrack;
  }

  public stop() {
    this.isPlaying = false;
    this.intervals.forEach((i) => clearInterval(i));
    this.intervals = [];

    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {}
    });
    this.activeNodes = [];
  }

  public play(trackId: SoundTrackId = 'piano') {
    this.initContext();
    this.stop();
    this.currentTrack = trackId;
    this.isPlaying = true;

    if (!this.ctx || !this.masterGain) return;

    switch (trackId) {
      case 'piano':
        this.playPianoAmbience();
        break;
      case 'rain':
        this.playRainAmbience();
        break;
      case 'ocean':
        this.playOceanAmbience();
        break;
      case 'forest':
        this.playForestAmbience();
        break;
      case 'zen':
        this.playZenAmbience();
        break;
    }
  }

  // 1. Soft Piano & Ambient Chord Progression (Cmaj7 - Am9 - Fmaj7 - Gsus4)
  private playPianoAmbience() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Warm Low Drone
    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    const droneFilter = ctx.createBiquadFilter();

    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(280, ctx.currentTime);

    droneGain.gain.setValueAtTime(0.18, ctx.currentTime);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start();
    this.activeNodes.push(droneOsc, droneGain);

    // Beautiful soothing chord progression notes
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.0, 261.63, 329.63, 392.0],  // Am7 (A3, C4, E4, G4)
      [174.61, 261.63, 329.63, 392.0], // Fmaj7 (F3, C4, E4, G4)
      [196.0, 261.63, 293.66, 392.0],  // Gsus4 (G3, C4, D4, G4)
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const currentNotes = chords[chordIndex % chords.length];
      chordIndex++;

      currentNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + idx * 100, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.18;
        const duration = 5.2;

        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.09 / (idx + 1), startTime + 0.8);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain!);

        osc.start(startTime);
        osc.stop(startTime + duration);
        this.activeNodes.push(osc, noteGain);
      });
    };

    playNextChord();
    const interval = setInterval(playNextChord, 4200);
    this.intervals.push(interval);
  }

  // 2. Soothing Gentle Rain
  private playRainAmbience() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    whiteNoise.start();
    this.activeNodes.push(whiteNoise, gain);

    // Random gentle raindrops
    const dropInterval = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const dropOsc = ctx.createOscillator();
      const dropGain = ctx.createGain();
      dropOsc.type = 'sine';
      const freq = 1200 + Math.random() * 1500;
      dropOsc.frequency.setValueAtTime(freq, ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.04, ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      dropOsc.connect(dropGain);
      dropGain.connect(this.masterGain!);
      dropOsc.start();
      dropOsc.stop(ctx.currentTime + 0.09);
    }, 450);

    this.intervals.push(dropInterval);
  }

  // 3. Gentle Ocean Waves with Rhythmic Swells
  private playOceanAmbience() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.2, ctx.currentTime);

    // LFO to modulate wave swell
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 second wave cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.25, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, lfo, waveGain);
  }

  // 4. Forest Breeze & Soft Bird Songs
  private playForestAmbience() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Wind breeze
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.15, ctx.currentTime);

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, windGain);

    // Random melodic bird chirps
    const birdInterval = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const birdOsc = ctx.createOscillator();
      const birdGain = ctx.createGain();

      birdOsc.type = 'sine';
      const baseFreq = 2200 + Math.random() * 1200;
      birdOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      birdOsc.frequency.linearRampToValueAtTime(baseFreq + 600, ctx.currentTime + 0.08);
      birdOsc.frequency.linearRampToValueAtTime(baseFreq - 300, ctx.currentTime + 0.16);

      birdGain.gain.setValueAtTime(0.001, ctx.currentTime);
      birdGain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.04);
      birdGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

      birdOsc.connect(birdGain);
      birdGain.connect(this.masterGain!);
      birdOsc.start();
      birdOsc.stop(ctx.currentTime + 0.22);
    }, 2800 + Math.random() * 2500);

    this.intervals.push(birdInterval);
  }

  // 5. Zen Calm Flute & Harmonic Singing Bowls
  private playZenAmbience() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Singing bowl drone (432Hz healing resonance)
    const bowlOsc = ctx.createOscillator();
    const bowlGain = ctx.createGain();
    bowlOsc.type = 'sine';
    bowlOsc.frequency.setValueAtTime(216, ctx.currentTime); // A3 (432/2)

    bowlGain.gain.setValueAtTime(0.2, ctx.currentTime);
    bowlOsc.connect(bowlGain);
    bowlGain.connect(this.masterGain);
    bowlOsc.start();
    this.activeNodes.push(bowlOsc, bowlGain);

    // Harmonic bell chimes every few seconds
    const chimeFreqs = [432, 540, 648, 864];
    let chimeIdx = 0;

    const playChime = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(chimeFreqs[chimeIdx % chimeFreqs.length], ctx.currentTime);
      chimeIdx++;

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      osc.stop(ctx.currentTime + 4.6);
    };

    playChime();
    const chimeInterval = setInterval(playChime, 5000);
    this.intervals.push(chimeInterval);
  }
}

export const relaxingAudio = typeof window !== 'undefined' ? new RelaxationAudioEngine() : null;
