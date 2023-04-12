// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Re-export anything needed from the "electron" module
 *
 * Nowhere else in the codebase should call `require("electron")` directly. This module should
 * always be imported instead. Add any extra "electron" imports into here as needed
 */

const { BrowserWindow, app, ipcMain, Menu, shell, screen, clipboard } = require("electron");

module.exports = { BrowserWindow, app, ipcMain, Menu, shell, screen, clipboard };
