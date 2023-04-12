// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import log from "src/renderer-logging";
import { Contact } from "src/types";
import { ContactsReducerState } from "store/types";

/**
 * Override activeCalls with incoming activeCalls object
 * Payload: @param {Object} payloadContacts - An array of contact objects
 */
export const dataContactList = (
  state: ContactsReducerState,
  payloadContacts: Contact[]
): ContactsReducerState => {
  const selectedContact =
    payloadContacts.filter((c) => state.selectedContact.uid === c.uid)[0] || state.selectedContact;

  return {
    ...state,
    contacts: payloadContacts,
    selectedContact,
  };
};

/**
 * Update or add a contact in the contacts list
 * If in contacts, it'll update the contact's values
 * If not in contacts, it'll push it to contacts
 * Payload: @param {Object} payloadContact
 */
export const dataContact = (
  state: ContactsReducerState,
  payloadContact: Contact
): ContactsReducerState => {
  const updated = { ...state };

  updated.contacts = updateContacts(updated.contacts, payloadContact);
  updated.selectedContact = updateSelectedContact(updated.selectedContact, payloadContact);
  return updated;
};

const updateContacts = (contacts: Contact[], newContact: Contact): Contact[] => {
  const inList = contacts.filter((c) => c.uid === newContact.uid).length !== 0;
  if (inList) {
    return contacts.map((contact) =>
      // Find the contact with that UID and replace it or return the contact
      contact.uid === newContact.uid ? newContact : contact
    );
  } else {
    return [...contacts, newContact];
  }
};

const updateSelectedContact = (selected: Contact, newContact: Contact): Contact =>
  selected.uid === newContact.uid ? newContact : selected;

/**
 * Delete contact in contacts based on uid
 * Payload: @param {Object} payloadContact - An object containing a uid field
 */
export const deletedContact = (
  state: ContactsReducerState,
  initialState: ContactsReducerState,
  payloadContact: Contact
): ContactsReducerState => {
  const contactInList = state.contacts?.filter((c) => c.uid === payloadContact.uid).length === 1;
  if (!contactInList) {
    log.debug("Tried to delete a contact that doesn't exist");
    return { ...state };
  }

  const filterOut = (list: Contact[]): Contact[] =>
    list?.filter((c) => c.uid !== payloadContact.uid);

  const selectedContact =
    state.selectedContact.uid === payloadContact.uid
      ? initialState.selectedContact
      : state.selectedContact;

  return {
    ...state,
    contacts: filterOut(state.contacts),
    selectedContact,
  };
};

/**
 * Set the current selected contact
 * Payload: @param {Object} payloadSelectedContact - Contact to set the selectedContact to
 */
export const setSelectedContact = (
  state: ContactsReducerState,
  payloadSelectedContact: Contact
): ContactsReducerState => {
  return {
    ...state,
    selectedContact: payloadSelectedContact,
  };
};
