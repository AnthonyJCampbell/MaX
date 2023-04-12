// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";

import MuteButton from "components/rightbar/content-header-panel/in-call-header-panel/mute-button";
import TopButton from "components/rightbar/content-header-panel/top-button/button";

import AudioIcon from "assets/rightbar/button-audio.svg";
import MutedIcon from "assets/rightbar/button-muted.svg";

import { updateCallMicrophoneMute } from "action-creators/ipc-outgoing/active-calls-actions";

import { bilboCall } from "shared/mocks/mock-active-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("components/rightbar/content-header-panel/top-button/button");
jest.mock("src/renderer-logging");
jest.mock("action-creators/ipc-outgoing/active-calls-actions");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<MuteButton />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Renders for a non-muted call", () => {
    const wrap = shallow(<MuteButton activeCall={bilboCall} />);
    expect(wrap.containsMatchingElement(<TopButton imageSrc={AudioIcon} />)).toBeTruthy();
  });

  it("Renders for a muted call", () => {
    const bilboMuted = mutableCloneDeep(bilboCall);
    bilboMuted.microphoneIsMuted = true;

    const wrap = shallow(<MuteButton activeCall={bilboMuted} />);
    expect(wrap.containsMatchingElement(<TopButton imageSrc={MutedIcon} />)).toBeTruthy();
  });

  it("Calls action to mute mic when clicked", () => {
    const wrap = shallow(<MuteButton activeCall={bilboCall} />);

    const buttonClickAction = wrap.find(TopButton).props().clickAction;
    buttonClickAction();

    expect(updateCallMicrophoneMute).toHaveBeenCalledWith(bilboCall, true);
  });

  it("Calls action to unmute mic when clicked", () => {
    const bilboMuted = mutableCloneDeep(bilboCall);
    bilboMuted.microphoneIsMuted = true;

    const wrap = shallow(<MuteButton activeCall={bilboMuted} />);

    const buttonClickAction = wrap.find(TopButton).props().clickAction;
    buttonClickAction();

    expect(updateCallMicrophoneMute).toHaveBeenCalledWith(bilboMuted, false);
  });

  it("Disabled the button when props.disabled is provided", () => {
    const wrap = shallow(<MuteButton activeCall={bilboCall} disabled />);

    expect(wrap.find(TopButton).props().disabled).toBe(true);
  });
});
