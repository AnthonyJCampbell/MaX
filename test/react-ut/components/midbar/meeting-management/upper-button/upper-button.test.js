// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import UpperMeetingButton from "components/midbar/meeting-management/upper-meeting-button/upper-button";
import CreateMeetingIcon from "assets/midbar/create-meeting-icon.png";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<UpperMeetingButton />", () => {
  const clickAction = jest.fn();
  it("Renders and handles clicks", () => {
    const wrap = shallow(
      <UpperMeetingButton
        image={CreateMeetingIcon}
        text={"Create"}
        ariaLabel="Create a Meeting"
        clickAction={clickAction}
      />
    );

    expect(wrap.text()).toMatch("Create");
    expect(clickAction).not.toHaveBeenCalled();
    wrap.simulate("click");
    expect(clickAction).toHaveBeenCalled();
  });
});
