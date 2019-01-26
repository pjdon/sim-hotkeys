const entryNameJoiner = " + ";
const kvtFormatListKey = 'kvtFormatList';
const knownModifiers = new Map(
  [['ctrlKey', 'Ctrl'], ['shiftKey', 'Shift'], ['altKey', 'Alt'], ['metaKey', 'Meta']]
);

const defaults = {
  // TODO: adapt for OS and browser
  kvtFormatList : {
    base : [
      {
        key: { key: 'w', keyCode: 87 },
        modifiers: { ctrlKey: true }
      },
      {
        key: { key: 'q', keyCode: 81 },
        modifiers: { ctrlKey: true, shiftKey: true }
      }
    ]
  }
}
function kvtNameFromFormat(format) {
  const parts = [];
  for (const [key, value] of knownModifiers.entries()) {
    if (key in format.modifiers && format.modifiers[key] === true) {
      parts.push(value);
    }
  }
  const capitalizedKey = format.key.key.charAt(0).toUpperCase() + format.key.key.slice(1);
  parts.push(capitalizedKey);
  return parts.join(entryNameJoiner);
}

function clearElementChildren(element) {
  let nextChild;
  while ((nextChild = element.firstChild) != null) {
    element.removeChild(nextChild);
  }
}

async function isFirstRun() {
  const result = await browser.storage.sync.get("firstRun");
  if ("fistRun" in result || result.firstRun === false) {
    return false;
  } else {
    return true;
  }
}

function getDefaultKvtFormatList() {
  // TODO: adapt to OS and browser
  return defaults.kvtFormatList.base;
}

function resolveNewKvtFormatList() {
  const defaultKvtFormatList = getDefaultKvtFormatList();
  storeKvtFormatList(defaultKvtFormatList);
  return defaultKvtFormatList;
}

async function retrieveKvtFormatList() {
  if (await isFirstRun()) {
    await browser.storage.sync.set({firstRun: false});
    return resolveNewKvtFormatList();
  } else {
    const result = await browser.storage.sync.get(kvtFormatListKey);
    if (kvtFormatListKey in result) {
      return result[kvtFormatListKey];
    } else {
      return resolveNewKvtFormatList();
    }
  }
}

async function storeKvtFormatList(kvtFormatList) {
  await browser.storage.sync.set({[kvtFormatListKey]: kvtFormatList});
}