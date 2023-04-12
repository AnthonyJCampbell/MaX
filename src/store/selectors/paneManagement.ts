// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { StoreState } from "store/types";
import { BannerType } from "shared/types";
import { selectChatsWithContact } from "store/selectors/messaging";
import { Contact, ChatMessage, MessageType } from "src/types";
import { orderMessagesFromChats, removeNumberFormatting } from "components/utils/common";
/**
 * Select the current active banner based on priority
 */
export const selectActiveBanner = (state: StoreState): BannerType | undefined => {
  const banners: BannerType[] = state.paneManagementReducer.banners;

  // This is the priority order for banners being displayed.
  // Banners further up have higher priority.
  if (banners.includes(BannerType.JAVA_DOWN)) {
    return BannerType.JAVA_DOWN;
  } else if (banners.includes(BannerType.NO_CHAT_OR_CALLS)) {
    return BannerType.NO_CHAT_OR_CALLS;
  } else if (banners.includes(BannerType.NO_CHAT)) {
    return BannerType.NO_CHAT;
  } else if (banners.includes(BannerType.NO_CALLS)) {
    return BannerType.NO_CALLS;
  } else if (banners.includes(BannerType.DND)) {
    return BannerType.DND;
  } else if (banners.includes(BannerType.Dummy)) {
    return BannerType.Dummy;
  }

  return undefined;
};

// True if after the formatting is removed, contains only one or more of: digits, +, #, and *
const canCall = (str: string): boolean =>
  Boolean(str && removeNumberFormatting(str).match(/^[\d+#*]+$/));

/**
 * Based on `paneManagementReducer.searchTerm`, check if this is a callable number
 */
export const selectCanCall = (state: StoreState): boolean => {
  const searchTerm: string = state.paneManagementReducer.searchTerm;

  return canCall(searchTerm);
};

/**
 * Select who the message box sends a chat message to. Either one the user has selected
 * or matching the last message sent/received to the selected contact.
 */
export const selectMessageRemoteParty = (state: StoreState): string => {
  const selectedContact: Contact = state.contactReducer.selectedContact;
  const forceMessageRemoteParty = state.paneManagementReducer.forceMessageRemoteParty;

  const chats = selectChatsWithContact(selectedContact)(state);
  const orderedMessages: ChatMessage[] = orderMessagesFromChats(chats);

  if (forceMessageRemoteParty !== "") {
    //the user has selected a remote party that we do not want to overwrite
    return forceMessageRemoteParty;
  } else if (orderedMessages.length === 0) {
    //only IM chats are allowed to be empty when not initiating SMS
    return "IM";
  } else {
    const latestMessage = orderedMessages[0];
    //match the last message sent/received
    if (latestMessage?.type === MessageType.IM) {
      return "IM";
    } else if (latestMessage?.author?.value) {
      return latestMessage.author.value;
    } else if (latestMessage?.recipient?.value) {
      return latestMessage.recipient.value;
    } else {
      return selectedContact.phone[0].value;
    }
  }
};

export const selectTabsEnabled = (state: StoreState): boolean => {
  const selectedContact = state.contactReducer.selectedContact;
  const chats = selectChatsWithContact(selectedContact)(state);
  const hasIm = Boolean(selectedContact.im);
  const chatSignedIn = state.settingsReducer.settings.messaging.isSignedIn;
  const forceMessageRemoteParty = state.paneManagementReducer.forceMessageRemoteParty;

  return (
    chatSignedIn &&
    (hasIm || chats.some((chat) => chat.message.length > 0) || forceMessageRemoteParty !== "")
  );
};
