// ==UserScript==
// @name         RQBBOX OS — All Apps & Games on Google Play
// @namespace    https://github.com/Rtech-Rqbbox-os/rqbbox-os
// @version     2.1.0
// @description  Shows ALL 31 RQBBOX OS apps & games on every Google Play Store page. Browse, click, and download. Free.
// @author       RhysTech (rhyscotton20@gmail.com)
// @include      https://play.google.com/*
// @include      https://www.play.google.com/*
// @icon         https://play.google.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

console.log('RQBBOX: Loaded (v2.1.0)');

(function() {
  'use strict';

  var BTN_ID = 'rqbbox-play-us';
  var SRV = 'http://127.0.0.1:19777';
  var APP = {
    name: 'RQBBOX OS', tagline: 'Portable USB Gaming Operating System',
    author: 'RhysTech', email: 'rhyscotton20@gmail.com',
    download: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    website: 'https://rtech-rqbbox-os.github.io/rqbbox-os/',
    infocard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
    version: 'v1.2.0'
  };

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

  var currId = (location.pathname.match(/\/store\/(?:apps|games)\/details\?id=([^&]+)/) || [])[1] || new URLSearchParams(location.search).get('id') || '';

  function inject() {
    if (document.getElementById(BTN_ID)) return;

    var items = PKGS.map(function(p) {
      var act = (p[0] === currId) ? 'border:1px solid rgba(0,212,255,.3)!important;background:rgba(0,212,255,.12)!important;color:#00d4ff!important' : '';
      var tag = (p[0] === currId) ? ' <span style="color:#00d4ff;font-size:8px">●</span>' : '';
      return '<a href="https://play.google.com/store/apps/details?id=' + p[0] + '" style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:6px;font-size:10px;color:rgba(255,255,255,.55);text-decoration:none;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);transition:all .2s"' + (act ? ' style="' + act + '"' : '') + '><span>' + p[2] + '</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p[1] + '</span><span style="color:rgba(255,255,255,.2);font-size:8px">' + p[3] + tag + '</span></a>';
    }).join('');

    var card = document.createElement('div');
    card.id = BTN_ID;
    card.style.cssText = 'all:initial;display:block;margin:12px auto!important;max-width:960px!important;clear:both';
    card.innerHTML =
      '<div style="background:linear-gradient(135deg,rgba(10,12,18,.97),rgba(20,22,28,.95));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,212,255,.15);border-radius:12px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif!important;color:#fff!important;line-height:1.4!important;box-sizing:border-box!important">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
          '<div style="width:36px;height:36px;flex-shrink:0;border-radius:8px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#00d4ff">R</div>' +
          '<div><div style="font-size:13px;font-weight:700;color:#fff">' + APP.name + ' &mdash; All Apps & Games</div><div style="font-size:10px;color:rgba(255,255,255,.4)">' + PKGS.length + ' RQBBOX-supported packages &bull; by ' + APP.author + '</div></div>' +
        '</div>' +
        '<div style="font-size:11px;line-height:1.4;color:rgba(255,255,255,.5);margin-bottom:8px">Browse <strong style="color:#00d4ff">' + PKGS.length + ' RQBBOX-supported apps</strong>. Click <strong style="color:#00d4ff">Install to RQBBOX OS</strong> to add to your USB via local server <strong style="color:rgba(255,255,255,.3)">(127.0.0.1:19777)</strong> or open on Play Store.</div>' +
        '<button id="rqbbox-install-us" style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:8px 14px;border-radius:8px;font-size:11px;font-weight:700;border:none;cursor:pointer;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.25);font-family:inherit;margin-bottom:8px" data-pkg="' + currId + '">⬇ Install to RQBBOX OS via Server</button>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-bottom:8px;max-height:200px;overflow-y:auto">' + items + '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px">' +
          '<a href="' + APP.github + '" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.06)">⬇ GitHub Download</a>' +
          '<a href="' + APP.website + '" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.06)">🌐 Website</a>' +
          '<a href="' + APP.infocard + '" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.06)">📋 Info</a>' +
        '</div>' +
        '<div style="margin-top:6px;padding-top:4px;border-top:1px solid rgba(255,255,255,.04);font-size:8px;color:rgba(255,255,255,.2);display:flex;justify-content:space-between">' +
          '<span>' + APP.author + ' &bull; MIT</span>' +
          '<span><a href="mailto:rhyscotton20@gmail.com" style="color:rgba(0,212,255,.4);text-decoration:none">📧 rhyscotton20@gmail.com</a></span>' +
        '</div>' +
      '</div>';

  // Attach install handler for the button
  setTimeout(function() {
    var btn = document.getElementById('rqbbox-install-us');
    if (btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-pkg');
        if (!id) return;
        btn.textContent = '⏳ Installing to RQBBOX...';
        btn.style.opacity = '0.6';
        fetch('http://127.0.0.1:19777/api/play-store/install', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d.ok) {
            btn.textContent = '✅ Installed! Opening Play Store...';
            btn.style.background = 'rgba(0,200,80,.2)'; btn.style.color = '#4cff88';
            if (d.playStoreUrl) window.open(d.playStoreUrl, '_blank');
          } else {
            btn.textContent = '⬇ Install to RQBBOX OS via Server';
            btn.style.opacity = '1'; window.open('https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases', '_blank');
          }
        }).catch(function() {
          btn.textContent = '⬇ Install to RQBBOX OS via Server';
          btn.style.opacity = '1'; window.open('https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases', '_blank');
        });
      });
    }
  }, 200);

  // Try to insert after description or main content
    var targets = ['div[itemprop="description"]','[data-g-id="description"]','.bGZUbe','.SfzRHd','.hAyfc','.JHTxub','.fnfR6c','#detailInfo','#play-app-details','[data-testid="play-app-details"]','.T4LgNb','#main-content','main','article','#fcxH9b','.N4Qw3'];
    for (var i = 0; i < targets.length; i++) {
      var el = document.querySelector(targets[i]);
      if (el && el.parentNode) {
        if (el.nextSibling) el.parentNode.insertBefore(card, el.nextSibling);
        else el.parentNode.appendChild(card);
        return;
      }
    }
    // Fallback: top of body
    if (document.body.firstChild) document.body.insertBefore(card, document.body.firstChild);
    else document.body.appendChild(card);
  }

  inject();
  for (var d = 0; d < [500,1000,2000,3000,5000].length; d++) { (function(t) { setTimeout(inject, t); })([500,1000,2000,3000,5000][d]); }
  var obs = new MutationObserver(function() { if (!document.getElementById(BTN_ID)) inject(); });
  setTimeout(function() { obs.observe(document.body, { childList: true, subtree: true }); }, 100);
})();
