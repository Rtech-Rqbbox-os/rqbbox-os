const fs = require('fs');
const path = require('path');

const PKG_DIR = 'Store/packages';
const RELEASE_URL = 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/tag/v1.1.0-platforms';
const BUTTON_HTML = '<a onclick="window.open(\'' + RELEASE_URL + '\',\'_blank\')">⬇ Download RQBBOX OS</a>';

const dirs = fs.readdirSync(PKG_DIR).filter(d => fs.statSync(path.join(PKG_DIR, d)).isDirectory());
let count = 0;

for (const d of dirs) {
  const fp = path.join(PKG_DIR, d, 'index.html');
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  const topBarMatch = html.match(/<div class="top-bar">[\s\S]*?<\/div>/);
  if (!topBarMatch) continue;
  const bar = topBarMatch[0];
  if (bar.includes('RQBBOX OS')) continue;
  const newBar = bar.replace('<div class="top-bar">', '<div class="top-bar">\n' + BUTTON_HTML);
  html = html.replace(bar, newBar);
  fs.writeFileSync(fp, html, 'utf8');
  count++;
}
console.log('Updated ' + count + ' packages');
