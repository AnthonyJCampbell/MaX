// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import InitialsAvatar from "components/avatar/initials-avatar/initials-avatar";
import { bilbo } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";
configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<InitialsAvatar />", () => {
  it("Displays the correct uppercase initials when rendering in the sidebar", () => {
    const wrap = shallow(
      <InitialsAvatar firstName="Eduardo" lastName="neumann" isSidebar={true} />
    );
    expect(wrap.text()).toMatch("EN");
  });

  it("Displays the correct initials for a contact with a first and last name", () => {
    const wrap = shallow(
      <InitialsAvatar firstName={bilbo.identity.firstName} lastName={bilbo.identity.lastName} />
    );
    expect(wrap.text()).toMatch("BB");
  });

  it("Displays the correct initial for a contact with only a first name", () => {
    const bilboNoLastName = mutableCloneDeep(bilbo);
    bilboNoLastName.identity.lastName = "";
    const wrap = shallow(<InitialsAvatar firstName={bilboNoLastName.identity.firstName} />);
    expect(wrap.text()).toMatch("B");
  });

  it("Displays the correct initial for a contact with only a last name", () => {
    const bilboNoFirstName = mutableCloneDeep(bilbo);
    bilboNoFirstName.identity.firstName = "";
    const wrap = shallow(<InitialsAvatar lastName={bilboNoFirstName.identity.lastName} />);
    expect(wrap.text()).toMatch("B");
  });
});
