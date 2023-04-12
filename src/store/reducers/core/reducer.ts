// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls the core app states.
 */

import { CorePayload, CoreReducerState } from "store/types";
import { ActionTypes } from "shared/types";
import { LoginState } from "src/types";
import { dataAccount } from "./handlers";

const initialState: CoreReducerState = {
  account: { loginState: LoginState.LOGGED_OUT, connectivityState: undefined },
};

export const coreReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: CorePayload }
): CoreReducerState => {
  switch (type) {
    // Received an account update from the Java back-end
    case ActionTypes.DATA_ACCOUNT:
      return dataAccount(state, payload);
    default:
      return state;
  }
};
