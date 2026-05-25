/* RQBBOX OS - API Client (talks to local USB server) */
const RQBApi = {
  base: 'http://127.0.0.1:19777',
  online: false,

  async init() {
    try {
      const r = await fetch(`${this.base}/api/storage`, { signal: AbortSignal.timeout(2000) });
      this.online = r.ok;
    } catch {
      this.online = false;
    }
    return this.online;
  },

  async get(path) {
    const r = await fetch(`${this.base}${path}`);
    if (!r.ok) throw new Error(`API ${path} failed`);
    const ct = r.headers.get('content-type') || '';
    if (ct.includes('application/json')) return r.json();
    return r;
  },

  async post(path, data) {
    const r = await fetch(`${this.base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },

  storage() { return this.get('/api/storage'); },
  config() { return this.get('/api/config'); },
  saveConfig(data) { return this.post('/api/config', { data }); },
  profiles() { return this.get('/api/profiles'); },
  saveProfiles(data) { return this.post('/api/profiles', { data }); },
  store() { return this.get('/api/store'); },
  files(path = '') { return this.get(`/api/files?path=${encodeURIComponent(path)}`); },
  readFile(path) { return this.get(`/api/file/read?path=${encodeURIComponent(path)}`); },
  writeFile(path, content) { return this.post('/api/file/write', { path, content }); },
  writeFileBase64(path, base64) { return this.post('/api/file/write', { path, base64 }); },
  deleteFile(path) { return this.post('/api/file/delete', { path }); },
  copyFile(from, to) { return this.post('/api/file/copy', { from, to }); },
  moveFile(from, to) { return this.post('/api/file/move', { from, to }); },
  install(id, type, title) { return this.post('/api/install', { id, type, title }); },
  auth(username, password) { return this.post('/api/auth', { username, password: password || '' }); },
  register(name, username, password) { return this.post('/api/register', { name, username: username || name.toLowerCase().replace(/\s+/g,''), password: password || '' }); },
  me(token) { return this.get(`/api/me?token=${encodeURIComponent(token)}`); },
  updateAccount(token, data) { return this.post('/api/account/update', { token, ...data }); },
  signout(token) { return this.post('/api/signout', { token }); },
  signoutAll(token) { return this.post('/api/signout/all', { token }); },
  screenshot(base64) { return this.post('/api/screenshot', { base64 }); },
  notify(title, message) { return this.post('/api/notify', { title, message }); },
  markNotif(id) { return this.post('/api/notifications/mark', { id }); },
  markAllNotifs() { return this.post('/api/notifications/mark', { all: true }); },
  friends(userId) { return this.get(`/api/friends?userId=${encodeURIComponent(userId)}`); },
  addFriend(token, friendId) { return this.post('/api/friends', { token, action: 'add', friendId }); },
  acceptFriend(token, fromId) { return this.post('/api/friends', { token, action: 'accept', fromId }); },
  rejectFriend(token, fromId) { return this.post('/api/friends', { token, action: 'reject', fromId }); },
  removeFriend(token, friendId) { return this.post('/api/friends', { token, action: 'remove', friendId }); },
  listUsers() { return this.post('/api/users', {}); },
  getDevices() { return this.get('/api/device'); },
  saveDevice(data) { return this.post('/api/device', data); },
  getScreenshots() { return this.get('/api/screenshots'); },
  deleteScreenshot(path) { return this.post('/api/screenshots/delete', { path }); },

  mediaUrl(path) {
    return `${this.base}/api/file/read?path=${encodeURIComponent(path)}`;
  },

  runtimeUrl(type, id) {
    const folder = type === 'game' ? 'games' : 'apps';
    return `${this.base}/${folder}/${id}/index.html`;
  }
};

async function loadExternalData() {
  RQBApi.online = await RQBApi.init();

  if (RQBApi.online) {
    try {
      const [storeRes, profRes, cfgRes] = await Promise.all([
        RQBApi.store(),
        RQBApi.profiles(),
        RQBApi.config()
      ]);
      if (storeRes.ok) RQBBOX_DATA.store = storeRes.data;
      if (profRes.ok) RQBBOX_DATA.profiles = profRes.data;
      if (cfgRes.ok && cfgRes.data) RQBBOX_DATA.config = cfgRes.data;
    } catch (e) {
      console.warn('API load partial fail', e);
    }
  } else {
    try {
      const storeRes = await fetch('../../Store/catalog/store.json');
      if (storeRes.ok) RQBBOX_DATA.store = await storeRes.json();
    } catch (e) { /* offline */ }
    try {
      const profRes = await fetch('../../Profiles/profiles.json');
      if (profRes.ok) RQBBOX_DATA.profiles = await profRes.json();
    } catch (e) { /* offline */ }
  }

  if (!RQBBOX_DATA.store) {
    RQBBOX_DATA.store = {
      games: [{ id: 'pixel-quest', title: 'Pixel Quest', category: 'Indie', description: 'Retro adventure.', rating: 4.9, banner: '⚔️' }],
      apps: [{ id: 'rqb-browser', title: 'RQB Browser', category: 'Utility', description: 'Portable browser.', rating: 4.5, banner: '🌐' }],
      categories: ['All']
    };
  }

  if (!RQBBOX_DATA.profiles) {
    RQBBOX_DATA.profiles = {
      users: [{ id: 'default', name: 'Player One', avatar: 'P', role: 'Owner', pin: null, recentApps: [], achievements: 0, playTime: '0h' }],
      installed: { games: ['pixel-quest'], apps: ['rqb-browser'] },
      downloads: [],
      notifications: [{ id: 1, title: 'Welcome', message: 'RQBBOX OS is ready.', time: 'Now', read: false }]
    };
  }

  // Sync installed flags on catalog items
  const inst = RQBBOX_DATA.profiles.installed || { games: [], apps: [] };
  (RQBBOX_DATA.store.games || []).forEach(g => { g.installed = inst.games?.includes(g.id); });
  (RQBBOX_DATA.store.apps || []).forEach(a => { a.installed = inst.apps?.includes(a.id); });
}

async function saveProfiles() {
  if (RQBApi.online) {
    await RQBApi.saveProfiles(RQBBOX_DATA.profiles);
  }
}

async function saveConfig() {
  if (RQBApi.online) {
    await RQBApi.saveConfig(RQBBOX_DATA.config);
  }
}

async function addNotification(title, message) {
  if (!RQBBOX_DATA.profiles.notifications) RQBBOX_DATA.profiles.notifications = [];
  const id = Date.now();
  RQBBOX_DATA.profiles.notifications.unshift({ id, title, message, time: 'Just now', read: false });
  if (RQBApi.online) await RQBApi.notify(title, message);
  else await saveProfiles();
  RQB.renderNotifications?.();
}
