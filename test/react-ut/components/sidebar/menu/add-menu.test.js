// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { mockedT } from "shared/mocks/ts-utils";

import AddContact from "assets/sidebar/menu-add-contact.svg";
import NewCall from "assets/sidebar/menu-keypad.svg";
import NewGroupChat from "assets/sidebar/menu-chat.svg";
import StartMeeting from "assets/sidebar/menu-start.svg";
import ScheduleMeeting from "assets/sidebar/menu-schedule.svg";

import { Button } from "components/menu/menu";

import { focusMidbarSearch } from "action-creators/navigation/actions";
import { addContact } from "action-creators/ipc-outgoing/contacts-actions";
import {
  scheduleMeeting,
  createMeetingWithOptions,
} from "action-creators/ipc-outgoing/meetings-actions";
import AddMenu from "components/sidebar/add-menu";
import { showCreateGroupChat } from "action-creators/ipc-outgoing/messaging-actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/menu/menu");
jest.mock("react-redux");
jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/contacts-actions");
jest.mock("action-creators/ipc-outgoing/meetings-actions");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, useRef: jest.fn() };
});

const setVisible = jest.fn();
let mockVisible = false;

const useRefMock = jest.spyOn(React, "useRef");
useRefMock.mockImplementation(() => ({
  current: {
    focus: jest.fn(),
    setAttribute: jest.fn(),
  },
}));

const keyboardNavTools = {
  visible: mockVisible,
  setVisible,
  buttonRef: useRefMock,
};

const useSelectorMock = jest.spyOn(redux, "useSelector");
let mockState;

beforeEach(() => {
  mockState = {
    meetingReducer: { meetings: [] },
    paneManagementReducer: { focusSearch: {} },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
  log.test(`Start running > ${expect.getState().currentTestName}`);
});

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

// Currently duplicated here and in management.test.js - needs to be moved to somewhere common
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

describe("<AddMenu />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Renders all add menu items", () => {
    const wrap = shallow(<AddMenu keyboardNavTools={keyboardNavTools} />);
    expect(wrap).containsMatchingElement(
      <Button id="addMenuRow-NewCall" imageSrc={NewCall} text={mockedT("newCall")} />
    );
    expect(wrap).containsMatchingElement(
      <Button id="addMenuRow-NewGroupChat" imageSrc={NewGroupChat} text={mockedT("newGroupChat")} />
    );
    expect(wrap).containsMatchingElement(
      <Button id="addMenuRow-AddContact" imageSrc={AddContact} text={mockedT("addContact")} />
    );
    expect(wrap).containsMatchingElement(
      <Button
        id="addMenuRow-StartMeeting"
        imageSrc={StartMeeting}
        text={mockedT("createAMeeting")}
      />
    );
    expect(wrap).containsMatchingElement(
      <Button
        id="addMenuRow-ScheduleMeeting"
        imageSrc={ScheduleMeeting}
        text={mockedT("scheduleAMeeting")}
      />
    );
  });

  it("Menu is different when in meeting", () => {
    mockState.meetingReducer.meetings = [{ uid: "1029384756" }];

    const wrap = shallow(<AddMenu keyboardNavTools={keyboardNavTools} />);
    expect(wrap).containsMatchingElement(
      <Button id="addMenuRow-StartMeeting" imageSrc={StartMeeting} text={mockedT("inviteOthers")} />
    );
  });

  it("New call focuses the search bar.", () => {
    const wrap = shallow(<AddMenu keyboardNavTools={keyboardNavTools} />);

    wrap.find({ id: "addMenuRow-NewCall" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(focusMidbarSearch).toHaveBeenCalled();
  });

  it("New group chat calls the showCreateGroupChat action.", () => {
    const wrap = shallow(<AddMenu keyboardNavTools={keyboardNavTools} />);

    wrap.find({ id: "addMenuRow-NewGroupChat" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(showCreateGroupChat).toHaveBeenCalled();
  });

  it("Add contact calls the addContact action.", () => {
    const wrap = shallow(<AddMenu keyboardNavTools={keyboardNavTools} />);

    wrap.find({ id: "addMenuRow-AddContact" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(addContact).toHaveBeenCalled();
  });

  it("Start meeting calls the createMeetingWithOptions action.", () => {
    const wrap = shallow(<AddMenu keyboardNavTools={keyboardNavTools} />);

    wrap.find({ id: "addMenuRow-StartMeeting" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(createMeetingWithOptions).toHaveBeenCalled();
  });

  it("Schedule meeting calls the scheduleMeeting action.", () => {
    const wrap = shallow(<AddMenu keyboardNavTools={keyboardNavTools} />);

    wrap.find({ id: "addMenuRow-ScheduleMeeting" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(scheduleMeeting).toHaveBeenCalled();
  });
});
