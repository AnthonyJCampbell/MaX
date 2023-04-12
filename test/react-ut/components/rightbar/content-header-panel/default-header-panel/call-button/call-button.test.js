// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import CallIcon from "assets/rightbar/button-call.svg";
import CallMultiIcon from "assets/rightbar/button-call-multiple.svg";
import CallButton from "components/rightbar/content-header-panel/default-header-panel/call-button/call-button";
import CallMenu from "components/rightbar/content-header-panel/default-header-panel/call-button/call-menu";
import TopButton from "components/rightbar/content-header-panel/top-button/button";
import TopMenuButton from "components/rightbar/content-header-panel/top-button/menu-button";

import { mockedT } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("components/rightbar/content-header-panel/top-button/button");
jest.mock("components/rightbar/content-header-panel/top-button/menu-button");
jest.mock("components/rightbar/content-header-panel/default-header-panel/call-button/call-menu");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<CallButton />", () => {
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  useSelectorMock.mockReturnValue({
    disabledCallButton: "",
  });

  it("Renders a call button with one number to call ", () => {
    const phoneNumbers = [{ value: "02080362416", type: "MOBILE_NUMBER" }];
    const wrap = shallow(<CallButton phoneNumbers={phoneNumbers} />);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={CallIcon} disabled={false} />)
    ).toBeTruthy();
    // TODO check we're passing on the right function to TopButton - is it possible?
  });

  it("Renders a call button with no number to call ", () => {
    const phoneNumbers = [];
    const wrap = shallow(<CallButton phoneNumbers={phoneNumbers} />);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={CallIcon} disabled={true} />)
    ).toBeTruthy();
    // TODO check we're not passing any function to TopButton - is it possible?
  });

  it("Renders a call button with multiple numbers to call ", () => {
    const phoneNumbers = [
      { value: "+12025550192", type: "MOBILE_NUMBER" },
      { value: "01632960562", type: "WORK_NUMBER" },
      { value: "02080362417", type: "HOME_NUMBER" },
      { value: "02080362418", type: "FAX_NUMBER" },
    ];
    const wrap = shallow(<CallButton phoneNumbers={phoneNumbers} />);
    expect(
      wrap.containsMatchingElement(
        <TopMenuButton
          imageSrc={CallMultiIcon}
          disabled={false}
          menu={<CallMenu phoneNumbers={phoneNumbers} />}
          label={mockedT("callMultiLabel", { count: 4 })}
        />
      )
    ).toBeTruthy();
  });
});
