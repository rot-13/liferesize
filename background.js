state = {
  active: false,
  offset: 0,
  scale: 0.72
};

activeTabs = {};
listeningToTabs = false;

function getCssString(scale, offset) {
  return [
    "html {",
    "  transform: scaleX(" + scale + ") translateX(" + offset + "px) !important;",
    "}"
  ].join("\n");
}

function insertCss(tabId, cssString) {
  chrome.tabs.insertCSS(tabId, {
    "code": cssString
  }, function() {});
}

function resetTab(tabId) {
  insertCss(tabId, getCssString(1.0, 0));
  delete activeTabs[tabId];
}

function applyToTab(tabId, scale, offset) {
  insertCss(tabId, getCssString(scale, offset));
  activeTabs[tabId] = true;
}

function applyToOpenTabs(scale, offset) {
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      var tabId = tabs[i].id;
      applyToTab(tabId, scale, offset);
    }
  });
}

function resetTabs() {
  for (var tabId in activeTabs) {
    resetTab(parseInt(tabId, 10));
  }
}

function onTabCreated(tab) {
  if (state.active) {
    applyToTab(tab.id, state.scale, state.offset);
  }
}

function onTabUpdated(tabId, info) {
  if (info.status == "complete") {
    if (state.active) {
      applyToTab(tabId, state.scale, state.offset);
    }
  }
}

function onTabRemoved(tabId) {
  delete activeTabs[tabId];
}

function onTabReplaced(addedTabId, removedTabId) {
  delete activeTabs[removedTabId];
  if (state.active) {
    applyToTab(addedTabId, state.scale, state.offset);
  }
}

function listenToTabs() {
  if (!listeningToTabs) {
    listeningToTabs = true;

    chrome.tabs.onCreated.addListener(onTabCreated);
    chrome.tabs.onUpdated.addListener(onTabUpdated);
    chrome.tabs.onRemoved.addListener(onTabRemoved);
    chrome.tabs.onReplaced.addListener(onTabReplaced);
  }
}

function stopListeningToTabs() {
  if (listeningToTabs) {
    listeningToTabs = false;

    chrome.tabs.onCreated.removeListener(onTabCreated);
    chrome.tabs.onUpdated.removeListener(onTabUpdated);
    chrome.tabs.onRemoved.removeListener(onTabRemoved);
    chrome.tabs.onReplaced.removeListener(onTabReplaced);
  }
}

function onStateChanged() {
  if (state.active) {
    applyToOpenTabs(state.scale, state.offset);
    listenToTabs();
  } else {
    resetTabs();
    stopListeningToTabs();
  }
}

onStateChanged();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case "getState":
      break;
    case "setActive":
      state.active = request.param;
      onStateChanged()
      break;
    case "setScale":
      state.scale = request.param;
      onStateChanged()
      break;
    case "setOffset":
      state.offset = request.param;
      onStateChanged()
      break;
  }

  sendResponse(state);
});
