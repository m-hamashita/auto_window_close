let targetWindowId;

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === "toggle") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      targetWindowId = tabs[0].windowId;
    });
  }
});

chrome.windows.onFocusChanged.addListener((_) => {
  if (targetWindowId) {
    chrome.windows.remove(targetWindowId);
    targetWindowId = null;
  }
});
