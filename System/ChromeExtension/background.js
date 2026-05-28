// RQBBOX OS Chrome Extension — Service Worker
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({ url: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html' });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'http://localhost:19777/' });
});
