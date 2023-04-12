// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls the voicemail state
 */

import { dataVoicemailCount } from "./handlers";
import { ActionTypes } from "shared/types";
import { VoicemailsReducerState, VoicemailsPayload } from "store/types";

const initialState = {
  voicemailFaxCount: { newMessages: 0 },
};

export const voicemailsReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: VoicemailsPayload }
): VoicemailsReducerState => {
  switch (type) {
    // Received a voicemail count update from the Java back-end
    // Update the count
    case ActionTypes.DATA_VOICEMAIL_COUNT:
      if (payload.voicemailFaxCount) return dataVoicemailCount(state, payload.voicemailFaxCount);
      return state;
    default:
      return state;
  }
};
