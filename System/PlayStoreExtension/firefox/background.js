chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ url: 'https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter' });
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({ url: 'https://play.google.com/store/apps' });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action === 'download-apk') {
    downloadAPK(msg.pkgId, msg.pkgName).then(sendResponse);
    return true;
  }
});

async function downloadAPK(pkgId, pkgName) {
  try {
    var apkUrl = 'https://d.apkpure.com/b/APK/' + pkgId + '?version=latest';
    var resp = await fetch(apkUrl, { redirect: 'follow' });
    var finalUrl = resp.url || apkUrl;
    var filename = pkgId.replace(/\./g, '-') + '.apk';
    var dlId = await new Promise(function(resolve, reject) {
      browser.downloads.download({
        url: finalUrl,
        filename: filename,
        conflictAction: 'overwrite',
        saveAs: false
      }, function(id) {
        if (browser.runtime.lastError) reject(browser.runtime.lastError);
        else resolve(id);
      });
    });
    return { ok: true, downloadId: dlId, message: pkgName + ' APK downloaded. Copy to RQBBOX USB Store/downloads/' + pkgId + '/' };
  } catch(e) {
    try {
      chrome.tabs.create({ url: 'https://d.apkpure.com/b/APK/' + pkgId + '?version=latest' });
      return { ok: true, message: 'Opening APKPure download for ' + pkgName };
    } catch(e2) {
      return { ok: false, error: 'Failed to download ' + pkgName };
    }
  }
}
