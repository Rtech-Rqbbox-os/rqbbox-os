/* RQBBOX OS — Xbox-style Quick Guide Overlay */
const QuickGuide = {
  open: false,

  init() {
    const html = `
    <div id="quick-guide" class="guide-overlay" style="display:none;">
      <div class="guide-backdrop" onclick="QuickGuide.close()"></div>
      <div class="guide-panel">
        <div class="guide-header">
          <div class="guide-user">
            <div class="guide-avatar" id="guide-avatar">P</div>
            <div><div class="guide-name" id="guide-name">Player</div><div class="guide-email" id="guide-email">Not signed in</div></div>
          </div>
          <div class="guide-online"><span class="guide-dot"></span><span id="guide-status">Online</span></div>
        </div>
        <div class="guide-sections">
          <button class="guide-btn" data-action="profile"><span>👤</span> Profile</button>
          <button class="guide-btn" data-action="friends"><span>👥</span> Friends <span class="guide-badge" id="guide-friend-badge" style="display:none;">0</span></button>
          <button class="guide-btn" data-action="notifications"><span>🔔</span> Notifications <span class="guide-badge" id="guide-notif-badge">0</span></button>
          <button class="guide-btn" data-action="achievements"><span>🏆</span> Achievements</button>
          <button class="guide-btn" data-action="screenshots"><span>📷</span> Screenshots</button>
          <button class="guide-btn" data-action="browser"><span>🌐</span> Web Browser</button>
          <button class="guide-btn" data-action="settings"><span>⚙️</span> Settings</button>
          <button class="guide-btn" data-action="devices"><span>💻</span> Devices</button>
          <button class="guide-btn" data-action="storage"><span>💾</span> Storage</button>
        </div>
        <div class="guide-footer">
          <div class="guide-footer-info">
            <span id="guide-storage">USB: -- GB free</span>
            <span id="guide-version">v1.0.0</span>
          </div>
          <button class="guide-btn guide-btn-power" data-action="power"><span>⏻</span> Exit RQBBOX</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    document.querySelectorAll('.guide-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (RQBAudio && RQBAudio.select) RQBAudio.select();
        const action = btn.dataset.action;
        QuickGuide.close();
        switch (action) {
          case 'profile': RQB.navigate('profile'); break;
          case 'friends': RQB.navigate('friends'); break;
          case 'notifications': RQB.$('#notif-panel').classList.toggle('open'); break;
          case 'achievements': RQB.navigate('profile'); break;
          case 'screenshots': RQB.navigate('media'); if (MediaPage.showScreenshots) MediaPage.showScreenshots(); break;
          case 'browser': RQB.navigate('browser'); break;
          case 'settings': RQB.navigate('settings'); break;
          case 'devices': RQB.navigate('settings'); SettingsPage.section = 'device'; SettingsPage.renderPanel(); break;
          case 'storage': RQB.navigate('settings'); SettingsPage.section = 'storage'; SettingsPage.renderPanel(); break;
          case 'power': RQB.exit(); break;
        }
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'F1' || e.key === 'Guide' || (e.key === 'g' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        QuickGuide.toggle();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        if (document.getElementById('shortcuts-overlay')) {
          document.getElementById('shortcuts-overlay').remove();
        } else {
          QuickGuide.showShortcuts();
        }
      }
    });
  },

  showShortcuts() {
    const existing = document.getElementById('shortcuts-overlay');
    if (existing) { existing.remove(); return; }

    const html = `
    <div id="shortcuts-overlay" class="guide-overlay" style="display:flex;z-index:31000;">
      <div class="guide-backdrop" onclick="document.getElementById('shortcuts-overlay')?.remove()"></div>
      <div class="guide-panel" style="width:560px;">
        <div class="guide-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem;">⌨️</span>
            <div><div class="guide-name">Keyboard Shortcuts</div><div class="guide-email">Press F2 to close</div></div>
          </div>
        </div>
        <div class="guide-sections" style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
          <div class="shortcut-group">
            <div class="shortcut-group-title">Navigation</div>
            <div class="shortcut-row"><kbd>F1</kbd><span>Open Quick Guide</span></div>
            <div class="shortcut-row"><kbd>F2</kbd><span>Keyboard Shortcuts</span></div>
            <div class="shortcut-row"><kbd>Esc</kbd><span>Close overlay / Go back</span></div>
            <div class="shortcut-row"><kbd>Ctrl+G</kbd><span>Quick Guide</span></div>
          </div>
          <div class="shortcut-group">
            <div class="shortcut-group-title">Browser</div>
            <div class="shortcut-row"><kbd>Ctrl+L</kbd><span>Focus address bar</span></div>
            <div class="shortcut-row"><kbd>Enter</kbd><span>Go to URL / Search</span></div>
            <div class="shortcut-row"><kbd>F5</kbd><span>Refresh page</span></div>
            <div class="shortcut-row"><kbd>Alt+←/→</kbd><span>Back / Forward</span></div>
          </div>
          <div class="shortcut-group">
            <div class="shortcut-group-title">General</div>
            <div class="shortcut-row"><kbd>Ctrl+F</kbd><span>Smart search</span></div>
            <div class="shortcut-row"><kbd>Ctrl+Shift+Q</kbd><span>Exit RQBBOX</span></div>
            <div class="shortcut-row"><kbd>Alt+N</kbd><span>Toggle notifications</span></div>
          </div>
          <div class="shortcut-group">
            <div class="shortcut-group-title">Pages</div>
            <div class="shortcut-row"><kbd>Ctrl+1-9</kbd><span>Navigate pages</span></div>
            <div class="shortcut-row"><kbd>Ctrl+Home</kbd><span>Go to Home</span></div>
            <div class="shortcut-row"><kbd>Ctrl+P</kbd><span>Open Profile</span></div>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  toggle() {
    this.open ? this.close() : this.openGuide();
  },

  openGuide() {
    this.open = true;
    const el = document.getElementById('quick-guide');
    if (!el) return;
    el.style.display = 'flex';
    this.update();
    if (RQBAudio && RQBAudio.select) RQBAudio.select();
  },

  close() {
    this.open = false;
    const el = document.getElementById('quick-guide');
    if (el) el.style.display = 'none';
  },

  update() {
    const user = RQB.state.currentUser;
    const avatar = document.getElementById('guide-avatar');
    const name = document.getElementById('guide-name');
    const email = document.getElementById('guide-email');
    const status = document.getElementById('guide-status');
    if (user) {
      if (avatar) avatar.textContent = user.avatar || user.name?.[0] || 'P';
      if (name) name.textContent = user.name || 'Player';
      if (email) email.textContent = user.email || `${user.username || ''}@rhystech`;
      if (status) status.textContent = RQBApi.online ? 'Online' : 'Offline';
    }

    const notifs = RQBBOX_DATA.profiles?.notifications || [];
    const notifBadge = document.getElementById('guide-notif-badge');
    const unread = notifs.filter(n => !n.read).length;
    if (notifBadge) { notifBadge.textContent = unread; notifBadge.style.display = unread ? 'inline' : 'none'; }

    const friendBadge = document.getElementById('guide-friend-badge');
    const requests = RQB.state.currentUser?.friendRequests?.length || 0;
    if (friendBadge) { friendBadge.textContent = requests; friendBadge.style.display = requests ? 'inline' : 'none'; }

    const storage = document.getElementById('guide-storage');
    if (storage) {
      const fill = document.getElementById('storage-fill');
      const pct = fill ? parseInt(fill.style.width) || 0 : 0;
      storage.textContent = `USB: ${100 - pct}% free`;
    }
  }
};
