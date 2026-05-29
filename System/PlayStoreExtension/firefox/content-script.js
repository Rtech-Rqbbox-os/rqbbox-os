(function() {
  'use strict';

  var BTN_ID = 'rqbbox-play-inject';
  var STYLE_ID = 'rqbbox-play-css';
  var MAX_RETRIES = 10;

  var APP = {
    name: 'RQBBOX OS',
    tagline: 'Portable USB Gaming Operating System',
    author: 'RhysTech',
    email: 'rhyscotton20@gmail.com',
    download: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    website: 'https://rtech-rqbbox-os.github.io/rqbbox-os/',
    infocard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
    github: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
    version: 'v1.2.0'
  };

  // ALL RQBBOX-supported Google Play packages
  var PLAY_PACKAGES = [
    { id: 'com.activision.callofduty.shooter', title: 'Call of Duty Mobile', cat: 'FPS', icon: '🎯' },
    { id: 'com.miHoYo.GenshinImpact', title: 'Genshin Impact', cat: 'RPG', icon: '⚔️' },
    { id: 'com.tencent.ig', title: 'PUBG Mobile', cat: 'FPS', icon: '🎯' },
    { id: 'com.mojang.minecraftpe', title: 'Minecraft', cat: 'Sandbox', icon: '🏗️' },
    { id: 'com.gameloft.android.ANMP.GloftA9HM', title: 'Asphalt 9', cat: 'Racing', icon: '🏎️' },
    { id: 'com.roblox.client', title: 'Roblox', cat: 'Sandbox', icon: '🏗️' },
    { id: 'com.mobile.legends', title: 'Mobile Legends', cat: 'MOBA', icon: '⚔️' },
    { id: 'com.supercell.clashroyale', title: 'Clash Royale', cat: 'Strategy', icon: '🛡️' },
    { id: 'com.innersloth.spacemafia', title: 'Among Us', cat: 'Party', icon: '🎭' },
    { id: 'com.epicgames.fortnite', title: 'Fortnite', cat: 'FPS', icon: '🎯' },
    { id: 'com.riotgames.league.wildrift', title: 'Wild Rift', cat: 'MOBA', icon: '⚔️' },
    { id: 'com.kiloo.subwaysurf', title: 'Subway Surfers', cat: 'Arcade', icon: '🏃' },
    { id: 'com.android.chrome', title: 'Google Chrome', cat: 'Browser', icon: '🌐' },
    { id: 'com.termux', title: 'Termux', cat: 'Tool', icon: '💻' },
    { id: 'org.videolan.vlc', title: 'VLC Media Player', cat: 'Media', icon: '📺' },
    { id: 'org.fdroid.fdroid', title: 'F-Droid', cat: 'Store', icon: '📦' },
    { id: 'com.valvesoftware.steamlink', title: 'Steam Link', cat: 'Gaming', icon: '🎮' },
    { id: 'com.limelight', title: 'Moonlight', cat: 'Gaming', icon: '🎮' },
    { id: 'com.rarlab.rar', title: 'ZArchiver', cat: 'Tool', icon: '🗜️' },
    { id: 'com.joaomgcd.autonotification', title: 'Tasker', cat: 'Tool', icon: '⚡' },
    { id: 'com.google.android.apps.maps', title: 'Google Maps', cat: 'Navigation', icon: '🗺️' },
    { id: 'com.whatsapp', title: 'WhatsApp', cat: 'Social', icon: '💬' },
    { id: 'com.instagram.android', title: 'Instagram', cat: 'Social', icon: '📸' },
    { id: 'com.snapchat.android', title: 'Snapchat', cat: 'Social', icon: '👻' },
    { id: 'org.telegram.messenger', title: 'Telegram', cat: 'Social', icon: '✈️' },
    { id: 'com.microsoft.office.outlook', title: 'Outlook', cat: 'Productivity', icon: '📧' },
    { id: 'com.google.android.keep', title: 'Google Keep', cat: 'Productivity', icon: '📝' },
    { id: 'com.microsoft.office.officehubrow', title: 'Microsoft 365', cat: 'Productivity', icon: '📊' },
    { id: 'com.adobe.reader', title: 'Adobe Reader', cat: 'Productivity', icon: '📄' },
    { id: 'com.google.android.apps.photos', title: 'Google Photos', cat: 'Media', icon: '🖼️' },
    { id: 'com.zhiliaoapp.musically', title: 'TikTok', cat: 'Social', icon: '🎵' }
  ];

  var currentAppId = '';
  (function() {
    var m = location.pathname.match(/\/store\/(?:apps|games)\/details\?id=([^&]+)/);
    if (m) currentAppId = m[1];
    else currentAppId = new URLSearchParams(location.search).get('id') || '';
  })();

  function getAppName() {
    var sels = ['h1[itemprop="name"]','h1[aria-label]','.Fd93Bb h1','.qmmlRd','h1 span','[data-g-name]','h1'];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return 'this app';
  }

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    var css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = [
      '#' + BTN_ID + ' { all:initial;display:block;margin:16px 0!important;max-width:100%!important;clear:both; }',
      '#' + BTN_ID + ' * { all:revert; }',
      '#' + BTN_ID + ' .rqbbox-p-wrap {',
      '  background:linear-gradient(135deg,rgba(10,12,18,.97),rgba(20,22,28,.95));',
      '  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);',
      '  border:1px solid rgba(0,212,255,.15);border-radius:12px;padding:16px 18px;',
      '  box-shadow:0 8px 32px rgba(0,0,0,.5);',
      '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;',
      '  color:#fff!important;line-height:1.4!important;box-sizing:border-box!important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-head { display:flex;align-items:center;gap:12px;margin-bottom:12px; }',
      '#' + BTN_ID + ' .rqbbox-p-logo { width:40px;height:40px;flex-shrink:0;border-radius:10px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#00d4ff; }',
      '#' + BTN_ID + ' .rqbbox-p-title { font-size:15px;font-weight:700;color:#fff; }',
      '#' + BTN_ID + ' .rqbbox-p-sub { font-size:11px;color:rgba(255,255,255,.45); }',
      '#' + BTN_ID + ' .rqbbox-p-desc { font-size:12px;line-height:1.5;color:rgba(255,255,255,.55);margin-bottom:12px; }',
      '#' + BTN_ID + ' .rqbbox-p-desc strong { color:#00d4ff; }',
      '#' + BTN_ID + ' .rqbbox-p-badges { display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px; }',
      '#' + BTN_ID + ' .rqbbox-p-badge { display:inline-block;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#00d4ff;text-transform:uppercase;letter-spacing:.3px;font-weight:600; }',
      '#' + BTN_ID + ' .rqbbox-p-grid { display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:12px;max-height:240px;overflow-y:auto; }',
      '#' + BTN_ID + ' .rqbbox-p-grid::-webkit-scrollbar { width:4px; }',
      '#' + BTN_ID + ' .rqbbox-p-grid::-webkit-scrollbar-track { background:rgba(255,255,255,.03);border-radius:4px; }',
      '#' + BTN_ID + ' .rqbbox-p-grid::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1);border-radius:4px; }',
      '#' + BTN_ID + ' .rqbbox-p-item { display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:6px;font-size:10px;color:rgba(255,255,255,.55);text-decoration:none;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);transition:all .2s; }',
      '#' + BTN_ID + ' .rqbbox-p-item:hover { background:rgba(0,212,255,.08);border-color:rgba(0,212,255,.15);color:#fff; }',
      '#' + BTN_ID + ' .rqbbox-p-item-active { background:rgba(0,212,255,.12)!important;border-color:rgba(0,212,255,.2)!important;color:#00d4ff!important; }',
      '#' + BTN_ID + ' .rqbbox-p-actions { display:flex;flex-wrap:wrap;gap:6px; }',
      '#' + BTN_ID + ' .rqbbox-p-btn { display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;border:none;cursor:pointer;transition:all .2s;line-height:1; }',
      '#' + BTN_ID + ' .rqbbox-p-btn-primary { background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.25); }',
      '#' + BTN_ID + ' .rqbbox-p-btn-primary:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,212,255,.35); }',
      '#' + BTN_ID + ' .rqbbox-p-btn-ghost { background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.06); }',
      '#' + BTN_ID + ' .rqbbox-p-btn-ghost:hover { background:rgba(255,255,255,.08); }',
      '#' + BTN_ID + ' .rqbbox-p-footer { margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.04);font-size:9px;color:rgba(255,255,255,.25);display:flex;justify-content:space-between;flex-wrap:wrap; }',
      '#' + BTN_ID + ' .rqbbox-p-footer a { color:rgba(0,212,255,.5);text-decoration:none; }',
      '#' + BTN_ID + ' .rqbbox-p-footer a:hover { color:rgba(0,212,255,.8); }',
      '@media (max-width:600px) { #' + BTN_ID + ' .rqbbox-p-grid { grid-template-columns:1fr; } }'
    ].join('\n');
    document.head.appendChild(css);
  }

  function buildCard() {
    var appName = getAppName();
    var w = document.createElement('div');
    w.id = BTN_ID;

    var packageList = PLAY_PACKAGES.map(function(p) {
      var active = (p.id === currentAppId) ? ' rqbbox-p-item-active' : '';
      var badge = (p.id === currentAppId) ? ' ● VIEWING' : '';
      return '<a class="rqbbox-p-item' + active + '" href="https://play.google.com/store/apps/details?id=' + p.id + '" target="_blank">' +
        '<span>' + p.icon + '</span>' +
        '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p.title + '</span>' +
        '<span style="color:rgba(255,255,255,.25);font-size:8px">' + p.cat + badge + '</span>' +
        '</a>';
    }).join('');

    w.innerHTML =
      '<div class="rqbbox-p-wrap">' +
        '<div class="rqbbox-p-head">' +
          '<div class="rqbbox-p-logo">R</div>' +
          '<div><div class="rqbbox-p-title">' + APP.name + ' &mdash; All Apps & Games</div>' +
          '<div class="rqbbox-p-sub">' + APP.tagline + ' by ' + APP.author + ' &bull; ' + APP.version + ' &bull; ' + PLAY_PACKAGES.length + ' packages</div></div>' +
        '</div>' +
        '<div class="rqbbox-p-desc">Browse all <strong>' + PLAY_PACKAGES.length + ' RQBBOX-supported apps & games</strong> on Google Play. <strong>' + appName + '</strong> is highlighted below. Each app can be installed on your RQBBOX USB drive.</div>' +
        '<div class="rqbbox-p-badges">' +
          '<span class="rqbbox-p-badge">⚡ USB Portable</span>' +
          '<span class="rqbbox-p-badge">🔓 Open Source</span>' +
          '<span class="rqbbox-p-badge">⚙️ RQBBOX Kernel</span>' +
          '<span class="rqbbox-p-badge">🎮 ' + PLAY_PACKAGES.length + ' Apps</span>' +
        '</div>' +
        '<div class="rqbbox-p-grid">' + packageList + '</div>' +
        '<div class="rqbbox-p-actions">' +
          '<a class="rqbbox-p-btn rqbbox-p-btn-primary" href="' + APP.download + '" target="_blank">⬇ Download RQBBOX OS</a>' +
          '<a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.website + '" target="_blank">🌐 Website</a>' +
          '<a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.infocard + '" target="_blank">📋 Info Card</a>' +
        '</div>' +
        '<div class="rqbbox-p-footer">' +
          '<span>by ' + APP.author + ' &bull; MIT &bull; ' + APP.version + '</span>' +
          '<span><a href="mailto:' + APP.email + '">📧 ' + APP.email + '</a></span>' +
        '</div>' +
      '</div>';
    return w;
  }

  function findTarget() {
    var sels = [
      'div[itemprop="description"]','div[data-g-id="description"]',
      '.bGZUbe','.xWd7cb','.SfzRHd','.hAyfc','.JHTxub','.DWPxHb','.fnfR6c',
      '#detailInfo','#play-app-details','[data-testid="play-app-details"]',
      '.T4LgNb','#main-content','main','article','#fcxH9b','.N4Qw3'
    ];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && el.parentNode) return el;
    }
    return null;
  }

  function inject() {
    if (document.getElementById(BTN_ID)) return true;
    injectCSS();
    var target = findTarget();
    if (!target) return false;
    var card = buildCard();
    if (target.nextSibling) target.parentNode.insertBefore(card, target.nextSibling);
    else target.parentNode.appendChild(card);
    return true;
  }

  function tryInject(attempt) {
    if (attempt > MAX_RETRIES) return;
    if (inject()) return;
    setTimeout(function() { tryInject(attempt + 1); }, Math.min(200 * Math.pow(1.5, attempt), 3000));
  }

  tryInject(0);
  window.addEventListener('load', function() { setTimeout(function() { tryInject(0); }, 500); });

  var observer = new MutationObserver(function() {
    if (!document.getElementById(BTN_ID)) tryInject(0);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
