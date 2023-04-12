// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import log from "src/renderer-logging";
import { CorePayload, CoreReducerState } from "store/types";

/**
 * Update account with data from the incoming Account object
 * Payload: @param {CorePayload} payload - contains the new account data
 */
export const dataAccount = (state: CoreReducerState, payload: CorePayload): CoreReducerState => {
  if (payload.account) {
    return { ...state, ...payload };
  } else {
    log.error("Tried to update account data but no new data supplied");
    return state;
  }
};
