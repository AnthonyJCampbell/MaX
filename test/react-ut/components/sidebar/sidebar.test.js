// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import Sidebar from "components/sidebar/sidebar";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import * as S from "components/sidebar/styles";
import {
  setActiveMidPane,
  focusMidbarSearch,
  setSearchTerm,
} from "action-creators/navigation/actions";
import { updateHistoricCall } from "action-creators/ipc-outgoing/call-history-actions";

import AddNew from "assets/shared/add-new.svg";
import ActiveContactButton from "assets/sidebar/tab-contacts-active.svg";
import MeetingButton from "assets/sidebar/tab-meeting.svg";

import each from "jest-each";
import { PresenceState } from "shared/types";
import * as common from "components/utils/common";
import { bilboAvatarDataUrl } from "shared/mocks/mock-contact-avatars";
import SidebarAvatar from "components/avatar/sidebar-avatar/sidebar-avatar";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/call-history-actions");
jest.mock("react-redux");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, useState: jest.fn() };
});

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const useSelectorMock = jest.spyOn(redux, "useSelector");
const attnMock = jest.spyOn(common, "chatAttention");
let mockState;

beforeEach(() => {
  mockState = {
    paneManagementReducer: {
      activeMidPane: "contacts",
      activeRightPane: "",
      focusSearch: 0,
      customStatusState: common.CustomStatusState.INITIAL,
      presenceMenuState: common.PresenceMenuState.INITIAL,
    },
    messagingReducer: {
      chats: [],
    },
    callHistoryReducer: {
      historicCalls: [],
    },
    voicemailsReducer: {
      voicemailFaxCount: {
        newMessages: 0,
      },
    },
    settingsReducer: {
      settings: {
        meetings: {
          enabled: true,
        },
        general: {
          profilePicture: bilboAvatarDataUrl,
          displayName: "",
          accountNumber: "",
        },
      },
    },
    contactReducer: {
      selectedContact: {},
    },
    userReducer: {
      user: {
        presence: {
          state: PresenceState.ONLINE,
          customStatus: "",
        },
      },
    },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
});

describe("<Sidebar />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());
  const setState = jest.fn();
  const useStateMock = jest.spyOn(React, "useState");
  useStateMock.mockImplementation((init) => [init, setState]);

  it("Renders", () => {
    const wrap = shallow(<Sidebar />);
    expect(wrap.containsMatchingElement(<SidebarAvatar />)).toBe(true);
    expect(
      wrap.containsMatchingElement(
        <S.AddButton id="addButton">
          <img src={AddNew} alt="" />
        </S.AddButton>
      )
    ).toBe(true);
    expect(
      wrap.containsMatchingElement(
        <button id="contactsTabButton">
          <img src={ActiveContactButton} alt="" />
        </button>
      )
    ).toBe(true);
    expect(
      wrap.containsMatchingElement(
        <button id="meetingsTabButton">
          <img src={MeetingButton} alt="" />
        </button>
      )
    ).toBe(true);
  });

  it("Hides the MeetingButton when settings.meetings.enabled is false", () => {
    mockState.settingsReducer.settings.meetings.enabled = false;

    const wrap = shallow(<Sidebar />);
    expect(
      wrap.containsMatchingElement(
        <button id="meetingsTabButton">
          <img src={MeetingButton} alt="" />
        </button>
      )
    ).toBe(false);
  });

  each([
    ["contactsTabButton", "contacts"],
    ["callsTabButton", "calls"],
    ["chatsTabButton", "chat"],
    ["meetingsTabButton", "meetings"],
  ]).it("Changes the activeMidPane and focus on click of the %s", (buttonName, paneName) => {
    const wrap = shallow(<Sidebar />);
    wrap.find({ id: buttonName }).simulate("click");
    expect(setActiveMidPane).toHaveBeenCalledWith(paneName);
    expect(focusMidbarSearch).toHaveBeenCalledWith(1);
    expect(setSearchTerm).toHaveBeenCalledWith("");
  });

  const createCalls = (num) => {
    let calls = [];
    let ii;
    for (ii = 0; ii < num; ii++) {
      calls.push({ uid: "abc" + ii, attention: true });
    }
    return calls;
  };
  each([
    [0, []],
    [1, [{ uid: "qwe", attention: true }]],
    [
      1,
      [
        { uid: "qwe", attention: true },
        { uid: "xyz", attention: false },
      ],
    ],
    [9, createCalls(9)],
    ["9+", createCalls(10)],
  ]).it("Shows %s call notifications", (number, calls) => {
    mockState.callHistoryReducer.historicCalls = calls;

    const wrap = shallow(<Sidebar />);
    const callButton = wrap.find({ id: "callsTabButton" });
    expect(callButton.containsMatchingElement(<S.Notification>{number}</S.Notification>)).toEqual(
      number !== 0 ? true : false
    );
  });

  it("Marks calls not needing attention when clicking away from the calls tab", () => {
    mockState.paneManagementReducer.activeMidPane = "calls";
    mockState.callHistoryReducer.historicCalls = [{ uid: "abc", attention: true }];

    const wrap = shallow(<Sidebar />);

    wrap.find({ id: "contactsTabButton" }).simulate("click");
    expect(updateHistoricCall).toHaveBeenCalled();
  });

  const createChats = (num) => {
    let chats = [];
    for (let i = 0; i < num; i++) {
      chats.push({});
    }
    return chats;
  };
  each([
    [0, [], 0],
    [1, createChats(1), 1],
    [1, createChats(2), 1],
    [9, createChats(9), 9],
    ["9+", createChats(10), 10],
  ]).it("Shows %s chat notifications", (number, chats, timesToReturnTrueAttention) => {
    mockState.messagingReducer.chats = chats;
    attnMock.mockReturnValue(false);
    for (let i = 0; i < timesToReturnTrueAttention; i++) {
      attnMock.mockReturnValueOnce(true);
    }
    const wrap = shallow(<Sidebar />);
    const chatButton = wrap.find({ id: "chatsTabButton" });
    expect(chatButton.containsMatchingElement(<S.Notification>{number}</S.Notification>)).toEqual(
      number !== 0 ? true : false
    );
  });

  /**
   * The formation of the focusableObjList is not tested as it contains no complicated logic.
   */
});
