// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ContactPane from "components/rightbar/content-panel/contact-pane/pane";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { peter, bilbo, gandalf } from "shared/mocks/mock-contacts";
import * as redux from "react-redux";
import BasicContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/basic-section";
import PhoneContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/phone-section";
import EmailContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/email-section";
import AddressContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/address-section";
import HistoryContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/history-section";
import { ContactDetailsSection } from "components/rightbar/content-panel/contact-pane/shared";
import each from "jest-each";
import { mutableCloneDeep, mockedT } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ContactPane />", () => {
  const emptyBilbo = mutableCloneDeep(bilbo);
  emptyBilbo.postal = [];
  emptyBilbo.phone = [];
  emptyBilbo.email = [];

  const halfFilledGandalf = mutableCloneDeep(gandalf);
  halfFilledGandalf.postal = [];

  each([
    ["peter", peter],
    ["halfFilledGandalf", halfFilledGandalf],
    ["emptyBilbo", emptyBilbo],
  ]).it("Renders all sections for any contact - %s", (_testName, contact) => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockReturnValue({
      selectedContact: contact,
    });
    const wrap = shallow(<ContactPane />);
    expect(
      wrap.containsMatchingElement(
        <BasicContactDetailSection type={ContactDetailsSection.NICKNAME} />
      )
    ).toBeTruthy();
    expect(
      wrap.containsMatchingElement(
        <BasicContactDetailSection type={ContactDetailsSection.JOB_TITLE} />
      )
    ).toBeTruthy();
    expect(
      wrap.containsMatchingElement(
        <BasicContactDetailSection type={ContactDetailsSection.COMPANY} />
      )
    ).toBeTruthy();
    expect(wrap.containsMatchingElement(<PhoneContactDetailSection />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<EmailContactDetailSection />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<AddressContactDetailSection />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<HistoryContactDetailSection />)).toBeTruthy();
  });

  it('Shows "Add as a Contact" button when contact is not saved', () => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    const nonContactBilbo = mutableCloneDeep(bilbo);
    nonContactBilbo.uid = "";
    useSelectorMock.mockReturnValue({
      selectedContact: nonContactBilbo,
    });

    const wrap = shallow(<ContactPane />);
    expect(wrap.text()).toContain(mockedT("addAsAContact"));
  });

  it('Does not show "Add as a Contact" button when contact is saved', () => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockReturnValue({
      selectedContact: bilbo,
    });

    const wrap = shallow(<ContactPane />);
    expect(wrap.text()).not.toContain(mockedT("addAsAContact"));
  });
});
