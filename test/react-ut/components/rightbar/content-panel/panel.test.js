// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import ContentPanel from "components/rightbar/content-panel/panel";
import ChatPane from "components/rightbar/content-panel/chat-pane/chat-pane";
import ContactPane from "components/rightbar/content-panel/contact-pane/pane";

import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { gandalf, bilbo } from "shared/mocks/mock-contacts";
import { sendAnalytic } from "action-creators/ipc-outgoing/analytics-actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/rightbar/content-panel/chat-pane/chat-pane");
jest.mock("components/rightbar/content-panel/contact-pane/pane");
jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/analytics-actions");
jest.mock("src/renderer-logging");
jest.mock("react-redux");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  contactReducer: { selectedContact: bilbo },
  paneManagementReducer: { activeRightPane: "", forceMessageRemoteParty: "" },
  settingsReducer: { settings: { messaging: { isSignedIn: true } } },
  messagingReducer: { chats: [] },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));
const useDispatchMock = jest.spyOn(redux, "useDispatch");
useDispatchMock.mockReturnValue(jest.fn());

describe("<ContentPanel />", () => {
  const setContact = (contact) => (mockState.contactReducer.selectedContact = contact);
  const setActiveTab = (pane) => (mockState.paneManagementReducer.activeRightPane = pane);
  const setChats = (chats) => (mockState.messagingReducer.chats = chats);
  const setForceMessageRemoteParty = (forceMessageRemoteParty) =>
    (mockState.paneManagementReducer.forceMessageRemoteParty = forceMessageRemoteParty);

  it("Renders empty when no active tab is set", () => {
    setContact(gandalf);
    const wrap = shallow(<ContentPanel />);
    expect(wrap.exists()).toEqual(true);
    expect(wrap.children().exists()).toEqual(false);
  });

  it("Renders ChatPane", () => {
    setContact(gandalf);
    setActiveTab("chat");
    const wrap = shallow(<ContentPanel />);
    expect(wrap.containsMatchingElement(<ChatPane />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<ContactPane />)).toBeFalsy();
  });

  it("Renders Contact details", () => {
    setContact(gandalf);
    setActiveTab("contactDetails");
    const wrap = shallow(<ContentPanel />);
    expect(wrap.containsMatchingElement(<ChatPane />)).toBeFalsy();
    expect(wrap.containsMatchingElement(<ContactPane />)).toBeTruthy();
  });

  it("Renders only ContactPane when the contact has no IM and no chats", () => {
    setContact(bilbo);
    setActiveTab("contactDetails");
    const wrap = shallow(<ContentPanel />);

    // ContactPane is shown by default
    expect(wrap.containsMatchingElement(<ContactPane />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<ChatPane />)).toBeFalsy();

    // Tab buttons shouldn't be visible
    expect(wrap.text()).not.toContain("Conversation");
    expect(wrap.text()).not.toContain("Contact Details");

    // We don't expect an analytic to be sent from contactPane when it's the only
    // pane available
    expect(sendAnalytic).toHaveBeenCalledTimes(0);
  });

  it("Renders Chatpane when contact has no IM but has chat history", () => {
    setContact(bilbo);
    setActiveTab("chat");
    setChats([{ uid: bilbo.phone[0].value, message: [{ uid: "thisIsAMessage" }] }]);
    const wrap = shallow(<ContentPanel />);
    expect(wrap.containsMatchingElement(<ChatPane />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<ContactPane />)).toBeFalsy();
  });

  it("Renders Chatpane when contact has no IM or chat history but is initiating SMS", () => {
    setContact(bilbo);
    setActiveTab("chat");
    setChats([]);
    setForceMessageRemoteParty("0123456789");
    const wrap = shallow(<ContentPanel />);
    expect(wrap.containsMatchingElement(<ChatPane />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<ContactPane />)).toBeFalsy();
  });
});
