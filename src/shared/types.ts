// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Shared types
 *
 * This file defines the system of types for use throughout the app. It is extended by "types.ts"
 * in "src" and "node-server". For more information on how this works see docs/typescript.md
 */
import * as pb from "protobuf-wispa";
import { RequireAtLeastOne, RequireExactlyOne, SetRequired, SetOptional, Except } from "type-fest";
import { CountryCode } from "libphonenumber-js";

// Export types with tweaks.
export interface Contact
  extends Except<pb.contacts.Contact, "presence" | "im" | "identity" | "types"> {
  identity?: Identity;
  im?: pb.messaging.ChatAddress;
  presence?: pb.presence.Status;
  types?: ContactType;
}
export type ActiveCall = SetRequired<
  SetOptional<pb.activecalls.ActiveCall, "datetimeStarted">,
  "microphoneIsMuted" | "status"
>;
export type Chat = SetOptional<pb.messaging.Chat, "chatName">;
export type Drafts = { [name: string]: Chat };
export type Meeting = SetOptional<pb.meetings.Meeting, "upliftCall" | "remoteParty">;
export interface Identity extends Except<pb.contacts.Identity, "profilePicture"> {
  profilePicture?: string;
}
export interface Settings extends Except<pb.settings.Settings, "general" | "meetings"> {
  general?: GeneralSettings;
  meetings?: pb.settings.MeetingsSettings;
}
export type EasRegion = CountryCode;
export interface GeneralSettings
  extends Except<pb.settings.GeneralSettings, "profilePicture" | "easRegion"> {
  profilePicture?: string;
  easRegion: EasRegion;
}

export interface ContactType
  extends Except<
    pb.contacts.ContactType,
    "typeGroupContact" | "typeIMContact" | "typeBGContact" | "typePersonalContact"
  > {
  typeIMContact: boolean;
  typeGroupContact: boolean;
  typeBGContact: boolean;
  typePersonalContact: boolean;
}

export enum BannerType {
  DND = "dnd",
  Dummy = "dummy",
  NO_CHAT = "NO_CHAT",
  NO_CALLS = "NO_CALLS",
  NO_CHAT_OR_CALLS = "NO_CHAT_OR_CALLS",
  JAVA_DOWN = "JAVA_DOWN",
}

// Re-export the unchanged pieces of the protobuf bindings that we care about
export type Account = pb.core.Account;
export type LoginState = pb.core.LoginState;
export type CoreAction = pb.core.CoreAction;
export type CoreMotion = pb.core.CoreMotion;
export type VoicemailFaxAction = pb.voicemails.VoicemailFaxAction;
export type VoicemailFaxCount = pb.voicemails.VoicemailFaxCount;
export type SettingsAction = pb.settings.SettingsAction;
export type MeetingsSettings = pb.settings.MeetingsSettings;
export type CallManagerType = pb.settings.CallManagerType;
export type HistoricCall = pb.callhistory.HistoricCall;
export type CallStatus = pb.activecalls.CallStatus;
export type CallType = pb.callhistory.CallType;
export type PostalAddress = pb.contacts.PostalAddress;
export type EmailAddress = pb.contacts.EmailAddress;
export type PostalAddressType = pb.contacts.PostalAddressType;
export type MeetingAction = pb.meetings.MeetingAction;
export type Analytic = pb.analytics.Analytic;
export type AnalyticsAdditionalData = pb.analytics.AdditionalData;
export type MessagingAction = pb.messaging.MessagingAction;
export type ChatAddress = pb.messaging.ChatAddress;
export type ChatMessage = pb.messaging.ChatMessage;
export type MessageType = pb.messaging.MessageType;
export type PresenceState = pb.presence.PresenceState;
export type Status = pb.presence.Status;
export type User = pb.user.User;
export type UpdateableUser = pb.user.UpdateableUser;
export type UpdateableStatus = pb.presence.UpdateableStatus;
export type PhoneNumber = pb.telephony.PhoneNumber;
export type PhoneNumberType = pb.telephony.PhoneNumberType;
export type ContactsAction = pb.contacts.ContactsAction;
export type ContactsMotion = pb.contacts.ContactsMotion;
export type DisplayContactMotion = pb.contacts.DisplayContactMotion;
export type CreateMeetingTabToShow = pb.meetings.CreateMeetingTabToShow;
export type TypingIndicator = pb.contacts.TypingIndicator;
export type ConnectivityState = pb.core.ConnectivityState;

// Enums need to be exported as consts as well as types since they're used as both values and types:
// ```
// const myVar: MyEnum = MyEnum.variant
// ```
export const LoginState = pb.core.LoginState;
export const CallStatus = pb.activecalls.CallStatus;
export const CallType = pb.callhistory.CallType;
export const PostalAddressType = pb.contacts.PostalAddressType;
export const MessageType = pb.messaging.MessageType;
export const PresenceState = pb.presence.PresenceState;
export const PhoneNumberType = pb.telephony.PhoneNumberType;
export const CreateMeetingTabToShow = pb.meetings.CreateMeetingTabToShow;
export const CallManagerType = pb.settings.CallManagerType;

