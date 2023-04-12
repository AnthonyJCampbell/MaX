// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests for the callHistoryReducer
 */
import "test/react-ut/components/require-mock";
import { callHistoryReducer } from "reducers/call-history/reducer";
import {
  missedHistoricCall,
  inboundHistoricCall,
  outboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import { maximalState, mockStoreState } from "shared/mocks/mock-states";
import { CallType, WindowTypes } from "src/shared/types";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { ActionTypes } from "shared/types";
import { StoreState } from "store/types";
import log from "src/renderer-logging";

let identifiers: { type: WindowTypes };
let metadata: { remoteParty: string; uid: string };
let maximalStateClone: StoreState;

jest.mock("src/renderer-logging");

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
  maximalStateClone = mutableCloneDeep(maximalState);
});

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("Call History Reducer (Main Window) - DATA_HISTORIC_CALL_LIST", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Will add to historic calls", () => {
    const initialState = { ...mockStoreState.callHistoryReducer, identifiers };
    const overrideHistoricCallsAction = {
      type: ActionTypes.DATA_HISTORIC_CALL_LIST,
      payload: {
        historicCalls: [inboundHistoricCall, outboundHistoricCall, missedHistoricCall],
      },
    };
    const expectedState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [inboundHistoricCall, outboundHistoricCall, missedHistoricCall],
      identifiers,
    };

    const newState = callHistoryReducer(initialState, overrideHistoricCallsAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Can handle receiving an empty historic call list", () => {
    const initialState = { ...mockStoreState.callHistoryReducer, identifiers };
    const emptyHistoricCallListAction = {
      type: ActionTypes.DATA_HISTORIC_CALL_LIST,
      payload: {
        historicCalls: [],
      },
    };
    const expectedState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [],
      identifiers,
    };
    const newState = callHistoryReducer(initialState, emptyHistoricCallListAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Will override an existing historic call list", () => {
    const initialState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [inboundHistoricCall],
      identifiers,
    };
    const overrideExistingHistoricCallListAction = {
      type: ActionTypes.DATA_HISTORIC_CALL_LIST,
      payload: {
        historicCalls: [outboundHistoricCall, missedHistoricCall],
      },
    };
    const expectedState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [outboundHistoricCall, missedHistoricCall],
      identifiers,
    };

    const newState = callHistoryReducer(initialState, overrideExistingHistoricCallListAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const initialState = { ...maximalStateClone.callHistoryReducer, identifiers };
    const overrideHistoricCallListAction = {
      type: ActionTypes.DATA_HISTORIC_CALL_LIST,
      payload: {
        historicCalls: [inboundHistoricCall, outboundHistoricCall, missedHistoricCall],
      },
    };
    const expectedState = {
      ...maximalStateClone.callHistoryReducer,
      historicCalls: [inboundHistoricCall, outboundHistoricCall, missedHistoricCall],
      identifiers,
    };

    const newState = callHistoryReducer(initialState, overrideHistoricCallListAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Call History Reducer (Main Window) - DATA_HISTORIC_CALL", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Adds a historicCall to historicCalls", () => {
    const initialState = {
      ...mockStoreState.callHistoryReducer,
      identifiers,
    };
    const addToHistoricCallsAction = {
      type: ActionTypes.DATA_HISTORIC_CALL,
      payload: {
        historicCall: inboundHistoricCall,
      },
    };

    const expectedState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [inboundHistoricCall],
      identifiers,
    };

    const newState = callHistoryReducer(initialState, addToHistoricCallsAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Overwrites an existing historicCall in historicCalls", () => {
    const missedHistoricCallSeen = mutableCloneDeep(missedHistoricCall);
    missedHistoricCallSeen.attention = false;
    const initialState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [missedHistoricCall],
      identifiers,
    };
    const updateHistoricCallAction = {
      type: ActionTypes.DATA_HISTORIC_CALL,
      payload: {
        historicCall: missedHistoricCallSeen,
      },
    };

    const expectedState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [missedHistoricCallSeen],
      identifiers,
    };

    const newState = callHistoryReducer(initialState, updateHistoricCallAction);

    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const missedHistoricCallSeen = mutableCloneDeep(missedHistoricCall);
    missedHistoricCallSeen.attention = false;
    const initialState = { ...maximalStateClone.callHistoryReducer, identifiers, metadata };
    const addToHistoricCallsAction = {
      type: ActionTypes.DATA_HISTORIC_CALL,
      payload: {
        historicCall: missedHistoricCallSeen,
      },
    };
    const expectedState = {
      ...maximalStateClone.callHistoryReducer,
      historicCalls: [missedHistoricCallSeen, inboundHistoricCall, outboundHistoricCall],
      identifiers,
      metadata,
    };

    const newState = callHistoryReducer(initialState, addToHistoricCallsAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Call History Reducer (Main Window) - DELETED_HISTORIC_CALL", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Deletes a historicCall", () => {
    const initialState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [missedHistoricCall, inboundHistoricCall],
      identifiers,
    };
    const deleteHistoricCallAction = {
      type: ActionTypes.DELETED_HISTORIC_CALL,
      payload: {
        historicCall: missedHistoricCall,
      },
    };

    const expectedState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [inboundHistoricCall],
      identifiers,
    };

    const newState = callHistoryReducer(initialState, deleteHistoricCallAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles maximal state", () => {
    const initialState = { ...maximalStateClone.callHistoryReducer, identifiers };
    const deleteHistoricCallAction = {
      type: ActionTypes.DELETED_HISTORIC_CALL,
      payload: {
        historicCall: {
          uid: "fvjnksfe",
          remoteParty: "",
          datetimeStarted: "",
          duration: 0,
          type: CallType.UNRECOGNIZED,
          attention: false,
          displayName: "",
        },
      },
    };
    const expectedState = {
      ...maximalStateClone.callHistoryReducer,
      historicCalls: [
        ...maximalStateClone.callHistoryReducer.historicCalls.filter(
          (call) => call.uid !== "fvjnksfe"
        ),
      ],
      identifiers,
    };

    const newState = callHistoryReducer(initialState, deleteHistoricCallAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Call History reducer (Incoming Call Window)", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.incomingCall };
  });

  it("State is never changed in the incoming call window", () => {
    const initialState = {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [],
      identifiers,
    };
    const deletedHistoricCallAction = {
      type: ActionTypes.DELETED_HISTORIC_CALL,
      payload: {
        historicCall: {
          uid: "frbfwod",
          remoteParty: "",
          datetimeStarted: "",
          duration: 0,
          type: CallType.UNRECOGNIZED,
          attention: false,
          displayName: "",
        },
      },
    };

    const newState = callHistoryReducer(initialState, deletedHistoricCallAction);
    expect(newState).toEqual(initialState);
  });
});
