// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests for the meetingReducer
 */
import "test/react-ut/components/require-mock";
import { meetingReducer } from "reducers/meetings/reducer";
import { maximalState, mockStoreState } from "shared/mocks/mock-states";
import { ActionTypes } from "shared/types";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { StoreState } from "store/types";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");

let maximalStateClone: StoreState;

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
  maximalStateClone = mutableCloneDeep(maximalState);
});

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("Meeting Reducer - DATA_MEETING_LIST", () => {
  it("will add to meetings", () => {
    const initialState = { ...mockStoreState.meetingReducer, meetings: [] };
    const overrideMeetingsAction = {
      type: ActionTypes.DATA_MEETING_LIST,
      payload: {
        meetings: [{ uid: "0123456789", remoteParty: [], upliftCall: "" }],
      },
    };
    const expectedState = {
      ...mockStoreState.meetingReducer,
      meetings: [{ uid: "0123456789", remoteParty: [], upliftCall: "" }],
    };

    const newState = meetingReducer(initialState, overrideMeetingsAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Can handle receiving an empty meeting list", () => {
    const initialState = { ...mockStoreState.meetingReducer, meetings: [] };
    const emptyMeetingListAction = {
      type: ActionTypes.DATA_MEETING_LIST,
      payload: {
        meetings: [],
      },
    };
    const expectedState = { ...mockStoreState.meetingReducer, meetings: [] };
    const newState = meetingReducer(initialState, emptyMeetingListAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Will override an existing meeting list", () => {
    const initialState = {
      ...mockStoreState.meetingReducer,
      meetings: [{ uid: "0123456789", remoteParty: [], upliftCall: "" }],
    };
    const overrideExistingMeetingListAction = {
      type: ActionTypes.DATA_MEETING_LIST,
      payload: {
        meetings: [{ uid: "9876543210", remoteParty: [], upliftCall: "" }],
      },
    };
    const expectedState = {
      ...mockStoreState.meetingReducer,
      meetings: [{ uid: "9876543210", remoteParty: [], upliftCall: "" }],
    };

    const newState = meetingReducer(initialState, overrideExistingMeetingListAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const initialState = { ...mockStoreState.meetingReducer, ...maximalStateClone.meetingReducer };
    const overrideMeetingsAction = {
      type: ActionTypes.DATA_MEETING_LIST,
      payload: {
        meetings: [{ uid: "0123456789", remoteParty: [], upliftCall: "" }],
      },
    };
    const expectedState = {
      ...mockStoreState.meetingReducer,
      ...maximalStateClone.meetingReducer,
      meetings: [{ uid: "0123456789", remoteParty: [], upliftCall: "" }],
    };

    const newState = meetingReducer(initialState, overrideMeetingsAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Meeting Reducer - DATA_MEETING", () => {
  it("Adds a meeting to meetings", () => {
    const initialState = { ...mockStoreState.meetingReducer, meetings: [] };
    const addToMeetingsAction = {
      type: ActionTypes.DATA_MEETING,
      payload: {
        meeting: { uid: "0293847561", remoteParty: [], upliftCall: "" },
      },
    };

    const expectedState = {
      ...mockStoreState.meetingReducer,
      meetings: [{ uid: "0293847561", remoteParty: [], upliftCall: "" }],
    };

    const newState = meetingReducer(initialState, addToMeetingsAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Overwrites an existing meeting in meetings", () => {
    const initialState = {
      ...mockStoreState.meetingReducer,
      meetings: [{ uid: "2314567790", remoteParty: [], upliftCall: "" }],
    };
    const updateMeetingAction = {
      type: ActionTypes.DATA_MEETING,
      payload: {
        meeting: { uid: "0011992256", remoteParty: [], upliftCall: "" },
      },
    };

    const expectedState = {
      ...mockStoreState.meetingReducer,
      meetings: [{ uid: "0011992256", remoteParty: [], upliftCall: "" }],
    };

    const newState = meetingReducer(initialState, updateMeetingAction);

    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const initialState = { ...mockStoreState.meetingReducer, ...maximalStateClone.meetingReducer };
    const addToMeetingsAction = {
      type: ActionTypes.DATA_MEETING,
      payload: {
        meeting: { uid: "0123456789", remoteParty: [], upliftCall: "" },
      },
    };
    const expectedState = {
      ...mockStoreState.meetingReducer,
      ...maximalStateClone.meetingReducer,
      meetings: [{ uid: "0123456789", remoteParty: [], upliftCall: "" }],
    };

    const newState = meetingReducer(initialState, addToMeetingsAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Meeting Reducer - DELETED_MEETING", () => {
  it("Deletes a meeting", () => {
    const initialState = {
      ...mockStoreState.meetingReducer,
      meetings: [{ uid: "0123456789", remoteParty: [], upliftCall: "" }],
    };
    const deleteMeetingAction = {
      type: ActionTypes.DELETED_MEETING,
      payload: {
        meeting: { uid: "0123456789", remoteParty: [], upliftCall: "" },
      },
    };

    const expectedState = { ...mockStoreState.meetingReducer, meetings: [] };

    const newState = meetingReducer(initialState, deleteMeetingAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const initialState = { ...mockStoreState.meetingReducer, ...maximalStateClone.meetingReducer };
    const deleteMeetingAction = {
      type: ActionTypes.DELETED_MEETING,
      payload: {
        meeting: { uid: "1029384756", remoteParty: [], upliftCall: "" },
      },
    };
    const expectedState = {
      ...mockStoreState.meetingReducer,
      ...maximalStateClone.meetingReducer,
      meetings: [],
    };

    const newState = meetingReducer(initialState, deleteMeetingAction);
    expect(newState).toStrictEqual(expectedState);
  });
});
