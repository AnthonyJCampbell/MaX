// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import DNDBanner from "src/components/banner/dnd-banner";
import Banner from "src/components/ui/Banner";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");

beforeEach(() => {
  log.test(`Start running: ${expect.getState().currentTestName}`);
});

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<DNDBanner />", () => {
  it("Renders properly", () => {
    const wrap = shallow(<DNDBanner />);
    const banner = wrap.find(Banner);
    expect(banner.exists()).toBe(true);
    expect(banner.prop("content")).toEqual("dNDBanner");
  });
});
