# Weather Greeting Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/hunt41lb/weather-greeting-card.svg)](https://github.com/hunt41lb/weather-greeting-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom Home Assistant Lovelace card that displays a personalized greeting with weather information and two customizable stat fields.

![Weather Greeting Card Preview](images/preview.png)

## Features

- **Personalized Greeting**: Dynamic greeting using the logged-in user's name
- **Weather Icon**: Display weather entity icon or any image URL
- **Customizable Stats**: Two flexible stat fields that can display any entity/attribute
- **Visual Editor**: Full configuration UI support - no YAML editing required
- **HACS Compatible**: Easy installation via HACS

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Frontend"
3. Click the three dots menu and select "Custom repositories"
4. Add `https://github.com/hunt41lb/weather-greeting-card` with category "Lovelace"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download `weather-greeting-card.js` from the [latest release](https://github.com/hunt41lb/weather-greeting-card/releases)
2. Copy it to `config/www/weather-greeting-card.js`
3. Add the resource in your Lovelace configuration:

```yaml
resources:
  - url: /local/weather-greeting-card.js
    type: module
```

## Usage

### Visual Editor

1. Add a new card to your dashboard
2. Search for "Weather Greeting Card"
3. Configure using the visual editor

### YAML Configuration

```yaml
type: custom:weather-greeting-card
entity: weather.forecast_home
greeting_template: "Hello, {{user}}"
icon_attribute: entity_picture
icon_width: 120
icon_height: 120
stat_1_entity: weather.forecast_home
stat_1_attribute: temperature
stat_1_suffix: "°F"
stat_2_entity: weather.forecast_home
stat_2_attribute: apparent_temperature
stat_2_prefix: "Feels Like: "
stat_2_suffix: "°F"
show_label: true
label_attribute: friendly_name
card_height: 140
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `type` | string | Yes | - | Must be `custom:weather-greeting-card` |
| `entity` | string | Yes | - | Main entity ID (typically a weather entity) |
| `greeting_template` | string | No | `Hello, {{user}}` | Greeting text. Use `{{user}}` for logged-in user's first name |
| `icon_attribute` | string | No | `entity_picture` | Attribute to use for icon URL (`entity_picture`, `state`, or custom) |
| `icon_width` | number | No | `120` | Icon width in pixels |
| `icon_height` | number | No | `120` | Icon height in pixels |
| `stat_1_entity` | string | No | Main entity | Entity for primary stat (large text) |
| `stat_1_attribute` | string | No | - | Attribute to display (leave empty for state) |
| `stat_1_prefix` | string | No | - | Text before the stat value |
| `stat_1_suffix` | string | No | - | Text after the stat value (e.g., `°F`) |
| `stat_2_entity` | string | No | Main entity | Entity for secondary stat (small text) |
| `stat_2_attribute` | string | No | - | Attribute to display (leave empty for state) |
| `stat_2_prefix` | string | No | - | Text before the stat value (e.g., `Feels Like: `) |
| `stat_2_suffix` | string | No | - | Text after the stat value |
| `show_label` | boolean | No | `true` | Show/hide the bottom label |
| `label_attribute` | string | No | - | Attribute for label (`state`, `friendly_name`, or custom) |
| `card_height` | number | No | `140` | Card height in pixels |

## Examples

### Basic Weather Card

```yaml
type: custom:weather-greeting-card
entity: weather.home
stat_1_attribute: temperature
stat_1_suffix: "°F"
stat_2_attribute: humidity
stat_2_suffix: "%"
stat_2_prefix: "Humidity: "
```

### Custom Sensor Stats

```yaml
type: custom:weather-greeting-card
entity: weather.home
greeting_template: "Good morning, {{user}}!"
stat_1_entity: sensor.outdoor_temperature
stat_1_suffix: "°F"
stat_2_entity: sensor.outdoor_humidity
stat_2_prefix: "Humidity: "
stat_2_suffix: "%"
show_label: false
```

### Mixed Entity Sources

```yaml
type: custom:weather-greeting-card
entity: weather.forecast_home
stat_1_entity: sensor.ecobee_current_temperature
stat_1_suffix: "°F"
stat_1_prefix: "Inside: "
stat_2_entity: weather.forecast_home
stat_2_attribute: temperature
stat_2_suffix: "°F"
stat_2_prefix: "Outside: "
```

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/hunt41lb/weather-greeting-card.git
cd weather-greeting-card
npm install
```

### Build

```bash
# Production build
npm run build

# Development with watch mode
npm run watch
```

### Testing

1. Build the card: `npm run build`
2. Copy `dist/weather-greeting-card.js` to your Home Assistant `config/www/` directory
3. Add the resource to Lovelace
4. Clear browser cache and reload

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

Created by [hunt41lb](https://github.com/hunt41lb)
