// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests that should pass for all reducers
 */
import each from "jest-each";
import "test/react-ut/components/require-mock";
import { contactReducer } from "reducers/contacts/reducer";
import { messagingReducer } from "reducers/messaging/reducer";
import { activeCallsReducer } from "reducers/active-calls/reducer";
import { meetingReducer } from "reducers/meetings/reducer";
import { callHistoryReducer } from "reducers/call-history/reducer";
import { voicemailsReducer } from "reducers/voicemails/reducer";
import { paneManagementReducer } from "reducers/pane-management/reducer";

import { maximalState } from "shared/mocks/mock-states";
import { StoreState } from "store/types";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

let maximalStateClone: StoreState;

jest.mock("src/renderer-logging");

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
  maximalStateClone = mutableCloneDeep(maximalState);
});

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("All reducers", () => {
  describe("Don't change state given an unknown action", () => {
    each([
      ["Calls reducer", activeCallsReducer],
      ["Contacts reducer", contactReducer],
      ["Messaging reducer", messagingReducer],
      ["Meeting reducer", meetingReducer],
      ["Call History reducer", callHistoryReducer],
      ["Voicemails reducer", voicemailsReducer],
      ["Pane Management reducer", paneManagementReducer],
    ]).it("%s", (_testName, reducer) => {
      const initialState = maximalStateClone;
      const dummyAction = {
        type: "NON_EXISTENT_ACTION",
      };
      const newState = reducer(initialState, dummyAction);
      expect(newState).toStrictEqual(initialState);
    });
  });
});
