// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls all message-related store data mutations
 */

import { ActionTypes } from "shared/types";
import * as handlers from "./handlers";
import { MessagingReducerState, MessagingPayload } from "store/types";

const initialState: MessagingReducerState = {
  chats: [],
  drafts: {},
};
// TODO Change obj & Any
export const messagingReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: MessagingPayload }
): MessagingReducerState => {
  switch (type) {
    case ActionTypes.DATA_CHAT_LIST:
      // Overwrite the stored chat list completely
      if (payload.chats !== undefined) return handlers.dataChatList(state, payload.chats);
      return state;
    case ActionTypes.DATA_CHAT:
      // Merge the new chat with the stored version of the chat
      if (payload.chat !== undefined) return handlers.dataChat(state, payload.chat);
      return state;
    case ActionTypes.SAVE_DRAFTS:
      if (payload.drafts !== undefined) return handlers.saveDrafts(state, payload.drafts);
      return state;

    default:
      return { ...state };
  }
};
