// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests for the contactReducer
 */

import "test/react-ut/components/require-mock";
import { contactReducer } from "reducers/contacts/reducer";
import { bilbo, peter, gandalf, initialSelected } from "shared/mocks/mock-contacts";
import { maximalState, mockStoreState } from "shared/mocks/mock-states";
import { WindowTypes } from "src/shared/types";
import { ActionTypes } from "shared/types";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { StoreState } from "store/types";
import log from "src/renderer-logging";
const gandalfClone = mutableCloneDeep(gandalf);
const peterClone = mutableCloneDeep(peter);
const bilboClone = mutableCloneDeep(bilbo);
const initialSelectedClone = mutableCloneDeep(initialSelected);
const testContactList = [peterClone, gandalfClone, bilboClone];

let identifiers: { type: WindowTypes };
let maximalStateClone: StoreState;

jest.mock("src/renderer-logging");

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
  maximalStateClone = mutableCloneDeep(maximalState);
});

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("Contact Reducer (Main Window) - SET_SELECTED_CONTACT", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Adds a new selected contact", () => {
    const initialState = { ...mockStoreState.contactReducer, identifiers };
    const setSelectedContactAction = {
      type: ActionTypes.SET_SELECTED_CONTACT,
      payload: {
        selectedContact: bilboClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      selectedContact: bilboClone,
      contacts: [],
      identifiers,
    };

    const newState = contactReducer(initialState, setSelectedContactAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Updates the existing selected contact", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      selectedContact: gandalfClone,
      contacts: testContactList,
      identifiers,
    };
    const setSelectedContactAction = {
      type: ActionTypes.SET_SELECTED_CONTACT,
      payload: {
        selectedContact: bilboClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      selectedContact: bilboClone,
      contacts: testContactList,
      identifiers,
    };

    const newState = contactReducer(initialState, setSelectedContactAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles the new selected contact being the same as initial selected contact", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      selectedContact: gandalfClone,
      contacts: testContactList,
      identifiers,
    };
    const setSelectedContactAction = {
      type: ActionTypes.SET_SELECTED_CONTACT,
      payload: {
        selectedContact: gandalfClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      selectedContact: gandalfClone,
      contacts: testContactList,
      identifiers,
    };

    const newState = contactReducer(initialState, setSelectedContactAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Contact Reducer (Main Window) - DATA_CONTACT_LIST", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Adds a new contact list", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      selectedContact: initialSelectedClone,
      identifiers,
    };
    const dataContactListAction = {
      type: ActionTypes.DATA_CONTACT_LIST,
      payload: {
        contacts: testContactList,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      contacts: testContactList,
      selectedContact: initialSelectedClone,
      identifiers,
    };

    const newState = contactReducer(initialState, dataContactListAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Updates the existing contact list", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      contacts: [gandalfClone],
      selectedContact: gandalfClone,
      identifiers,
    };
    const dataContactListAction = {
      type: ActionTypes.DATA_CONTACT_LIST,
      payload: {
        contacts: testContactList,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      contacts: testContactList,
      selectedContact: gandalfClone,
      identifiers,
    };

    const newState = contactReducer(initialState, dataContactListAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles the new contact list being the same as the current contact list", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      contacts: testContactList,
      selectedContact: gandalfClone,
      identifiers,
    };
    const dataContactListAction = {
      type: ActionTypes.DATA_CONTACT_LIST,
      payload: {
        contacts: testContactList,
      },
    };

    const newState = contactReducer(initialState, dataContactListAction);
    expect(newState).toStrictEqual(initialState);
  });

  it("Handles maximal state", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      ...maximalStateClone.contactReducer,
      identifiers,
    };
    const dataContactListAction = {
      type: ActionTypes.DATA_CONTACT_LIST,
      payload: {
        contacts: testContactList,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      ...maximalStateClone.contactReducer,
      contacts: testContactList,
      identifiers,
    };

    const newState = contactReducer(initialState, dataContactListAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Contact Reducer (Main Window) - DATA_CONTACT", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Adds a new contact", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      selectedContact: initialSelectedClone,
      identifiers,
    };
    const dataContactAction = {
      type: ActionTypes.DATA_CONTACT,
      payload: {
        contact: peterClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      contacts: [peterClone],
      selectedContact: initialSelectedClone,
      identifiers,
    };

    const newState = contactReducer(initialState, dataContactAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Updates the existing contact list", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      contacts: testContactList,
      selectedContact: gandalfClone,
      identifiers,
    };
    const dataContactAction = {
      type: ActionTypes.DATA_CONTACT,
      payload: {
        contact: initialSelectedClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      contacts: [...testContactList, initialSelectedClone],
      selectedContact: gandalfClone,
      identifiers,
    };

    const newState = contactReducer(initialState, dataContactAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles the new contact already being on the contact list", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      contacts: testContactList,
      selectedContact: gandalfClone,
      identifiers,
    };
    const dataContactAction = {
      type: ActionTypes.DATA_CONTACT,
      payload: {
        contact: peterClone,
      },
    };

    const newState = contactReducer(initialState, dataContactAction);
    expect(newState).toStrictEqual(initialState);
  });

  it("Handles maximal state", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      ...maximalStateClone.contactReducer,
      identifiers,
    };
    const dataContactAction = {
      type: ActionTypes.DATA_CONTACT,
      payload: {
        contact: initialSelectedClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      ...maximalStateClone.contactReducer,
      contacts: [...maximalStateClone.contactReducer.contacts, initialSelectedClone],
      identifiers,
    };

    const newState = contactReducer(initialState, dataContactAction);
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Contact Reducer (Main Window) - DELETED_CONTACT", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });

  it("Does nothing with no state", () => {
    const initialState = { ...mockStoreState.contactReducer, identifiers };
    // Real action payload is a contact containing only a UID, test should use the same
    const deletedContactAction = {
      type: ActionTypes.DELETED_CONTACT,
      payload: {
        contact: {
          uid: gandalfClone.uid,
          phone: [],
          postal: [],
          email: [],
          isFavourite: false,
          notifyWhenAvailable: false,
          isTyping: false,
        },
      },
    };

    const newState = contactReducer(initialState, deletedContactAction);
    expect(newState).toStrictEqual(initialState);
  });

  it("Updates the existing contact list", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      contacts: testContactList,
      selectedContact: bilboClone,
      identifiers,
    };
    const deletedContactAction = {
      type: ActionTypes.DELETED_CONTACT,
      payload: {
        contact: bilboClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      contacts: [peterClone, gandalfClone],
      selectedContact: initialSelectedClone,
      identifiers,
    };

    const newState = contactReducer(initialState, deletedContactAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Handles the contact already being deleted", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      contacts: [peterClone, gandalfClone],
      selectedContact: gandalfClone,
      identifiers,
    };
    const deletedContactAction = {
      type: ActionTypes.DELETED_CONTACT,
      payload: {
        contact: bilboClone,
      },
    };

    const newState = contactReducer(initialState, deletedContactAction);
    expect(newState).toStrictEqual(initialState);
  });

  it("Handles maximal state", () => {
    const initialState = {
      ...mockStoreState.contactReducer,
      ...maximalStateClone.contactReducer,
      identifiers,
    };
    const deletedContactAction = {
      type: ActionTypes.DELETED_CONTACT,
      payload: {
        contact: gandalfClone,
      },
    };
    const expectedState = {
      ...mockStoreState.contactReducer,
      ...maximalStateClone.contactReducer,
      contacts: testContactList,
      identifiers,
    };

    const newState = contactReducer(initialState, deletedContactAction);
    // expect to not contain gandalf
    expect(newState).not.toStrictEqual(expectedState);
  });
});
