(() => {
  const q = new URLSearchParams(window.location.search).get('q') || '';
  if (!q.toLowerCase().includes('rqbbox')) return;

  const logoSvg = `<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0a0e1a" stroke="url(#g)" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-size="52" font-weight="800" fill="url(#g)" font-family="Segoe UI, sans-serif">R</text><defs><linearGradient id="g"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#9d4edd"/></linearGradient></defs></svg>`;

  const card = document.createElement('div');
  card.className = 'rqbbox-kp';
  card.innerHTML = `
    <div class="kp-title">RQBBOX OS</div>
    <div class="kp-category">Operating system</div>

    <div class="kp-images">
      <div class="kp-img kp-img-1">${logoSvg}</div>
      <div class="kp-img kp-img-2">
        <svg viewBox="0 0 200 100"><rect width="200" height="100" rx="8" fill="#0d1117"/><rect x="10" y="10" width="180" height="60" rx="4" fill="#161b22" stroke="#00d4ff" stroke-width=".5" opacity=".4"/><text x="100" y="48" text-anchor="middle" font-size="14" fill="#00d4ff" font-family="Segoe UI" opacity=".6">Play Store</text><text x="100" y="82" text-anchor="middle" font-size="9" fill="#9aa0a6" font-family="Segoe UI">Chrome Extension</text></svg>
      </div>
      <div class="kp-img kp-img-3">
        <svg viewBox="0 0 200 100"><rect width="200" height="100" rx="8" fill="#161b22"/><rect x="10" y="10" width="180" height="60" rx="4" fill="#1a1e2e" stroke="#9d4edd" stroke-width=".5" opacity=".4"/><text x="100" y="48" text-anchor="middle" font-size="14" fill="#9d4edd" font-family="Segoe UI" opacity=".6">RQBBOX.EXE</text><text x="100" y="82" text-anchor="middle" font-size="9" fill="#9aa0a6" font-family="Segoe UI">22KB Standalone Server</text></svg>
      </div>
    </div>

    <div class="kp-desc">
      <strong>RQBBOX OS</strong> is a portable USB-based gaming operating system developed by <strong>RhysTech</strong>. It runs entirely from a USB drive without installation, emulation, or rebooting. The system includes Google Play Store integration via browser extensions, a standalone 22KB C# HTTP server (RQBBOX.EXE), XR headset support, and access to 31+ store packages. It is available in three editions: Lite, Pro, and Creator.
    </div>

    <div class="kp-source">Source: <a href="https://github.com/Rtech-Rqbbox-os/rqbbox-os" target="_blank">GitHub</a></div>

    <div class="kp-info">
      <div class="kp-info-row">
        <div class="kp-info-label">Initial release date</div>
        <div class="kp-info-value">2026</div>
      </div>
      <div class="kp-info-row">
        <div class="kp-info-label">Latest release</div>
        <div class="kp-info-value">v2.0 / May 2026</div>
      </div>
      <div class="kp-info-row">
        <div class="kp-info-label">Developer</div>
        <div class="kp-info-value">RhysTech</div>
      </div>
      <div class="kp-info-row">
        <div class="kp-info-label">Written in</div>
        <div class="kp-info-value">JavaScript, C#, PowerShell</div>
      </div>
      <div class="kp-info-row">
        <div class="kp-info-label">OS family</div>
        <div class="kp-info-value">RQBBOX</div>
      </div>
      <div class="kp-info-row">
        <div class="kp-info-label">Platforms</div>
        <div class="kp-info-value">Windows, macOS, Linux, Android, iOS</div>
      </div>
      <div class="kp-info-row">
        <div class="kp-info-label">License</div>
        <div class="kp-info-value"><a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a></div>
      </div>
      <div class="kp-info-row">
        <div class="kp-info-label">Website</div>
        <div class="kp-info-value"><a href="https://rtech-rqbbox-os.github.io/rqbbox-os/" target="_blank">rtech-rqbbox-os.github.io</a></div>
      </div>
    </div>

    <div class="kp-links">
      <a class="kp-link kp-link-primary" href="https://github.com/Rtech-Rqbbox-os/rqbbox-os" target="_blank">View on GitHub</a>
      <a class="kp-link" href="https://rtech-rqbbox-os.github.io/rqbbox-os/" target="_blank">Website</a>
      <a class="kp-link" href="https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html" target="_blank">Info Card</a>
      <a class="kp-link" href="https://www.youtube.com/@RQBBOX-REAL" target="_blank">YouTube</a>
    </div>
  `;

  const rso = document.getElementById('rso') || document.getElementById('search') || document.querySelector('#main');
  if (rso) rso.insertBefore(card, rso.firstChild);
})();
