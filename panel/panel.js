function init() {
  document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("start").addEventListener("click", () => {
      window.postMessage({
        action: 'start',
        source: 'override-debug'
      }, '*');
    });
    document.getElementById("stop").addEventListener("click", () => {
      window.postMessage({
        action: 'stop',
        source: 'override-debug'
      }, '*');
    });
    document.getElementById("save").addEventListener("click", () => {
      saveData();
    });
    document.getElementById("clean").addEventListener("click", () => {
      let replaceData = [];
      chrome.storage.local.set({ replaceData }, initTable);
    });
    document.getElementById("addRow").addEventListener("click", () => {
      addRow();
    });
    initTable();
  });
}


function saveData() {
  var table = document.getElementById("overrideTable");
  let replaceData = [];
  let rows = table.getElementsByClassName('request-item');

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let data = {};
    data.url = row.querySelector('.url').value
    data.replace = row.querySelector('.replace').code.getValue()
    data.contentType = row.querySelector('.content-type').value
    if (data.url !== '' && data.replace !== '') {
      replaceData.push(data);
    }
  }

  chrome.storage.local.set({ replaceData }, initTable);
  document.getElementById("saveMessage").innerHTML = "Saved Successfully";
  setTimeout(() => {
    document.getElementById("saveMessage").innerHTML = "";
  }, 4000)
}

function addRow() {
  let container = document.createElement('div');
  container.className = 'request-item';
  let table = document.getElementById('overrideTable');
  table.append(container);
  container.innerHTML =
    '<label>URL: </label><input class="url" type="text" placeholder="URL"/>' +
    '<label>Content Type: </label><input class="content-type" type="text" placeholder="Content Type"/>' +
    '<br/><input type="button" value="Delete?" class="delete"/><br/>' +
    '<label>Replace: </label><br/><textarea class="replace"></textarea><hr/>';

  var code = CodeMirror.fromTextArea(container.getElementsByTagName('textarea')[0], {
    lineNumbers: true,
  });
  container.getElementsByTagName('textarea')[0].code = code;
  initDeleteEvent();
}

function cleanTable() {
  let table = document.getElementById('overrideTable');
  let rows = table.getElementsByClassName('request-item');

  for (let i = rows.length - 1; i >= 0; i--) {
    let row = rows[i];
    row.remove();
  }
}

function deleteRow(evt) {
  evt.target.parentNode.remove();
  saveData();
}

function initDeleteEvent() {
  var elements = document.getElementsByClassName("delete");

  for (var i = 0; i < elements.length; i++) {
    elements[i].removeEventListener('click', deleteRow, false);
    elements[i].addEventListener('click', deleteRow, false);
  }
}

function initTable() {
  chrome.storage.local.get("replaceData", (data) => {
    if (data && data.replaceData && data.replaceData.length > 0) {
      var table = document.getElementById("overrideTable");
      cleanTable();
      data.replaceData.forEach((datum) => {
        let container = document.createElement('div');
        container.className = 'request-item';
        table.append(container);
        container.innerHTML =
          `<label>URL: </label><input class="url" type="text" value="${escapeHTML(datum.url)}" placeholder="URL"/>` +
          `<label>Content Type: </label><input class="content-type" type="text" value="${datum.contentType ? escapeHTML(datum.contentType) : ''}" placeholder="Content Type"/>` +
          '<br/><input type="button" value="Delete?" class="delete"/><br/>' +
          `<label>Replace: </label><br/><textarea class="replace">${escapeHTML(datum.replace)}</textarea><hr/>`;

        var code = CodeMirror.fromTextArea(container.getElementsByTagName('textarea')[0], {
          lineNumbers: true,
        });
        container.getElementsByTagName('textarea')[0].code = code;
      });
      initDeleteEvent();
    } else {
      cleanTable();
    }
  });
}

function escapeHTML(unsafeText) {
  return unsafeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

init();


