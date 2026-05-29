// RQBBOX OS — Google Play Store Integration Module
// Server-side module: fetches Play Store data, manages app installations
//
// Endpoints (routed via server.js):
//   GET /api/play-store/app?id=<package>
//   GET /api/play-store/packages
//   POST /api/play-store/install   — install app to RQBBOX
//   GET /api/play-store/installed   — list installed Play Store apps

const https = require('https');
const fs = require('fs');
const path = require('path');

const cache = {};
const CACHE_TTL = 60 * 60 * 1000;

const ROOT = path.resolve(__dirname, '..', '..');
const STORE_CATALOG = path.join(ROOT, 'Store', 'catalog', 'store.json');
const INSTALLED_FILE = path.join(ROOT, 'Store', 'catalog', 'play-store-installed.json');

const RQBBOX_PACKAGES = {
  'com.activision.callofduty.shooter': { title: 'Call of Duty Mobile', category: 'FPS', type: 'Game', icon: '🎯' },
  'com.miHoYo.GenshinImpact': { title: 'Genshin Impact', category: 'RPG', type: 'Game', icon: '⚔️' },
  'com.tencent.ig': { title: 'PUBG Mobile', category: 'FPS', type: 'Game', icon: '🎯' },
  'com.mojang.minecraftpe': { title: 'Minecraft', category: 'Sandbox', type: 'Game', icon: '🏗️' },
  'com.gameloft.android.ANMP.GloftA9HM': { title: 'Asphalt 9', category: 'Racing', type: 'Game', icon: '🏎️' },
  'com.roblox.client': { title: 'Roblox', category: 'Sandbox', type: 'Game', icon: '🏗️' },
  'com.mobile.legends': { title: 'Mobile Legends', category: 'MOBA', type: 'Game', icon: '⚔️' },
  'com.supercell.clashroyale': { title: 'Clash Royale', category: 'Strategy', type: 'Game', icon: '🛡️' },
  'com.innersloth.spacemafia': { title: 'Among Us', category: 'Party', type: 'Game', icon: '🎭' },
  'com.epicgames.fortnite': { title: 'Fortnite', category: 'FPS', type: 'Game', icon: '🎯' },
  'com.riotgames.league.wildrift': { title: 'Wild Rift', category: 'MOBA', type: 'Game', icon: '⚔️' },
  'com.kiloo.subwaysurf': { title: 'Subway Surfers', category: 'Arcade', type: 'Game', icon: '🏃' },
  'com.android.chrome': { title: 'Google Chrome', category: 'Browser', type: 'App', icon: '🌐' },
  'com.termux': { title: 'Termux', category: 'Tool', type: 'App', icon: '💻' },
  'org.videolan.vlc': { title: 'VLC Media Player', category: 'Media', type: 'App', icon: '📺' },
  'org.fdroid.fdroid': { title: 'F-Droid', category: 'Store', type: 'App', icon: '📦' },
  'com.valvesoftware.steamlink': { title: 'Steam Link', category: 'Gaming', type: 'App', icon: '🎮' },
  'com.limelight': { title: 'Moonlight', category: 'Gaming', type: 'App', icon: '🎮' },
  'com.rarlab.rar': { title: 'ZArchiver', category: 'Tool', type: 'App', icon: '🗜️' },
  'com.joaomgcd.autonotification': { title: 'Tasker', category: 'Tool', type: 'App', icon: '⚡' },
  'com.google.android.apps.maps': { title: 'Google Maps', category: 'Navigation', type: 'App', icon: '🗺️' },
  'com.whatsapp': { title: 'WhatsApp', category: 'Social', type: 'App', icon: '💬' },
  'com.instagram.android': { title: 'Instagram', category: 'Social', type: 'App', icon: '📸' },
  'com.snapchat.android': { title: 'Snapchat', category: 'Social', type: 'App', icon: '👻' },
  'org.telegram.messenger': { title: 'Telegram', category: 'Social', type: 'App', icon: '✈️' },
  'com.microsoft.office.outlook': { title: 'Outlook', category: 'Productivity', type: 'App', icon: '📧' },
  'com.google.android.keep': { title: 'Google Keep', category: 'Productivity', type: 'App', icon: '📝' },
  'com.microsoft.office.officehubrow': { title: 'Microsoft 365', category: 'Productivity', type: 'App', icon: '📊' },
  'com.adobe.reader': { title: 'Adobe Reader', category: 'Productivity', type: 'App', icon: '📄' },
  'com.google.android.apps.photos': { title: 'Google Photos', category: 'Media', type: 'App', icon: '🖼️' },
  'com.zhiliaoapp.musically': { title: 'TikTok', category: 'Social', type: 'App', icon: '🎵' }
};

