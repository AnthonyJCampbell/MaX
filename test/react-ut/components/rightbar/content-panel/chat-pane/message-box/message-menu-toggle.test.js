// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import * as redux from "react-redux";

import "test/react-ut/components/require-mock";
import { mockedT } from "shared/mocks/ts-utils";
import MessageMenuToggle from "src/components/rightbar/content-panel/chat-pane/message-box/message-menu-toggle";
import IMIcon from "assets/rightbar/chat.svg";
import IMIconToggle from "assets/rightbar/chat-toggle.svg";
import SMSIcon from "assets/rightbar/chat-sms.svg";
import SMSIconToggle from "assets/rightbar/chat-sms-toggle.svg";

import { chatWithGandalf, chatWithPeter } from "shared/mocks/mock-chats";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { bilbo, gandalf } from "shared/mocks/mock-contacts";
import log from "src/renderer-logging";
import { MessageType } from "shared/types";
import MenuButton from "components/ui/Menu/menu-button";
import Menu from "components/ui/Menu";
import MenuItem from "components/ui/Menu/menu-item";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");

const mockState = {
  contactReducer: {
    selectedContact: gandalf,
  },
  messagingReducer: {
    chats: [],
    drafts: {},
  },
  paneManagementReducer: {
    forceMessageRemoteParty: "",
  },
  settingsReducer: {
    settings: {
      general: { easRegion: "GB" },
    },
  },
};

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<MessageMenuToggle />", () => {
  beforeEach(() => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));
  });
  const setContactAndChatState = (contact, mockChat) => {
    mockState.contactReducer.selectedContact = contact;
    mockState.messagingReducer.chats = [mockChat];
  };
  const setForceMessageRemoteParty = (messageRemoteParty) => {
    mockState.paneManagementReducer.forceMessageRemoteParty = messageRemoteParty;
  };

  const smsChatWithGandalf = mutableCloneDeep(chatWithGandalf);
  smsChatWithGandalf.message.forEach((message) => (message.type = MessageType.SMS));
  smsChatWithGandalf.message.forEach(
    (message) => (message.author = { value: gandalf.phone[0].value })
  );
  const gandalfWithNoIM = { ...mutableCloneDeep(gandalf), im: undefined };

  it("Displays IM icon", () => {
    const gandalfWithNoPhone = mutableCloneDeep(gandalf);
    gandalfWithNoPhone.phone = [];
    setContactAndChatState(gandalfWithNoPhone, chatWithPeter);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    expect(wrap.containsMatchingElement(<img src={IMIcon} alt="" />)).toBeTruthy();
  });

  it("Displays SMS icon", () => {
    setContactAndChatState(bilbo, chatWithPeter);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    expect(wrap.containsMatchingElement(<img src={SMSIcon} alt="" />)).toBeTruthy();
  });

  it("Displays IM toggle icon when contact has no chat", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), chatWithPeter);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    const menuButton = wrap.find(MenuButton);
    expect(menuButton.prop("icon")).toEqual(IMIconToggle);
  });

  it("Displays IM toggle icon when last message is IM", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), chatWithGandalf);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    const menuButton = wrap.find(MenuButton);
    expect(menuButton.prop("icon")).toEqual(IMIconToggle);
  });

  it("Displays SMS toggle icon when last message is SMS", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), smsChatWithGandalf);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    const menuButton = wrap.find(MenuButton);
    expect(menuButton.prop("icon")).toEqual(SMSIconToggle);
  });

  it("Displays IM toggle icon when forcing messageRemoteParty", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), chatWithPeter);
    setForceMessageRemoteParty("IM");
    const wrap = shallow(<MessageMenuToggle />);
    const menuButton = wrap.find(MenuButton);
    expect(menuButton.prop("icon")).toEqual(IMIconToggle);
  });

  it("Displays SMS toggle icon when forcing messageRemoteParty", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), chatWithPeter);
    setForceMessageRemoteParty(gandalf.phone[0].value);
    const wrap = shallow(<MessageMenuToggle />);
    const menuButton = wrap.find(MenuButton);
    expect(menuButton.prop("icon")).toEqual(SMSIconToggle);
  });

  it("Renders menu and focuses first item", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), chatWithPeter);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    const menu = wrap.find(Menu);
    expect(menu.prop("itemToFocus")).toEqual(0);
    const menuItems = wrap.find(MenuItem);
    expect(menuItems).toHaveLength(3);
    expect(menuItems.at(0).prop("icon")).toEqual("chat");
    expect(menuItems.at(1).prop("icon")).toEqual("chat-sms");
    expect(menuItems.at(2).prop("icon")).toEqual("chat-sms");
    expect(menuItems.at(0).prop("label")).toEqual(mockedT("sendIMMessage"));
    expect(menuItems.at(1).prop("label")).toEqual(
      mockedT("sendSMStoPhoneNumberWithType", {
        phoneNumber: "0117 803 6241",
        numberType: "mobile",
      })
    );
    expect(menuItems.at(2).prop("label")).toEqual(
      mockedT("sendSMStoPhoneNumberWithType", {
        phoneNumber: "020 8363 1400",
        numberType: "fax",
      })
    );
  });

  it("Renders menu and focuses item matching last message when it is IM", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), chatWithGandalf);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    const menu = wrap.find(Menu);
    expect(menu.prop("itemToFocus")).toEqual(0);
  });

  it("Renders menu and focuses item matching last message when it is SMS", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), smsChatWithGandalf);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    const menu = wrap.find(Menu);
    expect(menu.prop("itemToFocus")).toEqual(1);
  });

  it("Renders menu and focuses item matching last message for non-IM contact", () => {
    setContactAndChatState(gandalfWithNoIM, smsChatWithGandalf);
    setForceMessageRemoteParty("");
    const wrap = shallow(<MessageMenuToggle />);
    const menu = wrap.find(Menu);
    expect(menu.prop("itemToFocus")).toEqual(0);
    const menuItems = wrap.find(MenuItem);
    expect(menuItems).toHaveLength(2);
    expect(menuItems.at(0).prop("icon")).toEqual("chat-sms");
    expect(menuItems.at(1).prop("icon")).toEqual("chat-sms");
    expect(menuItems.at(0).prop("label")).toEqual(
      mockedT("sendSMStoPhoneNumberWithType", {
        phoneNumber: "0117 803 6241",
        numberType: "mobile",
      })
    );
    expect(menuItems.at(1).prop("label")).toEqual(
      mockedT("sendSMStoPhoneNumberWithType", {
        phoneNumber: "020 8363 1400",
        numberType: "fax",
      })
    );
  });

  it("Renders menu and focuses item matching forceMessageRemoteParty when it is IM", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), smsChatWithGandalf);
    setForceMessageRemoteParty("IM");
    const wrap = shallow(<MessageMenuToggle />);
    const menu = wrap.find(Menu);
    expect(menu.prop("itemToFocus")).toEqual(0);
  });

  it("Renders menu and focuses item matching forceMessageRemoteParty when it is SMS", () => {
    setContactAndChatState(mutableCloneDeep(gandalf), chatWithGandalf);
    setForceMessageRemoteParty(gandalf.phone[0].value);
    const wrap = shallow(<MessageMenuToggle />);
    const menu = wrap.find(Menu);
    expect(menu.prop("itemToFocus")).toEqual(1);
  });

  it("Renders menu and focuses item matching forceMessageRemoteParty for non-IM contact", () => {
    setContactAndChatState(gandalfWithNoIM, smsChatWithGandalf);
    setForceMessageRemoteParty(gandalf.phone[1].value);
    const wrap = shallow(<MessageMenuToggle />);
    const menu = wrap.find(Menu);
    expect(menu.prop("itemToFocus")).toEqual(1);
  });
});
