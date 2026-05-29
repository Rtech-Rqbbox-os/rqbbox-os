// RQBBOX OS — Google Play Store Integration Module
// Server-side module: fetches Play Store app data and serves via API
//
// API Endpoints:
//   GET /api/play-store/app?id=<package-name>
//     - Returns app info from Google Play Store
//     - Caches results for 1 hour
//
//   GET /api/play-store/rqbbox-packages
//     - Returns all RQBBOX-supported Play Store packages
//     - Merged with live Play Store ratings/downloads
//
// Usage in server.js:
//   const playStore = require('./play-store');
//   app.get('/api/play-store/app', playStore.handleAppLookup);

const https = require('https');
const http = require('http');

// Cache: { [packageName]: { data, timestamp } }
const cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// RQBBOX-supported Google Play packages
const RQBBOX_PACKAGES = {
  // Games
  'com.activision.callofduty.shooter': { title: 'Call of Duty Mobile', category: 'FPS', rqbbox: true },
  'com.miHoYo.GenshinImpact': { title: 'Genshin Impact', category: 'RPG', rqbbox: true },
  'com.tencent.ig': { title: 'PUBG Mobile', category: 'FPS', rqbbox: true },
  'com.mojang.minecraftpe': { title: 'Minecraft', category: 'Sandbox', rqbbox: true },
  'com.gameloft.android.ANMP.GloftA9HM': { title: 'Asphalt 9', category: 'Racing', rqbbox: true },
  'com.roblox.client': { title: 'Roblox', category: 'Sandbox', rqbbox: true },
  'com.mobile.legends': { title: 'Mobile Legends', category: 'MOBA', rqbbox: true },
  'com.supercell.clashroyale': { title: 'Clash Royale', category: 'Strategy', rqbbox: true },
  'com.innersloth.spacemafia': { title: 'Among Us', category: 'Party', rqbbox: true },
  'com.epicgames.fortnite': { title: 'Fortnite', category: 'FPS', rqbbox: true },
  'com.riotgames.league.wildrift': { title: 'Wild Rift', category: 'MOBA', rqbbox: true },
  'com.kiloo.subwaysurf': { title: 'Subway Surfers', category: 'Arcade', rqbbox: true },

  // Apps
  'com.android.chrome': { title: 'Chrome', category: 'Browser', rqbbox: true },
  'com.termux': { title: 'Termux', category: 'Tool', rqbbox: true },
  'org.videolan.vlc': { title: 'VLC', category: 'Media', rqbbox: true },
  'org.fdroid.fdroid': { title: 'F-Droid', category: 'Store', rqbbox: true },
  'com.valvesoftware.steamlink': { title: 'Steam Link', category: 'Gaming', rqbbox: true },
  'com.limelight': { title: 'Moonlight', category: 'Gaming', rqbbox: true },
  'com.rarlab.rar': { title: 'ZArchiver', category: 'Tool', rqbbox: true },
  'com.joaomgcd.autonotification': { title: 'Tasker', category: 'Tool', rqbbox: true },
  'com.google.android.apps.maps': { title: 'Google Maps', category: 'Navigation', rqbbox: true },
  'com.whatsapp': { title: 'WhatsApp', category: 'Social', rqbbox: true },
  'com.instagram.android': { title: 'Instagram', category: 'Social', rqbbox: true },
  'com.snapchat.android': { title: 'Snapchat', category: 'Social', rqbbox: true },
  'org.telegram.messenger': { title: 'Telegram', category: 'Social', rqbbox: true },
  'com.microsoft.office.outlook': { title: 'Outlook', category: 'Productivity', rqbbox: true },
  'com.google.android.keep': { title: 'Google Keep', category: 'Productivity', rqbbox: true },
  'com.microsoft.office.officehubrow': { title: 'Microsoft 365', category: 'Productivity', rqbbox: true },
  'com.adobe.reader': { title: 'Adobe Reader', category: 'Productivity', rqbbox: true },
  'com.google.android.apps.photos': { title: 'Google Photos', category: 'Media', rqbbox: true },
  'com.touchtype.swiftkey.beta': { title: 'TikTok', category: 'Social', rqbbox: true },
};

function fetchPlayStoreData(packageName) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'play.google.com',
      path: `/store/apps/details?id=${encodeURIComponent(packageName)}&hl=en`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
  const result = {
    packageName,
    title: packageName,
    rating: null,
    downloads: null,
    size: null,
    description: '',
    icon: null
  };

  // Extract title
  const titleMatch = html.match(/<h1[^>]*itemprop="name"[^>]*>([\s\S]*?)<\/h1>/);
  if (titleMatch) result.title = titleMatch[1].replace(/<[^>]+>/g, '').trim();

  // Extract rating
  const ratingMatch = html.match(/itemprop="ratingValue"[^>]*content="([^"]+)"/);
  if (ratingMatch) result.rating = parseFloat(ratingMatch[1]);

  // Extract downloads
  const downloadMatch = html.match(/itemprop="numDownloads"[^>]*content="([^"]+)"/);
  if (downloadMatch) result.downloads = downloadMatch[1];

  // Extract description
  const descMatch = html.match(/itemprop="description"[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/);
  if (descMatch) {
    result.description = descMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 500);
  }

  // Extract icon
  const iconMatch = html.match(/<img[^>]*itemprop="image"[^>]*src="([^"]+)"/);
  if (iconMatch) result.icon = iconMatch[1];

  // Merge with RQBBOX data
  if (RQBBOX_PACKAGES[packageName]) {
    result.rqbbox = true;
    result.rqbboxTitle = RQBBOX_PACKAGES[packageName].title;
    result.category = RQBBOX_PACKAGES[packageName].category;
  } else {
    result.rqbbox = false;
  }

  return result;
}

async function handleAppLookup(req, res) {
  const pkg = req.query.id || '';
  if (!pkg) {
    return res.status(400).json({ error: 'Missing "id" query parameter (package name)' });
  }

  // Check cache
  const cached = cache[pkg];
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return res.json(cached.data);
  }

  try {
    const data = await fetchPlayStoreData(pkg);
    cache[pkg] = { data, timestamp: Date.now() };
    res.json(data);
  } catch (err) {
    // Return RQBBOX metadata as fallback
    const fallback = RQBBOX_PACKAGES[pkg] || { title: pkg, rqbbox: false };
    res.json({ packageName: pkg, ...fallback, rating: null, downloads: null, error: 'Could not fetch live data' });
  }
}

function handleListPackages(req, res) {
  const list = Object.entries(RQBBOX_PACKAGES).map(([id, data]) => ({
    packageName: id,
    ...data,
    playStoreUrl: `https://play.google.com/store/apps/details?id=${id}`
  }));
  res.json(list);
}

module.exports = {
  handleAppLookup,
  handleListPackages,
  RQBBOX_PACKAGES
};