/**
 * Alias to allow specifying that a field should be a UID. This can improve readability
 */
export type Uid = string;
export type WithUid<T extends { uid?: Uid }> = SetRequired<T, "uid">;

/**
 * Inbound message from WISPA
 *
 * Handling code should check for the existence of the field it's interested in, then handle it:
 * ```
 * if (wispaMessage.data.contact) {
 *   redux.addContact(wispaMessage.data.contact)
 * }
 * ```
 *
 * Should only ever contain one non-null field, but WISPA will enforce that so don't enforce it
 * here too.
 */
// Note: this class must be defined identically here and in ../types.ts (for reasons that are detailed there)
export class WispaMessage {
  constructor() {
    this.data = {
      account: null,
      contact: null,
      activeCall: null,
      historicCall: null,
      chat: null,
      meeting: null,
      settings: null,
      user: null,
      updateableUser: null,
      voicemailFaxCount: null,
    };
    this.dataList = {
      contacts: null,
      activeCalls: null,
      historicCalls: null,
      chats: null,
      meetings: null,
    };
    this.deleted = {
      contact: null,
      activeCall: null,
      historicCall: null,
      chat: null,
      meeting: null,
    };
    this.motion = {
      contact: null,
      core: null,
    };
  }
  data: {
    account: Account | null;
    contact: Contact | null;
    activeCall: ActiveCall | null;
    historicCall: HistoricCall | null;
    chat: Chat | null;
    meeting: Meeting | null;
    settings: Settings | null;
    user: User | null;
    updateableUser: UpdateableUser | null;
    voicemailFaxCount: VoicemailFaxCount | null;
  };

  dataList: {
    contacts: Contact[] | null;
    activeCalls: ActiveCall[] | null;
    historicCalls: HistoricCall[] | null;
    chats: Chat[] | null;
    meetings: Meeting[] | null;
  };

  deleted: {
    contact: Contact | null;
    activeCall: ActiveCall | null;
    historicCall: HistoricCall | null;
    chat: Chat | null;
    meeting: Meeting | null;
  };

  motion: {
    contact: ContactsMotion | null;
    core: CoreMotion | null;
  };
}

/**
 * All types that can exist on a WispaMessage
 */
export type WispaMessageType =
  | Account
  | Contact
  | ActiveCall
  | HistoricCall
  | Chat
  | Meeting
  | Settings
  | User
  | VoicemailFaxCount
  | Contact[]
  | ActiveCall[]
  | HistoricCall[]
  | Chat[]
  | Meeting[]
  | ContactsMotion
  | CoreMotion;

/**
 * Outbound request to WISPA, with an operation to perform.
 *
 * Make use of RequireExactlyOne to enforce that only a single piece of data is filled in, and the
 * rest left undefined.
 */
export class WispaRequest {
  payload?: RequireExactlyOne<{
    list: ListRequest;
    get: GetRequest;
    create: CreateRequest;
    update: UpdateRequest;
    delete: DeleteRequest;
    action: ActionRequest;
  }>;
}

export type ListRequest = "contacts" | "activeCalls" | "historicCalls" | "chats" | "meetings";
export type GetRequest = RequireExactlyOne<{
  account: {};
  contact: RequireAtLeastOne<{ uid: Uid; phone: pb.telephony.PhoneNumber[] }>;
  chat: { uid: Uid };
  settings: {};
  voicemailFaxCount: {};
  user: {};
}>;
export type CreateRequest = RequireExactlyOne<{
  activeCall: { remoteParty: string };
  chatMessage: {
    content: string;
    recipient: pb.messaging.ChatAddress;
    type: pb.messaging.MessageType;
  };
  meeting: {
    remoteParty: pb.messaging.ChatAddress[];
    upliftCall: string | undefined;
  };
}>;
export type UpdateRequest = RequireExactlyOne<{
  activeCall: WithUid<DeepPartial<ActiveCall>>;
  historicCall: WithUid<DeepPartial<HistoricCall>>;
  contact: WithUid<DeepPartial<Contact>>;
  chat: WithUid<DeepPartial<Chat>>;
  updateableUser: DeepPartial<UpdateableUser>;
  account: DeepPartial<Account>;
  meeting: {
    remoteParty: pb.messaging.ChatAddress[];
    upliftCall: string | undefined;
  };
  settings: pb.settings.Settings;
}>;
export type DeleteRequest = RequireExactlyOne<{
  activeCall: Uid;
  contact: Uid;
}>;
export type ActionRequest = RequireExactlyOne<{
  contactsAction: DeepPartial<pb.contacts.ContactsAction>;
  coreAction: DeepPartial<pb.core.CoreAction>;
  settingsAction: DeepPartial<pb.settings.SettingsAction>;
  meetingAction: DeepPartial<pb.meetings.MeetingAction>;
  messagingAction: DeepPartial<pb.messaging.MessagingAction>;
  voicemailFaxAction: DeepPartial<pb.voicemails.VoicemailFaxAction>;
  analytic: DeepPartial<pb.analytics.Analytic>;
}>;

