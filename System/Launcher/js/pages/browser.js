const BrowserPage = {
  history: [],
  bookmarks: [],
  currentUrl: '',
  canGoBack: false,
  canGoForward: false,

  render() {
    const el = RQB.$('#page-browser');
    el.innerHTML = `
      <div class="browser-toolbar">
        <div class="browser-nav-btns">
          <button class="browser-nav-btn" id="browser-back" disabled title="Back">◀</button>
          <button class="browser-nav-btn" id="browser-forward" disabled title="Forward">▶</button>
          <button class="browser-nav-btn" id="browser-refresh" title="Refresh">⟳</button>
        </div>
        <div class="browser-url-bar">
          <input type="text" id="browser-url" placeholder="Enter URL or search..." value="https://www.google.com/webhp?igu=1" spellcheck="false">
          <button class="browser-go-btn" id="browser-go">Go</button>
        </div>
        <div class="browser-actions">
          <button class="browser-action-btn" id="browser-bookmark" title="Bookmark this page">☆</button>
          <button class="browser-action-btn" id="browser-bookmarks-list" title="View bookmarks">📑</button>
          <button class="browser-action-btn" id="browser-history-btn" title="History">🕐</button>
        </div>
      </div>
      <div class="browser-content">
        <div class="browser-welcome" id="browser-welcome">
          <div class="browser-welcome-icon">🌐</div>
          <h2>RQBBOX Web Browser</h2>
          <p>Enter a URL above or search the web</p>
          <div class="browser-speed-dials" id="speed-dials"></div>
        </div>
        <div class="browser-panel" id="browser-panel">
          <div class="browser-panel-header">
            <span id="browser-panel-title">Bookmarks</span>
            <button class="browser-panel-close" id="browser-panel-close">✕</button>
          </div>
          <div id="browser-panel-content"></div>
        </div>
        <iframe id="browser-frame" class="browser-frame" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-downloads" allow="autoplay; microphone; camera; geolocation"></iframe>
      </div>
      <div class="browser-status" id="browser-status">Ready</div>`;
    document.removeEventListener('keydown', this._keyHandler);
    document.addEventListener('keydown', this._keyHandler);
    this.bindEvents();
    this.loadSpeedDials();
    this.loadState();
  },

  _keyHandler(e) {
    if (RQB.state.currentPage !== 'browser') return;
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const input = RQB.$('#browser-url');
      if (input) { input.focus(); input.select(); }
    }
    if (e.key === 'F5') {
      e.preventDefault();
      BrowserPage.navigate(BrowserPage.currentUrl || RQB.$('#browser-url')?.value || '');
    }
  },

  bindEvents() {
    RQB.$('#browser-url')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.navigate(e.target.value.trim());
    });

    RQB.$('#browser-go')?.addEventListener('click', () => {
      const input = RQB.$('#browser-url');
      this.navigate(input.value.trim());
    });

    RQB.$('#browser-back')?.addEventListener('click', () => {
      const frame = RQB.$('#browser-frame');
      try { frame.contentWindow.history.back(); } catch {}
    });

    RQB.$('#browser-forward')?.addEventListener('click', () => {
      const frame = RQB.$('#browser-frame');
      try { frame.contentWindow.history.forward(); } catch {}
    });

    RQB.$('#browser-refresh')?.addEventListener('click', () => {
      const frame = RQB.$('#browser-frame');
      try { frame.contentWindow.location.reload(); } catch {}
    });

    RQB.$('#browser-bookmark')?.addEventListener('click', () => this.toggleBookmark());

    RQB.$('#browser-bookmarks-list')?.addEventListener('click', () => this.showPanel('bookmarks'));

    RQB.$('#browser-history-btn')?.addEventListener('click', () => this.showPanel('history'));

    RQB.$('#browser-panel-close')?.addEventListener('click', () => this.closePanel());
  },

  navigate(input) {
    if (!input) return;
    let url = input.trim();
    if (!url.includes('.') && !url.startsWith('http')) {
      url = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(url);
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    this.loadUrl(url);
  },

  loadUrl(url) {
    const frame = RQB.$('#browser-frame');
    const welcome = RQB.$('#browser-welcome');
    const panel = RQB.$('#browser-panel');
    const input = RQB.$('#browser-url');

    if (url === this.currentUrl) {
      try { frame.contentWindow.location.reload(); } catch { frame.src = url; }
      return;
    }

    if (this.currentUrl && !this._loadingUrl) {
      this.history.push({ url: this.currentUrl, title: input.value, time: Date.now() });
    }

    this.currentUrl = url;
    input.value = url;
    frame.src = url;
    frame.style.display = 'block';
    if (welcome) welcome.style.display = 'none';
    if (panel) panel.classList.remove('open');

    this.updateNavButtons();
    this.updateStatus('Loading...');
    this.saveState();

    frame.onload = () => {
      try {
        const title = frame.contentDocument?.title || url;
        input.value = frame.contentDocument?.URL || url;
        this.currentUrl = frame.contentDocument?.URL || url;
        this.updateStatus(title);
        this.updateBookmarkBtn();
      } catch {
        this.updateStatus(url);
      }
      this.updateNavButtons();
    };
  },

  updateNavButtons() {
    const back = RQB.$('#browser-back');
    const fwd = RQB.$('#browser-forward');
    if (!back || !fwd) return;
    try {
      const frame = RQB.$('#browser-frame');
      if (frame && frame.contentWindow) {
        back.disabled = !frame.contentWindow.history?.length;
      }
    } catch { back.disabled = true; fwd.disabled = true; }
  },

  updateStatus(msg) {
    const el = RQB.$('#browser-status');
    if (el) el.textContent = msg || 'Ready';
  },

  toggleBookmark() {
    const existing = this.bookmarks.findIndex(b => b.url === this.currentUrl);
    if (existing >= 0) {
      this.bookmarks.splice(existing, 1);
      RQB.toast('Bookmark removed');
    } else {
      let title = this.currentUrl;
      try {
        const frame = RQB.$('#browser-frame');
        title = frame?.contentDocument?.title || this.currentUrl;
      } catch {}
      this.bookmarks.push({ url: this.currentUrl, title, time: Date.now() });
      RQB.toast('Bookmarked!');
    }
    this.updateBookmarkBtn();
    this.saveState();
  },

  updateBookmarkBtn() {
    const btn = RQB.$('#browser-bookmark');
    if (!btn) return;
    const isBookmarked = this.bookmarks.some(b => b.url === this.currentUrl);
    btn.textContent = isBookmarked ? '★' : '☆';
    btn.style.color = isBookmarked ? '#ffd700' : '';
  },

  showPanel(type) {
    const panel = RQB.$('#browser-panel');
    const title = RQB.$('#browser-panel-title');
    const content = RQB.$('#browser-panel-content');
    const welcome = RQB.$('#browser-welcome');
    if (!panel || !content) return;

    panel.classList.add('open');
    const frame = RQB.$('#browser-frame');
    if (frame) frame.style.display = 'none';
    if (welcome) welcome.style.display = 'none';

    if (type === 'bookmarks') {
      title.textContent = '📑 Bookmarks';
      if (this.bookmarks.length === 0) {
        content.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">No bookmarks yet. Browse and click ☆ to add.</p>';
      } else {
        content.innerHTML = this.bookmarks.map((b, i) => `
          <div class="browser-panel-item" data-index="${i}">
            <span class="browser-panel-icon">📄</span>
            <div class="browser-panel-info">
              <div class="browser-panel-name">${this.escapeHtml(b.title || b.url)}</div>
              <div class="browser-panel-url">${b.url}</div>
            </div>
            <button class="browser-panel-del" data-index="${i}" title="Remove">✕</button>
          </div>
        `).join('');
        content.querySelectorAll('.browser-panel-item').forEach(item => {
          item.addEventListener('click', e => {
            if (e.target.closest('.browser-panel-del')) return;
            const idx = parseInt(item.dataset.index);
            this.loadUrl(this.bookmarks[idx].url);
            this.closePanel();
          });
        });
        content.querySelectorAll('.browser-panel-del').forEach(btn => {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            this.bookmarks.splice(idx, 1);
            this.saveState();
            this.showPanel('bookmarks');
            this.updateBookmarkBtn();
            RQB.toast('Bookmark removed');
          });
        });
      }
    } else if (type === 'history') {
      title.textContent = '🕐 History';
      if (this.history.length === 0) {
        content.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">No browsing history yet.</p>';
      } else {
        content.innerHTML = [...this.history].reverse().map((h, i) => `
          <div class="browser-panel-item" data-idx="${this.history.length - 1 - i}">
            <span class="browser-panel-icon">🌐</span>
            <div class="browser-panel-info">
              <div class="browser-panel-name">${this.escapeHtml(h.title || h.url)}</div>
              <div class="browser-panel-url">${h.url}</div>
              <div class="browser-panel-time">${new Date(h.time).toLocaleString()}</div>
            </div>
          </div>
        `).join('');
        content.querySelectorAll('.browser-panel-item').forEach(item => {
          item.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            BrowserPage.loadUrl(BrowserPage.history[idx].url);
            BrowserPage.closePanel();
          });
        });
      }
    }
  },

  closePanel() {
    const panel = RQB.$('#browser-panel');
    const welcome = RQB.$('#browser-welcome');
    const frame = RQB.$('#browser-frame');
    const url = RQB.$('#browser-url');
    if (panel) panel.classList.remove('open');
    if (this.currentUrl) {
      if (frame) { frame.style.display = 'block'; frame.src = frame.src; }
      if (welcome) welcome.style.display = 'none';
    } else {
      if (welcome) welcome.style.display = 'block';
      if (frame) frame.style.display = 'none';
    }
    if (url && this.currentUrl) url.value = this.currentUrl;
  },

  loadSpeedDials() {
    const container = RQB.$('#speed-dials');
    if (!container) return;
    const dials = [
      { url: 'https://www.google.com/webhp?igu=1', title: 'Google', icon: '🔍' },
      { url: 'https://www.wikipedia.org', title: 'Wikipedia', icon: '📖' },
      { url: 'https://www.youtube.com', title: 'YouTube', icon: '📺' },
      { url: 'https://www.github.com', title: 'GitHub', icon: '💻' },
      { url: 'https://chatgpt.com', title: 'ChatGPT', icon: '🤖' },
      { url: 'https://www.reddit.com', title: 'Reddit', icon: '🧑‍💻' },
    ];
    container.innerHTML = dials.map(d => `
      <div class="browser-dial" data-url="${d.url}">
        <div class="browser-dial-icon">${d.icon}</div>
        <div class="browser-dial-title">${d.title}</div>
      </div>
    `).join('');
    container.querySelectorAll('.browser-dial').forEach(el => {
      el.addEventListener('click', () => this.loadUrl(el.dataset.url));
    });
  },

  loadState() {
    try {
      const saved = localStorage.getItem('rqbbox_browser_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.bookmarks = state.bookmarks || [];
        this.history = state.history || [];
        if (state.currentUrl && state.currentUrl !== 'about:blank') {
          this.currentUrl = state.currentUrl;
        }
      }
    } catch {}
    this.updateBookmarkBtn();
  },

  saveState() {
    try {
      localStorage.setItem('rqbbox_browser_state', JSON.stringify({
        bookmarks: this.bookmarks,
        history: this.history.slice(-200),
        currentUrl: this.currentUrl
      }));
    } catch {}
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
};
