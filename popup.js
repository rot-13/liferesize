scaleToggle = document.querySelector("input[name=scale_toggle]")

scaleAmount = document.querySelector("input[name=scale_amount]")
scaleLabel = document.querySelector(".scale_amount_value")

offsetAmount = document.querySelector("input[name=offset_amount]")
offsetLabel = document.querySelector(".offset_amount_value")

function updateState(state) {
  scaleToggle.checked = state.active;

  scaleAmount.value = state.scale;
  scaleLabel.innerHTML = state.scale;

  offsetAmount.value = state.offset;
  offsetLabel.innerHTML = state.offset;
}

function setActive(isActive) {
  chrome.runtime.sendMessage({ action: "setActive", param: isActive }, function(state) {
    updateState(state);
  })
}

function setScaleAmount(scale) {
  chrome.runtime.sendMessage({ action: "setScale", param: scale }, function(state) {
    updateState(state);
  })
}

function setOffsetAmount(offset) {
  chrome.runtime.sendMessage({ action: "setOffset", param: offset }, function(state) {
    updateState(state);
  })
}

function init() {
  scaleToggle.addEventListener("change", function(ev) {
    setActive(scaleToggle.checked);
  });

  scaleAmount.addEventListener("input", function(ev) {
    setScaleAmount(scaleAmount.value);
  });

  offsetAmount.addEventListener("input", function(ev) {
    setOffsetAmount(offsetAmount.value);
  });
}

chrome.runtime.sendMessage({ action: "getState" }, function(state) {
  updateState(state);
  init();
});
