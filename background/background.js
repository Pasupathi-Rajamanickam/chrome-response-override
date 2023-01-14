chrome.runtime.onMessage.addListener(({ source, action }) => {
  processMessage(source, action);
});

function processMessage(source, action) {
  if (source === "configuration") {
    switch (action) {
      case "import":
        importConfiguration();
        break;
      case "export":
        exportConfiguration();
        break;
    }
  }
}

function exportConfiguration() {
  chrome.storage.local.get((data) => {
    const dataStr = JSON.stringify(data, null, 2);
    let blob = new Blob([dataStr], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    chrome.downloads.download({ url, saveAs: true });
  });
}

function importConfiguration() {
  chrome.fileBrowserHandler.selectFile({}, () => {
    // This might work for for Chrome OS only
    // https://developer.chrome.com/docs/extensions/reference/fileSystemProvider/
    // Not sure if there is a way to implement this method
  });
}
