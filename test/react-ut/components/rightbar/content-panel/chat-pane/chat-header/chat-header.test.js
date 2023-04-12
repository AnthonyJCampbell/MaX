// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

import { mockedT } from "shared/mocks/ts-utils";
import ChatHeader from "components/rightbar/content-panel/chat-pane/chat-header/chat-header";
import { initDateTimeFormat } from "components/utils/date-time";
import { MessageType } from "shared/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
  initDateTimeFormat();
});

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ChatHeader />", () => {
  it("Displays today", () => {
    const now = new Date().toUTCString();
    const chatHeader = shallow(<ChatHeader date={now} />);

    expect(chatHeader.text()).toBe(`- ${mockedT("today")} -`);
  });

  it("Displays a date older than the last 5 days", () => {
    const oldDate = new Date(2020, 2, 1).toUTCString();
    const chatHeader = shallow(<ChatHeader date={oldDate} />);

    expect(chatHeader.text()).toBe("- March 1, 2020 -");
  });

  it("Displays the new indicator for unread messages", () => {
    const chatHeader = shallow(<ChatHeader isNew={true} />);

    expect(chatHeader.text()).toBe(`- ${mockedT("new")} -`);
  });

  it("Displays the Switched to SMS header", () => {
    const chatHeader = shallow(
      <ChatHeader message={{ messageType: MessageType.SMS, messageUid: "temp" }} />
    );

    expect(chatHeader.text()).toBe(`- ${mockedT("switchedToSMS")} -`);
  });

  it("Displays the Switched to IM header", () => {
    const chatHeader = shallow(
      <ChatHeader message={{ messageType: MessageType.IM, messageUid: "temp" }} />
    );

    expect(chatHeader.text()).toBe(`- ${mockedT("switchedToIM")} -`);
  });

  // We can't have a sensible test for a day within the last five days. This is because the logic to
  // decide which day to display will essentially just replicate the component itself, so there's
  // not much point
});
