// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Helper file, containing functions that implement common logic.
 */
import Away from "assets/shared/presence-away.svg";
import Busy from "assets/shared/presence-busy.svg";
import Dnd from "assets/shared/presence-dnd.svg";
import Offline from "assets/shared/presence-offline.svg";
import Online from "assets/shared/presence-online.svg";
import log from "src/renderer-logging";
import {
  CallStatus,
  PhoneNumberType,
  PostalAddressType,
  PresenceState,
  ModalPopupTypes,
  Contact,
  ActiveCall,
  Chat,
} from "src/types";
import { ipcChannels } from "src/shared/constants";
import i18n from "i18next";
import { SetRequired } from "type-fest";
import { ChatMessage, PhoneNumber, WindowTypes } from "shared/types";
import { Identifiers } from "store/types";

/**
 * Return the full name for a contact
 * @param {Contact} contact - Contact whose full name we want to print
 */
export const fullname = (contact: Contact): string => {
  if (
    contact?.identity === undefined ||
    (contact.identity.lastName === "" && contact.identity.firstName === "")
  ) {
    // Default
    return i18n.t("noName");
  } else if (contact.identity.lastName === "") {
    //  Only first name
    return `${contact.identity.firstName}`;
  } else if (contact.identity.firstName === "") {
    // Only last name
    return `${contact.identity.lastName}`;
  } else {
    // Full name
    return `${contact.identity.firstName} ${contact.identity.lastName}`;
  }
};

/**
 * Return the formatted presence state e.g. IN_A_CALL -> In A Call.
 * @param {PresenceState} state - The presence state we want to format
 */
export const prettyPresence = (state: PresenceState): string => {
  switch (state) {
    case PresenceState.ONLINE:
      return i18n.t("online");
    case PresenceState.AWAY:
      return i18n.t("away");
    case PresenceState.DO_NOT_DISTURB:
      return i18n.t("doNotDisturb");
    case PresenceState.BUSY:
      return i18n.t("busy");
    case PresenceState.IN_A_MEETING:
      return i18n.t("inAMeeting");
    case PresenceState.IN_A_CALL:
      return i18n.t("inACall");
    case PresenceState.OFFLINE:
      return i18n.t("offline");
    case PresenceState.WAITING_FOR_AUTHORISATION:
      return i18n.t("waitingForAuthorisation");
    case PresenceState.NOT_AUTHORISED:
      return i18n.t("notAuthorised");
    case PresenceState.UNKNOWN:
    default:
      // Including PresenceState.UNRECOGNISED
      log.warn(`Invalid presence state: ${state}`);
      return i18n.t("unknown");
  }
};

/**
 * Return the formatted presence state with custom status appended if any
 * @param {Contact} contact - Contact whose presence state we want to format
 */
export const prettyPresenceWithStatus = (contact: Contact): string | null => {
  let presence = contact.presence ? prettyPresence(contact.presence.state) : null;
  if (contact.presence?.customStatus) {
    presence = presence + " - " + contact.presence.customStatus;
  }
  return presence;
};

/**
 * Return the formatted number/address e.g. WORK_ADDRESS -> Work.
 * Ensure types are defined before calling.
 * @param {String} type - Number/address type we want to format
 */
export const prettyContactDetailType = (type: PhoneNumberType | PostalAddressType): string => {
  switch (type) {
    case PhoneNumberType.WORK_NUMBER:
    case PostalAddressType.WORK_ADDRESS:
      return i18n.t("work");
    case PhoneNumberType.HOME_NUMBER:
    case PostalAddressType.HOME_ADDRESS:
      return i18n.t("home");
    case PhoneNumberType.OTHER_NUMBER:
      return i18n.t("other");
    case PhoneNumberType.MOBILE_NUMBER:
      return i18n.t("mobile");
    case PhoneNumberType.FAX_NUMBER:
      return i18n.t("fax");
    default:
      // Including PhoneNumberType.UNRECOGNISED
      log.warn(`Invalid phone number type: ${type}`);
      return "";
  }
};

/**
 * Return the formatted call status e.g. CONNECTING -> Connecting...
 * Returns empty string if call status is not to be shown on the screen (e.g. a timer should be
 * shown instead).
 * @param {String} status - Call status we want to format
 */
