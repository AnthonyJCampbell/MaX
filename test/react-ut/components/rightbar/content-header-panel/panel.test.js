// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ContentHeaderPanel from "components/rightbar/content-header-panel/panel";
import DefaultHeaderPanel from "components/rightbar/content-header-panel/default-header-panel/panel";
import InCallHeaderPanel from "components/rightbar/content-header-panel/in-call-header-panel/in-call-header-panel";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { gandalf, bilbo } from "shared/mocks/mock-contacts";
import { bilboCall } from "shared/mocks/mock-active-calls";
import * as redux from "react-redux";
import { CallStatus } from "shared/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/utils/common");
jest.mock("react-redux");
jest.mock("components/avatar/avatar");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  activeCallsReducer: { activeCalls: [] },
  contactReducer: { selectedContact: {} },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

describe("<ContentHeaderPanel />", () => {
  it("Renders the default header panel", () => {
    const wrap = shallow(<ContentHeaderPanel />);
    expect(wrap.containsMatchingElement(<DefaultHeaderPanel />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<InCallHeaderPanel />)).not.toBeTruthy();
  });

  it("Renders the default header panel when there's no match between selectedContact and activeCalls", () => {
    mockState.activeCallsReducer.activeCalls = [bilboCall];
    mockState.contactReducer.selectedContact = gandalf;

    const wrap = shallow(<ContentHeaderPanel />);
    expect(wrap.containsMatchingElement(<DefaultHeaderPanel />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<InCallHeaderPanel />)).not.toBeTruthy();
  });

  it("Renders the default header panel when there's a match between selectedContact and activeCalls but the incoming call status is incoming", () => {
    mockState.activeCallsReducer.activeCalls = [
      { remoteParty: bilbo.phone[0].value, status: CallStatus.INCOMING },
    ];
    mockState.contactReducer.selectedContact = bilbo;

    const wrap = shallow(<ContentHeaderPanel />);
    expect(wrap.containsMatchingElement(<DefaultHeaderPanel />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<InCallHeaderPanel />)).not.toBeTruthy();
  });

  it("Renders the in call header panel when the selectedContact matches activeCalls", () => {
    mockState.activeCallsReducer.activeCalls = [{ remoteParty: bilbo.phone[0].value }];
    mockState.contactReducer.selectedContact = bilbo;

    const wrap = shallow(<ContentHeaderPanel />);
    expect(wrap.containsMatchingElement(<DefaultHeaderPanel />)).not.toBeTruthy();
    expect(wrap.containsMatchingElement(<InCallHeaderPanel />)).toBeTruthy();
  });
});
