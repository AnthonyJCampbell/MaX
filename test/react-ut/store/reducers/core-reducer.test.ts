// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests for the coreReducer
 */
import "test/react-ut/components/require-mock";
import { coreReducer } from "reducers/core/reducer";
import { mockStoreState } from "shared/mocks/mock-states";
import each from "jest-each";
import { LoginState } from "protobuf-wispa/dist/core";
import { CoreReducerState } from "store/types";
import { ActionTypes } from "shared/types";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("Core Reducer - DATA_ACCOUNT", () => {
  each([
    [LoginState.LOGGED_OUT, LoginState.LOGGED_IN],
    [LoginState.LOGGED_IN, LoginState.LOGGED_OUT],
  ]).it(
    "overrides the existing loginState %s with a new loginState %s",
    (initialLoginState: LoginState, incomingLoginState: LoginState) => {
      const initialState: CoreReducerState = {
        ...mockStoreState.coreReducer,
        account: { loginState: initialLoginState, connectivityState: undefined },
      };

      const incomingDataAccount = {
        type: ActionTypes.DATA_ACCOUNT,
        payload: {
          account: { loginState: incomingLoginState, connectivityState: undefined },
        },
      };

      const expectedState: CoreReducerState = {
        ...mockStoreState.coreReducer,
        account: { loginState: incomingLoginState, connectivityState: undefined },
      };

      const newState = coreReducer(initialState, incomingDataAccount);
      expect(newState).toStrictEqual(expectedState);
    }
  );
});
