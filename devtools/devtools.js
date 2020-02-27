let extPanelWindow = null;
let cureentStatus = 'Stopped';

chrome.devtools.panels.create("Response Override",
  "../images/icon.png",
  "../panel/panel.html",
  (panel) => {
    panel.onShown.addListener(pinTab);
  }
);
function ajaxMe(url, success, error) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url)
  xhr.send();
  xhr.onload = function() {
    if (xhr.status === 200) {
      success(xhr)
    } else {
      error(xhr.status)
    }
  }
}
function replaceResponse(response, filteredData, callback) {
  filteredData.forEach(filteredDatum => {
    var find = new RegExp(filteredDatum.find, "g");
    response = response.replace(find, filteredDatum.replace)
  })
  callback(response)
}
function checkURLTagged(url, replaceData) {
  return replaceData.filter(replaceDatum => url.includes(replaceDatum.url));
}

function submitResponse(filteredData, continueParams) {
	let responseLines = [];
  if (filteredData.contentType) {
    responseLines.push(`Content-Type: ${filteredData.contentType}`);
  }
  responseLines.push('');
  responseLines.push('');
  responseLines.push(filteredData.replace);
  continueParams.rawResponse = btoa(unescape(encodeURIComponent(responseLines.join('\r\n'))));
  chrome.debugger.sendCommand(debugee, 'Network.continueInterceptedRequest', continueParams);
}

let debugee = null;
function setupDebugger(target) {
  debugee = { tabId: target.id };

  chrome.debugger.attach(debugee, "1.0", () => {
    chrome.debugger.sendCommand(debugee, "Network.setRequestInterception", { patterns: [{ urlPattern: '*' }] });
  });

  chrome.debugger.onEvent.addListener((source, method, params) => {
    var request = params.request;
    var continueParams = {
      interceptionId: params.interceptionId,
    };
    if (source.tabId === target.id) {
      if (method === "Network.requestIntercepted") {
        chrome.storage.local.get("replaceData", (storageData) => {
          let filteredData = checkURLTagged(params.request.url, storageData.replaceData);
          if (filteredData.length > 0) {
            var responseLines = [];
            responseLines.push('HTTP/1.1 200 OK');
            if (filteredData[0].find === '~NO_API~') {
              submitResponse(filteredData[0], continueParams)
            } else {
              ajaxMe(request.url, (data) => {
                replaceResponse(data.response, filteredData, (replacedData) => {
                  let headers = data.getAllResponseHeaders();
                  responseLines.push(headers);
                  responseLines.push('');
                  responseLines.push('');
                  responseLines.push(replacedData);
                  continueParams.rawResponse = btoa(unescape(encodeURIComponent(responseLines.join('\r\n'))));
                  chrome.debugger.sendCommand(debugee, 'Network.continueInterceptedRequest', continueParams);
                });
              }, (status) => {
                responseLInes[0] = `HTTP/1.1 ${status}`;
                continecontinueParams.rawResponse = btoa(responseLines.join('\r\n'));
                chrome.debugger.sendCommand(debugee, 'Network.continueInterceptedRequest', continueParams);
              });
            }
          } else {
            chrome.debugger.sendCommand(debugee, 'Network.continueInterceptedRequest', continueParams);
          }
        });
      }
    }
  });
}

function setupActions() {
  extPanelWindow.addEventListener('message', (event) => {
    if (event.source !== extPanelWindow) {
      returnl
    }
    let message = event.data;
    if (message && message.source !== 'override-debug') {
      return;
    }
    switch (message.action) {
      case 'start': {
        startOverride();
        break;
      }
      case 'stop': {
        destroyDebugger();
      }
    }
  })
}

function startOverride() {
  chrome.tabs.getSelected(null, (tab) => {
    setupDebugger(tab);
  });
}
function pinTab(panelWindow) {
  extPanelWindow = panelWindow;
  setupActions();
}
function destroyDebugger() {
  chrome.debugger.detach(debugee);
}






