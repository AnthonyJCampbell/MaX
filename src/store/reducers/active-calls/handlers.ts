// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { ActiveCall } from "src/types";
import { ActiveCallsReducerState } from "store/types";

/**
 * Override activeCalls with incoming activeCalls object
 * Payload: @param {Object} payloadActiveCalls - An array of activeCall objects
 */
export const dataActiveCallList = (
  state: ActiveCallsReducerState,
  activeCalls: ActiveCall[]
): ActiveCallsReducerState => {
  return { ...state, activeCalls };
};

/**
 * Update or add incoming activeCall object to activeCalls
 * If in the active call list, it'll update the call.
 * If not in activeCalls, it'll push it to activeCalls
 * Payload: @param {Object} payloadActiveCall - An activeCall object containing uid, remoteParty,
 * datetimeStarted, and status
 */
export const dataActiveCall = (
  state: ActiveCallsReducerState,
  payloadActiveCall: ActiveCall
): ActiveCallsReducerState => {
  let activeCalls;
  const inActiveCallList =
    state.activeCalls.filter((call) => call.remoteParty === payloadActiveCall.remoteParty).length >=
    1;

  if (inActiveCallList) {
    activeCalls = state.activeCalls.map((activeCall) =>
      // Find the activeCall with that remoteParty and replace it or return the activeCall
      activeCall.remoteParty === payloadActiveCall.remoteParty ? payloadActiveCall : activeCall
    );
  } else {
    activeCalls = [...state.activeCalls, payloadActiveCall];
  }

  return { ...state, activeCalls };
};

/**
 * Delete activeCall in activeCalls based on uid
 * Payload: @param {Object} payloadActiveCall - An object containing a uid field
 */
export const deletedActiveCall = (
  state: ActiveCallsReducerState,
  payloadActiveCall: ActiveCall
): ActiveCallsReducerState => {
  const activeCalls = state.activeCalls.filter((call) => call.uid !== payloadActiveCall.uid);

  return { ...state, activeCalls };
};
