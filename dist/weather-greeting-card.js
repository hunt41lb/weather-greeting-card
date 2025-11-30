/**
 * Weather Greeting Card for Home Assistant
 * Version: 1.0.0
 * https://github.com/hunt41lb/weather-greeting-card
 */

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

// Console info
console.info(
  "%c WEATHER-GREETING-CARD %c v1.0.0 ",
  "color: white; background: #3498db; font-weight: 700;",
  "color: #3498db; background: white; font-weight: 700;"
);

// Register card info for picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "weather-greeting-card",
  name: "Weather Greeting Card",
  preview: true,
  description: "A customizable weather card with greeting, icon, and two configurable stat fields.",
  documentationURL: "https://github.com/hunt41lb/weather-greeting-card",
});

class WeatherGreetingCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static getConfigElement() {
    return document.createElement("weather-greeting-card-editor");
  }

  static getStubConfig(hass) {
    const weatherEntities = Object.keys(hass.states).filter((eid) =>
      eid.startsWith("weather.")
    );
    const defaultWeather = weatherEntities[0] || "weather.home";

    return {
      entity: defaultWeather,
      greeting_template: "Hello, {{user}}",
      icon_attribute: "entity_picture",
      icon_width: 120,
      icon_height: 120,
      stat_1_entity: defaultWeather,
      stat_1_attribute: "temperature",
      stat_1_suffix: "°F",
      stat_2_entity: defaultWeather,
      stat_2_attribute: "apparent_temperature",
      stat_2_suffix: "°F",
      stat_2_prefix: "Feels Like: ",
      show_label: true,
      label_attribute: "friendly_name",
      card_height: 140,
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this.config = {
      greeting_template: "Hello, {{user}}",
      icon_attribute: "entity_picture",
      icon_width: 120,
      icon_height: 120,
      stat_1_prefix: "",
      stat_1_suffix: "",
      stat_2_prefix: "",
      stat_2_suffix: "",
      show_label: true,
      label_attribute: "",
      card_height: 140,
      ...config,
    };
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return {
      rows: 3,
      columns: 12,
      min_rows: 2,
      max_rows: 4,
    };
  }

  _getUserName() {
    if (this.hass?.user) {
      return this.hass.user.name.split(" ")[0];
    }
    return "User";
  }

  _getGreeting() {
    const template = this.config.greeting_template || "Hello, {{user}}";
    return template.replace(/\{\{user\}\}/g, this._getUserName());
  }

  _getEntityState(entityId) {
    if (!entityId || !this.hass) return null;
    return this.hass.states[entityId] || null;
  }

  _getIconUrl() {
    const entity = this._getEntityState(this.config.entity);
    if (!entity) return "";

    const attr = this.config.icon_attribute || "entity_picture";

    if (attr === "entity_picture") {
      return entity.attributes.entity_picture || "";
    }
    if (attr === "state") {
      return entity.state || "";
    }
    return entity.attributes[attr] || "";
  }

  _getStatValue(statNum) {
    const entityKey = `stat_${statNum}_entity`;
    const attrKey = `stat_${statNum}_attribute`;
    const prefixKey = `stat_${statNum}_prefix`;
    const suffixKey = `stat_${statNum}_suffix`;

    const entityId = this.config[entityKey] || this.config.entity;
    const entity = this._getEntityState(entityId);

    if (!entity) return "";

    const attr = this.config[attrKey];
    let value;

    if (!attr || attr === "state") {
      value = entity.state;
    } else {
      value = entity.attributes[attr];
    }

    if (value === undefined || value === null) return "";

    const prefix = this.config[prefixKey] || "";
    const suffix = this.config[suffixKey] || "";

    return `${prefix}${value}${suffix}`;
  }

  _getLabel() {
    if (!this.config.show_label) return "";

    const entity = this._getEntityState(this.config.entity);
    if (!entity) return "";

    const attr = this.config.label_attribute;

    if (!attr || attr === "state") {
      return entity.state;
    }
    if (attr === "friendly_name") {
      return entity.attributes.friendly_name || "";
    }
    return entity.attributes[attr] || "";
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const entity = this._getEntityState(this.config.entity);
    if (!entity) {
      return html`
        <ha-card>
          <div class="error">Entity not found: ${this.config.entity}</div>
        </ha-card>
      `;
    }

    const iconUrl = this._getIconUrl();
    const stat1 = this._getStatValue(1);
    const stat2 = this._getStatValue(2);
    const label = this._getLabel();
    const greeting = this._getGreeting();

    return html`
      <ha-card>
        <div class="card-content" style="height: ${this.config.card_height}px;">
          <div class="greeting">${greeting}</div>
          <div class="main-content">
            <div class="icon-container">
              ${iconUrl
                ? html`<img
                    src="${iconUrl}"
                    width="${this.config.icon_width}"
                    height="${this.config.icon_height}"
                    alt="Weather icon"
                  />`
                : html`<ha-icon icon="mdi:weather-cloudy" class="fallback-icon"></ha-icon>`}
            </div>
            <div class="stats-container">
              ${stat1 ? html`<div class="stat-1">${stat1}</div>` : ""}
              ${stat2 ? html`<div class="stat-2">${stat2}</div>` : ""}
            </div>
          </div>
          ${label && this.config.show_label ? html`<div class="label">${label}</div>` : ""}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      ha-card {
        padding: 5px;
        box-sizing: border-box;
      }
      .card-content {
        display: grid;
        grid-template-areas:
          "greeting greeting greeting greeting"
          "icon icon stats stats"
          "label label label label";
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: auto 1fr auto;
        height: 100%;
        gap: 4px;
      }
      .greeting {
        grid-area: greeting;
        justify-self: center;
        font-size: 20px;
        font-weight: 600;
      }
      .main-content {
        display: contents;
      }
      .icon-container {
        grid-area: icon;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-container img {
        object-fit: contain;
      }
      .fallback-icon {
        --mdc-icon-size: 80px;
        color: var(--primary-color);
      }
      .stats-container {
        grid-area: stats;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding-left: 8px;
      }
      .stat-1 {
        font-size: 40px;
        font-weight: 400;
        line-height: 1.1;
      }
      .stat-2 {
        font-size: 12px;
        font-weight: 400;
        padding-top: 7px;
      }
      .label {
        grid-area: label;
        justify-self: center;
        align-self: center;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
        text-align: center;
      }
      .error {
        color: var(--error-color, red);
        padding: 16px;
      }
    `;
  }
}

class WeatherGreetingCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  setConfig(config) {
    this._config = { ...config };
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;

    const target = ev.target;
    const configKey = target.configKey;
    let value = target.value;

    if (target.type === "checkbox") {
      value = target.checked;
    }

    if (target.type === "number") {
      value = parseInt(value, 10);
    }

    if (this._config[configKey] === value) return;

    const newConfig = { ...this._config };

    if (value === "" || value === undefined) {
      delete newConfig[configKey];
    } else {
      newConfig[configKey] = value;
    }

    this._config = newConfig;

    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _entityChanged(ev) {
    const target = ev.target;
    const newValue = ev.detail?.value;
    const configKey = target?.configKey || "entity";

    if (!newValue || this._config[configKey] === newValue) return;

    const newConfig = { ...this._config, [configKey]: newValue };
    this._config = newConfig;

    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="section">
          <h3>Main Entity</h3>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.entity || ""}
            .configKey=${"entity"}
            @value-changed=${this._entityChanged}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="section">
          <h3>Greeting</h3>
          <ha-textfield
            label="Greeting Template (use {{user}} for name)"
            .value=${this._config.greeting_template || ""}
            .configKey=${"greeting_template"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="section">
          <h3>Icon Settings</h3>
          <ha-textfield
            label="Icon Attribute (entity_picture, state, or custom)"
            .value=${this._config.icon_attribute || ""}
            .configKey=${"icon_attribute"}
            @input=${this._valueChanged}
          ></ha-textfield>
          <div class="row">
            <ha-textfield
              label="Icon Width"
              type="number"
              .value=${String(this._config.icon_width || 120)}
              .configKey=${"icon_width"}
              @input=${this._valueChanged}
            ></ha-textfield>
            <ha-textfield
              label="Icon Height"
              type="number"
              .value=${String(this._config.icon_height || 120)}
              .configKey=${"icon_height"}
              @input=${this._valueChanged}
            ></ha-textfield>
          </div>
        </div>

        <div class="section">
          <h3>Stat 1 (Primary - Large)</h3>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.stat_1_entity || ""}
            .configKey=${"stat_1_entity"}
            @value-changed=${this._entityChanged}
            allow-custom-entity
            label="Entity (leave empty to use main entity)"
          ></ha-entity-picker>
          <ha-textfield
            label="Attribute (leave empty for state)"
            .value=${this._config.stat_1_attribute || ""}
            .configKey=${"stat_1_attribute"}
            @input=${this._valueChanged}
          ></ha-textfield>
          <div class="row">
            <ha-textfield
              label="Prefix"
              .value=${this._config.stat_1_prefix || ""}
              .configKey=${"stat_1_prefix"}
              @input=${this._valueChanged}
            ></ha-textfield>
            <ha-textfield
              label="Suffix"
              .value=${this._config.stat_1_suffix || ""}
              .configKey=${"stat_1_suffix"}
              @input=${this._valueChanged}
            ></ha-textfield>
          </div>
        </div>

