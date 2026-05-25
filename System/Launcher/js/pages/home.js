const HomePage = {
  render() {
    const el = RQB.$('#page-home');
    const user = RQB.state.currentUser;
    const s = user ? Stats.ensure(user) : { gamesLaunched: 0, appsLaunched: 0, achievements: 0, minutesActive: 0 };
    const inst = RQBBOX_DATA.profiles?.installed || { games: [], apps: [] };
    const store = RQBBOX_DATA.store;
    const totalInstalled = (inst.games||[]).length + (inst.apps||[]).length;

    // Recently played from user's recentApps
    const recent = (user?.recentApps || []).map(id => {
      const g = store?.games?.find(x => x.id === id);
      const a = store?.apps?.find(x => x.id === id);
      return g ? { ...g, type: 'game' } : a ? { ...a, type: 'app' } : null;
    }).filter(Boolean);

    el.innerHTML = `
      <div class="hero-banner">
        <div class="hero-banner-bg"></div>
        <div class="hero-banner-content">
          <span class="tag">RQBBOX OS · ${RQBApi.online ? 'ONLINE' : 'OFFLINE'}</span>
          <h2>Welcome, ${user?.name || 'Player'}!</h2>
          <p id="hero-stats">${s.gamesLaunched} games · ${s.appsLaunched} apps · ${Stats.formatTime(s.minutesActive)} active</p>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button class="btn btn-primary btn-sm" style="width:auto;" onclick="RQB.navigate('store')">🛒 RhysTech Store</button>
            <button class="btn btn-ghost btn-sm" style="width:auto;" onclick="RQB.navigate('games')">🎮 My Games</button>
            <button class="btn btn-ghost btn-sm" style="width:auto;" onclick="RQB.navigate('profile')">👤 Account</button>
          </div>
        </div>
      </div>

      <div class="widget-row">
        <div class="widget"><div class="widget-value" id="stat-games">0</div><div class="widget-label">Games Played</div></div>
        <div class="widget"><div class="widget-value" id="stat-apps">0</div><div class="widget-label">Apps Used</div></div>
        <div class="widget"><div class="widget-value" id="stat-achievements">0</div><div class="widget-label">Achievements</div></div>
        <div class="widget"><div class="widget-value" id="stat-minutes">0m</div><div class="widget-label">Minutes Active</div></div>
      </div>

      <div class="section-header"><h3>Quick Launch</h3></div>
      <div class="quick-launch" id="quick-launch"></div>

      ${recent.length ? `
      <div class="section-header"><h3>Recently Played</h3></div>
      <div class="card-grid" id="recent-grid"></div>` : ''}

      <div class="section-header"><h3>Installed (${totalInstalled})</h3></div>
      <div class="card-grid" id="home-games"></div>

      <div class="section-header"><h3>Network Access</h3></div>
      <div class="card" style="padding:16px;cursor:default;margin-bottom:20px;" id="connect-card">
        <p style="font-size:0.85rem;color:var(--text-secondary);">Access RQBBOX on any device on the same network:</p>
        <p style="font-family:monospace;font-size:1.1rem;color:var(--neon-blue);margin:8px 0;" id="connect-url">Detecting network...</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
          <span style="font-size:0.8rem;color:var(--text-muted);">TV mode: add <span style="font-family:monospace;color:var(--neon-purple);">/tv/</span> to URL</span>
          <span style="font-size:0.8rem;color:var(--text-muted);margin-left:8px;">· QR code: coming soon</span>
        </div>
      </div>`;

    Stats.updateUI();

    // Detect local IP
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer().then(o => pc.setLocalDescription(o));
      pc.onicecandidate = e => {
        if (!e.candidate) return;
        const ip = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/)?.[1];
        if (ip) {
          const url = `http://${ip}:19777/`;
          const el2 = RQB.$('#connect-url');
          if (el2) el2.innerHTML = `<a href="${url}" target="_blank" style="color:var(--neon-blue);text-decoration:none;">${url}</a>  ·  <span style="font-size:0.8rem;">TV: <a href="${url}tv/" target="_blank" style="color:var(--neon-purple);">${url}tv/</a></span>`;
          pc.close();
        }
      };
      setTimeout(() => { const el2 = RQB.$('#connect-url'); if (el2 && el2.textContent === 'Detecting network...') el2.textContent = 'Connect to RQBBOX server to see network address.'; }, 3000);
    } catch {}

    // Quick launch buttons
    const quick = el.querySelector('#quick-launch');
    [
      { icon: '🛒', label: 'Store', action: () => RQB.navigate('store') },
      { icon: '🎮', label: 'Games', action: () => RQB.navigate('games') },
      { icon: '👤', label: 'Account', action: () => RQB.navigate('profile') },
      { icon: '🤖', label: 'AI Studio', action: () => RQB.navigate('ai') },
      { icon: '📁', label: 'Files', action: () => RQB.navigate('files') },
      { icon: '⚙️', label: 'Settings', action: () => RQB.navigate('settings') }
    ].forEach(q => {
      const item = document.createElement('div');
      item.className = 'quick-item';
      item.innerHTML = `<div class="quick-icon">${q.icon}</div><div class="quick-label">${q.label}</div>`;
      item.onclick = q.action;
      quick.appendChild(item);
    });

    // Recently played grid
    if (recent.length) {
      const recentGrid = el.querySelector('#recent-grid');
      recent.forEach(item => {
        const card = RQB.buildCard(item, item.type);
        card.onclick = () => RQB.launchItem(item.type, item.id);
        recentGrid.appendChild(card);
      });
    }

    // Installed grid
    const grid = el.querySelector('#home-games');
    const items = [
      ...(inst.games || []).map(id => ({ ...(store?.games?.find(g => g.id === id)), type: 'game' })),
      ...(inst.apps || []).map(id => ({ ...(store?.apps?.find(a => a.id === id)), type: 'app' }))
    ].filter(i => i.id);

    if (!items.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">Nothing installed yet. Visit the RhysTech Store to get started!</p>';
      return;
    }
    items.forEach(item => {
      const card = RQB.buildCard(item, item.type);
      card.onclick = () => RQB.launchItem(item.type, item.id);
      grid.appendChild(card);
    });
  }
};
