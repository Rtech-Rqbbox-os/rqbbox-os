chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ url: 'https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter' });
});

chrome.action.onClicked.addListener(function() {
  chrome.tabs.create({ url: 'https://play.google.com/store/apps' });
});
