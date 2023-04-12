// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import InCallPopOut from "components/rightbar/content-header-panel/in-call-header-panel/in-call-pop-out";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { peter, bilbo } from "shared/mocks/mock-contacts";
import { gandalfCall } from "shared/mocks/mock-active-calls";
import * as redux from "react-redux";
import { prettyCallStatus } from "components/utils/common";
import { CallStatus } from "shared/types";

import TopButton from "components/rightbar/content-header-panel/top-button/button";
import TopMenuButton from "components/rightbar/content-header-panel/top-button/menu-button";
import MuteButton from "components/rightbar/content-header-panel/in-call-header-panel/mute-button";
import MeetingButton from "components/rightbar/content-header-panel/in-call-header-panel/meeting-button";
import DockWindowButton from "assets/rightbar/button-dock-window.svg";
import AddTransferButton from "assets/rightbar/button-add-transfer.svg";
import RecordButton from "assets/rightbar/button-record.svg";
import HangUpButton from "assets/shared/button-hang-up.svg";
import MoreButton from "assets/rightbar/button-more-incall.svg";
import HoldButton from "components/rightbar/content-header-panel/in-call-header-panel/hold-button";
import AddTransferMenu from "components/rightbar/content-header-panel/in-call-header-panel/add-transfer-menu";
import MoreMenu from "components/rightbar/content-header-panel/more-menu/more-menu";
import { selectContactViaNode, showMainWindow } from "action-creators/navigation/actions";
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
          easRegion: "US",
        },
      },
    },
    paneManagementReducer: {
      isMainWindowFocused: false,
    },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
});

describe("<InCallPopOut />", () => {
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

  // Test that the in-call-header-panel in the external window renders all the correct buttons
  // (and no buttons that only appear in the main window)
  it("Renders for in an external window", () => {
    const activeCall = { remoteParty: peter?.phone?.[0]?.value, status: CallStatus.CONNECTING };
    mockState.activeCallsReducer.activeCalls = [activeCall];
    mockState.contactReducer.selectedContact = peter;

    const wrap = shallow(<InCallPopOut />);
    // AddTransferButton should be invisible
    expect(
      wrap.containsMatchingElement(
        <TopMenuButton imageSrc={AddTransferButton} parent="call" menu={<AddTransferMenu />} />
      )
    ).toBe(false);
    expect(wrap.containsMatchingElement(<MuteButton />)).toBe(true);
    expect(wrap.containsMatchingElement(<MeetingButton />)).toBe(true);
    // Recordbutton should be invisible
    expect(wrap.containsMatchingElement(<TopButton imageSrc={RecordButton} parent="call" />)).toBe(
      false
    );
    expect(wrap.containsMatchingElement(<HoldButton activeCall={activeCall} />)).toBe(true);
    expect(wrap.containsMatchingElement(<TopButton imageSrc={HangUpButton} parent="call" />)).toBe(
      true
    );
    // More Menu should be invisible
    expect(
      wrap.containsMatchingElement(
        <TopMenuButton imageSrc={MoreButton} parent="call" menu={<MoreMenu />} />
      )
    ).toBe(false);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={DockWindowButton} parent="call" />)
    ).toBe(true);
  });

  it("Renders in an external window with Meeting Button hidden", () => {
    mockState.activeCallsReducer.activeCalls = [gandalfCall];
    mockState.contactReducer.selectedContact = peter;
    mockState.settingsReducer.settings.meetings.enabled = false;

    const wrap = shallow(<InCallPopOut />);
    expect(wrap.containsMatchingElement(<MeetingButton />)).toBe(false);
  });

  it("Docks the external window on clicking the dock button", () => {
    setupCallWithBilbo();
    prettyCallStatus.mockReturnValue("Connecting...");
    const wrap = shallow(<InCallPopOut />);
    // Click dock button
    wrap.find({ id: "dockWindowButton" }).props().clickAction();
    expect(selectContactViaNode).toHaveBeenCalledWith(bilbo);
    expect(showMainWindow).toHaveBeenCalled();
  });

  it("Should not renders the blocking overlay", () => {
    setupCallWithBilbo();
    const wrap = shallow(<InCallPopOut />);
    expect(wrap.exists(ContentHeaderPanelDisableOverlay)).toBe(false);
  });
});
