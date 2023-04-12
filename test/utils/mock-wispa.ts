// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Module providing MockWispa - a fake WISPA used in testing
 */

import http from "http";
import * as pb from "protobuf-wispa";

const { Settings, SettingsAction } = pb.settings;
const { VoicemailFaxCount, VoicemailFaxAction } = pb.voicemails;
const { CoreAction, Account, LoginState } = pb.core;
const { ActiveCall, ActiveCallList } = pb.activecalls;
const { HistoricCall, HistoricCallList } = pb.callhistory;
const { Contact, ContactList, ContactsAction, ContactsMotion } = pb.contacts;
const { Meeting, MeetingList, MeetingAction } = pb.meetings;
const { Chat, ChatList, ChatMessage, MessagingAction } = pb.messaging;
const { Analytic } = pb.analytics;
const { User } = pb.user;

import { cloneDeep, isEqual } from "lodash";
import { ReadonlyDeep } from "type-fest";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const log = require("node-server/main-logging");
log.isFvFramework();

import {
  WispaRequestMethod,
  WispaMessageMethod,
  Namespace,
  CallManagerType,
} from "node-server/types";
import EventEmitter from "events";
import { BGLineType, ClickToDialType } from "protobuf-wispa/dist/settings";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const socketIO = require("socket.io");
/**
 * Send a message to console and to the FV log file
 * @param {string} message - Message to log
 */
const logger = (message: string): void => {
  log.mockwispa(message);
};

interface Request {
  namespace: string;
  channel: string;
  data?: unknown;
}

interface MockWispaDataStructure {
  // We don't use sample Account objects, we edit MockWispa's data directly instead, so don't make
  // account Readonly.
  account: pb.core.Account;
  contacts: ReadonlyDeep<pb.contacts.Contact>[];
  activeCalls: ReadonlyDeep<pb.activecalls.ActiveCall>[];
  historicCalls: ReadonlyDeep<pb.callhistory.HistoricCall>[];
  chats: ReadonlyDeep<pb.messaging.Chat>[];
  meetings: ReadonlyDeep<pb.meetings.Meeting>[];
  voicemailFaxCount: ReadonlyDeep<pb.voicemails.VoicemailFaxCount>;
  settings: ReadonlyDeep<pb.settings.Settings>;
  motion: ReadonlyDeep<pb.contacts.ContactsMotion>;
  user: ReadonlyDeep<pb.user.User>;
}

/**
 * Class for mocking WISPA
 *
 * # Usage
 * There are three major types of interaction with MockWispa:
 *
 * ## 1. Lifecycle
 * Methods for creating, tearing down and resetting the mock
 *
 * **Example full lifecycle**
 * ```
 * let mockWispa = new MockWispa(9091);
 *
 * // Start accepting connections
 * mockWispa.start()
 *
 * // Reset data and connections between tests
 * mockWispa.reset()
 *
 * // Stop listening for new connections
 * mockWispa.stop()
 *
 * // Destroy permanently. Further use will require `new MockWispa(9091)`
 * mockWispa.destroy()
 * ```
 *
 * ## 2. Setting data
 * Any data that the mock should send, either when the client requests it or the user triggers it
 *
 * The data should be set on the `mockWispa.data` object. The schema showing what can be set is
 * defined as `this.blankDataStructure`.
 *
 * **Example setting data**
 * ```
 * {contact1, contact2}  = require("./list-of-contacts")
 *
 * // Set data
 * mockWispa.data.contacts = [contact1, contact2]
 * ```
 * Having run the above, if the client asks for a contact list it will be provided with `contact1`
 * and `contact2`.
 *
 * ## 3. Triggering notifications
 * MockWispa can be manually triggered to send data to the client, much like actual WISPA's
 * notifcations.
 *
 * Any data to be sent this way must first be set in `this.data`
 *
 * **Example sending data manually**
 * ```
 * {contact1, contact2}  = require("./list-of-contacts")
 *
 * // Set data
 * mockWispa.data.contacts = [contact1, contact2]
 *
 * // Send the data to the client
 * mockWispa.sendContactsList()
 * ```
 */
