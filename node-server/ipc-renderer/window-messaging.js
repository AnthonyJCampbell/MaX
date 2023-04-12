// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Module that provides access to, and utility functions for, BrowserWindows
 */
"use strict";
const { BrowserWindow } = require("../electron-wrapper");
const log = require("../main-logging");
const { ipcChannels } = require("../../src/shared/constants");

/**
 * Get and set all the windows
 */
const windows = {
  get all() {
    return BrowserWindow.getAllWindows();
  },

  get mainWindow() {
    const found = this.all.filter((w) => w.tag === "main");
    return found.length === 0 ? null : found[0];
  },

  /**
   * Tag the main window
   * @param {Electron.BrowserWindow} browserWindow
   */
  set mainWindow(browserWindow) {
    log.debug(`Set main window to BrowserWindow with id: ${browserWindow.id}`);
    browserWindow.tag = "main";
  },

  /**
   * Get all the secondary windows
   */
  get secondaryWindows() {
    return this.all.filter((w) => w.tag === "secondary");
  },

  /**
   * Tag a secondary window
   * @param {Electron.BrowserWindow} browserWindow
   */
  set secondaryWindow(browserWindow) {
    log.debug(`Set BrowserWindow with id: ${browserWindow.id} as a secondary window`);
    browserWindow.tag = "secondary";
  },

  /**
   * Return all BrowserWindows whose identifiers contains all the key/value pairs provided in the
   * `identifiers` parameter.
   *
   * See [Pane Control](node-server/pane-control/types.ts) for WindowIdentifiers definition
   * @param {WindowIdentifiers} identifiers
   */
  withIdentifiers(identifiers) {
    return this.all.filter((window) =>
      // We have explicitly controlled the identifiers set, so object injection is not
      // a risk here.
      // eslint-disable-next-line security/detect-object-injection
      Object.entries(identifiers).every(([key, value]) => window.identifiers[key] === value)
    );
  },
};

/**
 * Send a Node-React Wispa Message
 * @param {List[BrowserWindow]} recipientWindows - List of BrowserWindows to send the message to
 * @param {WispaMessage} message
 */
function send(recipientWindows, message, channel) {
  recipientWindows.forEach((window) => {
    log.ipc(`Sending message to window ${window.identifiers?.type} on ${channel} channel`);
    log.ipc(message);
    window.webContents.send(channel, message);
  });
}

function sendWispaMessage(recipientWindows, message) {
  send(recipientWindows, message, ipcChannels.wispaMessage);
}

function sendReduxAction(recipientWindows, action) {
  send(recipientWindows, action, ipcChannels.mainWindowAction);
}

function getIdentifiersAndMetadata(window) {
  return {
    identifiers: window.identifiers,
    metadata: window.metadata,
  };
}

module.exports = {
  windows,
  send,
  sendWispaMessage,
  sendReduxAction,
  getIdentifiersAndMetadata,
};
