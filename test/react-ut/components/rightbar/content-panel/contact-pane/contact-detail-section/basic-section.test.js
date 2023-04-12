// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import BasicContactDetailSection from "components/rightbar/content-panel/contact-pane/contact-detail-section/basic-section";
import * as S from "components/rightbar/content-panel/contact-pane/contact-detail-section/styles";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { gandalf } from "shared/mocks/mock-contacts";
import {
  ContactDetailsSection,
  prettyContactDetailSectionHeader,
} from "components/rightbar/content-panel/contact-pane/shared";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("components/rightbar/content-panel/contact-pane/shared");
jest.mock("react-redux");

const useSelectorMock = jest.spyOn(redux, "useSelector");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<BasicContactDetailSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders the nickname section", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: gandalf,
    });
    const wrap = shallow(<BasicContactDetailSection type={ContactDetailsSection.NICKNAME} />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>{gandalf.identity.nickname}</S.DetailValueGrey>
      )
    ).toBeTruthy();
    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.NICKNAME);
  });
  it("Doesn't render the nickname section if no nickname", () => {
    const gandalfNoNickname = mutableCloneDeep(gandalf);
    gandalfNoNickname.identity.nickname = "";
    useSelectorMock.mockReturnValue({
      selectedContact: gandalfNoNickname,
    });
    const wrap = shallow(<BasicContactDetailSection type={ContactDetailsSection.NICKNAME} />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>{gandalf.identity.nickname}</S.DetailValueGrey>
      )
    ).toBeFalsy();
    expect(prettyContactDetailSectionHeader).not.toHaveBeenCalledWith(
      ContactDetailsSection.NICKNAME
    );
  });

  it("Renders the job title section", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: gandalf,
    });
    const wrap = shallow(<BasicContactDetailSection type={ContactDetailsSection.JOB_TITLE} />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>{gandalf.identity.jobTitle}</S.DetailValueGrey>
      )
    ).toBeTruthy();
    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.JOB_TITLE);
  });
  it("Doesn't render the job title section if no job title", () => {
    const gandalfNoJob = mutableCloneDeep(gandalf);
    gandalfNoJob.identity.jobTitle = "";
    useSelectorMock.mockReturnValue({
      selectedContact: gandalfNoJob,
    });
    const wrap = shallow(<BasicContactDetailSection type={ContactDetailsSection.JOB_TITLE} />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>{gandalf.identity.jobTitle}</S.DetailValueGrey>
      )
    ).toBeFalsy();
    expect(prettyContactDetailSectionHeader).not.toHaveBeenCalledWith(
      ContactDetailsSection.JOB_TITLE
    );
  });

  it("Renders the company section", () => {
    useSelectorMock.mockReturnValue({
      selectedContact: gandalf,
    });
    const wrap = shallow(<BasicContactDetailSection type={ContactDetailsSection.COMPANY} />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>{gandalf.identity.organisation}</S.DetailValueGrey>
      )
    ).toBeTruthy();
    expect(prettyContactDetailSectionHeader).toHaveBeenCalledWith(ContactDetailsSection.COMPANY);
  });
  it("Doesn't render the company section if no company", () => {
    const gandalfNoCompany = mutableCloneDeep(gandalf);
    gandalfNoCompany.identity.organisation = "";
    useSelectorMock.mockReturnValue({
      selectedContact: gandalfNoCompany,
    });
    const wrap = shallow(<BasicContactDetailSection type={ContactDetailsSection.COMPANY} />);
    expect(
      wrap.containsMatchingElement(
        <S.DetailValueGrey>{gandalf.identity.organisation}</S.DetailValueGrey>
      )
    ).toBeFalsy();
    expect(prettyContactDetailSectionHeader).not.toHaveBeenCalledWith(
      ContactDetailsSection.COMPANY
    );
  });
});
