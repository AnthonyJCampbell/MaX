// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import Rightbar, { TabName } from "components/rightbar/rightbar";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { peter } from "shared/mocks/mock-contacts";
import { fullname, prettyPresenceWithStatus } from "components/utils/common";
import { sendAnalytic } from "action-creators/ipc-outgoing/analytics-actions";
import { setActiveRightPane } from "action-creators/navigation/actions";
import ContentHeaderPanel from "components/rightbar/content-header-panel/panel";
import ContentPanel from "components/rightbar/content-panel/panel";
import log from "src/renderer-logging";
import Tabs from "components/ui/Tabs";
configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/analytics-actions");
jest.mock("components/rightbar/content-header-panel/panel");
jest.mock("components/rightbar/content-panel/panel");
jest.mock("components/utils/common");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  contactReducer: { selectedContact: peter },
  paneManagementReducer: { activeRightPane: "" },
  settingsReducer: { settings: { messaging: { isSignedIn: true } } },
  messagingReducer: { chats: [] },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));
const useDispatchMock = jest.spyOn(redux, "useDispatch");
useDispatchMock.mockReturnValue(jest.fn());

describe("<Rightbar />", () => {
  fullname.mockReturnValue("MockNameReturn");
  prettyPresenceWithStatus.mockReturnValue("MockPresenceReturn");
  const label = "MockNameReturn, MockPresenceReturn";

  it("Renders", () => {
    const wrap = shallow(<Rightbar />);
    expect(wrap.prop("aria-label")).toEqual(label);
    expect(wrap.exists(ContentHeaderPanel)).toBe(true);
    expect(wrap.exists(Tabs)).toBe(true);
    expect(wrap.exists(ContentPanel)).toBe(true);
  });

  it("Tab Handle should send analytics when tab clicked is CONTACT_DETAILS", () => {
    const wrap = shallow(<Rightbar />);
    const tabs = wrap.find(Tabs);

    const tabHandler = tabs.prop("onClick");
    tabHandler(TabName.CONTACT_DETAILS);

    expect(setActiveRightPane).toHaveBeenCalledWith(TabName.CONTACT_DETAILS);
    expect(sendAnalytic).toHaveBeenCalledWith("VIEW_CONTACT_DETAILS");
  });

  it("Tab Handle should NOT send analytics when tab clicked is CHAT", () => {
    const wrap = shallow(<Rightbar />);
    const tabs = wrap.find(Tabs);

    const tabHandler = tabs.prop("onClick");
    tabHandler(TabName.CHAT);

    expect(setActiveRightPane).toHaveBeenCalledWith(TabName.CHAT);
    expect(sendAnalytic).not.toHaveBeenCalled();
  });
});
