// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import PresenceMenu from "components/presence/presence-menu";
import * as redux from "react-redux";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as S from "components/presence/styles";
import log from "src/renderer-logging";

import { CallManagerType, PresenceState } from "shared/types";
import { PresenceMenuState } from "components/utils/common";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<PresenceMenu />", () => {
  let props;
  const preventDefault = jest.fn();
  const stopPropagation = jest.fn();

  const useSelectorMock = jest.spyOn(redux, "useSelector");
  const setMockReducerState = () => {
    useSelectorMock.mockImplementation((callback) =>
      callback({
        settingsReducer: {
          settings: {
            call: {
              callManagerType: CallManagerType.BCM,
            },
          },
        },
        activeCallsReducer: {
          activeCalls: [],
        },
        paneManagementReducer: {
          presenceMenuState: PresenceMenuState.OPEN,
        },
      })
    );
  };

  props = {
    presenceState: PresenceState.ONLINE,
    onCloseAvatarMenu: jest.fn(),
    onClosePresenceMenu: jest.fn(),
    onSelectPresence: jest.fn(),
    onOpenCallManager: jest.fn(),
  };

  beforeEach(() => {
    setMockReducerState();
  });

  it("Should call onSelectPresence when clicking in menu item", () => {
    const wrapper = shallow(<PresenceMenu {...props} />);
    wrapper.find("#presenceMenuRow-Busy").simulate("click");
    expect(props.onSelectPresence).toHaveBeenCalled();
  });

  it("Should call onSelectPresence when hitting Enter and having a menu item focused", () => {
    const target = { dispatchEvent: jest.fn() };
    const wrapper = shallow(<PresenceMenu {...props} />);
    wrapper
      .find(S.Submenu)
      .simulate("keydown", { key: "Enter", target, preventDefault, stopPropagation });
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(target.dispatchEvent).toHaveBeenCalled();
  });

  it("Should call onOpenCallManager when clicking in menu item", () => {
    const wrapper = shallow(<PresenceMenu {...props} />);
    wrapper.find("#presenceMenuRow-OpenCallManager").simulate("click");
    expect(props.onOpenCallManager).toHaveBeenCalled();
  });

  it("Should call onClosePresenceMenu when hitting Escape", () => {
    const wrapper = shallow(<PresenceMenu {...props} />);
    wrapper.simulate("keydown", { key: "Escape", preventDefault, stopPropagation });
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(props.onClosePresenceMenu).toHaveBeenCalled();
  });
});
