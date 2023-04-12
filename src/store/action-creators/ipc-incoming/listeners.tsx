// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Contains listeners for incoming IPC messages from Node, and dispatch the data
 * in the messages to actions.
 */

import React from "react";
import store from "store/store";

import log from "src/renderer-logging";
import { ActionTypes } from "shared/types";
import {
  ActiveCall,
  HistoricCall,
  Contact,
  Chat,
  Meeting,
  Settings,
  User,
  VoicemailFaxCount,
  ContactsMotion,
  // eslint-disable-next-line no-unused-vars
  WispaMessage,
  // eslint-disable-next-line no-unused-vars
  WispaMessageType,
  MainWindowEventPayload,
} from "src/types";
import { ipcChannels } from "shared/constants";
import {
  selectContactIfAnsweringCall,
  selectContactIfNewOutgoingCall,
  showOrHideDNDBanner,
  showOrHideConnectivityBanner,
} from "./window-actions";
import { temporarilyDisableCallButton } from "./interaction-actions";
import { changeSelectedContact } from "./motion-actions";
import { newChatMessageNotification, newVoicemailNotification } from "./notification-actions";
import { setAppIcon } from "components/utils/app-icon";

const { ipcRenderer } = window.require("electron");
const IPCListener = (): React.ReactElement => <></>;

export default IPCListener;

const handleMainWindowFocusChange = (isMainWindowFocused: boolean): void => {
  log.debug(`Setting Main Window Focus to: ${isMainWindowFocused}`);
  store.dispatch({
    type: ActionTypes.SET_IS_MAIN_WINDOW_FOCUSED,
    payload: {
      isMainWindowFocused,
    },
  });
};

ipcRenderer.on(ipcChannels.sendMainWindowEvent, (_event: never, data: MainWindowEventPayload) => {
  log.ipc("Received IPC message with a main window event");

  if (data.focus !== undefined) {
    handleMainWindowFocusChange(data.focus);
  }
});

// Redux dispatch() takes "any" type for its input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ipcRenderer.on(ipcChannels.mainWindowAction, (_event: never, action: any) => {
  log.ipc(`Received IPC message to dispatch an action to the main window`);
  store.dispatch(action);
});

ipcRenderer.on(ipcChannels.wispaMessage, (_event: never, wispaMessage: WispaMessage) => {
  log.ipc(`Received wispa message`);
  log.ipc(JSON.stringify(wispaMessage));

  const messageWithClasses = hydrateIntoClasses(wispaMessage);

  const shouldSendToRedux = triggerSideEffects(messageWithClasses);
  if (shouldSendToRedux) {
    sendToRedux(messageWithClasses);
  }
});

/**
 * Convert all objects on the WispaMessage into Class instances
 */
