const { chromium } = require('C:/Users/RhysC/AppData/Roaming/npm/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 19777;
const ROOT = 'H:/RQBBOX_OS';
const OUT = 'H:/RQBBOX_OS/Media/Screenshots/Wikipedia';
const URL = `http://127.0.0.1:${PORT}`;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.wav': 'audio/wav', '.mp3': 'audio/mpeg',
  '.webm': 'video/webm', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.pdf': 'application/pdf', '.zip': 'application/zip',
  '.sh': 'text/plain', '.bat': 'text/plain', '.ps1': 'text/plain', '.md': 'text/markdown',
  '.txt': 'text/plain', '.vbs': 'text/plain', '.jsonc': 'application/json'
};

// Minimal static file server with SPA routing
function mime(p) { return MIME[path.extname(p).toLowerCase()] || 'application/octet-stream'; }

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';

  // Map URLs to filesystem paths
  const routes = [
    { prefix: '/bootloader/', dir: 'System/Bootloader' },
    { prefix: '/website/', dir: 'System/Website' },
    { prefix: '/branding/', dir: 'System/Branding' },
    { prefix: '/sdk/', dir: 'System/SDK' },
    { prefix: '/tv/', dir: 'System/TV' },
    { prefix: '/store/', dir: 'Store' },
    { prefix: '/games/', dir: 'Games' },
    { prefix: '/apps/', dir: 'Apps' },
    { prefix: '/media/', dir: 'Media' },
    { prefix: '/ai/', dir: 'AI' },
    { prefix: '/profiles/', dir: 'Profiles' },
    { prefix: '/settings/', dir: 'Settings' },
    { prefix: '/downloads/', dir: 'Downloads' },
  ];

  let filePath = null;
  for (const r of routes) {
    if (url.startsWith(r.prefix)) {
      const rest = url.slice(r.prefix.length) || 'index.html';
      filePath = path.join(ROOT, r.dir, rest);
      break;
    }
  }
  if (!filePath) filePath = path.join(ROOT, 'System/Launcher', url);

  filePath = path.resolve(filePath);
  if (!filePath.startsWith(path.resolve(ROOT))) {
    res.writeHead(403); res.end('Forbidden');
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime(filePath), 'Access-Control-Allow-Origin': '*' });
  fs.createReadStream(filePath).pipe(res);
});

server.on('error', e => { console.log(`Server error: ${e.code}`); if (e.code === 'EADDRINUSE') server.close(); });
server.listen(PORT, '127.0.0.1', () => console.log(`Static server on ${URL}`));

async function snap(page, name) {
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log(`  OK ${name}.png`);
}

(async () => {
  // Ensure server is listening
  await new Promise((resolve, reject) => {
    const tryConnect = () => {
      const req = http.get(URL, res => { res.resume(); resolve(); });
      req.on('error', () => setTimeout(tryConnect, 200));
      req.setTimeout(2000, () => { req.destroy(); setTimeout(tryConnect, 200); });
    };
    setTimeout(tryConnect, 200);
    setTimeout(() => resolve(), 10000); // resolve anyway after 10s
  });
  console.log('Server confirmed.');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  console.log('Capturing...');

  // 1 Boot
  await page.goto(URL + '/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await snap(page, '01-boot-screen');

  // Set up localStorage for auto-login
  await page.evaluate(() => {
    localStorage.setItem('rqbbox_setup_done', 'true');
    localStorage.setItem('rqbbox_user', JSON.stringify({
      id: 'default', name: 'Player One', avatar: 'P', role: 'Owner'
    }));
  });

  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await snap(page, '02-home-page');

  // If auth screen visible, try to handle it
  let ws = await page.$('#welcome-screen');
  if (ws && await ws.isVisible()) {
    console.log('  Welcome screen');
    await page.click('#btn-get-started');
    await page.waitForTimeout(500);
    let ps = await page.$('#profile-screen');
    if (ps && await ps.isVisible()) {
      const cards = await page.$$('.profile-card');
      if (cards.length) await cards[0].click();
      await page.waitForTimeout(300);
      await page.click('#btn-continue-profile').catch(() => {});
      await page.waitForTimeout(1000);
    }
  }

  try { await page.waitForSelector('#main-shell.active', { timeout: 10000 }); } catch {}
  await page.waitForTimeout(2000);
  await snap(page, '03-main-shell');

  // Navigate via clicking sidebar or global function
  for (const [name, id] of [
    ['04-games-page', 'games'], ['05-store-page', 'store'],
    ['06-settings-page', 'settings'], ['07-profile-page', 'profile'],
    ['08-files-page', 'files'], ['09-ai-studio', 'ai'], ['10-browser-page', 'browser']
  ]) {
    // Try clicking the sidebar button first
    const btn = await page.$(`[data-page="${id}"]`);
    if (btn) {
      try { await btn.click({ timeout: 2000 }); } catch {
        // Fall back to evaluate
        await page.evaluate(`RQB && RQB.navigate('${id}')`);
      }
    } else {
      await page.evaluate(`RQB && RQB.navigate('${id}')`);
    }
    await page.waitForTimeout(1500);
    await snap(page, name);
  }

  // External pages
  await page.goto(URL + '/bootloader/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);
  await snap(page, '11-phone-bootloader');

  await page.goto(URL + '/website/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(1000);
  await snap(page, '12-website-home');

  await page.goto(URL + '/games/cube-runner/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(2000);
  await snap(page, '13-game-cube-runner');

  await page.goto(URL + '/store/packages/call-of-duty-mobile/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(1000);
  await snap(page, '14-store-package');

  await page.goto(URL + '/website/support.html', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(1000);
  await snap(page, '15-support-page');

  await browser.close();
  server.close();
  console.log('\nDone!');
})();
