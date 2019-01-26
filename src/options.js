const keyEventType = 'keydown';
const emptyKvtFormat = { key: { key: '' }, modifiers: {} };
const knownEventAttributes = ['char', 'charCode', 'code', 'key', 'keyCode', 'keyIdentifier', 'which'];

const eid = {
  kvtList: 'kvt-list',
  entryTemplate: 'tmp-entry',
  addEntry: 'add-entry',
  saveAll: 'save-all'
}

const sel = {
  kvtEntry: '.kvt-entry',
  kvtHandle: '.kvt-handle',
  kvtPanel: '.kvt-panel',
  kvtInputBox: '.kvt-input-box',
  kvtInputField: '.kvt-input-field',
  kvtDelete: '.kvt-delete'
};

const cls = {
  kvtHandleOpen: 'kvt-handle-open',
  displayNone: 'display-none'
};

function setupKvtEntry(entry, format) {

  // set handle text and make it toggle its respective panel
  const handle = entry.querySelector(sel.kvtHandle);
  handle.textContent = kvtNameFromFormat(format);
  handle.addEventListener('click', event => {
    const panel = entry.querySelector(sel.kvtPanel);
    panel.classList.toggle(cls.displayNone);
    handle.classList.toggle(cls.kvtHandleOpen);
  });

  // input field to summarize them in its value
  const inputBox = entry.querySelector(sel.kvtInputBox);
  const inputField = entry.querySelector(sel.kvtInputField);
  inputBox.addEventListener(keyEventType, event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    // show new keypress string in input field
    inputField.value = event.key;

    // store key attributes (some deprecated) that describe the keypress without modifiers
    inputBox.keyEventPackage = knownEventAttributes.reduce((pkg, value) => {
      if (value in event) {
        pkg[value] = event[value];
      }
      return pkg;
    }, {});
  })
  // show retreived keypress string in input field
  inputField.value = format.key.key;
  // store retrieved key attributes
  inputBox.keyEventPackage = format.key;

  // check checkboxes for modifiers that are true in format
  for (const name of knownModifiers.keys()) {
    if (name in format.modifiers && format.modifiers[name] === true) {
      entry.querySelector(`[name='${name}']`).checked = true;
    }
  }

  // delete button deletes the entry
  const deleteButton = entry.querySelector(sel.kvtDelete);
  deleteButton.addEventListener('click', event => {
    entry.remove();
  });
}

function addKvtEntry(list, template, format) {
  const clone = document.importNode(template.content, true);
  const entry = clone.querySelector(sel.kvtEntry);
  setupKvtEntry(entry, format);
  list.appendChild(clone);
}

function addKvtEntriesToList(list, template, kvtFormatList) {
  kvtFormatList.forEach(kvtFormat => {
    addKvtEntry(list, template, kvtFormat);
  });
}

function setupKvt() {
  const kvtList = document.getElementById(eid.kvtList);
  const template = document.getElementById(eid.entryTemplate);

  retrieveKvtFormatList().then(storedKvtFormatList => {
    addKvtEntriesToList(kvtList, template, storedKvtFormatList);
  });

  // button to add new blank entries at the end
  document.getElementById(eid.addEntry).addEventListener('click', event => {
    addKvtEntry(kvtList, template, emptyKvtFormat);
  });

  // button to save all current entries to storage and refresh list
  document.getElementById(eid.saveAll).addEventListener('click', event => {
    saveAll(template, kvtList);
  })

}

function readKvtListToFormatList(list) {
  function readKvtPanelToFormat(kvtPanel) {
    // add store package from key input field
    const newFormat = {
      key: kvtPanel.querySelector(sel.kvtInputBox).keyEventPackage,
      modifiers : {}
    }

    // add checked value of each modifier checkbox
    for (const name of knownModifiers.keys()) {
      newFormat.modifiers[name] = kvtPanel.querySelector(`[name='${name}']`).checked;
    }

    return newFormat;
  }

  const newKvtFormatList = [];
  for (const panel of list.querySelectorAll(sel.kvtPanel)) {
    newKvtFormatList.push(readKvtPanelToFormat(panel));
  }

  return newKvtFormatList;
}

async function saveAll(template, list) {
  const newKvtFormatList = readKvtListToFormatList(list);
  await storeKvtFormatList(newKvtFormatList);

  clearElementChildren(list);
  addKvtEntriesToList(list, template, newKvtFormatList);
}

setupKvt();