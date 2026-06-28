/* RQBBOX OS - Plugin & Theme Engine */
const PluginEngine = {
  plugins: [],
  themes: [],
  activeTheme: null,
  loaded: false,

  async init() {
    const start = performance.now();
    await this.loadPlugins();
    await this.loadThemes();
    await this.applyActiveTheme();
    this.loaded = true;
    RQB.toast(`Plugin Engine ready — ${this.plugins.length} plugins, ${this.themes.length} themes`);
    Stats.track('pluginEngine');
    return true;
  },

  async loadPlugins() {
    const pluginPaths = RQBApi.online ? ['Plugins'] : ['Plugins', '../../Plugins', '../../../Plugins'];
    for (const base of pluginPaths) {
      try {
        if (RQBApi.online) {
          const res = await RQBApi.get(`/api/files?path=${encodeURIComponent(base)}`);
          if (res.ok && res.files) {
            for (const f of res.files) {
              if (f.type === 'dir') {
                await this.loadPlugin(base + '/' + f.name);
              }
            }
            break;
          }
        } else {
          const files = await this.tryFetchList(base);
          if (files) {
            for (const f of files) {
              if (f.type === 'dir') await this.loadPluginOffline(base + '/' + f.name);
            }
            break;
          }
        }
      } catch {}
    }
  },

  async loadPlugin(folder) {
    try {
      if (!RQBApi.online) return;
      const manifestRes = await RQBApi.get(`/api/file/read?path=${encodeURIComponent(folder + '/plugin.json')}`);
      if (!manifestRes.ok) return;
      let manifest;
      try { manifest = JSON.parse(manifestRes.content); } catch { return; }
      if (!manifest.name) return;

      const plugin = { ...manifest, folder, enabled: true, instance: null };
      this.plugins.push(plugin);
      await this.enablePlugin(plugin);
    } catch {}
  },

  async loadPluginOffline(folder) {
    try {
      const res = await fetch(folder + '/plugin.json');
      if (!res.ok) return;
      const manifest = await res.json();
      if (!manifest.name) return;
      const plugin = { ...manifest, folder, enabled: true, instance: null };
      this.plugins.push(plugin);
      await this.enablePlugin(plugin);
    } catch {}
  },

  async enablePlugin(plugin) {
    try {
      let mainCode;
      if (RQBApi.online) {
        const res = await RQBApi.get(`/api/file/read?path=${encodeURIComponent(plugin.folder + '/' + plugin.main)}`);
        if (res.ok) mainCode = res.content;
      } else {
        const res = await fetch(plugin.folder + '/' + plugin.main);
        if (res.ok) mainCode = await res.text();
      }
      if (!mainCode) return;

      const sandbox = { console, setTimeout, clearTimeout, setInterval, clearInterval, Math, JSON, Date, String, Number, Array, Object, Map, Set, Promise, fetch, RQB: this.createPluginAPI(plugin) };
      const fn = new Function(...Object.keys(sandbox), mainCode);
      plugin.instance = fn(...Object.values(sandbox));
      if (plugin.instance?.onLoad) plugin.instance.onLoad();
      if (plugin.instance?.onEnable) plugin.instance.onEnable();
      RQB.toast(`🔌 Plugin loaded: ${plugin.name} v${plugin.version}`);
    } catch (e) {
      console.warn(`Plugin ${plugin.name} failed:`, e);
      plugin.enabled = false;
    }
  },

  disablePlugin(name) {
    const plugin = this.plugins.find(p => p.name === name);
    if (!plugin || !plugin.enabled) return;
    if (plugin.instance?.onDisable) plugin.instance.onDisable();
    if (plugin.instance?.onUnload) plugin.instance.onUnload();
    plugin.enabled = false;
    RQB.toast(`🔌 Plugin disabled: ${plugin.name}`);
  },

  createPluginAPI(plugin) {
    const self = this;
    return {
      toast: (msg) => RQB.toast(`[${plugin.name}] ${msg}`),
      getConfig: (key) => {
        const cfg = RQBBOX_DATA.config?.plugins?.[plugin.name];
        return cfg ? cfg[key] : undefined;
      },
      setConfig: (key, val) => {
        if (!RQBBOX_DATA.config.plugins) RQBBOX_DATA.config.plugins = {};
        if (!RQBBOX_DATA.config.plugins[plugin.name]) RQBBOX_DATA.config.plugins[plugin.name] = {};
        RQBBOX_DATA.config.plugins[plugin.name][key] = val;
        saveConfig();
      },
      fetch: async (path) => {
        if (RQBApi.online) return RQBApi.get(path);
        return null;
      },
      addWidget: (html) => {
        const widget = document.createElement('div');
        widget.className = 'plugin-widget';
        widget.dataset.plugin = plugin.name;
        widget.innerHTML = html;
        const pageContent = document.getElementById('page-content');
        if (pageContent) pageContent.prepend(widget);
      },
      emit: (event, data) => {
        self.events = self.events || {};
        (self.events[event] || []).forEach(cb => cb(data));
      },
      on: (event, cb) => {
        self.events = self.events || {};
        if (!self.events[event]) self.events[event] = [];
        self.events[event].push(cb);
      },
      navigate: (page) => RQB.navigate(page),
      getPlugins: () => self.plugins.map(p => ({ name: p.name, version: p.version, enabled: p.enabled })),
      plugin
    };
  },

  async loadThemes() {
    const themePaths = RQBApi.online ? ['Themes'] : ['Themes', '../../Themes', '../../../Themes'];
    for (const base of themePaths) {
      try {
        if (RQBApi.online) {
          const res = await RQBApi.get(`/api/files?path=${encodeURIComponent(base)}`);
          if (res.ok && res.files) {
            for (const f of res.files) {
              if (f.type === 'dir') await this.loadTheme(base + '/' + f.name);
            }
            break;
          }
        } else {
          const files = await this.tryFetchList(base);
          if (files) {
            for (const f of files) {
              if (f.type === 'dir') await this.loadThemeOffline(base + '/' + f.name);
            }
            break;
          }
        }
      } catch {}
    }
  },

  async loadTheme(folder) {
    try {
      if (!RQBApi.online) return;
      const manifestRes = await RQBApi.get(`/api/file/read?path=${encodeURIComponent(folder + '/theme.json')}`);
      if (!manifestRes.ok) return;
      let manifest;
      try { manifest = JSON.parse(manifestRes.content); } catch { return; }
      if (!manifest.name) return;

      let css = '';
      if (manifest.main) {
        const cssRes = await RQBApi.get(`/api/file/read?path=${encodeURIComponent(folder + '/' + manifest.main)}`);
        if (cssRes.ok) css = cssRes.content;
      }
      this.themes.push({ ...manifest, folder, css });
    } catch {}
  },

  async loadThemeOffline(folder) {
    try {
      const res = await fetch(folder + '/theme.json');
      if (!res.ok) return;
      const manifest = await res.json();
      if (!manifest.name) return;
      let css = '';
      if (manifest.main) {
        const cssRes = await fetch(folder + '/' + manifest.main);
        if (cssRes.ok) css = await cssRes.text();
      }
      this.themes.push({ ...manifest, folder, css });
    } catch {}
  },

  async applyActiveTheme(name) {
    const themeName = name || RQBBOX_DATA.config?.display?.theme;
    const theme = this.themes.find(t => t.name === themeName);
    if (!theme) return;

    let styleEl = document.getElementById('rqbbox-theme');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'rqbbox-theme';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = theme.css;
    this.activeTheme = theme;
  },

  setTheme(name) {
    const theme = this.themes.find(t => t.name === name);
    if (!theme) { RQB.toast(`Theme "${name}" not found`); return; }
    this.applyActiveTheme(name);
    if (RQBBOX_DATA.config.display) {
      RQBBOX_DATA.config.display.theme = name;
      saveConfig();
    }
    RQB.toast(`🎨 Theme applied: ${theme.name}`);
  },

  async tryFetchList(base) {
    try {
      const res = await fetch(base + '/.directory');
      if (res.ok) {
        const text = await res.text();
        const lines = text.split('\n').filter(Boolean);
        return lines.map(l => {
          const parts = l.split('\t');
          return { name: parts[0], type: parts[1] === 'dir' ? 'dir' : 'file' };
        });
      }
    } catch {}
    return null;
  },

  getEnabledPlugin(name) {
    return this.plugins.find(p => p.name === name && p.enabled);
  },

  getSettingsHTML() {
    if (!this.plugins.length && !this.themes.length) {
      return '<p style="color:var(--text-muted);font-size:.85rem;">No plugins or themes found. Place plugins in the Plugins/ folder and themes in the Themes/ folder on your USB.</p>';
    }
    let html = '<div style="margin-bottom:20px;"><h4 style="margin-bottom:12px;">🧩 Plugins</h4>';
    if (!this.plugins.length) html += '<p style="color:var(--text-muted);font-size:.8rem;">No plugins loaded.</p>';
    this.plugins.forEach(p => {
      html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <span>${p.icon || '🧩'}</span>
        <div style="flex:1;"><strong>${p.name}</strong><div style="font-size:.75rem;color:var(--text-muted);">v${p.version} by ${p.author || 'Unknown'}</div></div>
        <span style="font-size:.75rem;color:${p.enabled ? 'var(--neon-cyan)' : 'var(--text-muted)'};">${p.enabled ? '● Enabled' : 'Disabled'}</span>
      </div>`;
    });
    html += '</div><div style="margin-top:20px;"><h4 style="margin-bottom:12px;">🎨 Themes</h4>';
    if (!this.themes.length) html += '<p style="color:var(--text-muted);font-size:.8rem;">No themes loaded.</p>';
    this.themes.forEach(t => {
      const active = this.activeTheme?.name === t.name;
      html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <span>${t.icon || '🎨'}</span>
        <div style="flex:1;"><strong>${t.name}</strong><div style="font-size:.75rem;color:var(--text-muted);">v${t.version} by ${t.author || 'Unknown'}</div></div>
        <button class="btn btn-sm" onclick="PluginEngine.setTheme('${t.name}')" style="background:${active ? 'var(--neon-blue)' : 'transparent'};border:1px solid ${active ? 'var(--neon-blue)' : 'var(--border)'};color:#fff;padding:4px 12px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.75rem;">${active ? '✓ Active' : 'Apply'}</button>
      </div>`;
    });
    html += '</div>';
    return html;
  }
};
