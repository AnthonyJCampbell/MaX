// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { selectHistoricCallsWithContact } from "store/selectors/historic-calls";

import { bilbo, gandalf } from "shared/mocks/mock-contacts";
import {
  missedHistoricCall,
  inboundHistoricCall,
  outboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");

const mockState = mutableCloneDeep(mockStoreState);

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("selectHistoricCallsWithContact", () => {
  it("Selects 0 calls", () => {
    const bilboClone = mutableCloneDeep(bilbo);
    mockState.callHistoryReducer.historicCalls = [missedHistoricCall];
    const historicCallsFromContact = selectHistoricCallsWithContact(bilboClone)(mockState);

    expect(historicCallsFromContact).toStrictEqual([]);
  });
  it("Selects 1 calls", () => {
    const gandalfClone = mutableCloneDeep(gandalf);
    mockState.callHistoryReducer.historicCalls = [missedHistoricCall, inboundHistoricCall];
    const historicCallsFromContact = selectHistoricCallsWithContact(gandalfClone)(mockState);

    expect(historicCallsFromContact).toStrictEqual([missedHistoricCall]);
  });
  it("Selects 2 calls", () => {
    const gandalfClone = mutableCloneDeep(gandalf);
    mockState.callHistoryReducer.historicCalls = [
      missedHistoricCall,
      inboundHistoricCall,
      outboundHistoricCall,
    ];
    const historicCallsFromContact = selectHistoricCallsWithContact(gandalfClone)(mockState);

    expect(historicCallsFromContact).toStrictEqual([missedHistoricCall, outboundHistoricCall]);
  });
});
