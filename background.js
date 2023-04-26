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
  if (command === "other_tab_close") {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.active) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  }
  if (command === "close_duplicate_tabs") {
    chrome.tabs.query({}, (tabs) => {
      const uniqueUrls = new Set();
      const tabsToClose = [];

      tabs.forEach((tab) => {
        const url = new URL(tab.url);
        const strippedUrl = `${url.protocol}//${url.hostname}${url.pathname}`;

        if (uniqueUrls.has(strippedUrl)) {
          tabsToClose.push(tab.id);
        } else {
          uniqueUrls.add(strippedUrl);
        }
      });

      chrome.tabs.remove(tabsToClose);
    });
  }
  if (command === "move_tabs_to_active_window") {
    chrome.windows.getCurrent({ populate: true }, (activeWindow) => {
      const targetWindowId = activeWindow.id;

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.windowId !== targetWindowId) {
            chrome.tabs.move(tab.id, { windowId: targetWindowId, index: -1 });
          }
        });
      });
    });
  }
});
