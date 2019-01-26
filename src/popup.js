const activeCommand = 'trigger simkey';

const cls = {
  kvtButton: 'kvt-button'
}

const eid = {
  kvtContainer: 'kvt-container'
}

function addKvtButton(kvtContainer, kvtFormat) {
  const eventInit = Object.assign(kvtFormat.key, kvtFormat.modifiers);

  function passEventInit(tabs) {
    console.log(eventInit);
    browser.tabs.sendMessage(tabs[0].id, {
      command: activeCommand,
      eventInit: eventInit
    });
  }

  const item = document.createElement('div');
  item.className = cls.kvtButton;
  item.textContent = kvtNameFromFormat(kvtFormat);

  item.addEventListener('click', event => {
    browser.tabs.query({ active: true, currentWindow: true})
      .then(passEventInit)
      .catch(console.error);
  })

  kvtContainer.appendChild(item);
}

function setupPopup() {
  const kvtContainer = document.getElementById(eid.kvtContainer);

  retrieveKvtFormatList().then(storedKvtFormatList => {
    storedKvtFormatList.forEach(kvtFormat => {
      addKvtButton(kvtContainer, kvtFormat);
    });
  });
}

setupPopup();