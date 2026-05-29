// RQBBOX OS — Google Play APK Wrapper Generator
// Creates Android APK wrappers for HTML5 Canvas games using a simple WebView approach
//
// Usage: node System/Tools/generate-apk-wrappers.js
// Output: System/PlayStoreAPKs/[game-name]/index.html + config
//
// These can be packaged into APKs using:
// - PWA2APK: https://www.pwabuilder.com/
// - Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap
// - Capacitor: https://capacitorjs.com/

const fs = require('fs');
const path = require('path');

const GAMES = [
  { id: 'neon-drift-racing', title: 'Neon Drift Racing', desc: 'High-speed neon racing game built for RQBBOX OS. Drift, boost, and compete for the best lap times.', icon: '🏎️', category: 'GAME_RACING' },
  { id: 'pixel-quest', title: 'Pixel Quest', desc: 'Retro-style platformer adventure. Jump, collect, and explore pixel-art worlds.', icon: '👾', category: 'GAME_PLATFORMER' },
  { id: 'star-fighter-x', title: 'Star Fighter X', desc: 'Space shooter with intense dogfights, power-ups, and boss battles across the galaxy.', icon: '🚀', category: 'GAME_ACTION' },
  { id: 'void-craft-sandbox', title: 'Void Craft Sandbox', desc: 'Open-world sandbox builder. Create, explore, and survive in a procedurally generated void world.', icon: '🏗️', category: 'GAME_SANDBOX' },
  { id: 'retro-zone', title: 'Retro Zone', desc: 'Classic retro gaming collection. Multiple arcade classics in one package.', icon: '🕹️', category: 'GAME_ARCADE' },
  { id: 'cube-runner-3d', title: 'Cube Runner 3D', desc: 'Endless 3D runner with dynamic obstacles, power-ups, and leaderboard competition.', icon: '🎲', category: 'GAME_ARCADE' }
];

const OUTPUT_DIR = path.join(__dirname, '..', '..', 'System', 'PlayStoreAPKs');

function generateHTML(game) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${game.title} — RQBBOX OS</title>
  <meta name="description" content="${game.desc}">
  <meta name="application-name" content="${game.title}">
  <meta name="mobile-web-app-capable" content="yes">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; overflow:hidden; background:#0a0a0f; }
    #game-frame { width:100%; height:100%; border:none; }
    #loading {
      position:fixed; inset:0; display:flex; flex-direction:column;
      align-items:center; justify-content:center; background:#0a0a0f; color:#fff;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      z-index:9999; transition:opacity .5s;
    }
    #loading .logo { width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#00d4ff;margin-bottom:16px; }
    #loading h1 { font-size:20px;font-weight:700;margin-bottom:4px; }
    #loading p { font-size:13px;color:rgba(255,255,255,.4);margin-bottom:20px; }
    #loading .spinner { width:32px;height:32px;border:3px solid rgba(0,212,255,.1);border-top-color:#00d4ff;border-radius:50%;animation:spin .8s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
    #loading .badge { background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:4px 12px;border-radius:100px;font-size:11px;color:#00d4ff;margin-top:16px; }
  </style>
</head>
<body>
  <div id="loading">
    <div class="logo">R</div>
    <h1>${game.title}</h1>
    <p>Loading from RQBBOX OS &bull; ${game.icon}</p>
    <div class="spinner"></div>
    <div class="badge">⚡ Powered by RQBBOX Kernel</div>
  </div>
  <iframe id="game-frame" src="https://rtech-rqbbox-os.github.io/rqbbox-os/Games/${game.id}/index.html" allowfullscreen allow="autoplay; fullscreen; gamepad"></iframe>
  <script>
    var frame = document.getElementById('game-frame');
    var loading = document.getElementById('loading');
    frame.addEventListener('load', function() {
      loading.style.opacity = '0';
      setTimeout(function() { loading.style.display = 'none'; }, 500);
    });
    setTimeout(function() {
      loading.style.opacity = '0';
      setTimeout(function() { loading.style.display = 'none'; }, 500);
    }, 5000);
  </script>
</body>
</html>`;
}

function generateManifest(game) {
  return {
    name: game.title,
    short_name: game.title,
    description: game.desc,
    start_url: `index.html`,
    display: 'fullscreen',
    orientation: 'landscape',
    background_color: '#0a0a0f',
    theme_color: '#0a0a0f',
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    categories: [game.category],
    related_applications: [{
      platform: 'play',
      url: `https://play.google.com/store/apps/details?id=com.rqbbox.${game.id}`,
      id: `com.rqbbox.${game.id}`
    }]
  };
}

function generatePlayStoreListing(game) {
  return `# ${game.title} — ${game.icon}
## Google Play Store Listing

**Package name:** com.rqbbox.${game.id}
**Category:** ${game.category}
**Description:**
${game.desc}

**Screenshots:**
- 2x phone screenshots (1080×1920)
- 2x tablet screenshots (1920×1080)
- 1x feature graphic (1024×500)
- 1x icon (512×512)

**Promo text:**
Play ${game.title} on RQBBOX OS — the portable USB gaming operating system.

**Tags:**
rqbbox, gaming, ${game.id}, RhysTech, portable USB

**Developer:**
RhysTech
rhyscotton20@gmail.com

---
Powered by RQBBOX Kernel v1.2.0`;
}

function run() {
  console.log('Generating APK wrappers for ' + GAMES.length + ' games...\n');

  GAMES.forEach(function(game) {
    var dir = path.join(OUTPUT_DIR, game.id);
    fs.mkdirSync(dir, { recursive: true });

    // Generate HTML wrapper
    fs.writeFileSync(path.join(dir, 'index.html'), generateHTML(game));

    // Generate PWA manifest
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(generateManifest(game), null, 2));

    // Generate Play Store listing
    fs.writeFileSync(path.join(dir, 'play-store-listing.txt'), generatePlayStoreListing(game));

    console.log('  ✓ ' + game.title + ' (' + game.id + ')');
  });

  console.log('\nDone! Generated in: ' + OUTPUT_DIR);
  console.log('\nTo create actual APKs:');
  console.log('  1. Upload each game folder to https://www.pwabuilder.com/');
  console.log('  2. Configure Store Listing → Google Play');
  console.log('  3. Download APK + upload to Google Play Console');
  console.log('  4. Requires: Google Play Developer account ($25 one-time fee)');
}

run();
