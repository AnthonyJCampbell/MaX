// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// ESLint gives a false positive on `wrap.exists` thinking it's `fs.exists`
/* eslint-disable security/detect-non-literal-fs-filename */
import React from "react";
import * as redux from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import each from "jest-each";

import "test/react-ut/components/require-mock";
import MainWindow from "components/windows/main-window";
import * as S from "components/windows/styles";
import Sidebar from "components/sidebar/sidebar";
import Midbar from "components/midbar/midbar";
import AllBanners from "components/banner/all-banners";
import Rightbar from "components/rightbar/rightbar";
import UnimplementedPopup from "components/uimplemented-popup/popup";
import PaneControlStateHandler from "components/utils/pane-control-state-handler";
import ModalPopup from "components/modal-popup/popup";
import AppLogo from "assets/shared/max-logo.png";
import { LoginState } from "src/types";
import { mockedT } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("react-redux");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  // Substitute whichever reducers you actually need in here, e.g.
  coreReducer: { account: { loginState: LoginState.LOGGED_IN } },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));
describe("<MainWindow />", () => {
  it("Renders the main UI when logged in", () => {
    mockState.coreReducer.account.loginState = LoginState.LOGGED_IN;

    const wrap = shallow(<MainWindow />);

    // Renders the main UI
    expect(wrap.exists(Sidebar)).toBe(true);
    expect(wrap.exists(AllBanners)).toBe(true);
    expect(wrap.exists(Midbar)).toBe(true);
    expect(wrap.exists(Rightbar)).toBe(true);
    expect(wrap.exists(UnimplementedPopup)).toBe(true);
    expect(wrap.exists(PaneControlStateHandler)).toBe(true);
    expect(wrap.exists(ModalPopup)).toBe(true);

    // Doesn't render the startup screen
    expect(wrap.exists(S.StartupText)).toBe(false);
    expect(wrap.exists("img")).toBe(false);
  });

  each([LoginState.LOGGED_OUT, LoginState.UNRECOGNIZED]).it(
    "Renders the startup screen when not logged in",
    (loginState) => {
      mockState.coreReducer.account.loginState = loginState;

      const wrap = shallow(<MainWindow />);

      // Renders the startup screen
      const startupTextComponent = wrap.find(S.StartupText);
      expect(startupTextComponent.text()).toBe(mockedT("startupScreenText"));

      const imgComponent = wrap.find("img");
      expect(imgComponent.props().src).toEqual(AppLogo);
      expect(imgComponent.props().alt).toEqual("");

      // Doesn't render the main UI
      expect(wrap.exists(Sidebar)).toBe(false);
      expect(wrap.exists(AllBanners)).toBe(false);
      expect(wrap.exists(Midbar)).toBe(false);
      expect(wrap.exists(Rightbar)).toBe(false);
      expect(wrap.exists(UnimplementedPopup)).toBe(false);
      expect(wrap.exists(PaneControlStateHandler)).toBe(false);
      expect(wrap.exists(ModalPopup)).toBe(false);
    }
  );
});
