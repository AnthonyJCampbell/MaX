// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

import ChatMessage from "components/rightbar/content-panel/chat-pane/chat-message/chat-message";
import Avatar from "components/avatar/avatar";
import { initDateTimeFormat } from "components/utils/date-time";

import { mockedT } from "shared/mocks/ts-utils";
import { gandalf } from "shared/mocks/mock-contacts";
import { neverLateMessage, emojiMessage, youAreLateMessage } from "shared/mocks/mock-chats";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { MessageType } from "shared/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/avatar/avatar");
jest.mock("src/renderer-logging");
jest.mock("store/store");

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
  initDateTimeFormat();
});

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<ChatMessage />", () => {
  /**
   * These tests inspect the time when messages were sent that appears in the UI. This depends on
   * the timezone of the machine running the test since Message objects always have their timestamps
   * in UTC.
   *
   * This function takes one of those timestamps, and determines what the time being displayed
   * should be
   * @param {string} timestamp - Timestamp of the form produced by Date, i.e. 2020-06-16T17:31:11Z
   */
  const localTime = (timestamp) => {
    const date = new Date(timestamp);
    const dateTimeFormat = new Intl.DateTimeFormat("en-US", { timeStyle: "short" });
    return dateTimeFormat.format(date);
  };

  it("Displays a simple message", () => {
    const chatMessage = shallow(<ChatMessage message={neverLateMessage} />).html();
    expect(chatMessage).toContain(neverLateMessage.content);
    expect(chatMessage).toContain(localTime(neverLateMessage.timestamp));
  });
  it("Displays an SMS", () => {
    const smsNeverLateMessage = mutableCloneDeep(neverLateMessage);
    smsNeverLateMessage.type = MessageType.SMS;
    const chatMessage = shallow(<ChatMessage message={smsNeverLateMessage} />).html();
    expect(chatMessage).toContain(neverLateMessage.content);
    expect(chatMessage).toContain(`${mockedT("sms")}`);
    expect(chatMessage).toContain(localTime(neverLateMessage.timestamp));
  });
  it("Displays a range of unicode and special characters", () => {
    const chatMessage = shallow(<ChatMessage message={emojiMessage} />).html();
    expect(chatMessage).toContain(emojiMessage.content);
    expect(chatMessage).toContain(localTime(emojiMessage.timestamp));
  });
  it("Displays hyperlinks on regular URLs", () => {
    const hyperlinkMessage = mutableCloneDeep(youAreLateMessage);
    hyperlinkMessage.content = "Have a look at https://www.google.com/";
    const chatMessage = shallow(<ChatMessage message={hyperlinkMessage} />).html();
    expect(
      chatMessage.includes(`<a href="https://www.google.com/" class="linkified" target="_blank">`)
    ).toBeTruthy();
  });
  it("Displays hyperlinks on emails", () => {
    const emailMessage = mutableCloneDeep(youAreLateMessage);
    emailMessage.content = "name@gmail.com";
    const chatMessage = shallow(<ChatMessage message={emailMessage} />).html();
    expect(
      chatMessage.includes(`<a href="mailto:${emailMessage.content}" class="linkified">`)
    ).toBeTruthy();
  });
  it("Doesn't display hyperlinks on messages without intended links", () => {
    const noLinkMessage = mutableCloneDeep(youAreLateMessage);
    noLinkMessage.content = "Hello.can you help me?";
    const chatMessage = shallow(<ChatMessage message={noLinkMessage} />).html();
    expect(chatMessage.includes(`<a href=`)).toBeFalsy();
  });
  it("Displays an avatar if and only if it is not by the user and is the first message", () => {
    let chatMessage = shallow(
      <ChatMessage message={neverLateMessage} contact={gandalf} displayAvatar={true} />
    );
    expect(chatMessage.containsMatchingElement(<Avatar />)).toBeTruthy();

    chatMessage = shallow(
      <ChatMessage message={neverLateMessage} contact={gandalf} displayAvatar={false} />
    );
    expect(chatMessage.containsMatchingElement(<Avatar />)).toBeFalsy();

    chatMessage = shallow(
      <ChatMessage message={youAreLateMessage} contact={gandalf} displayAvatar={true} />
    );
    expect(chatMessage.containsMatchingElement(<Avatar />)).toBeFalsy();

    chatMessage = shallow(
      <ChatMessage message={youAreLateMessage} contact={gandalf} displayAvatar={false} />
    );
    expect(chatMessage.containsMatchingElement(<Avatar />)).toBeFalsy();
  });
});
