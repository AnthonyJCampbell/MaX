// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import * as redux from "react-redux";
import { gandalf, noName, peter } from "shared/mocks/mock-contacts";
import TypingIndicator from "src/components/rightbar/content-panel/chat-pane/typing-indicator/typing-indicator";
import { mockedT, mutableCloneDeep } from "shared/mocks/ts-utils";
import { Contact } from "src/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

interface MockStateType {
  contactReducer: { selectedContact: Contact };
}

const mockState: MockStateType = {
  contactReducer: { selectedContact: mutableCloneDeep(noName) },
};

const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

const gandalfTyping = mutableCloneDeep(gandalf);
gandalfTyping.isTyping = true;

describe("<TypingIndicator />", () => {
  it("Does not render the Typing indicator when the selected contact is not typing", () => {
    mockState.contactReducer.selectedContact = mutableCloneDeep(peter);
    const typingIndicator = shallow(<TypingIndicator />);

    expect(typingIndicator.text()).not.toContain(
      gandalf.identity?.firstName + " " + mockedT("isTyping")
    );
  });

  it("Renders the Typing indicator when the selected contact is typing", () => {
    mockState.contactReducer.selectedContact = gandalfTyping;
    const typingIndicator = shallow(<TypingIndicator />);

    expect(typingIndicator.text()).toContain(
      gandalfTyping.identity?.firstName + " " + mockedT("isTyping")
    );
  });
});
