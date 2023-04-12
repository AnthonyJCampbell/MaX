// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as Menu from "components/menu/menu";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as S from "components/menu/styles";
import log from "src/renderer-logging";
configure({ adapter: new Adapter() });

jest.mock("react", () => {
  const react = jest.requireActual("react");
  return { ...react, useState: jest.fn() };
});
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<Section />", () => {
  it("Renders without a border", () => {
    const wrap = shallow(
      <Menu.Section>
        <div>child text</div>
      </Menu.Section>
    );
    expect(
      wrap.containsMatchingElement(
        <S.Section border={undefined}>
          <div>child text</div>
        </S.Section>
      )
    ).toBeTruthy();
  });
  it("Renders with a border", () => {
    const wrap = shallow(
      <Menu.Section borderBottom={true}>
        <div>child text</div>
      </Menu.Section>
    );
    expect(
      wrap.containsMatchingElement(
        <S.Section border={true}>
          <div>child text</div>
        </S.Section>
      )
    ).toBeTruthy();
  });
});

describe("<Button />", () => {
  it("Renders", () => {
    const wrap = shallow(<Menu.Button imageSrc="mock source" text="mock text" id="id" />);
    expect(wrap.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(wrap.text()).toMatch("mock text");
    expect(wrap.containsMatchingElement(<S.Detail />)).toBeTruthy();
  });
  it("Renders with a detail", () => {
    const wrap = shallow(
      <Menu.Button imageSrc="mock source" text="mock text" detail="mock detail" id="id" />
    );
    expect(wrap.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(wrap.text()).toContain("mock text");
    expect(wrap.text()).toContain("mock detail");
    expect(wrap.containsMatchingElement(<S.Detail />)).not.toBeTruthy();
  });
});

describe("<RadioButtons />", () => {
  const setState = jest.fn();
  const useStateMock = jest.spyOn(React, "useState");
  useStateMock.mockImplementation((init) => [init, setState]);

  it("Renders", () => {
    // Use mount rendering for RadioButtons because we want to check that this renders the children
    // RadioButton components without having to make RadioButton component public.
    const wrap = mount(
      <Menu.RadioButtons activeImage="mock source" buttons={["a", "b"]} ids={["a", "b"]} />
    );

    // const firstButton = wrap.first();
    const firstButton = wrap.find(S.MenuItemButton).first();
    const firstBox = firstButton.find(S.Box).props();
    expect(firstBox.activeButton).toEqual(firstBox.thisButton);
    expect(firstButton.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(firstButton.text()).toContain("a");

    const secondButton = wrap.find(S.MenuItemButton).at(1);
    const secondBox = secondButton.find(S.Box).props();
    expect(secondBox.activeButton).not.toEqual(secondBox.thisButton);
    expect(secondButton.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(secondButton.text()).toContain("b");
  });

  it("Handles clicks", () => {
    const wrap = mount(
      <Menu.RadioButtons
        activeImage="mock source"
        buttons={["a", "b", "c"]}
        ids={["a", "b", "c"]}
      />
    );

    const firstButton = wrap.find(S.MenuItemButton).first();
    const firstBox = firstButton.find(S.Box).props();
    expect(firstBox.activeButton).toEqual(firstBox.thisButton);
    expect(firstButton.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(firstButton.text()).toContain("a");

    const secondButton = wrap.find(S.MenuItemButton).at(1);
    const secondBox = secondButton.find(S.Box).props();
    expect(secondBox.activeButton).not.toEqual(secondBox.thisButton);
    expect(secondButton.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(secondButton.text()).toContain("b");

    const thirdButton = wrap.find(S.MenuItemButton).at(2);
    const thirdBox = thirdButton.find(S.Box).props();
    expect(thirdBox.activeButton).not.toEqual(thirdBox.thisButton);
    expect(thirdButton.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(thirdButton.text()).toContain("c");

    expect(setState).not.toHaveBeenCalled();
    // Click buttons
    secondButton.props().onClick();
    expect(setState).toHaveBeenCalledWith("b");

    thirdButton.props().onClick();
    expect(setState).toHaveBeenCalledWith("c");

    firstButton.props().onClick();
    expect(setState).toHaveBeenCalledWith("a");
  });

  it("Handles one button", () => {
    const wrap = mount(<Menu.RadioButtons activeImage="mock source" buttons={["a"]} ids={["a"]} />);
    expect(wrap.containsMatchingElement(<img src="mock source" alt="" />)).toBeTruthy();
    expect(wrap.text()).toContain("a");
  });
});
