// Listen for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!');
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'greeting') {
    sendResponse({ message: 'Hello from background script!'});
  }
});