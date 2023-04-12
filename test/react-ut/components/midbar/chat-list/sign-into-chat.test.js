// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ChatNotSignedIn from "components/midbar/chat-list/sign-into-chat";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import * as S from "components/midbar/chat-list/styles";
import { mockedT } from "shared/mocks/ts-utils";
import { signIntoChat } from "action-creators/ipc-outgoing/settings-actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("react-redux");
jest.mock("components/midbar/chat-list/chat-conversation-block/chat-block");
jest.mock("src/renderer-logging");
jest.mock("action-creators/ipc-outgoing/settings-actions");

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

describe("<ChatNotSignedIn />", () => {
  it("Text displays correctly in the window", () => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockReturnValue({});
    const wrap = shallow(<ChatNotSignedIn />);

    const variableTextComponent = wrap.find(S.PanelContainer);
    expect(variableTextComponent.find("h1").text()).toBe(mockedT("chatDisabled"));
    const paragraph = variableTextComponent.find("p");
    expect(paragraph).toHaveLength(1);
    expect(paragraph.at(0).text()).toBe(mockedT("chatDisabledMessage"));
    const button = wrap.find(S.Button);
    expect(button).toHaveLength(1);
    expect(button.at(0).text()).toBe(mockedT("signIntoChat"));
  });

  it("Sign out of chat button calls the correct function.", () => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockReturnValue({});
    const wrap = shallow(<ChatNotSignedIn />);

    wrap.find(S.Button).simulate("click");
    expect(signIntoChat).toHaveBeenCalled();
  });
});