export class MockWispa {
  // Static "schema" for the structure of `this.data`
  // Should only ever be cloned, not modified directly. Freeze it to enforce this.
  readonly blankDataStructure: MockWispaDataStructure = {
    // Account data, defaults to logged in
    account: { loginState: LoginState.LOGGED_IN },
    // Array of Contacts
    contacts: [],
    // Array of active Calls
    activeCalls: [],
    // Array of historic Calls
    historicCalls: [],
    // Array of Chats
    chats: [],
    // Array of Meetings
    meetings: [],
    // Voicemail/Fax count
    voicemailFaxCount: { newMessages: 0 },
    // Settings
    settings: {
      // TODO DUIR-862: Are these the correct defaults?
      call: {
        voicemailEnabled: false,
        voipEnabled: false,
        callJumpEnabled: false,
        callManagerType: CallManagerType.NONE,
        callParkActive: false,
        clickToDialType: ClickToDialType.CTD_NONE,
      },
      general: {
        profilePicture: new Uint8Array(),
        displayName: "",
        accountNumber: "",
        easRegion: "GB",
        javaLocale: "en-US",
        bgLineType: BGLineType.BG_NONE,
        isNseriesConfEnabled: false,
      },
      meetings: {
        enabled: true,
      },
      messaging: undefined,
    },
    // Motions
    motion: { displayContact: { uid: "" } },
    // User
    user: {
      presence: {
        customStatus: "",
        state: 0,
      },
    },
  };

  // Structure to be filled in with any data that could be sent to the client, either manually
  // or as a response to a request. Seal it to prevent new properties being added but allow
  // existing ones to be modified.
  data = cloneDeep(this.blankDataStructure);
  // Structure to be filled in with any data that could be sent to the client, ONLY as a response
  // to a create request. Seal it to prevent new properties being added but allow existing ones
  // to be modified.
  // We can't use this.data because Electron requests this.data on start-up/refresh, and so
  // wouldn't attempt to create anything as it already exists.
  // Flow: test sets the object to return on receipt of a create message, Mock WISPA receives
  // a create request, transfers the object from here to this.data and returns the object to
  // Electron.
  // This method is cleaner than doing it "manually" i.e. the test checks that Mock WISPA has
  // received a create message, verifies its contents, then inserts the data into this.data, and
  // prods Mock WISPA to send a data message. Doing it "manually" would break a test of a single
  // flow into two chunks, which is already covered in UTs.
  createDataStore = cloneDeep(this.blankDataStructure);

  wispaPort: string;
  receivedRequests: Request[];
  httpServer: http.Server;
  io: typeof socketIO;
  coreNamespace: EventEmitter;
  settingsNamespace: EventEmitter;
  contactsNamespace: EventEmitter;
  activeCallsNamespace: EventEmitter;
  callHistoryNamespace: EventEmitter;
  messagingNamespace: EventEmitter;
  meetingsNamespace: EventEmitter;
  voicemailsNamespace: EventEmitter;
  analyticsNamespace: EventEmitter;
  userNamespace: EventEmitter;

  constructor(wispaPort: string) {
    logger("Creating new MockWispa");
    this.wispaPort = wispaPort;

    // List of requests received by MockWispa stored as WispaRequests
    this.receivedRequests = [];

    this.createDataStore = cloneDeep(this.blankDataStructure);
    Object.seal(this.createDataStore);

    // Create server, but don't listen yet. That's the jurisdiction of `start()` and `stop()`
    this.httpServer = http.createServer();
    this.io = socketIO(this.httpServer);

    this.coreNamespace = this.io.of("/core");
    this.settingsNamespace = this.io.of("/settings");
    this.contactsNamespace = this.io.of("/contacts");
    this.activeCallsNamespace = this.io.of("/activecalls");
    this.callHistoryNamespace = this.io.of("/callhistory");
    this.messagingNamespace = this.io.of("/messaging");
    this.meetingsNamespace = this.io.of("/meetings");
    this.voicemailsNamespace = this.io.of("/voicemails");
    this.analyticsNamespace = this.io.of("/analytics");
    this.userNamespace = this.io.of("/user");

    this._serve();
  }

  /**
   * Start listening for new connections
   */
  start(): void {
    logger("MockWispa starting");
    if (!this.httpServer.listening) {
      this.httpServer.listen(this.wispaPort);
    }
  }

  /**
   * Stop listening for new connections
   */
  stop(): void {
    logger("MockWispa stopping");
    if (this.httpServer.listening) {
      this.httpServer.close();
    }
  }

  /**
   * Reset all state ready for re-use
   *
   * Running this function between tests is sufficient for tests using the same MockWispa not to
   * interfere with each other
   */
  reset(): void {
    this.receivedRequests = [];
    this.data = cloneDeep(this.blankDataStructure);
    this.createDataStore = cloneDeep(this.blankDataStructure);
  }

  /**
   * Destroy this server
   *
   * This should be done after all tests in a file have run. This is necessary because Jest uses
   * one Node process to run all test files, meaning that any async processes (i.e. the
   * httpServer) need to be torn down manually to avoid conflicts.
   */
  destroy(): void {
    logger("Destroying mock WISPA");
    this.httpServer.close();
    this.io.close();
  }

