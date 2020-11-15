let extPanelWindow = null;
let cureentStatus = 'Stopped';

chrome.devtools.panels.create("Response Override",
  "../images/icon.png",
  "../panel/panel.html",
  (panel) => {
    panel.onShown.addListener(pinTab);
  }
);
function getHeaderString(headers) {
  let responseHeader = '';
  headers.forEach((header, key) => {
    responseHeader += key + ':' + header + '\n';
  })
  return responseHeader;
}

async function ajaxMe(url, headers, method, postData, success, error) {
  let finalResponse = {};
  let response = await fetch(url, {
    method,
    mode: 'cors',
    headers,
    redirect: 'follow',
    body: postData
  });
  finalResponse.response = await response.text();
  finalResponse.headers = getHeaderString(response.headers);
  if (response.ok) {
    success(finalResponse);
  } else {
    error(finalResponse);
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
  continueParams.responseCode = 200;
  continueParams.binaryResponseHeaders = btoa(`Content-Type: ${filteredData.contentType}`);
  continueParams.body = btoa(unescape(encodeURIComponent(filteredData.replace)));
  chrome.debugger.sendCommand(debugee, 'Fetch.fulfillRequest', continueParams);
}

let debugee = null;
function setupDebugger(target) {
  debugee = { tabId: target.id };

  chrome.debugger.attach(debugee, "1.0", () => {
    chrome.debugger.sendCommand(debugee, "Fetch.enable", { patterns: [{ urlPattern: '*' }] });
  });

  chrome.debugger.onEvent.addListener((source, method, params) => {
    var request = params.request;
    var continueParams = {
      requestId: params.requestId,
    };
    if (source.tabId === target.id) {
      if (method === "Fetch.requestPaused") {
        chrome.storage.local.get("replaceData", (storageData) => {
          let filteredData = checkURLTagged(params.request.url, storageData.replaceData);
          if (filteredData.length > 0) {
            if (filteredData[0].find === '~NO_API~') {
              submitResponse(filteredData[0], continueParams)
            } else {
              ajaxMe(request.url, request.headers, request.method, request.postData, (data) => {
                replaceResponse(data.response, filteredData, (replacedData) => {
                  continueParams.responseCode = 200;
                  continueParams.binaryResponseHeaders = btoa(unescape(encodeURIComponent(data.headers.replace(/(?:\r\n|\r|\n)/g, '\0'))));
                  continueParams.body = btoa(unescape(encodeURIComponent(replacedData)));
                  chrome.debugger.sendCommand(debugee, 'Fetch.fulfillRequest', continueParams);
                });
              }, (status) => {
                chrome.debugger.sendCommand(debugee, 'Fetch.continueRequest', continueParams);
              });
            }
          } else {
            chrome.debugger.sendCommand(debugee, 'Fetch.continueRequest', continueParams);
          }
        });
      }
    }
  });
}

function setupActions() {
  extPanelWindow.addEventListener('message', (event) => {
    if (event.source !== extPanelWindow) {
      return;
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
