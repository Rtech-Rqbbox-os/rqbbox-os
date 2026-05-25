const FilesPage = {
  currentPath: 'Games',
  selectedFile: null,

  async render() {
    const el = RQB.$('#page-files');
    el.innerHTML = `
      <div class="section-header">
        <h3>File Manager</h3>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" id="fm-copy">Copy</button>
          <button class="btn btn-ghost btn-sm" id="fm-paste">Paste</button>
          <button class="btn btn-ghost btn-sm" id="fm-delete">Delete</button>
          <button class="btn btn-ghost btn-sm" id="fm-mkdir">New Folder</button>
          <button class="btn btn-ghost btn-sm" id="fm-clean">Storage Info</button>
        </div>
      </div>
      <div class="file-manager">
        <div class="file-sidebar" id="file-tree"></div>
        <div class="file-main">
          <div class="file-toolbar">
            <button class="btn btn-ghost btn-sm" id="fm-up">↑ Up</button>
            <span class="file-path" id="file-path">RQBBOX_OS/${this.currentPath}</span>
            <span id="fm-storage" style="font-size:0.75rem;color:var(--text-muted);"></span>
          </div>
          <div class="file-grid" id="file-grid"></div>
          <div class="drop-zone" id="drop-zone">Drag & drop files here to upload to USB</div>
        </div>
      </div>`;
    el.innerHTML = el.innerHTML.replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));

    const tree = el.querySelector('#file-tree');
    RQBBOX_DATA.fileTree.forEach(f => {
      const item = document.createElement('div');
      item.className = 'file-tree-item' + (f.path === this.currentPath ? ' active' : '');
      item.textContent = `${f.icon} ${f.name}`;
      item.onclick = () => { FilesPage.currentPath = f.path; FilesPage.render(); };
      tree.appendChild(item);
    });

    RQB.$('#file-path').textContent = `RQBBOX_OS/${this.currentPath}`;
    RQB.$('#fm-up').onclick = () => FilesPage.goUp();
    RQB.$('#fm-copy').onclick = () => FilesPage.copy();
    RQB.$('#fm-paste').onclick = () => FilesPage.paste();
    RQB.$('#fm-delete').onclick = () => FilesPage.deleteSelected();
    RQB.$('#fm-mkdir').onclick = () => FilesPage.mkdir();
    RQB.$('#fm-clean').onclick = () => RQB.updateStorage();

    if (RQBApi.online) {
      try {
        const info = await RQBApi.storage();
        RQB.$('#fm-storage').textContent = `💾 ${info.freeGB} GB free`;
        const res = await RQBApi.files(this.currentPath);
        FilesPage.renderGrid(res.items || []);
      } catch {
        FilesPage.renderGrid([]);
      }
    } else {
      FilesPage.renderGrid([]);
    }

    const dropZone = el.querySelector('#drop-zone');
    dropZone.ondragover = e => { e.preventDefault(); dropZone.classList.add('drag-over'); };
    dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
    dropZone.ondrop = e => { e.preventDefault(); dropZone.classList.remove('drag-over'); FilesPage.uploadFiles(e.dataTransfer.files); };
  },

  iconFor(item) {
    if (item.type === 'folder') return '📁';
    const e = (item.ext || item.name || '').toLowerCase();
    if (e.includes('.png') || e.includes('.jpg') || e.includes('.svg')) return '🖼️';
    if (e.includes('.wav') || e.includes('.mp3')) return '🎵';
    if (e.includes('.mp4')) return '🎬';
    if (e.includes('.html')) return '🌐';
    if (e.includes('.json')) return '📋';
    return '📄';
  },

  renderGrid(items) {
    const grid = RQB.$('#file-grid');
    grid.innerHTML = '';
    items.forEach(f => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `<div class="file-item-icon">${FilesPage.iconFor(f)}</div><div class="file-item-name">${f.name}</div>`;
      item.innerHTML = item.innerHTML.replace(/<\/?motion\.div/g, t => t.replace('motion.', ''));
      item.onclick = () => {
        grid.querySelectorAll('.file-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        FilesPage.selectedFile = f;
      };
      item.ondblclick = () => {
        if (f.type === 'folder') { FilesPage.currentPath = f.path; FilesPage.render(); }
      };
      grid.appendChild(item);
    });
  },

  goUp() {
    if (!this.currentPath.includes('/')) return;
    this.currentPath = this.currentPath.split('/').slice(0, -1).join('/') || 'Games';
    this.render();
  },

  copy() {
    if (!this.selectedFile) { RQB.toast('Select a file first'); return; }
    RQB.state.clipboard = { ...this.selectedFile };
    RQB.toast(`Copied: ${this.selectedFile.name}`);
  },

  async paste() {
    if (!RQB.state.clipboard || !RQBApi.online) { RQB.toast('Nothing to paste'); return; }
    const dest = `${this.currentPath}/${RQB.state.clipboard.name}`;
    await RQBApi.copyFile(RQB.state.clipboard.path, dest);
    RQB.toast(`Pasted to ${dest}`);
    this.render();
  },

  async deleteSelected() {
    if (!this.selectedFile || !RQBApi.online) return;
    if (!confirm(`Delete ${this.selectedFile.name}?`)) return;
    await RQBApi.deleteFile(this.selectedFile.path);
    RQB.toast('Deleted');
    this.selectedFile = null;
    this.render();
  },

  async mkdir() {
    const name = prompt('Folder name:');
    if (!name || !RQBApi.online) return;
    await RQBApi.writeFile(`${this.currentPath}/${name}/.keep`, '');
    RQB.toast('Folder created');
    this.render();
  },

  async uploadFiles(fileList) {
    if (!RQBApi.online || !fileList.length) return;
    for (const file of fileList) {
      try {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let b64 = '';
        const chunkSize = 32768;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
          b64 += btoa(String.fromCharCode(...chunk));
        }
        await RQBApi.writeFileBase64(`${this.currentPath}/${file.name}`, b64);
      } catch (e) {
        RQB.toast(`Upload failed: ${file.name}`);
      }
    }
    RQB.toast(`Uploaded ${fileList.length} file(s) to USB`);
    this.render();
  }
};