/**
 * Pane Control state
 */
export type PaneControlState = {
  /**
   * All activeCalls in Redux
   */
  activeCalls: ActiveCall[];

  /**
   * The mainWindow's selected contact. If no contact is selected should be set to `null`
   */
  selectedContact: Contact | null;

  /**
   * Focus of the main window
   */
  focus: boolean;
};

// TODO
// The type-fest PartialDeep is incompatible with this DeepPartial implementation
// used by ts-proto. Ideally that latter module should export it, but doesn't.
//
// We have an issue open with ts-proto asking if it can be exported:
// https://github.com/stephenh/ts-proto/issues/168
//
// For now we just copy it here
type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : Partial<T>;

// Types of window
export enum WindowTypes {
  main = "MAIN",
  incomingCall = "INCOMING_CALL",
  inCall = "IN_CALL",
}

/**
 * Payload for the ipcChannel "sendMainWindowEvent"
 */
export interface MainWindowEventPayload {
  /**
   * Focus of the main window
   */
  focus?: boolean;
}

/**
 * Returns an object containing all the action creators that are used by actions and reducers
 * By convention, the Key-Value pair is in all-uppercase
 */
export enum ActionTypes {
  // Core
  DATA_ACCOUNT = "DATA_ACCOUNT",

  // Contacts
  SET_SELECTED_CONTACT = "SET_SELECTED_CONTACT",

  // Contacts
  DATA_CONTACT_LIST = "DATA_CONTACT_LIST",
  DATA_CONTACT = "DATA_CONTACT",
  DELETED_CONTACT = "DELETED_CONTACT",

  // Messaging
  DATA_CHAT_LIST = "DATA_CHAT_LIST",
  DATA_CHAT = "DATA_CHAT",
  SAVE_DRAFTS = "SAVE_DRAFTS",

  // Pane Management
  SET_ACTIVE_MID_PANE = "SET_ACTIVE_MID_PANE",
  SET_ACTIVE_RIGHT_PANE = "SET_ACTIVE_RIGHT_PANE",
  SET_FORCE_MESSAGE_REMOTE_PARTY = "SET_FORCE_MESSAGE_REMOTE_PARTY",
  SET_FAVOURITES = "SET_FAVOURITES",
  SET_SEARCH_TERM = "SET_SEARCH_TERM",
  SET_SEARCH_RESULTS_COUNT = "SET_SEARCH_RESULTS_COUNT",
  FOCUS_MIDBAR_SEARCH = "FOCUS_MIDBAR_SEARCH",
  FOCUS_RIGHTBAR_MESSAGE = "FOCUS_RIGHTBAR_MESSAGE",
  SET_UNIMPLEMENTED_POPUP_VISIBILITY = "SET_UNIMPLEMENTED_POPUP_VISIBILITY",
  SET_BUG_REPORT_POPUP_VISIBILITY = "SET_BUG_REPORT_POPUP_VISIBILITY",
  SET_MODAL_POPUP_VISIBILITY = "SET_MODAL_POPUP_VISIBILITY",
  SET_CUSTOM_STATUS_STATE = "SET_CUSTOM_STATUS_STATE",
  SET_PRESENCE_MENU_STATE = "SET_PRESENCE_MENU_STATE",
  ADD_BANNER = "ADD_BANNER",
  REMOVE_BANNER = "REMOVE_BANNER",
  SET_IS_MAIN_WINDOW_FOCUSED = "SET_IS_MAIN_WINDOW_FOCUSED",
  SET_IS_MID_PANE_DIAL_PAD_VISIBLE = "SET_IS_MID_PANE_DIAL_PAD_VISIBLE",
  APPEND_DIGIT_TO_SEARCH = "APPEND_DIGIT_TO_SEARCH",

  // Active Calls
  DATA_ACTIVE_CALL_LIST = "DATA_ACTIVE_CALL_LIST",
  DATA_ACTIVE_CALL = "DATA_ACTIVE_CALL",
  DELETED_ACTIVE_CALL = "DELETED_ACTIVE_CALL",

  // Call Button
  DISABLED_CALL_BUTTON = "DISABLED_CALL_BUTTON",

  // Historic Calls
  DATA_HISTORIC_CALL_LIST = "DATA_HISTORIC_CALL_LIST",
  DATA_HISTORIC_CALL = "DATA_HISTORIC_CALL",
  DELETED_HISTORIC_CALL = "DELETED_HISTORIC_CALL",

  // Voicemails
  DATA_VOICEMAIL_COUNT = "DATA_VOICEMAIL_COUNT",

  // Meetings
  DATA_MEETING_LIST = "DATA_MEETING_LIST",
  DATA_MEETING = "DATA_MEETING",
  DELETED_MEETING = "DELETED_MEETING",

  // Settings
  DATA_SETTINGS = "DATA_SETTINGS",

  // User
  DATA_USER = "DATA_USER",

  // Window
  WINDOW_STARTUP = "WINDOW_STARTUP",
}
