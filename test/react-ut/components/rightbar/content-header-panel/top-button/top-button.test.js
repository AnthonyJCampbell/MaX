// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import TopButton from "components/rightbar/content-header-panel/top-button/button";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as S from "components/rightbar/content-header-panel/top-button/styles";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/utils/common");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");
  return { ...react, useState: jest.fn() };
});
jest.mock("components/rightbar/content-header-panel/in-call-header-panel/audio-menu");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<TopButton />", () => {
  const mockAction = jest.fn();

  it("Renders a button without click action", () => {
    const wrap = shallow(<TopButton imageSrc="mockImageSrc" altName={"Name"} parent={"Parent"} />);
    expect(mockAction).not.toHaveBeenCalled();
    wrap.find(S.StyleTopButton).simulate("click");
    expect(mockAction).not.toHaveBeenCalled();
  });

  it("Renders a button with click action", () => {
    const wrap = shallow(
      <TopButton
        imageSrc="mockImageSrc"
        altName={"Name"}
        parent={"Parent"}
        clickAction={mockAction}
      />
    );
    expect(mockAction).not.toHaveBeenCalled();
    wrap.find(S.StyleTopButton).simulate("click");
    expect(mockAction).toHaveBeenCalled();
  });

  it("Renders a disabled button with click action", () => {
    const wrap = shallow(
      <TopButton
        imageSrc="mockImageSrc"
        altName={"Name"}
        parent={"Parent"}
        clickAction={mockAction}
        disabled={true}
      />
    );
    expect(mockAction).not.toHaveBeenCalled();
    wrap.find(S.StyleTopButton).simulate("click");
    expect(mockAction).not.toHaveBeenCalled();
  });
});