  /**
   * Checks whether a request has been received on the given namespace/channel with the given data
   * @param {string} namespace
   * @param {string} channel
   * @param {any} data the wispa request data to check. If not provided, this function will match
   * any request in the given namespace/channel
   */
  hasReceivedRequest(namespace: string, channel: string, data: unknown = null): boolean {
    return this.receivedRequests.some((request) => {
      const namespaceMatches = request.namespace === namespace;
      const channelMatches = request.channel === channel;
      const dataMatches = data ? isEqual(request.data, data) : true;

      return namespaceMatches && channelMatches && dataMatches;
    });
  }

  /**
   * Send a display contact motion
   */
  sendDisplayContactMotion(): void {
    logger("Sending contact display motion");
    const pbContactsMotion = ContactsMotion.fromPartial({
      displayContact: this.data.motion.displayContact,
    });
    const encodedContactsMotion = ContactsMotion.encode(pbContactsMotion).finish();
    this.contactsNamespace.emit(WispaMessageMethod.motion, encodedContactsMotion);
  }

  /**
   * Send the current settings
   */
  sendSettings(): void {
    logger("Sending new settings");
    const pbSettings = Settings.fromPartial(mutableCloneDeep(this.data.settings));
    const encodedSettings = Settings.encode(pbSettings).finish();
    this.settingsNamespace.emit(WispaMessageMethod.data, encodedSettings);
  }

  /**
   * Send the current new voicemail/fax count
   */
  sendVoicemailFaxCount(): void {
    logger("Sending new voicemail fax count");
    const pbVoicemailFaxCount = VoicemailFaxCount.fromPartial({
      newMessages: this.data.voicemailFaxCount.newMessages,
    });
    const encodedVoicemailFaxCount = VoicemailFaxCount.encode(pbVoicemailFaxCount).finish();
    this.voicemailsNamespace.emit(WispaMessageMethod.data, encodedVoicemailFaxCount);
  }

  /**
   * Send the current account data
   */
  sendAccount(): void {
    logger("Sending account data");
    const pbAccount = Account.fromPartial({
      loginState: this.data.account.loginState,
    });
    const encodedAccount = Account.encode(pbAccount).finish();
    this.coreNamespace.emit(WispaMessageMethod.data, encodedAccount);
  }

  /**
   * Send the current list of contacts
   */
  sendContactsList(): void {
    logger("Sending contact list");
    const pbContactList = ContactList.fromPartial({
      contact: this.data.contacts.map(mutableCloneDeep),
    });
    const encodedContactList = ContactList.encode(pbContactList).finish();
    this.contactsNamespace.emit(WispaMessageMethod.datalist, encodedContactList);
  }

  /**
   * Send an individual contact, identified by UID
   * @param {string} uid - The UID of the contact to send
   */
  sendContactUid(uid: string): void {
    if (uid === undefined) {
      throw new Error("MockWispa.sendContactUid() called without a UID");
    }

    const contactToSend = this.data.contacts.find((contact) => contact.uid === uid);

    if (contactToSend === undefined) {
      throw new Error(`MockWispa.sendContactUid() couldn't find contact with UID ${uid}`);
    }

    logger(`Sending contact with UID ${uid}`);
    const pbContact = Contact.fromPartial(mutableCloneDeep(contactToSend));
    const encodedContact = Contact.encode(pbContact).finish();
    this.contactsNamespace.emit(WispaMessageMethod.data, encodedContact);
  }

  /**
   * Send an individual contact, identified by DN
   * @param {string} dn - The DN of the contact to send
   */
  sendContactDn(dn: string): void {
    if (dn === undefined) {
      throw new Error("MockWispa.sendContactDn() called without a DN");
    }

    const contactToSend = this.data.contacts.find((c) =>
      c.phone.some((number) => number.value === dn)
    );

    if (contactToSend === undefined) {
      logger(
        `MockWispa.sendContactDn() couldn't find contact with DN ${dn}. This is expected when receiving a call from a non-contact`
      );
      return;
    }

    logger(`Sending contact with DN ${dn}`);
    const pbContact = Contact.fromPartial(mutableCloneDeep(contactToSend));
    const encodedContact = Contact.encode(pbContact).finish();
    this.contactsNamespace.emit(WispaMessageMethod.data, encodedContact);
  }

  /**
   * Send an empty contact.
   */
  sendEmptyContact(): void {
    logger(`Sending empty contact`);
    const pbContact = Contact.fromPartial({});
    const encodedContact = Contact.encode(pbContact).finish();
    this.contactsNamespace.emit(WispaMessageMethod.data, encodedContact);
  }

