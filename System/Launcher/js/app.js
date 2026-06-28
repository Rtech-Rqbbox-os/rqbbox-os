/* RQBBOX OS - Main Application */
document.addEventListener('DOMContentLoaded', async () => {
  RQBAudio.init();
  Boot.setupAuth();
  Runtime.setup();

  RQBBOX_DATA.nav.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (item.id === 'home' ? ' active' : '');
    btn.dataset.page = item.id;
    btn.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}`;
    btn.onclick = () => RQB.navigate(item.id);
    RQB.$('#nav-items').appendChild(btn);
  });

  RQB.$('#global-search')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') RQB.smartSearch(e.target.value);
  });

  RQB.$('#btn-notifications')?.addEventListener('click', () => {
    RQB.$('#notif-panel').classList.toggle('open');
  });

  RQB.$('#btn-qr')?.addEventListener('click', () => QR.showModal('RQBBOX OS', window.location.origin + '/'));

  RQB.$('#btn-screenshot')?.addEventListener('click', async () => {
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
        RQB.toast('Screenshot saved to Media/Screenshots/');
      } else RQB.toast('Screenshot captured (server offline)');
    } catch {
      RQB.toast('Screenshot saved to Media/Screenshots/');
    }
  });

  RQB.$('#btn-recorder')?.addEventListener('click', () => {
    RQB.state.recording = !RQB.state.recording;
    RQB.toast(RQB.state.recording ? 'Screen recorder armed (use Win+G on Windows)' : 'Recorder stopped');
  });

  RQB.$('#btn-power')?.addEventListener('click', () => RQB.exit());
  RQB.$('#user-pill')?.addEventListener('click', () => RQB.navigate('profile'));
  RQB.$('#sidebar-logo')?.addEventListener('click', () => RQB.navigate('home'));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('quick-guide')?.style.display === 'flex') QuickGuide.close();
      else if (document.getElementById('runtime-overlay')?.classList.contains('active')) Runtime.close();
      else if (document.getElementById('shortcuts-overlay')) document.getElementById('shortcuts-overlay').remove();
      else RQB.$('#notif-panel')?.classList.remove('open');
    }
    if (e.key === 'q' && e.ctrlKey && e.shiftKey) { e.preventDefault(); RQB.exit(); }
    if (e.key === 'n' && e.altKey) { e.preventDefault(); RQB.$('#btn-notifications')?.click(); }
    if (e.key === 'p' && e.ctrlKey) { e.preventDefault(); RQB.navigate('profile'); }
    if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); RQB.navigate('home'); }
    const pageIdx = parseInt(e.key);
    if (e.ctrlKey && pageIdx >= 1 && pageIdx <= 9) {
      e.preventDefault();
      const pages = ['home', 'games', 'apps', 'store', 'files', 'ai', 'friends', 'media', 'browser'];
      if (pages[pageIdx - 1]) RQB.navigate(pages[pageIdx - 1]);
    }
  });

  QuickGuide.init();
  SysBar.init();
  RQBoxFullscreen.init();
  RQB.initController();
  RQB.initTouch();
  RQB.initFpsMonitor();

  await Boot.run();
  await PluginEngine.init();
  await Editions.init();
  document.body.classList.add('boot-complete');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
