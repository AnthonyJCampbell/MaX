// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import store from "store/store";
import { setSelectedContact } from "action-creators/navigation/actions";
import { changeSelectedContact } from "store/action-creators/ipc-incoming/motion-actions";
import { bilbo } from "shared/mocks/mock-contacts";
import { ContactsMotion } from "src/types";

import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");
jest.mock("action-creators/navigation/actions");
jest.mock("store/store");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  (setSelectedContact as jest.Mock).mockClear();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("changeSelectedContact", () => {
  it("Dispatches an action to set the selected contact", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    const bilboMotion = ContactsMotion.fromObject({ displayContact: { uid: bilboClone.uid } });
    (store.getState as jest.Mock).mockReturnValue({
      contactReducer: { contacts: [bilboClone] },
    });
    changeSelectedContact(bilboMotion.displayContact);
    expect(setSelectedContact).toHaveBeenCalledWith(bilboClone);
  });

  it("Does nothing if no contact match is found for the given uid", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    const nonUidMotion = ContactsMotion.fromObject({ displayContact: { uid: "some-non-uid" } });
    (store.getState as jest.Mock).mockReturnValue({
      contactReducer: { contacts: [bilboClone] },
    });
    changeSelectedContact(nonUidMotion.displayContact);
    expect(setSelectedContact).not.toHaveBeenCalled();
  });
});