  /**
   * Send a message to delete a contact, identified by UID.
   * @param uid - The UID of the contact to delete
   */
  deleteContact(uid: string): void {
    if (uid === undefined) {
      throw new Error("MockWispa.deleteContact() called without a UID");
    }

    const contactToDelete = this.data.contacts.find((contact) => {
      return contact.uid === uid;
    });

    if (contactToDelete === undefined) {
      throw new Error(`MockWispa.deleteContact() couldn't find contact with UID ${uid}`);
    }

    this.data.contacts = this.data.contacts.filter((contact) => contact !== contactToDelete);

    const contactUIDToDelete = { uid: contactToDelete.uid };
    logger(`Deleting contact with UID ${uid}`);
    const pbContact = Contact.fromPartial(contactUIDToDelete);
    const encodedContact = Contact.encode(pbContact).finish();
    this.contactsNamespace.emit(WispaMessageMethod.deleted, encodedContact);
  }

  /**
   * Send a delete contact message for an empty contact.
   */
  deleteEmptyContact(): void {
    logger(`Deleting empty contact`);
    const pbContact = Contact.fromPartial({});
    const encodedContact = Contact.encode(pbContact).finish();
    this.contactsNamespace.emit(WispaMessageMethod.deleted, encodedContact);
  }

  /**
   * Send the current list of active calls
   */
  sendActiveCallsList(): void {
    logger(`Sending active calls list: ${JSON.stringify(this.data.activeCalls)}`);
    const pbActiveCallList = ActiveCallList.fromPartial({ activeCall: this.data.activeCalls });
    const encodedActiveCallsList = ActiveCallList.encode(pbActiveCallList).finish();
    this.activeCallsNamespace.emit(WispaMessageMethod.datalist, encodedActiveCallsList);
  }

  /**
   * Send an individual active call, identified by UID
   * @param {string} uid - The UID of the active call to send
   */
  sendActiveCall(uid: string): void {
    if (uid === undefined) {
      throw new Error("MockWispa.sendActiveCall() called without a UID");
    }

    const activeCallToSend = this.data.activeCalls.find((activeCall) => {
      return activeCall.uid === uid;
    });

    if (activeCallToSend === undefined) {
      throw new Error(`MockWispa.sendActiveCall() couldn't find active call with UID ${uid}`);
    }

    logger(`Sending active call ${activeCallToSend}`);
    const pbActiveCall = ActiveCall.fromPartial(activeCallToSend);
    const encodedActiveCall = ActiveCall.encode(pbActiveCall).finish();
    this.activeCallsNamespace.emit(WispaMessageMethod.data, encodedActiveCall);
  }

  /**
   * Send an individual create active call, identified by remote party
   * @param {string} remoteParty - The remoteParty of the active call to send
   */
  sendCreateActiveCall(remoteParty: string): void {
    if (remoteParty === undefined) {
      throw new Error("MockWispa.sendCreateActiveCall() called without a remote party");
    }
    const activeCallToSend = this.createDataStore.activeCalls.find((activeCall) => {
      return activeCall.remoteParty === remoteParty;
    });
    if (activeCallToSend === undefined) {
      throw new Error(`MockWispa.sendCreateActiveCall() couldn't find active
      call with remoteParty ${remoteParty}`);
    }
    this.data.activeCalls.push(activeCallToSend);

    logger(`Sending "create active call" ${activeCallToSend}`);
    const pbActiveCall = ActiveCall.fromPartial(activeCallToSend);
    const encodedActiveCall = ActiveCall.encode(pbActiveCall).finish();
    this.activeCallsNamespace.emit(WispaMessageMethod.data, encodedActiveCall);
  }

  /**
   * Send an empty active call.
   */
  sendEmptyActiveCall(): void {
    logger(`Sending empty active call`);
    const pbActiveCall = ActiveCall.fromPartial({});
    const encodedActiveCall = ActiveCall.encode(pbActiveCall).finish();
    this.activeCallsNamespace.emit(WispaMessageMethod.data, encodedActiveCall);
  }

