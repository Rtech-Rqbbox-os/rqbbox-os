// ==UserScript==
// @name         RQBBOX OS - All Apps and Games on Google Play
// @namespace    https://github.com/Rtech-Rqbbox-os/rqbbox-os
// @version      2.1.0
// @description  Shows all 31 RQBBOX OS supported apps and games on every Google Play Store page. Browse, click, and download.
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
    name: 'RQBBOX OS',
    author: 'RhysTech',
    email: 'rhyscotton20@gmail.com',
    download: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    github: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
    website: 'https://rtech-rqbbox-os.github.io/rqbbox-os/',
    infocard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html'
  };

  var PKGS = [
    ['com.activision.callofduty.shooter','Call of Duty Mobile','FPS'],
    ['com.miHoYo.GenshinImpact','Genshin Impact','RPG'],
    ['com.tencent.ig','PUBG Mobile','FPS'],
    ['com.mojang.minecraftpe','Minecraft','Sandbox'],
    ['com.gameloft.android.ANMP.GloftA9HM','Asphalt 9','Racing'],
    ['com.roblox.client','Roblox','Sandbox'],
    ['com.mobile.legends','Mobile Legends','MOBA'],
    ['com.supercell.clashroyale','Clash Royale','Strategy'],
    ['com.innersloth.spacemafia','Among Us','Party'],
    ['com.epicgames.fortnite','Fortnite','FPS'],
    ['com.riotgames.league.wildrift','Wild Rift','MOBA'],
    ['com.kiloo.subwaysurf','Subway Surfers','Arcade'],
    ['com.android.chrome','Chrome','Browser'],
    ['com.termux','Termux','Tool'],
    ['org.videolan.vlc','VLC Media Player','Media'],
    ['org.fdroid.fdroid','F-Droid','Store'],
    ['com.valvesoftware.steamlink','Steam Link','Gaming'],
    ['com.limelight','Moonlight','Gaming'],
    ['com.rarlab.rar','ZArchiver','Tool'],
    ['com.joaomgcd.autonotification','Tasker','Tool'],
    ['com.google.android.apps.maps','Google Maps','Navigation'],
    ['com.whatsapp','WhatsApp','Social'],
    ['com.instagram.android','Instagram','Social'],
    ['com.snapchat.android','Snapchat','Social'],
    ['org.telegram.messenger','Telegram','Social'],
    ['com.microsoft.office.outlook','Outlook','Productivity'],
    ['com.google.android.keep','Google Keep','Productivity'],
    ['com.microsoft.office.officehubrow','Microsoft 365','Productivity'],
    ['com.adobe.reader','Adobe Reader','Productivity'],
    ['com.google.android.apps.photos','Google Photos','Media'],
    ['com.zhiliaoapp.musically','TikTok','Social']
  ];

  function getCurrId() {
    var m = location.pathname.match(/\/store\/(?:apps|games)\/details\?id=([^&]+)/);
    if (m) return m[1];
    var s = new URLSearchParams(location.search).get('id');
    if (s) return s;
    return '';
  }

  function inject() {
    if (document.getElementById(BTN_ID)) return;

    var currId = getCurrId();

    var itemsHtml = '';
    for (var i = 0; i < PKGS.length; i++) {
      var pkg = PKGS[i];
      var isActive = (pkg[0] === currId);
      var style = isActive
        ? 'border:1px solid rgba(0,212,255,0.3);background:rgba(0,212,255,0.12);color:#00d4ff'
        : 'color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.04)';
      var dot = isActive ? ' <span style="color:#00d4ff;font-size:8px">CURRENT</span>' : '';
      itemsHtml += '<a href="https://play.google.com/store/apps/details?id=' + pkg[0] + '" style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:6px;font-size:10px;text-decoration:none;background:rgba(255,255,255,0.02);' + style + '">'
        + '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + pkg[1] + '</span>'
        + '<span style="color:rgba(255,255,255,0.3);font-size:8px">' + pkg[2] + dot + '</span></a>';
    }

    var card = document.createElement('div');
    card.id = BTN_ID;
    card.style.cssText = 'all:initial;display:block;margin:12px auto;max-width:960px;clear:both';

    card.innerHTML = '<div style="background:linear-gradient(135deg,rgba(10,12,18,0.97),rgba(20,22,28,0.95));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,212,255,0.15);border-radius:12px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#fff;line-height:1.4">'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
        + '<div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#00d4ff">R</div>'
        + '<div><div style="font-size:13px;font-weight:700;color:#fff">' + APP.name + ' - All Apps and Games</div><div style="font-size:10px;color:rgba(255,255,255,0.4)">' + PKGS.length + ' supported packages by ' + APP.author + '</div></div>'
      + '</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:8px">Click Install to add to your RQBBOX USB via local server (127.0.0.1:19777) or open on Play Store.</div>'
      + '<button id="rqbbox-install-us" style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:8px 14px;border-radius:8px;font-size:11px;font-weight:700;border:none;cursor:pointer;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;font-family:inherit;margin-bottom:8px" data-pkg="' + currId + '">Install to RQBBOX OS via Server</button>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-bottom:8px;max-height:200px;overflow-y:auto">' + itemsHtml + '</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:4px">'
        + '<a href="' + APP.github + '" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.06)">GitHub</a>'
        + '<a href="' + APP.website + '" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.06)">Website</a>'
        + '<a href="' + APP.infocard + '" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.06)">Info</a>'
      + '</div>'
      + '<div style="margin-top:6px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.04);font-size:8px;color:rgba(255,255,255,0.2);display:flex;justify-content:space-between">'
        + '<span>' + APP.author + ' - MIT</span>'
        + '<span><a href="mailto:rhyscotton20@gmail.com" style="color:rgba(0,212,255,0.4);text-decoration:none">rhyscotton20@gmail.com</a></span>'
      + '</div>'
    + '</div>';

    var btn = card.querySelector('#rqbbox-install-us');
    if (btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-pkg');
        if (!id) { window.open(APP.github + '/releases', '_blank'); return; }
        btn.textContent = 'Installing...';
        btn.style.opacity = '0.6';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', SRV + '/api/play-store/install', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
          try {
            var d = JSON.parse(xhr.responseText);
            if (d.ok) {
              btn.textContent = 'Installed! Opening Play Store...';
              btn.style.background = 'rgba(0,200,80,0.2)';
              btn.style.color = '#4cff88';
              btn.style.border = 'none';
              if (d.playStoreUrl) window.open(d.playStoreUrl, '_blank');
            } else {
              btn.textContent = 'Install to RQBBOX OS via Server';
              btn.style.opacity = '1';
              window.open(APP.github + '/releases', '_blank');
            }
          } catch(e) {
            btn.textContent = 'Install to RQBBOX OS via Server';
            btn.style.opacity = '1';
            window.open(APP.github + '/releases', '_blank');
          }
        };
        xhr.onerror = function() {
          btn.textContent = 'Install to RQBBOX OS via Server';
          btn.style.opacity = '1';
          window.open(APP.github + '/releases', '_blank');
        };
        xhr.send(JSON.stringify({ id: id }));
      });
    }

    var targets = [
      'div[itemprop="description"]',
      '[data-g-id="description"]',
      '.bGZUbe',
      '.SfzRHd',
      '.hAyfc',
      '.JHTxub',
      '.fnfR6c',
      '#detailInfo',
      '#play-app-details',
      '[data-testid="play-app-details"]',
      '.T4LgNb',
      '#main-content',
      'main',
      'article'
    ];

    for (var i = 0; i < targets.length; i++) {
      var el = document.querySelector(targets[i]);
      if (el && el.parentNode) {
        if (el.nextSibling) {
          el.parentNode.insertBefore(card, el.nextSibling);
        } else {
          el.parentNode.appendChild(card);
        }
        return;
      }
    }

    if (document.body && document.body.firstChild) {
      document.body.insertBefore(card, document.body.firstChild);
    } else if (document.body) {
      document.body.appendChild(card);
    }
  }

  inject();

  var delays = [500, 1000, 2000, 3000, 5000];
  for (var d = 0; d < delays.length; d++) {
    (function(t) {
      setTimeout(inject, t);
    })(delays[d]);
  }

  var obs = new MutationObserver(function() {
    if (!document.getElementById(BTN_ID)) inject();
  });
  setTimeout(function() {
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }, 100);
})();
