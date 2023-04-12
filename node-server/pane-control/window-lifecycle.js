// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Methods to manipulate BrowserWindow's lifecycles
 */

"use strict";
const { BrowserWindow, shell } = require("../electron-wrapper");
const { windows } = require("../ipc-renderer/window-messaging");
const log = require("../main-logging");
const { initMacMenu } = require("./mac-app-menu");
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
const { WindowTypes } = require("../types");

/**
 * Create a BrowserWindow with some metadata and options
 * @param {WindowIdentifiers} identifiers
 * A set of options, including "type", which uniquely identify the window
 * @param {import("electron").BrowserWindowConstructorOptions} browserWindowOptions
 * @param {WindowMetadata?} metadata
 * Optional extra data to be assigned to the window
 */
function createWindow(identifiers, browserWindowOptions, metadata) {
  const preExistingWindows = windows.withIdentifiers(identifiers);
  if (preExistingWindows.length) {
    log.debug(
      `Skipped creating window with identifiers ${JSON.stringify(
        identifiers
      )} and metadata ${JSON.stringify(metadata)} because such a window already exists`
    );
    return;
  }

  log.info(
    `Creating new window with identifiers ${JSON.stringify(
      identifiers
    )} and metadata ${JSON.stringify(metadata)}`
  );

  const defaultWindowOptions = {
    icon: "src/maxuc.png",
    webPreferences: {
      // These three commented-out properties are the advised way in which we should deal with
      // the warnings raised by CONTEXT_ISOLATION_JS_CHECK, SANDBOX_JS_CHECK, REMOTE_MODULE_JS_CHECK
      // All of them break the application, they will be fixed under DUIR-1569
      //contextIsolation: true,
      //enableRemoteModule: false,
      //sandbox: true,

      // Context Isolation runs the preload scripts and Electron's internal logic separate contexts to the website we load in a webContents.
      // This prevents the website from accessing Electron internals
      // This should be set to true, but current limitations with our implementation means that its temporarily set to false
      contextIsolation: false,
      // Allows webcontent to access the remote module
      // Should be set to false for security reasons, but is temporarily set to true.
      enableRemoteModule: true,
      nodeIntegration: true,

      spellcheck: true,

      // Security: AUXCLICK_JS_CHECK raises a warning to disable AUXCLICK to limit
      // the ability of potential attackers to initiate new navigation flows
      disableBlinkFeatures: "Auxclick",

      // Only enable devTools if it's a dev build (i.e. "npm start")
      // TODO BRANDING: We can re-enable this for a dev bundled installer once we have a separate
      // dev branding for the electron side of the app.
      devTools: isDev,
    },
  };

  const windowOptions = {
    ...defaultWindowOptions,
    ...browserWindowOptions,
  };

  let newWindow = new BrowserWindow(windowOptions);

  // Mac doesn't have a menu bar to hide
  if (process.platform !== "darwin") {
    // Hide menubar instead of removing it so that shortcuts (e.g. ctrl+r to refresh) still work
    newWindow.setMenuBarVisibility(false);
  }

  // Security: AUXCLICK_JS_CHECK
  // Prevent anything trying to navigate the secondary window anywhere when running on production
  // mode. This needs to be enabled on dev for hot reload to work.
  newWindow.webContents.on("will-navigate", (event) => {
    if (!isDev) event.preventDefault();
  });

  newWindow.on("closed", () => {
    log.info(`Closing ${identifiers.type} window`);
    newWindow = null;
  });

  // Use a port environment variable if available, defaulting to 3000
  let port = process.env.REACT_PORT || "3000";
  newWindow.loadURL(
    isDev ? "http://localhost:" + port : `file://${path.join(__dirname, "../index.html")}`
  );

  if (process.platform === "darwin") {
    initMacMenu();
  }

  newWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);

    // Don't want to also open the link in an Electron window
    return { action: "deny" };
  });

  // If the app is being run by the FV framework the dev tools count as "windows" from Spectron's
  // point of view. This leads to plenty of confusing behaviour within the tests, so don't load them
  // if we're in the FV framework
  if (isDev && !process.env.FVFramework) {
    enableDevTools(newWindow);
  }

  newWindow.identifiers = identifiers;
  newWindow.metadata = metadata;

  if (identifiers.type === WindowTypes.main) {
    windows.mainWindow = newWindow;
  } else {
    windows.secondaryWindow = newWindow;
  }

  return newWindow;
}

function enableDevTools(window) {
  if (!fs.existsSync("./node-server/config/local-variables.js")) {
    log.debug("No local configuration for dev tools");
    return;
  }

  log.debug("Loading dev tools");
  const config = require("../config/dev-tools");
  const session = window.webContents.session;

  // These extensions have have benign log errors and may fail to work if opened shortly after app
  // start in Electron 9+.
  //   https://github.com/electron/electron/issues/23662
  if (config.reactDevTools && !session.getAllExtensions()["React Developer Tools"]) {
    log.debug("Enabling React developer tools");
    session.loadExtension(config.reactDevTools);
  }
  if (config.reduxDevTools && !session.getAllExtensions()["Redux DevTools"]) {
    log.debug("Enabling Redux developer tools");
    session.loadExtension(config.reduxDevTools);
  }
}

function showWindow(identifiers, focus = true) {
  windows.withIdentifiers(identifiers).forEach((window) => {
    if (focus) {
      window.setAlwaysOnTop(true);
      window.show();
      window.setAlwaysOnTop(false);
    } else {
      window.showInactive();
    }
  });
}

/**
 * Resize all windows matching `identifiers`
 *
 * The provided width and height will set the width and height of the window
 * @param {WindowIdentifiers} identifiers
 * A set of options, including "type", which uniquely identify the window
 * @param {number?} width
 * @param {number?} height
 */
function resizeWindow(identifiers, width, height) {
  windows.withIdentifiers(identifiers).forEach((window) => {
    const [currentWidth, currentHeight] = window.getSize();
    window.setSize(width ?? currentWidth, height ?? currentHeight);
  });
}

module.exports = {
  createWindow,
  resizeWindow,
  showWindow,
};
