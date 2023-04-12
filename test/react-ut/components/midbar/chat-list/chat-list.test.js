// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ChatList from "components/midbar/chat-list/chat-list";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mockedT } from "shared/mocks/ts-utils";
import { bilbo, gandalf, peter } from "shared/mocks/mock-contacts";
import { chatWithGandalf, chatWithPeter } from "shared/mocks/mock-chats";
import * as redux from "react-redux";
import ChatBlock from "components/midbar/chat-list/chat-conversation-block/chat-block";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { MessageType } from "protobuf-wispa/dist/messaging";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("react-redux");
jest.mock("components/midbar/chat-list/chat-conversation-block/chat-block");
jest.mock("src/renderer-logging");

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

const mockState = {
  contactReducer: { contacts: [] },
  messagingReducer: { chats: [] },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

describe("<ChatList />", () => {
  const smsChatWithGandalf = mutableCloneDeep(chatWithGandalf);
  smsChatWithGandalf.message.forEach((message) => (message.type = MessageType.SMS));
  smsChatWithGandalf.message.forEach(
    (message) => (message.author = { value: gandalf.phone[0].value })
  );
  smsChatWithGandalf.uid = gandalf.phone[0].value;

  const nonContactPhoneNumber = "01111136241";
  const smsChatWithNonContact = mutableCloneDeep(chatWithPeter);
  smsChatWithNonContact.message.forEach((message) => (message.type = MessageType.SMS));
  smsChatWithNonContact.message.forEach(
    (message) => (message.author = { value: nonContactPhoneNumber })
  );
  smsChatWithNonContact.uid = nonContactPhoneNumber;

  it("Renders", () => {
    mockState.contactReducer.contacts = [mutableCloneDeep(gandalf), mutableCloneDeep(peter)];
    mockState.messagingReducer.chats = [
      mutableCloneDeep(chatWithGandalf),
      mutableCloneDeep(chatWithPeter),
    ];
    const wrap = shallow(<ChatList />);

    const chatBlocks = wrap.find(ChatBlock);
    expect(chatBlocks).toHaveLength(2);
    expect(chatBlocks.at(0).props().contact).toEqual(peter);
    expect(chatBlocks.at(1).props().contact).toEqual(gandalf);
  });

  it("Renders a block for contact with an SMS conversation", () => {
    mockState.contactReducer.contacts = [mutableCloneDeep(gandalf)];
    mockState.messagingReducer.chats = [smsChatWithGandalf];
    const wrap = shallow(<ChatList />);

    const chatBlocks = wrap.find(ChatBlock);
    expect(chatBlocks.first().props().contact).toEqual(gandalf);
    expect(chatBlocks.first().props().chat).toEqual(smsChatWithGandalf);
  });

  it("Renders only one block for a contact with both IM and SMS messages", () => {
    mockState.contactReducer.contacts = [mutableCloneDeep(gandalf)];
    const SMSandIMChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    SMSandIMChatWithGandalf.message[2].type = MessageType.SMS;
    SMSandIMChatWithGandalf.message[2].author = gandalf.phone[0].value;
    mockState.messagingReducer.chats = [SMSandIMChatWithGandalf];
    const wrap = shallow(<ChatList />);

    const chatBlocks = wrap.find(ChatBlock);
    expect(chatBlocks).toHaveLength(1);
    expect(chatBlocks.first().props().contact).toEqual(gandalf);
    expect(chatBlocks.first().props().chat).toEqual(SMSandIMChatWithGandalf);
  });

  it("Renders blocks with non-contacts if no matching contact", () => {
    mockState.contactReducer.contacts = [mutableCloneDeep(bilbo)];
    mockState.messagingReducer.chats = [smsChatWithGandalf, smsChatWithNonContact];
    const wrap = shallow(<ChatList />);

    const chatBlocks = wrap.find(ChatBlock);
    expect(chatBlocks).toHaveLength(2);
    expect(chatBlocks.at(0).props().contact.phone[0].value).toEqual(nonContactPhoneNumber);
    expect(chatBlocks.at(1).props().contact.phone[0].value).toEqual(gandalf.phone[0].value);
  });

  it("Renders blocks with contact and non-contact in the right order", () => {
    mockState.contactReducer.contacts = [mutableCloneDeep(gandalf)];
    mockState.messagingReducer.chats = [smsChatWithGandalf, smsChatWithNonContact];
    const wrap = shallow(<ChatList />);

    const chatBlocks = wrap.find(ChatBlock);
    expect(chatBlocks).toHaveLength(2);
    expect(chatBlocks.at(0).props().contact.phone[0].value).toEqual(nonContactPhoneNumber);
    expect(chatBlocks.at(1).props().contact).toEqual(gandalf);
  });

  it("Renders an empty list with a no-message indicator", () => {
    mockState.contactReducer.contacts = [];
    mockState.messagingReducer.chats = [];
    const wrap = shallow(<ChatList />);
    expect(
      wrap.containsMatchingElement(<ChatBlock contact={gandalf} chat={chatWithGandalf} />)
    ).not.toBeTruthy();
    expect(
      wrap.containsMatchingElement(<ChatBlock contact={peter} chat={chatWithPeter} />)
    ).not.toBeTruthy();
    expect(wrap.containsMatchingElement(<ChatBlock contact={bilbo} />)).not.toBeTruthy();
    expect(wrap.containsMatchingElement(<h1>{mockedT("noChatsMessage")}</h1>)).toBe(true);
  });

  /**
   * The focusableObjList state is not tested at UT level, as it would require going out of
   * scope of the chat-list component.
   */
});
