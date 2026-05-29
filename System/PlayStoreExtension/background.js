chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ url: 'https://play.google.com/store/apps' });
});

chrome.action.onClicked.addListener(function() {
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
    var resp = await fetch(apkUrl);
    var finalUrl = resp.url || apkUrl;
    var filename = pkgId.replace(/\./g, '-') + '.apk';
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
    return { ok: true, message: pkgName + ' APK downloaded! Copy to H:\\RQBBOX_OS\\Store\\downloads\\' + pkgId + '\\app.apk' };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}
