// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import store from "store/store";
import { selectActiveCallFromUid } from "store/selectors/active-calls";
import { selectOneContactWithPhoneNumber } from "store/selectors/contacts";
import {
  setSelectedContact,
  focusRightbarMessage,
  addBanner,
  removeBanner,
} from "action-creators/navigation/actions";
import { ConnectivityState, WindowTypes } from "shared/types";
import { ipcChannels } from "shared/constants";

import { ActiveCall, CallStatus, Contact, PresenceState } from "src/types";
import { BannerType } from "shared/types";
import log from "src/renderer-logging";

const { ipcRenderer } = window.require("electron");

const selectContactForCall = (call: ActiveCall): void => {
  if (call.remoteParty === "") {
    log.debug("Call has no remote party");
    // Probably a deleted call, don't update the window
    return;
  }

  const remotePartyContact = selectOneContactWithPhoneNumber(call.remoteParty)(store.getState());

  if (remotePartyContact) {
    log.debug("Focus the contact relating to the call");
    store.dispatch(setSelectedContact(remotePartyContact));
    store.dispatch(focusRightbarMessage());
  } else {
    log.debug("No contact found for call");
    // Build a temporary contact from the info we have
    const temporaryRemotePartyContact = Contact.fromPhoneNumber(call.remoteParty);
    store.dispatch(setSelectedContact(temporaryRemotePartyContact));
  }
};

/**
 * Focus and update the main window based on this current active call
 */
export const selectContactIfAnsweringCall = (call: ActiveCall): void => {
  if (call.status !== CallStatus.CURRENT) {
    log.debug("Not a current call");
    // Don't change the main window
    return;
  }

  const preExistingCall = selectActiveCallFromUid(call.uid)(store.getState());

  if (preExistingCall?.status === CallStatus.INCOMING) {
    selectContactForCall(call);
    ipcRenderer.send(ipcChannels.showWindow, { type: WindowTypes.main });
  } else {
    log.debug("This isn't a newly answered call");
    // Don't change the main window
  }
};

/**
 * Focus and update the main window based on this current active call
 */
export const selectContactIfNewOutgoingCall = (call: ActiveCall): void => {
  if (call.status === CallStatus.INCOMING) {
    log.debug("Call is incoming");
    // Don't change the main window
    return;
  }

  const preExistingCall = selectActiveCallFromUid(call.uid)(store.getState());
  if (preExistingCall) {
    log.debug("Call is not new");
    // Don't change the main window
    return;
  }

  selectContactForCall(call);
  ipcRenderer.send(ipcChannels.showWindow, { type: WindowTypes.main });
};

/**
 * Show or hide the DND banner based on the presence state received over WISPA
 * @param presence The user's presence received over wispa
 */
export const showOrHideDNDBanner = (presence: PresenceState): void => {
  if (presence === PresenceState.DO_NOT_DISTURB) {
    log.debug("Switched to DND");
    store.dispatch(addBanner(BannerType.DND));
  } else {
    log.debug("Not DND");
    store.dispatch(removeBanner(BannerType.DND));
  }
};

export const showOrHideJavaDown = (javaDown: boolean): void => {
  if (javaDown) {
    log.debug("Java is down");
    store.dispatch(addBanner(BannerType.JAVA_DOWN));
  } else {
    log.debug("Java is not down");
    store.dispatch(removeBanner(BannerType.JAVA_DOWN));
  }
};

let callsTimeout: ReturnType<typeof setTimeout>;
let callsBannerAlreadySetOrOnTimer = false;

let chatTimeout: ReturnType<typeof setTimeout>;
let chatBannerAlreadySetOrOnTimer = false;

let chatAndCallsTimeout: ReturnType<typeof setTimeout>;
let chatAndCallsBannerAlreadySetOrOnTimer = false;

/**
 * Show or hide Connectivity banners based on the connection state received over WISPA
 * @param presence The user's presence received over wispa
 */
export const showOrHideConnectivityBanner = (connectivityState: ConnectivityState): void => {
  // Handling calls connectivity
  if (connectivityState.callsDisconnected === true) {
    if (!callsBannerAlreadySetOrOnTimer) {
      callsBannerAlreadySetOrOnTimer = true;
      callsTimeout = setTimeout(function () {
        log.error("Calls are true, setting call banner");
        store.dispatch(addBanner(BannerType.NO_CALLS));
      }, 30000);
    }
  } else {
    log.error("Calls are false, removing call banner");
    if (callsBannerAlreadySetOrOnTimer) {
      clearTimeout(callsTimeout);
      callsBannerAlreadySetOrOnTimer = false;
    }
    store.dispatch(removeBanner(BannerType.NO_CALLS));
  }

  // Handling chat connectivity
  if (connectivityState.chatDisconnected === true) {
    if (!chatBannerAlreadySetOrOnTimer) {
      chatBannerAlreadySetOrOnTimer = true;
      chatTimeout = setTimeout(function () {
        log.error("Chat are true, setting chat banner");
        store.dispatch(addBanner(BannerType.NO_CHAT));
      }, 30000);
    }
  } else {
    log.error("Chat are false, removing chat banner");
    if (chatBannerAlreadySetOrOnTimer) {
      clearTimeout(chatTimeout);
      chatBannerAlreadySetOrOnTimer = false;
    }
    store.dispatch(removeBanner(BannerType.NO_CHAT));
  }

  // Handling chat and calls connectivity
  if (connectivityState.chatDisconnected === true && connectivityState.callsDisconnected === true) {
    if (!chatAndCallsBannerAlreadySetOrOnTimer) {
      chatAndCallsBannerAlreadySetOrOnTimer = true;
      chatAndCallsTimeout = setTimeout(function () {
        log.error("Calls and chats are true, setting call and chat banner");
        store.dispatch(addBanner(BannerType.NO_CHAT_OR_CALLS));
        chatAndCallsBannerAlreadySetOrOnTimer = false;
      }, 30000);
    }
  } else {
    log.error("Calls and chats are false, removing call and chat banner");
    clearTimeout(chatAndCallsTimeout);
    if (chatAndCallsBannerAlreadySetOrOnTimer) {
      clearTimeout(chatAndCallsTimeout);
      chatAndCallsBannerAlreadySetOrOnTimer = false;
    }
    store.dispatch(removeBanner(BannerType.NO_CHAT_OR_CALLS));
  }
};
