// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import ArrowKeyControl from "components/arrow-key-control/control";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
import each from "jest-each";
import log from "src/renderer-logging";

jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, useState: jest.fn(), useRef: jest.fn() };
});
jest.mock("src/renderer-logging");

let mockIDList = [];
let mockElementList = [];
for (let i = 0; i < 10; i++) {
  mockIDList.push(i.toString());
  mockElementList.push({ name: i, focus: jest.fn(), setAttribute: jest.fn() });
}

const useRefMock = jest.spyOn(React, "useRef");
useRefMock.mockImplementation(() => ({
  current: {
    focus: jest.fn(),
    setAttribute: jest.fn(),
  },
}));
const setState = jest.fn();
const useStateMock = jest.spyOn(React, "useState");
useStateMock.mockImplementation((init) => [init, setState]);

/**
 * Helper function to simulate a key press on a given focusable
 *
 * @param {ShallowWrapper} control
 * @param {String} key
 * @param {Integer} index
 */
const clicker = (control, key, index) => {
  control.simulate("keyDown", {
    key,
    target: mockElementList[index],
    preventDefault: jest.fn(),
  });
};

/**
 * Helper function to check that only the focusable with the given index has been
 * focussed and no other
 *
 * @param {Integer} index
 */
const keyDownChecker = (index) => {
  mockElementList.forEach((obj) => {
    if (mockElementList.indexOf(obj) === index) {
      expect(obj.focus).toHaveBeenCalled();
      return;
    }
    expect(obj.focus).not.toHaveBeenCalled();
  });
  mockElementList.forEach((obj) => {
    expect(obj.setAttribute).not.toHaveBeenCalled();
  });
};

/**
 * Helper function to simulate focus
 *
 * @param {ShallowWrapper} control
 * @param {Object} target - focusable event target
 */
const focusser = (control, target) => {
  control.simulate("focus", { target });
};

/**
 * Helper function to check the oldFocusHolder has been removed from the tab order, and the
 * targetFocusHolder has been added to the tab order and saved in state
 *
 * @param {Object} oldFocusHolder
 * @param {Object} targetFocusHolder
 */
const focusChecker = (oldFocusHolder, targetFocusHolder) => {
  expect(oldFocusHolder.setAttribute).toHaveBeenCalledWith("tabIndex", "-1");
  expect(targetFocusHolder.setAttribute).toHaveBeenCalledWith("tabIndex", "0");
  expect(setState).toHaveBeenCalledWith(targetFocusHolder);
};

beforeEach(() => {
  const mockElementById = jest
    .fn()
    .mockImplementationOnce(() => {
      return mockElementList[0];
    })
    .mockImplementationOnce(() => {
      return mockElementList[1];
    })
    .mockImplementationOnce(() => {
      return mockElementList[2];
    })
    .mockImplementationOnce(() => {
      return mockElementList[3];
    })
    .mockImplementationOnce(() => {
      return mockElementList[4];
    })
    .mockImplementationOnce(() => {
      return mockElementList[5];
    })
    .mockImplementationOnce(() => {
      return mockElementList[6];
    })
    .mockImplementationOnce(() => {
      return mockElementList[7];
    })
    .mockImplementationOnce(() => {
      return mockElementList[8];
    })
    .mockImplementationOnce(() => {
      return mockElementList[9];
    });

  Object.defineProperty(global.document, "getElementById", {
    writable: true,
    value: mockElementById,
  });

  log.test(`Start running: ${expect.getState().currentTestName}`);
});

afterEach(() => {
  jest.clearAllMocks();

  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ArrowKeyControl />", () => {
  it("Renders", () => {
    const control = shallow(
      <ArrowKeyControl idList={mockIDList}>
        <div>child text</div>
      </ArrowKeyControl>
    );

    expect(useStateMock).toHaveBeenCalledWith(mockElementList[0]);
    expect(control.containsMatchingElement(<div>child text</div>)).toBeTruthy();
  });

  each([
    ["ArrowDown", 1, 0],
    ["ArrowRight", 1, 0],
    ["ArrowUp", 9, 8],
    ["ArrowLeft", 9, 8],
    ["Home", 0, 0],
    ["End", 9, 9],
    ["PageDown", 8, 9],
    ["PageUp", 0, 1],
    ["q", null, null],
  ]).it("Handles a click of the %s key", (key, startIndex, endIndex) => {
    // startIndex/endIndex - the index of the focusable to be focussed when clicking from the
    // start/end of the focusableObjList
    const control = shallow(
      <ArrowKeyControl idList={mockIDList}>
        <div>child text</div>
      </ArrowKeyControl>
    );
    // Start of list
    clicker(control.childAt(0), key, 0);
    keyDownChecker(startIndex);
    // End of list
    jest.clearAllMocks();
    clicker(control.childAt(0), key, 9);
    keyDownChecker(endIndex);
  });

  // eslint-disable-next-line jest/expect-expect
  it("Handles focus on a child component", () => {
    const control = shallow(
      <ArrowKeyControl idList={mockIDList}>
        <div>child text</div>
      </ArrowKeyControl>
    );
    focusser(control.childAt(0), mockElementList[5]);
    focusChecker(mockElementList[0], mockElementList[5]);
  });

  it("Handles focus on the control component", () => {
    const control = shallow(
      <ArrowKeyControl idList={mockIDList}>
        <div>child text</div>
      </ArrowKeyControl>
    );
    focusser(control.childAt(0), control.props().children.ref.current);
    focusChecker(control.props().children.ref.current, mockElementList[0]);
    expect(mockElementList[0].focus).toHaveBeenCalled();
  });
});
