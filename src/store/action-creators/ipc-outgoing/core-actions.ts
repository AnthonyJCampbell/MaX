// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Actions that send IPC to Node regarding core things (app lifecyle, user account, etc)
 */

import log from "src/renderer-logging";
import { WispaRequest } from "src/types";
import { ipcChannels } from "shared/constants";
import { LoginState } from "shared/types";

const { ipcRenderer } = window.require("electron");

export const getAccount = (): void => {
  log.ipc("Send request to get the user account");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { get: { account: {} } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewAbout = (): void => {
  log.ipc('Send "View About" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { coreAction: { viewAbout: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewChangePassword = (): void => {
  log.ipc('Send "View change password" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { coreAction: { viewChangePassword: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewHelp = (): void => {
  log.ipc('Send "View help" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { coreAction: { viewHelp: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewCheckForUpdates = (): void => {
  log.ipc('Send "View check for updates" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { coreAction: { viewCheckForUpdates: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const logOut = (): void => {
  log.ipc('Send "logOut" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { update: { account: { loginState: LoginState.LOGGED_OUT } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
