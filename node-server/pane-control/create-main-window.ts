// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * This method lives in a file separate from the secondary windows to prevent an import-loop,
 * `recalculateCallWindows` calls the secondary windows creation functions and is imported here.
 */

import { dialog } from "electron";
import log from "../main-logging";

import { WindowTypes } from "../types";
import { createWindow } from "./window-lifecycle";
import { setState } from "./call-window-manager";
import { contextMenu } from "./context-menu";
import i18n from "i18next";
import { send, windows } from "../ipc-renderer/window-messaging";
import { ipcChannels } from "../../src/shared/constants";

/**
 * Set the main window focus state
 *
 * @param isMainWindowFocused - The state of main window focus
 */
const setMainWindowFocus = (isMainWindowFocused: boolean): void => {
  const payload = { focus: isMainWindowFocused };
  setState(payload);
  send(windows.all, payload, ipcChannels.sendMainWindowEvent);
};

/**
 * Create the main app window
 * Perform main-window-only set up, such as context menus
 *
 * @param {WindowIdentifiers} identifiers
 * A set of options, including "type", which uniquely identify the window
 * @param {WindowMetadata?} metadata
 * Optional extra data to be assigned to the window
 */
export function createMainWindow(): void {
  log.info("Creating main window");

  const identifiers = { type: WindowTypes.main };
  const metadata = undefined;

  const mainWindowOptions: Electron.BrowserWindowConstructorOptions = {
    width: 850,
    height: 570,
    minWidth: 850,
    minHeight: 570,
    title: i18n.t("mainWindowTitle"),

    // Make the main window background colour match the StartupScreen component. This makes the
    // startup process slicker.
    backgroundColor: "#2F78CA",
  };

  const mainWindow = createWindow(identifiers, mainWindowOptions, metadata);

  log.debug(mainWindow);
  if (mainWindow) {
    log.debug("Setting up Electron event listeners on main window");
    mainWindow.webContents.on("context-menu", (_, params) => openContextMenu(mainWindow, params));
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow.show();
    });
    mainWindow.on("blur", () => {
      log.debug("Main window blurred");
      // Recalculate call windows
      setMainWindowFocus(false);
    });
    mainWindow.on("focus", () => {
      log.debug("Main window focused");
      // Recalculate call windows
      setMainWindowFocus(true);
    });
    mainWindow.on("close", (event) => closeBrowserWindow(mainWindow, event));
  }
}

/**
 * Callback for opening the context menu in the browser window
 * @param mainWindow The browser window on which the callback to be invoked
 */
function openContextMenu(
  mainWindow: Electron.BrowserWindow,
  params: Electron.ContextMenuParams
): void {
  log.user_action("User opened the Context menu");
  const hasText = params.selectionText.trim().length > 0;
  const isEditable = params.isEditable;
  const hasLink = params.linkURL !== "";

  // Make context menu only when having text and link
  // Need update for other types of media
  if (hasText || isEditable || hasLink) {
    log.user_action("User copied text via the context menu");
    const menu = contextMenu(mainWindow, params);
    menu.popup();
  }
}

/**
 * Callback for closing the browser window
 * @param mainWindow  The browser window on which the callback to be invoked
 */
function closeBrowserWindow(mainWindow: Electron.BrowserWindow, event: Electron.Event): void {
  if (process.env.FVFramework) {
    // Bypass the confirm quit dialog for FVs, because the dialog will prevent the client
    // from being closed
    return;
  }

  log.user_action("User tries to close main window, ask if they want to quit");

  const response = dialog.showMessageBoxSync(mainWindow, {
    type: "question",
    buttons: [i18n.t("yes"), i18n.t("no")],
    title: i18n.t("quitDialogTitle"),
    message: i18n.t("quitDialogMessage"),
  });

  switch (response) {
    case 0:
      log.user_action("User selected 'Yes', close main window and quit");
      break;
    case 1:
      log.user_action("User selected 'No', don't close main window");
      event.preventDefault();
      break;
  }
}