function hydrateIntoClasses(wispaMessage: WispaMessage): WispaMessage {
  // data
  if (wispaMessage.data.activeCall) {
    wispaMessage.data.activeCall = ActiveCall.fromObject(wispaMessage.data.activeCall);
  }
  if (wispaMessage.data.historicCall) {
    wispaMessage.data.historicCall = HistoricCall.fromObject(wispaMessage.data.historicCall);
  }
  if (wispaMessage.data.contact) {
    wispaMessage.data.contact = Contact.fromObject(wispaMessage.data.contact);
  }
  if (wispaMessage.data.chat) {
    wispaMessage.data.chat = Chat.fromObject(wispaMessage.data.chat);
  }
  if (wispaMessage.data.meeting) {
    wispaMessage.data.meeting = Meeting.fromObject(wispaMessage.data.meeting);
  }
  if (wispaMessage.data.settings) {
    wispaMessage.data.settings = Settings.fromObject(wispaMessage.data.settings);
  }
  if (wispaMessage.data.voicemailFaxCount) {
    wispaMessage.data.voicemailFaxCount = VoicemailFaxCount.fromObject(
      wispaMessage.data.voicemailFaxCount
    );
  }
  if (wispaMessage.data.user) {
    wispaMessage.data.user = User.fromObject(wispaMessage.data.user);
  }

  // datalist
  if (wispaMessage.dataList.activeCalls) {
    const activeCallClasses = wispaMessage.dataList.activeCalls.map((activeCall) =>
      ActiveCall.fromObject(activeCall)
    );
    wispaMessage.dataList.activeCalls = activeCallClasses;
  }
  if (wispaMessage.dataList.historicCalls) {
    const historicCallClasses = wispaMessage.dataList.historicCalls.map((historicCall) =>
      HistoricCall.fromObject(historicCall)
    );
    wispaMessage.dataList.historicCalls = historicCallClasses;
  }
  if (wispaMessage.dataList.contacts) {
    const contactClasses = wispaMessage.dataList.contacts.map((contact) =>
      Contact.fromObject(contact)
    );
    wispaMessage.dataList.contacts = contactClasses;
  }
  if (wispaMessage.dataList.chats) {
    const chatClasses = wispaMessage.dataList.chats.map((chat) => Chat.fromObject(chat));
    wispaMessage.dataList.chats = chatClasses;
  }
  if (wispaMessage.dataList.meetings) {
    const meetingClasses = wispaMessage.dataList.meetings.map((meeting) =>
      Meeting.fromObject(meeting)
    );
    wispaMessage.dataList.meetings = meetingClasses;
  }

  // deleted
  if (wispaMessage.deleted.historicCall) {
    wispaMessage.deleted.historicCall = HistoricCall.fromObject(wispaMessage.deleted.historicCall);
  }
  if (wispaMessage.deleted.activeCall) {
    wispaMessage.deleted.activeCall = ActiveCall.fromObject(wispaMessage.deleted.activeCall);
  }
  if (wispaMessage.deleted.contact) {
    wispaMessage.deleted.contact = Contact.fromObject(wispaMessage.deleted.contact);
  }
  if (wispaMessage.deleted.chat) {
    wispaMessage.deleted.chat = Chat.fromObject(wispaMessage.deleted.chat);
  }
  if (wispaMessage.deleted.meeting) {
    wispaMessage.deleted.meeting = Meeting.fromObject(wispaMessage.deleted.meeting);
  }

  // motion
  if (wispaMessage.motion.contact) {
    wispaMessage.motion.contact = ContactsMotion.fromObject(wispaMessage.motion.contact);
  }

  return wispaMessage;
}

/**
 * Trigger effects other than sending the data to Redux, e.g notifications.
 *
 * Returns whether or not the message should be sent on to Redux. Ideally that functionality would
 * be separated out but it's mixed in with the notification logic at the moment - perhaps this can
 * be improved in future.
 */
function triggerSideEffects(wispaMessage: WispaMessage): boolean {
  log.debug("Triggering side effects");

  if (wispaMessage.data.activeCall) {
    selectContactIfAnsweringCall(wispaMessage.data.activeCall);
    selectContactIfNewOutgoingCall(wispaMessage.data.activeCall);
  }
  if (wispaMessage.data.chat) {
    const shouldSendToRedux = newChatMessageNotification(wispaMessage.data.chat);
    return shouldSendToRedux;
  }
  if (wispaMessage.data.voicemailFaxCount) {
    newVoicemailNotification(wispaMessage.data.voicemailFaxCount);
  }
  if (wispaMessage.deleted.activeCall) {
    temporarilyDisableCallButton(wispaMessage.deleted.activeCall);
  }
  if (wispaMessage.motion.contact?.displayContact) {
    changeSelectedContact(wispaMessage.motion.contact?.displayContact);
  }
  if (wispaMessage.data.user?.presence) {
    setAppIcon(wispaMessage.data.user.presence.state);
  }
  if (wispaMessage.data.user?.presence.state !== undefined) {
    showOrHideDNDBanner(wispaMessage.data.user?.presence.state);
  }
  if (wispaMessage.data.account?.connectivityState !== undefined) {
    showOrHideConnectivityBanner(wispaMessage.data.account.connectivityState);
  }
  return true;
}

