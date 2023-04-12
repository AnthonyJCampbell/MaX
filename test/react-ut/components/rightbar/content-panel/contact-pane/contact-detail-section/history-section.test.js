// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import HistoryContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/history-section";
import * as S from "components/rightbar/content-panel/contact-pane/contact-detail-section/styles";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { bilbo, gandalf, peter } from "shared/mocks/mock-contacts";
import {
  missedHistoricCall,
  inboundHistoricCall,
  outboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import { prettyContactDetailType, prettyCallDuration } from "components/utils/common";
import { convertToRelativeTime } from "components/utils/date-time";
import {
  ContactDetailsSection,
  prettyContactDetailSectionHeader,
} from "components/rightbar/content-panel/contact-pane/shared";
import IncomingCall from "assets/shared/history-incoming-call.svg";
import MissedCall from "assets/shared/history-missed-call.svg";
import OutgoingCall from "assets/shared/history-outgoing-call.svg";
import { PhoneNumberType } from "src/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("components/rightbar/content-panel/contact-pane/shared");
jest.mock("components/utils/common");
jest.mock("components/utils/date-time");
jest.mock("react-redux");

const mockState = {
  callHistoryReducer: { historicCalls: [] },
  contactReducer: { selectedContact: {}, contacts: [gandalf, bilbo, peter] },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<HistoryContactDetailSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders the history section with one entry", () => {
    mockState.contactReducer.selectedContact = peter;
    mockState.callHistoryReducer.historicCalls = [
      missedHistoricCall,
      inboundHistoricCall,
      outboundHistoricCall,
    ];
    const wrap = shallow(<HistoryContactDetailSection />);

    expect(wrap.containsMatchingElement(<S.HistoryImage src={IncomingCall} alt="" />)).toBeTruthy();

    expect(prettyContactDetailType).toHaveBeenCalledWith(PhoneNumberType.OTHER_NUMBER);
    expect(prettyCallDuration).toHaveBeenCalledWith(inboundHistoricCall.duration);
    expect(convertToRelativeTime).toHaveBeenCalledWith(inboundHistoricCall.datetimeStarted, true);
    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.HISTORY);
  });

  it("Renders the history section with multiple entries in order", () => {
    mockState.contactReducer.selectedContact = gandalf;
    mockState.callHistoryReducer.historicCalls = [
      missedHistoricCall,
      inboundHistoricCall,
      outboundHistoricCall,
    ];
    const wrap = shallow(<HistoryContactDetailSection />);

    const CallImages = wrap.find(S.HistoryImage);

    expect(CallImages.first().props().src).toEqual(MissedCall);
    expect(CallImages.at(1).props().src).toEqual(OutgoingCall);

    expect(prettyContactDetailType).toHaveBeenCalledTimes(2);
    expect(prettyContactDetailType).toHaveBeenCalledWith(PhoneNumberType.MOBILE_NUMBER);
    expect(prettyCallDuration).toHaveBeenCalledWith(missedHistoricCall.duration);
    expect(prettyCallDuration).toHaveBeenCalledWith(outboundHistoricCall.duration);
    expect(convertToRelativeTime).toHaveBeenCalledWith(missedHistoricCall.datetimeStarted, true);
    expect(convertToRelativeTime).toHaveBeenCalledWith(outboundHistoricCall.datetimeStarted, true);
    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.HISTORY);
  });

  it("Doesn't render the history section if no history", () => {
    mockState.contactReducer.selectedContact = bilbo;
    mockState.callHistoryReducer.historicCalls = [
      missedHistoricCall,
      inboundHistoricCall,
      outboundHistoricCall,
    ];
    const wrap = shallow(<HistoryContactDetailSection />);

    expect(wrap.containsMatchingElement(<S.HistoryImage src={IncomingCall} alt="" />)).toBeFalsy();
    expect(wrap.containsMatchingElement(<S.HistoryImage src={OutgoingCall} alt="" />)).toBeFalsy();
    expect(wrap.containsMatchingElement(<S.HistoryImage src={MissedCall} alt="" />)).toBeFalsy();

    expect(prettyContactDetailType).not.toHaveBeenCalledWith(PhoneNumberType.WORK_NUMBER);
    expect(prettyCallDuration).not.toHaveBeenCalled();
    expect(convertToRelativeTime).not.toHaveBeenCalled();
    expect(prettyContactDetailSectionHeader).not.toHaveBeenCalledWith(
      ContactDetailsSection.HISTORY
    );
  });
});
