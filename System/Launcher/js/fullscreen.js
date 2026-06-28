/* RQBBOX OS — Fullscreen Mode (like Xbox Fullscreen Mode) */
const RQBoxFullscreen = {
  active: false,
  _origStyles: {},
  _gamepadPoll: null,

  init() {
    this.injectHTML();
    this.injectCSS();
    this.bindKeys();
    this.bindController();
    RQB.$('#btn-fullscreen')?.addEventListener('click', () => this.toggle());
    window.addEventListener('gamepadconnected', () => { if (this.active) this.startControllerPoll(); });
    window.addEventListener('gamepaddisconnected', () => { if (!navigator.getGamepads().some(g => g)) this.stopControllerPoll(); });
  },

  injectHTML() {
    const html = `
    <div id="rqbbox-fullscreen" class="fs-overlay" style="display:none;">
      <div class="fs-header">
        <div class="fs-logo">RQBBOX</div>
        <div class="fs-header-right">
          <span class="fs-badge fs-badge-performance" id="fs-perf-badge">⚡ Performance</span>
          <span class="fs-clock" id="fs-clock">--:--</span>
          <button class="fs-icon-btn" id="fs-btn-exit" title="Exit Fullscreen (Win+F11)">✕</button>
        </div>
      </div>
      <div class="fs-content">
        <div class="fs-hero">
          <div class="fs-hero-text">
            <h2>Fullscreen Mode</h2>
            <p>Console-style gaming. Controller optimized. Maximum performance.</p>
          </div>
          <div class="fs-hero-stats">
            <div class="fs-stat"><span class="fs-stat-value" id="fs-stat-games">0</span><span class="fs-stat-label">Games</span></div>
            <div class="fs-stat"><span class="fs-stat-value" id="fs-stat-recent">0</span><span class="fs-stat-label">Recent</span></div>
            <div class="fs-stat"><span class="fs-stat-value" id="fs-stat-performance">ON</span><span class="fs-stat-label">Perf Mode</span></div>
          </div>
        </div>
        <div class="fs-section">
          <div class="fs-section-header">
            <h3>Recently Played</h3>
            <button class="fs-link" onclick="RQB.navigate('games')">See all →</button>
          </div>
          <div class="fs-horz-scroll" id="fs-recent-games"></div>
        </div>
        <div class="fs-section">
          <div class="fs-section-header">
            <h3>Quick Launch</h3>
            <button class="fs-link" onclick="RQB.navigate('apps')">All apps →</button>
          </div>
          <div class="fs-horz-scroll" id="fs-quick-launch"></div>
        </div>
      </div>
      <div class="fs-footer">
        <span class="fs-footer-hint">🎮 Controller: D-pad navigate · A select · B back</span>
        <span class="fs-footer-hint">⌨️ Win+F11 exit · Ctrl+Shift+F toggle</span>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    RQB.$('#fs-btn-exit')?.addEventListener('click', () => this.exit());
  },

  injectCSS() {
    const css = `
    .fs-overlay {
      position: fixed; inset: 0; z-index: 5000;
      display: none; flex-direction: column;
      background: linear-gradient(135deg, #0a0e1a 0%, #0d1525 50%, #0a0e1a 100%);
      color: #fff; font-family: 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
    }
    .fs-overlay.active { display: flex; }
    .fs-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 32px; flex-shrink: 0;
      background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .fs-logo { font-size: 1.2rem; font-weight: 700; letter-spacing: 4px; color: rgba(255,255,255,0.8); }
    .fs-header-right { display: flex; align-items: center; gap: 16px; }
    .fs-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 0.7rem;
      font-weight: 600; letter-spacing: 0.5px;
    }
    .fs-badge-performance { background: rgba(0,255,200,0.12); color: #00ffc8; border: 1px solid rgba(0,255,200,0.2); }
    .fs-clock { font-size: 0.8rem; color: rgba(255,255,255,0.4); font-variant-numeric: tabular-nums; }
    .fs-icon-btn {
      width: 32px; height: 32px; border: none; background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.6); border-radius: 50%; cursor: pointer;
      font-size: 0.85rem; transition: all 0.15s;
    }
    .fs-icon-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .fs-content { flex: 1; overflow-y: auto; padding: 0; }
    .fs-hero {
      padding: 48px 40px 32px;
      background: linear-gradient(180deg, rgba(0,170,255,0.04) 0%, transparent 100%);
    }
    .fs-hero-text h2 { font-size: 2rem; font-weight: 300; letter-spacing: -0.5px; margin-bottom: 4px; }
    .fs-hero-text p { font-size: 0.85rem; color: rgba(255,255,255,0.4); }
    .fs-hero-stats { display: flex; gap: 32px; margin-top: 24px; }
    .fs-stat { text-align: center; }
    .fs-stat-value { font-size: 1.5rem; font-weight: 200; display: block; }
    .fs-stat-label { font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
    .fs-section { padding: 8px 40px 24px; }
    .fs-section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px;
    }
    .fs-section-header h3 { font-size: 1rem; font-weight: 500; }
    .fs-link { background: none; border: none; color: rgba(255,255,255,0.3); font-size: 0.75rem; cursor: pointer; font-family: inherit; }
    .fs-link:hover { color: #fff; }
    .fs-horz-scroll {
      display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;
      scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
    }
    .fs-horz-scroll::-webkit-scrollbar { height: 0; }
    .fs-card {
      flex-shrink: 0; width: 180px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; overflow: hidden; cursor: pointer;
      transition: transform 0.2s, background 0.2s; scroll-snap-align: start;
    }
    .fs-card:hover, .fs-card.fs-focused { transform: translateY(-4px); background: rgba(255,255,255,0.06); border-color: rgba(0,170,255,0.3); }
    .fs-card:active { transform: scale(0.97); }
    .fs-card-art {
      height: 100px; display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; background: rgba(255,255,255,0.02);
    }
    .fs-card-info { padding: 10px 12px; }
    .fs-card-title { font-size: 0.82rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .fs-card-sub { font-size: 0.65rem; color: rgba(255,255,255,0.3); margin-top: 2px; }
    .fs-footer {
      display: flex; justify-content: space-between;
      padding: 12px 32px; flex-shrink: 0;
      background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.04);
    }
    .fs-footer-hint { font-size: 0.65rem; color: rgba(255,255,255,0.2); }
    .fs-card.fs-focused { outline: 2px solid rgba(0,170,255,0.5); outline-offset: -2px; }

    @media (max-width: 768px) {
      .fs-hero { padding: 32px 24px 24px; }
      .fs-section { padding: 8px 24px 20px; }
      .fs-header { padding: 12px 20px; }
      .fs-footer { flex-direction: column; gap: 4px; align-items: center; }
    }
    @media (prefers-color-scheme: light) {
      .fs-overlay { background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 50%, #f0f4ff 100%); color: #000; }
      .fs-header { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.06); }
      .fs-logo { color: rgba(0,0,0,0.6); }
      .fs-hero { background: linear-gradient(180deg, rgba(0,100,200,0.04) 0%, transparent 100%); }
      .fs-card { background: rgba(0,0,0,0.02); border-color: rgba(0,0,0,0.06); }
      .fs-card:hover, .fs-card.fs-focused { background: rgba(0,0,0,0.04); border-color: rgba(0,100,200,0.2); }
    }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    style.id = 'rqbbox-fullscreen-css';
    document.head.appendChild(style);
  },

  /* Only toggle if RQBBOX Mode is enabled */
  toggle() {
    const cfg = RQBBOX_DATA.config;
    if (!this.active && cfg.display?.rqbboxMode === false) {
      RQB.toast('Enable RQBBOX Mode in Settings to use Fullscreen Mode');
      return;
    }
    this.active ? this.exit() : this.enter();
  },

  enter() {
    this.active = true;
    const el = RQB.$('#rqbbox-fullscreen');
    if (!el) return;
    el.style.display = 'flex';
    document.body.classList.add('fs-mode');
    this._saveOrigState();
    this._hideLauncherUI();
    this.populateCards();
    this.startClock();
    this.startControllerPoll();
    this._applyPerformanceMode();
    if (RQBAudio && RQBAudio.select) RQBAudio.select();
    RQB.toast('🎮 RQBBOX Fullscreen Mode — controller optimized');
  },

  exit() {
    this.active = false;
    const el = RQB.$('#rqbbox-fullscreen');
    if (el) el.style.display = 'none';
    document.body.classList.remove('fs-mode');
    this._restoreLauncherUI();
    this.stopControllerPoll();
    this.stopClock();
    this._removePerformanceMode();
    if (RQBAudio && RQBAudio.back) RQBAudio.back();
  },

  _saveOrigState() {
    const shell = RQB.$('#main-shell');
    if (shell) this._origStyles.shell = shell.style.display;
  },

  _hideLauncherUI() {
    const shell = RQB.$('#main-shell');
    if (shell) shell.style.display = 'none';
    const notif = RQB.$('#notif-panel');
    if (notif) notif.classList.remove('open');
  },

  _restoreLauncherUI() {
    const shell = RQB.$('#main-shell');
    if (shell) shell.style.display = this._origStyles.shell || 'flex';
  },

  _applyPerformanceMode() {
    RQBBOX_DATA.config.display.performanceMode = true;
    document.body.classList.add('performance-mode');
  },

  _removePerformanceMode() {
    const wasOn = RQBBOX_DATA.config?.display?.performanceMode === true;
    if (!wasOn) {
      document.body.classList.remove('performance-mode');
    }
  },

  populateCards() {
    const store = RQBBOX_DATA.store;
    const recent = RQB.$('#fs-recent-games');
    const quick = RQB.$('#fs-quick-launch');
    if (!recent && !quick) return;

    const games = (store?.games || []).slice(0, 8);
    const apps = (store?.apps || []).slice(0, 6);

    if (recent) {
      recent.innerHTML = games.map(g => `
        <div class="fs-card" data-id="${g.id}" data-type="game" onclick="RQBoxFullscreen.launch('${g.id}','game')">
          <div class="fs-card-art">${g.banner || '🎮'}</div>
          <div class="fs-card-info">
            <div class="fs-card-title">${g.title}</div>
            <div class="fs-card-sub">${g.category || 'Game'}</div>
          </div>
        </div>
      `).join('');
    }

    if (quick) {
      quick.innerHTML = apps.map(a => `
        <div class="fs-card" data-id="${a.id}" data-type="app" onclick="RQBoxFullscreen.launch('${a.id}','app')">
          <div class="fs-card-art">${a.banner || '📱'}</div>
          <div class="fs-card-info">
            <div class="fs-card-title">${a.title}</div>
            <div class="fs-card-sub">${a.category || 'App'}</div>
          </div>
        </div>
      `).join('');
    }

    const totalGames = store?.games?.length || 0;
    const recentCount = Math.min(games.length, 8);
    RQB.$('#fs-stat-games').textContent = totalGames;
    RQB.$('#fs-stat-recent').textContent = recentCount;
  },

  launch(id, type) {
    if (RQBAudio && RQBAudio.confirm) RQBAudio.confirm();
    RQB.toast(`Launching ${type}: ${id}...`);
    if (type === 'game') {
      const game = RQBBOX_DATA.store?.games?.find(g => g.id === id);
      if (game?.launch) { game.launch(); return; }
    }
    Runtime.open(id, type);
  },

  bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F11' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'F11' && e.shiftKey && e.ctrlKey) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.active) {
        this.exit();
      }
    });
  },

  bindController() {
    window.addEventListener('gamepadconnected', () => {
      if (this.active) this.startControllerPoll();
    });
  },

  startControllerPoll() {
    if (this._gamepadPoll) return;
    this._gamepadPoll = setInterval(() => this._pollGamepad(), 100);
  },

  stopControllerPoll() {
    if (this._gamepadPoll) {
      clearInterval(this._gamepadPoll);
      this._gamepadPoll = null;
    }
  },

  _pollGamepad() {
    try {
      const pads = navigator.getGamepads();
      const pad = Array.from(pads).find(g => g);
      if (!pad) return;

      if (pad.buttons[12]?.pressed) { this._navFocus('up'); }
      if (pad.buttons[13]?.pressed) { this._navFocus('down'); }
      if (pad.buttons[14]?.pressed) { this._navFocus('left'); }
      if (pad.buttons[15]?.pressed) { this._navFocus('right'); }
      if (pad.buttons[0]?.pressed) { this._activateFocused(); }
      if (pad.buttons[1]?.pressed) { this.exit(); }
    } catch {}
  },

  _focusedIndex: 0,

  _navFocus(dir) {
    const cards = RQB.$('#rqbbox-fullscreen')?.querySelectorAll('.fs-card');
    if (!cards || !cards.length) return;
    this._focusedIndex = Math.max(0, Math.min(cards.length - 1, 
      dir === 'right' ? this._focusedIndex + 1 :
      dir === 'left' ? this._focusedIndex - 1 :
      dir === 'down' ? this._focusedIndex + 3 :
      dir === 'up' ? this._focusedIndex - 3 : this._focusedIndex
    ));
    cards.forEach((c, i) => c.classList.toggle('fs-focused', i === this._focusedIndex));
    cards[this._focusedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  },

  _activateFocused() {
    const card = RQB.$('#rqbbox-fullscreen')?.querySelector('.fs-card.fs-focused');
    if (card) { card.click(); }
  },

  startClock() {
    const update = () => {
      const el = RQB.$('#fs-clock');
      if (el) el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    update();
    this._clockInterval = setInterval(update, 30000);
  },

  stopClock() {
    if (this._clockInterval) {
      clearInterval(this._clockInterval);
      this._clockInterval = null;
    }
  }
};
