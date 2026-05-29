(function() {
  'use strict';

  var BASE = 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website';

  var STYLE_ID = 'rqbbox-embed-style';
  if (!document.getElementById(STYLE_ID)) {
    var css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = [
      '.rqbbox-embed-widget {',
      '  background: rgba(20,22,28,.92);',
      '  backdrop-filter: blur(24px) saturate(1.3);',
      '  -webkit-backdrop-filter: blur(24px) saturate(1.3);',
      '  border: 1px solid rgba(255,255,255,.08);',
      '  border-radius: 16px; padding: 24px;',
      '  box-shadow: 0 20px 60px rgba(0,0,0,.6);',
      '  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;',
      '  color: #fff; max-width: 100%;',
      '  margin: 16px 0;',
      '}',
      '.rqbbox-embed-widget * { margin: 0; padding: 0; box-sizing: border-box; }',
      '.rqbbox-ew-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }',
      '.rqbbox-ew-logo { width: 56px; height: 56px; border-radius: 14px; flex-shrink: 0; }',
      '.rqbbox-ew-title { font-size: 1.3rem; font-weight: 700; }',
      '.rqbbox-ew-sub { font-size: .78rem; color: rgba(255,255,255,.4); margin-top: 2px; }',
      '.rqbbox-ew-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }',
      '.rqbbox-ew-badge { display: inline-block; background: rgba(0,212,255,.08); border: 1px solid rgba(0,212,255,.1); padding: 3px 10px; border-radius: 100px; font-size: .7rem; color: #00d4ff; text-transform: uppercase; letter-spacing: .3px; }',
      '.rqbbox-ew-desc { font-size: .85rem; line-height: 1.6; color: rgba(255,255,255,.55); margin-bottom: 16px; }',
      '.rqbbox-ew-features { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 18px; }',
      '.rqbbox-ew-f { padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.04); font-size: .75rem; color: rgba(255,255,255,.5); }',
      '.rqbbox-ew-f strong { color: rgba(255,255,255,.7); }',
      '.rqbbox-ew-actions { display: flex; flex-wrap: wrap; gap: 8px; }',
      '.rqbbox-ew-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 10px; font-size: .8rem; font-weight: 600; text-decoration: none; transition: all .2s ease; border: none; cursor: pointer; }',
      '.rqbbox-ew-btn-primary { background: linear-gradient(135deg, #007bff, #00d4ff); color: #fff; box-shadow: 0 4px 16px rgba(0,212,255,.2); }',
      '.rqbbox-ew-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,212,255,.3); }',
      '.rqbbox-ew-btn-ghost { background: rgba(255,255,255,.05); color: rgba(255,255,255,.7); border: 1px solid rgba(255,255,255,.06); }',
      '.rqbbox-ew-btn-ghost:hover { background: rgba(255,255,255,.08); }',
      '.rqbbox-ew-footer { margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,.04); font-size: .7rem; color: rgba(255,255,255,.25); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; }',
      '.rqbbox-ew-platforms { display: flex; flex-wrap: wrap; gap: 4px; }',
      '.rqbbox-ew-platform { padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,.04); font-size: .65rem; color: rgba(255,255,255,.35); }',
      '@media (max-width: 500px) { .rqbbox-ew-features { grid-template-columns: 1fr; } .rqbbox-embed-widget { padding: 16px; } }'
    ].join('\n');
    document.head.appendChild(css);
  }

  function createWidget(target) {
    var w = document.createElement('div');
    w.className = 'rqbbox-embed-widget';

    w.innerHTML = [
      '<div class="rqbbox-ew-header">',
      '  <svg class="rqbbox-ew-logo" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0a0e1a" stroke="url(#ew-lg)" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-size="52" font-weight="800" fill="url(#ew-lg)" font-family="Segoe UI">R</text><defs><linearGradient id="ew-lg"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#9d4edd"/></linearGradient></defs></svg>',
      '  <div><div class="rqbbox-ew-title">RQBBOX OS</div><div class="rqbbox-ew-sub">Portable USB Gaming OS by RhysTech</div></div>',
      '</div>',
      '<div class="rqbbox-ew-badges"><span class="rqbbox-ew-badge">v1.2.0</span><span class="rqbbox-ew-badge">Open Source</span><span class="rqbbox-ew-badge">Free</span><span class="rqbbox-ew-badge">RQBBOX Kernel</span><span class="rqbbox-ew-badge">PS5 UI</span></div>',
      '<div class="rqbbox-ew-desc">A portable USB-based gaming OS that runs entirely from a USB drive without installation. Powered by the RQBBOX Kernel — modular microkernel with process manager, memory manager, file system, device drivers, and syscall API. PS5-inspired UI, pro audio engine, 43+ store packages, phone bootloader. Works on Windows, macOS, Linux, Android, iOS, and KaiOS.</div>',
      '<div class="rqbbox-ew-features">',
      '  <div class="rqbbox-ew-f"><strong>⚙️ RQBBOX Kernel</strong> &bull; Modular microkernel</div>',
      '  <div class="rqbbox-ew-f"><strong>🎮 6 Games</strong> &bull; HTML5 native titles</div>',
      '  <div class="rqbbox-ew-f"><strong>🛒 43+ Packages</strong> &bull; Store + Google Play</div>',
      '  <div class="rqbbox-ew-f"><strong>🎨 PS5 UI</strong> &bull; Dark minimal, glassmorphism</div>',
      '  <div class="rqbbox-ew-f"><strong>🔊 Pro Audio</strong> &bull; 40+ synth sounds, DSP</div>',
      '  <div class="rqbbox-ew-f"><strong>📱 Phone Boot</strong> &bull; Auto-detect + PWA guides</div>',
      '</div>',
      '<div class="rqbbox-ew-actions">',
      '  <a class="rqbbox-ew-btn rqbbox-ew-btn-primary" href="' + BASE + '/releases" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download</a>',
      '  <a class="rqbbox-ew-btn rqbbox-ew-btn-ghost" href="https://github.com/Rtech-Rqbbox-os/rqbbox-os" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> GitHub</a>',
      '  <a class="rqbbox-ew-btn rqbbox-ew-btn-ghost" href="' + BASE + '/os-info-card.html" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> Info</a>',
      '</div>',
      '<div class="rqbbox-ew-footer"><span>RQBBOX OS &copy; 2026 RhysTech &bull; MIT</span><span class="rqbbox-ew-platforms"><span class="rqbbox-ew-platform">Windows</span><span class="rqbbox-ew-platform">macOS</span><span class="rqbbox-ew-platform">Linux</span><span class="rqbbox-ew-platform">Android</span><span class="rqbbox-ew-platform">iOS</span><span class="rqbbox-ew-platform">KaiOS</span></span></div>'
    ].join('');

    if (target) {
      target.parentNode.replaceChild(w, target);
    } else {
      document.body.appendChild(w);
    }
    return w;
  }

  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.indexOf('embed-card.js') !== -1) {
      createWidget(scripts[i]);
      break;
    }
  }
})();
