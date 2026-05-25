/* RQBBOX OS - Boot Sequence */
const Boot = {
  steps: [
    { pct: 10, msg: 'Starting RQBBOX system...' },
    { pct: 25, msg: 'Detecting USB drive RQBBOX 0...' },
    { pct: 40, msg: 'Loading RhysTech system modules...' },
    { pct: 55, msg: 'Mounting portable storage...' },
    { pct: 70, msg: 'Loading store catalog & profiles...' },
    { pct: 85, msg: 'Initializing controller support...' },
    { pct: 100, msg: 'RQBBOX OS ready.' }
  ],

  async run() {
    const bar = RQB.$('#boot-bar');
    const status = RQB.$('#boot-status');
    const bootScreen = RQB.$('#boot-screen');

    for (const step of this.steps) {
      if (bar) bar.style.width = step.pct + '%';
      if (status) status.textContent = step.msg;
      if (step.pct === 70) await loadExternalData();
      await this.delay(step.pct === 100 ? 500 : 350);
    }

    RQB.playStartupSound();
    bootScreen.classList.add('hidden');

    const remembered = localStorage.getItem('rqbbox_user');
    if (remembered) {
      try {
        RQB.state.currentUser = JSON.parse(remembered);
        const pu = RQBBOX_DATA.profiles?.users?.find(u => u.id === RQB.state.currentUser.id);
        if (pu) {
          RQB.state.currentUser = pu;
          // Restore session from server if online (validates token still works)
          if (RQBApi.online && pu.token) {
            const me = await RQBApi.me(pu.token);
            if (me.ok) RQB.state.currentUser = me.user;
          }
          Stats.onLogin();
          this.launchShell();
          localStorage.setItem('rqbbox_user', JSON.stringify(RQB.state.currentUser));
          return;
        }
        localStorage.removeItem('rqbbox_user');
      } catch { /* welcome */ }
    }
    // First boot? Launch setup wizard
    if (!this.checkFirstBoot()) {
      RQB.showScreen('welcome-screen');
    }
  },

  delay(ms) { return new Promise(r => setTimeout(r, ms)); },

  launchShell() {
    RQB.hideAllAuth();
    RQB.$('#main-shell').classList.add('active');
    RQB.$('#bg-layer').style.backgroundImage = "url('assets/wallpapers/default-banner.svg')";

    const user = RQB.state.currentUser;
    if (user) {
      RQB.$('#user-avatar').textContent = user.avatar || user.name[0];
      RQB.$('#user-name').textContent = user.name;
    }

    RQB.updateStorage();
    RQB.renderNotifications();
    RQB.navigate('home');
    RQB.toast(RQBApi.online ? 'RQBBOX OS ready — all systems online' : 'Running in offline mode');
  },

  setupAuth() {
    RQB.$('#btn-get-started').onclick = () => { if (RQBAudio && RQBAudio.select) RQBAudio.select(); Boot.showProfiles(); };
    RQB.$('#link-signin').onclick = () => { if (RQBAudio && RQBAudio.select) RQBAudio.select(); RQB.showScreen('signin-screen'); };
    RQB.$('#link-signup').onclick = () => { if (RQBAudio && RQBAudio.select) RQBAudio.select(); RQB.showScreen('signup-screen'); };
    RQB.$('#link-back-welcome').onclick = () => { if (RQBAudio && RQBAudio.back) RQBAudio.back(); RQB.showScreen('welcome-screen'); };
    RQB.$('#link-to-signup').onclick = () => { if (RQBAudio && RQBAudio.select) RQBAudio.select(); RQB.showScreen('signup-screen'); };
    RQB.$('#link-back-signin').onclick = () => { if (RQBAudio && RQBAudio.back) RQBAudio.back(); RQB.showScreen('signin-screen'); };

    RQB.$('#signin-form').onsubmit = async (e) => {
      e.preventDefault();
      const username = RQB.$('#signin-user').value;
      const password = RQB.$('#signin-pass').value;
      if (RQBApi.online) {
        const res = await RQBApi.auth(username, password);
        if (res.ok) {
          if (res.token) {
            res.user.token = res.token;
            localStorage.setItem('rqbbox_token', res.token);
          }
          Boot.loginUser(res.user);
          return;
        }
        RQB.toast(res.error || 'Sign in failed');
        return;
      }
      const localUser = RQBBOX_DATA.profiles?.users?.find(u => u.name === username || u.username === username);
      if (localUser) {
        if (localUser.pin && localUser.pin !== password) { RQB.toast('Wrong password'); return; }
        Boot.loginUser(localUser);
        return;
      }
      Boot.loginUser({ id: 'local', name: username, avatar: username[0]?.toUpperCase() || 'P', role: 'Member' });
    };

    RQB.$('#signup-form').onsubmit = async (e) => {
      e.preventDefault();
      const name = RQB.$('#signup-name').value;
      const username = RQB.$('#signup-user').value;
      const password = RQB.$('#signup-pass').value;
      if (RQBApi.online) {
        const res = await RQBApi.register(name, username, password);
        if (res.ok) {
          if (res.token) {
            const user = res.user;
            user.token = res.token;
            localStorage.setItem('rqbbox_token', res.token);
          }
          Boot.loginUser(res.user);
          return;
        }
        RQB.toast(res.error || 'Registration failed');
        return;
      }
      const localUser = { id: 'user-' + Date.now(), name, username: username || name.toLowerCase().replace(/\s+/g,''), avatar: name[0].toUpperCase(), role: 'Member', pin: password || null, theme: 'neon-dark', recentApps: [], achievements: 0, playTime: '0m', stats: { sessions: 0, minutesActive: 0, gamesLaunched: 0, appsLaunched: 0, achievements: 0, storeInstalls: 0, screenshots: 0, aiImages: 0, _achNames: [] } };
      if (!RQBBOX_DATA.profiles) RQBBOX_DATA.profiles = { users: [], installed: { games: [], apps: [] }, downloads: [], notifications: [] };
      if (!RQBBOX_DATA.profiles.users) RQBBOX_DATA.profiles.users = [];
      RQBBOX_DATA.profiles.users.push(localUser);
      await saveProfiles();
      Boot.loginUser(localUser);
    };

    RQB.$('#btn-continue-profile').onclick = () => {
      if (RQBAudio && RQBAudio.signin) RQBAudio.signin();
      if (RQB.state.selectedProfile) Boot.loginUser(RQB.state.selectedProfile);
    };
    document.querySelectorAll('#profile-grid .profile-card').forEach(c => {
      c.addEventListener('mouseenter', () => { if (RQBAudio && RQBAudio.hover) RQBAudio.hover(); });
    });

    RQB.$('#link-run-setup').onclick = () => {
      RQB.showScreen('setup-screen');
      SetupWizard.start();
    };
  },

  // Setup wizard trigger
  checkFirstBoot() {
    const users = RQBBOX_DATA.profiles?.users || [];
    const setupDone = localStorage.getItem('rqbbox_setup_done');
    if (!setupDone || users.length === 0) {
      setTimeout(() => {
        RQB.hideAllAuth();
        SetupWizard.start();
      }, 1000);
      return true;
    }
    return false;
  },

  showProfiles() {
    const grid = RQB.$('#profile-grid');
    grid.innerHTML = '';
    (RQBBOX_DATA.profiles?.users || []).forEach(u => {
      const card = document.createElement('div');
      card.className = 'profile-card';
      card.innerHTML = `<div class="profile-avatar">${u.avatar}</div><div class="name">${u.name}</div><div class="role">${u.role}</div>`;
      card.innerHTML = card.innerHTML.replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));
      card.onclick = () => {
        if (u.pin) {
          const pin = prompt(`Enter password for ${u.name}:`);
          if (pin !== u.pin) { RQB.toast('Wrong password'); return; }
        }
        RQB.$$('.profile-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        RQB.state.selectedProfile = u;
        RQB.$('#btn-continue-profile').disabled = false;
      };
      grid.appendChild(card);
    });
    RQB.showScreen('profile-screen');
  },

  loginUser(user) {
    if (RQBAudio && RQBAudio.signin) RQBAudio.signin();
    RQB.state.currentUser = user;
    if (user.stats) Stats.ensure(user);
    localStorage.setItem('rqbbox_user', JSON.stringify(user));
    Stats.onLogin();
    Boot.launchShell();
    Boot.detectDevice(user);
  },

  async detectDevice(user) {
    if (!RQBApi.online) return;
    let deviceId = localStorage.getItem('rqbbox_device_id');
    if (!deviceId) {
      deviceId = 'dev-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
      localStorage.setItem('rqbbox_device_id', deviceId);
    }
    // Get USB/drive info
    let totalGB = 0, freeGB = 0, label = 'RQBBOX 0', platform = navigator.platform || 'Unknown';
    try {
      const info = await RQBApi.storage();
      if (info) { totalGB = info.totalBytes ? (info.totalBytes / 1073741824).toFixed(1) : 0; freeGB = info.freeGB || 0; label = info.label || 'RQBBOX 0'; }
    } catch {}
    const deviceData = {
      id: deviceId,
      userId: user.id,
      name: `${label} (${user.name})`,
      type: 'USB Drive',
      label,
      totalGB: parseFloat(totalGB),
      freeGB: parseFloat(freeGB),
      platform,
      userAgent: navigator.userAgent?.substring(0, 100) || '',
      screen: `${window.innerWidth}x${window.innerHeight}`,
      token: localStorage.getItem('rqbbox_device_id'),
    };
    await RQBApi.saveDevice(deviceData);
    if (!localStorage.getItem('rqbbox_device_registered')) {
      localStorage.setItem('rqbbox_device_registered', '1');
      RQB.toast(`📱 Device registered: ${label}`);
    }
  }
};

RQB.renderNotifications = function() {
  const list = RQB.$('#notif-list');
  const badge = RQB.$('#notif-badge');
  const notifs = RQBBOX_DATA.profiles?.notifications || [];
  const unread = notifs.filter(n => !n.read).length;
  if (badge) badge.style.display = unread ? 'block' : 'none';
  if (!list) return;
  list.innerHTML = '';
  notifs.forEach(n => {
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.innerHTML = `<strong>${n.title}</strong><p style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px;">${n.message}</p><div class="time">${n.time}</div>`;
    item.onclick = () => { n.read = true; item.style.opacity = '0.6'; RQB.renderNotifications(); saveProfiles(); };
    list.appendChild(item);
  });
};
