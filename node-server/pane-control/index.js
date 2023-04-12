// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Module responsible for managing BrowserWindows
 */
const { windows, sendReduxAction } = require("../ipc-renderer/window-messaging");
const { resizeWindow, showWindow } = require("./window-lifecycle");
const { setState } = require("./call-window-manager");
const { createMainWindow } = require("./create-main-window");
const { secondaryWindowSizes } = require("./create-secondary-windows");

/**
 * Send a Redux Action to the main window
 *
 * This may be expanded in future to send to different types of window
 * @param {ReduxAction} action
 */
function sendReduxActionToMainWindow(action) {
  sendReduxAction([windows.mainWindow], action);
}

module.exports = {
  resizeWindow,
  showWindow,
  sendReduxActionToMainWindow,
  setState,
  createMainWindow,
  secondaryWindowSizes,
};
