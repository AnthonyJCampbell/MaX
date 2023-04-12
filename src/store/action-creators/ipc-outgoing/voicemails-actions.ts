// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/** Actions that send IPC to Node regarding voicemails/faxes */
import log from "src/renderer-logging";
import { WispaRequest } from "src/types";
import { ipcChannels } from "shared/constants";

const { ipcRenderer } = window.require("electron");

export const getVoicemailFaxCount = (): void => {
  log.ipc("Send request to get the Voicemail/Fax count");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { get: { voicemailFaxCount: {} } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewVoicemails = (): void => {
  log.ipc('Send "View Voicemails" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { voicemailFaxAction: { viewMessages: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
