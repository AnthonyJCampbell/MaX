// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Renderer types
 *
 * This file provides types for use throughout the renderer process, i.e. any code in "src/".
 *
 * Its main purpose is to make classes out of interfaces. For more information on the type
 * system in general, see docs/typescript.md
 */

import { plainToClass } from "class-transformer";
import {
  BGLineType,
  CallManagerType,
  CallSettings,
  ClickToDialType,
  MessagingSettings,
} from "protobuf-wispa/dist/settings";
import { DEFAULT_EAS_REGION } from "shared/constants";

import * as Interfaces from "shared/types";

export class Account implements Interfaces.Account {
  loginState: Interfaces.LoginState = Interfaces.LoginState.UNRECOGNIZED;
  connectivityState: Interfaces.ConnectivityState | undefined;
}

export class Contact implements Interfaces.Contact {
  uid = "";

  identity?: Interfaces.Identity;
  presence?: Interfaces.Status;
  phone: Interfaces.PhoneNumber[] = [];
  im?: Interfaces.ChatAddress;
  postal: Interfaces.PostalAddress[] = [];
  email: Interfaces.EmailAddress[] = [];
  isFavourite? = false;
  notifyWhenAvailable? = false;
  types?: Interfaces.ContactType;
  isTyping = false;

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): Contact {
    // TODO - In future some attributes might also want to be classes - e.g. pb.presence.Status
    // might become a class then this.presence will need to be converted. plainToClass can do
    // recursive transforming using its `Type` decorator but it doesn't seem to entirely do what we
    // want. Might have to manually call the subclass's `fromObject` ourselves, which isn't that
    // bad.
    return plainToClass(Contact, obj);
  }

  /**
   * Build a Contact from a phone number
   */
  static fromPhoneNumber(phoneNumberValue: string): Contact {
    const contact = new Contact();
    const phoneNumber: Interfaces.PhoneNumber = {
      value: phoneNumberValue,
      type: Interfaces.PhoneNumberType.OTHER_NUMBER,
    };
    contact.phone.push(phoneNumber);
    return contact;
  }
}

export class User implements Interfaces.User {
  presence: Interfaces.Status = {
    customStatus: "",
    state: Interfaces.PresenceState.OFFLINE,
  };

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): User {
    return plainToClass(User, obj);
  }
}

export class UpdateableUser implements Interfaces.UpdateableUser {
  presence: Interfaces.UpdateableStatus = {};

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): UpdateableUser {
    return plainToClass(UpdateableUser, obj);
  }
}

export class ActiveCall implements Interfaces.ActiveCall {
  uid = "";
  remoteParty = "";
  datetimeStarted?: string;
  status: Interfaces.CallStatus = Interfaces.CallStatus.UNRECOGNIZED;
  microphoneIsMuted = false;

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): ActiveCall {
    return plainToClass(ActiveCall, obj);
  }
}

export class HistoricCall implements Interfaces.HistoricCall {
  uid = "";
  remoteParty = "";
  datetimeStarted = "";
  duration = 0;
  type: Interfaces.CallType = Interfaces.CallType.UNRECOGNIZED;
  attention = false;
  displayName = "";

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): HistoricCall {
    return plainToClass(HistoricCall, obj);
  }
}

export class Chat implements Interfaces.Chat {
  uid = "";
  participant: Interfaces.ChatAddress[] = [];
  message: Interfaces.ChatMessage[] = [];
  isNew = false;
  chatName?: string;

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): Chat {
    return plainToClass(Chat, obj);
  }
}

export class Meeting implements Interfaces.Meeting {
  uid = "";
  remoteParty?: Interfaces.ChatAddress[];
  upliftCall?: string;

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): Meeting {
    return plainToClass(Meeting, obj);
  }
}

export class Settings implements Interfaces.Settings {
  meetings: Interfaces.MeetingsSettings = {
    enabled: true,
  };
  messaging: MessagingSettings = {
    enabled: true,
    isSignedIn: true,
    groupChatEnabled: true,
    smsEnabled: true,
  };
  call: CallSettings = {
    voipEnabled: true,
    clickToDialType: ClickToDialType.CTD_REMOTE,
    callManagerType: CallManagerType.NONE,
    callJumpEnabled: true,
    voicemailEnabled: true,
    callParkActive: true,
  };
  general: Interfaces.GeneralSettings = {
    profilePicture: undefined,
    displayName: "",
    accountNumber: "",
    bgLineType: BGLineType.BG_LINE,
    isNseriesConfEnabled: true,
    easRegion: DEFAULT_EAS_REGION,
    javaLocale: "",
  };

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): Settings {
    return plainToClass(Settings, obj);
  }
}

export class VoicemailFaxCount implements Interfaces.VoicemailFaxCount {
  newMessages = 0;

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): VoicemailFaxCount {
    return plainToClass(VoicemailFaxCount, obj);
  }
}

export class ContactsMotion implements Interfaces.ContactsMotion {
  displayContact: Interfaces.DisplayContactMotion = { uid: "" };

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): ContactsMotion {
    return plainToClass(ContactsMotion, obj);
  }
}

export class CoreMotion implements Interfaces.CoreMotion {
  shutdown = false;

  // Allow "any" as the provided object can genuinely have any types as its values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: Record<string, any>): CoreMotion {
    return plainToClass(CoreMotion, obj);
  }
}

// Re-define a WispaMessage here so that it's using the above class definitions of Wispa data types,
// not the interface definitions in shared/types.ts
export class WispaMessage implements Interfaces.WispaMessage {
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

// Types of message
export enum ModalPopupTypes {
  noModal,
  deleteContact,
  logOut,
}

// Re-export shared types. This allows renderer code to import all its types from one file (i.e.
// this one). The above definitions take precedence in the event of any clashes
export * from "shared/types";

export interface KeyboardNavTools {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.RefObject<HTMLButtonElement>;
}
