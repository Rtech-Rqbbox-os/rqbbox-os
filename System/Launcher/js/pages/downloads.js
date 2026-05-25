const DownloadsPage = {
  async render() {
    const el = RQB.$('#page-downloads');
    const active = RQB.state.downloads || [];
    const completed = RQBBOX_DATA.profiles?.downloads || [];
    const installed = RQBBOX_DATA.profiles?.installed || { games: [], apps: [] };

    el.innerHTML = `
      <div class="section-header"><h3>Download Manager</h3></div>
      <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:16px;">Files install to Games/ and Apps/ on USB</p>
      <div id="active-downloads"></div>
      <div class="section-header" style="margin-top:24px;"><h3>Install History</h3></div>
      <div id="history-list"></div>
      <div class="section-header" style="margin-top:24px;"><h3>Installed Library</h3></div>
      <div id="installed-list"></div>`;
    el.innerHTML = el.innerHTML.replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));

    const activeEl = el.querySelector('#active-downloads');
    if (!active.length) activeEl.innerHTML = '<p style="color:var(--text-muted);">No active downloads</p>';
    else active.forEach(d => {
      activeEl.innerHTML += `<div class="download-item"><span>⬇️</span><div style="flex:1"><strong>${d.title}</strong><div class="download-progress" style="margin-top:8px"><div class="download-progress-bar" style="width:${d.progress}%"></div></div></div><span>${d.progress}%</span></div>`;
    });
    activeEl.innerHTML = activeEl.innerHTML.replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));

    const histEl = el.querySelector('#history-list');
    if (!completed.length) histEl.innerHTML = '<p style="color:var(--text-muted);">No install history yet</p>';
    else completed.forEach(d => {
      histEl.innerHTML += `<div class="download-item"><span>✅</span><div style="flex:1"><strong>${d.title || d.id}</strong><p style="font-size:0.8rem;color:var(--text-muted)">${d.path || ''} · ${d.completedAt || ''}</p></div></div>`;
    });

    const installedEl = el.querySelector('#installed-list');
    const store = RQBBOX_DATA.store;
    [...(installed.games||[]).map(id=>({id,type:'game'})), ...(installed.apps||[]).map(id=>({id,type:'app'}))].forEach(({id,type})=>{
      const item = store?.[type==='game'?'games':'apps']?.find(x=>x.id===id);
      if (!item) return;
      installedEl.innerHTML += `<div class="download-item"><span>${item.banner||'✓'}</span><div style="flex:1"><strong>${item.title}</strong><p style="font-size:0.8rem;color:var(--text-muted)">${type} · Ready</p></div><button class="btn btn-primary btn-sm" onclick="RQB.launchItem('${type}','${id}')">Launch</button></div>`;
    });
    installedEl.innerHTML = installedEl.innerHTML.replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));
  }
};
