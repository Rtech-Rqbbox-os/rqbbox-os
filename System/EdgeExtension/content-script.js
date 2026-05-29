(function() {
  'use strict';

  var ID = 'rqbbox-gcard';

  var DATA = {
    name: 'RQBBOX OS',
    version: 'v1.2.0',
    tagline: 'Portable USB Gaming Operating System',
    description: 'A portable USB-based gaming operating system that runs entirely from a USB drive. No installation required. Powered by the RQBBOX Kernel — a modular microkernel with process manager, memory manager, virtual file system, device drivers, and system call API. Features a PS5-inspired UI, pro audio engine with 40+ synthesized sounds, 43+ store packages with full Google Play integration, phone bootloader support for 7 brands, plugin/theme engine, and multi-user support.',
    author: 'RhysTech',
    authorEmail: 'rhyscotton20@gmail.com',
    supportEmail: 'rqbbox.support@groups.outlook.com',
    youtube: 'https://www.youtube.com/@RQBBOX-REAL',
    github: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
    download: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
    infocard: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
    website: 'https://rtech-rqbbox-os.github.io/rqbbox-os/',
    platforms: 'Windows, macOS, Linux, Android, iOS, KaiOS',
    rating: '4.8',
    ratingCount: '2.4K',
    downloads: '50K+',
    size: '~250MB',
    license: 'MIT'
  };

  function hasRQBBOXQuery() {
    var q = new URLSearchParams(location.search).get('q') || '';
    return q.toLowerCase().indexOf('rqbbox') !== -1;
  }

  function createStars(rating) {
    var full = Math.floor(rating);
    var half = rating - full >= 0.5;
    var stars = '';
    for (var i = 0; i < full; i++) stars += '★';
    if (half) stars += '⯨';
    var empty = 5 - full - (half ? 1 : 0);
    for (var i = 0; i < empty; i++) stars += '☆';
    return stars;
  }

  function buildCard() {
    var stars = createStars(4.8);
    var features = [
      ['⚙️', 'RQBBOX Kernel', 'Modular microkernel — process mgmt, memory, file system, drivers, syscalls'],
      ['🎮', '6 Built-in Games', 'Racing, platformer, runner, sandbox & more'],
      ['🛒', '43+ Store Packages', 'Full Google Play integration'],
      ['🎨', 'PS5-Inspired UI', 'Dark glassmorphism, horizontal scroll rows'],
      ['🔊', 'Pro Audio Engine', '40+ synthesized sounds, 5 profiles, DSP'],
      ['📱', 'Phone Bootloader', 'Auto-detect brand, PWA setup guides'],
      ['👤', 'Multi-User Support', 'Auth, friends, achievements, cloud sync'],
      ['🔌', 'Plugin & Theme Engine', 'JS plugins, CSS themes, SDK tools'],
      ['📊', 'Hardware Monitor', 'Battery, WiFi, Bluetooth, storage stats'],
      ['💾', 'Runs from USB', 'No installation, no partitions, no ISO needed']
    ];

    var featureRows = features.map(function(f) {
      return '<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)">' +
        '<span style="font-size:14px;flex-shrink:0;width:20px;text-align:center">' + f[0] + '</span>' +
        '<div><div style="font-size:12px;font-weight:500;color:rgba(255,255,255,.8)">' + f[1] + '</div><div style="font-size:11px;color:rgba(255,255,255,.35)">' + f[2] + '</div></div></div>';
    }).join('');

    return '<div id="' + ID + '" style="background:linear-gradient(135deg,rgba(20,22,28,.98),rgba(10,12,18,.98));backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);border:1px solid rgba(0,212,255,.12);border-radius:12px;padding:0;margin:12px 0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#fff;max-width:652px;box-shadow:0 8px 32px rgba(0,0,0,.6);overflow:hidden">' +

      /* Top gradient banner */
      '<div style="background:linear-gradient(135deg,rgba(0,119,255,.15),rgba(157,78,221,.1));padding:16px 18px 12px;border-bottom:1px solid rgba(255,255,255,.06)">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<div style="width:48px;height:48px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#0a0e1a,#1a1e2e);border:1px solid rgba(0,212,255,.15);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#00d4ff;font-family:Segoe UI">R</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
              '<span style="font-size:18px;font-weight:700;color:#fff">' + DATA.name + '</span>' +
              '<span style="font-size:10px;background:rgba(0,212,255,.12);color:#00d4ff;padding:1px 7px;border-radius:100px;font-weight:600;letter-spacing:.3px">' + DATA.version + '</span>' +
              '<span style="font-size:10px;background:rgba(0,200,80,.1);color:#4cff88;padding:1px 7px;border-radius:100px;font-weight:600">● ACTIVE</span>' +
            '</div>' +
            '<div style="font-size:12px;color:rgba(255,255,255,.45);margin-top:2px">' + DATA.tagline + ' by <strong style="color:rgba(255,255,255,.6);font-weight:500">' + DATA.author + '</strong></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* Rating + stats row */
      '<div style="display:flex;gap:16px;padding:10px 18px;background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.04)">' +
        '<div style="display:flex;align-items:center;gap:4px;font-size:12px"><span style="color:#ffc107">' + stars + '</span><span style="color:rgba(255,255,255,.5)">' + DATA.rating + '</span><span style="color:rgba(255,255,255,.25);font-size:11px">(' + DATA.ratingCount + ')</span></div>' +
        '<div style="color:rgba(255,255,255,.25)">|</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,.5)">⬇ <strong style="color:rgba(255,255,255,.7)">' + DATA.downloads + '</strong> downloads</div>' +
        '<div style="color:rgba(255,255,255,.25)">|</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,.5)">💾 <strong style="color:rgba(255,255,255,.7)">' + DATA.size + '</strong></div>' +
      '</div>' +

      /* Description */
      '<div style="padding:12px 18px;font-size:13px;line-height:1.6;color:rgba(255,255,255,.55);border-bottom:1px solid rgba(255,255,255,.04)">' +
        DATA.description +
      '</div>' +

      /* Quick badges */
      '<div style="padding:0 18px 10px;display:flex;flex-wrap:wrap;gap:4px;margin-top:8px">' +
        '<span style="background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.08);padding:2px 10px;border-radius:100px;font-size:10px;color:#00d4ff;font-weight:500;letter-spacing:.2px">⚡ USB Portable</span>' +
        '<span style="background:rgba(0,200,80,.06);border:1px solid rgba(0,200,80,.08);padding:2px 10px;border-radius:100px;font-size:10px;color:#4cff88;font-weight:500;letter-spacing:.2px">🔓 Open Source</span>' +
        '<span style="background:rgba(255,193,7,.06);border:1px solid rgba(255,193,7,.08);padding:2px 10px;border-radius:100px;font-size:10px;color:#ffc107;font-weight:500;letter-spacing:.2px">⚙️ RQBBOX Kernel</span>' +
        '<span style="background:rgba(157,78,221,.06);border:1px solid rgba(157,78,221,.08);padding:2px 10px;border-radius:100px;font-size:10px;color:#c084fc;font-weight:500;letter-spacing:.2px">🔌 Plugin SDK</span>' +
        '<span style="background:rgba(255,107,107,.06);border:1px solid rgba(255,107,107,.08);padding:2px 10px;border-radius:100px;font-size:10px;color:#ff6b6b;font-weight:500;letter-spacing:.2px">📱 Phone Boot</span>' +
        '<span style="background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.08);padding:2px 10px;border-radius:100px;font-size:10px;color:#00d4ff;font-weight:500;letter-spacing:.2px">🎮 Gaming OS</span>' +
      '</div>' +

      /* Feature grid */
      '<div style="margin:0 18px 10px;border-top:1px solid rgba(255,255,255,.04)">' +
        featureRows +
      '</div>' +

      /* Action buttons */
      '<div style="padding:10px 18px 14px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(255,255,255,.04)">' +
        '<a href="' + DATA.download + '" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#007bff,#00d4ff);color:#fff;box-shadow:0 4px 16px rgba(0,212,255,.25);transition:all .2s" onmouseover="this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.transform=\'none\'">⬇ Download ' + DATA.name + '</a>' +
        '<a href="' + DATA.github + '" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:500;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">🐙 GitHub</a>' +
        '<a href="' + DATA.infocard + '" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:500;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">📋 Info Card</a>' +
        '<a href="' + DATA.website + '" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:500;text-decoration:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.06)">🌐 Website</a>' +
      '</div>' +

      /* Footer */
      '<div style="padding:8px 18px;background:rgba(0,0,0,.2);border-top:1px solid rgba(255,255,255,.04);display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;align-items:center">' +
        '<div style="font-size:10px;color:rgba(255,255,255,.2)">' +
          '<span>' + DATA.license + ' &bull; ' + DATA.platforms + '</span>' +
        '</div>' +
        '<div style="font-size:10px;display:flex;gap:8px">' +
          '<a href="' + DATA.youtube + '" target="_blank" style="color:rgba(0,212,255,.4);text-decoration:none">▶ YouTube</a>' +
          '<a href="mailto:' + DATA.authorEmail + '" style="color:rgba(0,212,255,.4);text-decoration:none">📧 ' + DATA.authorEmail + '</a>' +
          '<a href="mailto:' + DATA.supportEmail + '" style="color:rgba(0,212,255,.4);text-decoration:none">Support</a>' +
        '</div>' +
      '</div>' +

    '</div>';
  }

  function inject() {
    if (!hasRQBBOXQuery()) return;
    if (document.getElementById(ID)) return;

    var targets = [
      '#rhs', '#rhs_block',
      '#search', '#center_col',
      '#rso', '.srg',
      'div[data-async-context]',
      '#main'
    ];

    var container = null;
    for (var i = 0; i < targets.length; i++) {
      var el = document.querySelector(targets[i]);
      if (el && el.parentNode) { container = el; break; }
    }

    if (!container) return;

    var wrapper = document.createElement('div');
    wrapper.id = ID;
    wrapper.innerHTML = buildCard();

    // Insert at the very top of the container
    if (container.firstChild) {
      container.insertBefore(wrapper, container.firstChild);
    } else {
      container.appendChild(wrapper);
    }
  }

  var observer = new MutationObserver(function() {
    if (hasRQBBOXQuery() && !document.getElementById(ID)) {
      setTimeout(inject, 400);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  window.addEventListener('load', function() {
    setTimeout(inject, 600);
  });
})();
