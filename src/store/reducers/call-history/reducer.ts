// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls the historic calls state
 */

import { ActionTypes } from "shared/types";
import * as handlers from "./handlers";
import { CallHistoryReducerState, CallHistoryPayload } from "store/types";

const initialState: CallHistoryReducerState = {
  historicCalls: [],
};
// TODO: Change PAYLOAD and OBJ
export const callHistoryReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: CallHistoryPayload }
): CallHistoryReducerState => {
  switch (type) {
    // Received historic call list from Java back-end
    // Override the historicCalls list completely
    case ActionTypes.DATA_HISTORIC_CALL_LIST:
      if (payload.historicCalls !== undefined)
        return handlers.dataHistoricCallList(state, payload.historicCalls);
      return state;

    // Received active call from Java back-end
    // Add a single activeCall to activeCalls or update it if it already exists
    case ActionTypes.DATA_HISTORIC_CALL:
      if (payload.historicCall !== undefined)
        return handlers.dataHistoricCall(state, payload.historicCall);
      return state;

    // Received active call deleted from Java back-end
    // Remove a given activeCall from activeCalls
    case ActionTypes.DELETED_HISTORIC_CALL:
      if (payload.historicCall !== undefined)
        return handlers.deletedHistoricCall(state, payload.historicCall);
      return state;

    default:
      return state;
  }
};
