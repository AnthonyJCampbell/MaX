// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Exports actions that send messages to Node (ipcMain)
 */
import log from "src/renderer-logging";
import { Contact, WispaRequest, PhoneNumber, Uid } from "src/types";
import { ipcChannels } from "shared/constants";
import { RequireAtLeastOne } from "type-fest";

const { ipcRenderer } = window.require("electron");

/**
 * Send a list message over IPC
 */
export const listContacts = (): void => {
  log.ipc("Request the contact list");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { list: "contacts" };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Send a list message over IPC, given a key-value pair identifier, e.g. remoteParty: "1234"
 * @param {Uid} uid - Object containing a key-value pair to identify the contact whose
 * information we want.
 */
export const getContact = (data: RequireAtLeastOne<{ uid: Uid; phone: PhoneNumber[] }>): void => {
  log.ipc("Request the contact");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { get: { contact: data } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Update Contact object with new notifyWhenAvailable value and send over IPC.
 */
export const updateContactNWA = (uid: Uid, notifyWhenAvailable: boolean): void => {
  log.ipc(`Update contact ${uid} notifyWhenAvailable to ${notifyWhenAvailable}`);
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { update: { contact: { uid, notifyWhenAvailable } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

/**
 * Update Contact object with new isFavourite value and send over IPC.
 */
export const updateContactIsFavourite = (uid: Uid, isFavourite: boolean): void => {
  log.ipc(`Update contact ${uid} isFavourite to ${isFavourite}`);
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { update: { contact: { uid, isFavourite: isFavourite } } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const addContact = (contact?: Contact): void => {
  log.ipc('Send "View Add Contact Window" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = {
    action: {
      contactsAction: { viewAddContact: { contact: { phone: contact?.phone } } },
    },
  };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const editContact = (contact: Contact): void => {
  log.ipc('Send "View Edit Contact Window" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = {
    action: { contactsAction: { viewEditContact: { contact: { uid: contact.uid } } } },
  };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const deleteContact = (contact: Contact): void => {
  log.ipc('Send "Delete Contact" request');
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { delete: { contact: contact.uid } };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};

export const sendTypingIndicator = (recipientUid: string, isTyping: boolean): void => {
  log.ipc(`Send "Typing Indicator" request with ${isTyping} for contact ${recipientUid}`);
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = {
    action: { contactsAction: { typingIndicator: { recipientUid, isTyping } } },
  };
  ipcRenderer.send(ipcChannels.wispaRequest, wispaRequest);
};
