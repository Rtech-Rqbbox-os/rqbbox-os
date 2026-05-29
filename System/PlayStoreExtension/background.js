chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ url: 'https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter' });
});

chrome.action.onClicked.addListener(function() {
  chrome.tabs.create({ url: 'https://play.google.com/store/apps' });
});

// Handle APK download requests from content script
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action === 'download-apk') {
    downloadAPK(msg.pkgId, msg.pkgName).then(sendResponse);
    return true;
  }
});

async function downloadAPK(pkgId, pkgName) {
  try {
    // Try APKPure direct download
    var apkUrl = 'https://d.apkpure.com/b/APK/' + pkgId + '?version=latest';
    var resp = await fetch(apkUrl, { redirect: 'follow' });
    var finalUrl = resp.url || apkUrl;
    var filename = pkgId.replace(/\./g, '-') + '.apk';

    // Download via chrome.downloads API
    var dlId = await new Promise(function(resolve, reject) {
      chrome.downloads.download({
        url: finalUrl,
        filename: filename,
        conflictAction: 'overwrite',
        saveAs: false
      }, function(id) {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve(id);
      });
    });

    return { ok: true, downloadId: dlId, message: pkgName + ' APK downloaded to your Downloads folder. Copy to RQBBOX USB: Store/downloads/' + pkgId + '/' };
  } catch(e) {
    // Fallback: open APKPure in new tab to trigger download
    try {
      chrome.tabs.create({ url: 'https://d.apkpure.com/b/APK/' + pkgId + '?version=latest' });
      return { ok: true, message: 'Opening APKPure download for ' + pkgName };
    } catch(e2) {
      return { ok: false, error: 'Failed to download ' + pkgName };
    }
  }
}
