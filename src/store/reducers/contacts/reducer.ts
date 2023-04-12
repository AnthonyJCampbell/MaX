// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls all contacts-related store data mutations
 */

import { ActionTypes } from "shared/types";
import * as handlers from "./handlers";
import { ContactsReducerState, ContactsPayload } from "store/types";
import { noSelectedContactUid } from "shared/constants";

const initialState: ContactsReducerState = {
  selectedContact: {
    phone: [],
    postal: [],
    email: [],
    uid: noSelectedContactUid,
    isFavourite: false,
    notifyWhenAvailable: false,
    isTyping: false,
  },
  contacts: [],
};

// TODO: Change payload and obj
export const contactReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: ContactsPayload }
): ContactsReducerState => {
  switch (type) {
    // Received contact call list from Java back-end
    // Overwrite the contact list completely and update selectedContact
    case ActionTypes.DATA_CONTACT_LIST:
      if (payload.contacts !== undefined) return handlers.dataContactList(state, payload.contacts);
      return state;

    // Received a contact object from Java back-end
    // Add a single contact to the list or overwrite it if it already exists
    case ActionTypes.DATA_CONTACT:
      if (payload.contact !== undefined) return handlers.dataContact(state, payload.contact);
      return state;

    // Received deleted contact from Java back-end
    // Remove a given contact from the contact list or log if it doesn't exist
    // Initial state is passed in as a placeholder if we need to set an empty selectedContact
    case ActionTypes.DELETED_CONTACT:
      if (payload.contact !== undefined)
        return handlers.deletedContact(state, initialState, payload.contact);
      return state;

    case ActionTypes.SET_SELECTED_CONTACT:
      if (payload.selectedContact !== undefined)
        return handlers.setSelectedContact(state, payload.selectedContact);
      return state;

    default:
      return { ...state };
  }
};
