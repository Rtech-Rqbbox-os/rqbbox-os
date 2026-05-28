const fs = require('fs');
const path = require('path');

const ROOT = 'H:\\RQBBOX_OS';
const PACKAGES_DIR = path.join(ROOT, 'Store', 'packages');

const packages = [
  // Games from Google Play
  { id: 'call-of-duty-mobile', title: 'Call of Duty Mobile', icon: '🎯', category: 'FPS', desc: 'First-person shooter with multiplayer, battle royale, and zombie modes. 100+ million downloads on Google Play.', playId: 'com.activision.callofduty.shooter', rating: '4.5', downloads: '120M+', size: '2.5 GB', type: 'game' },
  { id: 'genshin-impact', title: 'Genshin Impact', icon: '⚔️', category: 'RPG', desc: 'Open-world action RPG set in the fantasy world of Teyvat. Stunning visuals, elemental combat, and co-op play.', playId: 'com.miHoYo.GenshinImpact', rating: '4.6', downloads: '80M+', size: '20 GB', type: 'game' },
  { id: 'pubg-mobile', title: 'PUBG Mobile', icon: '🪂', category: 'FPS', desc: 'Battle royale game with realistic weapons, vehicles, and 100-player matches. Team up and be the last one standing.', playId: 'com.tencent.ig', rating: '4.4', downloads: '150M+', size: '2.8 GB', type: 'game' },
  { id: 'minecraft', title: 'Minecraft', icon: '⛏️', category: 'Sandbox', desc: 'Build, explore, and survive in an infinite block world. Creative mode, survival mode, and multiplayer servers.', playId: 'com.mojang.minecraftpe', rating: '4.6', downloads: '100M+', size: '500 MB', type: 'game' },
  { id: 'asphalt-9', title: 'Asphalt 9 Legends', icon: '🏎️', category: 'Racing', desc: 'High-octane arcade racing with licensed cars, stunning graphics, and nitro-powered drifts.', playId: 'com.gameloft.android.ANMP.GloftA9HM', rating: '4.6', downloads: '90M+', size: '2.5 GB', type: 'game' },
  { id: 'roblox', title: 'Roblox', icon: '🔶', category: 'Sandbox', desc: 'Millions of user-created games and experiences. Play, create, and socialize in an infinite virtual universe.', playId: 'com.roblox.client', rating: '4.4', downloads: '140M+', size: '300 MB', type: 'game' },
  { id: 'mobile-legends', title: 'Mobile Legends Bang Bang', icon: '⚡', category: 'MOBA', desc: 'Classic MOBA with 10-second matchmaking and 10-minute battles. 100+ heroes with unique abilities.', playId: 'com.mobile.legends', rating: '4.4', downloads: '110M+', size: '1.5 GB', type: 'game' },
  { id: 'clash-royale', title: 'Clash Royale', icon: '👑', category: 'Strategy', desc: 'Real-time PvP strategy game featuring Clash of Clans characters. Collect cards, build decks, and battle.', playId: 'com.supercell.clashroyale', rating: '4.5', downloads: '130M+', size: '400 MB', type: 'game' },
  { id: 'among-us', title: 'Among Us', icon: '🔪', category: 'Party', desc: 'Multiplayer social deduction game. Work together to complete tasks, but watch out for impostors!', playId: 'com.innersloth.spacemafia', rating: '4.5', downloads: '90M+', size: '250 MB', type: 'game' },
  { id: 'fortnite', title: 'Fortnite', icon: '🦸', category: 'FPS', desc: 'Battle royale, creative, and save the world modes. Build, fight, and express yourself with unique cosmetics.', playId: 'com.epicgames.fortnite', rating: '4.3', downloads: '50M+', size: '5 GB', type: 'game' },
  { id: 'wild-rift', title: 'League of Legends Wild Rift', icon: '⚔️', category: 'MOBA', desc: '5v5 MOBA from the League of Legends franchise. Quick matches, dual-stick controls, console-quality graphics.', playId: 'com.riotgames.league.wildrift', rating: '4.6', downloads: '70M+', size: '2 GB', type: 'game' },
  { id: 'subway-surfers', title: 'Subway Surfers', icon: '🏃', category: 'Arcade', desc: 'Endless runner game. Dodge trains, collect coins, and surf through subway tunnels with colorful characters.', playId: 'com.kiloo.subwaysurf', rating: '4.5', downloads: '250M+', size: '200 MB', type: 'game' },
  // Apps from Google Play
  { id: 'google-chrome', title: 'Google Chrome', icon: '🌐', category: 'Browser', desc: 'Fast, secure web browser with tab sync, incognito mode, and Google integration. 10B+ installs on Google Play.', playId: 'com.android.chrome', rating: '4.5', downloads: '10B+', size: '200 MB', type: 'app' },
  { id: 'termux', title: 'Termux', icon: '📟', category: 'Tool', desc: 'Powerful terminal emulator with Linux package manager. Essential for running RQBBOX server on Android.', playId: 'com.termux', rating: '4.6', downloads: '20M+', size: '50 MB', type: 'app' },
  { id: 'vlc-android', title: 'VLC for Android', icon: '📺', category: 'Media', desc: 'Universal media player supporting all audio/video formats. No codec packs needed. Open source and free.', playId: 'org.videolan.vlc', rating: '4.6', downloads: '50M+', size: '50 MB', type: 'app' },
  { id: 'fdroid', title: 'F-Droid', icon: '🤖', category: 'Tool', desc: 'Free and open-source Android app repository. Install Termux, Firefox, and hundreds of FOSS apps without Google.', playId: 'org.fdroid.fdroid', rating: '4.7', downloads: '5M+', size: '10 MB', type: 'app' },
  { id: 'steam-link', title: 'Steam Link', icon: '🎮', category: 'Gaming', desc: 'Stream your entire Steam PC library to your phone. Play on your device with touch controls, keyboard, or gamepad.', playId: 'com.valvesoftware.steamlink', rating: '4.4', downloads: '20M+', size: '150 MB', type: 'app' },
  { id: 'moonlight', title: 'Moonlight Game Streaming', icon: '📡', category: 'Gaming', desc: 'Stream PC games from your NVIDIA GameStream-enabled computer to your Android device with low latency.', playId: 'com.limelight', rating: '4.5', downloads: '5M+', size: '30 MB', type: 'app' },
  { id: 'zarchiver', title: 'ZArchiver', icon: '📦', category: 'Tool', desc: 'File archiver for ZIP, RAR, 7z, TAR, GZ, and more. Essential for extracting game files and assets on Android.', playId: 'ru.zdevs.zarchiver', rating: '4.7', downloads: '20M+', size: '10 MB', type: 'app' },
  { id: 'tasker', title: 'Tasker', icon: '⚙️', category: 'Tool', desc: 'Automate everything on your Android device. Create profiles, tasks, and scenes triggered by any condition.', playId: 'net.dinglisch.android.taskerm', rating: '4.6', downloads: '10M+', size: '20 MB', type: 'app' },
  { id: 'google-maps', title: 'Google Maps', icon: '🗺️', category: 'Navigation', desc: 'Navigate your world with turn-by-turn GPS navigation, real-time traffic updates, and detailed place info.', playId: 'com.google.android.apps.maps', rating: '4.5', downloads: '10B+', size: '80 MB', type: 'app' },
  { id: 'whatsapp', title: 'WhatsApp Messenger', icon: '💬', category: 'Social', desc: 'Simple, secure messaging with end-to-end encryption. Text, voice, video calls, and group chats worldwide.', playId: 'com.whatsapp', rating: '4.5', downloads: '5B+', size: '80 MB', type: 'app' },
  { id: 'instagram', title: 'Instagram', icon: '📸', category: 'Social', desc: 'Share photos, videos, and stories with friends. Reels, DMs, and explore trending content from around the world.', playId: 'com.instagram.android', rating: '4.4', downloads: '1B+', size: '100 MB', type: 'app' },
  { id: 'tiktok', title: 'TikTok', icon: '🎵', category: 'Social', desc: 'Short-form video platform. Discover, create, and share viral videos with music, effects, and filters.', playId: 'com.zhiliaoapp.musically', rating: '4.5', downloads: '2B+', size: '150 MB', type: 'app' },
  { id: 'snapchat', title: 'Snapchat', icon: '👻', category: 'Social', desc: 'Quick photo and video messaging with filters, lenses, and stories that disappear after 24 hours.', playId: 'com.snapchat.android', rating: '4.3', downloads: '1B+', size: '200 MB', type: 'app' },
  { id: 'telegram', title: 'Telegram', icon: '✈️', category: 'Social', desc: 'Fast, secure messaging with cloud sync. Channels, bots, groups up to 200K members, and secret chats.', playId: 'org.telegram.messenger', rating: '4.6', downloads: '1B+', size: '80 MB', type: 'app' },
  { id: 'microsoft-outlook', title: 'Microsoft Outlook', icon: '📧', category: 'Productivity', desc: 'Email, calendar, and contacts in one app. Supports Exchange, Office 365, Gmail, and more.', playId: 'com.microsoft.office.outlook', rating: '4.6', downloads: '100M+', size: '100 MB', type: 'app' },
  { id: 'google-keep', title: 'Google Keep', icon: '📝', category: 'Productivity', desc: 'Quick notes, lists, and reminders that sync across all your devices. Voice notes and image capture.', playId: 'com.google.android.keep', rating: '4.6', downloads: '500M+', size: '30 MB', type: 'app' },
  { id: 'microsoft-365', title: 'Microsoft 365', icon: '📄', category: 'Productivity', desc: 'Word, Excel, PowerPoint on mobile. Create, edit, and collaborate on documents from your phone.', playId: 'com.microsoft.office.officehubrow', rating: '4.6', downloads: '500M+', size: '150 MB', type: 'app' },
  { id: 'adobe-reader', title: 'Adobe Acrobat Reader', icon: '📕', category: 'Productivity', desc: 'View, sign, and annotate PDF files. Fill forms, share documents, and store files in the cloud.', playId: 'com.adobe.reader', rating: '4.6', downloads: '500M+', size: '50 MB', type: 'app' },
  { id: 'google-photos', title: 'Google Photos', icon: '🖼️', category: 'Media', desc: 'Free unlimited photo storage with smart search, automatic organization, and AI-powered editing tools.', playId: 'com.google.android.apps.photos', rating: '4.7', downloads: '5B+', size: '100 MB', type: 'app' },
];

