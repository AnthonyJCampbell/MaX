// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Classes to convert between protobuf data types and the shared types used throughout the rest of
 * the codebase
 */

import {
  Account,
  CoreAction,
  CoreMotion,
  SettingsAction,
  MessagingAction,
  Contact,
  ContactsAction,
  ContactsMotion,
  ActiveCall,
  HistoricCall,
  Chat,
  ChatMessage,
  Meeting,
  MeetingAction,
  Identity,
  CallStatus,
  WispaMessage,
  DeepPartial,
  Settings,
  GeneralSettings,
  User,
  UpdateableUser,
  WispaSender,
  WispaReceiver,
  DecodeErrors,
  VoicemailFaxCount,
  VoicemailFaxAction,
} from "../types";
import * as pb from "protobuf-wispa";
import { Result, ok, err } from "neverthrow";
import { Analytic } from "protobuf-wispa/dist/analytics";
import { CountryCode } from "libphonenumber-js";

class CoreActionConverter implements WispaSender<CoreAction> {
  encode(coreAction: DeepPartial<CoreAction>): Uint8Array {
    const pbCoreAction = pb.core.CoreAction.fromPartial(coreAction);
    return pb.core.CoreAction.encode(pbCoreAction).finish();
  }
}

class CoreMotionConverter implements WispaReceiver<CoreMotion> {
  decode(data: Uint8Array): Result<CoreMotion, never> {
    return ok(pb.core.CoreMotion.decode(data));
  }
  decodeList(): Result<never, DecodeErrors>[] {
    return [
      err({
        identifier: "CoreMotion",
        errorTexts: ["CoreMotion should not be received as part of a datalist"],
      }),
    ];
  }
  buildMessage(options: { motion?: CoreMotion }): WispaMessage {
    const data = options.motion;
    const message = new WispaMessage();
    if (data) {
      message.motion.core = data;
    }
    return message;
  }
}

class AccountConverter implements WispaSender<Account>, WispaReceiver<Account> {
  decode(data: Uint8Array): Result<Account, never> {
    return ok(pb.core.Account.decode(data));
  }
  decodeList(): Result<never, DecodeErrors>[] {
    return [
      err({
        identifier: "Account",
        errorTexts: ["Account should not be received as part of a datalist"],
      }),
    ];
  }
  buildMessage(options: { data?: Account }): WispaMessage {
    const data = options.data;
    const message = new WispaMessage();
    if (data) {
      message.data.account = data;
    }
    return message;
  }
  encode(account: DeepPartial<Account>): Uint8Array {
    const pbAccount = pb.core.Account.fromPartial(account);
    return pb.core.Account.encode(pbAccount).finish();
  }
}

class VoicemailFaxActionConverter implements WispaSender<VoicemailFaxAction> {
  encode(voicemailFaxAction: DeepPartial<VoicemailFaxAction>): Uint8Array {
    const pbVoicemailFaxAction = pb.voicemails.VoicemailFaxAction.fromPartial(voicemailFaxAction);
    return pb.voicemails.VoicemailFaxAction.encode(pbVoicemailFaxAction).finish();
  }
}

class VoicemailFaxCountConverter
  implements WispaSender<VoicemailFaxCount>, WispaReceiver<VoicemailFaxCount>
{
  decode(data: Uint8Array): Result<VoicemailFaxCount, never> {
    return ok(pb.voicemails.VoicemailFaxCount.decode(data));
  }
  decodeList(): Result<never, DecodeErrors>[] {
    return [
      err({
        identifier: "VoicemailFaxCount",
        errorTexts: ["VoicemailFaxCount should not be received as part of a datalist"],
      }),
    ];
  }
  buildMessage(options: { data?: VoicemailFaxCount }): WispaMessage {
    const data = options.data;
    const message = new WispaMessage();
    if (data) {
      message.data.voicemailFaxCount = data;
    }
    return message;
  }
  encode(voicemailFaxCount: DeepPartial<VoicemailFaxCount>): Uint8Array {
    const pbVoicemailFaxCount = pb.voicemails.VoicemailFaxCount.fromPartial(voicemailFaxCount);
    return pb.voicemails.VoicemailFaxCount.encode(pbVoicemailFaxCount).finish();
  }
}

class SettingsActionConverter implements WispaSender<SettingsAction> {
  encode(settingsAction: DeepPartial<SettingsAction>): Uint8Array {
    const pbSettingsAction = pb.settings.SettingsAction.fromPartial(settingsAction);
    return pb.settings.SettingsAction.encode(pbSettingsAction).finish();
  }
}

class ContactsActionConverter implements WispaSender<ContactsAction> {
  encode(contactsAction: DeepPartial<ContactsAction>): Uint8Array {
    const pbContactsAction = pb.contacts.ContactsAction.fromPartial(contactsAction);
    return pb.contacts.ContactsAction.encode(pbContactsAction).finish();
  }
}

