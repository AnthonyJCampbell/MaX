// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";

import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import InCallHeaderWrapper from "components/rightbar/content-header-panel/in-call-header-panel/in-call-header-wrapper";

import { peter, bilbo } from "shared/mocks/mock-contacts";
import * as redux from "react-redux";
import { prettyCallStatus, prettyCallDuration } from "components/utils/common";
import { CallStatus } from "shared/types";

import Avatar from "components/avatar/avatar";

import { ContentHeaderPanelDisableOverlay } from "components/rightbar/content-header-panel/shared-styles";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/utils/common");
jest.mock("react-redux");
jest.mock("components/avatar/avatar");
jest.mock("components/rightbar/content-header-panel/top-button/button");
jest.mock("components/rightbar/content-header-panel/top-button/menu-button");
jest.mock("components/rightbar/content-header-panel/in-call-header-panel/meeting-button");
jest.mock("components/rightbar/content-header-panel/in-call-header-panel/hold-button");
jest.mock("components/rightbar/content-header-panel/in-call-header-panel/add-transfer-menu");
jest.mock("components/rightbar/content-header-panel/in-call-header-panel/audio-menu");
jest.mock("components/rightbar/content-header-panel/more-menu/more-menu");
jest.mock("action-creators/ipc-outgoing/meetings-actions");
jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/active-calls-actions");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const useSelectorMock = jest.spyOn(redux, "useSelector");
let mockState;

beforeEach(() => {
  mockState = {
    activeCallsReducer: { activeCalls: [] },
    contactReducer: { selectedContact: {} },
    meetingReducer: { meetings: [] },
    settingsReducer: {
      settings: {
        meetings: {
          enabled: true,
        },
        general: {
          profilePicture: undefined,
          displayName: "",
          accountNumber: "",
          easRegion: "US",
        },
      },
    },
    paneManagementReducer: {
      isMainWindowFocused: true,
    },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
});

describe("<InCallHeaderWrapper />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  const activeCall = {
    remoteParty: bilbo.phone[0].value,
    status: CallStatus.CURRENT,
    uid: 85127117692674674465,
  };

  const setupCallWithBilbo = (datetimeStarted = "2020-06-24T07:54:56.256Z", meetings = []) => {
    mockState.activeCallsReducer.activeCalls = [
      {
        ...activeCall,
        datetimeStarted,
      },
    ];
    mockState.contactReducer.selectedContact = bilbo;
    mockState.meetingReducer.meetings = meetings;
  };

  it("Renders with avatar under a Connecting status", () => {
    const activeCall = { remoteParty: peter?.phone?.[0]?.value, status: CallStatus.CONNECTING };
    mockState.activeCallsReducer.activeCalls = [activeCall];
    mockState.contactReducer.selectedContact = peter;

    prettyCallStatus.mockReturnValue("Connecting...");
    const wrap = shallow(<InCallHeaderWrapper />);

    expect(wrap.containsMatchingElement(<Avatar contact={peter} />)).toBe(true);
    expect(wrap.text()).toContain("Connecting...");
  });

  it("Renders disabled panel properly", () => {
    const activeCall = { remoteParty: peter?.phone?.[0]?.value, status: CallStatus.CONNECTING };
    mockState.activeCallsReducer.activeCalls = [activeCall];
    mockState.contactReducer.selectedContact = peter;

    prettyCallStatus.mockReturnValue("Connecting...");
    const wrap = shallow(<InCallHeaderWrapper isDisabled />);

    const disabledOverlay = wrap.find(ContentHeaderPanelDisableOverlay);
    expect(disabledOverlay.exists()).toBe(true);
  });

  it("Renders a calltimer", () => {
    setupCallWithBilbo();

    // Mocking the return value of Date.now, which returns the time elapsed in ms since Jan 1 1970
    // This value gets compared to the parse value of datetimeStarted in order to render the callTimer
    Date.now = jest.fn(() => 1592985496256);
    prettyCallStatus.mockReturnValue(null);
    const wrap = shallow(<InCallHeaderWrapper />);

    expect(wrap.text()).not.toContain("Connecting...");
    expect(prettyCallDuration).toHaveBeenCalledWith(200);

    // Incrementing timer by 2000ms (2s) to verify that the timer reflects that accurately.
    Date.now = jest.fn(() => 1592985498256);
    shallow(<InCallHeaderWrapper />);
    expect(prettyCallDuration).toHaveBeenCalledWith(202);
  });

  it("Renders a calltimer that supports over 100 minutes of calling", () => {
    setupCallWithBilbo();

    // Larger mock value to make sure the counter reads 01:43:20
    Date.now = jest.fn(() => 1592991496256);
    prettyCallStatus.mockReturnValue(null);
    const wrap = shallow(<InCallHeaderWrapper />);

    expect(wrap.text()).not.toContain("Connecting...");
    expect(prettyCallDuration).toHaveBeenCalledWith(6200);
  });

  it("Renders a calltimer that supports over 10 hours of calling", () => {
    setupCallWithBilbo("2020-06-23T22:54:56.256Z");

    Date.now = jest.fn(() => 1592991496256);
    prettyCallStatus.mockReturnValue(null);
    const wrap = shallow(<InCallHeaderWrapper />);

    expect(wrap.text()).not.toContain("Connecting...");
    expect(prettyCallDuration).toHaveBeenCalledWith(38600);
  });
});
