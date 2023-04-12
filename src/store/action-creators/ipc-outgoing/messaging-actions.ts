// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Exports actions that send messages to Node (ipcMain)
 */
import log from "src/renderer-logging";
import { WispaRequest, Contact, Chat } from "src/types";
import { ipcChannels } from "shared/constants";
import { MessageType } from "shared/types";

const { ipcRenderer } = window.require("electron");

/**
 * Send a list message over IPC
 */
export const listChats = (): void => {
  log.ipc("Request the chat list");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { list: "chats" };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Create a chat object with the contact UID and send over IPC
 * @param {Contact} contact - The contact to send a get with
 */
export const createChatMessage = (
  content: string,
  contact: Contact,
  messageRemoteParty: string
): void => {
  if (!content) {
    log.error(
      `Not creating chat message for ${contact.identity?.firstName} ${contact.identity?.lastName} because content was ${content}`
    );
    return;
  }

  let messageType: MessageType, recipient: string;
  if (messageRemoteParty === "IM" && contact.im?.value) {
    messageType = MessageType.IM;
    recipient = contact.im?.value;
  } else if (contact.phone.some((e) => e.value === messageRemoteParty)) {
    messageType = MessageType.SMS;
    recipient = messageRemoteParty;
  } else {
    log.error(
      `Not creating chat message for ${contact.identity?.firstName} ${contact.identity?.lastName} because chat target was ${messageRemoteParty}`
    );
    return;
  }

  log.ipc(
    `Create chat for ${contact.identity?.firstName} ${contact.identity?.lastName} (${recipient})`
  );
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = {
    create: {
      chatMessage: { content: content, recipient: { value: recipient }, type: messageType },
    },
  };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Send an action to Java to mark all the messages in the chat with the given contact as read
 * @param {Chat} chat - The chat whose messages are to be marked as read
 */
export const markChatRead = (chat: Chat): void => {
  log.ipc('Send "Mark Chat Read" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { messagingAction: { markChatRead: chat.uid } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Create a Show Chat History action to send over IPC
 * @param {String} contactChatAddress - The contact identifier to be used to show the chat history
 */
export const showChatHistory = (contact: Contact): void => {
  log.ipc('Send "Show Chat History" request');
  // If the contact is a non-IM one, we default to first phone number
  const contactChatAddress = contact.im ? contact.im?.value : contact.phone[0]?.value;
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { messagingAction: { showChatHistory: contactChatAddress } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Creates a Show Create Group Chat action to send over IPC
 */
export const showCreateGroupChat = (): void => {
  log.ipc('Send "Show Create Group Chat" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { messagingAction: { showCreateGroupChat: true } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
