const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const cache = {};
const CACHE_TTL = 60 * 60 * 1000;

const ROOT = path.resolve(__dirname, '..', '..');
const STORE_CATALOG = path.join(ROOT, 'Store', 'catalog', 'store.json');
const INSTALLED_FILE = path.join(ROOT, 'Store', 'catalog', 'play-store-installed.json');
const DOWNLOADS_DIR = path.join(ROOT, 'Store', 'downloads');
const DOWNLOADS_INDEX = path.join(DOWNLOADS_DIR, 'index.json');

const RQBBOX_PACKAGES = {
  'com.activision.callofduty.shooter': { title: 'Call of Duty Mobile', category: 'FPS', type: 'Game', icon: '🎯', package: 'com.activision.callofduty.shooter' },
  'com.miHoYo.GenshinImpact': { title: 'Genshin Impact', category: 'RPG', type: 'Game', icon: '⚔️', package: 'com.miHoYo.GenshinImpact' },
  'com.tencent.ig': { title: 'PUBG Mobile', category: 'FPS', type: 'Game', icon: '🎯', package: 'com.tencent.ig' },
  'com.mojang.minecraftpe': { title: 'Minecraft', category: 'Sandbox', type: 'Game', icon: '🏗️', package: 'com.mojang.minecraftpe' },
  'com.gameloft.android.ANMP.GloftA9HM': { title: 'Asphalt 9', category: 'Racing', type: 'Game', icon: '🏎️', package: 'com.gameloft.android.ANMP.GloftA9HM' },
  'com.roblox.client': { title: 'Roblox', category: 'Sandbox', type: 'Game', icon: '🏗️', package: 'com.roblox.client' },
  'com.mobile.legends': { title: 'Mobile Legends', category: 'MOBA', type: 'Game', icon: '⚔️', package: 'com.mobile.legends' },
  'com.supercell.clashroyale': { title: 'Clash Royale', category: 'Strategy', type: 'Game', icon: '🛡️', package: 'com.supercell.clashroyale' },
  'com.innersloth.spacemafia': { title: 'Among Us', category: 'Party', type: 'Game', icon: '🎭', package: 'com.innersloth.spacemafia' },
  'com.epicgames.fortnite': { title: 'Fortnite', category: 'FPS', type: 'Game', icon: '🎯', package: 'com.epicgames.fortnite' },
  'com.riotgames.league.wildrift': { title: 'Wild Rift', category: 'MOBA', type: 'Game', icon: '⚔️', package: 'com.riotgames.league.wildrift' },
  'com.kiloo.subwaysurf': { title: 'Subway Surfers', category: 'Arcade', type: 'Game', icon: '🏃', package: 'com.kiloo.subwaysurf' },
  'com.android.chrome': { title: 'Google Chrome', category: 'Browser', type: 'App', icon: '🌐', package: 'com.android.chrome' },
  'com.termux': { title: 'Termux', category: 'Tool', type: 'App', icon: '💻', package: 'com.termux' },
  'org.videolan.vlc': { title: 'VLC Media Player', category: 'Media', type: 'App', icon: '📺', package: 'org.videolan.vlc' },
  'org.fdroid.fdroid': { title: 'F-Droid', category: 'Store', type: 'App', icon: '📦', package: 'org.fdroid.fdroid' },
  'com.valvesoftware.steamlink': { title: 'Steam Link', category: 'Gaming', type: 'App', icon: '🎮', package: 'com.valvesoftware.steamlink' },
  'com.limelight': { title: 'Moonlight', category: 'Gaming', type: 'App', icon: '🎮', package: 'com.limelight' },
  'com.rarlab.rar': { title: 'ZArchiver', category: 'Tool', type: 'App', icon: '🗜️', package: 'com.rarlab.rar' },
  'com.joaomgcd.autonotification': { title: 'Tasker', category: 'Tool', type: 'App', icon: '⚡', package: 'com.joaomgcd.autonotification' },
  'com.google.android.apps.maps': { title: 'Google Maps', category: 'Navigation', type: 'App', icon: '🗺️', package: 'com.google.android.apps.maps' },
  'com.whatsapp': { title: 'WhatsApp', category: 'Social', type: 'App', icon: '💬', package: 'com.whatsapp' },
  'com.instagram.android': { title: 'Instagram', category: 'Social', type: 'App', icon: '📸', package: 'com.instagram.android' },
  'com.snapchat.android': { title: 'Snapchat', category: 'Social', type: 'App', icon: '👻', package: 'com.snapchat.android' },
  'org.telegram.messenger': { title: 'Telegram', category: 'Social', type: 'App', icon: '✈️', package: 'org.telegram.messenger' },
  'com.microsoft.office.outlook': { title: 'Outlook', category: 'Productivity', type: 'App', icon: '📧', package: 'com.microsoft.office.outlook' },
  'com.google.android.keep': { title: 'Google Keep', category: 'Productivity', type: 'App', icon: '📝', package: 'com.google.android.keep' },
  'com.microsoft.office.officehubrow': { title: 'Microsoft 365', category: 'Productivity', type: 'App', icon: '📊', package: 'com.microsoft.office.officehubrow' },
  'com.adobe.reader': { title: 'Adobe Reader', category: 'Productivity', type: 'App', icon: '📄', package: 'com.adobe.reader' },
  'com.google.android.apps.photos': { title: 'Google Photos', category: 'Media', type: 'App', icon: '🖼️', package: 'com.google.android.apps.photos' },
  'com.zhiliaoapp.musically': { title: 'TikTok', category: 'Social', type: 'App', icon: '🎵', package: 'com.zhiliaoapp.musically' }
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

function readDownloadsIndex() {
  try {
    if (fs.existsSync(DOWNLOADS_INDEX)) {
      return JSON.parse(fs.readFileSync(DOWNLOADS_INDEX, 'utf-8'));
    }
  } catch {}
  return { apps: {} };
}

function writeDownloadsIndex(index) {
  try {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
    fs.writeFileSync(DOWNLOADS_INDEX, JSON.stringify(index, null, 2));
  } catch (e) {
    console.error('Failed to write downloads index:', e.message);
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

function downloadApk(packageName, meta) {
  return new Promise((resolve) => {
    const appDir = path.join(DOWNLOADS_DIR, packageName);
    const apkPath = path.join(appDir, 'app.apk');
    const manifestPath = path.join(appDir, 'manifest.json');

    try { fs.mkdirSync(appDir, { recursive: true }); } catch {}

    if (fs.existsSync(apkPath) && fs.statSync(apkPath).size > 10000) {
      console.log('APK already exists for', packageName, '- skipping download');
      resolve({ ok: true, cached: true, apkPath: '/Store/downloads/' + packageName + '/app.apk' });
      return;
    }

    var sources = [
      { host: 'd.apkpure.com', path: '/b/APK/' + packageName + '?version=latest', method: 'GET' },
      { host: 'api.apkpure.com', path: '/api/v2/package/' + packageName + '/download?type=apk', method: 'GET' }
    ];

    var trySource = function(idx) {
      if (idx >= sources.length) {
        resolve({ ok: false, error: 'All APK download sources failed' });
        return;
      }
      var src = sources[idx];
      console.log('Downloading APK from', src.host + src.path);
      var opts = {
        hostname: src.host,
        path: src.path,
        method: src.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        timeout: 30000,
        rejectUnauthorized: false
      };
      var req = https.get(opts, function(res) {
        var status = res.statusCode;
        if (status >= 300 && status < 400 && res.headers.location) {
          var loc = res.headers.location;
          console.log('Redirect to', loc);
          var u = new URL(loc);
          var copts = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: 'GET',
            headers: { 'User-Agent': opts.headers['User-Agent'], 'Accept': '*/*' },
            timeout: 60000,
            rejectUnauthorized: false
          };
          var creq = https.get(copts, function(cres) {
            var file = fs.createWriteStream(apkPath);
            var total = parseInt(cres.headers['content-length'] || '0');
            var downloaded = 0;
            cres.on('data', function(chunk) {
              downloaded += chunk.length;
              if (total > 0 && downloaded % (1024*1024) < 65536) {
                console.log(packageName + ': ' + Math.round(downloaded/total*100) + '%');
              }
            });
            cres.pipe(file);
            file.on('finish', function() {
              file.close();
              var size = fs.statSync(apkPath).size;
              if (size < 1000) {
                fs.unlinkSync(apkPath);
                trySource(idx + 1);
              } else {
                var manifest = {
                  packageName: packageName,
                  title: meta.title,
                  category: meta.category,
                  type: meta.type,
                  icon: meta.icon,
                  size: size,
                  downloadedAt: new Date().toISOString(),
                  apkPath: '/Store/downloads/' + packageName + '/app.apk'
                };
                fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
                console.log('Saved APK for', packageName, '-', size, 'bytes');
                resolve({ ok: true, apkPath: manifest.apkPath, size: size });
              }
            });
            file.on('error', function() { trySource(idx + 1); });
          });
          creq.on('error', function() { trySource(idx + 1); });
          creq.on('timeout', function() { creq.destroy(); trySource(idx + 1); });
        } else if (status === 200) {
          var file = fs.createWriteStream(apkPath);
          var total = parseInt(res.headers['content-length'] || '0');
          res.pipe(file);
          file.on('finish', function() {
            file.close();
            var size = fs.statSync(apkPath).size;
            if (size < 1000) {
              fs.unlinkSync(apkPath);
              trySource(idx + 1);
            } else {
              var manifest = {
                packageName: packageName,
                title: meta.title,
                category: meta.category,
                type: meta.type,
                icon: meta.icon,
                size: size,
                downloadedAt: new Date().toISOString(),
                apkPath: '/Store/downloads/' + packageName + '/app.apk'
              };
              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
              console.log('Saved APK for', packageName, '-', size, 'bytes');
              resolve({ ok: true, apkPath: manifest.apkPath, size: size });
            }
          });
          file.on('error', function() { trySource(idx + 1); });
        } else {
          trySource(idx + 1);
        }
      });
      req.on('error', function() { trySource(idx + 1); });
      req.on('timeout', function() { req.destroy(); trySource(idx + 1); });
    };

    trySource(0);
  });
}

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

function handleListPackages() {
  const list = Object.entries(RQBBOX_PACKAGES).map(([id, data]) => ({
    packageName: id, ...data,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=' + id
  }));
  return { body: list };
}

async function handleInstall(body) {
  const pkg = (body && body.id) || '';
  if (!pkg) return { status: 400, body: { ok: false, error: 'Missing app id' } };

  const meta = RQBBOX_PACKAGES[pkg];
  if (!meta) return { status: 400, body: { ok: false, error: 'Unsupported package: ' + pkg } };

  const installed = readInstalled();
  const existing = installed.find(i => i.packageName === pkg);

  if (existing && existing.downloaded) {
    return {
      body: {
        ok: true, message: meta.title + ' is already downloaded to RQBBOX USB',
        alreadyInstalled: true, entry: existing,
        apkPath: existing.apkPath
      }
    };
  }

  var entry = {
    packageName: pkg,
    title: meta.title,
    category: meta.category,
    type: meta.type,
    icon: meta.icon,
    installedAt: new Date().toISOString(),
    playStoreUrl: 'https://play.google.com/store/apps/details?id=' + pkg,
    rqbboxUrl: '/play/' + pkg,
    downloaded: false,
    apkPath: null,
    size: 0
  };

  if (existing) {
    entry = existing;
  }

  var downloadResult = await downloadApk(pkg, meta);

  if (downloadResult.ok) {
    entry.downloaded = true;
    entry.apkPath = downloadResult.apkPath;
    entry.size = downloadResult.size || 0;
  }

  if (!existing) {
    installed.push(entry);
  } else {
    var idx = installed.indexOf(existing);
    installed[idx] = entry;
  }
  writeInstalled(installed);

  var dlIndex = readDownloadsIndex();
  dlIndex.apps[pkg] = {
    title: meta.title,
    category: meta.category,
    type: meta.type,
    icon: meta.icon,
    downloadedAt: entry.installedAt,
    apkPath: entry.apkPath,
    size: entry.size,
    downloaded: entry.downloaded
  };
  writeDownloadsIndex(dlIndex);

  return {
    body: {
      ok: true,
      message: downloadResult.ok
        ? meta.title + ' downloaded to RQBBOX USB!'
        : meta.title + ' added to RQBBOX. APK download failed, try manual install from Play Store.',
      entry: entry,
      playStoreUrl: entry.playStoreUrl,
      apkPath: entry.apkPath,
      downloaded: entry.downloaded,
      downloadError: downloadResult.error || null
    }
  };
}

function handleListInstalled() {
  var installed = readInstalled();
  var dlIndex = readDownloadsIndex();
  return {
    body: {
      ok: true,
      installed: installed,
      downloads: dlIndex.apps,
      count: installed.length
    }
  };
}

function handleDownloadsIndex() {
  var dlIndex = readDownloadsIndex();
  return { body: dlIndex };
}

module.exports = {
  handleAppLookup,
  handleListPackages,
  handleInstall,
  handleListInstalled,
  handleDownloadsIndex,
  RQBBOX_PACKAGES
};
