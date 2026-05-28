const GamesPage = {
  filter: 'All',

  render() {
    const el = RQB.$('#page-games');
    const games = RQBBOX_DATA.store?.games || [];
    const categories = ['All', '3D', 'Indie', 'Racing', 'Sandbox', 'Emulator'];
    const installed = RQBBOX_DATA.profiles?.installed?.games || [];

    el.innerHTML = `
      <div class="section-header" style="padding-top:28px;"><h3>Game Library</h3><span style="color:var(--text-muted);font-size:.8rem;">${installed.length} installed</span></div>
      <div class="category-pills" id="game-categories"></div>
      <div class="horz-scroll" id="games-scroll"></div>
      <div class="section-header"><h3>All Games</h3><span style="color:var(--text-muted);font-size:.8rem;">${games.length} available</span></div>
      <div class="card-grid" id="games-grid"></div>`;

    const pills = el.querySelector('#game-categories');
    categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = 'category-pill' + (cat === this.filter ? ' active' : '');
      pill.textContent = cat;
      pill.onclick = () => { GamesPage.filter = cat; GamesPage.render(); };
      pills.appendChild(pill);
    });

    const filtered = this.filter === 'All' ? games : games.filter(g => g.category === this.filter);

    // Installed scroll
    const scroll = el.querySelector('#games-scroll');
    const installedGames = games.filter(g => installed.includes(g.id));
    if (installedGames.length) {
      installedGames.forEach(g => {
        g.installed = true;
        const card = RQB.buildCard(g, 'game');
        card.onclick = () => RQB.launchItem('game', g.id);
        scroll.appendChild(card);
      });
    } else {
      scroll.innerHTML = '<div style="color:var(--text-muted);font-size:.8rem;padding:16px 0;">No games installed yet. Visit the RhysTech Store to get started!</div>';
    }

    // All games grid
    const grid = el.querySelector('#games-grid');
    filtered.forEach(g => {
      g.installed = installed.includes(g.id);
      const card = RQB.buildCard(g, 'game');
      card.onclick = () => g.installed ? RQB.launchItem('game', g.id) : RQB.navigate('store');
      grid.appendChild(card);
    });
  }
};
