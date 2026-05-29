// RQBBOX OS Chrome Extension — Service Worker
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    // Open Google Search for RQBBOX OS so they see the card
    chrome.tabs.create({ url: 'https://google.com/search?q=RQBBOX+OS' });
  }
});

chrome.action.onClicked.addListener(function() {
  chrome.tabs.create({ url: 'https://google.com/search?q=RQBBOX+OS' });
});
