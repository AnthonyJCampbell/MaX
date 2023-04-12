// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mockedT } from "shared/mocks/ts-utils";
import MeetingManagement from "components/midbar/meeting-management/management";
import UpperMeetingButton from "components/midbar/meeting-management/upper-meeting-button/upper-button";
import LowerMeetingButton from "components/midbar/meeting-management/lower-meeting-button/lower-button";
import CreateMeetingIcon from "assets/midbar/create-meeting-icon.png";
import ScheduleMeetingIcon from "assets/midbar/schedule-meeting-icon.png";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/midbar/meeting-management/upper-meeting-button/upper-button");
jest.mock("components/midbar/meeting-management/lower-meeting-button/lower-button");
jest.mock("react-redux");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

// Currently duplicated here and in add-menu.test.js - needs to be moved to somewhere common
// Custom matchers allow us to give specific custom messages if the check fails
expect.extend({
  containsMatchingElement(haystack, needle) {
    const result = haystack.containsMatchingElement(needle);
    return {
      pass: result,
      message: () =>
        `${JSON.stringify(needle.props)} ${
          result ? "unexpectedly" : "not"
        } found in ${haystack.debug()}`,
    };
  },
});

const useSelectorMock = jest.spyOn(redux, "useSelector");
let mockState;

beforeEach(() => {
  mockState = {
    meetingReducer: { meetings: [] },
    paneManagementReducer: { focusSearch: {} },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
});

describe("<MeetingManagement />", () => {
  it("Renders correct buttons", () => {
    const wrap = shallow(<MeetingManagement />);

    expect(wrap).containsMatchingElement(
      <UpperMeetingButton
        image={CreateMeetingIcon}
        text={mockedT("create")}
        ariaLabel={mockedT("createAMeeting")}
      />
    );
    expect(wrap).containsMatchingElement(
      <UpperMeetingButton
        image={ScheduleMeetingIcon}
        text={mockedT("schedule")}
        ariaLabel={mockedT("scheduleAMeeting")}
      />
    );
    expect(wrap).containsMatchingElement(<LowerMeetingButton text={mockedT("joinAMeeting")} />);
    expect(wrap).containsMatchingElement(
      <LowerMeetingButton text={mockedT("viewUpcomingMeetings")} />
    );
    expect(wrap).containsMatchingElement(
      <LowerMeetingButton text={mockedT("viewRecordedMeetings")} />
    );
  });

  it("Renders different create/invite button when in meeting", () => {
    mockState.meetingReducer.meetings = [{ uid: "1029384756" }];

    const wrap = shallow(<MeetingManagement />);

    expect(wrap).containsMatchingElement(
      <UpperMeetingButton
        image={CreateMeetingIcon}
        text={mockedT("invite")}
        ariaLabel={mockedT("inviteOthers")}
      />
    );
  });
});
