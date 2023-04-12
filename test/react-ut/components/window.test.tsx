// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// ESLint gives a false positive on `wrap.exists` thinking it's `fs.exists`
/* eslint-disable security/detect-non-literal-fs-filename */
import React from "react";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import * as redux from "react-redux";

import "test/react-ut/components/require-mock";
import Window from "components/window";
// MainWindow code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import MainWindow from "components/windows/main-window";
// IncomingCallWindow code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import IncomingCallWindow from "components/windows/incoming-call-window";
import { WindowTypes } from "shared/types";
// InCallWindow code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import InCallWindow from "components/windows/in-call-window";
import log from "src/renderer-logging";

// N.B. There's no test for changing the language based on the java locale, because the
// code uses useEffect(), which we can't mock sufficiently easily.

configure({ adapter: new ReactSixteenAdapter() });

jest.mock("react-redux");
jest.mock("components/avatar/avatar");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<Window />", () => {
  const getIdentifiers = (type: WindowTypes | string): void => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockReturnValue(type);
  };

  it("Displays MainWindow by Default", () => {
    getIdentifiers("");
    const window = shallow(<Window />);

    expect(window.exists(MainWindow)).toBeTruthy();
  });

  it("Displays MainWindow when rendering the main window", () => {
    getIdentifiers(WindowTypes.main);
    const window = shallow(<Window />);

    expect(window.exists(MainWindow)).toBeTruthy();
  });

  it("Displays IncomingCallWindow when rendering an incoming call window", () => {
    getIdentifiers(WindowTypes.incomingCall);
    const window = shallow(<Window />);

    expect(window.exists(IncomingCallWindow)).toBeTruthy();
  });

  it("Displays InCallWindow when rendering an in call window", () => {
    getIdentifiers(WindowTypes.inCall);
    const window = shallow(<Window />);

    expect(window.exists(InCallWindow)).toBeTruthy();
  });
});
