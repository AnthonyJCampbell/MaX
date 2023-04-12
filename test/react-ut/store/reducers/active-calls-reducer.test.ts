// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests for the activeCallsReducer
 */
import "test/react-ut/components/require-mock";
import { gandalfCall, bilboCall } from "shared/mocks/mock-active-calls";
import { activeCallsReducer } from "reducers/active-calls/reducer";
import { maximalState, mockStoreState } from "shared/mocks/mock-states";
import { WindowTypes } from "src/shared/types";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { CallStatus } from "shared/types";
import { ActionTypes } from "shared/types";
import { StoreState } from "store/types";
import log from "src/renderer-logging";

let identifiers: { type: WindowTypes };

const activeCallList = [gandalfCall, bilboCall];

let maximalStateClone: StoreState;

jest.mock("src/renderer-logging");

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
  maximalStateClone = mutableCloneDeep(maximalState);
});

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("Active Calls Reducer (Main Window) - DATA_ACTIVE_CALL_LIST", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("will add to activeCalls", () => {
    const initialState = { ...mockStoreState.activeCallsReducer, identifiers };
    const overrideActiveCalls = {
      type: ActionTypes.DATA_ACTIVE_CALL_LIST,
      payload: {
        activeCalls: activeCallList,
      },
    };
    const expectedState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: activeCallList,
      identifiers,
    };

    const newState = activeCallsReducer(initialState, overrideActiveCalls);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Can handle receiving an empty activeCalls list", () => {
    const initialState = { ...mockStoreState.activeCallsReducer, identifiers };
    const emptyActiveCallsList = {
      type: ActionTypes.DATA_ACTIVE_CALL_LIST,
      payload: {
        activeCalls: [],
      },
    };
    const expectedState = { ...mockStoreState.activeCallsReducer, identifiers };
    const newState = activeCallsReducer(initialState, emptyActiveCallsList);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Will override an existing activeCallsList", () => {
    const initialState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: [gandalfCall],
      identifiers,
    };
    const overrideExistingActiveCallsList = {
      type: ActionTypes.DATA_ACTIVE_CALL_LIST,
      payload: {
        activeCalls: activeCallList,
      },
    };
    const expectedState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: activeCallList,
      identifiers,
    };

    const newState = activeCallsReducer(initialState, overrideExistingActiveCallsList);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const initialState = {
      ...mockStoreState.activeCallsReducer,
      ...maximalStateClone.activeCallsReducer,
      identifiers,
    };
    const overrideActiveCalls = {
      type: ActionTypes.DATA_ACTIVE_CALL_LIST,
      payload: {
        activeCalls: activeCallList,
      },
    };
    const expectedState = {
      ...mockStoreState.activeCallsReducer,
      ...maximalStateClone.activeCallsReducer,
      activeCalls: activeCallList,
      identifiers,
    };

    const newState = activeCallsReducer(initialState, overrideActiveCalls);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Active Calls Reducer (Main Window) - DATA_ACTIVE_CALL", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Adds a call to activeCalls", () => {
    const initialState = { ...mockStoreState.activeCallsReducer, identifiers };
    const addToActiveCalls = {
      type: ActionTypes.DATA_ACTIVE_CALL,
      payload: {
        activeCall: bilboCall,
      },
    };

    const expectedState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: [bilboCall],
      identifiers,
    };

    const newState = activeCallsReducer(initialState, addToActiveCalls);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Updates an existing call in activeCalls", () => {
    const holdBilboCall = mutableCloneDeep(bilboCall);
    holdBilboCall.status = CallStatus.HOLD;
    const initialState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: [bilboCall],
      identifiers,
    };
    const updateActiveCall = {
      type: ActionTypes.DATA_ACTIVE_CALL,
      payload: {
        activeCall: holdBilboCall,
      },
    };

    const expectedState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: [holdBilboCall],
      identifiers,
    };

    const newState = activeCallsReducer(initialState, updateActiveCall);

    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const holdBilboCall = mutableCloneDeep(bilboCall);
    holdBilboCall.status = CallStatus.HOLD;
    const initialState = {
      ...mockStoreState.activeCallsReducer,
      ...maximalStateClone.activeCallsReducer,
      identifiers,
    };
    const addToActiveCalls = {
      type: ActionTypes.DATA_ACTIVE_CALL,
      payload: {
        activeCall: holdBilboCall,
      },
    };
    const expectedState = {
      ...maximalStateClone.activeCallsReducer,
      activeCalls: [holdBilboCall, gandalfCall],
      identifiers,
    };

    const newState = activeCallsReducer(initialState, addToActiveCalls);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Active Calls Reducer (Main Window) - DELETED_ACTIVE_CALL", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Deletes a call based on uid", () => {
    const initialState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: [gandalfCall],
      identifiers,
    };
    const deleteCall = {
      type: ActionTypes.DELETED_ACTIVE_CALL,
      payload: {
        activeCall: gandalfCall,
      },
    };

    const expectedState = { ...mockStoreState.activeCallsReducer, identifiers };

    const newState = activeCallsReducer(initialState, deleteCall);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Returns the unmutated activeCalls array when passed an uid that doesn't correspond to a call", () => {
    const initialState = {
      ...mockStoreState.activeCallsReducer,
      activeCalls: [gandalfCall],
      identifiers,
    };
    const deleteCall = {
      type: ActionTypes.DELETED_ACTIVE_CALL,
      payload: {
        activeCall: {
          uid: "123456",
          remoteParty: "",
          status: CallStatus.UNRECOGNIZED,
          microphoneIsMuted: false,
        },
      },
    };

    const newState = activeCallsReducer(initialState, deleteCall);
    expect(newState).toStrictEqual(initialState);
  });

  it("Returns the unmutated activeCalls array when activeCalls is empty", () => {
    const initialState = { ...mockStoreState.activeCallsReducer, identifiers };
    const deleteCall = {
      type: ActionTypes.DELETED_ACTIVE_CALL,
      payload: {
        activeCall: {
          uid: "123456",
          remoteParty: "",
          status: CallStatus.UNRECOGNIZED,
          microphoneIsMuted: false,
        },
      },
    };

    const newState = activeCallsReducer(initialState, deleteCall);
    expect(newState).toStrictEqual(initialState);
  });

  it("Handles maximal state", () => {
    const initialState = {
      ...mockStoreState.activeCallsReducer,
      ...maximalStateClone.activeCallsReducer,
      identifiers,
    };
    const deleteCall = {
      type: ActionTypes.DELETED_ACTIVE_CALL,
      payload: {
        activeCall: {
          uid: gandalfCall.uid,
          remoteParty: "",
          status: CallStatus.UNRECOGNIZED,
          microphoneIsMuted: false,
        },
      },
    };
    const expectedState = {
      ...mockStoreState.activeCallsReducer,
      ...maximalStateClone.activeCallsReducer,
      activeCalls: [bilboCall],
      identifiers,
    };

    const newState = activeCallsReducer(initialState, deleteCall);
    expect(newState).toStrictEqual(expectedState);
  });
});
