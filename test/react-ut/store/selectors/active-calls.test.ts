// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import {
  selectActiveCallFromUid,
  selectOneActiveCallWithContact,
} from "store/selectors/active-calls";
import { ActiveCall } from "src/types";
import { bilboCall } from "shared/mocks/mock-active-calls";
import { bilbo } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("selectActiveCallFromUid", () => {
  it("Finds call with given UID ", () => {
    mockStoreState.activeCallsReducer.activeCalls = [ActiveCall.fromObject(bilboCall)];
    const call = selectActiveCallFromUid(bilboCall.uid)(mockStoreState);
    expect(call).toEqual(bilboCall);
  });
  it("Returns null when no matching call", () => {
    mockStoreState.activeCallsReducer.activeCalls = [ActiveCall.fromObject(bilboCall)];
    const call = selectActiveCallFromUid("some-non-uid")(mockStoreState);
    expect(call).toBeNull();
  });
  it("Returns a single call when multiple match", () => {
    mockStoreState.activeCallsReducer.activeCalls = [
      ActiveCall.fromObject(bilboCall),
      ActiveCall.fromObject(bilboCall),
    ];
    const call = selectActiveCallFromUid(bilboCall.uid)(mockStoreState);
    expect(call).toEqual(bilboCall);
  });
});

describe("selectOneActiveCallWithContact", () => {
  it("Finds a call matching a contact", () => {
    mockStoreState.activeCallsReducer.activeCalls = [ActiveCall.fromObject(bilboCall)];
    const bilboClone = mutableCloneDeep(bilbo);
    const call = selectOneActiveCallWithContact(bilboClone)(mockStoreState);
    expect(call).toEqual(bilboCall);
  });
  it("Returns null when there is no matching contact", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    bilboClone.phone[0].value = "a new number";

    mockStoreState.activeCallsReducer.activeCalls = [ActiveCall.fromObject(bilboCall)];
    const call = selectActiveCallFromUid(bilboClone.uid)(mockStoreState);
    expect(call).toBeNull();
  });
  it("Returns a single call when multiple match", () => {
    const bilboClone = mutableCloneDeep(bilbo);

    mockStoreState.activeCallsReducer.activeCalls = [
      ActiveCall.fromObject(bilboCall),
      ActiveCall.fromObject(bilboCall),
    ];
    const call = selectOneActiveCallWithContact(bilboClone)(mockStoreState);
    expect(call).toEqual(bilboCall);
  });
});
