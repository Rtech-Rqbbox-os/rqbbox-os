(function() {
  'use strict';

  var BTN_ID = 'rqbbox-play-inject';
  var STYLE_ID = 'rqbbox-play-css';
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
    var selectors = [
      'h1[itemprop="name"]',
      'h1[aria-label]',
      '.Fd93Bb h1',
      '.qmmlRd',
      'h1 span',
      '[data-g-name]',
      'h1'
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return 'this app';
  }

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    var css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = [
      '#' + BTN_ID + ' {',
      '  all: initial; display: block;',
      '  margin: 16px 0 !important;',
      '  max-width: 100% !important;',
      '  clear: both;',
      '}',
      '#' + BTN_ID + ' * { all: revert; }',
      '#' + BTN_ID + ' .rqbbox-p-card {',
      '  background: linear-gradient(135deg, rgba(10,12,18,0.97), rgba(20,22,28,0.95));',
      '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
      '  border: 1px solid rgba(0,212,255,0.15);',
      '  border-radius: 12px !important;',
      '  padding: 16px 18px !important;',
      '  box-shadow: 0 8px 32px rgba(0,0,0,0.5);',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;',
      '  color: #fff !important;',
      '  line-height: 1.4 !important;',
      '  box-sizing: border-box !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-row {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  gap: 12px !important;',
      '  margin-bottom: 10px !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-logo {',
      '  width: 40px !important; height: 40px !important;',
      '  flex-shrink: 0 !important;',
      '  border-radius: 10px !important;',
      '  background: linear-gradient(135deg,#0a0e1a,#1a1e2e) !important;',
      '  border: 1px solid rgba(0,212,255,0.15) !important;',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  font-size: 22px !important;',
      '  font-weight: 800 !important;',
      '  color: #00d4ff !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-name {',
      '  font-size: 15px !important;',
      '  font-weight: 700 !important;',
      '  color: #fff !important;',
      '  margin: 0 !important; padding: 0 !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-sub {',
      '  font-size: 11px !important;',
      '  color: rgba(255,255,255,0.45) !important;',
      '  margin: 2px 0 0 0 !important; padding: 0 !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-desc {',
      '  font-size: 12px !important;',
      '  line-height: 1.5 !important;',
      '  color: rgba(255,255,255,0.55) !important;',
      '  margin-bottom: 10px !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-desc strong { color: #00d4ff !important; }',
      '#' + BTN_ID + ' .rqbbox-p-badges {',
      '  display: flex !important;',
      '  flex-wrap: wrap !important;',
      '  gap: 4px !important;',
      '  margin-bottom: 10px !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-badge {',
      '  display: inline-block !important;',
      '  background: rgba(0,212,255,0.08) !important;',
      '  border: 1px solid rgba(0,212,255,0.1) !important;',
      '  padding: 2px 8px !important;',
      '  border-radius: 100px !important;',
      '  font-size: 9px !important;',
      '  color: #00d4ff !important;',
      '  text-transform: uppercase !important;',
      '  letter-spacing: 0.3px !important;',
      '  font-weight: 600 !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-actions {',
      '  display: flex !important;',
      '  flex-wrap: wrap !important;',
      '  gap: 6px !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-btn {',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  gap: 5px !important;',
      '  padding: 8px 16px !important;',
      '  border-radius: 8px !important;',
      '  font-size: 11px !important;',
      '  font-weight: 600 !important;',
      '  text-decoration: none !important;',
      '  border: none !important;',
      '  cursor: pointer !important;',
      '  transition: all 0.2s !important;',
      '  line-height: 1 !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-btn-primary {',
      '  background: linear-gradient(135deg, #007bff, #00d4ff) !important;',
      '  color: #fff !important;',
      '  box-shadow: 0 4px 16px rgba(0,212,255,0.25) !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-btn-primary:hover {',
      '  transform: translateY(-1px) !important;',
      '  box-shadow: 0 6px 20px rgba(0,212,255,0.35) !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-btn-ghost {',
      '  background: rgba(255,255,255,0.04) !important;',
      '  color: rgba(255,255,255,0.65) !important;',
      '  border: 1px solid rgba(255,255,255,0.06) !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-btn-ghost:hover {',
      '  background: rgba(255,255,255,0.08) !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-footer {',
      '  margin-top: 8px !important;',
      '  padding-top: 6px !important;',
      '  border-top: 1px solid rgba(255,255,255,0.04) !important;',
      '  font-size: 9px !important;',
      '  color: rgba(255,255,255,0.25) !important;',
      '  display: flex !important;',
      '  justify-content: space-between !important;',
      '  flex-wrap: wrap !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-footer a {',
      '  color: rgba(0,212,255,0.5) !important;',
      '  text-decoration: none !important;',
      '}',
      '#' + BTN_ID + ' .rqbbox-p-footer a:hover {',
      '  color: rgba(0,212,255,0.8) !important;',
      '  text-decoration: underline !important;',
      '}'
    ].join('\n');
    document.head.appendChild(css);
  }

  function buildCard(appName) {
    var w = document.createElement('div');
    w.id = BTN_ID;

    var html = '<div class="rqbbox-p-card">';
    html += '<div class="rqbbox-p-row">';
    html += '  <div class="rqbbox-p-logo">R</div>';
    html += '  <div>';
    html += '    <div class="rqbbox-p-name">' + APP.name + '</div>';
    html += '    <div class="rqbbox-p-sub">' + APP.tagline + ' by ' + APP.author + ' &bull; ' + APP.version + '</div>';
    html += '  </div>';
    html += '</div>';
    html += '<div class="rqbbox-p-desc"><strong>' + appName + '</strong> is also available on <strong>RQBBOX OS</strong> — a portable USB gaming operating system powered by the <strong>RQBBOX Kernel</strong> (modular microkernel with process manager, memory manager, file system, device drivers, and system call API). No installation required — plug in your USB and play.</div>';
    html += '<div class="rqbbox-p-badges">';
    html += '  <span class="rqbbox-p-badge">⚡ USB Portable</span>';
    html += '  <span class="rqbbox-p-badge">🔓 Open Source</span>';
    html += '  <span class="rqbbox-p-badge">⚙️ RQBBOX Kernel</span>';
    html += '  <span class="rqbbox-p-badge">🎮 Gaming OS</span>';
    html += '  <span class="rqbbox-p-badge">🔌 Plugin SDK</span>';
    html += '</div>';
    html += '<div class="rqbbox-p-actions">';
    html += '  <a class="rqbbox-p-btn rqbbox-p-btn-primary" href="' + APP.download + '" target="_blank">⬇ Download RQBBOX OS</a>';
    html += '  <a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.website + '" target="_blank">🌐 Website</a>';
    html += '  <a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.infocard + '" target="_blank">📋 Info Card</a>';
    html += '  <a class="rqbbox-p-btn rqbbox-p-btn-ghost" href="' + APP.github + '" target="_blank">🐙 GitHub</a>';
    html += '</div>';
    html += '<div class="rqbbox-p-footer">';
    html += '  <span>by ' + APP.author + ' &bull; MIT &bull; ' + APP.version + '</span>';
    html += '  <span><a href="mailto:' + APP.email + '">📧 ' + APP.email + '</a> &bull; <a href="' + APP.youtube + '" target="_blank">▶ YouTube</a> &bull; <a href="mailto:' + APP.support + '">Support</a></span>';
    html += '</div>';
    html += '</div>';

    w.innerHTML = html;
    return w;
  }

  function findInsertionTarget() {
    // Google Play Store uses dynamic React rendering
    // Target the most reliable containers in order
    var selectors = [
      // Primary: description and info sections
      'div[itemprop="description"]',
      'div[data-g-id="description"]',
      '.bGZUbe',        // Main content card
      '.xWd7cb',         // Top section container
      '.SfzRHd',         // Details section
      '.hAyfc',          // Info rows section
      '.JHTxub',         // Metadata section
      '.DWPxHb',         // Additional info
      '.fnfR6c',         // Description container
      '.qZ3W如果',        // Various
      '#detailInfo',     // Detail info by ID
      '#play-app-details', // Main app details container
      // Fallback: major content areas
      '[data-testid="play-app-details"]',
      '.T4LgNb',         // Main scroll container
      '#main-content',   // Primary content area
      'main',            // Generic main
      'article',         // Generic article
      '#fcxH9b',         // Play Store root
      '.N4Qw3'           // Content wrapper
    ];

    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.parentNode) return el;
    }
    return null;
  }

  function injectButton() {
    if (document.getElementById(BTN_ID)) return;
    injectCSS();

    var appName = getAppName();
    var target = findInsertionTarget();
    if (!target) return false;

    var card = buildCard(appName);

    // Insert after the target element
    if (target.nextSibling) {
      target.parentNode.insertBefore(card, target.nextSibling);
    } else {
      target.parentNode.appendChild(card);
    }
    return true;
  }

  // Retry injection with exponential backoff
  function tryInject(attempt) {
    if (attempt > MAX_RETRIES) return;
    if (injectButton()) return;
    setTimeout(function() { tryInject(attempt + 1); }, Math.min(200 * Math.pow(1.5, attempt), 3000));
  }

  // Initial attempts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { tryInject(0); });
  } else {
    tryInject(0);
  }

  // Also try on load
  window.addEventListener('load', function() {
    setTimeout(function() { tryInject(0); }, 500);
  });

  // Aggressive MutationObserver for dynamic content
  var observer = new MutationObserver(function(mutations) {
    if (!document.getElementById(BTN_ID)) {
      // Only try if relevant DOM changes happened
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        if (added && added.length > 0) {
          for (var j = 0; j < added.length; j++) {
            if (added[j].nodeType === 1 && (added[j].querySelector || added[j].id)) {
              tryInject(0);
              return;
            }
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
