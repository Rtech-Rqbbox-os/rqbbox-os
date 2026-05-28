// RQBBOX OS — Google Search Info Card Injector
// Runs on google.com search results pages
// Detects searches for RQBBOX OS and injects a knowledge panel

const RQBBOX = {
  name: 'RQBBOX OS',
  version: '1.2.0',
  tagline: 'Portable USB Gaming Operating System',
  author: 'RhysTech',
  url: 'https://rtech-rqbbox-os.github.io/rqbbox-os',
  repo: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
  downloads: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
  infoCard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
  email: 'rqbbox.support@groups.outlook.com',
  youtube: 'https://www.youtube.com/@RQBBOX-REAL',
  platforms: ['Windows', 'macOS', 'Linux', 'Android', 'iOS', 'KaiOS'],
  features: [
    { icon: '🎮', label: '6 Native Games', desc: 'Racing, platformer, shooter, sandbox, indie' },
    { icon: '🛒', label: '43+ Packages', desc: 'Store + full Google Play integration' },
    { icon: '🎨', label: 'PS5-Inspired UI', desc: 'Dark minimal, glassmorphism, horizontal scroll' },
    { icon: '🔊', label: 'Pro Audio Engine', desc: '40+ synth sounds, 5 profiles, DSP effects' },
    { icon: '📱', label: 'Phone Bootloader', desc: 'Auto-detect brand, PWA setup guides' },
    { icon: '👤', label: 'Multi-User', desc: 'Auth, friends, achievements, cloud sync' },
    { icon: '🔌', label: 'Plugin Engine', desc: 'JS plugins, CSS themes, SDK, dev tools' },
    { icon: '📊', label: 'Hardware Monitor', desc: 'Battery, WiFi, Bluetooth, storage stats' }
  ],
  editions: [
    { name: 'Lite', gameLimit: '10 max', appLimit: '5 max', cloud: '—', sdk: '—' },
    { name: 'Pro', gameLimit: 'Unlimited', appLimit: 'Unlimited', cloud: '✓', sdk: '—' },
    { name: 'Creator', gameLimit: 'Unlimited', appLimit: 'Unlimited', cloud: '✓', sdk: '✓' }
  ]
};

function isRQBBOXSearch() {
  const q = new URLSearchParams(window.location.search).get('q') || '';
  return q.toLowerCase().includes('rqbbox');
}

function createInfoCard() {
  const card = document.createElement('div');
  card.id = 'rqbbox-knowledge-card';
  card.style.cssText = [
    'background:rgba(20,22,28,.95)',
    'backdrop-filter:blur(24px) saturate(1.3)',
    '-webkit-backdrop-filter:blur(24px) saturate(1.3)',
    'border:1px solid rgba(255,255,255,.08)',
    'border-radius:16px',
    'padding:20px',
    'margin:16px 0',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    'color:#fff',
    'box-shadow:0 20px 60px rgba(0,0,0,.8)',
    'position:relative',
    'overflow:hidden',
    'max-width:652px'
  ].join(';');

  card.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
      <svg width="48" height="48" viewBox="0 0 100 100" style="flex-shrink:0;border-radius:12px">
        <rect width="100" height="100" rx="20" fill="#0a0e1a" stroke="url(#rqbox-lg)" stroke-width="2"/>
        <text x="50" y="66" text-anchor="middle" font-size="52" font-weight="800" fill="url(#rqbox-lg)" font-family="Segoe UI">R</text>
        <defs><linearGradient id="rqbox-lg"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#9d4edd"/></linearGradient></defs>
      </svg>
      <div>
        <div style="font-size:1.2rem;font-weight:700">${RQBBOX.name}</div>
        <div style="font-size:.75rem;color:rgba(255,255,255,.4)">${RQBBOX.tagline} by ${RQBBOX.author}</div>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">
      <span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:.65rem;color:#00d4ff;text-transform:uppercase">v${RQBBOX.version}</span>
      <span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:.65rem;color:#00d4ff;text-transform:uppercase">Open Source</span>
      <span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:.65rem;color:#00d4ff;text-transform:uppercase">Free</span>
      <span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:.65rem;color:#00d4ff;text-transform:uppercase">PS5 UI</span>
    </div>
    <div style="font-size:.82rem;line-height:1.6;color:rgba(255,255,255,.55);margin-bottom:14px">
      A portable USB-based gaming OS that runs entirely from a USB drive without installation.
      Features a PS5-inspired interface, pro audio engine, 43+ store packages, and phone bootloader.
      Works on ${RQBBOX.platforms.join(', ')}.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:14px">
      ${RQBBOX.features.map(f => `
        <div style="padding:6px 8px;border-radius:6px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);font-size:.7rem;color:rgba(255,255,255,.5)">
          <strong style="color:rgba(255,255,255,.7)">${f.icon} ${f.label}</strong> &bull; ${f.desc}
        </div>
      `).join('')}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      <a href="${RQBBOX.downloads}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.78rem;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.2)">⬇ Download</a>
      <a href="${RQBBOX.repo}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.78rem;font-weight:600;text-decoration:none;background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">GitHub</a>
      <a href="${RQBBOX.infoCard}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.78rem;font-weight:600;text-decoration:none;background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">Info Card</a>
    </div>
    <div style="padding-top:10px;border-top:1px solid rgba(255,255,255,.04);font-size:.65rem;color:rgba(255,255,255,.25);display:flex;justify-content:space-between;flex-wrap:wrap">
      <span>&copy; 2026 ${RQBBOX.author} &bull; MIT License</span>
      <span style="display:flex;gap:8px">
        <a href="${RQBBOX.youtube}" target="_blank" style="color:rgba(0,212,255,.4);text-decoration:none">YouTube</a>
        <a href="mailto:${RQBBOX.email}" style="color:rgba(0,212,255,.4);text-decoration:none">Support</a>
      </span>
    </div>
  `;
  return card;
}

function injectCard() {
  if (!isRQBBOXSearch() || document.getElementById('rqbbox-knowledge-card')) return;

  const target = document.querySelector('#search') || document.querySelector('#rcnt') || document.querySelector('#main');
  if (!target) { setTimeout(injectCard, 500); return; }

  const card = createInfoCard();
  const rhs = document.querySelector('#rhs');
  if (rhs) {
    rhs.prepend(card);
  } else if (target) {
    target.prepend(card);
  }
}

// Watch for dynamic search result loading (Google uses JS routing)
const observer = new MutationObserver(() => {
  if (isRQBBOXSearch() && !document.getElementById('rqbbox-knowledge-card')) {
    injectCard();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectCard);
} else {
  injectCard();
}