  /**
   * Send a message to delete an active call, identified by UID.
   * @param uid - The UID of the active call to delete
   */
  deleteActiveCall(uid: string): void {
    if (uid === undefined) {
      throw new Error("MockWispa.deleteActiveCall() called without a UID");
    }

    const activeCallToDelete = this.data.activeCalls.find((activeCall) => {
      return activeCall.uid === uid;
    });

    if (activeCallToDelete === undefined) {
      throw new Error(`MockWispa.deleteActiveCall() couldn't find active call with UID ${uid}`);
    }

    this.data.activeCalls = this.data.activeCalls.filter(
      (activeCall) => activeCall !== activeCallToDelete
    );

    const activeCallUIDToDelete = { uid: activeCallToDelete.uid };
    logger(`Deleting active call with UID ${uid}`);
    const pbActiveCall = ActiveCall.fromPartial(activeCallUIDToDelete);
    const encodedActiveCall = ActiveCall.encode(pbActiveCall).finish();
    this.activeCallsNamespace.emit(WispaMessageMethod.deleted, encodedActiveCall);
  }

  /**
   * Send a delete active call message for an empty active call.
   */
  deleteEmptyActiveCall(): void {
    logger(`Deleting empty active call`);
    const pbActiveCall = ActiveCall.fromPartial({});
    const encodedActiveCall = ActiveCall.encode(pbActiveCall).finish();
    this.activeCallsNamespace.emit(WispaMessageMethod.deleted, encodedActiveCall);
  }

  /**
   * Decode the data within an incoming active call message.
   * @param {Buffer} data - Active call data to be decoded
   */
  decodeActiveCall(data: Uint8Array): pb.activecalls.ActiveCall {
    return ActiveCall.decode(data);
  }

  /*
   * Send all historic calls as a list to the client
   */
  sendCallHistoryList(): void {
    logger(`Sending historic calls list: ${JSON.stringify(this.data.historicCalls)}`);
    const pbCallList = HistoricCallList.fromPartial({ historicCall: this.data.historicCalls });
    const encodedCallList = HistoricCallList.encode(pbCallList).finish();
    this.callHistoryNamespace.emit(WispaMessageMethod.datalist, encodedCallList);
  }

  /**
   * Send an individual historic call, identified by UID
   * @param {string} uid - The UID of the historic call to send
   */
  sendHistoricCall(uid: string): void {
    if (uid === undefined) {
      throw new Error("MockWispa.sendHistoricCall() called without a UID");
    }

    const historicCallToSend = this.data.historicCalls.find((historicCall) => {
      return historicCall.uid === uid;
    });

    if (historicCallToSend === undefined) {
      throw new Error(`MockWispa.sendHistoricCall() couldn't find historic call with UID ${uid}`);
    }

    logger(`Sending historic call ${historicCallToSend}`);
    const pbHistoricCall = HistoricCall.fromPartial(historicCallToSend);
    const encodedHistoricCall = HistoricCall.encode(pbHistoricCall).finish();
    this.callHistoryNamespace.emit(WispaMessageMethod.data, encodedHistoricCall);
  }

  /**
   * Decode the data within an incoming historic call message.
   * @param {Buffer} data - Historic call data to be decoded
   */
  decodeHistoricCall(data: Uint8Array): string {
    return this.verifyHistoricCall(HistoricCall.decode(data));
  }

  /**
   * Verify the decoded data within an incoming historic call message, and return just the uid/remote party.
   * @param {historicCall} data - Historic call data to be verifed and stripped out
   */
  verifyHistoricCall(data: pb.callhistory.HistoricCall): string {
    return data.uid || data.remoteParty;
  }

  /**
   * Send a message to delete a historic call, identified by UID.
   * @param uid - The UID of the historic call to delete
   */
  deleteHistoricCall(uid: string): void {
    if (uid === undefined) {
      throw new Error("MockWispa.deleteHistoricCall() called without a UID");
    }

    const historicCallToDelete = this.data.historicCalls.find((historicCall) => {
      return historicCall.uid === uid;
    });

    if (historicCallToDelete === undefined) {
      throw new Error(`MockWispa.deleteHistoricCall() couldn't find historic call with UID ${uid}`);
    }

    this.data.historicCalls = this.data.historicCalls.filter(
      (historicCall) => historicCall !== historicCallToDelete
    );

    const historicCallUIDToDelete = { uid: historicCallToDelete.uid };
    logger(`Deleting historic call with UID ${uid}`);
    const pbHistoricCall = HistoricCall.fromPartial(historicCallUIDToDelete);
    const encodedHistoricCall = HistoricCall.encode(pbHistoricCall).finish();
    this.callHistoryNamespace.emit(WispaMessageMethod.deleted, encodedHistoricCall);
  }

  /*
   * Send all Chats as a list to the client
   */
  sendChatsList(): void {
    logger("Sending Chat list");
    const pbChatList = ChatList.fromPartial({ chat: this.data.chats.map(mutableCloneDeep) });
    const encodedChatList = ChatList.encode(pbChatList).finish();
    this.messagingNamespace.emit(WispaMessageMethod.datalist, encodedChatList);
  }

