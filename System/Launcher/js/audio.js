/* RQBBOX OS - Xbox-Style Audio Engine */
/* All sounds synthesized via Web Audio API — no files needed */
const RQBAudio = {
  _ctx: null,
  _enabled: true,
  _volume: 0.8,
  _masterVolume: 0.8,

  init() {
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch { this._enabled = false; }
    const cfg = RQBBOX_DATA.config?.audio;
    if (cfg) {
      this._volume = cfg.masterVolume ?? 0.8;
      this._masterVolume = cfg.masterVolume ?? 0.8;
      if (cfg.uiSounds === false) this._enabled = false;
    }
  },

  _ensure() {
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
  },

  _gain(value) {
    const g = this._ctx.createGain();
    g.gain.value = value * this._volume;
    return g;
  },

  _osc(type, freq) {
    const o = this._ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  },

  _connect(src) {
    src.connect(this._ctx.destination);
    return src;
  },

  _now() { return this._ctx.currentTime; },

  _env(dur, attack = 0.01, release = 0.05) {
    const env = this._ctx.createGain();
    const now = this._now();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(1, now + attack);
    env.gain.setValueAtTime(1, now + dur - release);
    env.gain.linearRampToValueAtTime(0, now + dur);
    return env;
  },

  /* === XBOX-STYLE SOUNDS === */

  /* Startup — swelling Cm chord with filter sweep (iconic Xbox feel) */
  boot() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 3.0;
    const master = this._gain(0.35);

    // C minor chord: C4, Eb4, G4, C5, plus a sub bass C3
    const freqs = [130.81, 261.63, 311.13, 392.00, 523.25];
    const types = ['sawtooth', 'triangle', 'sine', 'sine', 'triangle'];

    freqs.forEach((f, i) => {
      const o = this._osc(types[i] || 'sine', f);
      const g = this._gain(0);

      // Slow attack swell
      const swellStart = i === 0 ? now : now + 0.1 + i * 0.15;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0, swellStart);
      g.gain.linearRampToValueAtTime(0.3 - i * 0.04, swellStart + 0.8);
      g.gain.setValueAtTime(0.3 - i * 0.04, now + dur - 0.5);
      g.gain.linearRampToValueAtTime(0, now + dur);

      // Filter sweep per oscillator
      const fEnv = this._ctx.createBiquadFilter();
      fEnv.type = 'lowpass';
      fEnv.frequency.setValueAtTime(200 + i * 50, now);
      fEnv.frequency.exponentialRampToValueAtTime(3000 + i * 500, now + 1.2);
      fEnv.frequency.setValueAtTime(3000 + i * 500, now + dur - 0.3);
      fEnv.frequency.exponentialRampToValueAtTime(500, now + dur);

      o.connect(g);
      g.connect(fEnv);
      fEnv.connect(master);
      o.start(now + (i * 0.15));
      o.stop(now + dur);
    });

    // Sub bass for weight
    const sub = this._osc('sine', 65.41);
    const subG = this._gain(0);
    subG.gain.setValueAtTime(0, now);
    subG.gain.linearRampToValueAtTime(0.2, now + 0.5);
    subG.gain.setValueAtTime(0.2, now + dur - 0.3);
    subG.gain.linearRampToValueAtTime(0, now + dur);
    sub.connect(subG);
    subG.connect(master);

    master.connect(this._ctx.destination);
  },

  /* Navigation blade — short pop/click */
  nav() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.08;
    const o = this._osc('square', 800);
    const env = this._env(dur, 0.002, 0.02);
    env.gain.setValueAtTime(0.15 * this._volume, now);
    o.connect(env);
    env.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Blade scroll — lighter tick */
  tick() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.03;
    const o = this._osc('sine', 1200);
    const g = this._gain(0);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.005);
    g.gain.linearRampToValueAtTime(0, now + dur);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Select/Confirm — rising confirmation tone */
  select() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.3;
    const o = this._osc('triangle', 400);
    o.frequency.linearRampToValueAtTime(800, now + dur);
    const g = this._gain(0.2);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.2, now + 0.02);
    g.gain.setValueAtTime(0.2, now + dur - 0.05);
    g.gain.linearRampToValueAtTime(0, now + dur);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Back/Cancel — descending tone */
  back() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.25;
    const o = this._osc('triangle', 600);
    o.frequency.linearRampToValueAtTime(200, now + dur);
    const g = this._gain(0.15);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.01);
    g.gain.setValueAtTime(0.15, now + dur - 0.08);
    g.gain.linearRampToValueAtTime(0, now + dur);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Achievement Unlock — iconic rising arpeggio (C5 → E5 → G5 → C6) */
  achievement() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    const noteDur = 0.12;
    const totalDur = notes.length * noteDur + 0.3;

    notes.forEach((freq, i) => {
      const o = this._osc('triangle', freq);
      const g = this._gain(0);
      const t = now + i * noteDur;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.01);
      g.gain.linearRampToValueAtTime(0.2, t + noteDur - 0.02);
      g.gain.linearRampToValueAtTime(0, t + noteDur);

      // Bright filter
      const f = this._ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = 2000;

      o.connect(g);
      g.connect(f);
      f.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + noteDur);
    });

    // Sustained pad underneath
    const pad = this._osc('sine', 523.25);
    const padG = this._gain(0);
    padG.gain.setValueAtTime(0, now);
    padG.gain.linearRampToValueAtTime(0.1, now + 0.1);
    padG.gain.setValueAtTime(0.1, now + totalDur - 0.3);
    padG.gain.linearRampToValueAtTime(0, now + totalDur);
    pad.connect(padG);
    padG.connect(this._ctx.destination);
    pad.start(now);
    pad.stop(now + totalDur);

    // Sparkle high overtones
    for (let i = 0; i < 3; i++) {
      const sp = this._osc('sine', 2093 + i * 500);
      const spG = this._gain(0);
      const st = now + 0.1 + i * 0.15;
      spG.gain.setValueAtTime(0, st);
      spG.gain.linearRampToValueAtTime(0.03, st + 0.05);
      spG.gain.linearRampToValueAtTime(0, st + 0.15);
      sp.connect(spG);
      spG.connect(this._ctx.destination);
      sp.start(st);
      sp.stop(st + 0.2);
    }
  },

  /* Notification — double beep (like Xbox notification) */
  notification() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    [0, 0.15].forEach((offset, i) => {
      const t = now + offset;
      const freq = i === 0 ? 880 : 1100;
      const o = this._osc('sine', freq);
      const g = this._gain(0);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.01);
      g.gain.setValueAtTime(0.15, t + 0.06);
      g.gain.linearRampToValueAtTime(0, t + 0.12);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.12);
    });
  },

  /* Error — low buzz */
  error() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.4;
    const o = this._osc('sawtooth', 100);
    const g = this._gain(0);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.12, now + 0.02);
    g.gain.setValueAtTime(0.12, now + dur - 0.1);
    g.gain.linearRampToValueAtTime(0, now + dur);

    const f = this._ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 300;

    o.connect(g);
    g.connect(f);
    f.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Power Off — descending fade */
  poweroff() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 1.0;
    const o = this._osc('triangle', 300);
    o.frequency.linearRampToValueAtTime(50, now + dur);
    const g = this._gain(0);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.05);
    g.gain.setValueAtTime(0.15, now + dur - 0.2);
    g.gain.linearRampToValueAtTime(0, now + dur);

    const f = this._ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(2000, now);
    f.frequency.exponentialRampToValueAtTime(100, now + dur);

    o.connect(g);
    g.connect(f);
    f.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Install Complete — rising whoosh */
  install() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.6;
    const o = this._osc('sine', 300);
    o.frequency.linearRampToValueAtTime(1200, now + dur);
    const g = this._gain(0);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.12, now + 0.05);
    g.gain.setValueAtTime(0.12, now + dur - 0.1);
    g.gain.linearRampToValueAtTime(0, now + dur);

    // White noise burst underneath
    const dur2 = this._ctx.createBufferSource();
    const buf = this._ctx.createBuffer(1, this._ctx.sampleRate * dur, this._ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.05;
    dur2.buffer = buf;
    const noiseG = this._gain(0);
    noiseG.gain.setValueAtTime(0, now);
    noiseG.gain.linearRampToValueAtTime(0.06, now + 0.1);
    noiseG.gain.linearRampToValueAtTime(0, now + dur);

    const f = this._ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(500, now);
    f.frequency.linearRampToValueAtTime(3000, now + dur);
    f.Q.value = 0.5;

    o.connect(g);
    g.connect(this._ctx.destination);
    dur2.connect(noiseG);
    noiseG.connect(f);
    f.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
    dur2.start(now);
    dur2.stop(now + dur);
  },

  /* Sign In — welcoming chime */
  signin() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const notes = [392, 440, 523.25, 659.25];
    const noteDur = 0.1;
    notes.forEach((freq, i) => {
      const o = this._osc('triangle', freq);
      const g = this._gain(0);
      const t = now + i * noteDur;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.01);
      g.gain.linearRampToValueAtTime(0, t + noteDur);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + noteDur);
    });
  },

  /* Sign Out — soft descending */
  signout() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.4;
    const o = this._osc('triangle', 500);
    o.frequency.linearRampToValueAtTime(200, now + dur);
    const g = this._gain(0.1);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.02);
    g.gain.linearRampToValueAtTime(0, now + dur);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Hover — micro tick */
  hover() {
    if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.02;
    const o = this._osc('sine', 2000);
    const g = this._gain(0);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.03, now + 0.003);
    g.gain.linearRampToValueAtTime(0, now + dur);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  /* Enabled/disabled toggle */
  setEnabled(on) {
    this._enabled = on;
  },

  setVolume(v) {
    this._volume = v;
  }
};
