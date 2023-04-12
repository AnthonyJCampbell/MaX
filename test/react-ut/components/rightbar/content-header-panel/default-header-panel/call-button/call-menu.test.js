// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import "test/react-ut/components/require-mock";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CallIcon from "assets/rightbar/menu-button-call.svg";
import { Menu, Button } from "components/menu/menu";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import CallMenu from "components/rightbar/content-header-panel/default-header-panel/call-button/call-menu";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");
jest.mock("components/menu/menu");
jest.mock("components/utils/phone-formatter");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const useSelectorMock = jest.spyOn(redux, "useSelector");
formatPhoneNumber.mockImplementation(
  (phoneNumber, easRegion) => `${phoneNumber.value}-${easRegion}`
);

describe("<CallMenu />", () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation((callback) =>
      callback({
        settingsReducer: {
          settings: {
            general: {
              easRegion: "GB",
            },
          },
        },
      })
    );
  });

  it("Renders with 3 numbers ", () => {
    const phoneNumbers = [
      { value: "+12025550192", type: "MOBILE_NUMBER" },
      { value: "01632960562", type: "WORK_NUMBER" },
      { value: "02080362417", type: "HOME_NUMBER" },
    ];

    // We don't care what this object is (since we don't have typing here), just that the same
    // object gets passed down to the Menu.
    const mockKeyboardNavTools = { mockKey: "mockValue" };

    const wrap = shallow(
      <CallMenu phoneNumbers={phoneNumbers} keyboardNavTools={mockKeyboardNavTools} />
    );

    // Check that we create a Menu and passing in the keyboardNavTools.
    expect(wrap.find(Menu).props().keyboardNavTools).toEqual(mockKeyboardNavTools);

    // Check that we render the numbers in the same order as the list supplied to the component.
    phoneNumbers.forEach((phoneNumber, index) => {
      const button = wrap.find(Button).at(index);
      expect(button.props().imageSrc).toEqual(CallIcon);
      expect(button.props().text).toEqual(formatPhoneNumber(phoneNumber, "GB"));
    });
  });
});
