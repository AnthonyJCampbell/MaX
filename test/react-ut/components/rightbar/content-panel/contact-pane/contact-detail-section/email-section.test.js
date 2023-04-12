// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import EmailContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/email-section";
import * as S from "components/rightbar/content-panel/contact-pane/contact-detail-section/styles";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { bilbo, gandalf, peter } from "shared/mocks/mock-contacts";
import {
  ContactDetailsSection,
  prettyContactDetailSectionHeader,
} from "components/rightbar/content-panel/contact-pane/shared";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("components/rightbar/content-panel/contact-pane/shared");
jest.mock("react-redux");

const useSelectorMock = jest.spyOn(redux, "useSelector");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<EmailContactDetailSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders the email section with one email", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: bilbo,
    });
    const wrap = shallow(<EmailContactDetailSection />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueLink href={`mailto:${bilbo.email[0].address}`}>
          <span>{bilbo.email[0].address}</span>
        </S.DetailValueLink>
      )
    ).toBeTruthy();
    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.EMAIL);
  });

  it("Renders the email section with max emails", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: peter,
    });
    const wrap = shallow(<EmailContactDetailSection />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueLink href={`mailto:${peter.email[0].address}`}>
          <span>{peter.email[0].address}</span>
        </S.DetailValueLink>
      )
    ).toBeTruthy();
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueLink href={`mailto:${peter.email[1].address}`}>
          <span>{peter.email[1].address}</span>
        </S.DetailValueLink>
      )
    ).toBeTruthy();

    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.EMAIL);
  });

  it("Doesn't render the email section if no emails", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: gandalf,
    });
    const wrap = shallow(<EmailContactDetailSection />);
    expect(wrap.containsMatchingElement(<S.DetailValueLink></S.DetailValueLink>)).toBeFalsy();
    expect(prettyContactDetailSectionHeader).not.toHaveBeenCalledWith(ContactDetailsSection.EMAIL);
  });
});