class SettingsConverter implements WispaSender<Settings>, WispaReceiver<Settings> {
  decode(data: Uint8Array): Result<Settings, never> {
    const pbSettings = pb.settings.Settings.decode(data);
    return this.pbSettingsToSettings(pbSettings);
  }
  decodeList(): Result<never, DecodeErrors>[] {
    return [
      err({
        identifier: "Settings",
        errorTexts: ["Settings should not be received as part of a datalist"],
      }),
    ];
  }
  private pbSettingsToSettings(pbSettings: pb.settings.Settings): Result<Settings, never> {
    if (pbSettings.general?.profilePicture) {
      const profilePicAsString = new TextDecoder("utf-8").decode(pbSettings.general.profilePicture);
      const profilePicAsDataUrl = `data:image/png;base64,${profilePicAsString}`;

      const easRegion: CountryCode = pbSettings.general?.easRegion as CountryCode;
      return ok({
        ...pbSettings,
        general: {
          ...pbSettings.general,
          profilePicture: profilePicAsDataUrl,
          easRegion: easRegion,
        },
      });
    } else {
      const easRegion: CountryCode = pbSettings.general?.easRegion as CountryCode;
      const general: GeneralSettings | undefined = pbSettings.general
        ? { ...pbSettings.general, profilePicture: undefined, easRegion: easRegion }
        : undefined;
      return ok({ ...pbSettings, general });
    }
  }
  buildMessage(options: { data?: Settings }): WispaMessage {
    const data = options.data;
    const message = new WispaMessage();
    if (data) {
      message.data.settings = data;
    }
    return message;
  }
  encode(settings: DeepPartial<Settings>): Uint8Array {
    // Need to convert profile picture from a string to a UInt8Array or undefined. For now we never
    // need to send it so simply always set it to "undefined"
    const partialPbSettings: DeepPartial<pb.settings.Settings> = {
      ...settings,
      general: {
        ...settings.general,
        profilePicture: undefined,
      },
    };
    const pbSettings = pb.settings.Settings.fromPartial(partialPbSettings);
    return pb.settings.Settings.encode(pbSettings).finish();
  }
}

class ContactsMotionConverter implements WispaReceiver<ContactsMotion> {
  decode(data: Uint8Array): Result<ContactsMotion, never> {
    return ok(pb.contacts.ContactsMotion.decode(data));
  }
  decodeList(): Result<never, DecodeErrors>[] {
    return [
      err({
        identifier: "ContactsMotion",
        errorTexts: ["ContactsMotion should not be received as part of a datalist"],
      }),
    ];
  }
  buildMessage(options: { motion?: ContactsMotion }): WispaMessage {
    const data = options.motion;
    const message = new WispaMessage();
    if (data) {
      message.motion.contact = data;
    }
    return message;
  }
}

class ContactConverter implements WispaSender<Contact>, WispaReceiver<Contact> {
  decode(data: Uint8Array): Result<Contact, DecodeErrors> {
    const pbContact = pb.contacts.Contact.decode(data);
    return this.pbContactToContact(pbContact);
  }
  decodeList(data: Uint8Array): Result<Contact, DecodeErrors>[] {
    return pb.contacts.ContactList.decode(data).contact.map((pbContact) =>
      this.pbContactToContact(pbContact)
    );
  }

  private pbContactToContact(pbContact: pb.contacts.Contact): Result<Contact, DecodeErrors> {
    if (pbContact.uid === "")
      return err({ identifier: "Contact with no UID", errorTexts: ["Has an empty UID"] });

    if (pbContact.identity?.profilePicture) {
      const profilePicAsString = new TextDecoder("utf-8").decode(pbContact.identity.profilePicture);
      const profilePicAsDataUrl = `data:image/png;base64,${profilePicAsString}`;
      return ok({
        ...pbContact,
        identity: { ...pbContact.identity, profilePicture: profilePicAsDataUrl },
      });
    } else {
      const identity: Identity | undefined = pbContact.identity
        ? { ...pbContact.identity, profilePicture: undefined }
        : undefined;

      return ok({ ...pbContact, identity });
    }
  }

  buildMessage(options: { data?: Contact; dataList?: Contact[]; deleted?: Contact }): WispaMessage {
    const { data, dataList, deleted } = options;
    const message = new WispaMessage();
    if (data) {
      message.data.contact = data;
    } else if (dataList) {
      message.dataList.contacts = dataList;
    } else if (deleted) {
      message.deleted.contact = deleted;
    }
    return message;
  }
  encode(contact: DeepPartial<Contact>): Uint8Array {
    // Need to convert profile picture from a string to a UInt8Array or undefined. For now we never
    // need to send it so simply always set it to "undefined"
    const partialPbContact: DeepPartial<pb.contacts.Contact> = {
      ...contact,
      identity: {
        ...contact.identity,
        profilePicture: undefined,
      },
    };
    const pbContact = pb.contacts.Contact.fromPartial(partialPbContact);
    return pb.contacts.Contact.encode(pbContact).finish();
  }
}

