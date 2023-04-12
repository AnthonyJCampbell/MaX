// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ChatBlock from "components/midbar/chat-list/chat-conversation-block/chat-block";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { setSelectedContact, focusRightbarMessage } from "action-creators/navigation/actions";
import { gandalf, peter } from "shared/mocks/mock-contacts";
import { chatWithGandalf, chatWithPeter } from "shared/mocks/mock-chats";
import * as Shared from "components/midbar/shared-styles";
import { fullname, prettyPresence, sortMessages, chatAttention } from "components/utils/common";
import { mockedT, mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("react-redux");
jest.mock("components/utils/common");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ChatBlock />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  useSelectorMock.mockReturnValue({
    focusMessage: 0,
  });
  fullname.mockReturnValue("MockReturn");
  prettyPresence.mockReturnValue("MockReturn");
  chatAttention.mockReturnValue(false);
  sortMessages.mockReturnValue(chatWithGandalf.message);

  const gandalfTyping = mutableCloneDeep(gandalf);
  gandalfTyping.isTyping = true;

  it("Renders", () => {
    const wrap = shallow(<ChatBlock contact={peter} chat={chatWithPeter} />);
    expect(fullname).toHaveBeenCalledWith(peter);
    expect(wrap.text()).toContain("MockReturn");
    expect(wrap.text()).toContain(chatWithPeter.message[0].content);
  });

  it("Changes the selectedContact and focus on click", () => {
    const wrap = shallow(<ChatBlock contact={peter} chat={chatWithPeter} />);
    wrap.simulate("click");
    expect(setSelectedContact).toHaveBeenCalledWith(peter);
    expect(focusRightbarMessage).toHaveBeenCalled();
  });

  it("Shows if the chat is requesting attention", () => {
    chatAttention.mockReturnValue(true);
    const wrap = shallow(<ChatBlock contact={gandalf} chat={chatWithGandalf} />);
    expect(fullname).toHaveBeenCalledWith(gandalf);
    expect(wrap.containsMatchingElement(<Shared.AttentionDot />)).toBeTruthy();
  });

  it("Shows 'Typing...' when the contact is typing in the chat", () => {
    const wrap = shallow(<ChatBlock contact={gandalfTyping} chat={chatWithGandalf} />);
    expect(fullname).toHaveBeenCalledWith(gandalfTyping);
    expect(wrap.text()).toContain("MockReturn");
    expect(wrap.text()).toContain(mockedT("typing"));
  });

  it("Does not show 'Typing...' when the contact is not typing in the chat", () => {
    const wrap = shallow(<ChatBlock contact={peter} chat={chatWithPeter} />);
    expect(fullname).toHaveBeenCalledWith(peter);
    expect(wrap.text()).toContain("MockReturn");
    expect(wrap.text()).not.toContain(mockedT("typing"));
  });
});
