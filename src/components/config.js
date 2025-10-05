// src/config.js

// Global grid + app-wide settings
export const GRID_CONFIG = {
  enabled: true,   // default: snapping ON
  size: 25,        // grid step in px
  snap: 25,        // snap threshold in px
};

export const NOTE_CONFIG = {
  width: 200,     // numeric, in pixels
  height: 75,     // numeric, in pixels
  padding: 10,
  textColor: "#18181A",
  fontSize: 15,
};

// You can also centralize other settings here later if needed
export const APP_CONFIG = {
  zoom: {
    min: 0.5,
    max: 2,
    step: 0.1,
  },
  pan: {
    inertia: true,
  },
};
