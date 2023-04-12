// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import { mockStoreState } from "shared/mocks/mock-states";
import Midbar from "components/midbar/midbar";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import ContactList from "components/midbar/contact-list/contact-list";
import CallList from "components/midbar/call-list/call-list";
import ChatList from "components/midbar/chat-list/chat-list";
import MeetingManagement from "components/midbar/meeting-management/management";
import SearchBar from "components/midbar/search-bar/search-bar";
import Dialpad from "components/ui/Dialpad";
import each from "jest-each";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("components/midbar/contact-list/contact-list");
jest.mock("components/midbar/call-list/call-list");
jest.mock("components/midbar/chat-list/chat-list");
jest.mock("components/midbar/meeting-management/management");
jest.mock("components/midbar/search-bar/search-bar");
jest.mock("components/ui/Dialpad");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  ...mockStoreState,
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    isMidPaneDialPadVisible: true,
  },
};

const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

describe("<Midbar />", () => {
  each([
    ["contacts", <ContactList key={"ContactList"} />],
    ["calls", <CallList key={"CallList"} />],
    ["chat", <ChatList key={"ChatList"} />],
    ["meetings", <MeetingManagement key={"MeetingManagement"} />],
  ]).it("Renders %s", (paneName, content) => {
    mockState.paneManagementReducer.activeMidPane = paneName;

    const wrap = shallow(<Midbar />);
    expect(wrap.containsMatchingElement(content)).toBeTruthy();
  });

  it("Renders the search bar", () => {
    const wrap = shallow(<Midbar />);
    expect(wrap.containsMatchingElement(<SearchBar />)).toBeTruthy();
  });

  it("Renders the dialpad", () => {
    const wrap = shallow(<Midbar />);
    expect(wrap.containsMatchingElement(<Dialpad />)).toBeTruthy();
  });
});
