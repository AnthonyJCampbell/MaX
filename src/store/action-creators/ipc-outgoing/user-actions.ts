// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Actions that send IPC to Node regarding user
 */
import log from "src/renderer-logging";
import { WispaRequest, UpdateableUser } from "src/types";
import { ipcChannels } from "shared/constants";

const { ipcRenderer } = window.require("electron");

export const getUser = (): void => {
  log.ipc("Send request to get User data");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { get: { user: true } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const updateUser = (updateableUser: UpdateableUser): void => {
  log.ipc("Send request to update User data");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { update: { updateableUser } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