class ActiveCallConverter implements WispaSender<ActiveCall>, WispaReceiver<ActiveCall> {
  decode(data: Uint8Array, defaultMissingFields?: boolean): Result<ActiveCall, DecodeErrors> {
    const pbActiveCall = pb.activecalls.ActiveCall.decode(data);
    return this.pbActiveCallToActiveCall(pbActiveCall, defaultMissingFields);
  }
  decodeList(data: Uint8Array, defaultMissingFields?: boolean): Result<ActiveCall, DecodeErrors>[] {
    return pb.activecalls.ActiveCallList.decode(data).activeCall.map((pbActiveCall) =>
      this.pbActiveCallToActiveCall(pbActiveCall, defaultMissingFields)
    );
  }

  private pbActiveCallToActiveCall(
    pbActiveCall: pb.activecalls.ActiveCall,
    defaultMissingFields?: boolean
  ): Result<ActiveCall, DecodeErrors> {
    const errorTexts: string[] = [];

    const microphoneIsMuted = pbActiveCall.microphoneIsMuted;
    const status = pbActiveCall.status;

    if (microphoneIsMuted !== undefined && status !== undefined) {
      return ok({ ...pbActiveCall, microphoneIsMuted, status });
    }

    if (defaultMissingFields) {
      return ok({
        ...pbActiveCall,
        microphoneIsMuted: microphoneIsMuted === undefined ? false : microphoneIsMuted,
        status: status === undefined ? CallStatus.UNRECOGNIZED : status,
      });
    }

    if (microphoneIsMuted === undefined) {
      errorTexts.push("Missing field - microphoneIsMuted");
    }
    if (status === undefined) {
      errorTexts.push("Missing field - status");
    }
    return err({ identifier: `ActiveCall with UID ${pbActiveCall.uid}`, errorTexts });
  }

  buildMessage(options: {
    data?: ActiveCall;
    dataList?: ActiveCall[];
    deleted?: ActiveCall;
  }): WispaMessage {
    const { data, dataList, deleted } = options;
    const message = new WispaMessage();
    if (data) {
      message.data.activeCall = data;
    } else if (dataList) {
      message.dataList.activeCalls = dataList;
    } else if (deleted) {
      message.deleted.activeCall = deleted;
    }
    return message;
  }
  encode(activeCall: DeepPartial<ActiveCall>): Uint8Array {
    const pbActiveCall = pb.activecalls.ActiveCall.fromPartial(activeCall);
    return pb.activecalls.ActiveCall.encode(pbActiveCall).finish();
  }
}

class HistoricCallConverter implements WispaSender<HistoricCall>, WispaReceiver<HistoricCall> {
  decode(data: Uint8Array): Result<HistoricCall, never> {
    return ok(pb.callhistory.HistoricCall.decode(data));
  }
  decodeList(data: Uint8Array): Result<HistoricCall, never>[] {
    return pb.callhistory.HistoricCallList.decode(data).historicCall.map((historicCall) =>
      ok(historicCall)
    );
  }
  buildMessage(options: {
    data?: HistoricCall;
    dataList?: HistoricCall[];
    deleted?: HistoricCall;
  }): WispaMessage {
    const { data, dataList, deleted } = options;
    const message = new WispaMessage();
    if (data) {
      message.data.historicCall = data;
    } else if (dataList) {
      message.dataList.historicCalls = dataList;
    } else if (deleted) {
      message.deleted.historicCall = deleted;
    }
    return message;
  }
  encode(historicCall: DeepPartial<HistoricCall>): Uint8Array {
    const pbHistoricCall = pb.callhistory.HistoricCall.fromPartial(historicCall);
    return pb.callhistory.HistoricCall.encode(pbHistoricCall).finish();
  }
}

class ChatConverter implements WispaSender<Chat>, WispaReceiver<Chat> {
  decode(data: Uint8Array): Result<Chat, never> {
    return ok(pb.messaging.Chat.decode(data));
  }
  decodeList(data: Uint8Array): Result<Chat, never>[] {
    return pb.messaging.ChatList.decode(data).chat.map((chat) => ok(chat));
  }
  encode(chat: DeepPartial<Chat>): Uint8Array {
    const pbChat = pb.messaging.Chat.fromPartial(chat);
    return pb.messaging.Chat.encode(pbChat).finish();
  }
  buildMessage(options: { data?: Chat; dataList?: Chat[]; deleted?: Chat }): WispaMessage {
    const { data, dataList, deleted } = options;
    const message = new WispaMessage();
    if (data) {
      message.data.chat = data;
    } else if (dataList) {
      message.dataList.chats = dataList;
    } else if (deleted) {
      message.deleted.chat = deleted;
    }
    return message;
  }
}

