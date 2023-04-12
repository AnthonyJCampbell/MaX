// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import log from "src/renderer-logging";
import { MeetingsReducerState } from "store/types";
import { Meeting } from "src/types";
/**
 * NOTE: These handlers all simply overwrite the meetings state, as we can only have one meeting
 * at a time. dataMeeting and deletedMeeting will need updating if/when we support being in
 * multiple meetings at once.
 */

/**
 * Override meetings with incoming meetings object
 * Payload: @param {Object} meetings - An array of meeting objects
 */
export const dataMeetingList = (
  state: MeetingsReducerState,
  payloadMeetings: Meeting[]
): MeetingsReducerState => {
  if (payloadMeetings) {
    return { ...state, meetings: payloadMeetings };
  } else {
    log.debug("Tried to add meeting list but no meeting list supplied");
    return { ...state };
  }
};

/**
 * Handler for a single meeting (override)
 * @param state - The Redux state
 * @param payload - The action payload
 */
export const dataMeeting = (
  state: MeetingsReducerState,
  payloadMeeting: Meeting
): MeetingsReducerState => {
  if (payloadMeeting) {
    return { ...state, meetings: [payloadMeeting] };
  } else {
    log.debug("Tried to add a meeting but no meeting supplied");
    return { ...state };
  }
};

/**
 * Handler for a single meeting deleted (override)
 * @param state - The Redux state
 * @param payload - The action payload
 */
export const deletedMeeting = (
  state: MeetingsReducerState,
  payloadMeeting: Meeting
): MeetingsReducerState => {
  if (!payloadMeeting) {
    log.debug("Tried to delete a meeting but no meeting supplied, clearing meetings anyway");
  }
  return { ...state, meetings: [] };
};
