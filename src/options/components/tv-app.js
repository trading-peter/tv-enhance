/**
@license
Copyright (c) 2019 Peter Kaske
This program is available under Apache License Version 2.0
*/

import { LitElement, html } from 'lit-element';
import { toolList } from './toolList.js';

/**
# tv-app

*/

class TvApp extends LitElement {
  render() {
    return html`
      <style>
        :host {
          display: block;
        }

        .sc-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 20px;
          align-items: center;
        }

        .sc-grid > div {
          padding: 4px 0;
        }
      </style>

      <h3>Custom Shortcuts</h3>

      <div class="sc-grid" @keyup=${this._saveShortcuts}>
        <div>
          Toggle Magnet Mode
        </div>
        <div>
          <select name="magnetModeModifier" @change=${this._saveShortcuts}>
            <option value="alt" ?selected=${this._shortCutModEq('magnetMode', 'alt')}>alt</option>
            <option value="ctrl" ?selected=${this._shortCutModEq('magnetMode', 'ctrl')}>ctrl</option>
          </select> + <input type="text" name="magnetMode" value=${this._getShortCutKey('magnetMode')}>
        </div>

        <div>
          Hide All Drawing Tools
        </div>
        <div>
          <select name="hideAllDrawingToolsModifier" @change=${this._saveShortcuts}>
            <option value="alt" ?selected=${this._shortCutModEq('hideAllDrawingTools', 'alt')}>alt</option>
            <option value="ctrl" ?selected=${this._shortCutModEq('hideAllDrawingTools', 'ctrl')}>ctrl</option>
          </select> + <input type="text" name="hideAllDrawingTools" value=${this._getShortCutKey('hideAllDrawingTools')}>
        </div>

        ${this.tools.map(tool => html`
          <div>
            ${tool.label}
          </div>
          <div>
            <select name="${tool.action}Modifier" @change=${this._saveShortcuts}>
              <option value="alt" ?selected=${this._shortCutModEq(tool.action, 'alt')}>alt</option>
              <option value="ctrl" ?selected=${this._shortCutModEq(tool.action, 'ctrl')}>ctrl</option>
            </select> + <input type="text" name=${tool.action} value=${this._getShortCutKey(tool.action)}>
          </div>
        `)}
      </div>
    `;
  }

  static get properties() {
    return {
      shortcuts: { type: Object },
      tools: { type: Array }
    };
  }

  constructor() {
    super();

    this.shortcuts = {};

    this.tools = toolList;
  }

  connectedCallback() {
    super.connectedCallback();
    chrome.storage.sync.get([ 'shortcuts' ], settings => {
      this.shortcuts = settings.shortcuts;
    });
  }

  _saveShortcuts() {
    const wrapper = this.shadowRoot.querySelector('.sc-grid');
    const scElList = wrapper.querySelectorAll('input');
    const shortcuts = {};

    scElList.forEach(el => {
      const name = el.name;
      const key = el.value.trim().toLowerCase();
      const mod = wrapper.querySelector(`select[name="${name}Modifier"]`).value;
      
      if (key !== '') {
        shortcuts[name] = { key, mod };
      }
    });

    chrome.storage.sync.set({ shortcuts }, () => {
      chrome.tabs.query({}, function(tabs) {
        for (var i=0; i < tabs.length; ++i) {
          chrome.tabs.sendMessage(tabs[i].id, { action: 'reloadShortcuts' });
        }
      });
    });

  }

  _getShortCutKey(action) {
    return this.shortcuts[action] ? this.shortcuts[action].key : '';
  }

  _shortCutModEq(action, type) {
    return this.shortcuts[action] && this.shortcuts[action].mod === type;
  }
}

window.customElements.define('tv-app', TvApp);
