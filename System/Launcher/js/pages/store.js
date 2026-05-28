const StorePage = {
  filter: 'All',
  installing: null,

  render() {
    const el = RQB.$('#page-store');
    const store = RQBBOX_DATA.store;
    const featured = store?.featured?.[0];
    const installed = RQBBOX_DATA.profiles?.installed || { games: [], apps: [] };

    el.innerHTML = `
      <div class="store-featured">
        <div class="store-featured-main" id="featured-main">
          <span class="tag">FEATURED</span>
          <h2 style="font-size:1.8rem;margin-top:12px;">${featured?.title || 'Neon Drift Racing'}</h2>
          <p style="color:var(--text-secondary);max-width:400px;">${featured?.description || ''}</p>
          <p style="margin-top:8px;"><span class="card-rating">★ ${featured?.rating || '4.8'}</span> · ${featured?.size || 'Free'}</p>
        </div>
        <div class="store-featured-side">
          <div class="mini-feature" data-id="void-craft" data-type="game"><h4>🌍 Void Craft Sandbox</h4><p style="font-size:0.8rem;color:var(--text-secondary);margin-top:8px;">Install to USB</p></div>
          <div class="mini-feature" data-id="music-wave" data-type="app"><h4>🎵 Music Wave</h4><p style="font-size:0.8rem;color:var(--text-secondary);margin-top:8px;">Install to USB</p></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <img src="/branding/rhytech-logo.svg" alt="RhysTech" style="height:32px;" onerror="this.src='../Branding/rhytech-logo.svg'">
        <div><h3 style="font-size:1.1rem;">RhysTech Store</h3><p style="font-size:0.8rem;color:var(--text-muted);">Real installs to USB · Offline ready</p></div>
      </div>
      <div style="display:flex;gap:12px;align-items:center;padding:16px;background:linear-gradient(135deg,rgba(0,212,255,0.08),rgba(157,78,221,0.08));border:1px solid rgba(0,212,255,0.15);border-radius:16px;margin-bottom:20px;">
        <div style="flex:1;">
          <div style="font-weight:700;font-size:1rem;">🚀 RQBBOX OS v1.1.0</div>
          <div style="font-size:.78rem;color:var(--text-secondary);margin-top:2px;">Portable USB gaming OS — free for all platforms</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.open('https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/tag/v1.1.0-platforms','_blank')" style="white-space:nowrap;">⬇ Download</button>
        <button class="btn btn-ghost btn-sm" onclick="RQBAudio.playStartupSound ? RQBAudio.boot() : RQBAudio?.boot?.()" title="Boot sound preview">🔊</button>
      </div>
      <div class="category-pills" id="store-categories"></div>
      <div class="section-header"><h3>Games</h3></div>
      <div class="card-grid" id="store-games"></div>
      <div class="section-header" style="margin-top:28px;"><h3>Apps</h3></div>
      <div class="card-grid" id="store-apps"></div>
      <div id="install-progress" style="display:none;margin-top:20px;padding:16px;background:var(--bg-card);border-radius:12px;">
        <strong id="install-title">Installing...</strong>
        <div class="download-progress" style="margin-top:8px;"><div class="download-progress-bar" id="install-bar" style="width:0%"></div></div>
      </div>`;
    el.innerHTML = el.innerHTML.replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));

    el.querySelector('#featured-main')?.addEventListener('click', () => StorePage.install(featured?.id || 'neon-drift', 'game', featured?.title));

    el.querySelectorAll('.mini-feature').forEach(m => {
      m.onclick = () => StorePage.install(m.dataset.id, m.dataset.type, m.querySelector('h4').textContent.replace(/^.\s+/u, ''));
    });

    const gamesGrid = el.querySelector('#store-games');
    (store?.games || []).forEach(g => {
      g.installed = installed.games?.includes(g.id);
      const card = RQB.buildCard(g, 'game');
      card.onclick = () => g.installed ? RQB.launchItem('game', g.id) : StorePage.install(g.id, 'game', g.title);
      gamesGrid.appendChild(card);
    });

    const appsGrid = el.querySelector('#store-apps');
    (store?.apps || []).forEach(a => {
      a.installed = installed.apps?.includes(a.id);
      const card = RQB.buildCard(a, 'app');
      card.onclick = () => a.installed ? RQB.launchItem('app', a.id) : StorePage.install(a.id, 'app', a.title);
      appsGrid.appendChild(card);
    });
  },

  async install(id, type, title) {
    const key = type === 'game' ? 'games' : 'apps';
    if (RQBBOX_DATA.profiles.installed[key]?.includes(id)) {
      RQB.launchItem(type, id);
      return;
    }

    if (!RQBApi.online) {
      RQB.toast('Server offline — cannot install');
      return;
    }

    const prog = RQB.$('#install-progress');
    const bar = RQB.$('#install-bar');
    const titleEl = RQB.$('#install-title');
    if (prog) { prog.style.display = 'block'; titleEl.textContent = `Installing ${title}...`; bar.style.width = '0%'; }

    let p = 0;
    const interval = setInterval(() => {
      p += 8 + Math.random() * 12;
      if (bar) bar.style.width = Math.min(90, p) + '%';
    }, 200);

    try {
      const res = await RQBApi.install(id, type, title);
      clearInterval(interval);
      if (bar) bar.style.width = '100%';

      if (res.ok) {
        if (!RQBBOX_DATA.profiles.installed[key].includes(id)) {
          RQBBOX_DATA.profiles.installed[key].push(id);
        }
        const item = RQBBOX_DATA.store[key === 'games' ? 'games' : 'apps']?.find(x => x.id === id);
        if (item) item.installed = true;

        const profRes = await RQBApi.profiles();
        if (profRes.ok) RQBBOX_DATA.profiles = profRes.data;

        RQB.toast(`${title} installed to USB!`);
        Stats.track('storeInstall');
        await addNotification('Install Complete', `${title} is ready to launch.`);
        setTimeout(() => { if (prog) prog.style.display = 'none'; StorePage.render(); }, 800);
      } else {
        RQB.toast(res.error || 'Install failed — package may not exist yet');
        if (prog) prog.style.display = 'none';
      }
    } catch (e) {
      clearInterval(interval);
      RQB.toast('Install failed: ' + e.message);
      if (prog) prog.style.display = 'none';
    }
  }
};
