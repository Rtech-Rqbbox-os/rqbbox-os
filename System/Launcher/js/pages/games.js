const GamesPage = {
  filter: 'All',

  render() {
    const el = RQB.$('#page-games');
    const games = RQBBOX_DATA.store?.games || [];
    const categories = ['All', '3D', 'Indie', 'Racing', 'Sandbox', 'Emulator'];
    const installed = RQBBOX_DATA.profiles?.installed?.games || [];

    el.innerHTML = `
      <div class="section-header"><h3>Game Library</h3><span style="color:var(--text-muted);font-size:0.85rem;">${installed.length} installed · Click to play</span></div>
      <div class="category-pills" id="game-categories"></div>
      <div class="card-grid" id="games-grid"></div>`;
    el.innerHTML = el.innerHTML.replace(/<\/?motion\.motion.div/g, t => t.replace('motion.', '')).replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));

    const pills = el.querySelector('#game-categories');
    categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = 'category-pill' + (cat === this.filter ? ' active' : '');
      pill.textContent = cat;
      pill.onclick = () => { GamesPage.filter = cat; GamesPage.render(); };
      pills.appendChild(pill);
    });

    const grid = el.querySelector('#games-grid');
    const filtered = this.filter === 'All' ? games : games.filter(g => g.category === this.filter);
    filtered.forEach(g => {
      g.installed = installed.includes(g.id);
      const card = RQB.buildCard(g, 'game');
      card.onclick = () => RQB.launchItem('game', g.id);
      grid.appendChild(card);
    });
  }
};
