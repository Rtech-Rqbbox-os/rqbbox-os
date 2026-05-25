// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToSection(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }

// Mobile menu
function toggleMobileMenu() {
  const links = document.getElementById('navLinks');
  const isVisible = links.style.display === 'flex';
  links.style.display = isVisible ? 'none' : 'flex';
  if (!isVisible) {
    links.style.position = 'absolute';
    links.style.top = '64px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.flexDirection = 'column';
    links.style.background = 'rgba(5,8,16,0.98)';
    links.style.padding = '16px';
    links.style.borderBottom = '1px solid var(--border)';
    links.style.zIndex = '999';
  }
}

// Reveal animations
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  if (document.getElementById('website-device-list')) loadWebsiteDevices();
  checkServer();
  // Restore auth UI from saved session
  const savedUser = localStorage.getItem('rqbbox_user');
  if (savedUser) { try { updateAuthUI(JSON.parse(savedUser)); } catch {} }
  // Re-check devices and server every 30s
  if (document.getElementById('status-server')) loadSystemStatus();
  setInterval(() => {
    if (document.getElementById('website-device-list')) loadWebsiteDevices();
    checkServer();
    if (document.getElementById('status-server')) loadSystemStatus();
  }, 30000);
});

// Modals
let currentModal = null;

function openModal(type) {
  const overlay = document.getElementById(`${type}-modal`);
  if (overlay) { overlay.classList.add('active'); currentModal = type; document.body.style.overflow = 'hidden'; }
}

function closeModal(type) {
  const overlay = document.getElementById(`${type}-modal`);
  if (overlay) { overlay.classList.remove('active'); currentModal = null; document.body.style.overflow = ''; }
}

function switchModal(type) { if (currentModal) closeModal(currentModal); openModal(type); }

document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) closeModal(el.id.replace('-modal', '')); });
});

document.addEventListener('keydown', e => { if (e.key === 'Escape' && currentModal) closeModal(currentModal); });

// FAQ toggle
function toggleFAQ(el) { el.parentElement.classList.toggle('open'); }

// API helpers — relative to server (website is now served from /website/ on the RQBBOX server)
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  return res.json();
}

// Server connection check
async function checkServer() {
  const el = document.querySelector('.status');
  if (!el) return;
  try {
    const res = await fetch('/api/storage', { signal: AbortSignal.timeout(3000) });
    if (res.ok) { el.textContent = '🟢 Server connected'; el.style.color = '#00ffc8'; }
    else { el.textContent = '🔴 Server offline'; el.style.color = '#ff6b6b'; }
  } catch {
    el.textContent = '🔴 Server offline — start RQBBOX server';
    el.style.color = '#ff6b6b';
  }
}

// Sign In
async function signIn(event) {
  event.preventDefault();
  const errEl = document.getElementById('signin-error');
  errEl.style.display = 'none';

  const username = document.getElementById('signin-user').value.trim();
  const password = document.getElementById('signin-pass').value;

  if (!username) { showError(errEl, 'Please enter your username'); return; }

  const result = await api('POST', '/api/auth', { username, password });
  if (result.ok) {
    closeModal('signin');
    // Store session token
    if (result.token) localStorage.setItem('rqbbox_token', result.token);
    if (result.user) localStorage.setItem('rqbbox_user', JSON.stringify(result.user));
    showToast(`Welcome back, ${result.user.name}!`);
    updateAuthUI(result.user);
  } else {
    showError(errEl, result.error || 'Invalid credentials');
  }
}

// Sign Up
async function signUp(event) {
  event.preventDefault();
  const errEl = document.getElementById('signup-error');
  errEl.style.display = 'none';

  const name = document.getElementById('signup-name').value.trim();
  const username = document.getElementById('signup-user').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-pass').value;

  if (!name || !username) { showError(errEl, 'Please fill in all fields'); return; }
  if (password && password.length < 4) { showError(errEl, 'Password must be at least 4 characters'); return; }

  const result = await api('POST', '/api/register', { name, username, email, password });
  if (result.ok) {
    closeModal('signup');
    if (result.token) {
      localStorage.setItem('rqbbox_token', result.token);
      localStorage.setItem('rqbbox_user', JSON.stringify(result.user));
      updateAuthUI(result.user);
    }
    showToast(`Welcome, ${result.user.name}! Profile created.`);
  } else {
    showError(errEl, result.error || 'Registration failed');
  }
}

function showError(el, msg) { el.textContent = msg; el.style.display = 'block'; }

