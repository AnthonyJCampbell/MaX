// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import * as redux from "react-redux";
import { bilbo } from "shared/mocks/mock-contacts";
import { bilboCall } from "shared/mocks/mock-active-calls";

import "test/react-ut/components/require-mock";
import IncomingCallFrame from "components/incoming-call-frame/frame";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import { CallStatus, WindowTypes } from "src/types";

import { mutableCloneDeep, mockedT } from "shared/mocks/ts-utils";
import { mockStoreState } from "src/shared/mocks/mock-states";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("components/utils/phone-formatter");
jest.mock("components/avatar/avatar");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

formatPhoneNumber.mockImplementation((phoneNumber, easRegion) => `${phoneNumber}-${easRegion}`);

const mockState = mutableCloneDeep(mockStoreState);
mockState.windowReducer.type = WindowTypes.incomingCall;
mockState.settingsReducer.settings.general.easRegion = "US";

const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

const incomingCallFromBilbo = mutableCloneDeep(bilboCall);
incomingCallFromBilbo.status = CallStatus.INCOMING;

describe("<IncomingCallFrame />", () => {
  const setState = (contact, call) => {
    mockState.contactReducer.contacts = [contact];
    mockState.windowReducer.metadata = { remoteParty: call.remoteParty };
    mockState.windowReducer.identifiers = { uid: call.uid };
  };
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Renders", () => {
    setState(mutableCloneDeep(bilbo), incomingCallFromBilbo);
    const window = shallow(<IncomingCallFrame />);

    expect(window.text()).toContain("Bilbo Baggins");
    expect(window.text()).toContain(
      formatPhoneNumber(bilbo.phone[0].value, mockState.settingsReducer.settings.general.easRegion)
    );
  });

  it("Renders a default detail section when the user doesn't have a name on record", () => {
    const bilboNoName = mutableCloneDeep(bilbo);
    bilboNoName.identity.firstName = "";
    bilboNoName.identity.lastName = "";
    setState(bilboNoName, incomingCallFromBilbo);
    const window = shallow(<IncomingCallFrame />);

    expect(window.text()).toContain(mockedT("incomingCall"));
    expect(window.text()).toContain(
      formatPhoneNumber(bilbo.phone[0].value, mockState.settingsReducer.settings.general.easRegion)
    );
  });

  it("Renders a default profile picture when a user has none", () => {
    const bilboNoAvatarNoName = mutableCloneDeep(bilbo);
    bilboNoAvatarNoName.identity.profilePicture = "";
    bilboNoAvatarNoName.identity.firstName = "";
    bilboNoAvatarNoName.identity.lastName = "";
    setState(bilboNoAvatarNoName, incomingCallFromBilbo);
    const window = shallow(<IncomingCallFrame />);

    expect(window.text()).toContain(mockedT("incomingCall"));
    expect(window.find({ alt: "Default profile picture" })).toBeTruthy();
  });
});
