// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LowerMeetingButton from "components/midbar/meeting-management/lower-meeting-button/lower-button";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<LowerMeetingButton />", () => {
  const clickAction = jest.fn();
  it("Renders and handles clicks", () => {
    const wrap = shallow(<LowerMeetingButton text={"Join a meeting"} clickAction={clickAction} />);

    expect(wrap.text()).toMatch("Join a meeting");
    expect(clickAction).not.toHaveBeenCalled();
    wrap.simulate("click");
    expect(clickAction).toHaveBeenCalled();
  });
});
