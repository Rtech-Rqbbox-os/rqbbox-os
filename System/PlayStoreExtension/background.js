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
  var urls = [
    'https://d.apkpure.com/b/APK/' + pkgId + '?version=latest',
    'https://d.apkpure.com/b/XAPK/' + pkgId + '?version=latest',
    'https://en.uptodown.com/android/download/' + pkgId
  ];

  for (var i = 0; i < urls.length; i++) {
    try {
      var dlId = await tryDownload(urls[i], pkgId);
      if (dlId !== null) {
        return { ok: true, message: pkgName + ' APK downloaded! Copy to RQBBOX USB Store/downloads/' + pkgId + '/' };
      }
    } catch(e) {}
  }

  // Last resort: open Play Store page
  return { ok: false, error: 'All download sources failed. Open Play Store page instead.' };
}

function tryDownload(url, pkgId) {
  return new Promise(function(resolve, reject) {
    chrome.downloads.download({
      url: url,
      filename: pkgId.replace(/\./g, '-') + '.apk',
      conflictAction: 'overwrite',
      saveAs: false
    }, function(id) {
      if (chrome.runtime.lastError) {
        resolve(null);
      } else {
        resolve(id);
      }
    });
  });
}
