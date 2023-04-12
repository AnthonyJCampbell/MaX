// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import PhoneContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/phone-section";
import PhoneDetails from "components/rightbar/content-panel/contact-pane/contact-detail-section/phone-details";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { bilbo, gandalf } from "shared/mocks/mock-contacts";
import {
  ContactDetailsSection,
  prettyContactDetailSectionHeader,
} from "components/rightbar/content-panel/contact-pane/shared";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { PhoneNumberType } from "src/types";
import { prettyContactDetailType } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import log from "src/renderer-logging";
import IconButton from "components/ui/IconButton/IconButton";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("components/rightbar/content-panel/contact-pane/shared");
jest.mock("components/utils/common");
jest.mock("components/utils/phone-formatter");
jest.mock("react-redux");

const useSelectorMock = jest.spyOn(redux, "useSelector");
const useDispatchMock = jest.spyOn(redux, "useDispatch");
useDispatchMock.mockReturnValue(jest.fn());

formatPhoneNumber.mockImplementation((phoneNumber, easRegion) => `${phoneNumber}-${easRegion}`);

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<PhoneContactDetailSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders the phone section with one number", () => {
    prettyContactDetailType.mockImplementation((type) => type);
    useSelectorMock.mockImplementation((callback) =>
      callback({
        settingsReducer: {
          settings: {
            general: {
              easRegion: "GB",
            },
          },
        },
        contactReducer: {
          selectedContact: bilbo,
        },
      })
    );
    const wrap = shallow(<PhoneContactDetailSection />);
    const phoneDetails = wrap.find(PhoneDetails);
    expect(phoneDetails).toHaveLength(1);
    expect(phoneDetails.prop("data")).toEqual(bilbo.phone[0]);
    expect(phoneDetails.prop("index")).toEqual(0);
    expect(phoneDetails.prop("easRegion")).toEqual("GB");

    const button = wrap.find(IconButton);
    expect(button).toHaveLength(1);

    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.PHONE);
  });

  it("Renders the phone section with max numbers", () => {
    const gandalfAllNumbers = mutableCloneDeep(gandalf);
    gandalfAllNumbers.phone = [
      ...gandalf.phone,
      { value: "1234", type: PhoneNumberType.WORK_NUMBER },
      { value: "5678", type: PhoneNumberType.HOME_NUMBER },
      { value: "9123", type: PhoneNumberType.OTHER_NUMBER },
    ];
    useSelectorMock.mockImplementation((callback) =>
      callback({
        settingsReducer: {
          settings: {
            general: {
              easRegion: "GB",
            },
          },
        },
        contactReducer: {
          selectedContact: gandalfAllNumbers,
        },
      })
    );
    const wrap = shallow(<PhoneContactDetailSection />);
    const phoneDetails = wrap.find(PhoneDetails);
    expect(phoneDetails).toHaveLength(5);

    phoneDetails.forEach((item, index) => {
      expect(item.prop("data")).toEqual(gandalfAllNumbers.phone[index]);
      expect(item.prop("index")).toEqual(index);
      expect(item.prop("easRegion")).toEqual("GB");
    });

    const button = wrap.find(IconButton);
    expect(button).toHaveLength(5);

    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.PHONE);
  });

  it("Doesn't render the phone section if no numbers", () => {
    const gandalfNoNumbers = mutableCloneDeep(gandalf);
    gandalfNoNumbers.phone = [];
    useSelectorMock.mockImplementation((callback) =>
      callback({
        settingsReducer: {
          settings: {
            general: {
              easRegion: "GB",
            },
          },
        },
        contactReducer: {
          selectedContact: gandalfNoNumbers,
        },
      })
    );
    const wrap = shallow(<PhoneContactDetailSection />);
    expect(wrap.exists(PhoneDetails)).toBeFalsy();
    expect(prettyContactDetailSectionHeader).not.toHaveBeenCalledWith(ContactDetailsSection.PHONE);
    expect(prettyContactDetailType).not.toHaveBeenCalled();
  });
});
