// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import log from "src/renderer-logging";
import { Chat, Drafts } from "src/types";
import { MessagingReducerState } from "store/types";

/**
 * Handler for a list of chats
 * @param state - The Redux state
 * @param payloadChats - The action payload chats
 */
export const dataChatList = (
  state: MessagingReducerState,
  payloadChats: Chat[]
): MessagingReducerState => {
  if (!payloadChats) {
    log.debug("Tried to add chat list but no chat list supplied");
    return { ...state };
  }

  // Completely overwrite existing chat with the new version.
  return {
    ...state,
    chats: payloadChats,
  };
};

/**
 * Handler for a single chat
 * @param state - The Redux state
 * @param payloadChat - The action payload chat
 */
export const dataChat = (
  state: MessagingReducerState,
  payloadChat: Chat
): MessagingReducerState => {
  const chatAlreadyExists = state.chats.filter((c) => c.uid === payloadChat.uid).length === 1;
  if (!chatAlreadyExists) {
    // if this is a new chat, append it to the list of chats.
    return addNewChat(state, payloadChat);
  }

  if (payloadChat.isNew) {
    // If this is a new message (i.e. should not overwrite an existing chat history),
    // append it to the existing message list of the relevant chat.
    return addNewMessage(state, payloadChat);
  }

  // This is an update to an entire chat, overwrite it.
  return overwriteChat(state, payloadChat);
};

/**
 * Handler to save drafts
 * @param state - The Redux state
 * @param payloadDrafts - The action payload drafts
 */
export const saveDrafts = (
  state: MessagingReducerState,
  payloadDrafts: Drafts
): MessagingReducerState => {
  return { ...state, drafts: payloadDrafts };
};

/**
 * Utility function for handling state changes when we're notified of a new message
 * @param state - The Redux state
 * @param incomingChat - The incoming data, with a single new message
 */
function addNewMessage(state: MessagingReducerState, incomingChat: Chat): MessagingReducerState {
  if (incomingChat.message.length !== 1) {
    log.error(
      `Attempted to add new message, but received ${incomingChat.message.length} messages instead of 1 for UID '${incomingChat.uid}'`
    );
    return { ...state };
  }

  const matchingChats = state.chats.filter((chat) => incomingChat.uid === chat.uid);
  if (matchingChats.length !== 1) {
    log.error(`Attempted to add new message, but no chat matching UID '${incomingChat.uid}'`);
    return { ...state };
  }

  // Clone a new version of the chat for us to modify
  const newChat = { ...matchingChats[0] };

  // Ensure that the we are adding a new message by removing any pre-existing
  // version of the message in the list.
  const keepMessages = newChat.message.filter((m) => m.uid !== incomingChat.message[0].uid);

  // Append the new message, then re-sort in case it was not the newest.
  newChat.message = [...keepMessages, incomingChat.message[0]];

  // Add the chat back into the wider state, then re-sort the list of chats.
  const oldChats = state.chats.filter((c) => c.uid !== newChat.uid);
  return {
    ...state,
    chats: sortChats([...oldChats, newChat]),
  };
}

/**
 * Utility function for handling state changes when we receive a new chat
 * @param state - The Redux state
 * @param payload - The action payload
 */
function addNewChat(state: MessagingReducerState, chat: Chat): MessagingReducerState {
  return {
    ...state,
    chats: sortChats([...state.chats, chat]),
  };
}

/**
 * Utility function for overwriting a chat when we receive new data for the whole chat
 * @param state - The Redux state
 * @param chat - The action payload chat
 */
function overwriteChat(state: MessagingReducerState, chat: Chat): MessagingReducerState {
  const chats = state.chats.map((stateChat: Chat) =>
    stateChat.uid === chat.uid ? chat : stateChat
  );
  return {
    ...state,
    chats: sortChats(chats),
  };
}

/**
 * Sort a list of chats by the date of their most recent message
 * @param chats - List of chats to sort
 */
const sortChats = (chats: Chat[]): Chat[] =>
  chats.sort(
    (a, b) =>
      new Date(b.message[0].timestamp).getTime() - new Date(a.message[0].timestamp).getTime()
  );
