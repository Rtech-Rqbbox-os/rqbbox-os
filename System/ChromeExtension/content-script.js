(function() {
  'use strict';

  var CARD_ID = 'rqbbox-g-card';
  var RQ = {
    name: 'RQBBOX OS',
    ver: 'v1.2.0',
    tag: 'Portable USB Gaming Operating System',
    by: 'RhysTech',
    dl: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    gh: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
    card: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
    yt: 'https://www.youtube.com/@RQBBOX-REAL',
    email: 'rqbbox.support@groups.outlook.com',
    platforms: 'Windows, macOS, Linux, Android, iOS, KaiOS',
    features: [
      ['🎮', '6 Games', 'Racing, platformer, shooter, sandbox'],
      ['🛒', '43+ Packages', 'Store + full Google Play integration'],
      ['🎨', 'PS5 UI', 'Dark minimal, glassmorphism, scroll rows'],
      ['🔊', 'Pro Audio', '40+ synth sounds, 5 profiles, DSP'],
      ['📱', 'Phone Boot', 'Auto-detect brand, PWA guides'],
      ['👤', 'Multi-User', 'Auth, friends, achievements, sync'],
      ['🔌', 'Plugins', 'JS plugins, CSS themes, SDK tools'],
      ['📊', 'Hardware', 'Battery, WiFi, Bluetooth, storage']
    ]
  };

  function hasQuery() {
    var q = (new URLSearchParams(location.search)).get('q') || '';
    return q.toLowerCase().indexOf('rqbbox') !== -1;
  }

  function cardHTML() {
    var badges = ['Open Source', 'Free', 'PS5 UI', 'USB Gaming'].map(function(b) {
      return '<span style="background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.1);padding:2px 9px;border-radius:100px;font-size:10px;color:#00d4ff;text-transform:uppercase;letter-spacing:.3px;display:inline-block;margin:1px 2px 1px 0">' + b + '</span>';
    }).join('');

    var features = RQ.features.map(function(f) {
      return '<div style="padding:5px 8px;border-radius:6px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);font-size:11px;color:rgba(255,255,255,.5);line-height:1.4"><strong style="color:rgba(255,255,255,.7)">' + f[0] + ' ' + f[1] + '</strong><br><span style="font-size:10px;color:rgba(255,255,255,.35)">' + f[2] + '</span></div>';
    }).join('');

    return '<div id="' + CARD_ID + '" style="background:rgba(20,22,28,.96);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin:12px 0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#fff;max-width:652px;box-shadow:0 20px 60px rgba(0,0,0,.7)">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">' +
        '<svg width="42" height="42" viewBox="0 0 100 100" style="flex-shrink:0;border-radius:10px"><rect width="100" height="100" rx="20" fill="#0a0e1a" stroke="url(#rqg)" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-size="52" font-weight="800" fill="url(#rqg)" font-family="Segoe UI">R</text><defs><linearGradient id="rqg"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#9d4edd"/></linearGradient></defs></svg>' +
        '<div><div style="font-size:16px;font-weight:700">' + RQ.name + '</div><div style="font-size:11px;color:rgba(255,255,255,.4)">' + RQ.tag + ' by ' + RQ.by + '</div></div>' +
      '</div>' +
      '<div style="margin-bottom:10px">' + badges + '</div>' +
      '<div style="font-size:12px;line-height:1.5;color:rgba(255,255,255,.5);margin-bottom:10px">A portable USB-based gaming OS that runs entirely from a USB drive without installation. PS5-inspired UI, pro audio engine, 43+ store packages, phone bootloader. Works on ' + RQ.platforms + '.</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-bottom:10px">' + features + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:5px">' +
        '<a href="' + RQ.dl + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.2)">⬇ Download</a>' +
        '<a href="' + RQ.gh + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">GitHub</a>' +
        '<a href="' + RQ.card + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">Info Card</a>' +
      '</div>' +
      '<div style="padding-top:8px;margin-top:10px;border-top:1px solid rgba(255,255,255,.04);font-size:10px;color:rgba(255,255,255,.2);display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px">' +
        '<span>&copy; 2026 ' + RQ.by + ' &bull; MIT &bull; ' + RQ.ver + '</span>' +
        '<span style="display:flex;gap:6px"><a href="' + RQ.yt + '" target="_blank" style="color:rgba(0,212,255,.4);text-decoration:none">YouTube</a><a href="mailto:' + RQ.email + '" style="color:rgba(0,212,255,.4);text-decoration:none">Support</a></span>' +
      '</div></div>';
  }

  function inject() {
    if (!hasQuery()) return;
    if (document.getElementById(CARD_ID)) return;

    var validContainers = [
      '#rhs',                   // Google desktop right sidebar
      '#rhs_block',             // Alternative right sidebar
      '#search',                // Main search results
      '#center_col',            // Center column
      '#rso',                   // Search result objects
      '.srg',                   // Search result group
      'div[data-async-context]' // Async loaded results
    ];

    var target = null;
    for (var i = 0; i < validContainers.length; i++) {
      var el = document.querySelector(validContainers[i]);
      if (el) { target = el; break; }
    }

    if (!target) return;

    var card = document.createElement('div');
    card.id = CARD_ID;
    card.innerHTML = cardHTML();

    // Insert at top of right sidebar or search results
    if (target.id === 'rhs' || target.id === 'rhs_block') {
      target.insertBefore(card, target.firstChild);
    } else {
      target.insertBefore(card, target.firstChild);
    }
  }

  // Watch for Google's dynamic content loading
  var observer = new MutationObserver(function() {
    if (hasQuery() && !document.getElementById(CARD_ID)) {
      // Small delay to let Google's DOM settle
      setTimeout(inject, 300);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Run on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // Also run after window load (catches late-rendered content)
  window.addEventListener('load', function() {
    setTimeout(inject, 500);
  });
})();
