/* RQBBOX OS - In-OS Runtime (launch apps/games inside the shell) */
const Runtime = {
  open(type, id, title) {
    const overlay = document.getElementById('runtime-overlay');
    const frame = document.getElementById('runtime-frame');
    const titleEl = document.getElementById('runtime-title');

    if (!overlay || !frame) {
      window.open(RQBApi.runtimeUrl(type, id), '_blank');
      return;
    }

    titleEl.textContent = title || id;
    frame.src = RQBApi.runtimeUrl(type, id);
    overlay.classList.add('active');
    document.getElementById('main-shell')?.classList.add('runtime-active');

    RQB.trackRecent(id);
    Stats.track(type === 'game' ? 'gameLaunch' : 'appLaunch');
    RQB.toast(`Running: ${title || id}`);
  },

  close() {
    const overlay = document.getElementById('runtime-overlay');
    const frame = document.getElementById('runtime-frame');
    overlay?.classList.remove('active');
    document.getElementById('main-shell')?.classList.remove('runtime-active');
    if (frame) frame.src = 'about:blank';
  },

  setup() {
    document.getElementById('runtime-back')?.addEventListener('click', () => Runtime.close());
    document.getElementById('runtime-home')?.addEventListener('click', () => {
      Runtime.close();
      RQB.navigate('home');
    });
    window.addEventListener('message', e => {
      if (e.data === 'rqbbox-exit') Runtime.close();
      if (e.data?.type === 'rqbbox-toast') RQB.toast(e.data.message);
      if (e.data?.type === 'rqbbox-save') Runtime.handleSave(e.data);
    });
  },

  async handleSave(data) {
    if (!RQBApi.online) return;
    try {
      await RQBApi.writeFile(data.path, data.content);
      RQB.toast('Saved to USB');
    } catch {
      RQB.toast('Save failed');
    }
  }
};

RQB.trackRecent = async function(id) {
  const user = RQB.state.currentUser;
  if (!user) return;
  user.recentApps = [id, ...(user.recentApps || []).filter(x => x !== id)].slice(0, 8);
  const pu = RQBBOX_DATA.profiles.users.find(u => u.id === user.id);
  if (pu) pu.recentApps = user.recentApps;
  await saveProfiles();
};

RQB.launchItem = async function(type, id) {
  const key = type === 'game' ? 'games' : 'apps';
  const list = RQBBOX_DATA.store?.[key] || [];
  const item = list.find(x => x.id === id);
  if (!item) return;

  const installed = RQBBOX_DATA.profiles?.installed?.[key]?.includes(id);
  if (!installed) {
    RQB.toast(`${item.title} not installed — visit RhysTech Store`);
    RQB.navigate('store');
    return;
  }

  Runtime.open(type, id, item.title);
};

RQB.updateStorage = async function() {
  const fill = RQB.$('#storage-fill');
  const text = RQB.$('#storage-text');
  try {
    if (RQBApi.online) {
      const info = await RQBApi.storage();
      if (fill) fill.style.width = Math.min(100, info.usedPct || 10) + '%';
      if (text) text.textContent = `${info.label || 'RQBBOX 0'} · ${info.freeGB} GB free`;
      return;
    }
  } catch (e) { /* fallback */ }
  if (fill) fill.style.width = '9%';
  if (text) text.textContent = 'RQBBOX 0 · USB';
};