  /**
   * Send the Chat for a given IM address
   * @param imAddress - The IM address to send the chat for
   * @param mustExist - Whether mock WISPA should throw an error if it has no chat for
   * the given imAddress
   */
  sendChatHistory(imAddress: string, mustExist = true): void {
    logger(`Sending chat history for ${imAddress}`);
    const chatHistoryToSend = this.data.chats.find((chat) => {
      return chat.uid === imAddress;
    });

    if (chatHistoryToSend === undefined) {
      if (mustExist) {
        throw new Error(
          `MockWispa.sendChatHistory() couldn't find chat history with UID ${imAddress}`
        );
      } else {
        return;
      }
    }
    logger(`Sending chat history with UID ${imAddress}`);
    this._sendChat(mutableCloneDeep(chatHistoryToSend));
  }

  sendNewMessage(chat: pb.messaging.Chat): void {
    this._sendChat(chat);
  }

  _createNewMessage(chatMessage: pb.messaging.ChatMessage): void {
    const chatMessageToSend = this.createDataStore.chats.find(
      (chat) => chat.uid === chatMessage.recipient?.value
    );
    if (chatMessageToSend === undefined) {
      logger(
        `No chat message corresponding to ${JSON.stringify(chatMessage)} in this.createDataStore`
      );
    } else {
      this._sendChat(mutableCloneDeep(chatMessageToSend));
    }
  }

  /**
   * Verify the decoded data within an incoming chat message.
   * @param {chatMessage} data - Chat message data to be verifed and stripped out
   */
  verifyChatMessage(data: Uint8Array): pb.messaging.ChatMessage {
    return ChatMessage.decode(data);
  }

  /**
   * Sends a protobuf Chat
   */
  _sendChat(chat: pb.messaging.Chat): void {
    const pbChat = Chat.fromPartial(chat);
    const encodedChat = Chat.encode(pbChat).finish();
    this.messagingNamespace.emit(WispaMessageMethod.data, encodedChat);
  }

  /*
   * Send all Meetings as a list to the client
   */
  sendMeetingList(): void {
    logger("Sending Meeting list");
    const pbMeetingList = MeetingList.fromPartial({
      meeting: this.data.meetings.map(mutableCloneDeep),
    });
    const encodedMeetingList = MeetingList.encode(pbMeetingList).finish();
    this.meetingsNamespace.emit(WispaMessageMethod.datalist, encodedMeetingList);
  }

  /**
   * Sends a protobuf Meeting
   */
  sendMeeting(): void {
    const pbMeeting = Meeting.fromPartial({ uid: "0123456789" });
    const encodedMeeting = Meeting.encode(pbMeeting).finish();
    this.meetingsNamespace.emit(WispaMessageMethod.data, encodedMeeting);
  }

  /**
   * Sends a deleted Meeting
   */
  deletedMeeting(): void {
    const pbMeeting = Meeting.fromPartial({ uid: "0123456789" });
    const encodedMeeting = Meeting.encode(pbMeeting).finish();
    this.meetingsNamespace.emit(WispaMessageMethod.deleted, encodedMeeting);
  }

  /**
   * Sends a protobuf user
   * @param {Object} user
   */
  sendUser(user: pb.user.User): void {
    const pbUser = User.fromPartial(user);
    const encodedUser = User.encode(pbUser).finish();
    this.userNamespace.emit(WispaMessageMethod.data, encodedUser);
  }

  /**
   * Setup listeners
   * All listeners are setup right away. The data they return is taken from `this.data`
   */
  _serve(): void {
    logger("Setting up namespaces");
    this._listenOnNamespace(Namespace.core, this.coreNamespace, this._startCoreListeners);
    this._listenOnNamespace(
      Namespace.settings,
      this.settingsNamespace,
      this._startSettingsListeners
    );
    this._listenOnNamespace(
      Namespace.contacts,
      this.contactsNamespace,
      this._startContactsListeners
    );
    this._listenOnNamespace(
      Namespace.activecalls,
      this.activeCallsNamespace,
      this._startActiveCallsListeners
    );
    this._listenOnNamespace(
      Namespace.callhistory,
      this.callHistoryNamespace,
      this._startCallHistoryListeners
    );
    this._listenOnNamespace(
      Namespace.messaging,
      this.messagingNamespace,
      this._startMessagingListeners
    );
    this._listenOnNamespace(
      Namespace.meetings,
      this.meetingsNamespace,
      this._startMeetingsListeners
    );
    this._listenOnNamespace(
      Namespace.voicemails,
      this.voicemailsNamespace,
      this._startVoicemailsListeners
    );
    this._listenOnNamespace(
      Namespace.analytics,
      this.analyticsNamespace,
      this._startAnalyticsListeners
    );
    this._listenOnNamespace(Namespace.user, this.userNamespace, this._startUserListeners);
  }

