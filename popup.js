scaleToggle = document.querySelector("input[name=scale_toggle]")
scaleAmount = document.querySelector("input[name=scale_amount]")
offsetAmount = document.querySelector("input[name=offset_amount]")
scaleLabel = document.querySelector(".scale_amount_value")
offsetLabel = document.querySelector(".offset_amount_value")

rescaleActive = false;

function getCss() {
  var scale = (rescaleActive ? scaleAmount.value : 1.0);
  var offset = (rescaleActive ? offsetAmount.value : 0);
  return [
    "html {",
    "  transform: scaleX(" + scale + ") translateX(" + offset + "px) !important;",
    "}"
  ].join("\n");
}

function updateTab(tabId) {
  chrome.tabs.insertCSS(tabId, {
    "code": getCss()
  }, function() {});
}

function updateOpenTabs() {
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      var tab = tabs[i];
      updateTab(tab.id);
    }
  });
}

function setActive(isActive) {
  rescaleActive = isActive;
  updateOpenTabs()
  if (rescaleActive) {
    // start listening to new tabs and new urls
  } else {
    // stop listening to tabs
  }
}

function updateScaleAmount() {
  updateOpenTabs();
  scaleLabel.innerHTML = scaleAmount.value;
}

function updateOffsetAmount() {
  updateOpenTabs();
  offsetLabel.innerHTML = offsetAmount.value;
}

scaleToggle.addEventListener("change", function(ev) {
  setActive(scaleToggle.checked);
});

scaleAmount.addEventListener("change", function(ev) {
  updateScaleAmount();
});

offsetAmount.addEventListener("change", function(ev) {
  updateOffsetAmount();
});
