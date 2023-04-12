// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { ipcMain } from "../electron-wrapper";

import { PaneControlState, WispaRequest, Contact } from "../../src/shared/types";
import { ipcChannels } from "../../src/shared/constants";
import { send } from "../ipc-wispa/wispa-client";
import * as paneControl from "../pane-control";

import log from "../main-logging";
import { WindowTypes } from "../types";
import { windows, getIdentifiersAndMetadata } from "./window-messaging";
import { BrowserWindow, NativeImage } from "electron";

/**
 * Start the window listeners - load all the listeners
 */
export function start(): void {
  log.info("window-listeners active");

  ipcMain.on(ipcChannels.wispaRequest, (_event, wispaRequest: WispaRequest) => {
    send(wispaRequest);
  });

  // State updates to be sent to Pane Control
  ipcMain.on(
    ipcChannels.paneControlStateUpdate,
    (_event: Electron.IpcMainEvent, data: Partial<PaneControlState>) => {
      log.ipc(`Received ${ipcChannels.paneControlStateUpdate} from renderer process`);
      paneControl.setState(data);
    }
  );

  // Resize the window with given identifiers
  ipcMain.on(
    ipcChannels.resizeWindow,
    (
      _event: Electron.IpcMainEvent,
      data: { identifiers: { type: WindowTypes; uid?: string }; width: number; height: number }
    ) => {
      log.ipc(`Received ${ipcChannels.resizeWindow} from renderer process`);
      paneControl.resizeWindow(data.identifiers, data.width, data.height);
    }
  );

  // Show the window with given the identifiers
  ipcMain.on(
    ipcChannels.showWindow,
    (_event: Electron.IpcMainEvent, data: { identifiers: { type: WindowTypes; uid?: string } }) => {
      log.ipc(`Received ${ipcChannels.showWindow} from renderer process`);
      paneControl.showWindow(data);
    }
  );

  // Send a redux action back to the main window
  ipcMain.on(
    ipcChannels.sendReduxActionToMainWindow,
    (
      _event: Electron.IpcMainEvent,
      data: {
        type: string;
        payload: {
          selectedContact: Contact;
        };
      }
    ) => {
      log.ipc(`Received ${ipcChannels.sendReduxActionToMainWindow} from renderer process`);
      paneControl.sendReduxActionToMainWindow(data);
    }
  );

  // Set the overlay icon on Windows
  ipcMain.on(
    ipcChannels.setOverlayIcon,
    (
      _event: Electron.IpcMainEvent,
      data: { overlayPath: NativeImage | null; overlayDescription: string }
    ) => {
      log.ipc(`Received ${ipcChannels.setOverlayIcon} from renderer process`);
      windows.mainWindow.setOverlayIcon(data.overlayPath, data.overlayDescription);
    }
  );

  ipcMain.on(ipcChannels.identifiersAndMetadataRequest, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (window === null) {
      log.error(
        `Received message on ${ipcChannels.identifiersAndMetadataRequest} but could not determine sending window`
      );
      return;
    }

    event.returnValue = getIdentifiersAndMetadata(window);
  });
}
