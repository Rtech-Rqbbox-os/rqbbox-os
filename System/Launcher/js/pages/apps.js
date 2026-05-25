const AppsPage = {
  filter: 'All',

  render() {
    const el = RQB.$('#page-apps');
    const apps = RQBBOX_DATA.store?.apps || [];
    const categories = ['All', 'Utility', 'Media', 'AI', 'Productivity', 'Streaming', 'Social', 'Developer', 'Reference'];
    const installed = RQBBOX_DATA.profiles?.installed?.apps || [];

    el.innerHTML = `
      <div class="section-header"><h3>Apps</h3><span style="color:var(--text-muted);font-size:0.85rem;">${installed.length} installed</span></div>
      <div class="category-pills" id="app-categories"></div>
      <div class="card-grid" id="apps-grid"></div>`;

    const pills = el.querySelector('#app-categories');
    categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = 'category-pill' + (cat === this.filter ? ' active' : '');
      pill.textContent = cat;
      pill.onclick = () => { AppsPage.filter = cat; AppsPage.render(); };
      pills.appendChild(pill);
    });

    const grid = el.querySelector('#apps-grid');
    const filtered = this.filter === 'All' ? apps : apps.filter(a => a.category === this.filter);
    filtered.forEach(a => {
      a.installed = installed.includes(a.id);
      const card = RQB.buildCard(a, 'app');
      card.onclick = () => {
        if (a.id === 'file-explorer') RQB.navigate('files');
        else RQB.launchItem('app', a.id);
      };
      grid.appendChild(card);
    });
  }
};
