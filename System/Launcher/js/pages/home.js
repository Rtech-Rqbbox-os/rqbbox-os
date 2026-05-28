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
          <div class="tag">RQBBOX OS · ${RQBApi.online ? 'ONLINE' : 'OFFLINE'}</div>
          <h2>Welcome, ${user?.name || 'Player'}!</h2>
          <p id="hero-stats">${s.gamesLaunched} games · ${s.appsLaunched} apps · ${Stats.formatTime(s.minutesActive)} active</p>
        </div>
      </div>

      <div class="widget-row">
        <div class="widget"><div class="widget-value" id="stat-games">${s.gamesLaunched}</div><div class="widget-label">Games</div></div>
        <div class="widget"><div class="widget-value" id="stat-apps">${s.appsLaunched}</div><div class="widget-label">Apps</div></div>
        <div class="widget"><div class="widget-value" id="stat-achievements">${s.achievements}</div><div class="widget-label">Achievements</div></div>
        <div class="widget"><div class="widget-value" id="stat-minutes">${Stats.formatTime(s.minutesActive)}</div><div class="widget-label">Active</div></div>
      </div>

      <div class="quick-launch">
        <div class="quick-item" onclick="RQB.navigate('store')"><span class="quick-icon">🛒</span><span class="quick-label">Store</span></div>
        <div class="quick-item" onclick="RQB.navigate('games')"><span class="quick-icon">🎮</span><span class="quick-label">Games</span></div>
        <div class="quick-item" onclick="RQB.navigate('apps')"><span class="quick-icon">📱</span><span class="quick-label">Apps</span></div>
        <div class="quick-item" onclick="RQB.navigate('ai')"><span class="quick-icon">🤖</span><span class="quick-label">AI</span></div>
        <div class="quick-item" onclick="RQB.navigate('settings')"><span class="quick-icon">⚙️</span><span class="quick-label">Settings</span></div>
      </div>

      ${recent.length ? `
      <div class="section-header"><h3>Recently Played</h3><span class="section-link" onclick="RQB.navigate('games')">See all →</span></div>
      <div class="horz-scroll" id="recent-scroll"></div>` : ''}

      <div class="section-header"><h3>Installed (${totalInstalled})</h3><span class="section-link" onclick="RQB.navigate('games')">Manage →</span></div>
      <div class="horz-scroll" id="home-scroll"></div>

      <div class="section-header"><h3>Network Access</h3></div>
      <div style="padding:0 40px 24px;">
        <div style="padding:16px 20px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);">
          <p style="font-size:.8rem;color:var(--text-secondary);">Access RQBBOX on any device on the same network:</p>
          <p style="font-family:monospace;font-size:1rem;color:var(--accent);margin:6px 0;" id="connect-url">Detecting network...</p>
          <div style="display:flex;gap:8px;font-size:.7rem;color:var(--text-muted);">
            <span>TV: /tv/</span>
          </div>
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
          if (el2) el2.innerHTML = `<a href="${url}" target="_blank" style="color:var(--accent);text-decoration:none;">${url}</a>  ·  <span style="font-size:.8rem;">TV: <a href="${url}tv/" target="_blank" style="color:var(--text-muted);">${url}tv/</a></span>`;
          pc.close();
        }
      };
      setTimeout(() => { const el2 = RQB.$('#connect-url'); if (el2 && el2.textContent === 'Detecting network...') el2.textContent = 'Connect to RQBBOX server to see network address.'; }, 3000);
    } catch {}

    // Recently played scroll
    if (recent.length) {
      const scroll = el.querySelector('#recent-scroll');
      recent.forEach(item => {
        const card = RQB.buildCard(item, item.type);
        card.onclick = () => RQB.launchItem(item.type, item.id);
        scroll.appendChild(card);
      });
    }

    // Installed scroll
    const scroll = el.querySelector('#home-scroll');
    const items = [
      ...(inst.games || []).map(id => ({ ...(store?.games?.find(g => g.id === id)), type: 'game' })),
      ...(inst.apps || []).map(id => ({ ...(store?.apps?.find(a => a.id === id)), type: 'app' }))
    ].filter(i => i.id);

    if (!items.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding:0 40px 24px;color:var(--text-muted);font-size:.8rem;';
      empty.textContent = 'Nothing installed yet. Visit the RhysTech Store to get started!';
      el.appendChild(empty);
    } else {
      items.forEach(item => {
        const card = RQB.buildCard(item, item.type);
        card.onclick = () => RQB.launchItem(item.type, item.id);
        scroll.appendChild(card);
      });
    }
  }
};