// Download handler
function downloadOS(platform) {
  const base = window.location.origin;
  const downloads = {
    'windows': { url: `${base}/downloads/rqbbox-windows.zip`, label: 'Windows Portable ZIP' },
    'windows-exe': { url: `${base}/downloads/rqbbox-windows.exe`, label: 'Windows EXE' },
    'macos': { url: `${base}/downloads/rqbbox-macos.tar.gz`, label: 'macOS Archive' },
    'linux': { url: `${base}/downloads/rqbbox-linux.tar.gz`, label: 'Linux Archive' },
    'chromeos': { url: `${base}/downloads/rqbbox-linux.tar.gz`, label: 'ChromeOS Linux Archive' },
    'android': { url: `${base}/downloads/rqbbox-android.apk`, label: 'Android APK' },
    'android-pwa': { url: null, label: 'Android PWA', info: 'Open the USB server IP in Chrome → Add to Home Screen' },
    'androidtv': { url: `${base}/downloads/rqbbox-androidtv.apk`, label: 'Android TV APK' },
    'ios': { url: null, label: 'iOS PWA', info: 'Open this page in Safari → tap Share → Add to Home Screen → fullscreen RQBBOX launcher' },
    'appletv': { url: null, label: 'Apple TV', info: 'Open Safari on Apple TV and navigate to http://[USB Server IP]:19777/tv/' },
    'browser': { url: null, label: 'Browser Access', info: 'From any device on your LAN, navigate to http://[USB Server IP]:19777/' },
    'usb': { url: `${base}/downloads/rqbbox-usb-image.zip`, label: 'USB Image ZIP' },
  };

  const dl = downloads[platform];
  if (!dl) { showToast('Download not available'); return; }

  if (dl.url) {
    window.open(dl.url, '_blank');
    showToast(`Downloading ${dl.label}...`);
  } else if (dl.info) {
    showToast(dl.info);
  }
}

// Toast notifications
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(10,14,26,0.95)', color: '#e8f0ff', padding: '14px 28px',
    borderRadius: 'var(--radius-md, 14px)', border: '1px solid rgba(0,212,255,0.3)',
    boxShadow: '0 0 30px rgba(0,212,255,0.2)', zIndex: '10001',
    fontSize: '.9rem', animation: 'slideUp 0.3s ease',
    backdropFilter: 'blur(10px)',
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// Auth UI state
function updateAuthUI(user) {
  const signInBtns = document.querySelectorAll('.btn-nav');
  const signUpBtns = document.querySelectorAll('.btn-nav-primary');
  if (user) {
    signInBtns.forEach(b => { if (!b.classList.contains('btn-nav-primary')) { b.textContent = `👤 ${user.name}`; b.onclick = () => signOut(); } });
    signUpBtns.forEach(b => { b.textContent = 'Sign Out'; b.onclick = () => signOut(); });
  } else {
    signInBtns.forEach(b => { if (!b.classList.contains('btn-nav-primary')) { b.textContent = 'Sign In'; b.onclick = () => openModal('signin'); } });
    signUpBtns.forEach(b => { b.textContent = 'Get Started Free'; b.onclick = () => openModal('signup'); });
  }
}

// Initialization runs from the main DOMContentLoaded handler above

