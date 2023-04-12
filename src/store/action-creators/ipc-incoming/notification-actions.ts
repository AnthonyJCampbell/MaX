// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { doesContactMatchChat, fullname } from "components/utils/common";
import store from "store/store";
import DefaultProfilePicture from "assets/shared/default-profile-picture.png";
import { setSelectedContact, focusRightbarMessage } from "action-creators/navigation/actions";
import { WindowTypes } from "src/shared/types";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import i18n from "i18next";

// TypeScript doesn't understand importing an ico, so disable checking for this line
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AppIcon from "assets/shared/icon.ico";
import { viewVoicemails } from "action-creators/ipc-outgoing/voicemails-actions";

import { Chat, Contact } from "src/types";
import { ipcChannels } from "shared/constants";

import log from "src/renderer-logging";

// TypeScript doesn't understand importing an mp3, so disable checking for this line
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import SubtleIM from "assets/shared/subtle-im.mp3";
import { VoicemailFaxCount } from "protobuf-wispa/dist/voicemails";

// We never want to show an OS notification for the 1st voicemail data sent over WISPA as
// app startup implies there is new data available - no notification is needed.
let alreadyHadSomeVoicemailData = false;

/**
 * Create a notification when receiving a new message containing the sender and the message content.
 *
 * Returns whether or not the chat data should be sent on to Redux.
 * @param {Message} chat - The message data passed in from IPC
 */
export const newChatMessageNotification = (chat: Chat): boolean => {
  const { ipcRenderer } = window.require("electron");

  const { contactReducer, windowReducer, paneManagementReducer, settingsReducer } =
    store.getState();
  const isMainWindow = windowReducer.type === WindowTypes.main;
  const isFocused = paneManagementReducer.isMainWindowFocused;

  if (!isMainWindow) {
    // Only want to notify once, and the main window will always be there
    return true;
  }
  // Check if the incoming message is new and if the new message was sent by the user. If so, return
  if (!chat?.isNew || !chat.message[0].author?.value) {
    return true;
  }

  const contacts = contactReducer.contacts.filter((c: Contact) =>
    doesContactMatchChat(c, chat.uid)
  );
  const easRegion = settingsReducer.settings.general.easRegion;

  // If no contact is found, then an SMS was sent from a non-contact.
  let contact: Contact;
  if (contacts.length === 0) {
    contact = Contact.fromPhoneNumber(chat.uid);
  } else {
    contact = contacts[0];
  }

  // Truncate the message to 120 characters or less for readability
  const body =
    chat.message[0].content.length > 120
      ? `${chat.message[0].content.substring(0, 120)}…`
      : chat.message[0].content;

  if (!isFocused) {
    log.debug("Triggering new chat message notification");
    // Note this uses the JavaScript Notification API instead of the Electron Notification API. This
    // is just for ease, there's no reason this couldn't switch to the Electron one in future
    // TODO DUIR-3351: This logic shouldn't depend on a translated string
    const newMessageNotification = new Notification(
      fullname(contact) === i18n.t("noName") && contact.phone[0]
        ? formatPhoneNumber(contact.phone[0].value, easRegion)
        : fullname(contact),
      {
        body,
        icon: DefaultProfilePicture,
      }
    );

    newMessageNotification.onclick = (): void => {
      log.userAction(
        `Clicked chat message notification. Displaying chat with ${contact.identity?.firstName} ${contact.identity?.lastName}`
      );
      ipcRenderer.send(ipcChannels.showWindow, { type: WindowTypes.main });

      store.dispatch(setSelectedContact(contact));
      store.dispatch(focusRightbarMessage());
    };
  } else {
    // Play subtle IM noise if the app is in focus
    log.debug("Triggering new chat message subtle noise");
    const sound = new Audio(SubtleIM);
    sound
      .play()
      .catch((reason) => log.error(`Failed to play new chat message sound, reason: ${reason}`));
  }
  return true;
};

/**
 * Maybe create a notification when receiving an updated voicemail/fax count.
 *
 * We only want a notification when the count has increased.  We don't want one
 * on app start-up as the app will notify itself once it is created.
 *
 * @param {Message} voicemails - The voicemails data passed in from IPC
 */
export const newVoicemailNotification = (voicemails: VoicemailFaxCount): void => {
  log.debug("Maybe trigger new voicemail notification");

  if (voicemails.newMessages > 0) {
    log.debug("There are new voicemails");
    const { voicemailsReducer } = store.getState();

    if (
      voicemails.newMessages > voicemailsReducer.voicemailFaxCount.newMessages &&
      alreadyHadSomeVoicemailData
    ) {
      log.info("Show new voicemail notification");
      const body = i18n.t("newMessages_interval", {
        postProcess: "interval",
        count: voicemails.newMessages,
      });

      // Note this uses the JavaScript Notification API instead of the Electron Notification API. This
      // is just for ease, there's no reason this couldn't switch to the Electron one in future
      const newMessageNotification = new Notification(i18n.t("voicemail"), {
        body,
        icon: AppIcon,
      });

      newMessageNotification.onclick = (): void => {
        log.userAction("Clicked new voicemail notification. Open CPWeb voicemail UI");
        viewVoicemails();
      };
    }
  }

  alreadyHadSomeVoicemailData = true;
};
