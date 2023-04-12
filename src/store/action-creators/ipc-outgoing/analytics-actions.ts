// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Actions that send IPC to Node regarding analytics
 */

import log from "src/renderer-logging";
import { WispaRequest } from "src/types";
import { ipcChannels } from "shared/constants";

import { AnalyticsAdditionalData } from "src/shared/types";
const { ipcRenderer } = window.require("electron");

export const sendAnalytic = (
  eventType: string,
  additionalData?: AnalyticsAdditionalData[]
): void => {
  log.ipc("Raising analytic for " + eventType + " with additional data " + additionalData);
  const wispaRequest = new WispaRequest();
  if (additionalData !== undefined) {
    log.error("Adding additional data to analytics messages has not yet been implemented");
    return;
  }
  wispaRequest.payload = { action: { analytic: { eventType } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
