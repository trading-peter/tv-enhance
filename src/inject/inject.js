setTimeout(function() {
  const mod = {
    alt: false,
    ctrl: false
  };

  let shortcuts = {};

  const tools = new Set([
    'text',
    'anchored_text',
    'balloon',
    'arrow_up',
    'arrow_down',
    'arrow_left',
    'arrow_right',
    'price_label',
    'flag',
    'xabcd_pattern',
    'abcd_pattern',
    'triangle_pattern',
    '3divers_pattern',
    'head_and_shoulders',
    'cypher_pattern',
    'elliott_impulse_wave',
    'elliott_triangle_wave',
    'elliott_triple_combo',
    'elliott_correction',
    'elliott_double_combo',
    'cyclic_lines',
    'time_cycles',
    'sine_line',
    'rectangle',
    'rotated_rectangle',
    'ellipse',
    'triangle',
    'polyline',
    'curve',
    'double_curve',
    'arc',
    'vertical_line',
    'horizontal_line',
    'cross_line',
    'horizontal_ray',
    'trend_line',
    'trend_infoline',
    'trend_angle',
    'arrow',
    'ray',
    'extended',
    'parallel_channel',
    'disjoint_angle',
    'flat_bottom',
    'fib_spiral',
    'pitchfork',
    'schiff_pitchfork_modified',
    'schiff_pitchfork',
    'inside_pitchfork',
    'pitchfan',
    'gannbox_square',
    'gannbox_fan',
    'gannbox',
    'fib_speed_resist_fan',
    'fib_retracement',
    'fib_trend_ext',
    'fib_timezone',
    'fib_trend_time',
    'fib_circles',
    'fib_speed_resist_arcs',
    'fib_wedge',
    'fib_channel',
    'date_range',
    'price_range',
    'date_and_price_range',
    'long_position',
    'short_position',
    'projection',
    'forecast',
    'ghost_feed',
    'bars_pattern',
    'brush',
    'eraser',
    'measure',
    'zoom',
    'cursor',
    'dot'
  ]);

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