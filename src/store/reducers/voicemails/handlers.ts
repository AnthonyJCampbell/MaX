// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { VoicemailFaxCount } from "src/types";
import log from "src/renderer-logging";
import { VoicemailsReducerState } from "store/types";

/**
 * Handler for voicemails data.
 * @param state - The Redux state
 * @param voicemailFaxCount - The action payload voicemailFaxCount
 */
export const dataVoicemailCount = (
  state: VoicemailsReducerState,
  voicemailFaxCount: VoicemailFaxCount
): VoicemailsReducerState => {
  if (voicemailFaxCount) {
    // voicemailFaxCount is a single piece of data, just store the new value -
    // no need to try to combine something complex.
    return { ...state, voicemailFaxCount };
  } else {
    log.debug("Tried to update voicemail/fax count but no new count supplied");
    return state;
  }
};
