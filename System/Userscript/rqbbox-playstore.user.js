// ==UserScript==
// @name         RQBBOX OS — Download on Google Play Store
// @namespace    https://github.com/Rtech-Rqbbox-os/rqbbox-os
// @version      1.0.0
// @description  Adds an "Available on RQBBOX OS" download button to every app and game on Google Play Store. Works on play.google.com. Free, no installation needed.
// @author       RhysTech (rhyscotton20@gmail.com)
// @match        https://play.google.com/store/apps/details*
// @match        https://play.google.com/store/games/details*
// @match        https://www.play.google.com/store/apps/details*
// @match        https://www.play.google.com/store/games/details*
// @icon         https://play.google.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  var APP = {
    name: 'RQBBOX OS',
    tagline: 'Portable USB Gaming Operating System',
    author: 'RhysTech',
    email: 'rhyscotton20@gmail.com',
    download: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    website: 'https://rtech-rqbbox-os.github.io/rqbbox-os/',
    infocard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
    github: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
    support: 'rqbbox.support@groups.outlook.com'
  };

  var BTN_ID = 'rqbbox-play-us';

  function getAppName() {
    var el = document.querySelector('h1[itemprop="name"], h1');
    return el ? el.textContent.trim() : 'this app';
  }

  function inject() {
    if (document.getElementById(BTN_ID)) return;
    var appName = getAppName();

    var w = document.createElement('div');
    w.id = BTN_ID;
    w.style.cssText = 'margin:16px 0;padding:0;border:none;background:none;width:100%';
    w.innerHTML =
      '<div style="background:linear-gradient(135deg,rgba(10,12,18,.97),rgba(20,22,28,.95));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,212,255,.15);border-radius:12px;padding:16px 18px;box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#fff">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">' +
          '<div style="width:40px;height:40px;flex-shrink:0;border-radius:10px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#00d4ff;font-family:Segoe UI">R</div>' +
          '<div><div style="font-size:14px;font-weight:600;color:#fff">' + APP.name + '</div><div style="font-size:11px;color:rgba(255,255,255,.4)">' + APP.tagline + ' by ' + APP.author + '</div></div>' +
        '</div>' +
        '<div style="font-size:12px;line-height:1.5;color:rgba(255,255,255,.5);margin-bottom:10px">' + appName + ' is also available on <strong style="color:#00d4ff;">RQBBOX OS</strong> — a portable USB gaming operating system. No installation needed. Plug in your USB and play.</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">' +
          '<span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#00d4ff;text-transform:uppercase;letter-spacing:.3px">⚡ USB Portable</span>' +
          '<span style="background:rgba(0,200,80,.08);border:1px solid rgba(0,200,80,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#4cff88;text-transform:uppercase;letter-spacing:.3px">🔓 Open Source</span>' +
          '<span style="background:rgba(255,193,7,.08);border:1px solid rgba(255,193,7,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#ffc107;text-transform:uppercase;letter-spacing:.3px">⚙️ RQBBOX Kernel</span>' +
          '<span style="background:rgba(157,78,221,.08);border:1px solid rgba(157,78,221,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#c084fc;text-transform:uppercase;letter-spacing:.3px">🎮 Gaming OS</span>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
          '<a href="' + APP.download + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.2)">⬇ Download RQBBOX OS</a>' +
          '<a href="' + APP.website + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.06)">🌐 Website</a>' +
          '<a href="' + APP.infocard + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.06)">📋 Info</a>' +
        '</div>' +
        '<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.04);font-size:9px;color:rgba(255,255,255,.2);display:flex;justify-content:space-between;flex-wrap:wrap">' +
          '<span>by ' + APP.author + ' &bull; MIT</span>' +
          '<span><a href="mailto:' + APP.email + '" style="color:rgba(0,212,255,.4);text-decoration:none">📧 ' + APP.email + '</a></span>' +
        '</div>' +
      '</div>';

    var targets = [
      'div[itemprop="description"]',
      '.hAyfc', '.bGZUbe', '.SfzRHd', '.JHTxub',
      '#main-content', 'main', '.T4LgNb'
    ];
    var insertAfter = null;
    for (var i = 0; i < targets.length; i++) {
      var el = document.querySelector(targets[i]);
      if (el && el.parentNode) { insertAfter = el; break; }
    }
    if (insertAfter && insertAfter.parentNode) {
      insertAfter.parentNode.insertBefore(w, insertAfter.nextSibling);
    } else {
      (document.querySelector('#main-content, main, .T4LgNb, article') || document.body).insertBefore(w, document.body.firstChild);
    }
  }

  inject();
  var obs = new MutationObserver(function() {
    if (!document.getElementById(BTN_ID)) setTimeout(inject, 500);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
