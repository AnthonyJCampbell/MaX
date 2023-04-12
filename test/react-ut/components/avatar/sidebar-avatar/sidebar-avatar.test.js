// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SidebarAvatar from "components/avatar/sidebar-avatar/sidebar-avatar";
import * as S from "components/avatar/sidebar-avatar/styles";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("react-redux");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, useState: jest.fn() };
});

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<SidebarAvatar />", () => {
  const setState = jest.fn();
  const useStateMock = jest.spyOn(React, "useState");
  useStateMock.mockImplementation((init) => [init, setState]);

  it("Shows the Avatar Menu when clicking on the Avatar button", () => {
    const wrap = shallow(<SidebarAvatar />);

    expect(setState).not.toHaveBeenCalled();
    wrap.find(S.SideBarPictureContainer).simulate("click");
    expect(setState).toHaveBeenCalledWith(true);
  });
});
