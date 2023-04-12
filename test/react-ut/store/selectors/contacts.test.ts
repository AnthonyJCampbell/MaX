// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// import "test/react-ut/components/require-mock";
import { selectAllContactsWithPhoneNumber, selectContactWithUid } from "store/selectors/contacts";
import { mockStoreState } from "shared/mocks/mock-states";

import { bilbo, peter } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("selectAllContactsWithPhoneNumber", () => {
  it("Selects 0 contacts", () => {
    const peterClone = mutableCloneDeep(peter);
    mockStoreState.contactReducer.contacts = [peterClone];
    const contactsFromPhoneNumber = selectAllContactsWithPhoneNumber(bilbo.phone[0])(
      mockStoreState
    );
    const contactsFromValue = selectAllContactsWithPhoneNumber(bilbo.phone[0].value)(
      mockStoreState
    );

    expect(contactsFromPhoneNumber).toStrictEqual([]);
    expect(contactsFromValue).toStrictEqual([]);
  });
  it("Selects 1 contacts", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    mockStoreState.contactReducer.contacts = [bilboClone];
    const contactsFromPhoneNumber = selectAllContactsWithPhoneNumber(bilboClone.phone[0])(
      mockStoreState
    );
    const contactsFromValue = selectAllContactsWithPhoneNumber(bilboClone.phone[0].value)(
      mockStoreState
    );

    expect(contactsFromPhoneNumber).toStrictEqual([bilboClone]);
    expect(contactsFromValue).toStrictEqual([bilboClone]);
  });
  it("Selects 2 contacts", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    const peterClone = mutableCloneDeep(peter);
    mockStoreState.contactReducer.contacts = [bilboClone, bilboClone, peterClone];
    const contactsFromPhoneNumber = selectAllContactsWithPhoneNumber(bilboClone.phone[0])(
      mockStoreState
    );
    const contactsFromValue = selectAllContactsWithPhoneNumber(bilboClone.phone[0].value)(
      mockStoreState
    );

    expect(contactsFromPhoneNumber).toStrictEqual([bilboClone, bilboClone]);
    expect(contactsFromValue).toStrictEqual([bilboClone, bilboClone]);
  });
});

describe("selectOneContactWithPhoneNumber", () => {
  // Too simple to test
});

describe("selectContactWithUid", () => {
  it("Finds contact with given UID ", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    const peterClone = mutableCloneDeep(peter);
    mockStoreState.contactReducer.contacts = [bilboClone, peterClone];
    const contact = selectContactWithUid(bilboClone.uid)(mockStoreState);
    expect(contact).toEqual(bilboClone);
  });
  it("Returns null when no matching contact", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    mockStoreState.contactReducer.contacts = [bilboClone];
    const contact = selectContactWithUid("some-non-uid")(mockStoreState);
    expect(contact).toBeNull();
  });
  it("Returns first when multiple matching contacts", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    const bilboCloneTwo = mutableCloneDeep(bilbo);
    if (bilboCloneTwo.identity?.firstName) bilboCloneTwo.identity.firstName = "Duplicate";

    mockStoreState.contactReducer.contacts = [bilboClone, bilboCloneTwo];
    const contact = selectContactWithUid(bilboClone.uid)(mockStoreState);

    expect(contact).toEqual(bilboClone);
  });
});