// Load connected devices on the website
async function loadWebsiteDevices() {
  const list = document.getElementById('website-device-list');
  if (!list) return;
  try {
    const res = await fetch('/api/device');
    const data = await res.json();
    if (data.ok && data.devices?.length) {
      list.innerHTML = data.devices.map(d => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <span style="font-size:1.5rem;">💻</span>
          <div style="flex:1;"><strong style="font-size:.9rem;">${d.name || d.label || 'USB Drive'}</strong>
          <div style="font-size:.75rem;color:var(--text-muted);display:flex;gap:8px;flex-wrap:wrap;">
            <span>${d.platform || ''}</span>
            <span>${d.totalGB ? d.totalGB + 'GB' : ''}</span>
            <span>${d.type || 'USB'}</span>
            <span>${d.screen || ''}</span>
          </div></div>
          <span style="font-size:.7rem;color:var(--text-muted);white-space:nowrap;">${d.lastSeen ? new Date(d.lastSeen).toLocaleDateString() : ''}</span>
        </div>
      `).join('');
    } else {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.85rem;">No devices registered yet. Plug in your RQBBOX USB and sign in to register.</p>';
    }
  } catch {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:.85rem;">🔌 RQBBOX server not detected. Start the server on your USB to see connected devices.</p>';
  }
}

// Store tab switching
function switchStoreTab(tab, btn) {
  document.querySelectorAll('.store-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('store-grid');
  const items = {
    games: [
      {icon:'🏎️', name:'Neon Drift Racing', desc:'High-speed neon racing', tag:'Racing'},
      {icon:'🌍', name:'Void Craft Sandbox', desc:'Build & explore worlds', tag:'Sandbox'},
      {icon:'⚔️', name:'Pixel Quest', desc:'Retro adventure', tag:'Adventure'},
      {icon:'🚀', name:'Star Fighter X', desc:'Epic space combat', tag:'3D'},
      {icon:'🕹️', name:'Retro Zone', desc:'Classic emulator', tag:'Emulator'},
      {icon:'🎮', name:'Cube Runner 3D', desc:'Fast-paced platformer', tag:'3D'}
    ],
    apps: [
      {icon:'🌐', name:'RQB Browser', desc:'Portable web browser', tag:'Utility'},
      {icon:'🎬', name:'Media Hub', desc:'Video & music player', tag:'Media'},
      {icon:'🎵', name:'Music Wave', desc:'Music player + visualizer', tag:'Media'},
      {icon:'📝', name:'Notes Pro', desc:'Quick notes & markdown', tag:'Productivity'},
      {icon:'🎨', name:'AI Image Studio', desc:'AI image generation', tag:'AI'},
      {icon:'🤖', name:'RQB Assistant', desc:'AI chat assistant', tag:'AI'}
    ],
    webapps: [
      {icon:'📺', name:'YouTube', desc:'Watch & stream videos', tag:'Streaming'},
      {icon:'🎬', name:'Netflix', desc:'Movies & TV shows', tag:'Streaming'},
      {icon:'🎵', name:'Spotify', desc:'Music & podcasts', tag:'Streaming'},
      {icon:'📡', name:'Twitch', desc:'Live game streams', tag:'Streaming'},
      {icon:'💬', name:'Reddit', desc:'Communities & discussions', tag:'Social'},
      {icon:'🐦', name:'X / Twitter', desc:'News & conversations', tag:'Social'},
      {icon:'💎', name:'Discord', desc:'Gaming chat & voice', tag:'Social'},
      {icon:'📚', name:'Wikipedia', desc:'Free encyclopedia', tag:'Reference'},
      {icon:'📧', name:'Gmail', desc:'Email by Google', tag:'Productivity'},
      {icon:'☁️', name:'Google Drive', desc:'Cloud storage & docs', tag:'Productivity'},
      {icon:'💻', name:'GitHub', desc:'Code hosting & dev', tag:'Developer'},
      {icon:'📋', name:'Stack Overflow', desc:'Developer Q&A', tag:'Developer'}
    ],
    themes: [
      {icon:'🌙', name:'Cyber Dark', desc:'Dark neon theme', tag:'Theme'},
      {icon:'☀️', name:'Neon Light', desc:'Light cyber theme', tag:'Theme'},
      {icon:'🟣', name:'Synthwave', desc:'Purple retro theme', tag:'Theme'}
    ],
    plugins: [
      {icon:'📊', name:'FPS Overlay', desc:'Real-time FPS counter', tag:'Performance'},
      {icon:'🎮', name:'Controller Mapper', desc:'Custom key bindings', tag:'Input'},
      {icon:'🔊', name:'Audio Visualizer', desc:'Live audio bars', tag:'Media'}
    ]
  };
  const data = items[tab] || items.webapps;
  grid.innerHTML = data.map(i => `
    <div class="store-item">
      <div class="store-item-banner">${i.icon}</div>
      <div class="store-item-body">
        <h4>${i.name}</h4>
        <p class="store-item-desc">${i.desc}</p>
        <span class="store-item-tag">${i.tag}</span>
      </div>
    </div>
  `).join('');
}

// Sign out
// Load system status
async function loadSystemStatus() {
  try {
    const res = await fetch('/api/status/all', { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    if (!data.ok) throw new Error('Failed');
    const s = data.system || {};
    const n = data.network || {};
    const b = data.battery || {};
    const bt = data.bluetooth || {};
    const ctrl = data.controller || {};
    const st = data.storage || {};

    const formatUptime = v => { const d = Math.floor(v / 86400); const h = Math.floor((v % 86400) / 3600); const m = Math.floor((v % 3600) / 60); return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`; };

    const update = (id, val) => { const el = document.getElementById(id); if (el) el.querySelector('.status-value').textContent = val ?? '--'; };

    update('status-server', 'Online');
    update('status-uptime', formatUptime(s.serverUptime || 0));
    update('status-platform', s.platform || '--');
    update('status-cpu', s.cpuModel ? `${s.cpuCores} cores` : '--');
    update('status-memory', s.memoryPct != null ? `${s.memoryPct}% used` : '--');
    update('status-node', s.nodeVersion || '--');
    update('status-host', s.hostname || '--');
    update('status-port', String(s.serverPort || '19777'));

    // Battery
    const batEl = document.getElementById('status-battery');
    if (batEl) {
      if (b.present) {
        batEl.querySelector('.status-value').textContent = `${b.level}% ${b.charging ? '⚡' : ''}`;
        batEl.querySelector('.status-label').textContent = 'Battery';
      } else {
        batEl.querySelector('.status-value').textContent = 'AC Power';
        batEl.querySelector('.status-label').textContent = 'Power';
      }
    }

    // Network
    const netEl = document.getElementById('status-wifi');
    if (netEl) {
      netEl.querySelector('.status-value').textContent = n.ssid ? n.ssid : (n.connected ? 'Connected' : 'Disconnected');
      netEl.querySelector('.status-label').textContent = n.ssid ? `WiFi (${n.signal}%)` : 'Network';
    }

    // Bluetooth
    const btEl = document.getElementById('status-bluetooth');
    if (btEl) {
      btEl.querySelector('.status-value').textContent = bt.enabled ? `ON (${bt.count} devices)` : 'OFF';
      btEl.querySelector('.status-label').textContent = 'Bluetooth';
    }

    // Controller
    const ctrlEl = document.getElementById('status-controller');
    if (ctrlEl) {
      ctrlEl.querySelector('.status-value').textContent = ctrl.connected ? `${ctrl.count} connected` : 'None';
      ctrlEl.querySelector('.status-label').textContent = 'Controller';
    }

    // Storage
    const stgEl = document.getElementById('status-storage');
    if (stgEl) {
      stgEl.querySelector('.status-value').textContent = st.freeGB ? `${st.freeGB} GB free` : '--';
      stgEl.querySelector('.status-label').textContent = 'USB Free';
    }

  } catch {
    document.querySelectorAll('.status-card').forEach(el => {
      el.querySelector('.status-value').textContent = 'Offline';
    });
  }
}

// QR Code for Website
function showQR(text, title) {
  let overlay = document.getElementById('qr-overlay-website');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'qr-overlay-website';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(5,8,16,0.92);display:none;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
    overlay.innerHTML = `<div style="background:#0a0e1a;border:1px solid rgba(0,212,255,0.2);border-radius:20px;padding:32px;text-align:center;max-width:340px;width:90%;">
      <div id="qr-w-title" style="font-size:1.1rem;font-weight:700;margin-bottom:4px;color:#e8f0ff;"></div>
      <div id="qr-w-sub" style="font-size:.8rem;color:#8b9dc3;margin-bottom:16px;"></div>
      <div id="qr-w-img" style="display:flex;justify-content:center;margin-bottom:16px;min-height:200px;align-items:center;"></div>
      <button onclick="document.getElementById('qr-overlay-website').style.display='none'" style="background:transparent;border:1px solid rgba(255,255,255,0.1);color:#8b9dc3;padding:10px 28px;border-radius:14px;font-size:.9rem;cursor:pointer;font-family:inherit;">Close</button>
    </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.style.display = 'none'; });
  }
  document.getElementById('qr-w-title').textContent = title || 'RQBBOX OS';
  document.getElementById('qr-w-sub').textContent = text;
  const imgContainer = document.getElementById('qr-w-img');
  imgContainer.innerHTML = '<span style="color:#5a6a8a;">Generating...</span>';
  const img = new Image();
  img.onload = () => { imgContainer.innerHTML = ''; imgContainer.appendChild(img); };
  img.onerror = () => { imgContainer.innerHTML = '<span style="color:#ff6b6b;">Could not load QR</span>'; };
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  img.style.cssText = 'border-radius:12px;max-width:100%;';
  overlay.style.display = 'flex';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const o = document.getElementById('qr-overlay-website');
    if (o) o.style.display = 'none';
  }
});

async function signOut() {
  const token = localStorage.getItem('rqbbox_token');
  if (token) await api('POST', '/api/signout', { token });
  localStorage.removeItem('rqbbox_token');
  localStorage.removeItem('rqbbox_user');
  updateAuthUI(null);
  showToast('Signed out');
}
