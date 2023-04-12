// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import AddressContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/address-section";
import * as S from "components/rightbar/content-panel/contact-pane/contact-detail-section/styles";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { bilbo, gandalf } from "shared/mocks/mock-contacts";
import {
  ContactDetailsSection,
  prettyContactDetailSectionHeader,
} from "components/rightbar/content-panel/contact-pane/shared";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { prettyContactDetailType } from "components/utils/common";
import { PostalAddressType } from "src/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("components/rightbar/content-panel/contact-pane/shared");
jest.mock("components/utils/common");
jest.mock("react-redux");

const useSelectorMock = jest.spyOn(redux, "useSelector");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<AddressContactDetailSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders the address section with one address", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: bilbo,
    });
    const wrap = shallow(<AddressContactDetailSection />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>
          {bilbo.postal[0].line.join(", ").replace(/(\r)?\n/g, ", ")}
        </S.DetailValueGrey>
      )
    ).toBeTruthy();
    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.ADDRESS);
    expect(prettyContactDetailType).toHaveBeenCalledWith(PostalAddressType.HOME_ADDRESS);
  });

  it("Renders the address section with max addresses", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: gandalf,
    });
    const wrap = shallow(<AddressContactDetailSection />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>
          {gandalf.postal[0].line
            .join(", ")
            .replace(/[\r][\n]/g, ", ")
            .replace(/[\n]/g, ", ")}
        </S.DetailValueGrey>
      )
    ).toBeTruthy();
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>
          {gandalf.postal[1].line
            .join(", ")
            .replace(/[\r][\n]/g, ", ")
            .replace(/[\n]/g, ", ")}
        </S.DetailValueGrey>
      )
    ).toBeTruthy();

    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.ADDRESS);
    expect(prettyContactDetailType).toHaveBeenCalledWith(PostalAddressType.HOME_ADDRESS);
    expect(prettyContactDetailType).toHaveBeenCalledWith(PostalAddressType.WORK_ADDRESS);
  });

  it("Doesn't render the address section if no addresses", () => {
    const gandalfNoAddress = mutableCloneDeep(gandalf);
    gandalfNoAddress.postal = [];
    useSelectorMock.mockReturnValue({
      selectedContact: gandalfNoAddress,
    });
    const wrap = shallow(<AddressContactDetailSection />);
    expect(wrap.containsMatchingElement(<S.DetailValueGrey></S.DetailValueGrey>)).toBeFalsy();
    expect(prettyContactDetailSectionHeader).not.toHaveBeenCalledWith(
      ContactDetailsSection.ADDRESS
    );
    expect(prettyContactDetailType).not.toHaveBeenCalled();
  });
});
