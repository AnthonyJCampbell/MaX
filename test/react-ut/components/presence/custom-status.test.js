// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import renderer from "react-test-renderer";
import "jest-styled-components";

import { CustomStatusState } from "components/utils/common";
import CustomStatus, { MAX_CUSTOM_STATUS_LENGTH } from "components/presence/custom-status";
import { PresenceState } from "shared/types";
import { Button } from "components/menu/menu";
import * as S from "components/presence/styles";
import { mockedT } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("store/store");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, useRef: jest.fn() };
});

const events = {
  onSave: jest.fn(),
  onCancel: jest.fn(),
  onClose: jest.fn(),
  onEdit: jest.fn(),
  onClean: jest.fn(),
  onClick: jest.fn(),
};

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const useSelectorMock = jest.spyOn(redux, "useSelector");

const mockReducerState = (override) => {
  const mockState = {
    paneManagementReducer: {
      customStatusState: override?.customStatusState || CustomStatusState.INITIAL,
    },
    userReducer: {
      user: {
        presence: {
          state: PresenceState.ONLINE,
          customStatus: override?.customStatus || "",
        },
      },
    },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
};

const customStatus = "An custom status";

const testMenuItemButtonScenario = () => {
  // Snapshot the HTML and CSS
  const componentJson = renderer.create(<CustomStatus id="anId" events={events} />).toJSON();
  expect(componentJson).toMatchSnapshot();

  const wrap = shallow(<CustomStatus id="anId" events={events} />);

  const menuItemButton = wrap.find(Button);
  expect(menuItemButton.exists()).toBe(true);
  expect(menuItemButton.prop("text")).toEqual(mockedT("setCustomStatus"));
};

const testNonEditingScenario = () => {
  // Snapshot the HTML and CSS
  const componentJson = renderer.create(<CustomStatus id="anId" events={events} />).toJSON();
  expect(componentJson).toMatchSnapshot();

  const wrap = shallow(<CustomStatus id="anId" events={events} />);

  const menuItemButton = wrap.find(Button);
  expect(menuItemButton.exists()).toBe(false);

  const CustomStatusContainer = wrap.find(S.CustomStatusContainer);
  expect(CustomStatusContainer.exists()).toBe(true);

  const customStatusParagraph = wrap.find(S.CustomStatusParagraph);
  expect(customStatusParagraph.exists()).toBe(true);
  expect(customStatusParagraph.text()).toEqual(customStatus);

  const actionButtons = wrap.find(S.ActionButton);
  expect(actionButtons).toHaveLength(2);

  const editButton = actionButtons.at(0);
  expect(editButton.text()).toEqual(mockedT("edit"));
  editButton.simulate("click");
  expect(events.onEdit).toHaveBeenCalled();

  const clearButton = actionButtons.at(1);
  expect(clearButton.text()).toEqual(mockedT("clear"));
  clearButton.simulate("click");
  expect(events.onClean).toHaveBeenCalled();
};

const testEditingScenario = (expectedTextAreaValue) => {
  // Snapshot the HTML and CSS
  const componentJson = renderer.create(<CustomStatus id="anId" events={events} />).toJSON();
  expect(componentJson).toMatchSnapshot();

  const wrap = shallow(<CustomStatus id="anId" events={events} />);

  const menuItemButton = wrap.find(Button);
  expect(menuItemButton.exists()).toBe(false);

  const CustomStatusContainer = wrap.find(S.CustomStatusContainer);
  expect(CustomStatusContainer.exists()).toBe(true);

  const textArea = wrap.find(S.TextArea);
  expect(textArea.exists()).toBe(true);
  expect(textArea.prop("value")).toEqual(expectedTextAreaValue);

  const actionButtons = wrap.find(S.ActionButton);
  expect(actionButtons).toHaveLength(2);

  const saveButton = actionButtons.at(0);
  expect(saveButton.text()).toEqual(mockedT("save"));
  saveButton.simulate("click");
  expect(events.onSave).toHaveBeenCalledWith(expectedTextAreaValue);

  const cancelButton = actionButtons.at(1);
  expect(cancelButton.text()).toEqual(mockedT("cancel"));
  cancelButton.simulate("click");
  expect(events.onCancel).toHaveBeenCalledTimes(1);

  const characterCount = wrap.find(S.CharacterCount);
  expect(characterCount.exists()).toBe(true);
  const expectedCharacterCount = MAX_CUSTOM_STATUS_LENGTH - expectedTextAreaValue?.length;
  expect(characterCount.text()).toEqual(`${expectedCharacterCount}`);
};

describe("<CustomStatus />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());
  const stopPropagation = jest.fn();
  const preventDefault = jest.fn();

  /* eslint-disable-next-line jest/expect-expect */
  it("Renders in the initial state", () => {
    mockReducerState();

    testMenuItemButtonScenario();
  });

  /* eslint-disable-next-line jest/expect-expect */
  it("Renders in initial state with a custom status already set", () => {
    mockReducerState({
      customStatus,
    });

    testNonEditingScenario();
  });

  /* eslint-disable-next-line jest/expect-expect */
  it("Renders in the editing state", () => {
    mockReducerState({
      customStatusState: CustomStatusState.EDITING,
    });

    testEditingScenario("");
  });

  /* eslint-disable-next-line jest/expect-expect */
  it("Renders in the editing state with a custom status already set", () => {
    mockReducerState({
      customStatusState: CustomStatusState.EDITING,
      customStatus,
    });

    testEditingScenario(customStatus);
  });

  /* eslint-disable-next-line jest/expect-expect */
  it("Renders in the close state", () => {
    mockReducerState({
      customStatusState: CustomStatusState.CLOSE,
    });

    testMenuItemButtonScenario();
  });

  /* eslint-disable-next-line jest/expect-expect */
  it("Renders in the close state with a custom status already set", () => {
    mockReducerState({
      customStatusState: CustomStatusState.CLOSE,
      customStatus,
    });

    testNonEditingScenario();
  });

  it("Should call onCancel when Esc is pressed in Editing Mode", () => {
    mockReducerState({
      customStatusState: CustomStatusState.EDITING,
    });

    const wrap = shallow(<CustomStatus id="anId" events={events} />);

    wrap.find(S.CustomStatusContainer).simulate("keydown", { key: "Escape", stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
    expect(events.onCancel).toHaveBeenCalled();
  });

  it("Should call onClose when Esc is pressed in Initial Mode", () => {
    mockReducerState({
      customStatusState: CustomStatusState.INITIAL,
      customStatus,
    });

    const wrap = shallow(<CustomStatus id="anId" events={events} />);

    wrap.find(S.CustomStatusContainer).simulate("keydown", { key: "Escape", stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
    expect(events.onClose).toHaveBeenCalled();
  });

  it("Should call onSave when Enter is pressed in Editing Mode", () => {
    mockReducerState({
      customStatusState: CustomStatusState.EDITING,
      customStatus,
    });

    const useRefSpy = jest.spyOn(React, "useRef").mockReturnValueOnce({ current: true });

    const wrap = shallow(<CustomStatus id="anId" events={events} />);
    wrap.simulate("focus");
    wrap.find(S.CustomStatusContainer).simulate("keydown", {
      key: "Enter",
      stopPropagation,
      preventDefault,
    });
    expect(useRefSpy).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
    expect(events.onSave).toHaveBeenCalledWith(customStatus);
  });
});
