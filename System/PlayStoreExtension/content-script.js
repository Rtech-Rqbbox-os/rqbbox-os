(function() {
  'use strict';

  var BTN_ID = 'rqbbox-play-inject';
  var STYLE_ID = 'rqbbox-play-css';
  var MAX_RETRIES = 10;
  var SERVER_URL = 'http://127.0.0.1:19777';

  var APP = {
    name: 'RQBBOX OS',
    tagline: 'Portable USB Gaming Operating System',
    author: 'RhysTech',
    email: 'rhyscotton20@gmail.com',
    download: SERVER_URL + '/api/play-store/install',
    website: 'https://rtech-rqbbox-os.github.io/rqbbox-os/',
    github: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    infocard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
    version: 'v2.0.0'
  };

  var currentAppId = (location.pathname.match(/\/store\/(?:apps|games)\/details\?id=([^&]+)/) || [])[1] || new URLSearchParams(location.search).get('id') || '';

  function installToRQBBOX(pkgId, pkgName) {
    var btn = document.getElementById('rqbbox-install-btn');
    if (btn) { btn.textContent = 'Connecting to RQBBOX server...'; btn.style.opacity = '0.6'; btn.disabled = true; }

    fetch(SERVER_URL + '/api/play-store/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pkgId })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.ok) {
        if (btn) {
          if (data.downloaded) {
            btn.textContent = 'APK saved to RQBBOX USB!';
            btn.style.background = 'rgba(0,200,80,.2)';
            btn.style.color = '#4cff88';
          } else if (data.alreadyInstalled) {
            btn.textContent = 'Already on RQBBOX USB';
            btn.style.background = 'rgba(0,200,80,.15)';
            btn.style.color = '#4cff88';
          } else {
            btn.textContent = 'Added to RQBBOX';
            btn.style.background = 'rgba(0,200,80,.2)';
            btn.style.color = '#4cff88';
          }
          btn.disabled = false;
          btn.style.opacity = '1';
        }
        if (data.playStoreUrl) window.open(data.playStoreUrl, '_blank');
      } else {
        downloadDirect(pkgId, pkgName, btn);
      }
    })
    .catch(function() {
      downloadDirect(pkgId, pkgName, btn);
    });
  }

  function downloadDirect(pkgId, pkgName, btn) {
    if (!btn) return;
    btn.textContent = 'Downloading APK from APKPure...';
    btn.style.opacity = '0.6';
    btn.disabled = true;

    chrome.runtime.sendMessage({ action: 'download-apk', pkgId: pkgId, pkgName: pkgName }, function(resp) {
      if (resp && resp.ok) {
        btn.textContent = 'APK downloaded! Check your Downloads folder.';
        btn.style.background = 'rgba(0,200,80,.2)';
        btn.style.color = '#4cff88';
        btn.disabled = false;
        btn.style.opacity = '1';
        if (resp.message) console.log('RQBBOX:', resp.message);
      } else {
        btn.textContent = 'Download failed. Try again.';
        btn.style.opacity = '1';
        btn.style.background = 'rgba(255,100,50,.2)';
        btn.style.color = '#ff6633';
        btn.disabled = false;
      }
    });
  }

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    var css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = [
      '#' + BTN_ID + ' { all:initial;display:block;margin:16px 0!important;max-width:100%!important;clear:both; }',
      '#' + BTN_ID + ' * { all:revert; }',
      '#' + BTN_ID + ' .rqbbox-p-wrap { background:linear-gradient(135deg,rgba(10,12,18,.97),rgba(20,22,28,.95));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,212,255,.15);border-radius:12px;padding:16px 18px;box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;color:#fff!important;line-height:1.4!important;box-sizing:border-box!important; }',
      '#' + BTN_ID + ' .rqbbox-p-head { display:flex;align-items:center;gap:12px;margin-bottom:12px; }',
      '#' + BTN_ID + ' .rqbbox-p-logo { width:40px;height:40px;flex-shrink:0;border-radius:10px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#00d4ff; }',
      '#' + BTN_ID + ' .rqbbox-p-title { font-size:15px;font-weight:700;color:#fff; }',
      '#' + BTN_ID + ' .rqbbox-p-sub { font-size:11px;color:rgba(255,255,255,.45); }',
      '#' + BTN_ID + ' .rqbbox-p-desc { font-size:12px;line-height:1.5;color:rgba(255,255,255,.55);margin-bottom:12px; }',
      '#' + BTN_ID + ' .rqbbox-p-desc strong { color:#00d4ff; }',
      '#' + BTN_ID + ' .rqbbox-p-badges { display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px; }',
      '#' + BTN_ID + ' .rqbbox-p-badge { display:inline-block;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#00d4ff;text-transform:uppercase;letter-spacing:.3px;font-weight:600; }',
      '#' + BTN_ID + ' .rqbbox-p-grid { display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-bottom:12px;max-height:200px;overflow-y:auto; }',
      '#' + BTN_ID + ' .rqbbox-p-grid::-webkit-scrollbar { width:4px; }',
      '#' + BTN_ID + ' .rqbbox-p-grid::-webkit-scrollbar-track { background:rgba(255,255,255,.03);border-radius:4px; }',
      '#' + BTN_ID + ' .rqbbox-p-grid::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1);border-radius:4px; }',
      '#' + BTN_ID + ' .rqbbox-p-item { display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:6px;font-size:10px;color:rgba(255,255,255,.55);text-decoration:none;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);transition:all .2s; }',
      '#' + BTN_ID + ' .rqbbox-p-item:hover { background:rgba(0,212,255,.08);border-color:rgba(0,212,255,.15);color:#fff; }',
      '#' + BTN_ID + ' .rqbbox-p-current { background:rgba(0,212,255,.12)!important;border-color:rgba(0,212,255,.2)!important;color:#00d4ff!important; }',
      '#' + BTN_ID + ' .rqbbox-p-install-btn { display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;border:none;cursor:pointer;transition:all .2s;line-height:1;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.25);font-family:inherit; }',
      '#' + BTN_ID + ' .rqbbox-p-install-btn:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,212,255,.35); }',
      '#' + BTN_ID + ' .rqbbox-p-actions { display:flex;flex-wrap:wrap;gap:6px;margin-top:8px; }',
      '#' + BTN_ID + ' .rqbbox-p-btn { display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:6px;font-size:10px;font-weight:600;text-decoration:none;border:none;cursor:pointer;transition:all .2s;line-height:1; }',
      '#' + BTN_ID + ' .rqbbox-p-btn-ghost { background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.06); }',
      '#' + BTN_ID + ' .rqbbox-p-btn-ghost:hover { background:rgba(255,255,255,.08); }',
      '#' + BTN_ID + ' .rqbbox-p-footer { margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.04);font-size:9px;color:rgba(255,255,255,.25);display:flex;justify-content:space-between;flex-wrap:wrap; }',
      '#' + BTN_ID + ' .rqbbox-p-footer a { color:rgba(0,212,255,.5);text-decoration:none; }',
      '#' + BTN_ID + ' .rqbbox-p-footer a:hover { color:rgba(0,212,255,.8); }',
      '@media (max-width:600px) { #' + BTN_ID + ' .rqbbox-p-grid { grid-template-columns:1fr; } }'
    ].join('\n');
    document.head.appendChild(css);
  }

  var PKGS = [
    ['com.activision.callofduty.shooter','Call of Duty Mobile','FPS','🎯'],
    ['com.miHoYo.GenshinImpact','Genshin Impact','RPG','⚔️'],
    ['com.tencent.ig','PUBG Mobile','FPS','🎯'],
    ['com.mojang.minecraftpe','Minecraft','Sandbox','🏗️'],
    ['com.gameloft.android.ANMP.GloftA9HM','Asphalt 9','Racing','🏎️'],
    ['com.roblox.client','Roblox','Sandbox','🏗️'],
    ['com.mobile.legends','Mobile Legends','MOBA','⚔️'],
    ['com.supercell.clashroyale','Clash Royale','Strategy','🛡️'],
    ['com.innersloth.spacemafia','Among Us','Party','🎭'],
    ['com.epicgames.fortnite','Fortnite','FPS','🎯'],
    ['com.riotgames.league.wildrift','Wild Rift','MOBA','⚔️'],
    ['com.kiloo.subwaysurf','Subway Surfers','Arcade','🏃'],
    ['com.android.chrome','Google Chrome','Browser','🌐'],
    ['com.termux','Termux','Tool','💻'],
    ['org.videolan.vlc','VLC Media Player','Media','📺'],
    ['org.fdroid.fdroid','F-Droid','Store','📦'],
    ['com.valvesoftware.steamlink','Steam Link','Gaming','🎮'],
    ['com.limelight','Moonlight','Gaming','🎮'],
    ['com.rarlab.rar','ZArchiver','Tool','🗜️'],
    ['com.joaomgcd.autonotification','Tasker','Tool','⚡'],
    ['com.google.android.apps.maps','Google Maps','Navigation','🗺️'],
    ['com.whatsapp','WhatsApp','Social','💬'],
    ['com.instagram.android','Instagram','Social','📸'],
    ['com.snapchat.android','Snapchat','Social','👻'],
    ['org.telegram.messenger','Telegram','Social','✈️'],
    ['com.microsoft.office.outlook','Outlook','Productivity','📧'],
    ['com.google.android.keep','Google Keep','Productivity','📝'],
    ['com.microsoft.office.officehubrow','Microsoft 365','Productivity','📊'],
    ['com.adobe.reader','Adobe Reader','Productivity','📄'],
    ['com.google.android.apps.photos','Google Photos','Media','🖼️'],
    ['com.zhiliaoapp.musically','TikTok','Social','🎵']
  ];

  function buildCard() {
    var appName = 'this app';
    var sels = ['h1[itemprop="name"]','h1[aria-label]','.Fd93Bb h1','.qmmlRd','h1 span','[data-g-name]','h1'];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && el.textContent.trim()) { appName = el.textContent.trim(); break; }
    }

    var items = PKGS.map(function(p) {
      var cls = (p[0] === currentAppId) ? ' rqbbox-p-current' : '';
      var tag = (p[0] === currentAppId) ? ' ●' : '';
      return '<a class="rqbbox-p-item' + cls + '" href="https://play.google.com/store/apps/details?id=' + p[0] + '" target="_blank">' +
        '<span>' + p[3] + '</span>' +
        '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p[1] + '</span>' +
        '<span style="color:rgba(255,255,255,.2);font-size:8px">' + p[2] + tag + '</span></a>';
    }).join('');

    var w = document.createElement('div');
    w.id = BTN_ID;
    w.innerHTML =
      '<div class="rqbbox-p-wrap">' +
        '<div class="rqbbox-p-head">' +
          '<div class="rqbbox-p-logo">R</div>' +
          '<div><div class="rqbbox-p-title">' + APP.name + ' &mdash; Server Install</div>' +
          '<div class="rqbbox-p-sub">by ' + APP.author + ' &bull; ' + APP.version + ' &bull; ' + PKGS.length + ' packages</div></div>' +
        '</div>' +
        '<div class="rqbbox-p-desc"><strong style="color:#00d4ff">' + appName + '</strong> &bull; Download APK to RQBBOX USB. Server saves app to Store/downloads/ then opens Play Store.</div>' +
        '<div class="rqbbox-p-badges">' +
          '<span class="rqbbox-p-badge">⚡ USB Install</span>' +
          '<span class="rqbbox-p-badge">🔓 Open Source</span>' +
          '<span class="rqbbox-p-badge">⚙️ RQBBOX Kernel</span>' +
          '<span class="rqbbox-p-badge">🎮 ' + PKGS.length + ' Apps</span>' +
        '</div>' +
        '<button id="rqbbox-install-btn" class="rqbbox-p-install-btn" data-pkg="' + currentAppId + '" data-name="' + appName + '">⬇ Download APK to RQBBOX USB</button>' +
        '<div class="rqbbox-p-grid">' + items + '</div>' +
        '<div class="rqbbox-p-actions">' +
          '<a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.website + '" target="_blank">🌐 Website</a>' +
          '<a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.github + '" target="_blank">⬇ GitHub Download</a>' +
          '<a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.infocard + '" target="_blank">📋 Info</a>' +
        '</div>' +
        '<div class="rqbbox-p-footer">' +
          '<span>by ' + APP.author + ' &bull; MIT</span>' +
          '<span><a href="mailto:rhyscotton20@gmail.com">📧 rhyscotton20@gmail.com</a></span>' +
        '</div>' +
      '</div>';

    // Attach install handler after element is in DOM
    setTimeout(function() {
      var btn = document.getElementById('rqbbox-install-btn');
      if (btn) {
        btn.addEventListener('click', function() {
          installToRQBBOX(btn.getAttribute('data-pkg'), btn.getAttribute('data-name'));
        });
      }
    }, 50);

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
      if (el && el.parentNode) return { target: el, position: 'before' };
    }
    // Fallback: top of body
    if (document.body && document.body.firstChild) return { target: document.body.firstChild, position: 'before' };
    return null;
  }

  function inject() {
    if (document.getElementById(BTN_ID)) return true;
    injectCSS();
    var found = findTarget();
    if (!found) return false;
    var card = buildCard();
    found.target.parentNode.insertBefore(card, found.target);
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
