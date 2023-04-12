// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import DialpadButton from "components/ui/Dialpad/dialpad-button";

configure({ adapter: new Adapter() });

describe("<DialpadButton/>", () => {
  it("show DialpadButton", () => {
    const wrapper = shallow(<DialpadButton text="1" />);
    expect(wrapper.text()).toMatch("1");
  });

  it("click on DialpadButton should call onClickHandler", () => {
    const clickFn = jest.fn();
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();

    const wrapper = shallow(<DialpadButton text="1" onClickHandler={clickFn} />);

    wrapper.simulate("mousedown", { preventDefault, stopPropagation });
    expect(clickFn).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
  });
});
