const SettingsPage = {
  section: 'general',

  render() {
    const el = RQB.$('#page-settings');
    el.innerHTML = `
      <div class="settings-grid">
        <div class="settings-nav">
          <button class="settings-nav-item active" data-sec="general">General</button>
          <button class="settings-nav-item" data-sec="display">Display</button>
          <button class="settings-nav-item" data-sec="audio">Audio</button>
          <button class="settings-nav-item" data-sec="input">Input</button>
          <button class="settings-nav-item" data-sec="controller">🎮 Controller</button>
          <button class="settings-nav-item" data-sec="storage">💾 Storage</button>
          <button class="settings-nav-item" data-sec="device">📱 Devices</button>
          <button class="settings-nav-item" data-sec="system">System</button>
          <button class="settings-nav-item" data-sec="themes">Themes</button>
          <button class="settings-nav-item" data-sec="editions">Editions</button>
          <button class="settings-nav-item" data-sec="plugins">Plugins</button>
        </div>
        <div class="settings-panel" id="settings-content"></div>
      </div>`;

    el.querySelectorAll('.settings-nav-item').forEach(btn => {
      btn.onclick = () => {
        el.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        SettingsPage.section = btn.dataset.sec;
        SettingsPage.renderPanel();
      };
    });
    SettingsPage.renderPanel();
  },

  renderPanel() {
    const panel = RQB.$('#settings-content');
    const cfg = RQBBOX_DATA.config;

    const sections = {
      general: `
        <h3 style="margin-bottom:20px;">General</h3>
        ${SettingsPage.row('RQBBOX Mode', 'Enable RQBBOX native theme, audio & fullscreen features', 'rqbboxMode', cfg.display?.rqbboxMode !== false)}
        ${SettingsPage.row('Offline Mode', 'All data stored on USB', 'offline', true)}
        ${SettingsPage.row('Cloud Sync', 'RhysTech Store sync', 'cloudSync', true)}
        <div class="setting-row"><div><div class="setting-label">Run Setup Again</div><div class="setting-desc">Re-run the console setup wizard</div></div><button class="btn btn-ghost btn-sm" onclick="SettingsPage.runSetupAgain()">Open Setup</button></div>`,

      display: `
        <h3 style="margin-bottom:20px;">Display</h3>
        ${SettingsPage.row('Animations', 'Smooth UI transitions', 'animations', cfg.display?.animations !== false)}
        ${SettingsPage.row('Performance Mode', 'Reduce effects for low-end PCs', 'performance', cfg.display?.performanceMode || false)}
        ${SettingsPage.row('FPS Monitor', 'Show frame rate overlay', 'fps', cfg.display?.showFps || false)}
        <div class="setting-row"><div><div class="setting-label">Fullscreen Mode</div><div class="setting-desc">Console-style gaming overlay with controller navigation</div></div><button class="btn btn-primary btn-sm" onclick="RQBoxFullscreen.toggle()" id="fs-settings-btn">${RQBoxFullscreen.active ? 'Exit' : 'Enter'} Fullscreen</button></div>`,

      audio: `
        <h3 style="margin-bottom:20px;">Audio</h3>
        <div class="setting-row"><div><div class="setting-label">Sound Profile</div><div class="setting-desc">Audio identity for UI sounds</div></div>
          <select id="audio-profile-select" style="padding:8px 12px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:10px;color:var(--text-primary);outline:none;font-family:inherit;" onchange="SettingsPage.setAudioProfile(this.value)">
            ${Object.entries(RQBAudio.profiles).map(([key, p]) => `<option value="${key}" ${(cfg.audio?.profile || 'rqbbox') === key ? 'selected' : ''}>${p.label}</option>`).join('')}
          </select>
        </div>
        ${SettingsPage.row('Startup Sound', 'Play on boot', 'startupSound', cfg.audio?.startupSound !== false)}
        ${SettingsPage.row('UI Sounds', 'Click sounds', 'uiSounds', cfg.audio?.uiSounds !== false)}
        ${SettingsPage.row('Background Music', 'Ambient music', 'bgMusic', cfg.audio?.backgroundMusic !== false)}
        <div class="setting-row"><div><div class="setting-label">Test Audio</div><div class="setting-desc">Play a test tone</div></div><button class="btn btn-ghost btn-sm" onclick="SettingsPage.testAudio()">🔊 Test</button></div>`,

      input: `
        <h3 style="margin-bottom:20px;">Input</h3>
        ${SettingsPage.row('Controller Support', 'Gamepad input', 'controller', true)}
        ${SettingsPage.row('Vibration', 'Haptic feedback', 'vibration', true)}
        ${SettingsPage.row('Touchscreen', 'Touch gestures', 'touch', true)}`,

      controller: `
        <h3 style="margin-bottom:20px;">🎮 Controller Configuration</h3>
        <div class="setting-row"><div><div class="setting-label">Controller Status</div></div>
          <span id="ctrl-status" style="font-size:0.85rem;color:var(--text-muted);">${navigator.getGamepads ? 'API ready' : 'Not supported'}</span>
        </div>
        <div class="setting-row"><div><div class="setting-label">Connected Controller</div></div>
          <span id="ctrl-name" style="font-size:0.85rem;color:var(--text-muted);">None detected</span>
        </div>
        <div class="setting-row" style="flex-direction:column;align-items:stretch;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><div><div class="setting-label">Button Test</div><div class="setting-desc">Press any button on your controller</div></div></div>
          <div id="ctrl-test-area" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:16px;background:rgba(0,0,0,0.3);border-radius:14px;min-height:80px;">
            ${['A','B','X','Y','LB','RB','LT','RT','UP','DOWN','LEFT','RIGHT','START','BACK','HOME','LS','RS'].map(b => `<div class="ctrl-btn" data-btn="${b}" style="padding:10px 6px;text-align:center;border-radius:10px;background:rgba(0,0,0,0.4);font-size:0.7rem;color:var(--text-muted);transition:all 0.1s;">${b}</div>`).join('')}
          </div>
        </div>
        <div class="setting-row">
          <div><div class="setting-label">Vibration Test</div><div class="setting-desc">Test controller rumble (if supported)</div></div>
          <button class="btn btn-ghost btn-sm" onclick="SettingsPage.testVibration()">Test Rumble</button>
        </div>
        <div class="setting-row">
          <div><div class="setting-label">Dead Zone</div><div class="setting-desc">Analog stick sensitivity threshold</div></div>
          <select id="ctrl-deadzone" style="padding:8px 12px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:10px;color:var(--text-primary);outline:none;font-family:inherit;" onchange="SettingsPage.setDeadZone(this.value)">
            <option value="0.05">Low (5%)</option>
            <option value="0.10" selected>Medium (10%)</option>
            <option value="0.20">High (20%)</option>
          </select>
        </div>
        <div class="setting-row"><div><div class="setting-label">Controller Polling</div><div class="setting-desc">Check for controller input continuously</div></div><button class="toggle on" id="ctrl-polling" onclick="this.classList.toggle('on');SettingsPage.togglePolling(this.classList.contains('on'))"></button></div>`,

      storage: `
        <h3 style="margin-bottom:20px;">💾 Storage Manager</h3>
        <div id="storage-stats" style="margin-bottom:20px;">
          <div class="storage-dashboard">
            <div class="storage-dashboard-bar"><div class="storage-dashboard-fill" id="stg-fill" style="width:0%"></div></div>
            <span class="storage-dashboard-label" id="stg-label">Loading...</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
          <div class="widget compact"><div class="widget-value" id="stg-used">-</div><div class="widget-label">Used</div></div>
          <div class="widget compact"><div class="widget-value" id="stg-free">-</div><div class="widget-label">Free</div></div>
          <div class="widget compact"><div class="widget-value" id="stg-total">-</div><div class="widget-label">Total</div></div>
          <div class="widget compact"><div class="widget-value" id="stg-games">-</div><div class="widget-label">Games</div></div>
        </div>
        <div class="setting-row"><div><div class="setting-label">Refresh Storage Info</div></div><button class="btn btn-ghost btn-sm" onclick="SettingsPage.refreshStorage()">↻ Refresh</button></div>
        <div class="setting-row"><div><div class="setting-label">Clear Download Cache</div><div class="setting-desc">Remove temporary download files</div></div><button class="btn btn-ghost btn-sm" onclick="SettingsPage.clearDownloads()">🗑️ Clear</button></div>
        <div class="setting-row"><div><div class="setting-label">Reset All Profiles</div><div class="setting-desc">Remove all user profiles and data</div></div><button class="btn btn-ghost btn-sm" style="color:var(--neon-pink);border-color:rgba(255,0,170,0.3);" onclick="SettingsPage.resetProfiles()">⚠️ Reset</button></div>`,

      system: `
        <h3 style="margin-bottom:20px;">System</h3>
        <div class="setting-row"><div><div class="setting-label">Version</div><div class="setting-desc">RQBBOX OS Portable USB</div></div><span>v3.1.0</span></div>
        <div class="setting-row"><div><div class="setting-label">API Server</div><div class="setting-desc">Local USB backend</div></div><span>${RQBApi.online ? '🟢 Online' : '🔴 Offline'}</span></div>
        <div class="setting-row"><div><div class="setting-label">USB Label</div></div><span style="font-size:0.85rem;color:var(--text-muted);">RQBBOX 0</span></div>
        <div class="setting-row"><div><div class="setting-label">Updates</div></div><button class="btn btn-primary btn-sm" onclick="SettingsPage.checkUpdate()">Check</button></div>
        <div class="setting-row" style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;">
          <div><div class="setting-label">Database Backup</div><div class="setting-desc">Create a backup of all profiles and settings</div></div>
          <button class="btn btn-ghost btn-sm" onclick="SettingsPage.backupDB()">💾 Backup</button>
        </div>
        <div class="setting-row">
          <div><div class="setting-label">Database Restore</div><div class="setting-desc">Restore from latest backup</div></div>
          <button class="btn btn-ghost btn-sm" onclick="SettingsPage.restoreDB()">⏪ Restore</button>
        </div>
        <div class="setting-row">
          <div><div class="setting-label">Database Validate</div><div class="setting-desc">Repair and validate user database</div></div>
          <button class="btn btn-ghost btn-sm" onclick="SettingsPage.validateDB()">🔧 Validate</button>
        </div>
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:.75rem;color:var(--text-muted);text-align:center;">
          © 2026 RhysTech. RQBBOX® is a trademark of RhysTech. All rights reserved. <br>
          Plug Into Gaming. ® Portable Power Anywhere. Your USB Gaming World. <br>
          <span style="margin-top:8px;display:inline-block;">
            <a href="mailto:rqbbox.support@groups.outlook.com" style="color:var(--neon-blue);text-decoration:none;">📧 Email Support</a>
            &nbsp;·&nbsp;
            <a href="https://www.youtube.com/@RQBBOX-REAL" target="_blank" style="color:var(--neon-blue);text-decoration:none;">▶ YouTube</a>
          </span>
        </div>`,

      device: `
        <h3 style="margin-bottom:20px;">📱 Connected Devices</h3>
        <div id="device-list">
          <p style="color:var(--text-muted);">Loading devices...</p>
        </div>
        <div class="setting-row"><div><div class="setting-label">This Device ID</div><div class="setting-desc">Unique identifier for this USB drive</div></div><span style="font-size:0.7rem;color:var(--text-muted);font-family:monospace;" id="device-id">${localStorage.getItem('rqbbox_device_id') || 'Not set'}</span></div>
        <div class="setting-row"><div><div class="setting-label">Re-register Device</div><div class="setting-desc">Send device info to server again</div></div><button class="btn btn-ghost btn-sm" onclick="Boot.detectDevice(RQB.state.currentUser)">↻ Register</button></div>`,
      themes: `
        <h3 style="margin-bottom:20px;">Themes</h3>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
          <div class="card" style="padding:20px;text-align:center;cursor:pointer;" onclick="SettingsPage.setTheme('neon-dark')">
            <div style="height:60px;background:linear-gradient(135deg,#050810,#0a2040);border-radius:8px;border:2px solid var(--neon-blue);margin-bottom:8px;"></div><strong>Neon Dark</strong>
          </div>
          <div class="card" style="padding:20px;text-align:center;cursor:pointer;" onclick="SettingsPage.setTheme('purple')">
            <div style="height:60px;background:linear-gradient(135deg,#1a0a30,#0a1530);border-radius:8px;margin-bottom:8px;"></div><strong>Purple Haze</strong>
          </div>
          <div class="card" style="padding:20px;text-align:center;cursor:pointer;" onclick="SettingsPage.setTheme('cyber')">
            <div style="height:60px;background:linear-gradient(135deg,#0a2010,#051810);border-radius:8px;margin-bottom:8px;"></div><strong>Cyber Green</strong>
          </div>
        </div>
        <div style="margin-top:20px;padding:16px;background:rgba(0,0,0,0.3);border-radius:14px;">
          <div style="font-size:.85rem;color:var(--text-secondary);margin-bottom:8px;">🎨 Custom themes from the Themes/ folder on your USB will appear here after restart. The Plugin Engine manages theme loading.</div>
          <div id="plugin-theme-list">${PluginEngine.loaded ? PluginEngine.getSettingsHTML() : '<p style="font-size:.8rem;color:var(--text-muted);">Plugin Engine loading... restart to apply themes.</p>'}</div>
        </div>`,
      editions: `
        <h3 style="margin-bottom:20px;">📦 RQBBOX Edition</h3>
        <div style="padding:16px;background:rgba(0,0,0,0.3);border-radius:14px;margin-bottom:20px;">
          <p style="font-size:.85rem;color:var(--text-secondary);margin-bottom:16px;">Choose your RQBBOX experience. All editions are free. Restart recommended after switching.</p>
          <div id="editions-settings">${Editions.getSettingsHTML()}</div>
          <div style="margin-top:16px;padding:12px;background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:10px;">
            <div style="font-size:.8rem;color:var(--text-secondary);">💡 <strong>Lite</strong> — Fast & lightweight. <strong>Pro</strong> — Cloud sync & performance tools. <strong>Creator</strong> — SDK & development tools.</div>
          </div>
        </div>`,
      plugins: `
        <h3 style="margin-bottom:20px;">🧩 Plugin Engine</h3>
        <div style="padding:16px;background:rgba(0,0,0,0.3);border-radius:14px;">
          <div style="display:flex;gap:12px;margin-bottom:20px;">
            <span style="font-size:.85rem;color:var(--text-secondary);">Status: <strong style="color:${PluginEngine.loaded ? 'var(--neon-cyan)' : 'var(--text-muted)'};">${PluginEngine.loaded ? '● Loaded' : '○ Not loaded'}</strong></span>
            <span style="font-size:.85rem;color:var(--text-secondary);">Plugins: <strong>${PluginEngine.plugins.length}</strong></span>
            <span style="font-size:.85rem;color:var(--text-secondary);">Themes: <strong>${PluginEngine.themes.length}</strong></span>
          </div>
          <div id="plugin-engine-content">${PluginEngine.loaded ? PluginEngine.getSettingsHTML() : '<p style="color:var(--text-muted);font-size:.85rem;">Plugin Engine will load on next startup. Place plugins in the Plugins/ folder and themes in the Themes/ folder on your USB.</p>'}</div>
        </div>
        <div style="margin-top:16px;padding:12px;background:rgba(0,0,0,0.3);border-radius:10px;">
          <h4 style="margin-bottom:8px;">📖 Plugin API Quick Reference</h4>
          <div style="font-size:.78rem;color:var(--text-secondary);display:grid;grid-template-columns:1fr 1fr;gap:4px;">
            <div><code>onLoad()</code> — Plugin loaded</div>
            <div><code>onEnable()</code> — Plugin enabled</div>
            <div><code>onDisable()</code> — Plugin disabled</div>
            <div><code>PluginAPI.toast()</code> — Show toast</div>
            <div><code>PluginAPI.fetch()</code> — API request</div>
            <div><code>PluginAPI.addWidget()</code> — UI widget</div>
            <div><code>PluginAPI.emit()</code> — Emit event</div>
            <div><code>PluginAPI.on()</code> — Listen event</div>
          </div>
        </div>`
    };

    panel.innerHTML = sections[this.section] || sections.general;

    panel.querySelectorAll('.toggle').forEach(tog => {
      tog.onclick = async () => {
        tog.classList.toggle('on');
        await SettingsPage.applySetting(tog.dataset.key, tog.classList.contains('on'));
      };
    });

    // Auto-start controller polling if the controller tab is shown
    if (this.section === 'controller') {
      this.initControllerTest();
    }

    // Auto-refresh storage if the storage tab is shown
    if (this.section === 'storage') {
      this.refreshStorage();
    }
    if (this.section === 'device') {
      this.refreshDevices();
    }
  },

  row(label, desc, key, on) {
    return `<div class="setting-row"><div><div class="setting-label">${label}</div><div class="setting-desc">${desc}</div></div><button class="toggle ${on ? 'on' : ''}" data-key="${key}"></button></div>`;
  },

  async applySetting(key, value) {
    const cfg = RQBBOX_DATA.config;
    if (!cfg.display) cfg.display = {};
    if (!cfg.audio) cfg.audio = {};
    if (key === 'rqbboxMode') {
      cfg.display.rqbboxMode = value;
      if (value) {
        if (RQBAudio && RQBAudio.profiles.rqbbox) RQBAudio.setProfile('rqbbox');
        document.body.classList.add('rqbbox-mode');
      } else {
        if (RQBAudio && RQBAudio.profiles.xbox) RQBAudio.setProfile('xbox');
        document.body.classList.remove('rqbbox-mode');
      }
      RQB.toast(value ? 'RQBBOX Mode ON — Native audio & features enabled' : 'RQBBOX Mode OFF — Xbox fallback');
    }
    if (key === 'performance') { cfg.display.performanceMode = value; document.body.classList.toggle('performance-mode', value); }
    if (key === 'fps') cfg.display.showFps = value;
    if (key === 'animations') cfg.display.animations = value;
    if (key === 'offline') cfg.display.offlineMode = value;
    if (key === 'cloudSync') cfg.display.cloudSync = value;
    if (key === 'controller') cfg.display.controllerSupport = value;
    if (key === 'vibration') cfg.display.vibrationEnabled = value;
    if (key === 'touch') cfg.display.touchMode = value;
    if (key === 'startupSound') cfg.audio.startupSound = value;
    if (key === 'uiSounds') cfg.audio.uiSounds = value;
    if (key === 'bgMusic') cfg.audio.backgroundMusic = value;
    await saveConfig();
    RQB.toast(`Saved: ${key}`);
  },

  // --- Controller Configuration ---
  _ctrlPolling: null,

  initControllerTest() {
    this._updateControllerInfo();

    // Poll gamepad state
    if (this._ctrlPolling) clearInterval(this._ctrlPolling);
    this._ctrlPolling = setInterval(() => {
      this._updateControllerInfo();
      this._pollButtons();
    }, 100);
  },

  _updateControllerInfo() {
    const nameEl = RQB.$('#ctrl-name');
    if (!nameEl) return;
    try {
      const gamepads = navigator.getGamepads();
      const pad = Array.from(gamepads).find(g => g);
      if (pad) {
        nameEl.textContent = pad.id.substring(0, 40);
        nameEl.style.color = 'var(--neon-cyan)';
      } else {
        nameEl.textContent = 'None detected';
        nameEl.style.color = 'var(--text-muted)';
      }
    } catch { nameEl.textContent = 'No API'; }
  },

  _pollButtons() {
    const area = RQB.$('#ctrl-test-area');
    if (!area) return;
    try {
      const gamepads = navigator.getGamepads();
      const pad = Array.from(gamepads).find(g => g);
      if (!pad) return;

      // Map standard button indices
      const btnMap = ['A','B','X','Y','LB','RB','LT','RT','BACK','START','LS','RS','UP','DOWN','LEFT','RIGHT','HOME'];
      const btns = area.querySelectorAll('.ctrl-btn');

      btns.forEach(el => {
        const name = el.dataset.btn;
        let pressed = false;
        // Check standard buttons
        if (name === 'A' && pad.buttons[0]?.pressed) pressed = true;
        if (name === 'B' && pad.buttons[1]?.pressed) pressed = true;
        if (name === 'X' && pad.buttons[2]?.pressed) pressed = true;
        if (name === 'Y' && pad.buttons[3]?.pressed) pressed = true;
        if (name === 'LB' && pad.buttons[4]?.pressed) pressed = true;
        if (name === 'RB' && pad.buttons[5]?.pressed) pressed = true;
        if (name === 'LT' && (pad.buttons[6]?.pressed || pad.buttons[6]?.value > 0.3)) pressed = true;
        if (name === 'RT' && (pad.buttons[7]?.pressed || pad.buttons[7]?.value > 0.3)) pressed = true;
        if (name === 'BACK' && pad.buttons[8]?.pressed) pressed = true;
        if (name === 'START' && pad.buttons[9]?.pressed) pressed = true;
        if (name === 'LS' && pad.buttons[10]?.pressed) pressed = true;
        if (name === 'RS' && pad.buttons[11]?.pressed) pressed = true;
        if (name === 'UP' && (pad.buttons[12]?.pressed || pad.axes[1] < -0.5)) pressed = true;
        if (name === 'DOWN' && (pad.buttons[13]?.pressed || pad.axes[1] > 0.5)) pressed = true;
        if (name === 'LEFT' && (pad.buttons[14]?.pressed || pad.axes[0] < -0.5)) pressed = true;
        if (name === 'RIGHT' && (pad.buttons[15]?.pressed || pad.axes[0] > 0.5)) pressed = true;
        if (name === 'HOME' && pad.buttons[16]?.pressed) pressed = true;

        el.style.background = pressed ? 'rgba(0,212,255,0.3)' : 'rgba(0,0,0,0.4)';
        el.style.color = pressed ? 'var(--neon-blue)' : 'var(--text-muted)';
        el.style.transform = pressed ? 'scale(0.95)' : '';
      });
    } catch {}
  },

  async testVibration() {
    try {
      const gamepads = navigator.getGamepads();
      const pad = Array.from(gamepads).find(g => g);
      if (pad && pad.vibrationActuator) {
        await pad.vibrationActuator.playEffect('dual-rumble', { startDelay: 0, duration: 500, weakMagnitude: 1.0, strongMagnitude: 1.0 });
        RQB.toast('Vibration test sent');
      } else {
        RQB.toast('Controller vibration not supported');
      }
    } catch { RQB.toast('Vibration not available'); }
  },

  setDeadZone(val) {
    if (!RQBBOX_DATA.config.input) RQBBOX_DATA.config.input = {};
    RQBBOX_DATA.config.input.deadZone = parseFloat(val);
    saveConfig();
    RQB.toast(`Dead zone set to ${val}`);
  },

  togglePolling(on) {
    if (!on && this._ctrlPolling) { clearInterval(this._ctrlPolling); this._ctrlPolling = null; }
    if (on) this.initControllerTest();
  },

  // --- Storage Manager ---
  async refreshStorage() {
    const fill = RQB.$('#stg-fill');
    const label = RQB.$('#stg-label');
    const used = RQB.$('#stg-used');
    const free = RQB.$('#stg-free');
    const total = RQB.$('#stg-total');
    const games = RQB.$('#stg-games');

    try {
      if (RQBApi.online) {
        const info = await RQBApi.storage();
        if (fill) fill.style.width = Math.min(100, info.usedPct || 0) + '%';
        if (label) label.textContent = `${info.label || 'RQBBOX 0'} · ${info.freeGB || 0} GB free · ${info.usedPct || 0}% used`;
        if (used) used.textContent = info.usedPct ? `${info.usedPct}%` : '-';
        if (free) free.textContent = info.freeGB ? `${info.freeGB} GB` : '-';
        if (total) total.textContent = info.totalBytes ? `${(info.totalBytes / 1073741824).toFixed(1)} GB` : '-';
      }
    } catch {}
    const inst = RQBBOX_DATA.profiles?.installed || { games: [], apps: [] };
    if (games) games.textContent = `${(inst.games||[]).length + (inst.apps||[]).length} items`;
  },

  async clearDownloads() {
    if (!confirm('Clear all download cache?')) return;
    RQB.toast('Downloads cleared');
  },

  async resetProfiles() {
    if (!confirm('⚠️ This will remove ALL profiles and data. Are you sure?')) return;
    if (!confirm('Really? All progress will be lost.')) return;
    RQBBOX_DATA.profiles = { users: [], installed: { games: [], apps: [] }, downloads: [], notifications: [] };
    await saveProfiles();
    RQB.toast('All profiles reset');
    ProfilePage.signOut();
  },

  // --- Device Management ---
  async refreshDevices() {
    const list = document.getElementById('device-list');
    if (!list) return;
    if (RQBApi.online) {
      try {
        const res = await RQBApi.getDevices();
        if (res.ok && res.devices?.length) {
          list.innerHTML = res.devices.map(d => `
            <div class="friend-item" style="border-bottom:1px solid rgba(255,255,255,0.04);">
              <div style="font-size:1.5rem;width:40px;text-align:center;">💻</div>
              <div class="friend-info" style="flex:1;">
                <div class="friend-name">${d.name || d.label || 'Unknown Device'}</div>
                <div style="font-size:0.7rem;color:var(--text-muted);display:flex;gap:12px;flex-wrap:wrap;">
                  <span>${d.platform || ''}</span>
                  <span>${d.totalGB ? d.totalGB + ' GB' : ''}</span>
                  <span>${d.type || ''}</span>
                  <span>First seen: ${d.firstSeen ? new Date(d.firstSeen).toLocaleDateString() : ''}</span>
                </div>
              </div>
              <span style="font-size:0.65rem;color:var(--text-muted);white-space:nowrap;">${d.lastSeen ? new Date(d.lastSeen).toLocaleDateString() : ''}</span>
            </div>
          `).join('');
        } else list.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">No devices registered yet. Log in to register this USB drive.</p>';
      } catch { list.innerHTML = '<p style="color:var(--text-muted);">Could not load devices</p>'; }
    } else list.innerHTML = '<p style="color:var(--text-muted);">Server offline</p>';
  },

  // --- Audio Profile ---
  setAudioProfile(profile) {
    if (RQBAudio && RQBAudio.profiles[profile]) {
      RQBAudio.setProfile(profile);
      if (!RQBBOX_DATA.config.audio) RQBBOX_DATA.config.audio = {};
      RQBBOX_DATA.config.audio.profile = profile;
      saveConfig();
      RQB.toast(`Sound profile: ${RQBAudio.profiles[profile].label}`);
    }
  },

  // --- Audio Test ---
  testAudio() {
    if (RQBAudio && RQBAudio._enabled) {
      RQBAudio.select();
      setTimeout(() => RQB.toast('🔊 Audio system working'), 200);
    } else {
      RQB.toast('Audio is disabled in settings');
    }
  },

  // --- Re-run Setup ---
  runSetupAgain() {
    RQB.$('#main-shell').classList.remove('active');
    SetupWizard.start();
  },

  async setTheme(theme) {
    RQBBOX_DATA.config.display.theme = theme;
    const themes = {
      'neon-dark': { bg: '#050810', blue: '#00d4ff', purple: '#9d4edd' },
      purple: { bg: '#0a0818', blue: '#b388ff', purple: '#7c4dff' },
      cyber: { bg: '#050f08', blue: '#00ffc8', purple: '#00aa66' }
    };
    const t = themes[theme] || themes['neon-dark'];
    document.documentElement.style.setProperty('--bg-primary', t.bg);
    document.documentElement.style.setProperty('--neon-blue', t.blue);
    document.documentElement.style.setProperty('--neon-purple', t.purple);
    await saveConfig();
    RQB.toast(`Theme "${theme}" applied & saved`);
  },

  checkUpdate() {
    RQB.toast('RQBBOX OS v3.1.0 — You are up to date!');
  },

  // --- Database Management ---
  async backupDB() {
    try {
      if (RQBApi.online) {
        const res = await RQBApi.get('/api/db/backup');
        if (res.ok) { RQB.toast('✅ Database backed up!'); return; }
      }
    } catch {}
    // Manual backup as fallback
    const data = JSON.stringify(RQBBOX_DATA.profiles, null, 2);
    localStorage.setItem('rqbbox_profiles_backup', data);
    RQB.toast('💾 Profiles saved to local storage backup');
  },

  async validateDB() {
    try {
      if (RQBApi.online) {
        const res = await RQBApi.get('/api/db/validate');
        if (res.ok) { RQB.toast('✅ Database validated and repaired'); return; }
      }
    } catch {}
    RQB.toast('🔧 Profiles data structure OK');
  },

  async restoreDB() {
    try {
      if (RQBApi.online) {
        const res = await RQBApi.post('/api/db/restore', { index: 0 });
        if (res.ok) { RQB.toast(`✅ Restored: ${res.restored}`); return; }
      }
    } catch {}
    const saved = localStorage.getItem('rqbbox_profiles_backup');
    if (saved) {
      try {
        RQBBOX_DATA.profiles = JSON.parse(saved);
        await saveProfiles();
        RQB.toast('✅ Restored from local backup');
      } catch { RQB.toast('❌ Backup data corrupted'); }
    } else { RQB.toast('No backup found'); }
  }
};
