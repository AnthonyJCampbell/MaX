// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import "test/react-ut/components/require-mock";
import CallList from "components/midbar/call-list/call-list";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mockedT } from "shared/mocks/ts-utils";
import { bilbo, peter, gandalf } from "shared/mocks/mock-contacts";
import {
  missedHistoricCall,
  inboundHistoricCall,
  outboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import * as redux from "react-redux";
import CallBlock from "components/midbar/call-list/call-history-block/call-block";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/call-history-actions");
jest.mock("react-redux");
jest.mock("components/midbar/call-list/call-history-block/call-block");
jest.mock("src/renderer-logging");

// Remove memoization from components for testing purposes
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, memo: (component) => component };
});

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  contactReducer: { contacts: [] },
  callHistoryReducer: { historicCalls: [] },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

describe("<CallList />", () => {
  it("Renders", () => {
    mockState.contactReducer.contacts = [gandalf, peter, bilbo];
    mockState.callHistoryReducer.historicCalls = [
      missedHistoricCall,
      inboundHistoricCall,
      outboundHistoricCall,
    ];
    const wrap = shallow(<CallList />);
    const CallBlocks = wrap.find(CallBlock);

    expect(CallBlocks.first().props().call).toEqual(missedHistoricCall);
    expect(CallBlocks.at(1).props().call).toEqual(inboundHistoricCall);
    expect(CallBlocks.at(2).props().call).toEqual(outboundHistoricCall);

    expect(CallBlocks).toHaveLength(3);
  });

  it("Renders an empty list with a no-call indicator", () => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockReturnValue({
      contacts: [],
      historicCalls: [],
    });
    const wrap = shallow(<CallList />);
    expect(wrap.containsMatchingElement(<CallBlock />)).not.toBeTruthy();
    expect(wrap.containsMatchingElement(<h1>{mockedT("noCallsMessage")}</h1>)).toBe(true);
  });
});
