let targetWindowId;

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === "toggle") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      targetWindowId = tabs[0].windowId;
    });
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === targetWindowId) return;

  if (targetWindowId) {
    chrome.windows.remove(targetWindowId);
    targetWindowId = null;
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "new_window_toggle") {
    chrome.windows.create({}, (newWindow) => {
      targetWindowId = newWindow.id;
    });
  }
});
