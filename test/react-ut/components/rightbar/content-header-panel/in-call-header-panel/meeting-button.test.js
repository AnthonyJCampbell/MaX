// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { bilbo, gandalf, peter } from "shared/mocks/mock-contacts";
import { gandalfCall } from "shared/mocks/mock-active-calls";
import * as redux from "react-redux";
import { createMeeting, updateMeeting } from "action-creators/ipc-outgoing/meetings-actions";
import { CallStatus } from "shared/types";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import MeetingButton from "components/rightbar/content-header-panel/in-call-header-panel/meeting-button";
import TopButton from "components/rightbar/content-header-panel/top-button/button";

import MeetingButtonIcon from "assets/rightbar/button-meeting-incall.svg";
import AddToMeetingButton from "assets/rightbar/button-meeting-add-incall.svg";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/utils/common");
jest.mock("react-redux");
jest.mock("action-creators/ipc-outgoing/meetings-actions");
jest.mock("components/rightbar/content-header-panel/top-button/button");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  activeCallsReducer: { activeCalls: [] },
  contactReducer: { selectedContact: {} },
  meetingReducer: { meetings: [] },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

describe("<MeetingButton />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  const setupCallWithGandalf = (datetimeStarted = "2020-06-24T07:54:56.256Z", meetings = []) => {
    mockState.activeCallsReducer.activeCalls = [
      {
        ...gandalfCall,
        datetimeStarted,
      },
    ];
    mockState.contactReducer.selectedContact = gandalf;
    mockState.meetingReducer.meetings = meetings;
  };

  it("Renders for a full contact", () => {
    const activeCall = {
      remoteParty: peter.phone[0].value,
      status: CallStatus.CONNECTING,
      uid: "1234124",
    };
    mockState.contactReducer.selectedContact = peter;
    mockState.meetingReducer.meetings = [];

    const wrap = shallow(<MeetingButton activeCall={activeCall} />);

    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={MeetingButtonIcon} disabled={false} />)
    ).toBeTruthy();
  });

  it("Renders for a contact with no IM", () => {
    const activeCall = {
      remoteParty: bilbo?.phone?.[0]?.value,
      status: CallStatus.CONNECTING,
      uid: "1234124",
    };
    mockState.contactReducer.selectedContact = bilbo;
    mockState.meetingReducer.meetings = [];

    const wrap = shallow(<MeetingButton activeCall={activeCall} />);

    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={MeetingButtonIcon} disabled={true} />)
    ).toBeTruthy();
  });

  it("Renders for a contact already in a meeting", () => {
    const activeCall = {
      remoteParty: peter.phone[0].value,
      status: CallStatus.CONNECTING,
      uid: "1234124",
    };
    mockState.contactReducer.selectedContact = peter;
    mockState.meetingReducer.meetings = [{ uid: "fhukfjrw" }];

    const wrap = shallow(<MeetingButton activeCall={activeCall} />);

    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={AddToMeetingButton} disabled={false} />)
    ).toBeTruthy();
  });

  it("Dispatches action to uplift to a new meeting when clicking meeting button", () => {
    setupCallWithGandalf();

    const wrap = shallow(<MeetingButton activeCall={gandalfCall} />);
    const meetingButton = wrap.find(TopButton).find({ imageSrc: MeetingButtonIcon });

    // Can't tell Enzyme to click the TopButton as it's a subcomponent, but we still want to test
    // that it triggers the right behaviour in its parent, so call it's click action directly.
    const clickAction = meetingButton.props().clickAction;
    clickAction();

    expect(createMeeting).toHaveBeenCalledWith([{ value: gandalf.im.value }], gandalfCall.uid);
  });

  it("Do NOT dispatches action when the selected contact does not have an IM value", () => {
    setupCallWithGandalf();

    const gandalfIMLess = { ...mutableCloneDeep(gandalf), im: undefined };

    mockState.contactReducer.selectedContact = gandalfIMLess;

    const wrap = shallow(<MeetingButton activeCall={gandalfCall} />);
    const meetingButton = wrap.find(TopButton).find({ imageSrc: MeetingButtonIcon });

    // Can't tell Enzyme to click the TopButton as it's a subcomponent, but we still want to test
    // that it triggers the right behaviour in its parent, so call it's click action directly.
    const clickAction = meetingButton.props().clickAction;
    clickAction();

    expect(createMeeting).not.toHaveBeenCalled();
  });

  it("Dispatches action to uplift to the current meeting when clicking meeting button", () => {
    setupCallWithGandalf("2020-06-24T07:54:56.256Z", [{ uid: "1234567890" }]);

    const wrap = shallow(<MeetingButton activeCall={gandalfCall} />);
    const meetingButton = wrap.find(TopButton).find({ imageSrc: AddToMeetingButton });
    // Can't tell Enzyme to click the TopButton as it's a subcomponent, but we still want to test
    // that it triggers the right behaviour in its parent, so call it's click action directly.
    const clickAction = meetingButton.props().clickAction;
    clickAction();

    expect(updateMeeting).toHaveBeenCalledWith([{ value: gandalf.im.value }], gandalfCall.uid);
  });

  it("Disabled the button when props.disabled is provided", () => {
    setupCallWithGandalf();
    const wrap = shallow(<MeetingButton activeCall={gandalfCall} disabled />);

    expect(wrap.find(TopButton).props().disabled).toBe(true);
  });
});
