// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Actions that send IPC to Node regarding settings
 */
import log from "src/renderer-logging";
import { WispaRequest } from "src/types";
import { ipcChannels } from "shared/constants";

const { ipcRenderer } = window.require("electron");

export const viewSettings = (): void => {
  log.ipc('Send "View General Settings" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewGeneralSettings: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const getAllSettings = (): void => {
  log.ipc("Send request to get Settings data");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { get: { settings: true } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewChangeAvatar = (): void => {
  log.ipc('Send "View change avatar" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewChangeAvatar: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const signIntoChat = (): void => {
  log.ipc('Send "Sign into chat" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewSignInToChat: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewCallParkOrbits = (): void => {
  log.ipc('Send "View call park orbits" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewCallParkOrbits: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewCommportalAccount = (): void => {
  log.ipc('Send "View Commportal account" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewCommportalAccount: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewCommportalApps = (): void => {
  log.ipc('Send "View Commportal apps" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewCommportalApps: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewCommportalGroup = (): void => {
  log.ipc('Send "View Commportal group" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewCommportalGroup: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewConferenceManager = (): void => {
  log.ipc('Send "View conference manager" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewConferenceManager: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewCallManager = (): void => {
  log.ipc('Send "View call manager" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { settingsAction: { viewCallManager: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
