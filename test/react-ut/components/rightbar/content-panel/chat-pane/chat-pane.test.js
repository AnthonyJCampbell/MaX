// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import * as redux from "react-redux";

import "test/react-ut/components/require-mock";
import ChatPane from "components/rightbar/content-panel/chat-pane/chat-pane";
import ChatMessage from "components/rightbar/content-panel/chat-pane/chat-message/chat-message";
import ChatHeader from "components/rightbar/content-panel/chat-pane/chat-header/chat-header";
import MessageBox from "components/rightbar/content-panel/chat-pane/message-box/message-box";

import { chatWithGandalf, chatWithNewMessageFromGandalf } from "shared/mocks/mock-chats";
import { bilbo, gandalf, peter } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { markChatRead } from "action-creators/ipc-outgoing/messaging-actions";
import { MessageType } from "shared/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("components/avatar/avatar");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");
  return { ...react, useRef: jest.fn(), useState: jest.fn() };
});
let mockUseStateValue = null;
let mockUseRefValue;

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  mockUseStateValue = null;
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ChatPane />", () => {
  const mockState = {
    messagingReducer: { chats: [] },
    contactReducer: { selectedContact: {} },
    paneManagementReducer: {
      activeRightPane: "chat",
      forceMessageRemoteParty: "",
      isMainWindowFocused: true,
      banners: [],
    },
  };
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  useSelectorMock.mockImplementation((callback) => callback(mockState));
  const setContactAndChatState = (contact, mockChat) => {
    mockState.contactReducer.selectedContact = contact;
    mockState.messagingReducer.chats = [mockChat];
  };
  const setForceMessageRemoteParty = (messageRemoteParty) => {
    mockState.paneManagementReducer.forceMessageRemoteParty = messageRemoteParty;
  };

  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());
  const useRefMock = jest.spyOn(React, "useRef");
  useRefMock.mockReturnValue({ current: mockUseRefValue });
  const useStateMock = jest.spyOn(React, "useState");
  const setStateMock = jest.fn();
  useStateMock.mockImplementation(() => [mockUseStateValue, setStateMock]);

  it("Displays only the message box when there is no chat with the selected contact", () => {
    setContactAndChatState(peter, chatWithGandalf);
    useRefMock.mockReturnValue({ current: gandalf });
    const chatPane = shallow(<ChatPane />);
    const messages = chatPane.find(ChatMessage);

    expect(messages).toHaveLength(0);
    expect(chatPane.containsMatchingElement(<MessageBox />)).toBeTruthy();

    expect(setStateMock).toHaveBeenCalledWith(null);
    expect(markChatRead).not.toHaveBeenCalled();
  });
  it("Displays a single message", () => {
    const singleChatwithGandalf = mutableCloneDeep(chatWithGandalf);
    singleChatwithGandalf.message = [singleChatwithGandalf.message[0]];
    setContactAndChatState(gandalf, singleChatwithGandalf);
    const chatPane = shallow(<ChatPane />);
    const messages = chatPane.find(ChatMessage);

    expect(messages).toHaveLength(singleChatwithGandalf.message.length);

    const props = messages.first().props();
    expect(props.message).toEqual(singleChatwithGandalf.message[0]);
    expect(props.contact).toEqual(gandalf);
  });
  it("Displays multiple messages", () => {
    setContactAndChatState(gandalf, chatWithGandalf);
    const chatPane = shallow(<ChatPane />);
    const messages = chatPane.find(ChatMessage);

    // This should expect that the number of messages displayed is
    // equal to number of messages in the store.
    expect(messages).toHaveLength(chatWithGandalf.message.length);
  });
  it("Displays messages with a non-IM contact", () => {
    const chatWithBilbo = {
      uid: bilbo.im?.value,
      participant: [bilbo.im],
      message: [
        {
          uid: "you-are-late-message-uid",
          recipient: bilbo.im,
          timestamp: "2020-06-19T17:31:10Z",
          type: MessageType.IM,
          author: { value: "" },
          content: "You're late.",
          edited: false,
          read: true,
        },
      ],
      isNew: false,
      chatName: "bilbo-chat-name",
    };
    setContactAndChatState(bilbo, chatWithBilbo);
    const chatPane = shallow(<ChatPane />);
    const messages = chatPane.find(ChatMessage);

    expect(messages).toHaveLength(chatWithBilbo.message.length);

    const props = messages.first().props();
    expect(props.message).toEqual(chatWithBilbo.message[0]);
    expect(props.contact).toEqual(bilbo);
  });
  it("Displays new messages in order", () => {
    const unreadChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    unreadChatWithGandalf.message.forEach((m) => (m.read = false));
    setContactAndChatState(gandalf, unreadChatWithGandalf);
    const chatPane = shallow(<ChatPane />);
    const messages = chatPane.find(ChatMessage);

    const firstProps = messages.at(0).props();
    const secondProps = messages.at(1).props();
    const thirdProps = messages.at(2).props();

    // Messages are stored newest->oldest and displayed oldest->newest,
    // but since we ordered the messages, the sent message should be
    // the last one and so on.
    expect(firstProps.message).toEqual(unreadChatWithGandalf.message[0]);
    expect(secondProps.message).toEqual(unreadChatWithGandalf.message[1]);
    expect(thirdProps.message).toEqual(unreadChatWithGandalf.message[2]);
  });
  it("Correctly identifies the first message from an author", () => {
    const oneWayChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    oneWayChatWithGandalf.message = oneWayChatWithGandalf.message.slice(1, 3);
    oneWayChatWithGandalf.message[1].type = MessageType.IM;
    setContactAndChatState(gandalf, oneWayChatWithGandalf);
    const chatPane = shallow(<ChatPane />);
    const messages = chatPane.find(ChatMessage);

    expect(messages).toHaveLength(oneWayChatWithGandalf.message.length);
    expect(messages.at(0).props().displayAvatar).toBeTruthy();
    expect(messages.at(1).props().displayAvatar).toBeFalsy();
  });
  it("Displays a range of different day separators", () => {
    const longChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    longChatWithGandalf.message[0].timestamp = "2019-06-16T17:31:10Z";
    longChatWithGandalf.message[1].timestamp = "2020-06-21T17:33:11Z";
    longChatWithGandalf.message[2].timestamp = new Date().toISOString();
    setContactAndChatState(gandalf, longChatWithGandalf);
    setForceMessageRemoteParty("");
    const chatPane = shallow(<ChatPane />);
    const headers = chatPane.find(ChatHeader);

    expect(headers).toHaveLength(3);

    // This should be flipped because we ordered all messages by date.
    // So the first header should be the last message sent and so on.
    expect(headers.at(0).props()).toEqual({
      date: new Date(
        new Date(longChatWithGandalf.message[0].timestamp).toDateString()
      ).toISOString(),
    });
    expect(headers.at(1).props()).toEqual({
      date: new Date(
        new Date(longChatWithGandalf.message[1].timestamp).toDateString()
      ).toISOString(),
    });
    expect(headers.at(2).props()).toEqual({
      date: new Date(
        new Date(longChatWithGandalf.message[2].timestamp).toDateString()
      ).toISOString(),
    });
  });
  it("Displays Message type indicators when messages switch type", () => {
    const SMSandIMChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    SMSandIMChatWithGandalf.message[0].type = MessageType.SMS;
    SMSandIMChatWithGandalf.message[2].type = MessageType.SMS;
    setContactAndChatState(gandalf, SMSandIMChatWithGandalf);
    setForceMessageRemoteParty("");

    const chatPane = shallow(<ChatPane />);
    const headers = chatPane.find(ChatHeader);

    expect(headers).toHaveLength(3);
    expect(headers.at(1).props()).toEqual({
      message: {
        messageType: MessageType.IM,
        messageUid: SMSandIMChatWithGandalf.message[1].uid,
      },
    });
    expect(headers.at(2).props()).toEqual({
      message: {
        messageType: MessageType.SMS,
        messageUid: SMSandIMChatWithGandalf.message[2].uid,
      },
    });
  });
  it("Displays Message type indicator when forceMessageRemoteParty doesn't match last message type", () => {
    setContactAndChatState(gandalf, chatWithGandalf);
    setForceMessageRemoteParty(gandalf.phone[0].value);

    const chatPane = shallow(<ChatPane />);
    const headers = chatPane.find(ChatHeader);

    expect(headers).toHaveLength(2);
    expect(headers.at(1).props()).toEqual({
      message: {
        messageType: MessageType.SMS,
        messageUid: "temp",
      },
    });
  });
  it("Calculates the New separator and marks chat as read when there is a new incoming message", () => {
    const chatWithGandalfAndNewMessage = mutableCloneDeep(chatWithGandalf);
    chatWithGandalfAndNewMessage.message.unshift(...chatWithNewMessageFromGandalf.message);
    setContactAndChatState(gandalf, chatWithGandalfAndNewMessage);
    useRefMock.mockReturnValue({ current: peter });

    shallow(<ChatPane />);

    // New indicator
    expect(setStateMock).toHaveBeenCalledWith(chatWithNewMessageFromGandalf.message[0].uid);
    // Mark as read
    expect(markChatRead).toHaveBeenCalledWith(chatWithGandalfAndNewMessage);
  });
  it("Displays the New separator when it has been set", () => {
    const chatWithGandalfAndNewMessage = mutableCloneDeep(chatWithGandalf);
    chatWithGandalfAndNewMessage.message.unshift(...chatWithNewMessageFromGandalf.message);
    setContactAndChatState(gandalf, chatWithGandalfAndNewMessage);
    useRefMock.mockReturnValue({ current: gandalf });
    mockUseStateValue = chatWithNewMessageFromGandalf.message[0].uid;
    setForceMessageRemoteParty("");

    const chatPane = shallow(<ChatPane />);

    // Shouldn't recalculate new indicator
    expect(setStateMock).not.toHaveBeenCalled();

    const headers = chatPane.find(ChatHeader);

    expect(headers).toHaveLength(3);

    // The unread messages should have the datestamp from the unread messages
    // in the history.
    expect(headers.at(0).props()).toEqual({
      date: new Date(new Date(chatWithGandalf.message[0].timestamp).toDateString()).toISOString(),
    });

    expect(headers.at(1).props()).toEqual({
      date: new Date(
        new Date(chatWithGandalfAndNewMessage.message[0].timestamp).toDateString()
      ).toISOString(),
    });

    // New separator
    expect(headers.at(2).props()).toEqual({ isNew: true });
  });
  it("Displays date, message type, new headers in that order", () => {
    const multiHeaderChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    multiHeaderChatWithGandalf.message[0].timestamp = "2020-06-18T17:32:12";
    multiHeaderChatWithGandalf.message[1].type = MessageType.SMS;
    multiHeaderChatWithGandalf.message[2].type = MessageType.SMS;
    setContactAndChatState(gandalf, multiHeaderChatWithGandalf);
    useRefMock.mockReturnValue({ current: gandalf });
    mockUseStateValue = multiHeaderChatWithGandalf.message[1].uid;
    setForceMessageRemoteParty("");

    const chatPane = shallow(<ChatPane />);
    const headers = chatPane.find(ChatHeader);

    expect(headers).toHaveLength(4);
    expect(headers.at(0).props()).toEqual({
      date: new Date(
        new Date(multiHeaderChatWithGandalf.message[0].timestamp).toDateString()
      ).toISOString(),
    });
    expect(headers.at(1).props()).toEqual({
      date: new Date(
        new Date(multiHeaderChatWithGandalf.message[1].timestamp).toDateString()
      ).toISOString(),
    });
    expect(headers.at(2).props()).toEqual({
      message: {
        messageType: MessageType.SMS,
        messageUid: multiHeaderChatWithGandalf.message[1].uid,
      },
    });
    expect(headers.at(3).props()).toEqual({ isNew: true });
  });
  it("Calculates the New separator and marks chat as read when there is a new message in an open chat", () => {
    const chatWithGandalfAndNewMessage = mutableCloneDeep(chatWithGandalf);
    chatWithGandalfAndNewMessage.message.unshift(...chatWithNewMessageFromGandalf.message);
    setContactAndChatState(gandalf, chatWithGandalfAndNewMessage);
    useRefMock.mockReturnValue({ current: gandalf });
    mockUseStateValue = null;

    shallow(<ChatPane />);

    // New indicator
    expect(setStateMock).toHaveBeenCalledWith(chatWithNewMessageFromGandalf.message[0].uid);
    // Mark as read
    expect(markChatRead).toHaveBeenCalledWith(chatWithGandalfAndNewMessage);
  });
  it("Only marks the chat as read in certain conditions", () => {
    const chatWithGandalfAndNewMessage = mutableCloneDeep(chatWithGandalf);
    const mutableNewMessage = mutableCloneDeep(chatWithNewMessageFromGandalf);
    chatWithGandalfAndNewMessage.message.unshift(...mutableNewMessage.message);
    setContactAndChatState(gandalf, chatWithGandalfAndNewMessage);
    useRefMock.mockReturnValue({ current: gandalf });

    // Active right pane
    mockState.paneManagementReducer.activeRightPane = "contactDetails";
    mockState.paneManagementReducer.isMainWindowFocused = true;

    shallow(<ChatPane />);
    // Don't mark as read
    expect(markChatRead).not.toHaveBeenCalled();

    // Window focus
    mockState.paneManagementReducer.activeRightPane = "chat";
    mockState.paneManagementReducer.isMainWindowFocused = false;

    shallow(<ChatPane />);
    // Don't mark as read
    expect(markChatRead).not.toHaveBeenCalled();

    // Most recent message read
    mockState.paneManagementReducer.activeRightPane = "chat";
    mockState.paneManagementReducer.isMainWindowFocused = true;
    chatWithGandalfAndNewMessage.message[0].read = true;

    shallow(<ChatPane />);
    // Don't mark as read
    expect(markChatRead).not.toHaveBeenCalled();

    // All conditions now met
    mockState.paneManagementReducer.activeRightPane = "chat";
    mockState.paneManagementReducer.isMainWindowFocused = true;
    chatWithGandalfAndNewMessage.message[0].read = false;

    shallow(<ChatPane />);
    // Now mark as read
    expect(markChatRead).toHaveBeenCalledWith(chatWithGandalfAndNewMessage);
  });
  it("Only recalculates the new indicator in certain conditions", () => {
    const chatWithGandalfAndNewMessage = mutableCloneDeep(chatWithGandalf);
    const mutableNewMessage = mutableCloneDeep(chatWithNewMessageFromGandalf);
    chatWithGandalfAndNewMessage.message.unshift(...mutableNewMessage.message);
    setContactAndChatState(gandalf, chatWithGandalfAndNewMessage);

    // Same contact, new indicator, no unread chat message
    useRefMock.mockReturnValue({ current: gandalf });
    // OR conditions also not met
    mockUseStateValue = chatWithNewMessageFromGandalf.message[0].uid;
    chatWithGandalfAndNewMessage.message[0].read = true;

    shallow(<ChatPane />);
    // Don't recalculate
    expect(setStateMock).not.toHaveBeenCalled();

    // New indicator
    mockUseStateValue = chatWithNewMessageFromGandalf.message[0].uid;
    chatWithGandalfAndNewMessage.message[0].read = false;
    // OR condition also not met
    useRefMock.mockReturnValue({ current: gandalf });

    shallow(<ChatPane />);
    // Don't recalculate
    expect(setStateMock).not.toHaveBeenCalled();

    // Most recent message read
    mockUseStateValue = null;
    chatWithGandalfAndNewMessage.message[0].read = true;
    // OR condition also not met
    useRefMock.mockReturnValue({ current: gandalf });

    shallow(<ChatPane />);
    // Don't recalculate
    expect(setStateMock).not.toHaveBeenCalled();

    // Conditions met - null indicator and recent message unread
    mockUseStateValue = null;
    chatWithGandalfAndNewMessage.message[0].read = false;
    // OR condition not met
    useRefMock.mockReturnValue({ current: gandalf });

    shallow(<ChatPane />);
    // Now recalculate
    expect(setStateMock).toHaveBeenCalledWith(chatWithNewMessageFromGandalf.message[0].uid);
  });
});