export const prettyCallStatus = (status: CallStatus): string => {
  switch (status) {
    case CallStatus.CONNECTING:
      return i18n.t("connecting");
    case CallStatus.RINGING:
      return i18n.t("ringing");
    case CallStatus.CURRENT:
    case CallStatus.HOLD:
    case CallStatus.INCOMING:
      return "";
    case CallStatus.UNRECOGNIZED:
    default:
      log.warn(`Invalid call status: ${status}`);
      return "";
  }
};

/**
 * Set the image source. Ensure presence is defined before calling.
 * @param {PresenceState} state - Presence state
 */
export const setPresence = (state: PresenceState): string => {
  switch (state) {
    case PresenceState.ONLINE:
      return Online;
    case PresenceState.BUSY:
    case PresenceState.IN_A_CALL:
    case PresenceState.IN_A_MEETING:
      return Busy;
    case PresenceState.AWAY:
      return Away;
    case PresenceState.DO_NOT_DISTURB:
      return Dnd;
    case PresenceState.OFFLINE:
    case PresenceState.UNKNOWN:
    case PresenceState.WAITING_FOR_AUTHORISATION:
    case PresenceState.NOT_AUTHORISED:
      return Offline;
    default:
      // Including PresenceState.UNRECOGNISED
      log.warn(`Invalid presence state: ${state}`);
      return Offline;
  }
};

/**
 * Sort calls into time order - most recent first
 * @param {ActiveCall} callA - Call A to compare start time
 * @param {ActiveCall} callA - Call B to compare start time
 */
export const callSorter = (
  callA: SetRequired<ActiveCall, "datetimeStarted">,
  callB: SetRequired<ActiveCall, "datetimeStarted">
): number => {
  return Number(new Date(callB.datetimeStarted)) - Number(new Date(callA.datetimeStarted));
};

/**
 * Sort chats into timestamp order - most recent first
 * @param {Chat} chatA - Chat A to compare latest message timestamp
 * @param {Chat} chatA - Chat B to compare latest message timestamp
 */
export const chatSorter = (
  chatA: SetRequired<Chat, "message">,
  chatB: SetRequired<Chat, "message">
): number => {
  return (
    Number(new Date(chatB.message[0].timestamp)) - Number(new Date(chatA.message[0].timestamp))
  );
};

/**
 * Sort calls into type order - based on PhoneNumberType ENUM
 * NOTE: We rely on the protobuf defintion ordering of the ENUM here
 * @param {PhoneNumber} phoneA - Phone A to compare number type
 * @param {PhoneNumber} phoneB - Phone B to compare number type
 */
export const phoneNumberSorter = (phoneA: PhoneNumber, phoneB: PhoneNumber): number => {
  return phoneA.type - phoneB.type;
};

export const prettyCallDuration = (timeElapsedInSec: number): string => {
  const hours = Math.floor(timeElapsedInSec / 3600);
  const minutes = Math.floor((timeElapsedInSec - hours * 3600) / 60);
  const seconds = Math.floor(timeElapsedInSec - minutes * 60 - hours * 3600);

  const stringifyTimeBit = (num: number): string => num.toString().padStart(2, "0");

  // Don't show hours if call is less than an hour
  const hoursAsString = hours !== 0 ? `${stringifyTimeBit(hours)}:` : "";
  const minutesAsString = stringifyTimeBit(minutes);
  const secondsAsString = stringifyTimeBit(seconds);

  return `${hoursAsString}${minutesAsString}:${secondsAsString}`;
};

export const a11yCallDuration = (timeElapsedInSec: number): string => {
  const hours = Math.floor(timeElapsedInSec / 3600);
  const minutes = Math.floor((timeElapsedInSec - hours * 3600) / 60);
  const seconds = Math.floor(timeElapsedInSec - minutes * 60 - hours * 3600);

  return i18n.t("callDuration", {
    hours,
    minutes,
    seconds,
    count: hours,
    postProcess: "interval",
  });
};

/**
 * Callback to use in secondary windows that need to resize when showing tooltips
 *
 * @param {Identifiers} identifiers - identifiers for the window showing the tooltips
 * @param {number} defaultHeight - default height of the window
 * @param {number} increasedHeight - height of the window when showing the tooltips
 */
