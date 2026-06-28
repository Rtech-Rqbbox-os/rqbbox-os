const RQBAudio = {
  _ctx: null,
  _enabled: true,
  _volume: { master: 0.8, ui: 0.7, effects: 0.8, music: 0.4, voice: 0.6, ambient: 0.3 },
  _initialized: false,
  _profile: 'rqbbox',
  _analyser: null,
  _analyserData: null,
  _bgNode: null,
  _bgGain: null,

  profiles: {
    rqbbox: { label: 'RQBBOX Native', bootFreqs: [98.00, 196.00, 392.00, 587.33, 784.00], navType: 'sine', selectFreq: 440, confirmFreq: 880, backFreq: 330, theme: 'premium' },
    xbox: { label: 'Xbox Style', bootFreqs: [130.81, 261.63, 311.13, 392.00, 523.25], navType: 'square', selectFreq: 400, confirmFreq: 800, backFreq: 600, theme: 'bold' },
    playstation: { label: 'PlayStation Style', bootFreqs: [220, 277.18, 329.63, 440, 554.37], navType: 'sine', selectFreq: 500, confirmFreq: 1000, backFreq: 500, theme: 'clean' },
    nintendo: { label: 'Nintendo Style', bootFreqs: [392, 523.25, 659.25, 783.99, 1046.5], navType: 'triangle', selectFreq: 660, confirmFreq: 880, backFreq: 440, theme: 'bright' },
    retro: { label: 'Retro 8-bit', bootFreqs: [262, 330, 392, 523, 659], navType: 'square', selectFreq: 440, confirmFreq: 660, backFreq: 330, theme: 'chiptune' },
  },

  init() {
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._analyser = this._ctx.createAnalyser();
      this._analyser.fftSize = 256;
      this._analyserData = new Uint8Array(this._analyser.frequencyBinCount);
      this._analyser.connect(this._ctx.destination);
    } catch { this._enabled = false; return; }

    const cfg = RQBBOX_DATA?.config?.audio;
    if (cfg) {
      this._volume.master = cfg.masterVolume ?? 0.8;
      this._volume.ui = cfg.uiVolume ?? 0.7;
      this._volume.effects = cfg.effectsVolume ?? 0.8;
      this._volume.music = cfg.musicVolume ?? 0.4;
      this._volume.voice = cfg.voiceVolume ?? 0.6;
      this._profile = cfg.profile || 'rqbbox';
      if (cfg.uiSounds === false) this._enabled = false;
    }

    this._initialized = true;
    this._autoResume();
    window.addEventListener('pointerdown', () => this._ensure(), { once: true });
  },

  _autoResume() {
    document.addEventListener('click', () => this._ensure(), { once: true });
    document.addEventListener('touchstart', () => this._ensure(), { once: true });
    document.addEventListener('keydown', () => this._ensure(), { once: true });
  },

  _ensure() {
    if (this._ctx?.state === 'suspended') this._ctx.resume();
  },

  _now() { return this._ctx.currentTime; },
  _gain(val, category) {
    const g = this._ctx.createGain();
    const catVol = this._volume[category || 'ui'] ?? 0.7;
    g.gain.value = val * this._volume.master * catVol;
    return g;
  },
  _osc(type, freq) {
    const o = this._ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  },
  _noise(dur) {
    const buf = this._ctx.createBuffer(1, this._ctx.sampleRate * dur, this._ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = this._ctx.createBufferSource();
    src.buffer = buf;
    return src;
  },
  _filter(type, freq, Q) {
    const f = this._ctx.createBiquadFilter();
    f.type = type || 'lowpass';
    f.frequency.value = freq || 1000;
    if (Q) f.Q.value = Q;
    return f;
  },
  _delay(time, feedback) {
    const d = this._ctx.createDelay();
    d.delayTime.value = time || 0.15;
    const fb = this._ctx.createGain();
    fb.gain.value = feedback || 0.3;
    d.connect(fb);
    fb.connect(d);
    return { delay: d, feedback: fb };
  },
  _reverb(dur, decay) {
    const sr = this._ctx.sampleRate;
    const len = sr * (dur || 0.5);
    const buf = this._ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, (decay || 3));
    }
    const src = this._ctx.createConvolver();
    src.buffer = buf;
    return src;
  },
  _compressor() {
    const c = this._ctx.createDynamicsCompressor();
    c.threshold.value = -24;
    c.knee.value = 30;
    c.ratio.value = 12;
    c.attack.value = 0.003;
    c.release.value = 0.25;
    return c;
  },
  _playNote(freq, dur, type, vol, dest) {
    const o = this._osc(type || 'sine', freq);
    const g = this._gain(vol || 0.15, 'ui');
    const now = this._now();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol || 0.15, now + 0.005);
    g.gain.setValueAtTime(vol || 0.15, now + dur - 0.02);
    g.gain.linearRampToValueAtTime(0, now + dur);
    o.connect(g);
    g.connect(dest || this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },
  _arpeggio(notes, noteDur, type, vol) {
    const now = this._now();
    notes.forEach((freq, i) => {
      const t = now + i * noteDur;
      const o = this._osc(type || 'triangle', freq);
      const g = this._gain(vol || 0.2, 'effects');
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol || 0.2, t + 0.008);
      g.gain.setValueAtTime(vol || 0.2, t + noteDur - 0.015);
      g.gain.linearRampToValueAtTime(0, t + noteDur);
      const r = this._reverb(0.3, 4);
      o.connect(g);
      g.connect(r);
      r.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + noteDur);
    });
  },
  _sweep(fromFreq, toFreq, dur, type, vol) {
    const o = this._osc(type || 'sine', fromFreq);
    o.frequency.exponentialRampToValueAtTime(toFreq || fromFreq * 4, this._now() + dur);
    const g = this._gain(vol || 0.12, 'effects');
    const now = this._now();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol || 0.12, now + 0.02);
    g.gain.linearRampToValueAtTime(0, now + dur);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  // ============== NAVIGATION & UI ==============

  nav() { if (!this._enabled) return;
    const p = this.profiles[this._profile];
    this._ensure();
    const d = 0.06;
    const o = this._osc(p.navType, p.selectFreq + 200);
    const now = this._now();
    const g = this._gain(0.08, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.003);
    g.gain.linearRampToValueAtTime(0, now + d);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  tick() { if (!this._enabled) return;
    this._ensure();
    const d = 0.025;
    const o = this._osc('sine', 1400 + Math.random() * 200);
    const now = this._now();
    const g = this._gain(0.04, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.04, now + 0.003);
    g.gain.linearRampToValueAtTime(0, now + d);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  hover() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const d = 0.015;
    const o = this._osc('sine', 2500);
    const g = this._gain(0.02, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.02, now + 0.002);
    g.gain.linearRampToValueAtTime(0, now + d);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  scroll() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const d = 0.02;
    const o = this._osc('triangle', 600 + Math.random() * 400);
    const g = this._gain(0.03, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.03, now + 0.003);
    g.gain.linearRampToValueAtTime(0, now + d);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  select() { if (!this._enabled) return;
    const p = this.profiles[this._profile];
    this._ensure();
    const now = this._now();
    const d = 0.25;
    const o = this._osc('triangle', p.selectFreq);
    o.frequency.linearRampToValueAtTime(p.confirmFreq, now + d);
    const g = this._gain(0.15, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.01);
    g.gain.setValueAtTime(0.15, now + d - 0.04);
    g.gain.linearRampToValueAtTime(0, now + d);
    const r = this._reverb(0.2, 5);
    o.connect(g);
    g.connect(r);
    r.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  confirm() { if (!this._enabled) return;
    this._ensure();
    this._arpeggio([523.25, 659.25, 783.99], 0.08, 'triangle', 0.15);
  },

  back() { if (!this._enabled) return;
    const p = this.profiles[this._profile];
    this._ensure();
    const now = this._now();
    const d = 0.2;
    const o = this._osc('triangle', p.backFreq + 200);
    o.frequency.linearRampToValueAtTime(p.backFreq - 200, now + d);
    const g = this._gain(0.1, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.008);
    g.gain.setValueAtTime(0.1, now + d - 0.05);
    g.gain.linearRampToValueAtTime(0, now + d);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  expand() { if (!this._enabled) return;
    this._ensure();
    this._sweep(400, 800, 0.12, 'triangle', 0.08);
  },

  collapse() { if (!this._enabled) return;
    this._ensure();
    this._sweep(800, 300, 0.1, 'triangle', 0.06);
  },

  toggleOn() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    [0, 0.06].forEach((off, i) => {
      const t = now + off;
      const freq = i === 0 ? 600 : 900;
      const o = this._osc('sine', freq);
      const g = this._gain(0.08, 'ui');
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.005);
      g.gain.linearRampToValueAtTime(0, t + 0.05);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.05);
    });
  },

  toggleOff() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    [0, 0.06].forEach((off, i) => {
      const t = now + off;
      const freq = i === 0 ? 500 : 300;
      const o = this._osc('sine', freq);
      const g = this._gain(0.06, 'ui');
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.005);
      g.gain.linearRampToValueAtTime(0, t + 0.05);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.05);
    });
  },

  drag() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const d = 0.08;
    const o = this._osc('sine', 200 + Math.random() * 100);
    const g = this._gain(0.04, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.04, now + 0.01);
    g.gain.linearRampToValueAtTime(0, now + d);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  drop() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const d = 0.15;
    const o = this._osc('triangle', 500);
    o.frequency.linearRampToValueAtTime(200, now + d);
    const g = this._gain(0.1, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.008);
    g.gain.setValueAtTime(0.1, now + d - 0.03);
    g.gain.linearRampToValueAtTime(0, now + d);
    const n = this._noise(0.08);
    const ng = this._gain(0.03, 'effects');
    ng.gain.setValueAtTime(0.03, now);
    ng.gain.linearRampToValueAtTime(0, now + 0.08);
    o.connect(g);
    g.connect(this._ctx.destination);
    n.connect(ng);
    ng.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
    n.start(now);
    n.stop(now + 0.08);
  },

  snap() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const o = this._osc('square', 1200);
    const g = this._gain(0);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.06, now + 0.002);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.04);
  },

  // ============== SYSTEM SOUNDS ==============

  boot() { if (!this._enabled) return;
    const p = this.profiles[this._profile];
    this._ensure();
    const now = this._now();
    const dur = 2.8;
    const master = this._gain(0.3, 'effects');
    const comp = this._compressor();

    p.bootFreqs.forEach((f, i) => {
      const o = this._osc(p.bootFreqs[i] < 150 ? 'sawtooth' : 'triangle', f);
      const g = this._gain(0, 'effects');
      const t = now + i * 0.12;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25 - i * 0.025, t + 0.6);
      g.gain.setValueAtTime(0.25 - i * 0.025, now + dur - 0.4);
      g.gain.linearRampToValueAtTime(0, now + dur);
      const fEnv = this._filter('lowpass', 150 + i * 80);
      fEnv.frequency.exponentialRampToValueAtTime(3000 + i * 300, t + 1.0);
      o.connect(g);
      g.connect(fEnv);
      fEnv.connect(master);
      o.start(t);
      o.stop(now + dur);
    });

    const sub = this._osc('sine', 65.41);
    const subG = this._gain(0, 'effects');
    subG.gain.setValueAtTime(0, now);
    subG.gain.linearRampToValueAtTime(0.15, now + 0.4);
    subG.gain.setValueAtTime(0.15, now + dur - 0.2);
    subG.gain.linearRampToValueAtTime(0, now + dur);
    sub.connect(subG);
    subG.connect(master);

    master.connect(comp);
    comp.connect(this._ctx.destination);

    setTimeout(() => this.bootClick(), 600);
    setTimeout(() => this.bootClick(), 1200);
    setTimeout(() => this.bootWoosh(), 2000);
  },

  bootClick() {
    const now = this._now();
    const o = this._osc('square', 2000);
    const g = this._gain(0);
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.03);
  },

  bootWoosh() {
    const n = this._noise(0.4);
    const f = this._filter('highpass', 500);
    f.frequency.exponentialRampToValueAtTime(5000, this._now() + 0.4);
    const g = this._gain(0.04, 'effects');
    n.connect(f);
    f.connect(g);
    g.connect(this._ctx.destination);
    n.start(this._now());
    n.stop(this._now() + 0.4);
  },

  poweroff() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 1.0;
    const o = this._osc('triangle', 300);
    o.frequency.exponentialRampToValueAtTime(40, now + dur);
    const g = this._gain(0);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.12, now + 0.04);
    g.gain.setValueAtTime(0.12, now + dur - 0.15);
    g.gain.linearRampToValueAtTime(0, now + dur);
    const f = this._filter('lowpass', 2000);
    f.frequency.exponentialRampToValueAtTime(60, now + dur);
    o.connect(g);
    g.connect(f);
    f.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  notification() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    [0, 0.12].forEach((off, i) => {
      const t = now + off;
      const freq = i === 0 ? 800 : 1000;
      const o = this._osc('sine', freq);
      const g = this._gain(0, 'ui');
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.008);
      g.gain.setValueAtTime(0.12, t + 0.05);
      g.gain.linearRampToValueAtTime(0, t + 0.1);
      const r = this._reverb(0.15, 6);
      o.connect(g);
      g.connect(r);
      r.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.1);
    });
  },

  warning() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    [0, 0.3].forEach(off => {
      const t = now + off;
      const o = this._osc('square', 220);
      const g = this._gain(0);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.01);
      g.gain.setValueAtTime(0.1, t + 0.12);
      g.gain.linearRampToValueAtTime(0, t + 0.18);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.18);
    });
  },

  error() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const dur = 0.4;
    const o = this._osc('sawtooth', 80);
    const g = this._gain(0, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.015);
    g.gain.setValueAtTime(0.1, now + dur - 0.08);
    g.gain.linearRampToValueAtTime(0, now + dur);
    const f = this._filter('lowpass', 200);
    f.frequency.exponentialRampToValueAtTime(600, now + dur * 0.5);
    f.frequency.exponentialRampToValueAtTime(100, now + dur);
    o.connect(g);
    g.connect(f);
    f.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + dur);
  },

  countdown() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    [0, 0.5, 1.0].forEach((off, i) => {
      const t = now + off;
      const o = this._osc('sine', i === 2 ? 1000 : 600);
      const g = this._gain(0, 'effects');
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.005);
      g.gain.setValueAtTime(0.1, t + 0.15);
      g.gain.linearRampToValueAtTime(0, t + 0.25);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.25);
    });
  },

  timer() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const o = this._osc('square', 1200);
    const g = this._gain(0, 'effects');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.003);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.06);
  },

  // ============== GAMING SOUNDS ==============

  achievement() { if (!this._enabled) return;
    this._ensure();
    this._arpeggio([523.25, 659.25, 783.99, 1046.5], 0.1, 'triangle', 0.2);
    this._rewardSparkle();
  },

  levelup() { if (!this._enabled) return;
    this._ensure();
    this._arpeggio([392, 523.25, 659.25, 783.99, 1046.5], 0.08, 'triangle', 0.18);
    const now = this._now();
    for (let i = 0; i < 5; i++) {
      const t = now + 0.2 + i * 0.08;
      const o = this._osc('sine', 1500 + Math.random() * 2000);
      const g = this._gain(0);
      g.gain.setValueAtTime(0.03, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.06);
    }
  },

  _rewardSparkle() {
    const now = this._now();
    const n = this._noise(0.15);
    const f = this._filter('bandpass', 4000, 2);
    const g = this._gain(0.03, 'effects');
    n.connect(f);
    f.connect(g);
    g.connect(this._ctx.destination);
    n.start(now);
    n.stop(now + 0.15);
    for (let i = 0; i < 8; i++) {
      const t = now + 0.3 + i * 0.04;
      const o = this._osc('sine', 2000 + Math.random() * 3000);
      const gg = this._gain(0);
      gg.gain.setValueAtTime(0.04, t);
      gg.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      o.connect(gg);
      gg.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.08);
    }
  },

  pickup() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    this._sweep(300, 1200, 0.12, 'sine', 0.1);
  },

  damage() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const o = this._osc('sawtooth', 120);
    const g = this._gain(0, 'effects');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.01);
    g.gain.setValueAtTime(0.1, now + 0.08);
    g.gain.linearRampToValueAtTime(0, now + 0.15);
    const f = this._filter('lowpass', 400);
    f.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    o.connect(g);
    g.connect(f);
    f.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.15);
  },

  alert() { if (!this._enabled) return;
    this._ensure();
    [0, 0.15, 0.3].forEach(off => {
      const t = this._now() + off;
      const o = this._osc('square', off < 0.2 ? 440 : 880);
      const g = this._gain(0);
      g.gain.setValueAtTime(0.08, t);
      g.gain.linearRampToValueAtTime(0, t + 0.1);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.1);
    });
  },

  // ============== STORE SOUNDS ==============

  installStart() { if (!this._enabled) return;
    this._ensure();
    this._sweep(300, 600, 0.2, 'triangle', 0.08);
  },

  installProgress() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const o = this._osc('sine', 500 + Math.random() * 300);
    const g = this._gain(0, 'effects');
    g.gain.setValueAtTime(0.03, now);
    g.gain.linearRampToValueAtTime(0, now + 0.04);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.04);
  },

  installComplete() { if (!this._enabled) return;
    this._ensure();
    this._arpeggio([392, 523.25, 659.25, 783.99], 0.1, 'triangle', 0.15);
    const now = this._now();
    const n = this._noise(0.3);
    const f = this._filter('highpass', 2000, 1);
    const g = this._gain(0.03, 'effects');
    n.connect(f);
    f.connect(g);
    g.connect(this._ctx.destination);
    n.start(now);
    n.stop(now + 0.3);
  },

  purchase() { if (!this._enabled) return;
    this._ensure();
    this._arpeggio([440, 554.37, 659.25, 880], 0.1, 'triangle', 0.18);
    this._rewardSparkle();
  },

  // ============== SOCIAL SOUNDS ==============

  friendOnline() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const o = this._osc('triangle', 440);
    const o2 = this._osc('triangle', 660);
    const g = this._gain(0, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.01);
    g.gain.setValueAtTime(0.08, now + 0.2);
    g.gain.linearRampToValueAtTime(0, now + 0.35);
    o.connect(g);
    o2.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.35);
    o2.start(now + 0.05);
    o2.stop(now + 0.35);
  },

  friendOffline() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const o = this._osc('triangle', 440);
    o.frequency.linearRampToValueAtTime(220, now + 0.3);
    const g = this._gain(0, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.06, now + 0.01);
    g.gain.linearRampToValueAtTime(0, now + 0.3);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.3);
  },

  messageIn() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const double = [600, 900];
    double.forEach((freq, i) => {
      const t = now + i * 0.06;
      const o = this._osc('sine', freq);
      const g = this._gain(0, 'ui');
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.005);
      g.gain.linearRampToValueAtTime(0, t + 0.05);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.05);
    });
  },

  messageOut() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const o = this._osc('sine', 500);
    o.frequency.linearRampToValueAtTime(800, now + 0.08);
    const g = this._gain(0, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.06, now + 0.005);
    g.gain.linearRampToValueAtTime(0, now + 0.08);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + 0.08);
  },

  callConnect() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.4;
      const freq = i === 0 ? 440 : i === 1 ? 480 : 440;
      const o = this._osc('sine', freq);
      const g = this._gain(0, 'ui');
      g.gain.setValueAtTime(0.08, t);
      g.gain.setValueAtTime(0.08, t + 0.15);
      g.gain.linearRampToValueAtTime(0, t + 0.2);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.2);
    }
  },

  // ============== FUN / CELEBRATION ==============

  celebration() { if (!this._enabled) return;
    this._ensure();
    this._arpeggio([523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5], 0.07, 'triangle', 0.15);
    const now = this._now();
    for (let i = 0; i < 12; i++) {
      const t = now + 0.1 + i * 0.06;
      const o = this._osc('sine', 1000 + Math.random() * 3000);
      const g = this._gain(0);
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.15);
    }
  },

  secret() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    this._arpeggio([262, 330, 392, 523, 659, 784], 0.06, 'square', 0.1);
    const f = this._filter('lowpass', 1000);
    f.frequency.linearRampToValueAtTime(4000, now + 0.5);
  },

  easterEgg() { if (!this._enabled) return;
    this._ensure();
    const notes = [262, 294, 330, 349, 392, 440, 494, 523];
    this._arpeggio(notes, 0.08, 'sine', 0.12);
  },

  confetti() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    for (let i = 0; i < 20; i++) {
      const t = now + i * 0.03;
      const o = this._osc('sine', 300 + Math.random() * 3000);
      const g = this._gain(0);
      g.gain.setValueAtTime(0.03, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.connect(g);
      g.connect(this._ctx.destination);
      o.start(t);
      o.stop(t + 0.12);
    }
  },

  // ============== AUTH SOUNDS ==============

  signin() { if (!this._enabled) return;
    this._ensure();
    this._arpeggio([392, 440, 523.25, 659.25], 0.08, 'triangle', 0.12);
  },

  signout() { if (!this._enabled) return;
    this._ensure();
    const now = this._now();
    const d = 0.35;
    const o = this._osc('triangle', 550);
    o.frequency.linearRampToValueAtTime(200, now + d);
    const g = this._gain(0, 'ui');
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.01);
    g.gain.linearRampToValueAtTime(0, now + d);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start(now);
    o.stop(now + d);
  },

  // ============== AMBIENT / BACKGROUND ==============

  startAmbient(type) {
    if (!this._enabled || !this._ctx) return;
    this.stopAmbient();
    const dur = 4;
    const loop = true;

    if (type === 'menu') {
      const bufferSize = this._ctx.sampleRate * dur;
      const buf = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this._ctx.sampleRate;
        d[i] = Math.sin(2 * Math.PI * 65.41 * t) * 0.02 +
               Math.sin(2 * Math.PI * 130.81 * t) * 0.01 * Math.sin(2 * Math.PI * 0.25 * t) +
               Math.random() * 0.005;
      }
      const src = this._ctx.createBufferSource();
      src.buffer = buf;
      src.loop = loop;
      const f = this._filter('lowpass', 300);
      const g = this._gain(0, 'ambient');
      g.gain.linearRampToValueAtTime(0.15, this._now() + 1);
      src.connect(f);
      f.connect(g);
      g.connect(this._ctx.destination);
      src.start();
      this._bgNode = src;
      this._bgGain = g;
    } else if (type === 'store') {
      const bufferSize = this._ctx.sampleRate * dur;
      const buf = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this._ctx.sampleRate;
        d[i] = Math.sin(2 * Math.PI * 261.63 * t) * 0.015 * Math.sin(2 * Math.PI * 0.3 * t) +
               Math.sin(2 * Math.PI * 392 * t) * 0.008 * Math.sin(2 * Math.PI * 0.2 * t) +
               Math.random() * 0.003;
      }
      const src = this._ctx.createBufferSource();
      src.buffer = buf;
      src.loop = loop;
      const f = this._filter('lowpass', 400);
      const g = this._gain(0, 'ambient');
      g.gain.linearRampToValueAtTime(0.12, this._now() + 1);
      src.connect(f);
      f.connect(g);
      g.connect(this._ctx.destination);
      src.start();
      this._bgNode = src;
      this._bgGain = g;
    }
  },

  stopAmbient() {
    if (this._bgNode) {
      try { this._bgNode.stop(); } catch {}
      this._bgNode = null;
    }
    if (this._bgGain) {
      this._bgGain.gain.linearRampToValueAtTime(0, this._now() + 0.3);
      this._bgGain = null;
    }
  },

  // ============== SETTINGS ==============

  setEnabled(on) { this._enabled = on; if (!on) this.stopAmbient(); },

  setVolume(v, category) {
    if (category) {
      this._volume[category] = Math.max(0, Math.min(1, v));
    } else {
      this._volume.master = Math.max(0, Math.min(1, v));
    }
  },

  setProfile(name) {
    if (this.profiles[name]) {
      this._profile = name;
      if (this._initialized) this.boot();
    }
  },

  getProfiles() {
    const list = [];
    for (const [key, val] of Object.entries(this.profiles)) {
      list.push({ id: key, ...val });
    }
    return list;
  },

  getAnalyserData() {
    if (!this._analyser) return null;
    this._analyser.getByteFrequencyData(this._analyserData);
    return this._analyserData;
  },

  // ============== VOICE ==============

  speak(text, lang) {
    if (!this._enabled || !this._volume.voice || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'en-US';
    u.rate = 0.9;
    u.pitch = 1.0;
    u.volume = this._volume.master * this._volume.voice;
    window.speechSynthesis.speak(u);
  },

  sayAchievement(name) {
    this.speak(`Achievement unlocked: ${name}`);
  },

  sayNotification(title, message) {
    this.speak(`${title}: ${message}`);
  },

  sayWelcome(name) {
    this.speak(`Welcome, ${name}. R Q B B O X is ready.`);
  },
};

window.RQBAudio = RQBAudio;
