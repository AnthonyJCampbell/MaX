// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import TopMenuButton from "components/rightbar/content-header-panel/top-button/menu-button";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as S from "components/rightbar/content-header-panel/top-button/styles";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/utils/common");
jest.mock("react-redux");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, useState: jest.fn() };
});
jest.mock("components/rightbar/content-header-panel/in-call-header-panel/audio-menu");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<TopMenuButton />", () => {
  it("Renders", () => {
    const setState = jest.fn();
    const useStateMock = jest.spyOn(React, "useState");
    useStateMock.mockImplementation((init) => [init, setState]);

    const wrap = shallow(
      <TopMenuButton imageSrc="mockImageSrc" altName={"Name"} menu={<div />} parent={"parent"} />
    );
    expect(setState).not.toHaveBeenCalled();
    wrap.find(S.StyleTopButton).simulate("click");
    expect(setState).toHaveBeenCalledWith(true);
  });
});
