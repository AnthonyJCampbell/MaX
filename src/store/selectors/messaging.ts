// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { Chat, Contact, PhoneNumber } from "src/types";
import { StoreState } from "store/types";

/**
 * Returns the chat matching a contact, or null if no match.
 */
export const selectChatsWithContact =
  (contact: Contact) =>
  (state: StoreState): Chat[] => {
    return state.messagingReducer.chats.filter(
      (c) =>
        contact?.im?.value === c.uid ||
        contact.phone.some((phoneNumber: PhoneNumber) => phoneNumber.value === c.uid)
    );
  };
