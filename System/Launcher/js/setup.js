/* RQBBOX OS - Console Setup Wizard (10 Steps) */
const SetupWizard = {
  step: 1,
  totalSteps: 10,
  data: {},

  start() {
    this.step = 1;
    this.data = {};
    RQB.hideAllAuth();
    const screen = RQB.$('#setup-screen');
    if (screen) {
      screen.classList.add('active');
      this.render();
    }
  },

  render() {
    const screen = RQB.$('#setup-screen');
    if (!screen) return;

    const steps = {
      1: {
        icon: '🎮', title: 'Welcome to RQBBOX OS', subtitle: 'Let\'s get you set up in 10 quick steps',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:3rem;margin-bottom:12px;">🎮</div>
            <p style="color:var(--text-secondary);font-size:.9rem;line-height:1.7;max-width:400px;margin:0 auto;">
              Your portable gaming OS runs from any USB. Plug into any PC and pick up where you left off.
            </p>
          </div>
          <div class="form-group"><label>Display Language</label>
            <select id="setup-lang" style="width:100%;padding:12px 16px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:14px;color:var(--text-primary);font-size:1rem;outline:none;font-family:inherit;">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select></div>
          <div class="form-group"><label>Region</label>
            <select id="setup-region" style="width:100%;padding:12px 16px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:14px;color:var(--text-primary);font-size:1rem;outline:none;font-family:inherit;">
              <option value="us">United States</option><option value="eu">Europe</option>
              <option value="uk">United Kingdom</option><option value="asia">Asia</option>
              <option value="other">Other</option>
            </select></div>`
      },
      2: {
        icon: '🌐', title: 'Network Connection', subtitle: 'Connect to the internet for cloud features',
        content: `
          <div style="text-align:center;margin-bottom:16px;">
            <div style="font-size:3rem;margin-bottom:8px;">🌐</div>
          </div>
          <div id="setup-network-status" style="padding:16px;border-radius:14px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);margin-bottom:16px;text-align:center;">
            <span id="setup-net-icon" style="font-size:2rem;">🔍</span>
            <p id="setup-net-text" style="margin-top:8px;color:var(--text-secondary);font-size:.85rem;">Checking network...</p>
          </div>
          <div class="setting-row"><div><div class="setting-label">Connect on startup</div><div class="setting-desc">Auto-connect when USB is plugged in</div></div><button class="toggle on" id="setup-auto-net" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">Cloud Sync</div><div class="setting-desc">Sync saves & settings across devices</div></div><button class="toggle on" id="setup-cloud-sync" onclick="this.classList.toggle('on')"></button></div>`
      },
      3: {
        icon: '👤', title: 'Your Account', subtitle: 'Sign in or create a RhysTech profile',
        content: `
          <div style="text-align:center;margin-bottom:12px;">
            <div style="font-size:3rem;margin-bottom:4px;">👤</div>
          </div>
          <div class="form-group"><label>Display Name (Gamer Tag)</label>
            <input type="text" id="setup-name" placeholder="Your display name" required style="width:100%;padding:12px 16px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:14px;color:var(--text-primary);font-size:1rem;outline:none;font-family:inherit;"></div>
          <div class="form-group"><label>Username</label>
            <input type="text" id="setup-username" placeholder="Choose a username" required style="width:100%;padding:12px 16px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:14px;color:var(--text-primary);font-size:1rem;outline:none;font-family:inherit;"></div>
          <div class="form-group"><label>Password (optional PIN)</label>
            <input type="password" id="setup-pass" placeholder="Leave blank for no PIN" style="width:100%;padding:12px 16px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:14px;color:var(--text-primary);font-size:1rem;outline:none;font-family:inherit;"></div>
          <div style="display:flex;gap:8px;margin-top:8px;">
            <span id="setup-avatar-preview" style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);border-radius:12px;font-size:.85rem;color:var(--neon-blue);cursor:pointer;" onclick="SetupWizard.randomAvatar()">🎲 Avatar: <strong id="setup-avatar-char">P</strong></span>
          </div>`
      },
      4: {
        icon: '⭐', title: 'Choose Edition', subtitle: 'Pick your RQBBOX experience',
        content: this.editionCards()
      },
      5: {
        icon: '🎨', title: 'Personalization', subtitle: 'Choose your look and feel',
        content: `
          <div style="text-align:center;margin-bottom:12px;">
            <div style="font-size:3rem;margin-bottom:4px;">🎨</div>
          </div>
          <div id="setup-display-preview" style="width:100%;height:80px;background:linear-gradient(135deg,#050810,#0a2040);border-radius:14px;border:2px solid var(--neon-blue);margin-bottom:16px;display:flex;align-items:center;justify-content:center;">
            <span style="color:var(--neon-blue);font-weight:700;letter-spacing:4px;">RQBBOX</span>
          </div>
          <div class="form-group"><label>Theme</label>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button class="setup-theme-btn selected" data-theme="neon-dark" onclick="SetupWizard.selectTheme('neon-dark',this)" style="flex:1;min-width:100px;padding:10px;border-radius:14px;border:2px solid var(--neon-blue);background:linear-gradient(135deg,#050810,#0a2040);cursor:pointer;font-family:inherit;color:#fff;font-size:.8rem;">🌙 Neon Dark</button>
              <button class="setup-theme-btn" data-theme="purple" onclick="SetupWizard.selectTheme('purple',this)" style="flex:1;min-width:100px;padding:10px;border-radius:14px;border:2px solid rgba(255,255,255,0.1);background:linear-gradient(135deg,#1a0a30,#0a1530);cursor:pointer;font-family:inherit;color:#fff;font-size:.8rem;">🔮 Purple Haze</button>
              <button class="setup-theme-btn" data-theme="cyber" onclick="SetupWizard.selectTheme('cyber',this)" style="flex:1;min-width:100px;padding:10px;border-radius:14px;border:2px solid rgba(255,255,255,0.1);background:linear-gradient(135deg,#0a2010,#051810);cursor:pointer;font-family:inherit;color:#fff;font-size:.8rem;">💚 Cyber Green</button>
              <button class="setup-theme-btn" data-theme="light" onclick="SetupWizard.selectTheme('light',this)" style="flex:1;min-width:100px;padding:10px;border-radius:14px;border:2px solid rgba(255,255,255,0.1);background:linear-gradient(135deg,#e8f0ff,#ffffff);cursor:pointer;font-family:inherit;color:#000;font-size:.8rem;">☀️ Light</button>
            </div></div>
          <div class="setting-row"><div><div class="setting-label">Accent Color</div></div>
            <div style="display:flex;gap:6px;">
              ${this.accentSwatches()}
            </div></div>`
      },
      6: {
        icon: '🔊', title: 'Audio & Display', subtitle: 'Tune your sensory experience',
        content: `
          <div style="text-align:center;margin-bottom:12px;">
            <div style="font-size:3rem;margin-bottom:4px;">🔊</div>
          </div>
          <div class="setting-row"><div><div class="setting-label">Startup Sound</div><div class="setting-desc">Play audio on boot</div></div><button class="toggle on" id="setup-startup-sound" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">UI Sounds</div><div class="setting-desc">Click & hover sounds</div></div><button class="toggle on" id="setup-ui-sounds" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">UI Animations</div><div class="setting-desc">Smooth page transitions</div></div><button class="toggle on" id="setup-animations" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">Performance Mode</div><div class="setting-desc">Reduce effects on low-end PCs</div></div><button class="toggle" id="setup-perf" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">Fullscreen on Launch</div><div class="setting-desc">Auto fullscreen when opening games</div></div><button class="toggle on" id="setup-fullscreen" onclick="this.classList.toggle('on')"></button></div>`
      },
      7: {
        icon: '📦', title: 'Quick Install', subtitle: 'Pre-load some starter content',
        content: `
          <div style="text-align:center;margin-bottom:12px;">
            <div style="font-size:3rem;margin-bottom:4px;">📦</div>
            <p style="color:var(--text-secondary);font-size:.8rem;">Pick a few games and apps to install right away</p>
          </div>
          ${this.quickInstallCards()}
          </div>`
      },
      8: {
        icon: '🎮', title: 'Controller Setup', subtitle: 'Configure your gamepad (or skip)',
        content: `
          <div style="text-align:center;margin-bottom:12px;">
            <div style="font-size:3rem;margin-bottom:4px;">🎮</div>
          </div>
          <div id="setup-controller-status" style="padding:20px;border-radius:14px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);margin-bottom:16px;text-align:center;">
            <span id="setup-ctrl-icon" style="font-size:3rem;">🔌</span>
            <p id="setup-ctrl-text" style="margin-top:8px;color:var(--text-secondary);font-size:.85rem;">Press any button on your controller...</p>
          </div>
          <div class="form-group"><label>Dead Zone</label>
            <input type="range" id="setup-deadzone" min="0" max="50" value="15" style="width:100%;" oninput="document.getElementById('setup-dz-val').textContent=this.value">
            <span id="setup-dz-val" style="font-size:.8rem;color:var(--text-muted);">15%</span></div>
          <div class="setting-row"><div><div class="setting-label">Enable Controller</div><div class="setting-desc">Gamepad support on startup</div></div><button class="toggle on" id="setup-ctrl-enable" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">Vibration</div><div class="setting-desc">Rumble on supported controllers</div></div><button class="toggle on" id="setup-vibration" onclick="this.classList.toggle('on')"></button></div>`
      },
      9: {
        icon: '🔒', title: 'Privacy & Updates', subtitle: 'Control your data and update preferences',
        content: `
          <div style="text-align:center;margin-bottom:12px;">
            <div style="font-size:3rem;margin-bottom:4px;">🔒</div>
          </div>
          <p style="color:var(--text-secondary);font-size:.85rem;margin-bottom:16px;text-align:center;">We respect your privacy. These settings can be changed anytime in Settings.</p>
          <div class="setting-row"><div><div class="setting-label">Usage Analytics</div><div class="setting-desc">Help improve RQBBOX with anonymous usage data</div></div><button class="toggle on" id="setup-telemetry" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">Auto-Update</div><div class="setting-desc">Automatically check for system updates</div></div><button class="toggle on" id="setup-auto-update" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">Crash Reports</div><div class="setting-desc">Send anonymous crash data to RhysTech</div></div><button class="toggle" id="setup-crash-reports" onclick="this.classList.toggle('on')"></button></div>
          <div class="setting-row"><div><div class="setting-label">Device Registration</div><div class="setting-desc">Register this USB for cloud features</div></div><button class="toggle on" id="setup-device-reg" onclick="this.classList.toggle('on')"></button></div>`
      },
      10: {
        icon: '✅', title: 'All Set!', subtitle: 'Here\'s what we\'ll configure',
        content: `
          <div style="text-align:center;margin-bottom:12px;">
            <div style="font-size:3rem;margin-bottom:4px;">✅</div>
          </div>
          <div id="setup-summary" style="padding:16px;border-radius:14px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);margin-bottom:16px;">
            <p style="color:var(--text-secondary);font-size:.85rem;text-align:center;">Summary of your choices will appear here.</p>
          </div>
          <p style="color:var(--text-secondary);font-size:.8rem;text-align:center;line-height:1.6;">
            You can change any of these settings later in the Settings panel.<br>
            Ready to jump in!
          </p>`
      }
    };

    const s = steps[this.step];
    const dotsHtml = Array.from({length: this.totalSteps}, (_, i) => {
      const n = i + 1;
      let cls = 'setup-dot';
      if (n < this.step) cls += ' done';
      if (n === this.step) cls += ' current';
      return `<div class="${cls}">${n < this.step ? '✓' : n}</div>`;
    }).join('');

    screen.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-progress">
          ${dotsHtml}
          <div class="setup-progress-line"><div class="setup-progress-fill" style="width:${((this.step-1)/(this.totalSteps-1))*100}%"></div></div>
        </div>
        <div class="setup-card" style="max-width:520px;">
          <div style="text-align:center;font-size:2.5rem;margin-bottom:8px;">${s.icon}</div>
          <h2 style="text-align:center;margin-bottom:2px;">${s.title}</h2>
          <p style="text-align:center;color:var(--text-secondary);font-size:.82rem;margin-bottom:20px;">Step ${this.step} of ${this.totalSteps} · ${s.subtitle}</p>
          ${s.content}
          <div style="display:flex;gap:12px;margin-top:20px;justify-content:space-between;">
            <button class="btn btn-ghost" style="width:auto;${this.step === 1 ? 'visibility:hidden;' : ''}" onclick="SetupWizard.prev()">← Back</button>
            <button class="btn btn-primary" style="width:auto;" onclick="SetupWizard.next()">${this.step === this.totalSteps ? '🚀 Start Playing' : 'Continue →'}</button>
          </div>
        </div>
      </div>`;

    if (this.step === 2) this.checkNetwork();
    if (this.step === 8) this.detectController();
    if (this.step === 7) this.updateQuickCount();
  },

  checkNetwork() {
    const icon = document.getElementById('setup-net-icon');
    const text = document.getElementById('setup-net-text');
    if (!icon || !text) return;
    if (navigator.onLine) {
      icon.textContent = '🟢';
      text.textContent = 'Connected to the internet — cloud features available';
    } else {
      icon.textContent = '🟡';
      text.textContent = 'Offline — you can change this later in Settings';
    }
  },

  detectController() {
    const icon = document.getElementById('setup-ctrl-icon');
    const text = document.getElementById('setup-ctrl-text');
    if (!icon || !text) return;
    const poll = setInterval(() => {
      const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
      if (pads.length) {
        icon.textContent = '🎮';
        text.textContent = `Controller detected: ${pads[0].id.substring(0, 40)}`;
        clearInterval(poll);
      }
    }, 500);
    setTimeout(() => { clearInterval(poll); if (icon.textContent === '🔌') { icon.textContent = '⏭️'; text.textContent = 'No controller detected — you can set one up later'; } }, 5000);
  },

  next() {
    if (this.step === 1) {
      this.data.lang = RQB.$('#setup-lang')?.value || 'en';
      this.data.region = RQB.$('#setup-region')?.value || 'us';
    }
    if (this.step === 2) {
      this.data.autoConnect = RQB.$('#setup-auto-net')?.classList.contains('on') ?? true;
      this.data.cloudSync = RQB.$('#setup-cloud-sync')?.classList.contains('on') ?? true;
    }
    if (this.step === 3) {
      const name = RQB.$('#setup-name')?.value?.trim();
      const username = RQB.$('#setup-username')?.value?.trim();
      const password = RQB.$('#setup-pass')?.value;
      const avatar = RQB.$('#setup-avatar-char')?.textContent || name?.[0]?.toUpperCase() || 'P';
      if (!name || !username) { RQB.toast('Name and username required'); return; }
      this.data.name = name;
      this.data.username = username;
      this.data.password = password;
      this.data.avatar = avatar;
    }
    if (this.step === 4) {
      if (!this.data.edition) { RQB.toast('Please select an edition'); return; }
    }
    if (this.step === 5) {
      this.data.theme = this.data.theme || 'neon-dark';
      this.data.accent = this.data.accent || '#00d4ff';
    }
    if (this.step === 6) {
      this.data.startupSound = RQB.$('#setup-startup-sound')?.classList.contains('on') ?? true;
      this.data.uiSounds = RQB.$('#setup-ui-sounds')?.classList.contains('on') ?? true;
      this.data.animations = RQB.$('#setup-animations')?.classList.contains('on') ?? true;
      this.data.performanceMode = RQB.$('#setup-perf')?.classList.contains('on') ?? false;
      this.data.fullscreen = RQB.$('#setup-fullscreen')?.classList.contains('on') ?? true;
    }
    if (this.step === 7) {
      this.data.quickInstall = this.data.quickInstall || [];
    }
    if (this.step === 8) {
      this.data.deadZone = parseInt(RQB.$('#setup-deadzone')?.value || '15');
      this.data.controllerEnabled = RQB.$('#setup-ctrl-enable')?.classList.contains('on') ?? true;
      this.data.vibration = RQB.$('#setup-vibration')?.classList.contains('on') ?? true;
    }
    if (this.step === 9) {
      this.data.telemetry = RQB.$('#setup-telemetry')?.classList.contains('on') ?? true;
      this.data.autoUpdate = RQB.$('#setup-auto-update')?.classList.contains('on') ?? true;
      this.data.crashReports = RQB.$('#setup-crash-reports')?.classList.contains('on') ?? false;
      this.data.deviceReg = RQB.$('#setup-device-reg')?.classList.contains('on') ?? true;
    }
    if (this.step === 10) {
      this.finish();
      return;
    }
    this.step++;
    this.render();
  },

  prev() {
    if (this.step > 1) this.step--;
    this.render();
  },

  selectEdition(edition, el) {
    this.data.edition = edition;
    document.querySelectorAll('.setup-edition-card').forEach(c => {
      c.style.borderColor = 'rgba(255,255,255,0.08)';
      c.style.background = 'rgba(0,0,0,0.3)';
    });
    el.style.borderColor = 'var(--neon-blue)';
    el.style.background = 'rgba(0,212,255,0.08)';
  },

  selectTheme(theme, btn) {
    this.data.theme = theme;
    document.querySelectorAll('.setup-theme-btn').forEach(b => b.style.borderColor = 'rgba(255,255,255,0.1)');
    if (btn) btn.style.borderColor = 'var(--neon-blue)';
  },

  selectAccent(color, el) {
    this.data.accent = color;
    document.querySelectorAll('.setup-color-swatch').forEach(s => s.style.borderColor = 'transparent');
    el.style.borderColor = '#fff';
  },

  toggleQuick(el) {
    el.classList.toggle('selected');
    if (!this.data.quickInstall) this.data.quickInstall = [];
    const id = el.dataset.id;
    if (el.classList.contains('selected')) {
      if (!this.data.quickInstall.includes(id)) this.data.quickInstall.push(id);
    } else {
      this.data.quickInstall = this.data.quickInstall.filter(i => i !== id);
    }
    this.updateQuickCount();
  },

  updateQuickCount() {
    const count = this.data.quickInstall?.length || document.querySelectorAll('.setup-quick-card.selected').length;
    const el = document.querySelector('.setup-card p');
    if (el && this.step === 7) {
      const p = el.textContent.includes('pick') ? el : null;
    }
  },

  randomAvatar() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const char = chars[Math.floor(Math.random() * chars.length)];
    const el = RQB.$('#setup-avatar-char');
    if (el) el.textContent = char;
  },

  finish() {
    const cfg = RQBBOX_DATA.config;
    cfg.system.language = this.data.lang || 'en';
    cfg.system.region = this.data.region || 'us';
    cfg.display.theme = this.data.theme || 'neon-dark';
    cfg.display.accent = this.data.accent || '#00d4ff';
    cfg.display.animations = this.data.animations ?? true;
    cfg.display.performanceMode = this.data.performanceMode ?? false;
    cfg.display.fullscreen = this.data.fullscreen ?? true;
    cfg.audio.startupSound = this.data.startupSound ?? true;
    cfg.audio.uiSounds = this.data.uiSounds ?? true;
    cfg.network = cfg.network || {};
    cfg.network.autoConnect = this.data.autoConnect ?? true;
    cfg.network.cloudSync = this.data.cloudSync ?? true;
    cfg.input = cfg.input || {};
    cfg.input.deadZone = this.data.deadZone || 15;
    cfg.input.controllerEnabled = this.data.controllerEnabled ?? true;
    cfg.input.vibration = this.data.vibration ?? true;
    cfg.privacy = cfg.privacy || {};
    cfg.privacy.telemetry = this.data.telemetry ?? true;
    cfg.privacy.autoUpdate = this.data.autoUpdate ?? true;
    cfg.privacy.crashReports = this.data.crashReports ?? false;
    cfg.privacy.deviceReg = this.data.deviceReg ?? true;
    saveConfig();

    const newUser = {
      id: 'user-' + Date.now(),
      name: this.data.name || 'Player',
      username: this.data.username || 'player',
      avatar: this.data.avatar || 'P',
      role: 'Owner',
      pin: this.data.password || null,
      token: null,
      theme: this.data.theme || 'neon-dark',
      recentApps: [],
      achievements: 0,
      playTime: '0m',
      stats: { sessions: 0, minutesActive: 0, gamesLaunched: 0, appsLaunched: 0, achievements: 0, storeInstalls: 0, screenshots: 0, aiImages: 0, _achNames: [] }
    };

    RQBBOX_DATA.profiles.users.push(newUser);
    saveProfiles();

    if (RQBApi.online) {
      RQBApi.register(this.data.name, this.data.username, this.data.password).catch(() => {});
    }

    if (this.data.quickInstall?.length) {
      this.data.quickInstall.forEach(id => {
        const type = RQBBOX_DATA.store?.games?.find(g => g.id === id) ? 'game' : 'app';
        const key = type === 'game' ? 'games' : 'apps';
        if (!RQBBOX_DATA.profiles.installed[key].includes(id)) {
          RQBBOX_DATA.profiles.installed[key].push(id);
        }
      });
      saveProfiles();
    }

    Editions.setEdition(this.data.edition || 'lite');
    SettingsPage.setTheme(this.data.theme || 'neon-dark');

    localStorage.setItem('rqbbox_setup_done', 'true');
    RQB.$('#setup-screen')?.classList.remove('active');
    Boot.loginUser(newUser);
    RQB.toast('Setup complete! Welcome to RQBBOX OS.');
  },

  editionCards() {
    var editions = [
      {id:'lite',icon:'🚀',name:'RQBBOX Lite',desc:'Fast & lightweight. Perfect for casual gaming on any USB.',features:'10 games - 5 apps - Basic tools'},
      {id:'pro',icon:'⚡',name:'RQBBOX Pro',desc:'Full power. Cloud sync, advanced tools, unlimited installs.',features:'Unlimited games & apps - Cloud sync - Performance tools'},
      {id:'creator',icon:'🔧',name:'RQBBOX Creator',desc:'For developers. SDK access, plugin editor, theme builder.',features:'All Pro features - SDK access - Plugin/Theme editor'}
    ];
    var html = '';
    for (var i = 0; i < editions.length; i++) {
      var e = editions[i];
      html += '<div class="setup-edition-card" data-edition="' + e.id + '" onclick="SetupWizard.selectEdition(\'' + e.id + '\',this)" style="padding:16px;border-radius:14px;border:2px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.3);cursor:pointer;transition:all .2s;">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
        '<span style="font-size:2rem;">' + e.icon + '</span>' +
        '<div style="flex:1;"><strong>' + e.name + '</strong><p style="font-size:.8rem;color:var(--text-secondary);margin-top:4px;">' + e.desc + '</p>' +
        '<span style="font-size:.7rem;color:var(--neon-blue);">' + e.features + '</span></div></div></div>';
    }
    return '<div style="display:flex;gap:12px;flex-direction:column;">' + html + '</div>';
  },

  accentSwatches() {
    var colors = ['#00d4ff','#9d4edd','#ff00aa','#00ffc8','#ffaa00','#ff4444'];
    var html = '';
    for (var i = 0; i < colors.length; i++) {
      var c = colors[i];
      html += '<span class="setup-color-swatch" data-color="' + c + '" onclick="SetupWizard.selectAccent(\'' + c + '\',this)" style="width:28px;height:28px;border-radius:50%;background:' + c + ';cursor:pointer;border:2px solid transparent;display:inline-block;"></span>';
    }
    return html;
  },

  quickInstallCards() {
    var apps = [
      {id:'neon-drift',icon:'🏎️',name:'Neon Drift',cat:'Game'},
      {id:'pixel-quest',icon:'⚔️',name:'Pixel Quest',cat:'Game'},
      {id:'star-fighter',icon:'🚀',name:'Star Fighter',cat:'Game'},
      {id:'void-craft',icon:'🌍',name:'Void Craft',cat:'Game'},
      {id:'retro-zone',icon:'👾',name:'Retro Zone',cat:'Game'},
      {id:'cube-runner',icon:'🎲',name:'Cube Runner',cat:'Game'},
      {id:'music-wave',icon:'🎵',name:'Music Wave',cat:'App'},
      {id:'notes-pro',icon:'📝',name:'Notes Pro',cat:'App'},
      {id:'media-hub',icon:'🎬',name:'Media Hub',cat:'App'},
      {id:'rqb-browser',icon:'🌐',name:'RQB Browser',cat:'App'}
    ];
    var html = '';
    for (var i = 0; i < apps.length; i++) {
      var a = apps[i];
      html += '<div class="setup-quick-card selected" data-id="' + a.id + '" data-type="' + a.cat.toLowerCase() + '" onclick="SetupWizard.toggleQuick(this)" style="padding:10px;border-radius:12px;border:1px solid rgba(0,212,255,0.3);background:rgba(0,212,255,0.08);cursor:pointer;text-align:center;transition:all .2s;">' +
        '<div style="font-size:1.5rem;">' + a.icon + '</div>' +
        '<div style="font-size:.75rem;margin-top:4px;color:var(--text-primary);">' + a.name + '</div>' +
        '<span style="font-size:.6rem;color:var(--neon-blue);">' + a.cat + '</span></div>';
    }
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' + html + '</div>';
  }
};
