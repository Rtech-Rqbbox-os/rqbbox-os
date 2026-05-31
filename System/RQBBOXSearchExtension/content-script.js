(() => {
  const q = new URLSearchParams(window.location.search).get('q') || '';
  if (!q.toLowerCase().includes('rqbbox') && !q.toLowerCase().includes('rqbbox os')) return;

  const card = document.createElement('div');
  card.className = 'rqbbox-card';
  card.innerHTML = `
    <div class="rc-header">
      <div class="rc-logo">
        <svg viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0a0e1a" stroke="url(#lg)" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-size="52" font-weight="800" fill="url(#lg)" font-family="Segoe UI, sans-serif">R</text><defs><linearGradient id="lg"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#9d4edd"/></linearGradient></defs></svg>
      </div>
      <div>
        <div class="rc-title">RQBBOX OS</div>
        <div class="rc-sub">Portable USB Gaming Operating System by RhysTech</div>
      </div>
    </div>

    <div class="rc-about">
      <strong>RQBBOX OS</strong> is a portable USB-based gaming operating system that runs entirely from a USB drive. No installation, no emulation, no rebooting. Plug in any USB drive, launch the server, and your gaming world is ready on any PC. Slogans: <strong>"Plug Into Gaming."</strong> · <strong>"Portable Power Anywhere."</strong> · <strong>"Built For Gamers."</strong>
    </div>

    <div class="rc-badges">
      <span class="rc-badge">v2.0</span>
      <span class="rc-badge">USB Portable</span>
      <span class="rc-badge">Open Source</span>
      <span class="rc-badge">MIT License</span>
      <span class="rc-badge">Chrome Extension</span>
      <span class="rc-badge">Firefox Add-on</span>
      <span class="rc-badge">XR Headsets</span>
    </div>

    <div class="rc-features">
      <div class="rc-feat">
        <div class="rc-feat-icon">⚡</div>
        <div class="rc-feat-title">RQBBOX.EXE Server</div>
        <div class="rc-feat-desc">22KB C# standalone HTTP server. No Node.js, no Python. Just run.</div>
      </div>
      <div class="rc-feat">
        <div class="rc-feat-icon">🛍️</div>
        <div class="rc-feat-title">Play Store Integration</div>
        <div class="rc-feat-desc">Chrome + Firefox + Userscript. Install APKs from any Play Store page.</div>
      </div>
      <div class="rc-feat">
        <div class="rc-feat-icon">📦</div>
        <div class="rc-feat-title">31+ Store Packages</div>
        <div class="rc-feat-desc">Games and apps via Play Store. All free, one-click download.</div>
      </div>
      <div class="rc-feat">
        <div class="rc-feat-icon">🥽</div>
        <div class="rc-feat-title">XR Headset Support</div>
        <div class="rc-feat-desc">Auto-detects VR apps. One-click install for Quest, Pico.</div>
      </div>
      <div class="rc-feat">
        <div class="rc-feat-icon">🎨</div>
        <div class="rc-feat-title">PS5-Inspired UI</div>
        <div class="rc-feat-desc">Dark minimal, horizontal scroll, glassmorphism, cyan accents.</div>
      </div>
      <div class="rc-feat">
        <div class="rc-feat-icon">👤</div>
        <div class="rc-feat-title">Multi-Profile</div>
        <div class="rc-feat-desc">Auth, friends, achievements, cloud sync, PIN protection.</div>
      </div>
    </div>

    <div class="rc-links">
      <a class="rc-link rc-link-primary" href="https://github.com/Rtech-Rqbbox-os/rqbbox-os" target="_blank">View on GitHub</a>
      <a class="rc-link rc-link-ghost" href="https://rtech-rqbbox-os.github.io/rqbbox-os/" target="_blank">Website</a>
      <a class="rc-link rc-link-ghost" href="https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html" target="_blank">Full Info Card</a>
      <a class="rc-link rc-link-ghost" href="https://www.youtube.com/@RQBBOX-REAL" target="_blank">YouTube</a>
    </div>

    <div class="rc-footer">
      <span>RQBBOX OS v2.0 &copy; 2026 RhysTech &bull; MIT License</span>
      <span>rqbbox-os.github.io</span>
    </div>
  `;

  const first = document.getElementById('search') || document.getElementById('rso') || document.querySelector('#main');
  if (first) first.insertBefore(card, first.firstChild);
})();
