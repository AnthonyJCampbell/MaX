// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests for the voicemailsReducer
 */
import "test/react-ut/components/require-mock";
import { voicemailsReducer } from "reducers/voicemails/reducer";
import { maximalState } from "shared/mocks/mock-states";
import each from "jest-each";
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

describe("Voicemails Reducer - DATA_VOICEMAIL_COUNT", () => {
  each([
    [0, 5],
    [0, 0],
    [3, 12],
  ]).it(
    "will override the existing voicemail count (%s) with %s",
    (initialCount, incomingCount) => {
      const initialState = {
        voicemailFaxCount: { newMessages: initialCount },
      };

      const overrideVoicemailsAction = {
        type: ActionTypes.DATA_VOICEMAIL_COUNT,
        payload: {
          voicemailFaxCount: { newMessages: incomingCount },
        },
      };
      const expectedState = {
        voicemailFaxCount: { newMessages: incomingCount },
      };

      const newState = voicemailsReducer(initialState, overrideVoicemailsAction);
      expect(newState).toStrictEqual(expectedState);
    }
  );

  it("Handles maximal state", () => {
    const initialState = { ...maximalStateClone.voicemailsReducer };
    const overrideVoicemailsAction = {
      type: ActionTypes.DATA_VOICEMAIL_COUNT,
      payload: {
        voicemailFaxCount: { newMessages: 2 },
      },
    };
    const expectedState = {
      ...maximalStateClone.voicemailsReducer,
      voicemailFaxCount: { newMessages: 2 },
    };

    const newState = voicemailsReducer(initialState, overrideVoicemailsAction);
    expect(newState).toStrictEqual(expectedState);
  });
});
