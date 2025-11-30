/**
 * Weather Greeting Card for Home Assistant
 * Version: 1.1.0
 * https://github.com/hunt41lb/weather-greeting-card
 *
 * Features animated weather icons based on condition and day/night
 */

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

// Console info
console.info(
  "%c WEATHER-GREETING-CARD %c v1.1.0 ",
  "color: white; background: #3498db; font-weight: 700;",
  "color: #3498db; background: white; font-weight: 700;"
);

// Register card info for picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "weather-greeting-card",
  name: "Weather Greeting Card",
  preview: true,
  description: "A customizable weather card with greeting, animated icons, and two configurable stat fields.",
  documentationURL: "https://github.com/hunt41lb/weather-greeting-card",
});

// ============================================================================
// ANIMATED WEATHER ICONS (Inline SVGs)
// Based on Meteocons by Bas Milius - MIT License
// ============================================================================

const WEATHER_ICONS = {
  // Clear conditions
  "clear-day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="26.75" x2="37.25" y1="22.91" y2="41.09" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbbf24"/><stop offset=".45" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><circle cx="32" cy="32" r="10.5" fill="url(#a)" stroke="#f8af18" stroke-miterlimit="10" stroke-width=".5"/><path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M32 15.71V9.5m0 45v-6.21m11.52-27.81l4.39-4.39M16.09 47.91l4.39-4.39m0-23l-4.39-4.39m31.82 31.78l-4.39-4.39M15.71 32H9.5m45 0h-6.21"><animateTransform attributeName="transform" dur="45s" repeatCount="indefinite" type="rotate" values="0 32 32; 360 32 32"/></path></svg>`,

  "clear-night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="21.92" x2="38.52" y1="18.75" y2="47.52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#86c3db"/><stop offset=".45" stop-color="#86c3db"/><stop offset="1" stop-color="#5eafcf"/><animateTransform attributeName="gradientTransform" dur="10s" repeatCount="indefinite" type="rotate" values="5 32 32; -15 32 32; 5 32 32"/></linearGradient></defs><path fill="url(#a)" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="M46.66 36.2a16.66 16.66 0 01-16.78-16.55 16.29 16.29 0 01.55-4.15A16.56 16.56 0 1048.5 36.1c-.61.06-1.22.1-1.84.1z"><animateTransform attributeName="transform" dur="10s" repeatCount="indefinite" type="rotate" values="-5 32 32; 15 32 32; -5 32 32"/></path></svg>`,

  // Cloudy conditions
  "cloudy-day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path fill="url(#a)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"><animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></path></svg>`,

  "cloudy-night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path fill="url(#a)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"><animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></path></svg>`,

  "cloudy": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path fill="url(#a)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"><animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></path></svg>`,

  // Rainy conditions
  "rainy-day": `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><defs><linearGradient id="b" x1="16.5" x2="21.5" y1="19.67" y2="28.33" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbbf24"/><stop offset=".45" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient><linearGradient id="c" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient><linearGradient id="a" x1="22.53" x2="25.47" y1="42.95" y2="48.05" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4286ee"/><stop offset=".45" stop-color="#4286ee"/><stop offset="1" stop-color="#0950bc"/></linearGradient><linearGradient id="d" x1="29.53" x2="32.47" y1="42.95" y2="48.05" xlink:href="#a"/><linearGradient id="e" x1="36.53" x2="39.47" y1="42.95" y2="48.05" xlink:href="#a"/></defs><circle cx="19" cy="24" r="5" fill="url(#b)" stroke="#f8af18" stroke-miterlimit="10" stroke-width=".5"/><path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M19 15.67V12.5m0 23v-3.17m5.89-14.22l2.24-2.24M10.87 32.13l2.24-2.24m0-11.78l-2.24-2.24m16.26 16.26l-2.24-2.24M7.5 24h3.17m19.83 0h-3.17"><animateTransform attributeName="transform" dur="45s" repeatCount="indefinite" type="rotate" values="0 19 24; 360 19 24"/></path><path fill="url(#c)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><path fill="none" stroke="url(#a)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M24.39 43.03l-.78 4.94"><animateTransform attributeName="transform" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#d)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M31.39 43.03l-.78 4.94"><animateTransform attributeName="transform" begin="-0.4s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.4s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#e)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.39 43.03l-.78 4.94"><animateTransform attributeName="transform" begin="-0.2s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.2s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path></svg>`,

  "rainy-night": `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><defs><linearGradient id="b" x1="13.58" x2="24.15" y1="15.57" y2="33.87" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#86c3db"/><stop offset=".45" stop-color="#86c3db"/><stop offset="1" stop-color="#5eafcf"/><animateTransform attributeName="gradientTransform" dur="10s" repeatCount="indefinite" type="rotate" values="10 19.22 24.293; -10 19.22 24.293; 10 19.22 24.293"/></linearGradient><linearGradient id="c" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient><linearGradient id="a" x1="22.53" x2="25.47" y1="42.95" y2="48.05" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4286ee"/><stop offset=".45" stop-color="#4286ee"/><stop offset="1" stop-color="#0950bc"/></linearGradient><linearGradient id="d" x1="29.53" x2="32.47" y1="42.95" y2="48.05" xlink:href="#a"/><linearGradient id="e" x1="36.53" x2="39.47" y1="42.95" y2="48.05" xlink:href="#a"/></defs><path fill="url(#b)" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="M29.33 26.68a10.61 10.61 0 01-10.68-10.54A10.5 10.5 0 0119 13.5a10.54 10.54 0 1011.5 13.11 11.48 11.48 0 01-1.17.07z"><animateTransform attributeName="transform" dur="10s" repeatCount="indefinite" type="rotate" values="-10 19.22 24.293; 10 19.22 24.293; -10 19.22 24.293"/></path><path fill="url(#c)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><path fill="none" stroke="url(#a)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M24.39 43.03l-.78 4.94"><animateTransform attributeName="transform" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#d)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M31.39 43.03l-.78 4.94"><animateTransform attributeName="transform" begin="-0.4s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.4s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#e)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.39 43.03l-.78 4.94"><animateTransform attributeName="transform" begin="-0.2s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.2s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path></svg>`,

  "rainy": `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><defs><linearGradient id="b" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient><linearGradient id="a" x1="22.53" x2="25.47" y1="42.95" y2="48.05" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4286ee"/><stop offset=".45" stop-color="#4286ee"/><stop offset="1" stop-color="#0950bc"/></linearGradient><linearGradient id="c" x1="29.53" x2="32.47" y1="42.95" y2="48.05" xlink:href="#a"/><linearGradient id="d" x1="36.53" x2="39.47" y1="42.95" y2="48.05" xlink:href="#a"/></defs><path fill="url(#b)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/><path fill="none" stroke="url(#a)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M24.39 43.03l-.78 4.94"><animateTransform attributeName="transform" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#c)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M31.39 43.03l-.78 4.94"><animateTransform attributeName="transform" begin="-0.4s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.4s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#d)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M38.39 43.03l-.78 4.94"><animateTransform attributeName="transform" begin="-0.2s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.2s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path></svg>`,

  // Pouring / Heavy Rain
  "pouring": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="pour-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#pour-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M22.08 43.01l-1.12 6.9m8.32-8.89l-1.12 6.9m8.32-8.89l-1.12 6.9m8.32-8.89l-1.12 6.9">
        <animateTransform attributeName="transform" dur=".5s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/>
        <animate attributeName="opacity" dur=".5s" repeatCount="indefinite" values="0; 1; 1; 0"/>
      </path>
    </g>
  </svg>`,

  // Snowy conditions
  "snowy-day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="sd-sun" x1="13.5" y1="15.67" x2="17" y2="21.5" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fbbf24"/>
        <stop offset=".45" stop-color="#fbbf24"/>
        <stop offset="1" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="sd-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <g>
      <circle cx="19" cy="20" r="5" fill="url(#sd-sun)" stroke="#f8af18" stroke-miterlimit="10" stroke-width=".5"/>
      <path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M19 10v-2m0 24v-2m6.93-12.93l1.42-1.42m-18.28 18.28l1.42-1.42m0-14.14l-1.42-1.42m18.28 18.28l-1.42-1.42M10 20H8m22 0h-2">
        <animateTransform attributeName="transform" dur="45s" from="0 19 20" repeatCount="indefinite" to="360 19 20" type="rotate"/>
      </path>
    </g>
    <path fill="url(#sd-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <circle cx="24" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="31" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" begin="-.4s" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.4s" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="38" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" begin="-.8s" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.8s" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
    </g>
  </svg>`,

  "snowy-night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="sn-moon" x1="13.58" y1="15.57" x2="24.15" y2="33.87" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#86c3db"/>
        <stop offset=".45" stop-color="#86c3db"/>
        <stop offset="1" stop-color="#5eead4"/>
      </linearGradient>
      <linearGradient id="sn-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <g>
      <path fill="url(#sn-moon)" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="M29.33 26.68a10.61 10.61 0 01-10.68-10.54 10.5 10.5 0 01.34-2.65 10.56 10.56 0 1011.51 13.11 11.75 11.75 0 01-1.17.08z">
        <animateTransform attributeName="transform" dur="5s" repeatCount="indefinite" type="rotate" values="-5 19 20; 15 19 20; -5 19 20"/>
      </path>
    </g>
    <path fill="url(#sn-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <circle cx="24" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="31" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" begin="-.4s" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.4s" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="38" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" begin="-.8s" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.8s" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
    </g>
  </svg>`,

  "snowy": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="snow-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#snow-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <circle cx="24" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="31" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" begin="-.4s" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.4s" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="38" cy="46" r="1.5" fill="#7dd3fc">
        <animateTransform attributeName="transform" begin="-.8s" dur="1.2s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.8s" dur="1.2s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
    </g>
  </svg>`,

  // Thunderstorm
  "lightning-day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="ld-sun" x1="13.5" y1="15.67" x2="17" y2="21.5" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fbbf24"/>
        <stop offset=".45" stop-color="#fbbf24"/>
        <stop offset="1" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="ld-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <g>
      <circle cx="19" cy="20" r="5" fill="url(#ld-sun)" stroke="#f8af18" stroke-miterlimit="10" stroke-width=".5"/>
      <path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M19 10v-2m0 24v-2m6.93-12.93l1.42-1.42m-18.28 18.28l1.42-1.42m0-14.14l-1.42-1.42m18.28 18.28l-1.42-1.42M10 20H8m22 0h-2">
        <animateTransform attributeName="transform" dur="45s" from="0 19 20" repeatCount="indefinite" to="360 19 20" type="rotate"/>
      </path>
    </g>
    <path fill="url(#ld-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <polygon fill="#f6a823" points="30 36 26 48 30 48 28 58 38 44 32 44 36 36 30 36">
        <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1; 1; 1; 1; 1; 1; 0.1; 1; 0.1; 1; 1; 0.1; 1"/>
      </polygon>
    </g>
  </svg>`,

  "lightning-night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="ln-moon" x1="13.58" y1="15.57" x2="24.15" y2="33.87" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#86c3db"/>
        <stop offset=".45" stop-color="#86c3db"/>
        <stop offset="1" stop-color="#5eead4"/>
      </linearGradient>
      <linearGradient id="ln-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <g>
      <path fill="url(#ln-moon)" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="M29.33 26.68a10.61 10.61 0 01-10.68-10.54 10.5 10.5 0 01.34-2.65 10.56 10.56 0 1011.51 13.11 11.75 11.75 0 01-1.17.08z">
        <animateTransform attributeName="transform" dur="5s" repeatCount="indefinite" type="rotate" values="-5 19 20; 15 19 20; -5 19 20"/>
      </path>
    </g>
    <path fill="url(#ln-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <polygon fill="#f6a823" points="30 36 26 48 30 48 28 58 38 44 32 44 36 36 30 36">
        <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1; 1; 1; 1; 1; 1; 0.1; 1; 0.1; 1; 1; 0.1; 1"/>
      </polygon>
    </g>
  </svg>`,

  "lightning": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="light-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#light-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <polygon fill="#f6a823" points="30 36 26 48 30 48 28 58 38 44 32 44 36 36 30 36">
        <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1; 1; 1; 1; 1; 1; 0.1; 1; 0.1; 1; 1; 0.1; 1"/>
      </polygon>
    </g>
  </svg>`,

  "lightning-rainy": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="lr-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#lr-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <polygon fill="#f6a823" points="30 36 26 48 30 48 28 58 38 44 32 44 36 36 30 36">
        <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1; 1; 1; 1; 1; 1; 0.1; 1; 0.1; 1; 1; 0.1; 1"/>
      </polygon>
    </g>
    <g>
      <path fill="none" stroke="#2885c7" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M17 45l-.5 3m6-5l-.5 3m6-5l-.5 3m13.5-1l-.5 3m6-5l-.5 3m6-5l-.5 3">
        <animateTransform attributeName="transform" dur=".7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/>
        <animate attributeName="opacity" dur=".7s" repeatCount="indefinite" values="0; 1; 1; 0"/>
      </path>
    </g>
  </svg>`,

  // Foggy/Hazy
  "fog": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="fog-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#fog-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <path fill="none" stroke="#e6effc" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 48h30">
        <animateTransform attributeName="transform" dur="5s" repeatCount="indefinite" type="translate" values="-4 0; 4 0; -4 0"/>
      </path>
      <path fill="none" stroke="#e6effc" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 54h30">
        <animateTransform attributeName="transform" dur="5s" repeatCount="indefinite" type="translate" values="4 0; -4 0; 4 0"/>
      </path>
    </g>
  </svg>`,

  // Windy
  "windy": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="windy-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#windy-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z">
      <animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/>
    </path>
    <g>
      <path fill="none" stroke="#6b7280" stroke-dasharray="35 22" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M17 52c8 0 8-4 16-4s8 4 16 4">
        <animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="translate" values="-8 0; 8 0"/>
      </path>
      <path fill="none" stroke="#9ca3af" stroke-dasharray="25 20" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M17 58c8 0 8-4 16-4s8 4 16 4">
        <animateTransform attributeName="transform" begin="-.5s" dur="2s" repeatCount="indefinite" type="translate" values="-8 0; 8 0"/>
      </path>
    </g>
  </svg>`,

  // Hail
  "hail": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="hail-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#hail-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"/>
    <g>
      <circle cx="24" cy="46" r="3" fill="#94a3b8">
        <animateTransform attributeName="transform" dur=".6s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" dur=".6s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="31" cy="46" r="3" fill="#94a3b8">
        <animateTransform attributeName="transform" begin="-.2s" dur=".6s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.2s" dur=".6s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
      <circle cx="38" cy="46" r="3" fill="#94a3b8">
        <animateTransform attributeName="transform" begin="-.4s" dur=".6s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/>
        <animate attributeName="opacity" begin="-.4s" dur=".6s" repeatCount="indefinite" values="1; 1; 1; 0"/>
      </circle>
    </g>
  </svg>`,

  // Partly Cloudy
  "partlycloudy-day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="pc-sun" x1="13.5" y1="15.67" x2="17" y2="21.5" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fbbf24"/>
        <stop offset=".45" stop-color="#fbbf24"/>
        <stop offset="1" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="pc-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <g>
      <circle cx="19" cy="20" r="5" fill="url(#pc-sun)" stroke="#f8af18" stroke-miterlimit="10" stroke-width=".5"/>
      <path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M19 10v-2m0 24v-2m6.93-12.93l1.42-1.42m-18.28 18.28l1.42-1.42m0-14.14l-1.42-1.42m18.28 18.28l-1.42-1.42M10 20H8m22 0h-2">
        <animateTransform attributeName="transform" dur="45s" from="0 19 20" repeatCount="indefinite" to="360 19 20" type="rotate"/>
      </path>
    </g>
    <path fill="url(#pc-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z">
      <animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/>
    </path>
  </svg>`,

  "partlycloudy-night": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="pcn-moon" x1="13.58" y1="15.57" x2="24.15" y2="33.87" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#86c3db"/>
        <stop offset=".45" stop-color="#86c3db"/>
        <stop offset="1" stop-color="#5eead4"/>
      </linearGradient>
      <linearGradient id="pcn-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <g>
      <path fill="url(#pcn-moon)" stroke="#72b9d5" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="M29.33 26.68a10.61 10.61 0 01-10.68-10.54 10.5 10.5 0 01.34-2.65 10.56 10.56 0 1011.51 13.11 11.75 11.75 0 01-1.17.08z">
        <animateTransform attributeName="transform" dur="5s" repeatCount="indefinite" type="rotate" values="-5 19 20; 15 19 20; -5 19 20"/>
      </path>
    </g>
    <path fill="url(#pcn-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z">
      <animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/>
    </path>
  </svg>`,

  // Exceptional/Unknown
  "exceptional": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="exc-cloud" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#f3f7fe"/>
        <stop offset=".45" stop-color="#f3f7fe"/>
        <stop offset="1" stop-color="#deeafb"/>
      </linearGradient>
    </defs>
    <path fill="url(#exc-cloud)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z">
      <animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/>
    </path>
    <text x="32" y="40" text-anchor="middle" font-size="16" fill="#6b7280">?</text>
  </svg>`,
};

// Mapping from Home Assistant weather conditions to icon keys
const CONDITION_MAP = {
  "clear-night": "clear-night",
  "sunny": "clear-day",
  "cloudy": "cloudy",
  "fog": "fog",
  "hail": "hail",
  "lightning": "lightning",
  "lightning-rainy": "lightning-rainy",
  "partlycloudy": "partlycloudy",
  "pouring": "pouring",
  "rainy": "rainy",
  "snowy": "snowy",
  "snowy-rainy": "snowy",
  "windy": "windy",
  "windy-variant": "windy",
  "exceptional": "exceptional",
};

// Conditions that need day/night variants
const DAY_NIGHT_CONDITIONS = [
  "partlycloudy",
  "cloudy",
  "rainy",
  "snowy",
  "lightning",
];

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
      use_animated_icons: true,
      sun_entity: "sun.sun",
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
      use_animated_icons: true,
      sun_entity: "sun.sun",
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

  _isDaytime() {
    const sunEntity = this._getEntityState(this.config.sun_entity || "sun.sun");
    if (!sunEntity) {
      return true;
    }
    return sunEntity.state === "above_horizon";
  }

  _getWeatherCondition() {
    const entity = this._getEntityState(this.config.entity);
    if (!entity) return null;
    return entity.state;
  }

  _getAnimatedIcon() {
    const condition = this._getWeatherCondition();
    if (!condition) return null;

    const isDaytime = this._isDaytime();
    let iconKey = CONDITION_MAP[condition] || "exceptional";

    if (condition === "sunny") {
      return WEATHER_ICONS["clear-day"];
    }

    if (condition === "clear-night") {
      return WEATHER_ICONS["clear-night"];
    }

    if (DAY_NIGHT_CONDITIONS.includes(iconKey)) {
      const suffix = isDaytime ? "-day" : "-night";
      const variantKey = iconKey + suffix;
      if (WEATHER_ICONS[variantKey]) {
        return WEATHER_ICONS[variantKey];
      }
    }

    return WEATHER_ICONS[iconKey] || WEATHER_ICONS["exceptional"];
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

  _renderIcon() {
    const useAnimated = this.config.use_animated_icons !== false;

    if (useAnimated) {
      const svgContent = this._getAnimatedIcon();
      if (svgContent) {
        return html`
          <div
            class="animated-icon"
            style="width: ${this.config.icon_width}px; height: ${this.config.icon_height}px;"
          ></div>
        `;
      }
    }

    const iconUrl = this._getIconUrl();
    if (iconUrl) {
      return html`<img
        src="${iconUrl}"
        width="${this.config.icon_width}"
        height="${this.config.icon_height}"
        alt="Weather icon"
      />`;
    }

    return html`<ha-icon icon="mdi:weather-cloudy" class="fallback-icon"></ha-icon>`;
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
              ${this._renderIcon()}
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

  updated(changedProperties) {
    super.updated(changedProperties);

    const animatedIcon = this.shadowRoot?.querySelector('.animated-icon');
    if (animatedIcon && this.config.use_animated_icons !== false) {
      const svgContent = this._getAnimatedIcon();
      if (svgContent && animatedIcon.innerHTML !== svgContent) {
        animatedIcon.innerHTML = svgContent;
      }
    }
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
      .animated-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .animated-icon svg {
        width: 100%;
        height: 100%;
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
          <ha-formfield label="Use Animated Weather Icons">
            <ha-switch
              .checked=${this._config.use_animated_icons !== false}
              .configKey=${"use_animated_icons"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.sun_entity || "sun.sun"}
            .configKey=${"sun_entity"}
            @value-changed=${this._entityChanged}
            allow-custom-entity
            label="Sun Entity (for day/night detection)"
            .includeDomains=${["sun"]}
          ></ha-entity-picker>
          <ha-textfield
            label="Icon Attribute (fallback: entity_picture, state, or custom)"
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
