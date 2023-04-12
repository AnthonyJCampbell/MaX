// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Exports actions that send messages to Node (ipcMain)
 */
import log from "src/renderer-logging";
import { WispaRequest } from "src/types";
import { ipcChannels } from "shared/constants";

const { ipcRenderer } = window.require("electron");

/**
 * Send a list message over IPC
 */
export const listHistoricCalls = (): void => {
  log.ipc("Request the historic call list");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { list: "historicCalls" };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Update an historicCall object with the call uid and attention flag and send over IPC
 * @param {String} uid - The UID of the historic call to update
 * @param {CallStatus} attention - The attend state to update the historic call to
 */
export const updateHistoricCall = (uid: string, attention: boolean): void => {
  log.ipc("Update the historic call");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { update: { historicCall: { uid, attention } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
