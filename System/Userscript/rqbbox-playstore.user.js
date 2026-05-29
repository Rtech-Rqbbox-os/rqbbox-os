// ==UserScript==
// @name         RQBBOX OS — Download on Google Play Store
// @namespace    https://github.com/Rtech-Rqbbox-os/rqbbox-os
// @version      1.1.0
// @description  Adds "Available on RQBBOX OS" download button to every app/game on play.google.com. Injects at top of page + fallback.
// @author       RhysTech (rhyscotton20@gmail.com)
// @include      https://play.google.com/*
// @include      https://www.play.google.com/*
// @icon         https://play.google.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

console.log('RQBBOX: Play Store script loaded');

(function() {
  'use strict';

  var BTN_ID = 'rqbbox-play-us';

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

  function inject() {
    if (document.getElementById(BTN_ID)) {
      console.log('RQBBOX: Already injected');
      return;
    }

    var appName = 'this app';
    var sels = ['h1[itemprop="name"]','h1[aria-label]','.Fd93Bb h1','.qmmlRd','h1 span','[data-g-name]','h1'];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && el.textContent.trim()) { appName = el.textContent.trim(); break; }
    }

    console.log('RQBBOX: Injecting for app:', appName);

    var card = document.createElement('div');
    card.id = BTN_ID;
    card.style.cssText = 'all:initial;display:block;margin:16px auto!important;max-width:960px!important;clear:both;position:relative;z-index:9999';

    card.innerHTML =
      '<div style="background:linear-gradient(135deg,rgba(10,12,18,.97),rgba(20,22,28,.95));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(0,212,255,.15);border-radius:12px;padding:16px 18px;box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif!important;color:#fff!important;line-height:1.4!important;box-sizing:border-box!important">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">' +
          '<div style="width:40px;height:40px;flex-shrink:0;border-radius:10px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#00d4ff">R</div>' +
          '<div><div style="font-size:15px;font-weight:700;color:#fff">' + APP.name + '</div><div style="font-size:11px;color:rgba(255,255,255,.45)">' + APP.tagline + ' by ' + APP.author + ' &bull; ' + APP.version + '</div></div>' +
        '</div>' +
        '<div style="font-size:12px;line-height:1.5;color:rgba(255,255,255,.55);margin-bottom:10px"><strong style="color:#00d4ff">' + appName + '</strong> is also available on <strong style="color:#00d4ff">RQBBOX OS</strong> — a portable USB gaming OS powered by the <strong style="color:#00d4ff">RQBBOX Kernel</strong>. No installation required.</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">' +
          '<span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#00d4ff;text-transform:uppercase;letter-spacing:.3px;font-weight:600">⚡ USB Portable</span>' +
          '<span style="background:rgba(0,200,80,.08);border:1px solid rgba(0,200,80,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#4cff88;text-transform:uppercase;letter-spacing:.3px;font-weight:600">🔓 Open Source</span>' +
          '<span style="background:rgba(255,193,7,.08);border:1px solid rgba(255,193,7,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#ffc107;text-transform:uppercase;letter-spacing:.3px;font-weight:600">⚙️ RQBBOX Kernel</span>' +
          '<span style="background:rgba(157,78,221,.08);border:1px solid rgba(157,78,221,.1);padding:2px 8px;border-radius:100px;font-size:9px;color:#c084fc;text-transform:uppercase;letter-spacing:.3px;font-weight:600">🎮 Gaming OS</span>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
          '<a href="' + APP.download + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.25)">⬇ Download RQBBOX OS</a>' +
          '<a href="' + APP.website + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.06)">🌐 Website</a>' +
          '<a href="' + APP.infocard + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.06)">📋 Info Card</a>' +
        '</div>' +
        '<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.04);font-size:9px;color:rgba(255,255,255,.25);display:flex;justify-content:space-between;flex-wrap:wrap">' +
          '<span>by ' + APP.author + ' &bull; MIT &bull; ' + APP.version + '</span>' +
          '<span><a href="mailto:' + APP.email + '" style="color:rgba(0,212,255,.5);text-decoration:none">📧 ' + APP.email + '</a></span>' +
        '</div>' +
      '</div>';

    // Strategy 1: Insert after the main content
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
      'article',
      '#fcxH9b'
    ];

    var inserted = false;
    for (var i = 0; i < targets.length; i++) {
      var el = document.querySelector(targets[i]);
      if (el && el.parentNode) {
        if (el.nextSibling) {
          el.parentNode.insertBefore(card, el.nextSibling);
        } else {
          el.parentNode.appendChild(card);
        }
        inserted = true;
        console.log('RQBBOX: Injected after:', targets[i]);
        break;
      }
    }

    // Strategy 2: Inject at top of page content area
    if (!inserted) {
      var contentAreas = document.querySelectorAll('[role="main"], [role="main"] > div, .main-content, #fcxH9b, .N4Qw3, .T4LgNb');
      for (var i = 0; i < contentAreas.length; i++) {
        if (contentAreas[i] && contentAreas[i].parentNode) {
          if (contentAreas[i].parentNode.firstChild) {
            contentAreas[i].parentNode.insertBefore(card, contentAreas[i].parentNode.firstChild);
          } else {
            contentAreas[i].parentNode.appendChild(card);
          }
          inserted = true;
          console.log('RQBBOX: Injected at top of content area');
          break;
        }
      }
    }

    // Strategy 3: Desperate - inject before first child of body
    if (!inserted) {
      if (document.body.firstChild) {
        document.body.insertBefore(card, document.body.firstChild);
      } else {
        document.body.appendChild(card);
      }
      console.log('RQBBOX: Injected at body top (fallback)');
    }
  }

  // Immediate attempt
  inject();

  // Retry with delays for dynamic content
  var delays = [500, 1000, 2000, 3000, 5000];
  for (var i = 0; i < delays.length; i++) {
    (function(d) {
      setTimeout(function() { inject(); }, d);
    })(delays[i]);
  }

  // MutationObserver for DOM changes
  var obs = new MutationObserver(function() {
    if (!document.getElementById(BTN_ID)) inject();
  });
  setTimeout(function() {
    obs.observe(document.body, { childList: true, subtree: true });
  }, 100);
})();
