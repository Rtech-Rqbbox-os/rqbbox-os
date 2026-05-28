const { chromium } = require('C:/Users/RhysC/AppData/Roaming/npm/node_modules/playwright');
const path = require('path');
const http = require('http');

const URL = 'http://127.0.0.1:19777';
const OUT = 'H:/RQBBOX_OS/Media/Screenshots/Wikipedia';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });

  console.log('Capturing external pages...');

  await page.goto(URL + '/bootloader/', { waitUntil: 'load', timeout: 10000 }).catch(() => page.goto(URL + '/bootloader/', { waitUntil: 'domcontentloaded', timeout: 10000 }));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, '10-phone-bootloader.png'), fullPage: false });
  console.log('  10-phone-bootloader.png');

  await page.goto(URL + '/website/', { waitUntil: 'load', timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '11-website-home.png'), fullPage: false });
  console.log('  11-website-home.png');

  await page.goto(URL + '/games/cube-runner/', { waitUntil: 'load', timeout: 10000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, '12-game-cube-runner.png'), fullPage: false });
  console.log('  12-game-cube-runner.png');

  await page.goto(URL + '/store/packages/call-of-duty-mobile/', { waitUntil: 'load', timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '13-store-package.png'), fullPage: false });
  console.log('  13-store-package.png');

  await page.goto(URL + '/website/support.html', { waitUntil: 'load', timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, '14-support-page.png'), fullPage: false });
  console.log('  14-support-page.png');

  await browser.close();
  console.log('Done!');
})();
