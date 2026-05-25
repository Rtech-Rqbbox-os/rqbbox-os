const MediaPage = {
  files: [],
  current: null,
  mediaTab: 'library',

  async render() {
    const el = RQB.$('#page-media');
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="flex:1;"><div class="section-header" style="margin-bottom:0;"><h3>🎬 Media Hub</h3></div></div>
        <button class="btn btn-ghost btn-sm ${this.mediaTab === 'library' ? 'active' : ''}" onclick="MediaPage.switchTab('library')">Library</button>
        <button class="btn btn-ghost btn-sm ${this.mediaTab === 'screenshots' ? 'active' : ''}" onclick="MediaPage.showScreenshots()">📷 Screenshots</button>
      </div>
      <div id="media-content"></div>`;
    this.mediaTab === 'screenshots' ? this.renderScreenshots() : this.renderLibrary();
  },

  switchTab(tab) {
    this.mediaTab = tab;
    this.render();
  },

  async renderLibrary() {
    const el = RQB.$('#media-content');
    if (!el) return;
    el.innerHTML = `
      <div class="media-player">
        <video id="media-vid" controls style="display:none;max-width:100%;max-height:50vh;"></video>
        <audio id="media-aud" controls style="display:none;width:80%;"></audio>
        <p id="media-label" style="color:var(--text-secondary);">Select from library or open file</p>
        <div class="media-controls"><button onclick="MediaPage.openFile()">📂 Open</button></div>
      </div>
      <div class="section-header" style="margin-top:24px;"><h3>USB Media Library</h3></div>
      <div class="card-grid" id="media-library"></div>`;

    const grid = el.querySelector('#media-library');
    grid.innerHTML = '<p style="color:var(--text-muted);">Loading...</p>';

    if (RQBApi.online) {
      try {
        const res = await RQBApi.files('Media');
        this.files = (res.items || []).filter(f => f.type === 'file');
        grid.innerHTML = '';
        if (!this.files.length) grid.innerHTML = '<p style="color:var(--text-muted);">No media yet — add files to Media/ or take screenshots</p>';
        this.files.forEach(f => {
          const card = document.createElement('div');
          card.className = 'card';
          const icon = /\.(mp4|webm)$/i.test(f.name) ? '🎬' : /\.(wav|mp3)$/i.test(f.name) ? '🎵' : '📄';
          card.innerHTML = `<div class="card-banner">${icon}</div><div class="card-body"><div class="card-title">${f.name}</div><div class="card-desc">${Math.round((f.size||0)/1024)} KB</div></div>`;
          card.onclick = () => MediaPage.play(f);
          grid.appendChild(card);
        });
      } catch { grid.innerHTML = '<p style="color:var(--text-muted);">Could not load media</p>'; }
    }
  },

  async showScreenshots() {
    this.mediaTab = 'screenshots';
    const el = RQB.$('#page-media');
    if (el) {
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
          <div style="flex:1;"><div class="section-header" style="margin-bottom:0;"><h3>🎬 Media Hub</h3></div></div>
          <button class="btn btn-ghost btn-sm" onclick="MediaPage.switchTab('library')">Library</button>
          <button class="btn btn-ghost btn-sm active" onclick="MediaPage.showScreenshots()">📷 Screenshots</button>
        </div>
        <div id="media-content"></div>`;
    }
    await this.renderScreenshots();
  },

  async renderScreenshots() {
    const el = RQB.$('#media-content');
    if (!el) return;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
        <h4 style="font-size:0.95rem;">📷 Screenshot Gallery</h4>
        <button class="btn btn-ghost btn-sm" onclick="MediaPage.takeScreenshot()">📸 Capture Now</button>
      </div>
      <div id="screenshot-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;"></div>`;

    const grid = document.getElementById('screenshot-grid');
    grid.innerHTML = '<p style="color:var(--text-muted);">Loading screenshots...</p>';

    if (RQBApi.online) {
      try {
        const res = await RQBApi.getScreenshots();
        if (!res.ok || !res.screenshots?.length) {
          grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">No screenshots yet. Click "Capture Now" or use the 📷 button in the top bar.</p>';
          return;
        }
        grid.innerHTML = res.screenshots.map(s => `
          <div class="screenshot-card" onclick="MediaPage.viewScreenshot('${s.path.replace(/'/g, "\\'")}')">
            <div class="screenshot-thumb" style="background:linear-gradient(135deg,#0a1530,#1a0a30);display:flex;align-items:center;justify-content:center;font-size:3rem;">📷</div>
            <div class="screenshot-info">
              <div class="screenshot-name">${s.name}</div>
              <div style="font-size:0.65rem;color:var(--text-muted);display:flex;justify-content:space-between;">
                <span>${s.modified ? new Date(s.modified).toLocaleDateString() : ''}</span>
                <span>${s.size ? Math.round(s.size/1024) + ' KB' : ''}</span>
              </div>
            </div>
            <button class="screenshot-delete" onclick="event.stopPropagation();MediaPage.deleteScreenshot('${s.path.replace(/'/g, "\\'")}')">✕</button>
          </div>
        `).join('');
      } catch { grid.innerHTML = '<p style="color:var(--text-muted);">Could not load screenshots</p>'; }
    } else grid.innerHTML = '<p style="color:var(--text-muted);">Server offline — screenshots not available</p>';
  },

  async takeScreenshot() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00d4ff'; ctx.font = '24px Segoe UI';
      ctx.fillText('RQBBOX OS Screenshot — ' + new Date().toLocaleString(), 20, 40);
      const data = canvas.toDataURL('image/png').split(',')[1];
      if (RQBApi.online) {
        await RQBApi.screenshot(data);
        Stats.track('screenshot');
        RQB.toast('Screenshot captured!');
        if (RQBAudio && RQBAudio.select) RQBAudio.select();
        this.showScreenshots();
      } else RQB.toast('Screenshot captured (server offline)');
    } catch { RQB.toast('Screenshot failed'); }
  },

  viewScreenshot(path) {
    const url = RQBApi.mediaUrl(path);
    window.open(url, '_blank');
  },

  async deleteScreenshot(path) {
    if (!confirm('Delete this screenshot?')) return;
    if (RQBApi.online) {
      const res = await RQBApi.deleteScreenshot(path);
      if (res.ok) { RQB.toast('Screenshot deleted'); this.showScreenshots(); }
      else RQB.toast('Delete failed');
    }
  },

  play(file) {
    const url = RQBApi.mediaUrl(file.path);
    const vid = RQB.$('#media-vid'), aud = RQB.$('#media-aud'), label = RQB.$('#media-label');
    if (!vid || !aud) return;
    label.style.display = 'none';
    if (/\.(mp4|webm)$/i.test(file.name)) {
      vid.style.display = 'block'; aud.style.display = 'none'; vid.src = url; vid.play();
    } else {
      aud.style.display = 'block'; vid.style.display = 'none'; aud.src = url; aud.play();
    }
    this.current = file;
    RQB.toast(`Playing: ${file.name}`);
  },

  openFile() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'audio/*,video/*';
    inp.onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const url = URL.createObjectURL(f);
      const vid = RQB.$('#media-vid'), aud = RQB.$('#media-aud');
      if (!vid || !aud) return;
      RQB.$('#media-label').style.display = 'none';
      if (f.type.startsWith('video')) { vid.src = url; vid.style.display = 'block'; aud.style.display = 'none'; vid.play(); }
      else { aud.src = url; aud.style.display = 'block'; vid.style.display = 'none'; aud.play(); }
    };
    inp.click();
  }
};
