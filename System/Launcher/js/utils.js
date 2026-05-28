/* RQBBOX OS - Utilities */
const RQB = {
  state: {
    currentUser: null,
    currentPage: 'home',
    selectedProfile: null,
    recording: false,
    downloads: [],
    clipboard: null,
    controllerConnected: false
  },

  $(sel) { return document.querySelector(sel); },
  $$(sel) { return document.querySelectorAll(sel); },

  toast(msg, duration = 3000) {
    const container = this.$('#toast-container');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), duration);
  },

  /* Xbox-style sound routing */
  playSound(id) {
    const cfg = RQBBOX_DATA.config?.audio;
    if (cfg && !cfg.uiSounds) return;
    // Route to synthesized sounds
    const soundMap = {
      'startup-sound': 'boot',
      'ui-click': 'nav',
      'ui-select': 'select',
      'ui-back': 'back',
      'ui-hover': 'hover',
      'ui-tick': 'tick',
    };
    const sound = soundMap[id];
    if (sound && RQBAudio[sound]) RQBAudio[sound]();
  },

  playStartupSound() {
    const cfg = RQBBOX_DATA.config?.audio;
    if (cfg && !cfg.startupSound) return;
    if (RQBAudio && RQBAudio.boot) RQBAudio.boot();
  },

  showScreen(id) {
    this.$$('.auth-screen').forEach(s => s.classList.remove('active'));
    const screen = this.$(`#${id}`);
    if (screen) screen.classList.add('active');
  },

  hideAllAuth() {
    this.$$('.auth-screen').forEach(s => s.classList.remove('active'));
  },

  navigate(page) {
    this.state.currentPage = page;
    const prev = this.$('.page.active');
    const next = this.$(`#page-${page}`);
    if (prev && prev !== next && prev.style) {
      prev.style.animation = 'none';
      prev.offsetHeight;
      prev.classList.remove('active');
    }
    if (next) {
      next.classList.add('active');
      next.style.animation = 'fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1)';
    }
    this.$$('.nav-item[data-page]').forEach(n => {
      n.classList.toggle('active', n.dataset.page === page);
    });
    const titles = {
      home: 'Home', games: 'Games', apps: 'Apps', store: 'RhysTech Store',
      files: 'Files', ai: 'AI Studio', settings: 'Settings', profile: 'Profile',
      friends: 'Friends', downloads: 'Downloads', media: 'Media Hub', browser: 'Web Browser'
    };
    this.$('#page-title').textContent = titles[page] || page;
    this.playSound('ui-click'); // nav sound

    const renderers = {
      home: () => HomePage.render(),
      games: () => GamesPage.render(),
      apps: () => AppsPage.render(),
      store: () => StorePage.render(),
      files: () => FilesPage.render(),
      ai: () => AIPage.render(),
      settings: () => SettingsPage.render(),
      profile: () => ProfilePage.render(),
      friends: () => FriendsPage.render(),
      downloads: () => DownloadsPage.render(),
      media: () => MediaPage.render(),
      browser: () => BrowserPage.render()
    };
    renderers[page]?.();
  },

  buildCard(item, type = 'game') {
    const key = type === 'game' ? 'games' : 'apps';
    const installed = item.installed || RQBBOX_DATA.profiles?.installed?.[key]?.includes(item.id);
    const card = document.createElement('div');
    card.className = 'card-ps5';
    card.dataset.id = item.id;
    card.dataset.type = type;
    card.style.position = 'relative';

    card.innerHTML = `
      <div class="card-art">${item.banner || (type === 'game' ? '🎮' : '📱')}</div>
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-sub">${item.category || item.size || ''}</div>
        <div class="card-rating">★ ${item.rating || ''}</div>
        ${installed ? '<div class="installed-badge">● Installed</div>' : ''}
      </div>`;

    const qrBtn = document.createElement('button');
    qrBtn.className = 'card-qr-btn';
    qrBtn.textContent = '📱';
    qrBtn.title = 'Share QR Code';
    qrBtn.onclick = e => { e.stopPropagation(); QR.showShareOption(type, item.id, item.title); };
    card.appendChild(qrBtn);
    return card;
  },

  smartSearch(query) {
    if (!query) return;
    const q = query.toLowerCase();
    const store = RQBBOX_DATA.store;
    const gameHits = (store?.games || []).filter(g => g.title.toLowerCase().includes(q));
    const appHits = (store?.apps || []).filter(a => a.title.toLowerCase().includes(q));
    const total = gameHits.length + appHits.length;
    if (total) {
      this.navigate(gameHits.length >= appHits.length ? 'games' : 'apps');
      this.toast(`Found ${total} result(s) for "${query}"`);
    } else {
      this.toast(`No results for "${query}" — try RhysTech Store`);
    }
  },

  initController() {
    window.addEventListener('gamepadconnected', (e) => {
      RQB.state.controllerConnected = true;
      RQB.toast(`Controller connected: ${e.gamepad.id.substring(0, 30)}`);
    });
    window.addEventListener('gamepaddisconnected', () => {
      RQB.state.controllerConnected = false;
      RQB.toast('Controller disconnected');
    });
  },

  initTouch() {
    document.body.addEventListener('touchstart', () => {}, { passive: true });
  },

  initFpsMonitor() {
    const el = this.$('#fps-monitor');
    let last = performance.now(), frames = 0;
    const tick = (now) => {
      frames++;
      if (now - last >= 1000) {
        if (RQBBOX_DATA.config?.display?.showFps) {
          el.classList.add('visible');
          el.textContent = `FPS: ${frames}`;
        } else {
          el.classList.remove('visible');
        }
        frames = 0;
        last = now;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },

  exit() {
    if (RQBAudio && RQBAudio.poweroff) RQBAudio.poweroff();
    setTimeout(() => {
      if (confirm('Exit RQBBOX OS and return to Windows?')) {
        window.close();
        if (window.chrome?.webview) window.chrome.webview.postMessage('exit');
      }
    }, 400);
  }
};
