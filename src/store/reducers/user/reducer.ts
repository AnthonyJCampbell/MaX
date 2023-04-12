// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls all user-related store data mutations
 */
import { PresenceState } from "protobuf-wispa/dist/presence";
import { UserReducerState, UserPayload } from "store/types";
import { ActionTypes } from "shared/types";
import { dataUser } from "./handlers";

const initialState: UserReducerState = {
  user: {
    presence: {
      customStatus: "",
      state: PresenceState.UNKNOWN,
    },
  },
};

export const userReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: UserPayload }
): UserReducerState => {
  switch (type) {
    case ActionTypes.DATA_USER:
      return dataUser(state, payload.user);
    default:
      return state;
  }
};
