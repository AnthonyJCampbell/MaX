// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Methods for creating secondary windows
 */
import { windows } from "../ipc-renderer/window-messaging";
import { screen } from "../electron-wrapper";
import log from "../main-logging";
import { CallWindowIdentifiers, CallWindowMetadata } from "./types";
import { createWindow } from "./window-lifecycle";
import i18n from "i18next";

export const secondaryWindowSizes = {
  // inCall window height should match the height of ContentHeaderPanel
  inCall: { width: 460, height: 80 },
  incomingCall: { width: 300, height: 75 },
};

/**
 * Create an incoming call window
 * @param {WindowIdentifiers} identifiers
 * A set of options, including "type", which uniquely identify the window
 * @param {WindowMetadata?} metadata
 * Optional extra data to be assigned to the window
 *
 */
export function createIncomingCallWindow(
  identifiers: CallWindowIdentifiers,
  metadata: CallWindowMetadata
): void {
  // TODO - Can remove these checks when Pane Control is all TypeScript
  if (!identifiers.uid) {
    log.error(
      `Attempted to create incoming call window without a UID as an identifier. Identifiers provided: ${JSON.stringify(
        identifiers
      )}`
    );
    return;
  }

  if (!metadata.remoteParty) {
    log.error(
      `Attempted to create incoming call window without a remoteParty in the metadata. Metadata provided: ${JSON.stringify(
        metadata
      )}`
    );
    return;
  }

  const incomingCallWindowOptions = {
    width: secondaryWindowSizes.incomingCall.width,
    height: secondaryWindowSizes.incomingCall.height,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    show: false,
    title: i18n.t("incomingCallWindowTitle"),
    transparent: true,
    fullscreenable: false,
    maximizable: false,
    minimizable: false,
  };

  const incomingCallWindow = createWindow(identifiers, incomingCallWindowOptions, metadata);

  if (incomingCallWindow) {
    incomingCallWindow.webContents.on("did-finish-load", () => {
      incomingCallWindow.show();
    });
  }
}

/**
 * Create an in-call window
 * @param {WindowIdentifiers} identifiers
 * A set of options, including "type", which uniquely identify the window
 * @param {WindowMetadata?} metadata
 * Optional extra data to be assigned to the window
 */
export function createInCallWindow(
  identifiers: CallWindowIdentifiers,
  metadata: CallWindowMetadata
): void {
  // TODO - Can remove these checks when Pane Control is all TypeScript
  if (!identifiers.uid) {
    log.error(
      `Attempted to create incoming call window without a UID as an identifier. Identifiers provided: ${JSON.stringify(
        identifiers
      )}`
    );
    return;
  }

  const [mainX, mainY] = windows.mainWindow.getPosition();
  const { x, y, width } = screen.getDisplayNearestPoint({ x: mainX, y: mainY }).workArea;

  const inCallWindowOptions = {
    width: secondaryWindowSizes.inCall.width,
    height: secondaryWindowSizes.inCall.height,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    show: false,
    title: i18n.t("inCallWindowTitle"),
    transparent: true,
    fullscreenable: false,
    maximizable: false,
    minimizable: false,
    x: x + width - 480,
    y: y + 20,
  };

  createWindow(identifiers, inCallWindowOptions, metadata);

  // We do not show this window on "did-finish-load", as we only want to show the in-call
  // window when the call is not visible in the main window
}
