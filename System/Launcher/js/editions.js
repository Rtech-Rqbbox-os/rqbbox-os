/* RQBBOX OS - Editions System (Lite / Pro / Creator) */
const Editions = {
  current: null,
  tiers: {
    lite: {
      label: 'RQBBOX Lite',
      icon: '⚡',
      desc: 'Lightweight mode for fast USB performance',
      features: ['basic launcher', 'game library', 'file manager', 'local profiles'],
      maxGames: 10,
      maxApps: 5,
      hasCloudSync: false,
      hasPerformanceTools: false,
      hasPluginEngine: false,
      hasThemeEngine: false,
      hasSDK: false
    },
    pro: {
      label: 'RQBBOX Pro',
      icon: '🚀',
      desc: 'Full gaming experience with cloud sync and performance tools',
      features: ['everything in Lite', 'cloud sync & backups', 'advanced customization', 'performance tools', 'RAM cleaner', 'FPS boost mode', 'cross-device settings'],
      maxGames: Infinity,
      maxApps: Infinity,
      hasCloudSync: true,
      hasPerformanceTools: true,
      hasPluginEngine: true,
      hasThemeEngine: true,
      hasSDK: false
    },
    creator: {
      label: 'RQBBOX Creator',
      icon: '🔧',
      desc: 'Everything in Pro plus SDK tools, plugin creator, and theme editor',
      features: ['everything in Pro', 'SDK & developer tools', 'plugin creator', 'theme editor', 'build & publish tools', 'open-code projects'],
      maxGames: Infinity,
      maxApps: Infinity,
      hasCloudSync: true,
      hasPerformanceTools: true,
      hasPluginEngine: true,
      hasThemeEngine: true,
      hasSDK: true
    }
  },

  async init() {
    const saved = RQBBOX_DATA.config?.system?.edition || 'lite';
    this.current = this.tiers[saved] ? saved : 'lite';
    if (!RQBBOX_DATA.config.system) RQBBOX_DATA.config.system = {};
    RQBBOX_DATA.config.system.edition = this.current;

    if (RQBApi.online) await saveConfig();
    this.applyEditionGates();
    RQB.toast(`${this.tiers[this.current].icon} ${this.tiers[this.current].label} mode`);
    return this.current;
  },

  setEdition(tier) {
    if (!this.tiers[tier]) { RQB.toast(`Edition "${tier}" not found`); return; }
    this.current = tier;
    if (!RQBBOX_DATA.config.system) RQBBOX_DATA.config.system = {};
    RQBBOX_DATA.config.system.edition = tier;
    saveConfig();
    this.applyEditionGates();
    RQB.toast(`${this.tiers[tier].icon} Switched to ${this.tiers[tier].label}`);
  },

  getInfo() {
    return this.tiers[this.current];
  },

  hasFeature(feature) {
    return this.tiers[this.current][feature] === true;
  },

  applyEditionGates() {
    const tier = this.tiers[this.current];
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pageMap = { plugin: 'plugins', sdk: 'sdk', tools: 'performance-tools' };

    if (!tier.hasPluginEngine) {
      PluginEngine?.plugins?.forEach(p => { if (p.enabled) PluginEngine?.disablePlugin(p.name); });
    }

    navItems.forEach(item => {
      if (item.dataset.page === 'plugins' || item.dataset.page === 'sdk') {
        item.style.display = 'none';
      }
    });

    if (tier.hasSDK) {
      navItems.forEach(item => {
        if (item.dataset.page === 'plugins' || item.dataset.page === 'sdk') {
          item.style.display = 'flex';
        }
      });
    }

    if (tier.hasPerformanceTools) {
      navItems.forEach(item => {
        if (item.dataset.page === 'performance-tools') {
          item.style.display = 'flex';
        }
      });
    }
  },

  getSettingsHTML() {
    let html = '<h4 style="margin-bottom:16px;">📦 RQBBOX Edition</h4>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">';

    Object.entries(this.tiers).forEach(([key, tier]) => {
      const active = this.current === key;
      html += `<div onclick="Editions.setEdition('${key}')" style="cursor:pointer;background:${active ? 'rgba(0,212,255,0.1)' : 'var(--bg-card)'};border:2px solid ${active ? 'var(--neon-blue)' : 'var(--border)'};border-radius:14px;padding:20px;text-align:center;transition:all .2s;">
        <div style="font-size:2rem;margin-bottom:8px;">${tier.icon}</div>
        <div style="font-weight:600;font-size:.9rem;margin-bottom:4px;">${tier.label}</div>
        <div style="font-size:.7rem;color:var(--text-muted);">${tier.desc}</div>
        ${active ? '<div style="margin-top:8px;font-size:.7rem;color:var(--neon-blue);font-weight:600;">✓ Active</div>' : ''}
      </div>`;
    });

    html += '</div><div style="margin-top:20px;"><h5 style="margin-bottom:8px;color:var(--text-secondary);">Features included:</h5><ul style="list-style:none;padding:0;">';
    this.getInfo().features.forEach(f => {
      html += `<li style="padding:4px 0;font-size:.8rem;color:var(--text-secondary);">✓ ${f}</li>`;
    });
    html += '</ul></div>';
    return html;
  },

  checkGameLimit(count) {
    if (count >= this.tiers[this.current].maxGames) {
      RQB.toast(`⚠️ ${this.tiers[this.current].label} supports max ${this.tiers[this.current].maxGames} games. Upgrade edition for more.`);
      return false;
    }
    return true;
  },

  checkAppLimit(count) {
    if (count >= this.tiers[this.current].maxApps) {
      RQB.toast(`⚠️ ${this.tiers[this.current].label} supports max ${this.tiers[this.current].maxApps} apps. Upgrade edition for more.`);
      return false;
    }
    return true;
  }
};
