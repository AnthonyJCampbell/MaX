// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";

import HoldButton from "components/rightbar/content-header-panel/in-call-header-panel/hold-button";
import TopButton from "components/rightbar/content-header-panel/top-button/button";

import HoldIcon from "assets/rightbar/button-hold.svg";
import OnHoldIcon from "assets/rightbar/button-onhold.svg";
import { CallStatus } from "src/types";

import each from "jest-each";
import { updateActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("components/rightbar/content-header-panel/top-button/button");
jest.mock("src/renderer-logging");
jest.mock("action-creators/ipc-outgoing/active-calls-actions");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<HoldButton />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Renders for a call on hold ", () => {
    const wrap = shallow(<HoldButton activeCall={{ status: CallStatus.HOLD }} />);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={OnHoldIcon} disabled={false} />)
    ).toBeTruthy();
  });

  it("Renders for an ongoing call not on hold ", () => {
    const wrap = shallow(<HoldButton activeCall={{ status: CallStatus.CURRENT }} />);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={HoldIcon} disabled={false} />)
    ).toBeTruthy();
  });

  each([
    CallStatus.CONNECTING,
    CallStatus.INCOMING,
    CallStatus.RINGING,
    CallStatus.UNRECOGNIZED,
  ]).it("Renders disabled button for call status %s ", (status) => {
    const wrap = shallow(<HoldButton activeCall={{ status }} />);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={HoldIcon} disabled={true} />)
    ).toBeTruthy();
  });

  it("Dispatches action to put call on hold when clicked", () => {
    const wrap = shallow(
      <HoldButton activeCall={{ uid: "mockUid", status: CallStatus.CURRENT }} />
    );

    const buttonClickAction = wrap.find(TopButton).props().clickAction;
    buttonClickAction();

    expect(updateActiveCall).toHaveBeenCalledWith("mockUid", CallStatus.HOLD);
  });

  it("Dispatches action to put call off hold when clicked", () => {
    const wrap = shallow(<HoldButton activeCall={{ uid: "mockUid", status: CallStatus.HOLD }} />);

    const buttonClickAction = wrap.find(TopButton).props().clickAction;
    buttonClickAction();

    expect(updateActiveCall).toHaveBeenCalledWith("mockUid", CallStatus.CURRENT);
  });

  it("Disabled the button when props.disabled is provided", () => {
    const wrap = shallow(<HoldButton activeCall={{ status: CallStatus.CURRENT }} disabled />);

    expect(wrap.find(TopButton).props().disabled).toBe(true);
  });
});
