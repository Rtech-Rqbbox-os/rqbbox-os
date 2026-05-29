const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, exec, spawn } = require('child_process');
const os = require('os');
const crypto = require('crypto');
const email = require('./email.js');
const playStore = require('./play-store.js');

const PORT = 19777;
const ROOT = path.resolve(__dirname, '..', '..');
const LAUNCHER = path.join(ROOT, 'System', 'Launcher');
const BRANDING = path.join(ROOT, 'System', 'Branding');
const LOG_FILE = path.join(ROOT, 'System', 'rqbbox-server.log');

const SERVER_START = Date.now();

function log(msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${ts}] ${msg}\n`;
  try { fs.appendFileSync(LOG_FILE, line); } catch {}
  console.log(line.trim());
}

function execAsync(cmd, timeout = 3000) {
  return new Promise(resolve => {
    exec(cmd, { timeout, encoding: 'utf-8' }, (err, stdout) => resolve(err ? '' : stdout));
  });
}

function getBatteryInfo() {
  try {
    if (os.platform() === 'win32') {
      const out = execSync('WMIC Path Win32_Battery Get EstimatedChargeRemaining, BatteryStatus /Format:csv', { timeout: 3000, encoding: 'utf-8' });
      const lines = out.trim().split('\n').filter(l => l.includes(','));
      if (lines.length) {
        const parts = lines[0].split(',');
        // WMIC CSV output: Node,EstimatedChargeRemaining,BatteryStatus
        return {
          level: parseInt(parts[1] || '0'),
          charging: parseInt(parts[2] || '1') === 2,
          present: true
        };
      }
    }
    if (os.platform() === 'darwin') {
      const out = execSync('pmset -g batt', { timeout: 3000, encoding: 'utf-8' });
      const match = out.match(/(\d+)%/);
      return {
        level: match ? parseInt(match[1]) : 0,
        charging: out.includes('charging') || out.includes('AC'),
        present: true
      };
    }
  } catch {}
  return { level: -1, charging: false, present: false };
}

function getNetworkInfo() {
  const ifaces = os.networkInterfaces();
  const hasActive = Object.values(ifaces || {}).some(arr => (arr || []).some(a => !a.internal && a.family === 'IPv4'));
  const defaultIface = Object.entries(ifaces || {}).find(([_, arr]) => (arr || []).some(a => !a.internal && a.family === 'IPv4'));
  let ip = '';
  if (defaultIface) {
    const addr = defaultIface[1].find(a => !a.internal && a.family === 'IPv4');
    if (addr) ip = addr.address;
  }
  let ssid = '';
  let signal = 0;
  try {
    if (os.platform() === 'win32') {
      const out = execSync('netsh wlan show interfaces', { timeout: 2000, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const ssidMatch = out.match(/SSID\s+:\s(.+)/);
      const signalMatch = out.match(/Signal\s+:\s(\d+)%/);
      const stateMatch = out.match(/State\s+:\s(.+)/);
      ssid = ssidMatch ? ssidMatch[1].trim() : '';
      signal = signalMatch ? parseInt(signalMatch[1]) : 0;
    }
    if (os.platform() === 'linux') {
      const out = execSync('iwconfig 2>/dev/null | grep ESSID', { timeout: 2000, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const ssidMatch = out.match(/ESSID:"(.+)"/);
      ssid = ssidMatch ? ssidMatch[1] : '';
    }
  } catch {}
  return {
    ssid,
    signal,
    connected: !!ssid,
    ip,
    state: ssid ? 'connected' : (hasActive ? 'wired' : 'disconnected'),
    interfaces: { count: Object.keys(ifaces || {}).length }
  };
}

function getBluetoothInfo() {
  try {
    if (os.platform() === 'win32') {
      const out = execSync('powershell -NoProfile -Command "Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue | Select-Object Status, FriendlyName | ConvertTo-Json -Compress"', { timeout: 4000, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      if (!out || !out.trim()) return { enabled: false, devices: [], count: 0 };
      const devices = JSON.parse(out.trim());
      const list = Array.isArray(devices) ? devices : (devices ? [devices] : []);
      const active = list.filter(d => d.Status === 'OK' || d.Status === 'Started');
      return { enabled: active.length > 0, devices: active.map(d => d.FriendlyName || 'Unknown'), count: active.length };
    }
  } catch {}
  return { enabled: false, devices: [], count: 0 };
}

function getControllerInfo() {
  try {
    if (os.platform() === 'win32') {
      const psCmd = 'powershell -NoProfile -Command "Get-PnpDevice -ErrorAction SilentlyContinue | Where-Object { ($_.Class -eq \u0027XboxPeripherals\u0027) -or ($_.FriendlyName -match \u0027controller|gamepad\u0027) } | Select-Object Status, FriendlyName | ConvertTo-Json -Compress"';
      const out = execSync(psCmd, { timeout: 4000, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const trimmed = (out || '').trim();
      if (!trimmed) return { connected: false, controllers: [], count: 0 };
      const devices = JSON.parse(trimmed);
      const list = Array.isArray(devices) ? devices : (devices ? [devices] : []);
      const active = list.filter(d => d.Status === 'OK');
      return { connected: active.length > 0, controllers: active.map(d => d.FriendlyName || 'Controller'), count: active.length };
    }
  } catch {}
  return { connected: false, controllers: [], count: 0 };
}

async function getBatteryInfoAsync() {
  try {
    if (os.platform() === 'win32') {
      const out = await execAsync('WMIC Path Win32_Battery Get EstimatedChargeRemaining, BatteryStatus /Format:csv', 3000);
      const lines = out.trim().split('\n').filter(l => l.includes(','));
      if (lines.length) {
        const parts = lines[0].split(',');
        return { level: parseInt(parts[1] || '0'), charging: parseInt(parts[2] || '1') === 2, present: true };
      }
    }
    if (os.platform() === 'darwin') {
      const out = await execAsync('pmset -g batt', 3000);
      const match = out.match(/(\d+)%/);
      return { level: match ? parseInt(match[1]) : 0, charging: out.includes('charging') || out.includes('AC'), present: true };
    }
  } catch {}
  return { level: -1, charging: false, present: false };
}

async function getNetworkInfoAsync() {
  const ifaces = os.networkInterfaces();
  const hasActive = Object.values(ifaces || {}).some(arr => (arr || []).some(a => !a.internal && a.family === 'IPv4'));
  const defaultIface = Object.entries(ifaces || {}).find(([_, arr]) => (arr || []).some(a => !a.internal && a.family === 'IPv4'));
  let ip = '';
  if (defaultIface) {
    const addr = defaultIface[1].find(a => !a.internal && a.family === 'IPv4');
    if (addr) ip = addr.address;
  }
  let ssid = '';
  let signal = 0;
  try {
    if (os.platform() === 'win32') {
      const out = await execAsync('netsh wlan show interfaces', 2000);
      const ssidMatch = out.match(/SSID\s+:\s(.+)/);
      const signalMatch = out.match(/Signal\s+:\s(\d+)%/);
      const stateMatch = out.match(/State\s+:\s(.+)/);
      ssid = ssidMatch ? ssidMatch[1].trim() : '';
      signal = signalMatch ? parseInt(signalMatch[1]) : 0;
    }
    if (os.platform() === 'linux') {
      const out = await execAsync('iwconfig 2>/dev/null | grep ESSID', 2000);
      const ssidMatch = out.match(/ESSID:"(.+)"/);
      ssid = ssidMatch ? ssidMatch[1] : '';
    }
  } catch {}
  return { ssid, signal, connected: !!ssid, ip, state: ssid ? 'connected' : (hasActive ? 'wired' : 'disconnected'), interfaces: { count: Object.keys(ifaces || {}).length } };
}

async function getBluetoothInfoAsync() {
  try {
    if (os.platform() === 'win32') {
      const out = await execAsync('powershell -NoProfile -Command "Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue | Select-Object Status, FriendlyName | ConvertTo-Json -Compress"', 4000);
      if (!out || !out.trim()) return { enabled: false, devices: [], count: 0 };
      const devices = JSON.parse(out.trim());
      const list = Array.isArray(devices) ? devices : (devices ? [devices] : []);
      const active = list.filter(d => d.Status === 'OK' || d.Status === 'Started');
      return { enabled: active.length > 0, devices: active.map(d => d.FriendlyName || 'Unknown'), count: active.length };
    }
  } catch {}
  return { enabled: false, devices: [], count: 0 };
}

async function getControllerInfoAsync() {
  try {
    if (os.platform() === 'win32') {
      const psCmd = 'powershell -NoProfile -Command "Get-PnpDevice -ErrorAction SilentlyContinue | Where-Object { ($_.Class -eq \u0027XboxPeripherals\u0027) -or ($_.FriendlyName -match \u0027controller|gamepad\u0027) } | Select-Object Status, FriendlyName | ConvertTo-Json -Compress"';
      const out = await execAsync(psCmd, 4000);
      const trimmed = (out || '').trim();
      if (!trimmed) return { connected: false, controllers: [], count: 0 };
      const devices = JSON.parse(trimmed);
      const list = Array.isArray(devices) ? devices : (devices ? [devices] : []);
      const active = list.filter(d => d.Status === 'OK');
      return { connected: active.length > 0, controllers: active.map(d => d.FriendlyName || 'Controller'), count: active.length };
    }
  } catch {}
  return { connected: false, controllers: [], count: 0 };
}

// Database helpers with atomic writes and backups
function backupProfiles() {
  try {
    const src = safePath('Profiles/profiles.json');
    if (!fs.existsSync(src)) return;
    const backupDir = safePath('Profiles/backups');
    fs.mkdirSync(backupDir, { recursive: true });
    const ts = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    fs.cpSync(src, path.join(backupDir, `profiles-${ts}.json`));
    // Keep only last 10 backups
    const backups = fs.readdirSync(backupDir).filter(f => f.startsWith('profiles-')).sort().reverse();
    if (backups.length > 10) backups.slice(10).forEach(f => fs.rmSync(path.join(backupDir, f), { force: true }));
  } catch {}
}

// Write profiles with atomic operation (write to temp then rename)
function writeProfilesAtomic(rel, obj) {
  const p = safePath(rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf-8');
  try { fs.renameSync(tmp, p); } catch (e) {
    if (e.code === 'EXDEV') {
      fs.cpSync(tmp, p);
      fs.rmSync(tmp, { force: true });
    } else throw e;
  }
}

// Validate user data structure
function validateProfile(profiles) {
  if (!profiles || typeof profiles !== 'object') profiles = {};
  if (!profiles.users) profiles.users = [];
  if (!profiles.installed) profiles.installed = { games: [], apps: [] };
  if (!profiles.downloads) profiles.downloads = [];
  if (!profiles.notifications) profiles.notifications = [];
  if (!profiles.sessions) profiles.sessions = [];
  if (!profiles.devices) profiles.devices = [];
  return profiles;
}

function authenticate(token, profiles) {
  if (!token) return null;
  const t = token.startsWith('Bearer ') ? token.slice(7) : token;
  return (profiles?.users || []).find(u => u.token === t) || null;
}

function sysInfo() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  let load = 0;
  try { if (typeof os.loadavg === 'function') { load = os.loadavg()[0] / cpus.length; } } catch {}
  return {
    platform: os.platform(),
    release: os.release(),
    hostname: os.hostname(),
    arch: os.arch(),
    cpuModel: cpus[0]?.model || 'Unknown',
    cpuCores: cpus.length,
    cpuLoad: Math.round(load * 100) / 100,
    memoryTotal: totalMem,
    memoryFree: freeMem,
    memoryUsed: totalMem - freeMem,
    memoryPct: Math.round(((totalMem - freeMem) / totalMem) * 100),
    uptime: os.uptime(),
    nodeVersion: process.version,
    serverUptime: Math.floor((Date.now() - SERVER_START) / 1000),
    serverPort: PORT,
    serverRoot: ROOT
  };
}

function safePath(rel) {
  if (!rel) return ROOT;
  rel = rel.replace(/\\/g, '/').replace(/^\/+/, '');
  if (rel.includes('..')) throw new Error('Invalid path');
  const full = path.resolve(ROOT, rel);
  if (!full.startsWith(path.resolve(ROOT))) throw new Error('Path outside root');
  return full;
}

function mimeType(p) {
  const ext = path.extname(p).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
    '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4',
    '.webm': 'video/webm', '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8', '.ico': 'image/x-icon',
  };
  return map[ext] || 'application/octet-stream';
}

function isBinary(ext) {
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.wav', '.mp3', '.mp4', '.webm', '.ico'].includes(ext);
}

function byteLength(str) {
  return Buffer.byteLength(str, 'utf-8');
}

function body(req) {
  return new Promise(resolve => {
    let d = '';
    let size = 0;
    const MAX_BODY = 10 * 1024 * 1024;
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { req.destroy(); resolve(null); return; }
      d += c;
    });
    req.on('end', () => {
      if (d.length > MAX_BODY) { resolve(null); return; }
      try { resolve(JSON.parse(d)); } catch { resolve(d); }
    });
  });
}

function listDir(rel) {
  const p = safePath(rel);
  try {
    return fs.readdirSync(p, { withFileTypes: true }).map(e => ({
      name: e.name, path: (rel.replace(/\\/g, '/').replace(/\/$/, '') + '/' + e.name).replace(/^\//, ''),
      type: e.isDirectory() ? 'folder' : 'file',
      size: e.isFile() ? (fs.statSync(path.join(p, e.name)).size) : 0,
      ext: path.extname(e.name),
    }));
  } catch { return []; }
}

function readJson(rel) {
  try {
    const p = safePath(rel);
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch { return null; }
}

function writeJson(rel, obj) {
  const p = safePath(rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf-8');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function storageInfo() {
  try {
    const info = {};
    if (os.platform() === 'win32') {
      const drive = ROOT[0];
      const exec = execSync(`wmic logicaldisk where DeviceID="${drive}:" get Size,FreeSpace /format:csv`, { timeout: 3000 }).toString();
      const lines = exec.trim().split('\n').filter(l => l.includes(drive));
      // WMIC CSV: Node,Size,FreeSpace
      if (lines.length) {
        const parts = lines[0].split(',');
        const total = BigInt(parts[1] || 0);
        const free = BigInt(parts[2] || 0);
        info.freeBytes = Number(free);
        info.totalBytes = Number(total);
        info.freeGB = Math.round(Number(free) / 1073741824 * 100) / 100;
        info.usedPct = total ? Math.round((Number(total - free) / Number(total)) * 1000) / 10 : 0;
      }
    }
    if (!info.freeBytes) {
      info.freeBytes = 0; info.totalBytes = 0; info.freeGB = 0; info.usedPct = 0;
    }
    info.drive = ROOT.slice(0, 2);
    info.label = 'RQBBOX 0';
    return info;
  } catch {
    return { drive: ROOT.slice(0, 2), label: 'RQBBOX 0', freeBytes: 0, totalBytes: 0, freeGB: 0, usedPct: 0 };
  }
}

function copyRecursive(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyRecursive(s, d);
    else fs.cpSync(s, d);
  }
}

function launchBrowser(url) {
  const cmd = os.platform() === 'win32' ? 'start' :
    os.platform() === 'darwin' ? 'open' : 'xdg-open';
  // Windows 'start' needs empty title before URL, otherwise URL is treated as title
  if (os.platform() === 'win32') {
    try { execSync(`start "" "${url}"`, { timeout: 2000 }); } catch {}
  } else {
    try { execSync(`${cmd} "${url}"`, { timeout: 2000 }); } catch {}
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const method = req.method;
  const pathname = url.pathname;
  const params = Object.fromEntries(url.searchParams);

  const send = (code, data, type) => {
    res.writeHead(code, {
      'Content-Type': type || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(data);
  };

  if (method === 'OPTIONS') { send(204, ''); return; }

  try {
    if (pathname === '/api/storage') {
      send(200, JSON.stringify(storageInfo()));
    }
    else if (pathname === '/api/config') {
      if (method === 'GET') send(200, JSON.stringify({ ok: true, data: readJson('Settings/config.json') }));
      else { const b = await body(req); writeJson('Settings/config.json', b.data); send(200, JSON.stringify({ ok: true })); }
    }
    else if (pathname === '/api/profiles') {
      if (method === 'GET') send(200, JSON.stringify({ ok: true, data: readJson('Profiles/profiles.json') }));
      else { const b = await body(req); writeJson('Profiles/profiles.json', b.data); send(200, JSON.stringify({ ok: true })); }
    }
    else if (pathname === '/api/store') {
      send(200, JSON.stringify({ ok: true, data: readJson('Store/catalog/store.json') }));
    }
    else if (pathname === '/api/files') {
      send(200, JSON.stringify({ ok: true, path: params.path || '', items: listDir(params.path || '') }));
    }
    else if (pathname === '/api/file/read') {
      const p = safePath(params.path);
      if (!fs.existsSync(p)) { send(404, JSON.stringify({ ok: false, error: 'Not found' })); return; }
      const stat = fs.statSync(p);
      if (stat.isDirectory()) { send(400, JSON.stringify({ ok: false, error: 'Is directory' })); return; }
      if (isBinary(path.extname(p))) {
        send(200, fs.readFileSync(p), mimeType(p));
      } else {
        send(200, JSON.stringify({ ok: true, content: fs.readFileSync(p, 'utf-8'), path: params.path }));
      }
    }
    else if (pathname === '/api/file/write') {
      const b = await body(req);
      const p = safePath(b.path);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      if (b.base64) fs.writeFileSync(p, Buffer.from(b.base64, 'base64'));
      else fs.writeFileSync(p, String(b.content), 'utf-8');
      send(200, JSON.stringify({ ok: true, path: b.path }));
    }
    else if (pathname === '/api/file/delete') {
      const b = await body(req);
      const p = safePath(b.path);
      if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
      send(200, JSON.stringify({ ok: true }));
    }
    else if (pathname === '/api/file/copy') {
      const b = await body(req);
      if (!b || !b.from || !b.to) { send(400, '{"ok":false,"error":"Missing from/to"}'); return; }
      const src = safePath(b.from), dst = safePath(b.to);
      if (!fs.existsSync(src)) { send(404, '{"ok":false,"error":"Source not found"}'); return; }
      if (fs.statSync(src).isDirectory()) copyRecursive(src, dst);
      else { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.cpSync(src, dst); }
      send(200, JSON.stringify({ ok: true }));
    }
    else if (pathname === '/api/file/move') {
      const b = await body(req);
      if (!b || !b.from || !b.to) { send(400, '{"ok":false,"error":"Missing from/to"}'); return; }
      const src = safePath(b.from), dst = safePath(b.to);
      if (!fs.existsSync(src)) { send(404, '{"ok":false,"error":"Source not found"}'); return; }
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      try { fs.renameSync(src, dst); } catch (e) {
        if (e.code === 'EXDEV') { copyRecursive(src, dst); fs.rmSync(src, { recursive: true, force: true }); }
        else throw e;
      }
      send(200, JSON.stringify({ ok: true }));
    }
    else if (pathname === '/api/launch') {
      const b = await body(req);
      const p = safePath(b.path);
      if (!fs.existsSync(p)) { send(404, JSON.stringify({ ok: false, error: 'Not found' })); return; }
      const cmd = os.platform() === 'win32' ? `start "" "${p}"` :
        os.platform() === 'darwin' ? `open "${p}"` : `xdg-open "${p}"`;
      execSync(cmd, { timeout: 2000, cwd: path.dirname(p) });
      send(200, JSON.stringify({ ok: true, launched: b.path }));
    }
    else if (pathname === '/api/install') {
      const b = await body(req);
      const destFolder = b.type === 'game' ? 'Games' : 'Apps';
      const dest = safePath(`${destFolder}/${b.id}`);
      const pkgPath = safePath(`Store/packages/${b.id}`);

      let installed = false;

      // Option 1: Package exists in store — copy it
      if (fs.existsSync(pkgPath)) {
        if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
        copyRecursive(pkgPath, dest);
        installed = true;
      // Option 2: Already on disk (e.g. web app wrapper) — just register
      } else if (fs.existsSync(dest) && fs.existsSync(path.join(dest, 'index.html'))) {
        installed = true;
      }

      if (!installed) {
        send(404, JSON.stringify({ ok: false, error: 'Package not found' }));
        return;
      }

      const profiles = readJson('Profiles/profiles.json') || { users: [], installed: { games: [], apps: [] }, downloads: [], notifications: [] };
      const key = b.type === 'game' ? 'games' : 'apps';
      if (!profiles.installed[key].includes(b.id)) profiles.installed[key].push(b.id);
      profiles.downloads = profiles.downloads || [];
      profiles.downloads.push({ id: b.id, type: b.type, title: b.title, completedAt: new Date().toISOString(), path: `${destFolder}/${b.id}` });
      profiles.notifications = profiles.notifications || [];
      profiles.notifications.unshift({ id: Date.now(), title: 'Install Complete', message: `${b.title} installed to USB.`, time: 'Just now', read: false });
      writeJson('Profiles/profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, path: `${destFolder}/${b.id}` }));
    }
    // CDN-style caching for static files
    else if (pathname === '/api/cdn/file') {
      try {
        const p = safePath(params.path || params.file || '');
        if (!fs.existsSync(p)) { send(404, '{"ok":false}'); return; }
        const stat = fs.statSync(p);
        const ext = path.extname(p);
        const mime = mimeType(p);
        // Generate ETag from file size + mtime
        const etag = `"${stat.size}-${stat.mtimeMs}"`;
        // Check if client has cached version
        if (req.headers['if-none-match'] === etag) {
          res.writeHead(304, { 'ETag': etag, 'Cache-Control': 'public, max-age=3600' });
          res.end(); return;
        }
        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Length': stat.size,
          'ETag': etag,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(p).pipe(res);
        return;
      } catch { send(500, '{"ok":false}'); }
    }
    else if (pathname === '/api/db/restore') {
      try {
        const backupDir = safePath('Profiles/backups');
        const backups = fs.readdirSync(backupDir).filter(f => f.startsWith('profiles-')).sort().reverse();
        const b = await body(req);
        const idx = b.index || 0;
        if (backups[idx]) {
          fs.cpSync(path.join(backupDir, backups[idx]), safePath('Profiles/profiles.json'));
          send(200, JSON.stringify({ ok: true, restored: backups[idx] }));
        } else send(404, JSON.stringify({ ok: false, error: 'Backup not found' }));
      } catch (e) { send(500, JSON.stringify({ ok: false, error: e.message })); }
    }
    // Unified auth: checks username, name, or email
    else if (pathname === '/api/auth') {
      const b = await body(req);
      const profiles = readJson('Profiles/profiles.json');
      const user = (profiles?.users || []).find(u =>
        u.username === b.username || u.name === b.username || u.email === b.username
      );
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'User not found' })); return; }
      if (user.pin && user.pin !== b.password) { send(401, JSON.stringify({ ok: false, error: 'Invalid credentials' })); return; }
      const token = generateToken();
      user.token = token;
      profiles.sessions = profiles.sessions || [];
      profiles.sessions.unshift({ token, userId: user.id, createdAt: new Date().toISOString(), device: b.device || 'Unknown' });
      writeJson('Profiles/profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, user, token }));
    }
    // Unified register
    else if (pathname === '/api/register') {
      const b = await body(req);
      const profiles = readJson('Profiles/profiles.json') || { users: [], installed: { games: [], apps: [] }, downloads: [], notifications: [], sessions: [] };
      if (b.username && (profiles.users || []).some(u => u.username === b.username)) {
        send(409, JSON.stringify({ ok: false, error: 'Username already taken' })); return;
      }
      if ((profiles.users || []).some(u => u.name === b.name)) {
        send(409, JSON.stringify({ ok: false, error: 'Display name already taken' })); return;
      }
      const token = generateToken();
      const newUser = {
        id: 'user-' + Math.random().toString(36).slice(2, 10),
        name: b.name,
        username: b.username || b.name.toLowerCase().replace(/\s+/g, ''),
        email: b.email || '',
        avatar: b.name[0].toUpperCase(),
        role: 'Member',
        pin: b.password || null,
        token,
        theme: 'neon-dark',
        recentApps: [],
        achievements: 0,
        playTime: '0m',
        stats: { sessions: 0, minutesActive: 0, gamesLaunched: 0, appsLaunched: 0, achievements: 0, storeInstalls: 0, screenshots: 0, aiImages: 0, _achNames: [] },
      };
      profiles.sessions = profiles.sessions || [];
      profiles.sessions.unshift({ token, userId: newUser.id, createdAt: new Date().toISOString(), device: b.device || 'Website' });
      profiles.users.push(newUser);
      writeJson('Profiles/profiles.json', profiles);
      if (b.email) {
        const welcomeHtml = email.buildWelcomeHtml(b.name, b.username || b.name, b.email);
        email.sendEmail({ to: b.email, subject: 'Welcome to RhysTech — RQBBOX OS', html: welcomeHtml })
          .catch(err => console.warn('[Register] Welcome email failed:', err.message));
      }
      send(200, JSON.stringify({ ok: true, user: newUser, token }));
    }
    // Get current user by token
    else if (pathname === '/api/me') {
      const auth = req.headers.authorization || params.token;
      if (!auth) { send(401, JSON.stringify({ ok: false, error: 'No token' })); return; }
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
      const profiles = readJson('Profiles/profiles.json');
      const user = (profiles?.users || []).find(u => u.token === token);
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'Invalid token' })); return; }
      send(200, JSON.stringify({ ok: true, user }));
    }
    // Update account
    else if (pathname === '/api/account/update') {
      const b = await body(req);
      const auth = req.headers.authorization || b.token;
      if (!auth) { send(401, JSON.stringify({ ok: false, error: 'No token' })); return; }
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
      const profiles = readJson('Profiles/profiles.json');
      const idx = (profiles?.users || []).findIndex(u => u.token === token);
      if (idx === -1) { send(401, JSON.stringify({ ok: false, error: 'Invalid token' })); return; }
      if (b.name) profiles.users[idx].name = b.name;
      if (b.username) {
        if (profiles.users.some(u => u.username === b.username && u.id !== profiles.users[idx].id)) {
          send(409, JSON.stringify({ ok: false, error: 'Username already taken' })); return;
        }
        profiles.users[idx].username = b.username;
      }
      if (b.email !== undefined) profiles.users[idx].email = b.email;
      if (b.avatar) profiles.users[idx].avatar = b.avatar;
      if (b.password) profiles.users[idx].pin = b.password;
      writeJson('Profiles/profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, user: profiles.users[idx] }));
    }
    // Sign out (clear token)
    else if (pathname === '/api/signout') {
      const b = await body(req);
      const auth = req.headers.authorization || b.token;
      if (!auth) { send(200, JSON.stringify({ ok: true })); return; }
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
      const profiles = readJson('Profiles/profiles.json');
      const user = (profiles?.users || []).find(u => u.token === token);
      if (user) { user.token = null; writeJson('Profiles/profiles.json', profiles); }
      send(200, JSON.stringify({ ok: true }));
    }
    // Sign out all sessions for a user
    else if (pathname === '/api/signout/all') {
      const b = await body(req);
      const auth = req.headers.authorization || b.token;
      if (!auth) { send(200, JSON.stringify({ ok: true })); return; }
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
      const profiles = readJson('Profiles/profiles.json');
      const user = (profiles?.users || []).find(u => u.token === token);
      if (user) {
        user.token = null;
        profiles.sessions = (profiles.sessions || []).filter(s => s.userId !== user.id);
        writeJson('Profiles/profiles.json', profiles);
      }
      send(200, JSON.stringify({ ok: true }));
    }
    else if (pathname === '/api/screenshot') {
      const b = await body(req);
      const dir = safePath('Media/Screenshots');
      fs.mkdirSync(dir, { recursive: true });
      const name = `screenshot-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.png`;
      if (b.base64) fs.writeFileSync(path.join(dir, name), Buffer.from(b.base64, 'base64'));
      send(200, JSON.stringify({ ok: true, path: `Media/Screenshots/${name}` }));
    }
    else if (pathname === '/api/notify') {
      const b = await body(req);
      const profiles = readJson('Profiles/profiles.json') || { users: [], installed: { games: [], apps: [] }, downloads: [], notifications: [] };
      const nid = Date.now();
      profiles.notifications = [{ id: nid, title: b.title, message: b.message, time: 'Just now', read: false }, ...(profiles.notifications || [])];
      writeJson('Profiles/profiles.json', profiles);
      send(200, JSON.stringify({ ok: true }));
    }
    // Mark notifications as read
    else if (pathname === '/api/notifications/mark') {
      const b = await body(req);
      const profiles = readJson('Profiles/profiles.json');
      if (profiles?.notifications) {
        if (b.all) profiles.notifications.forEach(n => n.read = true);
        else if (b.id) { const n = profiles.notifications.find(x => x.id === b.id); if (n) n.read = true; }
        writeJson('Profiles/profiles.json', profiles);
      }
      send(200, JSON.stringify({ ok: true }));
    }
    // Friends
    else if (pathname === '/api/friends') {
      if (method === 'GET') {
        const profiles = readJson('Profiles/profiles.json');
        const userId = params.userId;
        if (!userId) { send(401, JSON.stringify({ ok: false, error: 'No userId' })); return; }
        const user = (profiles?.users || []).find(u => u.id === userId);
        if (!user) { send(401, JSON.stringify({ ok: false, error: 'Unauthorized' })); return; }
        const friendList = (user.friends || []).map(f => {
          const fu = (profiles.users || []).find(u => u.id === f.id);
          return { ...f, online: !!fu?.token };
        });
        send(200, JSON.stringify({ ok: true, friends: friendList, requests: user.friendRequests || [] }));
        return;
      }
      const b = await body(req);
      const profiles = readJson('Profiles/profiles.json');
      const user = (profiles?.users || []).find(u => u.token === b.token || u.id === b.userId);
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'Unauthorized' })); return; }
      if (b.action === 'add') {
        const target = (profiles.users || []).find(u => u.id === b.friendId || u.username === b.friendId || u.name === b.friendId);
        if (!target) { send(404, JSON.stringify({ ok: false, error: 'User not found' })); return; }
        if (target.id === user.id) { send(400, JSON.stringify({ ok: false, error: 'Cannot add yourself' })); return; }
        if ((user.friends || []).find(f => f.id === target.id)) { send(409, JSON.stringify({ ok: false, error: 'Already friends' })); return; }
        // Add to target's requests
        target.friendRequests = target.friendRequests || [];
        if (target.friendRequests.find(r => r.from === user.id)) { send(409, JSON.stringify({ ok: false, error: 'Request already sent' })); return; }
        target.friendRequests.push({ from: user.id, name: user.name, avatar: user.avatar, sentAt: new Date().toISOString() });
        writeJson('Profiles/profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, message: `Friend request sent to ${target.name}` }));
      } else if (b.action === 'accept') {
        const requester = (profiles.users || []).find(u => u.id === b.fromId);
        if (!requester) { send(404, JSON.stringify({ ok: false, error: 'Requester not found' })); return; }
        user.friendRequests = (user.friendRequests || []).filter(r => r.from !== b.fromId);
        user.friends = user.friends || [];
        if (!user.friends.find(f => f.id === requester.id)) user.friends.push({ id: requester.id, name: requester.name, avatar: requester.avatar, addedAt: new Date().toISOString() });
        requester.friends = requester.friends || [];
        if (!requester.friends.find(f => f.id === user.id)) requester.friends.push({ id: user.id, name: user.name, avatar: user.avatar, addedAt: new Date().toISOString() });
        writeJson('Profiles/profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, message: `You are now friends with ${requester.name}` }));
      } else if (b.action === 'reject') {
        user.friendRequests = (user.friendRequests || []).filter(r => r.from !== b.fromId);
        writeJson('Profiles/profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, message: 'Request rejected' }));
      } else if (b.action === 'remove') {
        const target = (profiles.users || []).find(u => u.id === b.friendId);
        user.friends = (user.friends || []).filter(f => f.id !== b.friendId);
        if (target) target.friends = (target.friends || []).filter(f => f.id !== user.id);
        writeJson('Profiles/profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, message: 'Friend removed' }));
      }
    }
    // List all users (search for adding friends)
    else if (pathname === '/api/users') {
      const profiles = readJson('Profiles/profiles.json');
      const list = (profiles?.users || []).map(u => ({ id: u.id, name: u.name, username: u.username, avatar: u.avatar, online: !!u.token }));
      send(200, JSON.stringify({ ok: true, users: list }));
    }
    // Device ID and USB detection
    else if (pathname === '/api/device') {
      if (method === 'GET') {
        const profiles = readJson('Profiles/profiles.json');
        const list = profiles?.devices || [];
        send(200, JSON.stringify({ ok: true, devices: list }));
      } else {
        const b = await body(req);
        const profiles = readJson('Profiles/profiles.json') || { users: [], installed: { games: [], apps: [] }, downloads: [], notifications: [], sessions: [], devices: [] };
        profiles.devices = profiles.devices || [];
        const existing = profiles.devices.findIndex(d => d.id === b.id);
        if (existing >= 0) { profiles.devices[existing] = { ...profiles.devices[existing], ...b, lastSeen: new Date().toISOString() }; }
        else { profiles.devices.push({ ...b, firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString() }); }
        writeJson('Profiles/profiles.json', profiles);
        send(200, JSON.stringify({ ok: true }));
      }
    }
    // Screenshots list
    else if (pathname === '/api/screenshots') {
      const dir = safePath('Media/Screenshots');
      let files = [];
      try {
        files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).map(name => {
          const stat = fs.statSync(path.join(dir, name));
          return { name, path: `Media/Screenshots/${name}`, size: stat.size, modified: stat.mtime };
        }).sort((a, b) => b.modified - a.modified);
      } catch {}
      send(200, JSON.stringify({ ok: true, screenshots: files }));
    }
    // Delete screenshot
    else if (pathname === '/api/screenshots/delete') {
      const b = await body(req);
      const p = safePath(b.path);
      if (fs.existsSync(p) && p.includes('Screenshots')) { fs.rmSync(p); send(200, JSON.stringify({ ok: true })); }
      else send(404, JSON.stringify({ ok: false, error: 'Not found' }));
    }
    else if (pathname === '/api/open') {
      launchBrowser(`http://127.0.0.1:${PORT}/`);
      send(200, JSON.stringify({ ok: true }));
    }
    else if (pathname === '/api/exit') {
      send(200, JSON.stringify({ ok: true }));
      setTimeout(() => process.exit(0), 100);
    }
    else if (pathname === '/api/sysinfo') {
      send(200, JSON.stringify({ ok: true, ...sysInfo() }));
    }
    else if (pathname === '/api/battery') {
      send(200, JSON.stringify({ ok: true, ...getBatteryInfo() }));
    }
    else if (pathname === '/api/network') {
      send(200, JSON.stringify({ ok: true, ...getNetworkInfo() }));
    }
    else if (pathname === '/api/bluetooth') {
      send(200, JSON.stringify({ ok: true, ...getBluetoothInfo() }));
    }
    else if (pathname === '/api/controller') {
      send(200, JSON.stringify({ ok: true, ...getControllerInfo() }));
    }
    else if (pathname === '/api/db/backup') {
      backupProfiles();
      send(200, JSON.stringify({ ok: true, message: 'Backup created' }));
    }
    else if (pathname === '/api/db/validate') {
      const profiles = readJson('Profiles/profiles.json');
      const valid = validateProfile(profiles);
      writeProfilesAtomic('Profiles/profiles.json', valid);
      send(200, JSON.stringify({ ok: true, message: 'Database validated and repaired' }));
    }
    else if (pathname === '/api/auth/refresh') {
      const b = await body(req);
      const auth = req.headers.authorization || b.token;
      if (!auth) { send(401, JSON.stringify({ ok: false, error: 'No token' })); return; }
      const profiles = readJson('Profiles/profiles.json');
      const user = authenticate(auth, profiles);
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'Invalid token' })); return; }
      const newToken = generateToken();
      user.token = newToken;
      writeJson('Profiles/profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, user, token: newToken }));
    }
    else if (pathname === '/api/auth/2fa') {
      const b = await body(req);
      const profiles = readJson('Profiles/profiles.json');
      const auth = req.headers.authorization || b.token;
      const user = authenticate(auth, profiles);
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'No token' })); return; }
      if (b.enable !== undefined) user.twoFA = b.enable;
      if (b.pin) user.twoFAPin = b.pin;
      writeJson('Profiles/profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, twoFA: !!user.twoFA }));
    }
    else if (pathname === '/api/cdn/config') {
      send(200, JSON.stringify({ ok: true, caching: true, maxAge: 3600, etag: true }));
    }
    else if (pathname === '/api/status/all') {
      try {
        const [battery, net, bt, ctrl] = await Promise.allSettled([
          (async () => { try { return getBatteryInfoAsync(); } catch { return {}; } })(),
          (async () => { try { return getNetworkInfoAsync(); } catch { return {}; } })(),
          (async () => { try { return getBluetoothInfoAsync(); } catch { return {}; } })(),
          (async () => { try { return getControllerInfoAsync(); } catch { return {}; } })(),
        ]);
        send(200, JSON.stringify({
          ok: true,
          storage: storageInfo(),
          battery: battery.value || {},
          network: net.value || {},
          bluetooth: bt.value || {},
          controller: ctrl.value || {},
          system: sysInfo(),
          timestamp: Date.now()
        }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }
    else if (pathname === '/api/play-store/packages') {
      const result = playStore.handleListPackages();
      send(200, JSON.stringify(result.body));
    }
    else if (pathname === '/api/play-store/installed') {
      const result = playStore.handleListInstalled();
      send(200, JSON.stringify(result.body));
    }
    else if (pathname === '/api/play-store/install' && method === 'POST') {
      const b = await body(req);
      const result = playStore.handleInstall(b);
      send(result.status || 200, JSON.stringify(result.body));
      if (result.body && result.body.playStoreUrl) {
        try { exec('start "" "' + result.body.playStoreUrl + '"'); } catch {}
      }
    }
    else if (pathname === '/api/play-store/app') {
      const id = parsedUrl.searchParams ? parsedUrl.searchParams.get('id') : '';
      const result = await playStore.handleAppLookup({ query: { id } });
      send(result.status || 200, JSON.stringify(result.body));
    }
    else {
      // Static file serving
      let rel = pathname.replace(/^\//, '') || 'index.html';
      const relLower = rel.toLowerCase();
      let filePath;
      const WEBSITE = path.join(ROOT, 'System', 'Website');
      if (relLower.startsWith('tv/') || relLower === 'tv') {
        const tvRel = relLower.startsWith('tv/') ? rel.slice(3) : '';
        filePath = path.join(ROOT, 'System', 'TV', tvRel || 'index.html');
      }
      else if (relLower.startsWith('bootloader/') || relLower === 'bootloader') {
        const bootRel = relLower.startsWith('bootloader/') ? rel.slice(11) : '';
        filePath = path.join(ROOT, 'System', 'Bootloader', bootRel || 'index.html');
      }
      else if (relLower.startsWith('branding/')) filePath = path.join(BRANDING, rel.slice(9));
      else if (relLower.startsWith('sdk/') || relLower === 'sdk') {
        const sdkRel = relLower.startsWith('sdk/') ? rel.slice(4) : '';
        filePath = sdkRel ? path.join(ROOT, 'System', 'SDK', sdkRel) : path.join(ROOT, 'System', 'SDK', 'index.html');
        if (!fs.existsSync(filePath)) filePath = path.join(WEBSITE, 'dev.html');
      }
      else if (relLower.startsWith('website/') || relLower === 'website') {
        const siteRel = relLower.startsWith('website/') ? rel.slice(8) : '';
        filePath = path.join(WEBSITE, siteRel || 'index.html');
      }
      else {
        const FOLDER_MAP = { store: 'Store', games: 'Games', apps: 'Apps', media: 'Media', ai: 'AI' };
        const prefix = relLower.match(/^(store|games|apps|media|ai)\//);
        if (prefix) {
          const dir = FOLDER_MAP[prefix[1]];
          const rest = rel.slice(prefix[0].length);
          filePath = path.join(ROOT, dir, rest);
        } else {
          filePath = path.join(LAUNCHER, rel);
        }
      }

      filePath = path.resolve(filePath);
      const allowed = [path.resolve(ROOT), path.resolve(LAUNCHER), path.resolve(WEBSITE), path.resolve(ROOT, 'System', 'SDK'), path.resolve(ROOT, 'System', 'Bootloader'), path.resolve(BRANDING)];
      if (!allowed.some(a => filePath.startsWith(a))) {
        send(403, '{"ok":false}'); return;
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        send(404, '{"ok":false,"error":"Not found"}'); return;
      }
      const stat = fs.statSync(filePath);
      const etag = `"${stat.size}-${stat.mtimeMs}"`;
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304);
        res.end(); return;
      }
      res.writeHead(200, {
        'Content-Type': mimeType(filePath),
        'Content-Length': stat.size,
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    log(`Error: ${err.message}`);
    send(500, JSON.stringify({ ok: false, error: err.message }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  log(`RQBBOX Server started on http://127.0.0.1:${PORT}/`);
  setTimeout(() => launchBrowser(`http://127.0.0.1:${PORT}/`), 500);
});
