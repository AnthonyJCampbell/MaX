// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { appQuitSpy } from "test/react-ut/components/require-mock";
import AvatarMenu from "components/sidebar/avatar-menu";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { mockedT } from "shared/mocks/ts-utils";
import { PresenceState } from "shared/types";

import Settings from "assets/sidebar/menu-settings.svg";
import About from "assets/sidebar/menu-about.svg";
import Online from "assets/shared/presence-online.svg";
import { CustomStatusState } from "components/utils/common";
import Avatar from "assets/sidebar/menu-avatar.svg";
import ChangePassword from "assets/sidebar/menu-password.svg";
import CheckForUpdates from "assets/sidebar/menu-updates.svg";
import Help from "assets/sidebar/menu-help.svg";

import { AccountNumber, Button, DisplayName, PresenceButton } from "components/menu/menu";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import { viewSettings, viewChangeAvatar } from "action-creators/ipc-outgoing/settings-actions";
import {
  viewAbout,
  viewChangePassword,
  viewCheckForUpdates,
  viewHelp,
} from "action-creators/ipc-outgoing/core-actions";

import { showConfirmLogOutPopup } from "action-creators/navigation/actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/menu/menu");
jest.mock("react-redux");
jest.mock("action-creators/ipc-outgoing/settings-actions");
jest.mock("action-creators/ipc-outgoing/core-actions");
jest.mock("components/utils/phone-formatter");
jest.mock("src/renderer-logging");
jest.mock("action-creators/navigation/actions");
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, useRef: jest.fn() };
});

const useSelectorMock = jest.spyOn(redux, "useSelector");

formatPhoneNumber.mockImplementation((phoneNumber, easRegion) => `${phoneNumber}-${easRegion}`);

const mockReducerState = (override) => {
  const mockState = {
    paneManagementReducer: {
      customStatusState: override?.customStatusState || CustomStatusState.INITIAL,
    },
    settingsReducer: {
      settings: {
        general: {
          displayName: override.displayName,
          accountNumber: override.accountNumber,
          easRegion: "GB",
        },
      },
    },
    userReducer: {
      user: {
        presence: {
          state: override.presenceState,
          customStatus: "",
        },
      },
    },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
};

const setVisible = jest.fn();
let mockVisible = false;

const useRefMock = jest.spyOn(React, "useRef");
useRefMock.mockImplementation(() => ({
  current: {
    focus: jest.fn(),
    setAttribute: jest.fn(),
  },
}));

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

describe("<AvatarMenu />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Renders user account information", () => {
    mockReducerState({
      displayName: "Test Name",
      accountNumber: "1234567890",
    });

    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);
    expect(wrap).containsMatchingElement(<DisplayName text="Test Name" />);
    expect(wrap).containsMatchingElement(
      <AccountNumber text={formatPhoneNumber("1234567890", "GB")} />
    );
  });

  it("Renders all menu items", () => {
    mockReducerState({
      presenceState: PresenceState.ONLINE,
    });

    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);
    expect(wrap).containsMatchingElement(
      <PresenceButton
        id="avatarMenuRow-ChangePresence"
        imageSrc={Online}
        text={mockedT("online")}
      />
    );
    expect(wrap).containsMatchingElement(
      <Button id="avatarMenuRow-Settings" imageSrc={Settings} text={mockedT("settings")} />
    );
    expect(wrap).containsMatchingElement(
      <Button id="avatarMenuRow-About" imageSrc={About} text={mockedT("about")} />
    );
    expect(wrap).containsMatchingElement(
      <Button id="avatarMenuRow-ChangeAvatar" imageSrc={Avatar} text={mockedT("changeAvatar")} />
    );
    expect(wrap).containsMatchingElement(
      <Button
        id="avatarMenuRow-ChangePassword"
        imageSrc={ChangePassword}
        text={mockedT("changePassword")}
      />
    );
    expect(wrap).containsMatchingElement(
      <Button
        id="avatarMenuRow-CheckForUpdates"
        imageSrc={CheckForUpdates}
        text={mockedT("checkForUpdates")}
      />
    );
    expect(wrap).containsMatchingElement(
      <Button id="avatarMenuRow-Help" imageSrc={Help} text={mockedT("help")} />
    );
  });

  it("Settings calls the viewGeneralSettings action.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-Settings" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(viewSettings).toHaveBeenCalled();
  });

  it("About calls the viewAbout action.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-About" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(viewAbout).toHaveBeenCalled();
  });

  it("Change avatar calls the changeAvatar action.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-ChangeAvatar" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(viewChangeAvatar).toHaveBeenCalled();
  });

  it("Change password calls the changePassword action.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-ChangePassword" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(viewChangePassword).toHaveBeenCalled();
  });

  it("Check for updates call the checkForUpdates action.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-CheckForUpdates" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(viewCheckForUpdates).toHaveBeenCalled();
  });

  it("Help brings up help.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-Help" }).props().clickAction();
    expect(setVisible).toHaveBeenCalledWith(false);
    expect(viewHelp).toHaveBeenCalled();
  });

  it("Log out button opens the confirm log out dialog.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-Logout" }).props().clickAction();
    expect(showConfirmLogOutPopup).toHaveBeenCalled();
  });

  it("Quit button quits the application.", () => {
    const wrap = shallow(<AvatarMenu keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />);

    wrap.find({ id: "avatarMenuRow-Quit" }).props().clickAction();
    expect(appQuitSpy).toHaveBeenCalled();
  });
});
