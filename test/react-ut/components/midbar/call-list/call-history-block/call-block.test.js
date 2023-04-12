// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import "test/react-ut/components/require-mock";
import CallBlock from "components/midbar/call-list/call-history-block/call-block";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { setSelectedContact, focusRightbarMessage } from "action-creators/navigation/actions";
import { updateHistoricCall } from "action-creators/ipc-outgoing/call-history-actions";
import { gandalf, peter } from "shared/mocks/mock-contacts";
import {
  missedHistoricCall,
  inboundHistoricCall,
  outboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import { fullname } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import each from "jest-each";
import { Contact } from "src/types";

import IncomingCall from "assets/shared/history-incoming-call.svg";
import MissedCall from "assets/shared/history-missed-call.svg";
import OutgoingCall from "assets/shared/history-outgoing-call.svg";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/call-history-actions");
jest.mock("react-redux");
jest.mock("components/utils/common");
jest.mock("components/utils/phone-formatter");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  callHistoryReducer: { historicCalls: [] },
  contactReducer: { contacts: [] },
  settingsReducer: {
    settings: {
      general: {
        easRegion: "GB",
      },
    },
  },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));
formatPhoneNumber.mockImplementation((phoneNumber, easRegion) => `${phoneNumber}-${easRegion}`);

describe("<CallBlock />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());
  fullname.mockReturnValue("MockReturn");

  each([
    ["Incoming Call", peter, inboundHistoricCall, IncomingCall],
    ["Outgoing Call", gandalf, outboundHistoricCall, OutgoingCall],
    ["Missed Call", gandalf, missedHistoricCall, MissedCall],
  ]).it("Renders an %s", (_, contact, call, image) => {
    mockState.callHistoryReducer.historicCalls = [call];
    mockState.contactReducer.contacts = [contact];

    const wrap = shallow(<CallBlock call={call} />);
    expect(fullname).toHaveBeenCalledWith(contact);
    expect(wrap.containsMatchingElement(<img src={image} alt="" />)).toBeTruthy();
    expect(wrap.text()).toContain("MockReturn");
    expect(wrap.text()).toContain(formatPhoneNumber(contact.phone[0].value, "GB"));
  });

  it("Renders without a contact match", () => {
    const wrap = shallow(<CallBlock call={inboundHistoricCall} />);
    expect(fullname).not.toHaveBeenCalled();
    expect(wrap.containsMatchingElement(<img src={IncomingCall} alt="" />)).toBeTruthy();
    expect(wrap.text()).toContain(formatPhoneNumber(inboundHistoricCall.remoteParty, "GB"));
  });

  it("Changes the selectedContact and focus on click", () => {
    const seenMissedHistoricCall = mutableCloneDeep(missedHistoricCall);
    seenMissedHistoricCall.attention = false;
    const wrap = shallow(<CallBlock call={seenMissedHistoricCall} />);
    wrap.simulate("click");
    expect(setSelectedContact).toHaveBeenCalledWith(gandalf);
    expect(focusRightbarMessage).toHaveBeenCalled();
    expect(updateHistoricCall).not.toHaveBeenCalled();
  });

  it("Clicking an non-contact block still calls setSelectedContact", () => {
    const wrap = shallow(<CallBlock call={inboundHistoricCall} />);
    wrap.simulate("click");
    expect(setSelectedContact).toHaveBeenCalledWith(
      Contact.fromPhoneNumber(inboundHistoricCall.remoteParty)
    );
    expect(focusRightbarMessage).not.toHaveBeenCalled();
    expect(updateHistoricCall).not.toHaveBeenCalled();
  });

  it("Updates the attention state on click", () => {
    const wrap = shallow(<CallBlock call={missedHistoricCall} />);
    wrap.simulate("click");
    expect(setSelectedContact).toHaveBeenCalledWith(gandalf);
    expect(focusRightbarMessage).toHaveBeenCalled();
    expect(updateHistoricCall).toHaveBeenCalled();
  });
});