  /**
   * Setup a namespace
   *
   * Listens for connection and register and calls given listeners for that namespace
   * @param {String} namespaceName
   * @param {SocketIO.Namespace} namespaceObject
   * @param {Function} startListeners
   */
  _listenOnNamespace(
    namespaceName: string,
    namespaceObject: EventEmitter,
    startListeners: (client: EventEmitter) => void
  ): void {
    namespaceObject.on("connect", (client) => {
      logger(`Received connection on ${namespaceName} namespace`);

      client.on("register", (_data: never, callback: (logText: string) => void) => {
        logger(`Received register request on ${namespaceName} namespace`);
        callback(`REGISTERED ${namespaceName.toUpperCase()}`);
      });

      if (startListeners) {
        startListeners.call(this, client);
      }
    });
  }

  _startContactsListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.list, () => {
      this._recordRequest("contacts", WispaRequestMethod.list);
      this.sendContactsList();
    });
    client.on(WispaRequestMethod.get, (getContactBinary) => {
      const getContact = Contact.decode(getContactBinary);
      this._recordRequest("contacts", WispaRequestMethod.get, getContact);
      if (getContact.uid) this.sendContactUid(getContact.uid);
      else if (getContact.phone[0].value) this.sendContactDn(getContact.phone[0].value);
    });
    client.on(WispaRequestMethod.update, (updateContactBinary) => {
      const updateContact = Contact.decode(updateContactBinary);
      this._recordRequest("contacts", WispaRequestMethod.update, updateContact);
      this.sendContactUid(updateContact.uid);
    });
    client.on(WispaRequestMethod.delete, (deleteContactBinary) => {
      const deleteContact = Contact.decode(deleteContactBinary);
      this._recordRequest("contacts", WispaRequestMethod.delete, deleteContact);
      this.deleteContact(deleteContact.uid);
    });
    client.on(WispaRequestMethod.action, (contactsActionBinary) => {
      const contactsAction = ContactsAction.decode(contactsActionBinary);
      this._recordRequest("contacts", WispaRequestMethod.action, contactsAction);
    });
  }

  _startActiveCallsListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.list, () => {
      this._recordRequest("activecalls", WispaRequestMethod.list);
      this.sendActiveCallsList();
    });
    client.on(WispaRequestMethod.create, (createActiveCallBinary) => {
      const createActiveCall = this.decodeActiveCall(createActiveCallBinary);
      this._recordRequest("activecalls", WispaRequestMethod.create, createActiveCall);
      this.sendCreateActiveCall(createActiveCall.remoteParty);
    });
    client.on(WispaRequestMethod.update, (updateActiveCallBinary) => {
      const updateActiveCall = this.decodeActiveCall(updateActiveCallBinary);
      this._recordRequest("activecalls", WispaRequestMethod.update, updateActiveCall);
      this.sendActiveCall(updateActiveCall.uid);
    });
    client.on(WispaRequestMethod.delete, (deleteActiveCallBinary) => {
      const deleteActiveCall = this.decodeActiveCall(deleteActiveCallBinary);
      this._recordRequest("activecalls", WispaRequestMethod.delete, deleteActiveCall);
      this.deleteActiveCall(deleteActiveCall.uid);
    });
  }

  _startCallHistoryListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.list, () => {
      this._recordRequest("callhistory", WispaRequestMethod.list);
      this.sendCallHistoryList();
    });
    client.on(WispaRequestMethod.update, (updateHistoricCallBinary) => {
      const updateHistoricCall = HistoricCall.decode(updateHistoricCallBinary);
      this._recordRequest("callhistory", WispaRequestMethod.update, updateHistoricCall);

      const historicCallToUpdate = this.data.historicCalls.find((call) => {
        return call.uid === updateHistoricCall.uid;
      });
      if (historicCallToUpdate && updateHistoricCall.attention != null) {
        log.wispa("Attention");
        this.data.historicCalls.splice(this.data.historicCalls.indexOf(historicCallToUpdate), 1, {
          ...historicCallToUpdate,
          attention: updateHistoricCall.attention,
        });
      }

      this.sendHistoricCall(updateHistoricCall.uid);
    });
  }

  _startMessagingListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.list, () => {
      this._recordRequest("messaging", WispaRequestMethod.list);
      this.sendChatsList();
    });
    client.on(WispaRequestMethod.get, (getChatBinary) => {
      const getChat = Chat.decode(getChatBinary);
      this._recordRequest("messaging", WispaRequestMethod.get, getChat);
      this.sendChatHistory(getChat.uid, false);
    });
    client.on(WispaRequestMethod.create, (createChatBinary) => {
      const createChat = this.verifyChatMessage(createChatBinary);
      this._recordRequest("messaging", WispaRequestMethod.create, createChat);
      this._createNewMessage(createChat);
    });
    client.on(WispaRequestMethod.action, (messagingActionBinary) => {
      const messagingAction = MessagingAction.decode(messagingActionBinary);
      this._recordRequest("messaging", WispaRequestMethod.action, messagingAction);
    });
  }

  _startMeetingsListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.list, () => {
      this._recordRequest("meeting", WispaRequestMethod.list);
      this.sendMeetingList();
    });
    client.on(WispaRequestMethod.create, (createMeetingBinary) => {
      const createMeeting = Meeting.decode(createMeetingBinary);
      this._recordRequest("meeting", WispaRequestMethod.create, createMeeting);
      this.sendMeeting();
    });
    client.on(WispaRequestMethod.update, (updateMeetingBinary) => {
      const updateMeeting = Meeting.decode(updateMeetingBinary);
      this._recordRequest("meeting", WispaRequestMethod.update, updateMeeting);
      this.sendMeeting();
    });
    client.on(WispaRequestMethod.action, (meetingActionBinary) => {
      const meetingAction = MeetingAction.decode(meetingActionBinary);
      this._recordRequest("meeting", WispaRequestMethod.action, meetingAction);
    });
  }

  _startSettingsListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.action, (settingsActionBinary) => {
      const settingsAction = SettingsAction.decode(settingsActionBinary);
      this._recordRequest("settings", WispaRequestMethod.action, settingsAction);
    });

    client.on(WispaRequestMethod.get, () => {
      this._recordRequest("settings", WispaRequestMethod.get);
      this.sendSettings();
    });
  }

  _startVoicemailsListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.get, (getVoicemailFaxCountBinary) => {
      const getVoicemailFaxCount = VoicemailFaxCount.decode(getVoicemailFaxCountBinary);
      this._recordRequest("voicemails", WispaRequestMethod.get, getVoicemailFaxCount);
      this.sendVoicemailFaxCount();
    });
    client.on(WispaRequestMethod.action, (voicemailsActionBinary) => {
      const voicemailsAction = VoicemailFaxAction.decode(voicemailsActionBinary);
      this._recordRequest("voicemails", WispaRequestMethod.action, voicemailsAction);
    });
  }

  _startCoreListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.get, (getAccountBinary) => {
      const getAccount = Account.decode(getAccountBinary);
      this._recordRequest("core", WispaRequestMethod.get, getAccount);
      this.sendAccount();
    });
    client.on(WispaRequestMethod.action, (coreActionBinary) => {
      const coreAction = CoreAction.decode(coreActionBinary);
      this._recordRequest("core", WispaRequestMethod.action, coreAction);
    });
    client.on(WispaRequestMethod.update, (updateAccountBinary) => {
      const updateAccount = Account.decode(updateAccountBinary);
      this._recordRequest("core", WispaRequestMethod.update, updateAccount);
    });
  }

  _startAnalyticsListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.action, (analyticsBinary) => {
      const analytic = Analytic.decode(analyticsBinary);
      this._recordRequest("analytics", WispaRequestMethod.action, analytic);
    });
  }
  _startUserListeners(client: EventEmitter): void {
    client.on(WispaRequestMethod.get, () => {
      this._recordRequest("user", WispaRequestMethod.get);
      this.sendUser({ presence: { state: 0, customStatus: "" } });
    });
    client.on(WispaRequestMethod.update, (updateUserBinary) => {
      const updateUser = User.decode(updateUserBinary);
      this._recordRequest("user", WispaRequestMethod.update, updateUser);
      this.sendUser(updateUser);
    });
  }

  /**
   * Record an inbound request
   *
   * Used by test frameworks to verify the correct requests have been sent
   *
   * @param {string} namespace - Namespace request was received on
   * @param {string} channel - Channel request was received on
   * @param {any} data - Any data sent with the request
   */
  _recordRequest(namespace: string, channel: string, data?: unknown): void {
    logger(`Received: "${channel}" on namespace "${namespace}" with data ${JSON.stringify(data)}`);
    const request = { namespace, channel, data };
    this.receivedRequests.push(request);
  }
}
