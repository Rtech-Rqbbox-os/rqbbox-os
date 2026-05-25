const AIPage = {
  msgs: null,
  lastCanvas: null,
  wallpapers: [],
  savedImages: [],

  async render() {
    const el = RQB.$('#page-ai');
    el.innerHTML = `
      <div class="section-header"><h3>AI Studio</h3>
        <button class="btn btn-primary btn-sm" onclick="RQB.launchItem('app','ai-image-gen')">Open Full Image Studio</button>
        <button class="btn btn-ghost btn-sm" onclick="RQB.launchItem('app','ai-chat')">Open Assistant App</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
        <div class="card" style="padding:24px;cursor:default;">
          <h4 style="margin-bottom:12px;">🎨 Quick Image Generator</h4>
          <input type="text" id="ai-prompt" placeholder="Describe your image..." style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;margin-bottom:12px;">
          <button class="btn btn-primary btn-sm" onclick="AIPage.generateImage()">Generate</button>
          <button class="btn btn-ghost btn-sm" onclick="AIPage.saveImage()">Save to USB</button>
          <canvas id="ai-canvas" style="width:100%;height:140px;margin-top:12px;border-radius:8px;background:#12182a;"></canvas>
        </div>
        <div class="card" style="padding:24px;cursor:default;">
          <h4>🖼️ AI Wallpapers</h4>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin:12px 0;">Click to apply to dashboard</p>
          <div id="ai-wallpaper-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-height:160px;overflow-y:auto;"></div>
          <div id="ai-prompts" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;"></div>
        </div>
      </div>
      <div class="section-header"><h3>🖼️ Saved AI Images</h3></div>
      <div id="ai-gallery" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:20px;"></div>
      <div class="section-header"><h3>RQB Assistant</h3></div>
      <div class="ai-chat">
        <div class="ai-messages" id="ai-messages"></div>
        <div class="ai-input-bar">
          <input type="text" id="ai-input" placeholder="Ask anything...">
          <button class="btn btn-primary btn-sm" onclick="AIPage.sendMessage()">Send</button>
          <button class="btn btn-ghost btn-sm" onclick="AIPage.voiceInput()">🎤</button>
        </div>
      </div>`;

    if (!AIPage.msgs) AIPage.msgs = [{ role: 'bot', text: 'Hello! Ask about games, storage, or say "help".' }];
    AIPage.renderMsgs();

    const prompts = el.querySelector('#ai-prompts');
    (RQBBOX_DATA.aiPrompts || []).forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'category-pill';
      btn.textContent = p;
      btn.onclick = () => { RQB.$('#ai-prompt').value = p; AIPage.generateImage(); };
      prompts.appendChild(btn);
    });

    RQB.$('#ai-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') AIPage.sendMessage(); });
    AIPage.generateImage();
    await AIPage.loadWallpapers();
    await AIPage.loadSavedImages();
  },

  async loadWallpapers() {
    const grid = RQB.$('#ai-wallpaper-grid');
    if (!grid) return;
    try {
      if (RQBApi.online) {
        const res = await RQBApi.files('AI/wallpapers');
        this.wallpapers = (res.items || []).filter(f => f.type === 'file' && f.ext.match(/\.(svg|png|jpg|jpeg|webp)$/i));
      }
    } catch {}
    if (!this.wallpapers.length) {
      this.wallpapers = [
        { name: 'cyber-grid.svg', path: 'AI/wallpapers/cyber-grid.svg' },
        { name: 'nebula-drift.svg', path: 'AI/wallpapers/nebula-drift.svg' },
        { name: 'void-matrix.svg', path: 'AI/wallpapers/void-matrix.svg' },
        { name: 'rqbbox-banner.svg', path: 'AI/wallpapers/rqbbox-banner.svg' }
      ];
    }
    grid.innerHTML = this.wallpapers.map(w => {
      const url = RQBApi.online ? RQBApi.mediaUrl(w.path) : ('../../' + w.path);
      return `<div style="height:70px;border-radius:8px;cursor:pointer;overflow:hidden;border:1px solid rgba(255,255,255,0.08);background-size:cover;background-position:center;background-image:url('${url}');" onclick="AIPage.setWallpaper('${url}')" title="${w.name}"></div>`;
    }).join('');
  },

  async loadSavedImages() {
    const gallery = RQB.$('#ai-gallery');
    if (!gallery) return;
    try {
      if (RQBApi.online) {
        const res = await RQBApi.files('AI/generated');
        this.savedImages = (res.items || []).filter(f => f.type === 'file' && f.ext.match(/\.(svg|png|jpg|jpeg|webp)$/i));
      }
    } catch {}
    if (!this.savedImages.length) {
      gallery.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:40px;">No saved images yet. Generate one above and click "Save to USB".</p>';
      return;
    }
    gallery.innerHTML = this.savedImages.map(img => {
      const url = RQBApi.online ? RQBApi.mediaUrl(img.path) : ('../../' + img.path);
      return `<div class="card" style="cursor:pointer;overflow:hidden;" onclick="AIPage.previewImage('${url}','${img.name}')">
        <div style="height:100px;background-size:cover;background-position:center;background-image:url('${url}');background-color:#0d1220;"></div>
        <div style="padding:8px;font-size:0.75rem;color:var(--text-secondary);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${img.name}</div>
      </div>`;
    }).join('');
  },

  previewImage(url, name) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:30000;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;';
    ov.innerHTML = `<div style="max-width:90vw;max-height:85vh;display:flex;flex-direction:column;align-items:center;">
      <img src="${url}" style="max-width:100%;max-height:75vh;border-radius:12px;border:1px solid rgba(0,212,255,0.3);box-shadow:0 0 40px rgba(0,212,255,0.2);">
      <p style="margin-top:12px;color:var(--text-secondary);font-size:0.85rem;">${name} — click anywhere to close</p>
    </div>`;
    ov.onclick = () => ov.remove();
    document.body.appendChild(ov);
  },

  renderMsgs() {
    const c = RQB.$('#ai-messages');
    if (!c) return;
    c.innerHTML = AIPage.msgs.map(m => `<div class="ai-msg ${m.role}">${m.text}</div>`).join('');
    c.scrollTop = c.scrollHeight;
  },

  hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return Math.abs(h); },

  generateImage() {
    const prompt = RQB.$('#ai-prompt')?.value || 'neon gaming';
    const cv = RQB.$('#ai-canvas');
    if (!cv) return;
    cv.width = cv.clientWidth; cv.height = 140;
    const x = cv.getContext('2d');
    const h = this.hash(prompt);
    const g = x.createLinearGradient(0, 0, cv.width, cv.height);
    g.addColorStop(0, `hsl(${h % 360},80%,15%)`);
    g.addColorStop(1, `hsl(${(h + 140) % 360},70%,25%)`);
    x.fillStyle = g; x.fillRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < 20; i++) {
      x.fillStyle = `hsla(${(h + i * 20) % 360},90%,60%,0.3)`;
      x.beginPath(); x.arc(Math.random() * cv.width, Math.random() * cv.height, Math.random() * 30 + 5, 0, Math.PI * 2); x.fill();
    }
    x.fillStyle = '#00d4ff'; x.font = '14px Segoe UI'; x.fillText(prompt.slice(0, 40), 10, cv.height - 10);
    AIPage.lastCanvas = cv;
  },

  async saveImage() {
    if (!AIPage.lastCanvas || !RQBApi.online) { RQB.toast('Generate an image first'); return; }
    const data = AIPage.lastCanvas.toDataURL('image/png').split(',')[1];
    const path = `AI/generated/img-${Date.now()}.png`;
    await RQBApi.writeFileBase64(path, data);
    Stats.track('aiImage');
    RQB.toast(`Saved to ${path}`);
    await addNotification('AI Image Saved', path);
    await AIPage.loadSavedImages();
  },

  setWallpaper(url) {
    RQB.$('#bg-layer').style.backgroundImage = `url('${url}')`;
    RQB.$('#bg-layer').style.backgroundSize = 'cover';
    RQB.$('#bg-layer').style.backgroundPosition = 'center';
    RQB.toast('Wallpaper applied');
  },

  async sendMessage() {
    const input = RQB.$('#ai-input');
    const msg = input?.value?.trim();
    if (!msg) return;
    AIPage.msgs.push({ role: 'user', text: msg });
    input.value = '';
    AIPage.renderMsgs();
    const reply = await AIPage.getResponse(msg);
    AIPage.msgs.push({ role: 'bot', text: reply });
    AIPage.renderMsgs();
  },

  async getResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes('storage') || m.includes('usb')) {
      if (RQBApi.online) {
        const info = await RQBApi.storage();
        return `RQBBOX USB has ${info.freeGB} GB free (${info.usedPct}% used). All saves stay on the drive.`;
      }
    }
    if (m.includes('wallpaper')) return `There are ${this.wallpapers.length} AI wallpapers available. Click one in AI Studio to apply it.`;
    if (m.includes('game') || m.includes('suggest')) return 'Try Pixel Quest (platformer), Neon Drift (racing), Retro Zone (Pong), or Cube Runner 3D!';
    if (m.includes('help')) return 'Topics: games, storage, install, wallpaper, notes, browser, screenshot, settings, achievements';
    if (m.includes('achievement')) return `You have ${RQB.state.currentUser?.achievements || 0} achievements. Play Pixel Quest to earn more!`;
    if (m.includes('install') || m.includes('store')) return 'Open RhysTech Store — installs copy real files to your USB.';
    return 'I can help with games, storage, wallpapers, installs, and navigation. Try "help" for a list.';
  },

  voiceInput() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { RQB.toast('Voice not supported'); return; }
    const rec = new SR();
    rec.onresult = e => { RQB.$('#ai-input').value = e.results[0][0].transcript; AIPage.sendMessage(); };
    rec.start();
    RQB.toast('Listening...');
  }
};