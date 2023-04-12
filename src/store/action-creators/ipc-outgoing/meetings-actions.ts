// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Actions that send IPC to Node regarding meetings
 */
import log from "src/renderer-logging";
import { WispaRequest, ChatAddress, CreateMeetingTabToShow } from "src/types";
import { ipcChannels } from "shared/constants";

const { ipcRenderer } = window.require("electron");

/**
 * Send a list message over IPC
 */
export const listMeetings = (): void => {
  log.ipc("Request the meetings list");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { list: "meetings" };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Create the meeting object and send over IPC
 * @param {[string]} remoteParty - IM address of the party to be invited to the meeting
 * @param {*} upliftCall - If this is an uplift request, the UID of the call being uplifted
 */
export const createMeeting = (remoteParty: ChatAddress[], upliftCall: string | undefined): void => {
  const upliftCallLog = upliftCall ? `uplifting call ${upliftCall}` : "";
  log.ipc(`Create meeting with ${JSON.stringify(remoteParty)}` + upliftCallLog);

  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { create: { meeting: { remoteParty, upliftCall } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Update the meeting object and send over IPC
 * @param {[string]} remoteParty - IM address of the party to be invited to the meeting
 * @param {*} upliftCall - If this is an uplift request, the UID of the call being uplifted
 */
export const updateMeeting = (remoteParty: ChatAddress[], upliftCall: string | undefined): void => {
  const upliftCallLog = upliftCall ? `uplifting call ${upliftCall}` : "";
  log.ipc(`Update meeting with ${JSON.stringify(remoteParty)}` + upliftCallLog);

  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { update: { meeting: { remoteParty, upliftCall } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const scheduleMeeting = (): void => {
  log.ipc('Send "Schedule A Meeting" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { meetingAction: { scheduleAMeeting: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewScheduledMeetings = (): void => {
  log.ipc('Send "View Scheduled Meetings" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { meetingAction: { viewScheduledMeetings: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const joinMeeting = (): void => {
  log.ipc('Send "Join Meeting" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { meetingAction: { joinAMeeting: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const viewRecordedMeetings = (): void => {
  log.ipc('Send "View Recorded Meetings" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { meetingAction: { viewRecordedMeetings: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const createMeetingWithOptions = (): void => {
  log.ipc('Send "Create Meeting With Options" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = {
    action: {
      meetingAction: {
        createMeetingWithOptions: { tabToShow: CreateMeetingTabToShow.invite_im_contacts },
      },
    },
  };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
