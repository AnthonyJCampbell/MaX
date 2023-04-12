// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ConfirmLogOutPopup from "components/modal-popup/confirm-log-out/popup";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { mockedT } from "shared/mocks/ts-utils";
import { hideModalPopup } from "action-creators/navigation/actions";
import * as S from "components/modal-popup/confirm-log-out/styles";
import { any } from "prop-types";
import { logOut } from "action-creators/ipc-outgoing/core-actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/core-actions");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("react-redux");
jest.mock("components/utils/common");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ConfirmLogOutPopup/>", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Test the confirm log out window has the right text and buttons", () => {
    const mockState = {
      paneManagementReducer: { showConfirmLogOutPopup: any },
    };
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));
    const wrap = shallow(<ConfirmLogOutPopup />);
    const variableTextComponent = wrap.find(S.VariableText);
    expect(variableTextComponent.find("h1").text()).toBe(mockedT("warnLogOut"));
    const paragraphs = variableTextComponent.find("p");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs.at(0).text()).toBe(mockedT("logOutText"));
    const buttons = wrap.find(S.Button);
    expect(buttons).toHaveLength(2);
    expect(buttons.at(0).text()).toBe(mockedT("logOutButton"));
    expect(buttons.at(1).text()).toBe(mockedT("cancel"));
  });

  it("Test the confirm log out window cancel button works correctly", () => {
    const mockState = {
      paneManagementReducer: { showConfirmLogOutPopup: any },
    };
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));

    const wrap = shallow(<ConfirmLogOutPopup />);
    wrap.find({ id: "confirmLogOutPopup-Cancel" }).simulate("click");
    expect(logOut).not.toHaveBeenCalled();
    expect(hideModalPopup).toHaveBeenCalled();
  });

  it("Log out when clicking the log out button", () => {
    const mockState = {
      paneManagementReducer: { showConfirmLogOutPopup: any },
    };
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));

    const wrap = shallow(<ConfirmLogOutPopup />);
    wrap.find({ id: "confirmLogOutPopup-LogOut" }).simulate("click");
    expect(logOut).toHaveBeenCalled();
    expect(hideModalPopup).toHaveBeenCalled();
  });
});