        <div class="section">
          <h3>Stat 2 (Secondary - Small)</h3>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.stat_2_entity || ""}
            .configKey=${"stat_2_entity"}
            @value-changed=${this._entityChanged}
            allow-custom-entity
            label="Entity (leave empty to use main entity)"
          ></ha-entity-picker>
          <ha-textfield
            label="Attribute (leave empty for state)"
            .value=${this._config.stat_2_attribute || ""}
            .configKey=${"stat_2_attribute"}
            @input=${this._valueChanged}
          ></ha-textfield>
          <div class="row">
            <ha-textfield
              label="Prefix"
              .value=${this._config.stat_2_prefix || ""}
              .configKey=${"stat_2_prefix"}
              @input=${this._valueChanged}
            ></ha-textfield>
            <ha-textfield
              label="Suffix"
              .value=${this._config.stat_2_suffix || ""}
              .configKey=${"stat_2_suffix"}
              @input=${this._valueChanged}
            ></ha-textfield>
          </div>
        </div>

        <div class="section">
          <h3>Label Settings</h3>
          <ha-formfield label="Show Label">
            <ha-switch
              .checked=${this._config.show_label !== false}
              .configKey=${"show_label"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-textfield
            label="Label Attribute (state, friendly_name, or custom)"
            .value=${this._config.label_attribute || ""}
            .configKey=${"label_attribute"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="section">
          <h3>Card Settings</h3>
          <ha-textfield
            label="Card Height (px)"
            type="number"
            .value=${String(this._config.card_height || 140)}
            .configKey=${"card_height"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        padding: 16px;
      }
      .section {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--divider-color);
      }
      .section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      ha-entity-picker,
      ha-textfield {
        display: block;
        width: 100%;
        margin-bottom: 12px;
      }
      .row {
        display: flex;
        gap: 12px;
      }
      .row ha-textfield {
        flex: 1;
      }
      ha-formfield {
        display: block;
        margin-bottom: 12px;
      }
    `;
  }
}

customElements.define("weather-greeting-card", WeatherGreetingCard);
customElements.define("weather-greeting-card-editor", WeatherGreetingCardEditor);
