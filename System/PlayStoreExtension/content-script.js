(function() {
  'use strict';

  // RQBBOX OS — Play Store Injector
  // Adds "Available on RQBBOX OS" button to every Google Play Store app/game page

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
    support: 'rqbbox.support@groups.outlook.com'
  };

  var BTN_ID = 'rqbbox-play-btn';
  var STYLE_ID = 'rqbbox-play-style';

  function getAppId() {
    var m = location.pathname.match(/\/store\/(?:apps|games)\/details\?id=([^&]+)/);
    if (m) return m[1];
    var params = new URLSearchParams(location.search);
    return params.get('id') || '';
  }

  function getAppName() {
    var el = document.querySelector('h1[itemprop="name"], h1');
    return el ? el.textContent.trim() : 'this app';
  }

  function injectButton() {
    if (document.getElementById(BTN_ID)) return;
    if (document.getElementById(STYLE_ID)) return;

    var appName = getAppName();
    var appId = getAppId();
    if (!appId) return;

    // Add styles
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #rqbbox-play-btn {
        margin: 16px 0;
        padding: 0;
        border: none;
        background: none;
        width: 100%;
      }
      #rqbbox-play-btn .rqbbox-card {
        background: linear-gradient(135deg, rgba(10,12,18,.97), rgba(20,22,28,.95));
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0,212,255,.15);
        border-radius: 12px;
        padding: 16px 18px;
        box-shadow: 0 8px 32px rgba(0,0,0,.5);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #fff;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-logo {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        border-radius: 10px;
        background: linear-gradient(135deg,#0a0e1a,#1a1e2e);
        border: 1px solid rgba(0,212,255,.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-weight: 800;
        color: #00d4ff;
        font-family: Segoe UI;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-title {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-sub {
        font-size: 11px;
        color: rgba(255,255,255,.4);
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-desc {
        font-size: 12px;
        line-height: 1.5;
        color: rgba(255,255,255,.5);
        margin-bottom: 10px;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 10px;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-badge {
        display: inline-block;
        background: rgba(0,212,255,.08);
        border: 1px solid rgba(0,212,255,.1);
        padding: 2px 8px;
        border-radius: 100px;
        font-size: 9px;
        color: #00d4ff;
        text-transform: uppercase;
        letter-spacing: .3px;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 7px 14px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        border: none;
        transition: all .2s;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-btn-primary {
        background: linear-gradient(135deg, #007bff, #00d4ff);
        color: #fff;
        box-shadow: 0 4px 16px rgba(0,212,255,.2);
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-btn-primary:hover {
        transform: translateY(-1px);
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-btn-ghost {
        background: rgba(255,255,255,.04);
        color: rgba(255,255,255,.6);
        border: 1px solid rgba(255,255,255,.06);
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-btn-ghost:hover {
        background: rgba(255,255,255,.08);
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-footer {
        margin-top: 8px;
        padding-top: 6px;
        border-top: 1px solid rgba(255,255,255,.04);
        font-size: 9px;
        color: rgba(255,255,255,.2);
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      #rqbbox-play-btn .rqbbox-card .rqbbox-footer a {
        color: rgba(0,212,255,.4);
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);

    // Build the button card
    var wrapper = document.createElement('div');
    wrapper.id = BTN_ID;
    wrapper.innerHTML = [
      '<div class="rqbbox-card">',
      '  <div class="rqbbox-header">',
      '    <div class="rqbbox-logo">R</div>',
      '    <div>',
      '      <div class="rqbbox-title">' + APP.name + '</div>',
      '      <div class="rqbbox-sub">' + APP.tagline + ' by ' + APP.author + '</div>',
      '    </div>',
      '  </div>',
      '  <div class="rqbbox-desc">' + appName + ' is also available on <strong style="color:#00d4ff;">RQBBOX OS</strong> — a portable USB gaming operating system. No installation needed. Plug in your USB and play.</div>',
      '  <div class="rqbbox-badges">',
      '    <span class="rqbbox-badge">⚡ USB Portable</span>',
      '    <span class="rqbbox-badge">🔓 Open Source</span>',
      '    <span class="rqbbox-badge">⚙️ RQBBOX Kernel</span>',
      '    <span class="rqbbox-badge">🎮 Gaming OS</span>',
      '  </div>',
      '  <div class="rqbbox-actions">',
      '    <a class="rqbbox-btn rqbbox-btn-primary" href="' + APP.download + '" target="_blank">⬇ Download RQBBOX OS</a>',
      '    <a class="rqbbox-btn rqbbox-btn-ghost" href="' + APP.website + '" target="_blank">🌐 Website</a>',
      '    <a class="rqbbox-btn rqbbox-btn-ghost" href="' + APP.infocard + '" target="_blank">📋 Info</a>',
      '  </div>',
      '  <div class="rqbbox-footer">',
      '    <span>by ' + APP.author + ' &bull; MIT</span>',
      '    <span><a href="mailto:' + APP.email + '">📧 ' + APP.email + '</a></span>',
      '  </div>',
      '</div>'
    ].join('\n');

    // Find best spot to insert — after the main app info section
    var targets = [
      'div[itemprop="description"]',
      '.hAyfc',                    // Google Play info section
      '.bGZUbe',                   // Play Store description box
      '.SfzRHd',                   // Metadata section
      '.JHTxub',                   // App details section
      'div[data-g-id]'
    ];

    var insertAfter = null;
    for (var i = 0; i < targets.length; i++) {
      var el = document.querySelector(targets[i]);
      if (el && el.parentNode) { insertAfter = el; break; }
    }

    if (insertAfter && insertAfter.parentNode) {
      insertAfter.parentNode.insertBefore(wrapper, insertAfter.nextSibling);
    } else {
      // Fallback: insert near the top of the main content
      var main = document.querySelector('#main-content, main, .T4LgNb, article') || document.body;
      main.insertBefore(wrapper, main.firstChild);
    }
  }

  // Run after page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }

  // Handle dynamic content loading
  var observer = new MutationObserver(function() {
    if (!document.getElementById(BTN_ID)) {
      setTimeout(injectButton, 500);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