export const tippyResizeWindowCallback = (
  type: WindowTypes,
  identifiers: Identifiers,
  defaultHeight: number,
  increasedHeight: number
): void => {
  const { ipcRenderer } = window.require("electron");
  const tippyQuery = document.querySelector('[id^="tippy-"]');
  if (tippyQuery) {
    ipcRenderer.send(ipcChannels.resizeWindow, {
      identifiers: { type, ...identifiers },
      width: null,
      height: increasedHeight,
    });
  } else {
    ipcRenderer.send(ipcChannels.resizeWindow, {
      identifiers: { type, ...identifiers },
      width: null,
      height: defaultHeight,
    });
  }
};

export const getOperatingSystem = (): "macOS" | "windows" | "unix" => {
  switch (window.process.platform) {
    case "darwin":
      // eslint-disable-next-line i18next/no-literal-string
      return "macOS";
    case "win32":
      // eslint-disable-next-line i18next/no-literal-string
      return "windows";
    default:
      // eslint-disable-next-line i18next/no-literal-string
      return "unix";
  }
};

/**
 * Sort a list of messages in chronological order
 * @param messages - List of messages, containing timestamps, to sort
 */
export const sortMessages = (messages: ChatMessage[]): ChatMessage[] =>
  Array.from(messages).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

/**
 * Combine a list of chats into one ordered list of messages
 * @param chats - List of chats containing messages to sort
 */
export const orderMessagesFromChats = (chats: Chat[]): ChatMessage[] => {
  const callback = (previousValue: ChatMessage[], currentValue: Chat): ChatMessage[] => {
    currentValue.message.forEach((m) => previousValue.push(m));
    return previousValue;
  };
  const orderedMessages: ChatMessage[] =
    chats.length > 0 ? sortMessages(chats.reduce(callback, [])) : [];
  return orderedMessages;
};

/**
 * Returns if the last (most recent) message in the chat is unread (and therefore wants attention)
 * We assume that if the last (most recent) message in the chat is read, then all the messages are read
 */
export const chatAttention = (
  chat: Chat,
  selectedContact: Contact,
  activeRightPane: string,
  isMainWindowFocused: boolean
): boolean => {
  const beingViewed =
    doesContactMatchChat(selectedContact, chat.uid) &&
    activeRightPane === "chat" &&
    isMainWindowFocused;
  if (chat.message?.length < 1) return false;
  if (beingViewed) return false;
  return !sortMessages(chat.message)[0].read;
};

/**
 * Set the aria-hidden for components given the presence of a modal in the screen
 */
export const isAriaHiddenByModal = (showModalPopup: ModalPopupTypes): "true" | "false" => {
  if (showModalPopup === ModalPopupTypes.noModal) {
    // eslint-disable-next-line i18next/no-literal-string
    return "false";
  } else {
    // eslint-disable-next-line i18next/no-literal-string
    return "true";
  }
};

/**
 * Returns whether the contact is associated with that chat.
 */
export const doesContactMatchChat = (contact: Contact, chatUid: string): boolean => {
  return (
    contact.im?.value === chatUid ||
    contact.phone.some((phoneNumber) => phoneNumber.value === chatUid)
  );
};

/**
 * An old style enum, to handle custom status state.
 * - CLOSE: custom status is closed, and focus should be moved to an specific location
 * - INITIAL: initial state, which is close, but there is no need to move focus to some specific location. Use this to dismiss it.
 * - EDITING: text area is visible, so we are in an editing mode
 *
 * TODO: convert this to real enum, when it is typescript already
 */
export const CustomStatusState = {
  INITIAL: 0,
  CLOSE: 1,
  EDITING: 2,
};

/**
 * An old style enum, to handle presence menu state.
 * - CLOSE: presence is closed, and focus should be moved to an specific location
 * - INITIAL: initial state, which is close, but there is no need to move focus to some specific location. Use this to dismiss it.
 * - OPEN: presence menu is open
 *
 * TODO: convert this to real enum, when it is typescript already
 */
export const PresenceMenuState = {
  INITIAL: 0,
  CLOSE: 1,
  OPEN: 2,
};

// Removes whitespace, dashes, parantheses, commas, and periods
export const removeNumberFormatting = (str: string): string => str.replace(/[\s\-(),.]/g, "");
