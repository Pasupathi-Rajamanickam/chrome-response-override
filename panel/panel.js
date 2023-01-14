function init() {
  document.addEventListener("DOMContentLoaded", function(event) {
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
    document.getElementById('import').addEventListener('click', () => {
      var fileInput = document.getElementById('file');
      fileInput.click();
      fileInput.onchange = (event) => {
        const file = fileInput.files[0];
        if (file) {
          let reader = new FileReader();
          reader.addEventListener('load', (event) => {
            const parsed = JSON.parse(event.target.result);
            
            chrome.storage.local.set(parsed, () => {
              initTable();
            });
          });
          
          reader.readAsText(file, 'utf-8');
        }
      }
    });
    document.getElementById('export').addEventListener('click', () => {
      chrome.runtime.sendMessage({
        source: 'configuration',
        action: 'export'
      })
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
  let rows = table.getElementsByTagName('tr');

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    let tds = row.getElementsByTagName('td')
    let data = {};
    data.url = tds[0].getElementsByTagName('input')[0].value
    data.find = tds[1].getElementsByTagName('input')[0].value
    data.replace = tds[2].getElementsByTagName('input')[0].value
    data.contentType = tds[3].getElementsByTagName('input')[0].value
    data.status = tds[4].getElementsByTagName('input')[0].value
    if (data.url !== '' && data.find !== '' && data.replace !== '') {
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
  let table = document.getElementById('overrideTable');
  const rowCount = table.getElementsByTagName('tr').length;
  const row = table.insertRow(rowCount);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(5);
  cell1.innerHTML = '<input type="text"/>';
  cell2.innerHTML = '<input type="text"/>';
  cell3.innerHTML = '<input type="text"/>';
  cell4.innerHTML = '<input type="text"/>';
  cell5.innerHTML = '<input type="text"/>';
  cell6.innerHTML = '<input type="button" value="Delete" class="delete"/>';
  initDeleteEvent();
}

function cleanTable() {
  let table = document.getElementById('overrideTable');
  let rows = table.getElementsByTagName('tr');

  for (let i = rows.length - 1; i >= 0; i--) {
    let row = rows[i];
    if (row.getElementsByTagName('th').length === 0) {
      row.parentNode.removeChild(row);
    }
  }
}

function deleteRow(evt) {
  evt.target.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode);
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
        let rowCount = table.getElementsByTagName('tr').length;
        let row = table.insertRow(rowCount);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        cell1.innerHTML = `<input type="text" value="${escapeHTML(datum.url)}"/>`;
        cell2.innerHTML = `<input type="text" value="${escapeHTML(datum.find)}"/>`;
        cell3.innerHTML = `<input type="text" value="${escapeHTML(datum.replace)}"/>`;
        cell4.innerHTML = `<input type="text" value="${datum.contentType ? escapeHTML(datum.contentType) : ''}"/>`;
        cell5.innerHTML = `<input type="text" value="${datum.status ? escapeHTML(datum.status) : ''}"/>`;
        cell6.innerHTML = `<input type="button" value="Delete" class="delete"/>`;
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


