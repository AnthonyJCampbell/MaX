// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import each from "jest-each";

import "test/react-ut/components/require-mock";
import DismissButton from "assets/shared/button-dismiss.svg";
import SearchOrDialIcon from "assets/midbar/search-icon.svg";
import SearchOnlyIcon from "assets/midbar/search-only-icon.svg";
import { IconName } from "assets/icons/iconsLib";

import SearchBar from "components/midbar/search-bar/search-bar";
import Button from "components/ui/Button/Button";
import * as S from "components/midbar/search-bar/styles";
import {
  setActiveMidPane,
  setSearchTerm,
  setSelectedContact,
  focusRightbarMessage,
} from "action-creators/navigation/actions";
import { createActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { sendAnalytic } from "action-creators/ipc-outgoing/analytics-actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");
jest.mock("action-creators/ipc-outgoing/analytics-actions");
jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/active-calls-actions");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  contactReducer: {
    contacts: [],
  },
  paneManagementReducer: {
    searchTerm: "",
    isMidPaneDialPadVisible: false,
  },
};

const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));

describe("<SearchBar/>", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  const canBeDialed = [
    "123456",
    "+12025550168",
    "#1234",
    "65243628*77",
    "0101 0202 0303",
    "(+1) 2087-3739-838",
    "0987.654.321",
    "123,456,789",
  ];

  const cannotBeDialed = [
    "",
    "    ",
    "John Doe",
    "1234 Hello",
    "我們剛才從圖書館來了",
    "🤷‍♀️💖👀🌹™",
    "asdashdjksahdjsakdhaskdjashdjasdhsajdahsldjhsalkasdhjsakldjsahdkajsh",
  ];

  each([...canBeDialed, ...cannotBeDialed]).it("Displays the search term '%s'", (searchTerm) => {
    mockState.paneManagementReducer.searchTerm = searchTerm;

    const wrap = shallow(<SearchBar />);

    const input = wrap.find(S.Input);
    expect(input.props().value).toEqual(searchTerm);
  });

  each([...canBeDialed, ...cannotBeDialed]).it(
    "Updates search term in redux store when '%s' is inputted",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = "";

      const wrap = shallow(<SearchBar />);
      const input = wrap.find(S.Input);
      input.simulate("change", { target: { value: searchTerm } });

      expect(setSearchTerm).toHaveBeenCalledWith(searchTerm);
    }
  );

  each([...canBeDialed, ...cannotBeDialed]).it(
    "Moves mid pane to contacts tab when '%s' is inputted",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = "";

      const wrap = shallow(<SearchBar />);
      const input = wrap.find(S.Input);
      input.simulate("change", { target: { value: searchTerm } });

      expect(setActiveMidPane).toHaveBeenCalledWith("contacts");
    }
  );

  each(canBeDialed).it(
    "Displays call and SMS buttons when the search term is '%s' and dialpad is hidden",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;
      mockState.paneManagementReducer.isMidPaneDialPadVisible = false;
      const wrap = shallow(<SearchBar />);

      const button = wrap.find(Button);
      expect(button).toHaveLength(2);
      expect(button.at(0).props().icon).toEqual(IconName.phone);
      expect(button.at(1).props().icon).toEqual(IconName.sms);
    }
  );

  each(cannotBeDialed).it(
    "Doesn't display call and SMS buttons when the search term is '%s' and dialpad is hidden",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;
      mockState.paneManagementReducer.isMidPaneDialPadVisible = false;

      const wrap = shallow(<SearchBar />);
      expect(wrap.containsMatchingElement(<Button></Button>)).toBeFalsy();
    }
  );

  each([...canBeDialed, ...cannotBeDialed]).it(
    "Doesn't display call and SMS buttons when the search term is '%s' and dialpad is visible",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;
      mockState.paneManagementReducer.isMidPaneDialPadVisible = true;

      const wrap = shallow(<SearchBar />);
      expect(wrap.containsMatchingElement(<Button></Button>)).toBeFalsy();
    }
  );

  each([
    ["123456"],
    ["+12025550168"],
    ["#1234"],
    ["65243628*77#23"],
    ["0101 0202  0303"],
    ["(+1) 2345-6789-123"],
    ["0987.654.321"],
    ["123,456,789"],
  ]).it(
    "Creates a call to %s when user presses enter when the search term is '%s'",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;

      const wrap = shallow(<SearchBar />);
      const input = wrap.find(S.Input);
      input.simulate("keydown", { key: "Enter" });

      expect(createActiveCall).toHaveBeenCalledWith(searchTerm);
      expect(setSearchTerm).toHaveBeenCalledWith("");
    }
  );

  each([
    ["123456"],
    ["+12025550168"],
    ["#1234"],
    ["65243628*77#23"],
    ["0101 0202  0303"],
    ["(+1) 2345-6789-123"],
    ["0987.654.321"],
    ["123,456,789"],
  ]).it(
    "Creates a call to %s when user clicks call button when the search term is '%s'",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;
      mockState.paneManagementReducer.isMidPaneDialPadVisible = false;

      const wrap = shallow(<SearchBar />);
      const button = wrap.find(Button);
      button.at(0).simulate("click");

      expect(createActiveCall).toHaveBeenCalledWith(searchTerm);
      expect(setSearchTerm).toHaveBeenCalledWith("");
    }
  );

  each([
    ["123456", "123456"],
    ["+12025550168", "+12025550168"],
    ["#1234", "#1234"],
    ["65243628*77#23", "65243628*77#23"],
    ["0101 0202  0303", "010102020303"],
    ["(+1) 2345-6789-123", "+123456789123"],
    ["0987.654.321", "0987654321"],
    ["123,456,789", "123456789"],
  ]).it(
    "Opens chat pane with %s when user presses ctrl+enter when the search term is '%s'",
    (searchTerm, unformattedNumber) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;
      const contact = {
        email: [],
        isFavourite: false,
        isTyping: false,
        notifyWhenAvailable: false,
        phone: [{ type: 2, value: unformattedNumber }],
        postal: [],
        uid: "",
      };

      const wrap = shallow(<SearchBar />);
      const input = wrap.find(S.Input);
      input.simulate("keydown", { key: "Enter", ctrlKey: true });

      expect(setSelectedContact).toHaveBeenCalledWith(contact, unformattedNumber);
      expect(focusRightbarMessage).toHaveBeenCalled();
      expect(setSearchTerm).toHaveBeenCalledWith("");
      expect(sendAnalytic).toHaveBeenCalledWith("USER_CHAT_FROM_SEARCHBAR");
    }
  );

  each([
    ["123456", "123456"],
    ["+12025550168", "+12025550168"],
    ["#1234", "#1234"],
    ["65243628*77#23", "65243628*77#23"],
    ["0101 0202  0303", "010102020303"],
    ["(+1) 2345-6789-123", "+123456789123"],
    ["0987.654.321", "0987654321"],
    ["123,456,789", "123456789"],
  ]).it(
    "Opens chat pane with %s when user clicks SMS button when the search term is '%s'",
    (searchTerm, unformattedNumber) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;
      mockState.paneManagementReducer.isMidPaneDialPadVisible = false;
      const contact = {
        email: [],
        isFavourite: false,
        isTyping: false,
        notifyWhenAvailable: false,
        phone: [{ type: 2, value: unformattedNumber }],
        postal: [],
        uid: "",
      };

      const wrap = shallow(<SearchBar />);
      const button = wrap.find(Button);
      button.at(1).simulate("click");

      expect(setSelectedContact).toHaveBeenCalledWith(contact, unformattedNumber);
      expect(focusRightbarMessage).toHaveBeenCalled();
      expect(setSearchTerm).toHaveBeenCalledWith("");
      expect(sendAnalytic).toHaveBeenCalledWith("USER_CHAT_FROM_SEARCHBAR");
    }
  );

  each(cannotBeDialed).it(
    "Doesn't create a call when user presses enter when the search term is '%s'",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;

      const wrap = shallow(<SearchBar />);
      const input = wrap.find(S.Input);
      input.simulate("keydown", { key: "Enter" });

      expect(createActiveCall).not.toHaveBeenCalled();
    }
  );

  each(cannotBeDialed).it(
    "Doesn't open chat pane when user presses ctrl+enter when the search term is '%s'",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;

      const wrap = shallow(<SearchBar />);
      const input = wrap.find(S.Input);
      input.simulate("keydown", { key: "Enter", ctrlKey: true });

      expect(setSelectedContact).not.toHaveBeenCalled();
      expect(focusRightbarMessage).not.toHaveBeenCalled();
      expect(sendAnalytic).not.toHaveBeenCalledWith("USER_CHAT_FROM_SEARCHBAR");
    }
  );

  it("Shows the search or dial icon when the search term is empty", () => {
    mockState.paneManagementReducer.searchTerm = "";

    const wrap = shallow(<SearchBar />);

    expect(wrap.containsMatchingElement(<img src={SearchOrDialIcon} alt="" />)).toBeTruthy();
  });

  each(["1234", "Hello"]).it(
    "Shows the search only icon when the search term is non-empty: '%s'",
    (searchTerm) => {
      mockState.paneManagementReducer.searchTerm = searchTerm;

      const wrap = shallow(<SearchBar />);

      expect(wrap.containsMatchingElement(<img src={SearchOnlyIcon} alt="" />)).toBeTruthy();
    }
  );

  it("Clears the search when a user presses the Escape key", () => {
    mockState.paneManagementReducer.searchTerm = "123456";

    const wrap = shallow(<SearchBar />);
    const input = wrap.find(S.Input);
    input.simulate("keydown", { key: "Escape" });

    expect(setSearchTerm).toHaveBeenCalledWith("");
  });

  // Shows the Close Icon only when search term is non-empty
  it("Shows the Close Search icon when the search term is non-empty", () => {
    mockState.paneManagementReducer.searchTerm = "1234";

    const wrap = shallow(<SearchBar />);

    expect(
      wrap.containsMatchingElement(<img src={DismissButton} alt="Close Search Button" />)
    ).toBeTruthy();
  });

  // Clears the search when user clicks Close Icon
  it("Clears the search when a user clicks the Close Search Icon", () => {
    mockState.paneManagementReducer.searchTerm = "123456";

    const wrap = shallow(<SearchBar />);
    const input = wrap.find(S.CloseButton);
    input.simulate("click");

    expect(setSearchTerm).toHaveBeenCalledWith("");
  });
});
