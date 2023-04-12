// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import * as redux from "react-redux";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Button from "components/ui/Button/Button";
import Dialpad from "components/ui/Dialpad";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");

describe("<Dialpad/>", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Shows call button enabled", () => {
    const wrapper = shallow(<Dialpad callButtonVisible={true} callButtonDisabled={false} />);

    const callButton = wrapper.find(Button);
    expect(callButton).toHaveLength(2);
    expect(callButton.at(0).prop("disabled")).toBe(false);
    expect(callButton.at(1).prop("disabled")).toBe(false);
  });

  it("Shows call button disabled", () => {
    const wrapper = shallow(<Dialpad callButtonVisible={true} callButtonDisabled={true} />);

    const callButton = wrapper.find(Button);
    expect(callButton).toHaveLength(2);
    expect(callButton.at(0).prop("disabled")).toBe(true);
    expect(callButton.at(1).prop("disabled")).toBe(true);
  });

  it("Call button should trigger expected function", () => {
    const onCall = jest.fn();
    const onSMS = jest.fn();

    const wrapper = shallow(
      <Dialpad callButtonVisible={true} callButtonDisabled={false} onCall={onCall} onSMS={onSMS} />
    );

    const callButton = wrapper.find(Button);
    callButton.at(0).simulate("click");
    expect(onCall).toHaveBeenCalledTimes(1);
    callButton.at(1).simulate("click");
    expect(onSMS).toHaveBeenCalledTimes(1);
  });
});