function readInstalled() {
  try {
    if (fs.existsSync(INSTALLED_FILE)) {
      return JSON.parse(fs.readFileSync(INSTALLED_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function writeInstalled(list) {
  try {
    fs.mkdirSync(path.dirname(INSTALLED_FILE), { recursive: true });
    fs.writeFileSync(INSTALLED_FILE, JSON.stringify(list, null, 2));
  } catch (e) {
    console.error('Failed to write installed list:', e.message);
  }
}

function fetchPlayStoreData(packageName) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'play.google.com',
      path: `/store/apps/details?id=${encodeURIComponent(packageName)}&hl=en`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000
    };
    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(parsePlayStoreHTML(data, packageName)));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parsePlayStoreHTML(html, packageName) {
  const result = { packageName, title: packageName, rating: null, downloads: null, icon: null };
  const m1 = html.match(/<h1[^>]*itemprop="name"[^>]*>([\s\S]*?)<\/h1>/);
  if (m1) result.title = m1[1].replace(/<[^>]+>/g, '').trim();
  const m2 = html.match(/itemprop="ratingValue"[^>]*content="([^"]+)"/);
  if (m2) result.rating = parseFloat(m2[1]);
  const m3 = html.match(/itemprop="numDownloads"[^>]*content="([^"]+)"/);
  if (m3) result.downloads = m3[1];
  const m4 = html.match(/<img[^>]*itemprop="image"[^>]*src="([^"]+)"/);
  if (m4) result.icon = m4[1];
  if (RQBBOX_PACKAGES[packageName]) {
    result.rqbbox = true;
    result.rqbboxTitle = RQBBOX_PACKAGES[packageName].title;
    result.category = RQBBOX_PACKAGES[packageName].category;
    result.type = RQBBOX_PACKAGES[packageName].type;
  } else {
    result.rqbbox = false;
  }
  return result;
}

// Handler: GET /api/play-store/app?id=xxx
async function handleAppLookup(req, res) {
  const pkg = req.query.id || '';
  if (!pkg) return { status: 400, body: { error: 'Missing id parameter' } };
  const cached = cache[pkg];
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) return { body: cached.data };
  try {
    const data = await fetchPlayStoreData(pkg);
    cache[pkg] = { data, timestamp: Date.now() };
    return { body: data };
  } catch {
    const fallback = RQBBOX_PACKAGES[pkg] || { title: pkg, rqbbox: false };
    return { body: { packageName: pkg, ...fallback } };
  }
}

// Handler: GET /api/play-store/packages
function handleListPackages() {
  const list = Object.entries(RQBBOX_PACKAGES).map(([id, data]) => ({
    packageName: id, ...data,
    playStoreUrl: `https://play.google.com/store/apps/details?id=${id}`
  }));
  return { body: list };
}

// Handler: POST /api/play-store/install
// Body: { id: "com.example.app" }
// Installs a Play Store app to RQBBOX
function handleInstall(body) {
  const pkg = (body && body.id) || '';
  if (!pkg) return { status: 400, body: { ok: false, error: 'Missing app id' } };

  const meta = RQBBOX_PACKAGES[pkg];
  if (!meta) return { status: 400, body: { ok: false, error: 'Unsupported package: ' + pkg } };

  const installed = readInstalled();
  // Check if already installed
  if (installed.some(i => i.packageName === pkg)) {
    return { body: { ok: true, message: meta.title + ' is already installed', alreadyInstalled: true, playStoreUrl: `https://play.google.com/store/apps/details?id=${pkg}` } };
  }

  const entry = {
    packageName: pkg,
    title: meta.title,
    category: meta.category,
    type: meta.type,
    icon: meta.icon,
    installedAt: new Date().toISOString(),
    playStoreUrl: `https://play.google.com/store/apps/details?id=${pkg}`,
    rqbboxUrl: `/play/${pkg}`
  };

  installed.push(entry);
  writeInstalled(installed);

  return {
    body: {
      ok: true,
      message: meta.title + ' added to RQBBOX OS! Opening Play Store for download...',
      entry: entry,
      playStoreUrl: entry.playStoreUrl
    }
  };
}

// Handler: GET /api/play-store/installed
function handleListInstalled() {
  return { body: { ok: true, installed: readInstalled(), count: readInstalled().length } };
}

module.exports = {
  handleAppLookup,
  handleListPackages,
  handleInstall,
  handleListInstalled,
  RQBBOX_PACKAGES
};