function sendToRedux(wispaMessage: WispaMessage): void {
  if (wispaMessage.data.account) {
    dispatchAction(wispaMessage.data.account, ActionTypes.DATA_ACCOUNT, "account");
  }
  if (wispaMessage.data.contact) {
    dispatchAction(wispaMessage.data.contact, ActionTypes.DATA_CONTACT, "contact");
  }
  if (wispaMessage.data.activeCall) {
    dispatchAction(wispaMessage.data.activeCall, ActionTypes.DATA_ACTIVE_CALL, "activeCall");
  }
  if (wispaMessage.data.historicCall) {
    dispatchAction(wispaMessage.data.historicCall, ActionTypes.DATA_HISTORIC_CALL, "historicCall");
  }
  if (wispaMessage.data.chat) {
    dispatchAction(wispaMessage.data.chat, ActionTypes.DATA_CHAT, "chat");
  }
  if (wispaMessage.data.meeting) {
    dispatchAction(wispaMessage.data.meeting, ActionTypes.DATA_MEETING, "meeting");
  }
  if (wispaMessage.data.settings) {
    dispatchAction(wispaMessage.data.settings, ActionTypes.DATA_SETTINGS, "settings");
  }
  if (wispaMessage.data.user) {
    dispatchAction(wispaMessage.data.user, ActionTypes.DATA_USER, "user");
  }
  if (wispaMessage.data.voicemailFaxCount) {
    dispatchAction(
      wispaMessage.data.voicemailFaxCount,
      ActionTypes.DATA_VOICEMAIL_COUNT,
      "voicemailFaxCount"
    );
  }
  if (wispaMessage.dataList.contacts) {
    dispatchAction(wispaMessage.dataList.contacts, ActionTypes.DATA_CONTACT_LIST, "contacts");
  }
  if (wispaMessage.dataList.activeCalls) {
    dispatchAction(
      wispaMessage.dataList.activeCalls,
      ActionTypes.DATA_ACTIVE_CALL_LIST,
      "activeCalls"
    );
  }
  if (wispaMessage.dataList.historicCalls) {
    dispatchAction(
      wispaMessage.dataList.historicCalls,
      ActionTypes.DATA_HISTORIC_CALL_LIST,
      "historicCalls"
    );
  }
  if (wispaMessage.dataList.chats) {
    dispatchAction(wispaMessage.dataList.chats, ActionTypes.DATA_CHAT_LIST, "chats");
  }
  if (wispaMessage.dataList.meetings) {
    dispatchAction(wispaMessage.dataList.meetings, ActionTypes.DATA_MEETING_LIST, "meetings");
  }
  if (wispaMessage.deleted.contact) {
    dispatchAction(wispaMessage.deleted.contact, ActionTypes.DELETED_CONTACT, "contact");
  }
  if (wispaMessage.deleted.activeCall) {
    dispatchAction(wispaMessage.deleted.activeCall, ActionTypes.DELETED_ACTIVE_CALL, "activeCall");
  }
  if (wispaMessage.deleted.historicCall) {
    dispatchAction(
      wispaMessage.deleted.historicCall,
      ActionTypes.DELETED_HISTORIC_CALL,
      "historicCall"
    );
  }
  if (wispaMessage.deleted.meeting) {
    dispatchAction(wispaMessage.deleted.meeting, ActionTypes.DELETED_MEETING, "meeting");
  }
}

/**
 * Dispatch an action of given type and payload.
 *
 * @param {activeCall} data - The current data received from Node, containing the data from
 * the WISPA message, and the namespace the message was recieved in.
 * @param {ActionTypes.Key} actionType - The type of action, to be passed in using the
 * ActionType utility.
 * @param {String} payloadKey - The payload key from the key-value pair sent in the action payload.
 */
const dispatchAction = (
  data: WispaMessageType,
  actionType: ActionTypes,
  payloadKey: string
): void => {
  store.dispatch({
    type: actionType,
    payload: {
      [payloadKey]: data,
    },
  });
};
