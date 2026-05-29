// ==UserScript==
// @name         RQBBOX OS — Download on Google Play Store
// @namespace    https://github.com/Rtech-Rqbbox-os/rqbbox-os
// @version      1.0.0
// @description  Adds "Available on RQBBOX OS" button to every app/game on play.google.com. Works on all browsers with Tampermonkey. Free, no installation needed.
// @author       RhysTech (rhyscotton20@gmail.com)
// @match        https://play.google.com/store/apps/details*
// @match        https://play.google.com/store/games/details*
// @match        https://www.play.google.com/store/apps/details*
// @match        https://www.play.google.com/store/games/details*
// @icon         https://play.google.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  var BTN_ID = 'rqbbox-play-us';
  var MAX_RETRIES = 8;

  var APP = {
    name: 'RQBBOX OS',
    tagline: 'Portable USB Gaming Operating System',
    author: 'RhysTech',
    email: 'rhyscotton20@gmail.com',
    download: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    website: 'https://rtech-rqbbox-os.github.io/rqbbox-os/',
    infocard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
    github: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
    youtube: 'https://www.youtube.com/@RQBBOX-REAL',
    support: 'rqbbox.support@groups.outlook.com',
    version: 'v1.2.0'
  };

  function getAppName() {
    var sels = ['h1[itemprop="name"]','h1[aria-label]','.Fd93Bb h1','.qmmlRd','h1 span','[data-g-name]','h1'];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return 'this app';
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

  function buildCard(appName) {
    var w = document.createElement('div');
    w.id = BTN_ID;
    w.style.cssText = 'all:initial;display:block;margin:16px 0!important;max-width:100%!important;clear:both';
    w.innerHTML =
      '<div style="background:linear-gradient(135deg,rgba(10,12,18,.97),rgba(20,22,28,.95));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,212,255,.15);border-radius:12px;padding:16px 18px;box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif!important;color:#fff!important;line-height:1.4!important;box-sizing:border-box!important">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">' +
          '<div style="width:40px;height:40px;flex-shrink:0;border-radius:10px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#00d4ff">R</div>' +
          '<div><div style="font-size:15px;font-weight:700;color:#fff">' + APP.name + '</div><div style="font-size:11px;color:rgba(255,255,255,.45)">' + APP.tagline + ' by ' + APP.author + ' &bull; ' + APP.version + '</div></div>' +
        '</div>' +
        '<div style="font-size:12px;line-height:1.5;color:rgba(255,255,255,.55);margin-bottom:10px"><strong style="color:#00d4ff">' + appName + '</strong> is also available on <strong style="color:#00d4ff">RQBBOX OS</strong> — a portable USB gaming operating system powered by the <strong style="color:#00d4ff">RQBBOX Kernel</strong> (modular microkernel with process manager, memory manager, file system, device drivers, system call API). No installation required — plug in your USB and play.</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">' +
          '<span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#00d4ff;text-transform:uppercase;letter-spacing:.3px;font-weight:600">⚡ USB Portable</span>' +
          '<span style="background:rgba(0,200,80,.08);border:1px solid rgba(0,200,80,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#4cff88;text-transform:uppercase;letter-spacing:.3px;font-weight:600">🔓 Open Source</span>' +
          '<span style="background:rgba(255,193,7,.08);border:1px solid rgba(255,193,7,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#ffc107;text-transform:uppercase;letter-spacing:.3px;font-weight:600">⚙️ RQBBOX Kernel</span>' +
          '<span style="background:rgba(157,78,221,.08);border:1px solid rgba(157,78,221,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#c084fc;text-transform:uppercase;letter-spacing:.3px;font-weight:600">🎮 Gaming OS</span>' +
          '<span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#00d4ff;text-transform:uppercase;letter-spacing:.3px;font-weight:600">🔌 Plugin SDK</span>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
          '<a href="' + APP.download + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.25)">⬇ Download RQBBOX OS</a>' +
          '<a href="' + APP.website + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.06)">🌐 Website</a>' +
          '<a href="' + APP.infocard + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.06)">📋 Info Card</a>' +
          '<a href="' + APP.github + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.06)">🐙 GitHub</a>' +
        '</div>' +
        '<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.04);font-size:9px;color:rgba(255,255,255,.25);display:flex;justify-content:space-between;flex-wrap:wrap">' +
          '<span>by ' + APP.author + ' &bull; MIT &bull; ' + APP.version + '</span>' +
          '<span><a href="mailto:' + APP.email + '" style="color:rgba(0,212,255,.5);text-decoration:none">📧 ' + APP.email + '</a> &bull; <a href="' + APP.youtube + '" target="_blank" style="color:rgba(0,212,255,.5);text-decoration:none">▶ YouTube</a></span>' +
        '</div>' +
      '</div>';
    return w;
  }

  function inject() {
    if (document.getElementById(BTN_ID)) return;
    var appName = getAppName();
    var target = findTarget();
    if (!target) return false;
    var card = buildCard(appName);
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

  var obs = new MutationObserver(function() {
    if (!document.getElementById(BTN_ID)) tryInject(0);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