class MeetingConverter implements WispaSender<Meeting>, WispaReceiver<Meeting> {
  decode(data: Uint8Array): Result<Meeting, never> {
    return ok(pb.meetings.Meeting.decode(data));
  }
  decodeList(data: Uint8Array): Result<Meeting, never>[] {
    return pb.meetings.MeetingList.decode(data).meeting.map((meeting) => ok(meeting));
  }
  buildMessage(options: { data?: Meeting; dataList?: Meeting[]; deleted?: Meeting }): WispaMessage {
    const { data, dataList, deleted } = options;
    const message = new WispaMessage();
    if (data) {
      message.data.meeting = data;
    } else if (dataList) {
      message.dataList.meetings = dataList;
    } else if (deleted) {
      message.deleted.meeting = deleted;
    }
    return message;
  }
  encode(meeting: DeepPartial<Meeting>): Uint8Array {
    const pbMeeting = pb.meetings.Meeting.fromPartial(meeting);
    return pb.meetings.Meeting.encode(pbMeeting).finish();
  }
}

class UserConverter implements WispaSender<User>, WispaReceiver<User> {
  decodeList(): Result<never, DecodeErrors>[] {
    return [
      err({
        identifier: "User",
        errorTexts: ["User should not be received as part of a datalist"],
      }),
    ];
  }
  decode(data: Uint8Array): Result<User, DecodeErrors> {
    return ok(pb.user.User.decode(data));
  }
  buildMessage(options: { data?: User }): WispaMessage {
    const { data } = options;
    const message = new WispaMessage();
    if (data) {
      message.data.user = data;
    }
    return message;
  }
  encode(user: DeepPartial<User>): Uint8Array {
    const pbUser = pb.user.User.fromPartial(user);
    return pb.user.User.encode(pbUser).finish();
  }
}

class UpdateableUserConverter implements WispaSender<UpdateableUser> {
  encode(updateableUser: DeepPartial<UpdateableUser>): Uint8Array {
    const pbUpdateableUser = pb.user.UpdateableUser.fromPartial(updateableUser);
    return pb.user.UpdateableUser.encode(pbUpdateableUser).finish();
  }
}

class MeetingActionConverter implements WispaSender<MeetingAction> {
  encode(meetingAction: DeepPartial<MeetingAction>): Uint8Array {
    const pbMeetingAction = pb.meetings.MeetingAction.fromPartial(meetingAction);
    return pb.meetings.MeetingAction.encode(pbMeetingAction).finish();
  }
}

class AnalyticsConverter implements WispaSender<Analytic> {
  encode(analytic: DeepPartial<Analytic>): Uint8Array {
    const pbAnalytic = pb.analytics.Analytic.fromPartial(analytic);
    return pb.analytics.Analytic.encode(pbAnalytic).finish();
  }
}

class ChatMessageConverter implements WispaSender<ChatMessage> {
  encode(chatMessage: DeepPartial<ChatMessage>): Uint8Array {
    const pbChatMessage = pb.messaging.ChatMessage.fromPartial(chatMessage);
    return pb.messaging.ChatMessage.encode(pbChatMessage).finish();
  }
}

class MessagingActionConverter implements WispaSender<MessagingAction> {
  encode(messagingAction: DeepPartial<MessagingAction>): Uint8Array {
    const pbMessagingAction = pb.messaging.MessagingAction.fromPartial(messagingAction);
    return pb.messaging.MessagingAction.encode(pbMessagingAction).finish();
  }
}

export const accountConverter = new AccountConverter();
export const coreActionConverter = new CoreActionConverter();
export const coreMotionConverter = new CoreMotionConverter();
export const settingsActionConverter = new SettingsActionConverter();
export const settingsConverter = new SettingsConverter();
export const messagingActionConverter = new MessagingActionConverter();
export const contactConverter = new ContactConverter();
export const contactsActionConverter = new ContactsActionConverter();
export const contactsMotionConverter = new ContactsMotionConverter();
export const activeCallConverter = new ActiveCallConverter();
export const historicCallConverter = new HistoricCallConverter();
export const chatConverter = new ChatConverter();
export const meetingConverter = new MeetingConverter();
export const userConverter = new UserConverter();
export const updateableUserConverter = new UpdateableUserConverter();
export const meetingActionConverter = new MeetingActionConverter();
export const analyticsConverter = new AnalyticsConverter();
export const chatMessageConverter = new ChatMessageConverter();
export const voicemailFaxCountConverter = new VoicemailFaxCountConverter();
export const voicemailFaxActionConverter = new VoicemailFaxActionConverter();
