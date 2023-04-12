// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import PhoneDetails from "components/rightbar/content-panel/contact-pane/contact-detail-section/phone-details";
import * as S from "components/rightbar/content-panel/contact-pane/contact-detail-section/styles";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { bilbo } from "shared/mocks/mock-contacts";
import { createActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { PhoneNumberType } from "src/types";
import { prettyContactDetailType } from "components/utils/common";
import { mockedT } from "shared/mocks/ts-utils";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("components/rightbar/content-panel/contact-pane/shared");
jest.mock("components/utils/common");
jest.mock("components/utils/phone-formatter");
jest.mock("action-creators/ipc-outgoing/active-calls-actions");
jest.mock("react-redux");

const useDispatchMock = jest.spyOn(redux, "useDispatch");
const useSelectorMock = jest.spyOn(redux, "useSelector");
useDispatchMock.mockReturnValue(jest.fn());

formatPhoneNumber.mockImplementation((phoneNumber, easRegion) => `${phoneNumber}-${easRegion}`);
prettyContactDetailType.mockImplementation((type) => type);
const bilboFormattedNumbers = bilbo.phone.map((phone) => formatPhoneNumber(phone, "GB"));

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<PhoneDetails />", () => {
  const preventDefault = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders properly", () => {
    const wrap = shallow(<PhoneDetails data={bilbo.phone[0]} index={0} easRegion="GB" />);
    const phoneDetails = wrap.find(S.DetailValueLink);
    expect(phoneDetails.prop("href")).toEqual(`tel:${bilbo.phone[0].value}`);
    expect(phoneDetails.prop("aria-label")).toEqual(
      `${mockedT("call")} ${bilboFormattedNumbers[0]}, ${bilbo.phone[0].type}`
    );
    expect(phoneDetails.text()).toEqual(bilboFormattedNumbers[0]);

    expect(prettyContactDetailType).toHaveBeenCalledWith(PhoneNumberType.WORK_NUMBER);
  });

  it("Handles clicking the number", () => {
    const wrap = shallow(
      <PhoneDetails data={bilbo.phone[0]} index={0} easRegion="GB" callback={createActiveCall} />
    );
    wrap.find(S.DetailValueLink).simulate("click", { preventDefault });
    expect(createActiveCall).toHaveBeenCalledWith(bilbo.phone[0].value);
  });

  it("Doesn't render phone type if temporary contact", () => {
    useSelectorMock.mockReturnValue("");
    const wrap = shallow(<PhoneDetails data={bilbo.phone[0]} index={0} easRegion="GB" />);
    const phoneDetails = wrap.find(S.DetailValueLink);

    expect(phoneDetails.text()).toEqual(bilboFormattedNumbers[0]);
    expect(phoneDetails.prop("aria-label")).toEqual(
      `${mockedT("call")} ${bilboFormattedNumbers[0]}`
    );
  });
});