function makeStars(r) {
  const n = Math.floor(parseFloat(r));
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function html(pkg) {
  const playUrl = `https://play.google.com/store/apps/details?id=${pkg.playId}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${pkg.title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#050810;color:#e8f0ff;font-family:'Segoe UI',system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center}
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:24px;padding:40px;max-width:500px;width:90%;margin:20px;backdrop-filter:blur(12px);text-align:center}
.icon{font-size:5rem;margin-bottom:16px}
.name{font-size:1.8rem;font-weight:700;background:linear-gradient(135deg,#00d4ff,#9d4edd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.category{font-size:.75rem;color:#00d4ff;text-transform:uppercase;letter-spacing:.15em;margin-bottom:12px}
.desc{color:#8b9dc3;font-size:.9rem;line-height:1.7;margin-bottom:20px}
.stars{color:#ffc107;font-size:1.1rem;margin-bottom:4px}
.meta{color:#6b7d9e;font-size:.8rem;margin-bottom:20px}
.play-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:14px;font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;background:#00d4ff;color:#000}
.play-btn:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,212,255,.3)}
.ghost-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:14px;font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;background:transparent;border:1px solid rgba(255,255,255,.1);color:#8b9dc3;margin-top:10px}
.ghost-btn:hover{border-color:#00d4ff;color:#00d4ff}
.top-bar{position:fixed;top:0;left:0;right:0;z-index:10;display:flex;justify-content:flex-end;padding:12px 16px;gap:10px}
.top-bar a{color:#8b9dc3;font-size:.82rem;text-decoration:none;padding:6px 14px;border-radius:10px;background:rgba(5,8,16,.7);border:1px solid rgba(255,255,255,.06);transition:all .2s;cursor:pointer}
.top-bar a:hover{color:#00d4ff;border-color:#00d4ff}
.instructions{text-align:left;margin-top:20px;padding:16px;background:rgba(0,212,255,.04);border-radius:12px;border:1px solid rgba(0,212,255,.1)}
.instructions h4{color:#00d4ff;font-size:.8rem;margin-bottom:8px}
.instructions li{color:#8b9dc3;font-size:.78rem;padding:3px 0;list-style:none;padding-left:20px;position:relative}
.instructions li:before{content:'\\203A';position:absolute;left:0;color:#00d4ff;font-weight:700}
</style>
</head>
<body>
<div class="top-bar">
<a onclick="window.open('${playUrl}','_blank')">↗ Open in Play Store</a>
<a onclick="window.parent.postMessage('rqbbox-exit','*')">← Back</a>
</div>
<div class="card">
<div class="icon">${pkg.icon}</div>
<div class="name">${pkg.title}</div>
<div class="category">${pkg.category}</div>
<div class="desc">${pkg.desc}</div>
<div class="stars">${makeStars(pkg.rating)} ${pkg.rating}</div>
<div class="meta">${pkg.downloads} downloads &bull; ${pkg.size}</div>
<a class="play-btn" href="${playUrl}" target="_blank">📲 Get on Google Play</a>
<a class="ghost-btn" onclick="window.open('${pkg.type === 'game' ? 'https://play.google.com/store/apps/category/GAME' : 'https://play.google.com/store/apps'}','_blank')">${pkg.type === 'game' ? '🎮 Browse More Games' : '📱 Browse All Apps'}</a>
<div class="instructions">
<h4>📱 Install on Your Phone</h4>
<ul style="padding:0;margin-top:6px">
<li>Open Google Play Store on your Android phone</li>
<li>Search for "${pkg.title}" or tap the button above</li>
<li>Tap "Install" and wait for the download</li>
<li>Launch from your app drawer or RQBBOX game library</li>
</ul>
</div>
</div>
</body>
</html>`;
}

// Create all packages
for (const pkg of packages) {
  const dir = path.join(PACKAGES_DIR, pkg.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html(pkg), 'utf8');
  console.log(`Created ${pkg.id}`);
}

// Update store.json catalog
const catalogPath = path.join(ROOT, 'Store', 'catalog', 'store.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const newGames = [];
const newApps = [];
const newFeatured = [];

function entry(pkg) {
  const e = {
    id: pkg.id,
    title: pkg.title,
    category: pkg.category,
    description: pkg.desc,
    rating: parseFloat(pkg.rating),
    size: pkg.size,
    banner: pkg.icon,
    installed: false
  };
  if (pkg.type === 'game') {
    e.achievements = true;
    e.controller = true;
    e.vibration = true;
  }
  return e;
}

for (const pkg of packages) {
  const e = entry(pkg);
  if (pkg.type === 'game') {
    newGames.push(e);
    if (pkg.id === 'call-of-duty-mobile' || pkg.id === 'genshin-impact' || pkg.id === 'minecraft') {
      newFeatured.push({ ...e, type: 'game', price: 'Free', featured: true, tags: [pkg.category, '3D', 'Multiplayer'] });
    }
  } else {
    newApps.push(e);
    if (pkg.id === 'termux' || pkg.id === 'google-chrome' || pkg.id === 'vlc-android') {
      newFeatured.push({ ...e, type: 'app', price: 'Free', featured: true, tags: [pkg.category, 'Tool'] });
    }
  }
}

// Keep existing entries that aren't in the new list
const existingIds = new Set(packages.map(p => p.id));
const keepGames = catalog.games.filter(g => !existingIds.has(g.id) && !packages.find(p => p.id === g.id));
const keepApps = catalog.apps.filter(a => !existingIds.has(a.id) && !packages.find(p => p.id === a.id));
const keepFeatured = catalog.featured.filter(f => !existingIds.has(f.id) && !packages.find(p => p.id === f.id));

catalog.games = [...newGames, ...keepGames];
catalog.apps = [...newApps, ...keepApps];
catalog.featured = [...newFeatured, ...keepFeatured];

// Add new categories
const allCats = new Set(catalog.categories);
for (const pkg of packages) {
  allCats.add(pkg.category);
}
for (const pkg of packages) {
  if (pkg.type === 'game') allCats.add('3D Games');
}
allCats.add('Gaming');
allCats.add('Navigation');
catalog.categories = Array.from(allCats).sort((a, b) => {
  const order = ['All', '3D Games', 'FPS', 'RPG', 'Racing', 'Sandbox', 'MOBA', 'Strategy', 'Party', 'Arcade', 'Indie', 'Emulator', 'Apps', 'Games', 'Browser', 'Tool', 'Gaming', 'Media', 'Streaming', 'Social', 'Developer', 'Reference', 'Productivity', 'Utility', 'Navigation', 'Music', 'AI'];
  return order.indexOf(a) - order.indexOf(b);
});

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`\nCatalog updated: ${newGames.length} games, ${newApps.length} apps, ${newFeatured.length} featured`);
console.log('Done!');
