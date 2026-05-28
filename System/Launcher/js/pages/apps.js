const AppsPage = {
  filter: 'All',

  render() {
    const el = RQB.$('#page-apps');
    const apps = RQBBOX_DATA.store?.apps || [];
    const categories = ['All', 'Utility', 'Media', 'AI', 'Productivity', 'Streaming', 'Social', 'Developer', 'Reference'];
    const installed = RQBBOX_DATA.profiles?.installed?.apps || [];

    el.innerHTML = `
      <div class="section-header" style="padding-top:28px;"><h3>Apps</h3><span style="color:var(--text-muted);font-size:.8rem;">${installed.length} installed</span></div>
      <div class="category-pills" id="app-categories"></div>
      <div class="horz-scroll" id="apps-scroll"></div>
      <div class="section-header"><h3>All Apps</h3><span style="color:var(--text-muted);font-size:.8rem;">${apps.length} available</span></div>
      <div class="card-grid" id="apps-grid"></div>`;

    const pills = el.querySelector('#app-categories');
    categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = 'category-pill' + (cat === this.filter ? ' active' : '');
      pill.textContent = cat;
      pill.onclick = () => { AppsPage.filter = cat; AppsPage.render(); };
      pills.appendChild(pill);
    });

    const filtered = this.filter === 'All' ? apps : apps.filter(a => a.category === this.filter);

    // Installed scroll
    const scroll = el.querySelector('#apps-scroll');
    const installedApps = apps.filter(a => installed.includes(a.id));
    if (installedApps.length) {
      installedApps.forEach(a => {
        a.installed = true;
        const card = RQB.buildCard(a, 'app');
        card.onclick = () => RQB.launchItem('app', a.id);
        scroll.appendChild(card);
      });
    } else {
      scroll.innerHTML = '<div style="color:var(--text-muted);font-size:.8rem;padding:16px 0;">No apps installed yet.</div>';
    }

    // All apps grid
    const grid = el.querySelector('#apps-grid');
    filtered.forEach(a => {
      a.installed = installed.includes(a.id);
      const card = RQB.buildCard(a, 'app');
      card.onclick = () => RQB.launchItem('app', a.id);
      grid.appendChild(card);
    });
  }
};
