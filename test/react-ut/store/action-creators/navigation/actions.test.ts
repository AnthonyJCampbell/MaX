// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * UTs for Redux actions
 */

import each from "jest-each";
import "test/react-ut/components/require-mock";
import { setSelectedContact, setActiveMidPane } from "store/action-creators/navigation/actions";
import { ActionTypes } from "shared/types";

import * as testContacts from "shared/mocks/mock-contacts";

import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("Set selected contact", () => {
  it("generates the right action with a simple name", () => {
    const mockDispatch = jest.fn();
    const contact = {
      uid: "",
      phone: [],
      postal: [],
      email: [],
      isFavourite: false,
      notifyWhenAvailable: false,
      isTyping: false,
    };
    mockDispatch(setSelectedContact(contact));

    expect(mockDispatch.mock.calls[0][0].type).toBe(ActionTypes.SET_SELECTED_CONTACT);
    expect(mockDispatch.mock.calls[0][0].payload).toStrictEqual({ selectedContact: contact });
  });

  it("generates the right action with a realistic contact", () => {
    const mockDispatch = jest.fn();
    const contact = mutableCloneDeep(testContacts.gandalf);
    mockDispatch(setSelectedContact(contact));

    expect(mockDispatch.mock.calls[0][0].type).toBe(ActionTypes.SET_SELECTED_CONTACT);
    expect(mockDispatch.mock.calls[0][0].payload).toStrictEqual({
      selectedContact: testContacts.gandalf,
    });
  });
});

// There is an action to set the selected contact of the main window via Node
// but this is tested at FV level

describe("Set active mid pane", () => {
  each(["contacts", "chat", "meetings", "calls"]).it("dispatches %s action", (pane) => {
    const mockDispatch = jest.fn();
    mockDispatch(setActiveMidPane(pane));

    expect(mockDispatch.mock.calls[0][0].type).toBe(ActionTypes.SET_ACTIVE_MID_PANE);
    expect(mockDispatch.mock.calls[0][0].payload).toStrictEqual({ activeMidPane: pane });
  });

  it("Does not dispatch an invalid action payload", () => {
    expect(setActiveMidPane("INVALID_PAYLOAD")).toBeUndefined();
  });
});
// There is an action to update the pane-control state, but this is too simple logic to test at
// UT level given the cost to mock ipc messages

// There is an action to show the main window, but this is too simple logic to test at
// UT level

// There is actions to show/hide the confirmDeletePopUp, but this is too simple logic to test at
// UT level
