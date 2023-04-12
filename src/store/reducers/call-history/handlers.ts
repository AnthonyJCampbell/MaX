// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { HistoricCall } from "src/types";
import { CallHistoryReducerState } from "store/types";

/**
 * Override historicCalls with incoming historicCalls object
 * Payload: @param {Object} payloadHistoricCalls - An array of historicCall objects
 */
export const dataHistoricCallList = (
  state: CallHistoryReducerState,
  payloadHistoricCalls: HistoricCall[]
): CallHistoryReducerState => {
  return { ...state, historicCalls: payloadHistoricCalls };
};

/**
 * Update or add incoming historicCall object to historicCalls
 * If in the historic call list, it'll update the call.
 * If not in historicCalls, it'll push it into historicCalls
 * Payload: @param {Object} payloadHistoricCall - An historicCall object containing uid, remoteParty,
 * datetimeStarted, duration, type and attention
 */
export const dataHistoricCall = (
  state: CallHistoryReducerState,
  payloadHistoricCall: HistoricCall
): CallHistoryReducerState => {
  let historicCalls;
  const inHistoricCallList =
    state.historicCalls.filter((call) => call.uid === payloadHistoricCall.uid).length >= 1;

  if (inHistoricCallList) {
    historicCalls = state.historicCalls.map((historicCall: HistoricCall) =>
      // Find the historicCall with that remoteParty and replace it or return the historicCall
      historicCall.uid === payloadHistoricCall.uid ? payloadHistoricCall : historicCall
    );
  } else {
    historicCalls = [...state.historicCalls, payloadHistoricCall];
  }

  return { ...state, historicCalls };
};

/**
 * Delete historicCall in historicCalls based on uid
 * Payload: @param {Object} payloadHistoricCall - An object containing a uid field
 */
export const deletedHistoricCall = (
  state: CallHistoryReducerState,
  payloadHistoricCall: HistoricCall
): CallHistoryReducerState => {
  const historicCalls = state.historicCalls.filter((call) => call.uid !== payloadHistoricCall.uid);

  return { ...state, historicCalls };
};
