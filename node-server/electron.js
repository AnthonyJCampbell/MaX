// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Provides the entry point for Electron
 */

"use strict";
const guardian = require("./guardian/guardian");
const isDev = require("electron-is-dev");

// Enables hot-reloading for both app and window processes
if (isDev) {
  // Set the filename of the module to set up the reloader
  require("electron-reloader")({
    ...module,
    filename: `${__dirname}/node-server.js`,
  });
}

guardian.launch();
