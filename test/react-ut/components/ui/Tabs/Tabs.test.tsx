// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Tabs, { Tab } from "components/ui/Tabs";
import log from "src/renderer-logging";
import TabButton from "components/ui/Tabs/TabButton";
import { TabPlaceholder } from "components/ui/Tabs/styles";

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

const firstTab: Tab = {
  label: "First tab",
  type: "first-tab",
};
const secondTab: Tab = {
  label: "Second tab",
  type: "second-tab",
};

const tabs = [firstTab, secondTab];

describe("<Tabs />", () => {
  it("Renders properly", () => {
    const wrap = shallow(<Tabs tabs={tabs} active={firstTab.type} />);
    const tabButtons = wrap.find(TabButton);
    expect(tabButtons.exists()).toBe(true);
    expect(tabButtons).toHaveLength(2);

    const firstButton = tabButtons.at(0);
    const secondButton = tabButtons.at(1);

    expect(firstButton.prop("active")).toEqual(true);
    expect(firstButton.prop("label")).toEqual(firstTab.label);

    expect(secondButton.prop("active")).toEqual(false);
    expect(secondButton.prop("label")).toEqual(secondTab.label);
  });

  it("Renders properly when no tabs is set", () => {
    const wrap = shallow(<Tabs tabs={[]} />);
    const placeholder = wrap.find(TabPlaceholder);

    expect(placeholder.exists()).toBe(true);
  });

  it("Doesn't trigger changes when active tab button is clicked", () => {
    const onClick = jest.fn();
    const wrap = shallow(<Tabs tabs={tabs} active={firstTab.type} onClick={onClick} />);

    const tabButtons = wrap.find(TabButton);
    expect(tabButtons.exists()).toBe(true);
    expect(tabButtons).toHaveLength(2);

    const firstButton = tabButtons.at(0);
    expect(firstButton.prop("active")).toEqual(true);
    firstButton.simulate("click");
    expect(onClick).not.toHaveBeenCalled();
  });
});
