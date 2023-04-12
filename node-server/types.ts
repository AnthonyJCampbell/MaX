// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Node server types
 *
 * This file contains types for use throughout the Node code, i.e. anything in `node-server/`. It
 * mostly provides methods that convert between these types and protobuf types/binary.
 *
 * For more information on the type system in general, see docs/typescript.md
 */

import {
  Account,
  Analytic,
  CoreAction,
  CoreMotion,
  SettingsAction,
  Contact,
  ActiveCall,
  HistoricCall,
  ContactsAction,
  ContactsMotion,
  Chat,
  ChatMessage,
  Meeting,
  MeetingAction,
  MessagingAction,
  WispaMessage,
  DeepPartial,
  Settings,
  User,
  UpdateableUser,
  VoicemailFaxCount,
  VoicemailFaxAction,
} from "../src/shared/types";
import { Result } from "neverthrow";

/**
 * Any type which can be sent over WISPA by itself (as opposed to as part of another type)
 */
export type WispaDataType =
  | Account
  | CoreAction
  | CoreMotion
  | Settings
  | SettingsAction
  | ContactsAction
  | Contact
  | ContactsMotion
  | ActiveCall
  | HistoricCall
  | Chat
  | ChatMessage
  | User
  | UpdateableUser
  | Meeting
  | MeetingAction
  | MessagingAction
  | VoicemailFaxCount
  | VoicemailFaxAction
  | Analytic;

/**
 * All types of message that can be sent to Wispa
 */
export enum WispaRequestMethod {
  /**
   * Request a specific piece of Wispa data, e.g. the Contact with UID "1234"
   */
  get = "get",

  /**
   * Request a list of all data in a given namespace, e.g. all Contacts
   */
  list = "list",

  /**
   * Create a new instance of a Wispa data type
   */
  create = "create",

  /**
   * Update an existing piece of Wispa data with new information
   */
  update = "update",

  /**
   * Delete the specified Wispa data
   */
  delete = "delete",

  /**
   * Request a specified action
   */
  action = "action",
}

/**
 * All types of message that can be received from Wispa
 */
export enum WispaMessageMethod {
  /**
   * A single piece of Wispa data
   */
  data = "data",

  /**
   * A list of pieces of Wispa data
   */
  datalist = "datalist",

  /**
   * A piece of Wispa data that has been deleted
   */
  deleted = "deleted",

  /**
   * Request a specified motion
   */
  motion = "motion",
}

export enum Namespace {
  settings = "settings",
  contacts = "contacts",
  activecalls = "activecalls",
  callhistory = "callhistory",
  messaging = "messaging",
  meetings = "meetings",
  core = "core",
  voicemails = "voicemails",
  analytics = "analytics",
  user = "user",
}

/**
 * All errors that occurred during decoding of some protobuf binary into WispaData objects
 */
export interface DecodeErrors {
  // Text identifying the object that failed to decode, e.g. its UID
  identifier: string;

  // Array of strings each describing an error that occurred during decoding
  errorTexts: string[];
}

/**
 * Required methods to handle receiving a given WispaDataType from Wispa
 */
export interface WispaReceiver<T extends WispaDataType> {
  decode: (data: Uint8Array, defaultMissingFields?: boolean) => Result<T, DecodeErrors>;
  decodeList: (data: Uint8Array, defaultMissingFields?: boolean) => Result<T, DecodeErrors>[];
  buildMessage: (options: { data?: T; dataList?: T[]; deleted?: T; motion?: T }) => WispaMessage;
}

/**
 * Required methods to handle sending a given WispaDataType to Wispa
 */
export interface WispaSender<T extends WispaDataType> {
  encode: (data: DeepPartial<T>) => Uint8Array;
}

/**
 * The source of truth for all the ports wispa could be running on in various situations
 */
export const wispaPorts = {
  // The official installed Alpha client
  PRODUCTION: "9090",

  // Electron FVs
  ELECTRON_FV: "9091",

  // The default port. Used during development, e.g. "npm start" in this codebase or "./run.sh"
  // in AccessionDesktop.
  DEVELOPMENT: "9092",

  // UC Daemon FVs - not used by this codebase but included for completeness
  UC_DAEMON_FV: "9093",

  // The Early Access client (temporary ~April 2021)
  EARLY_ACCESS: "9094",
};

// Re-export shared types. This allows node-server code to import all its types from one file (i.e.
// this one). The above definitions take precedence in the event of any clashes
export * from "../src/shared/types";
