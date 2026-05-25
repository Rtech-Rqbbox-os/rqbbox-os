const QR = {
  generate(text, size = 200) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    const fallback = () => this.fallbackCanvas(text, size);
    return { url, fallback };
  },

  fallbackCanvas(text, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, size, size);
    const cell = 12;
    const off = (size - cell * 17) / 2;
    for (let y = 0; y < 17; y++) {
      for (let x = 0; x < 17; x++) {
        const idx = y * 17 + x;
        const byte = text.charCodeAt(idx % text.length) || 0;
        if (byte % 2 === 0) {
          ctx.fillStyle = '#00d4ff';
          ctx.fillRect(off + x * cell, off + y * cell, cell - 1, cell - 1);
        }
      }
    }
    ctx.fillStyle = 'rgba(157,78,221,0.5)';
    ctx.font = `${Math.floor(size * 0.06)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(text.length > 15 ? text.slice(0, 14) + '…' : text, size / 2, size - 20);
    return canvas;
  },

  showModal(title, text) {
    let overlay = document.getElementById('qr-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'qr-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(5,8,16,0.9);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);opacity:0;transition:opacity .3s;';
      overlay.innerHTML = `<div style="background:#0a0e1a;border:1px solid rgba(0,212,255,0.2);border-radius:20px;padding:32px;text-align:center;max-width:360px;width:90%;transform:scale(0.9);transition:transform .3s;">
        <div id="qr-title" style="font-size:1.1rem;font-weight:700;margin-bottom:4px;color:#e8f0ff;"></div>
        <div id="qr-sub" style="font-size:.8rem;color:#8b9dc3;margin-bottom:20px;"></div>
        <div id="qr-image" style="display:flex;justify-content:center;margin-bottom:20px;min-height:200px;align-items:center;"></div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="QR.download()" style="font-size:.8rem;">💾 Download</button>
          <button class="btn btn-ghost btn-sm" onclick="QR.close()" style="font-size:.8rem;">Close</button>
        </div>
        <input id="qr-url-input" type="text" readonly style="width:100%;margin-top:12px;padding:8px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#8b9dc3;font-size:.75rem;text-align:center;outline:none;cursor:text;">
      </div>`;
      document.body.appendChild(overlay);
    }
    document.getElementById('qr-title').textContent = title;
    document.getElementById('qr-sub').textContent = text;
    document.getElementById('qr-url-input').value = text;
    QR._currentText = text;
    const imgContainer = document.getElementById('qr-image');
    imgContainer.innerHTML = '<span style="color:#5a6a8a;font-size:.8rem;">Generating...</span>';
    const qr = QR.generate(text);
    const img = new Image();
    img.onload = () => { imgContainer.innerHTML = ''; imgContainer.appendChild(img); };
    img.onerror = () => imgContainer.appendChild(QR.fallbackCanvas(text));
    img.src = qr.url;
    img.style.cssText = 'border-radius:12px;max-width:100%;';
    overlay.style.opacity = '1';
    const panel = overlay.querySelector('div');
    panel.style.transform = 'scale(1)';
  },

  close() {
    const overlay = document.getElementById('qr-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      const panel = overlay.querySelector('div');
      if (panel) panel.style.transform = 'scale(0.9)';
      setTimeout(() => overlay.remove(), 300);
    }
  },

  download() {
    const img = document.querySelector('#qr-image img');
    if (img) {
      const a = document.createElement('a');
      a.href = img.src;
      a.download = 'qr-' + Date.now() + '.png';
      a.click();
    }
  },

  showShareOption(type, id, title) {
    const url = window.location.origin + '/' + type + '/' + id;
    QR.showModal(`Share: ${title}`, url);
  }
};

document.addEventListener('click', e => {
  if (e.target.id === 'qr-overlay') QR.close();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') QR.close();
});
