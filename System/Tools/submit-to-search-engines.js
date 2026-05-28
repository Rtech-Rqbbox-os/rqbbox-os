const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const SITE = 'https://rtech-rqbbox-os.github.io/rqbbox-os';
const SITEMAP = SITE + '/sitemap.xml';
const HOMEPAGE = SITE + '/';
const INFO_CARD = SITE + '/website/os-info-card.html';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  console.log('=== RQBBOX OS — Submit to Search Engines ===\n');

  // 1. Check site is live
  console.log('Checking site is live...');
  try {
    const r = await httpsGet(HOMEPAGE);
    if (r.status === 200) console.log('  Site is LIVE (' + r.status + ')\n');
    else { console.log('  Site returned ' + r.status + ' - aborting\n'); return; }
  } catch (e) { console.log('  Site unreachable: ' + e.message + '\n'); return; }

  // 2. Try Google Indexing API (needs service account JSON file)
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT || './google-service-account.json';
  const fs = require('fs');
  if (fs.existsSync(keyFile)) {
    console.log('Google service account found, attempting Indexing API...');
    try {
      const key = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
      const jwt = require('./jwt-helper') || null;
      if (jwt) {
        // would call Indexing API here
        console.log('  Indexing API call would go here');
      }
    } catch (e) { console.log('  Key file error: ' + e.message); }
  } else {
    console.log('No Google service account key found at: ' + keyFile);
    console.log('  To use Indexing API:');
    console.log('    1. Go to https://console.cloud.google.com/');
    console.log('    2. Create project, enable Search Console API + Indexing API');
    console.log('    3. Create service account, download JSON as google-service-account.json');
    console.log('    4. In Search Console, add service account email as owner');
    console.log('    5. Re-run with: GOOGLE_SERVICE_ACCOUNT=./key.json node submit-to-search-engines.js\n');
  }

  // 3. Try manual URL submission endpoints
  console.log('Attempting search engine submissions...\n');

  const targets = [
    { name: 'Google (sitemap ping - deprecated)', url: 'https://www.google.com/ping?sitemap=' + encodeURIComponent(SITEMAP) },
    { name: 'Bing (sitemap submit)', url: 'https://www.bing.com/ping?sitemap=' + encodeURIComponent(SITEMAP) },
    { name: 'IndexNow (Bing/Yandex/Seznam)', url: 'https://www.bing.com/indexnow?url=' + encodeURIComponent(SITEMAP) + '&key=' },
  ];

  for (const t of targets) {
    try {
      const r = await httpsGet(t.url);
      console.log('  ' + t.name + ' → ' + r.status);
    } catch (e) {
      console.log('  ' + t.name + ' → error: ' + e.message);
    }
  }

  // 4. Open Google Search Console in browser if possible
  console.log('\n--- MANUAL STEPS (must be done by you) ---');
  console.log('\n1. ADD SITE TO GOOGLE SEARCH CONSOLE:');
  console.log('   URL: https://search.google.com/search-console');
  console.log('   Add property: ' + SITE);
  console.log('   Verify ownership: upload HTML file to repo root, or add DNS TXT record');
  console.log('   Then submit sitemap: ' + SITEMAP);
  console.log('   Then use URL Inspection to request indexing of:');
  console.log('     • ' + HOMEPAGE);
  console.log('     • ' + INFO_CARD);
  console.log('     • ' + SITEMAP);

  console.log('\n2. OPEN THESE LINKS IN YOUR BROWSER:');
  console.log('   Google Search Console: https://search.google.com/search-console');
  console.log('   Rich Results Test: https://search.google.com/test/rich-results');
  console.log('   (enter: ' + INFO_CARD + ')');

  console.log('\n3. SUBMIT TO OTHER SEARCH ENGINES:');
  console.log('   Bing Webmaster Tools: https://www.bing.com/webmasters/');
  console.log('   DuckDuckGo: https://duckduckgo.com/?q=' + encodeURIComponent('site:' + SITE.replace('https://', '')));

  console.log('\n=== DONE ===');
}

main().catch(console.error);
