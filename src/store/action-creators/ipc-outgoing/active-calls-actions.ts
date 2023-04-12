// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Exports actions that send messages to Node (ipcMain)
 */
import log from "src/renderer-logging";
import { WispaRequest, ActiveCall, CallStatus } from "src/types";
import { ipcChannels } from "shared/constants";

const { ipcRenderer } = window.require("electron");
import { removeNumberFormatting } from "components/utils/common";

/**
 * Send a list message over IPC
 */
export const listActiveCalls = (): void => {
  log.ipc("Request the active call list");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { list: "activeCalls" };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Create an activeCall object with the remote party and send over IPC
 * @param {String} remoteParty - The address of the remote party to create a call with
 */
export const createActiveCall = (remoteParty: string): void => {
  const numberToDial = removeNumberFormatting(remoteParty);
  log.info(`"${remoteParty}" is a valid number, so create a new call to ${numberToDial}`);

  log.ipc("Create the active call");
  if (!numberToDial) {
    log.error(`Attempted to create a call but no phone number is supplied`);
    return;
  }
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { create: { activeCall: { remoteParty: numberToDial } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Update an activeCall object with the call uid and status and send over IPC
 * @param {String} uid - The UID of the active call to update
 * @param {CallStatus} status - The status to update the active call to
 */
export const updateActiveCall = (uid: string, status: CallStatus): void => {
  log.ipc("Update the active call");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { update: { activeCall: { uid, status } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Set whether or not an ActiveCall's microphone is muted
 */
export const updateCallMicrophoneMute = (call: ActiveCall, mute: boolean): void => {
  log.ipc(`Set microphone mute to "${mute}" on call with ${call.remoteParty}`);
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = {
    update: { activeCall: { uid: call.uid, microphoneIsMuted: mute } },
  };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Create an activeCall object with the call uid and send over IPC
 * @param {String} uid - The UID of the active call to delete
 */
export const deleteActiveCall = (uid: string): void => {
  log.ipc("Delete the active call");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { delete: { activeCall: uid } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
