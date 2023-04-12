// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls the current calls state
 */

import { ActionTypes } from "shared/types";
import * as handlers from "./handlers";
import { ActiveCallsReducerState, ActiveCallsPayload } from "store/types";

const initialState: ActiveCallsReducerState = {
  activeCalls: [],
};
// TODO: Change PAYLOAD and OBJ
export const activeCallsReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: ActiveCallsPayload }
): ActiveCallsReducerState => {
  switch (type) {
    // Received active call list from Java back-end
    // Override the activeCalls list completely
    case ActionTypes.DATA_ACTIVE_CALL_LIST:
      if (payload.activeCalls !== undefined)
        return handlers.dataActiveCallList(state, payload.activeCalls);
      return state;

    // Received active call from Java back-end
    // Add a single activeCall to activeCalls or update it if it already exists
    case ActionTypes.DATA_ACTIVE_CALL:
      if (payload.activeCall !== undefined)
        return handlers.dataActiveCall(state, payload.activeCall);
      return state;

    // Received active call deleted from Java back-end
    // Remove a given activeCall from activeCalls
    case ActionTypes.DELETED_ACTIVE_CALL:
      if (payload.activeCall !== undefined)
        return handlers.deletedActiveCall(state, payload.activeCall);
      return state;

    default:
      return state;
  }
};
