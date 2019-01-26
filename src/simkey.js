const activeCommand = 'trigger simkey';

(function() {
  function triggerSimkey(eventInit) {
    eventInit.bubbles = true;
    const simEvent = new KeyboardEvent('keydown', eventInit);
    console.log(simEvent);
    document.activeElement.dispatchEvent(simEvent);
  }

  browser.runtime.onMessage.addListener(
    message => {
      if (message.command == activeCommand) {
        triggerSimkey(message.eventInit);
      }
    }
  )
})();