import { toolList } from "../options/components/toolList";

setTimeout(function() {
  const mod = {
    alt: false,
    ctrl: false
  };

  let shortcuts = {};

  const tools = new Set();

  for (const tool of toolList) {
    tools.add(tool.action);
  }

  const wv = {
    magnetEnabled: window.TradingViewApi.magnetEnabled(),
    hideAllDrawingTools: window.TradingViewApi.hideAllDrawingTools()
  }

  const keydownListener = e => {
    if (e.keyCode === 18) {
      mod.alt = true;

      // Reset the state of the alt key after 5 seconds to prevent weird behavior when the user switches between applications using alt+tab.
      setTimeout(() => {
        mod.alt = false;
      }, 5000);
      return;
    }

    if (e.keyCode === 17) {
      mod.ctrl = true;
      return;
    }
    
    if (!mod.alt && !mod.ctrl) return;
    
    const action = findShortcut(e.key);

    if (action && mod[shortcuts[action].mod] === true) {
      executeShortcut(action);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const keyupListener = e => {
    switch (e.keyCode) {
      case 18:
        mod.alt = false;
      case 17:
        mod.ctrl = false;
    }
  };

  window.TradingViewApi.subscribe('onPlusClick', e => {
    navigator.clipboard.writeText(e.price);
  });

  window.TradingViewApi.activeChart().onSymbolChanged().subscribe(null, e => {
    const symbol = e.full_name;
  });

  window.TradingViewApi.activeChart().onIntervalChanged().subscribe(null, e => {
    const interval = e.interval;
  });

  window.TradingViewApi.activeChart().onVisibleRangeChanged().subscribe(null, e => {
    
  });

  document.addEventListener('tvh_shortcuts', e => {
    shortcuts = e.detail;
    window.removeEventListener('keydown', keydownListener, true);
    window.removeEventListener('keyup', keyupListener, true);
    window.addEventListener('keydown', keydownListener, true);
    window.addEventListener('keyup', keyupListener, true);
  });

  function executeShortcut(action) {
    if (action === 'magnetMode') {
      const { magnetEnabled } = wv;
      magnetEnabled.setValue(!magnetEnabled.value())
    }

    if (action === 'hideAllDrawingTools') {
      const { hideAllDrawingTools } = wv;
      hideAllDrawingTools.setValue(!hideAllDrawingTools.value());
    }

    if (action === 'removeAllShapes') {
      window.TradingViewApi.activeChart().removeAllShapes();
    }

    console.log(action, tools);
    if (tools.has(action)) {
      window.TradingViewApi.selectLineTool(action);
    }
  }

  function findShortcut(key) {
    for (const action in shortcuts) {
      if (shortcuts[action].key === key) return action;
    }
  }
});