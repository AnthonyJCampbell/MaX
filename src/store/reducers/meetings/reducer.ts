// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls the current meeting state
 */

import { ActionTypes } from "shared/types";
import * as handlers from "./handlers";
import { MeetingsReducerState, MeetingsPayload } from "store/types";

const initialState: MeetingsReducerState = {
  meetings: [],
};
// TODO: Change PAYLOAD AND OBJ
export const meetingReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: MeetingsPayload }
): MeetingsReducerState => {
  switch (type) {
    // Received meeting list from Java back-end
    // Override the meeting list completely
    case ActionTypes.DATA_MEETING_LIST:
      if (payload.meetings !== undefined) return handlers.dataMeetingList(state, payload.meetings);
      return state;
    // Received meeting from Java back-end
    // Add a single meeting to meetings or update it if it already exists (see note in handlers)
    case ActionTypes.DATA_MEETING:
      if (payload.meeting !== undefined) return handlers.dataMeeting(state, payload.meeting);
      return state;

    // Received meeting deleted from Java back-end
    // Remove a given meeting from meetings (see note in handlers)
    case ActionTypes.DELETED_MEETING:
      if (payload.meeting !== undefined) return handlers.deletedMeeting(state, payload.meeting);
      return state;

    default:
      return state;
  }
};
