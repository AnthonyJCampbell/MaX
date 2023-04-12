// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ContactBlock from "components/midbar/contact-list/contact-block/contact-block";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { setSelectedContact, focusRightbarMessage } from "action-creators/navigation/actions";
import { bilbo } from "shared/mocks/mock-contacts";
import { fullname } from "components/utils/common";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("react-redux");
jest.mock("components/utils/common");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ContactBlock />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());
  fullname.mockReturnValue("MockReturn");
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  useSelectorMock.mockReturnValue({
    focusMessage: 0,
  });
  const wrap = shallow(<ContactBlock contact={bilbo} />);

  it("Renders", () => {
    expect(fullname).toHaveBeenCalledWith(bilbo);
    expect(wrap.text()).toContain("MockReturn");
  });

  it("Changes the selectedContact and focus on click", () => {
    wrap.simulate("click");
    expect(setSelectedContact).toHaveBeenCalledWith(bilbo);
    expect(focusRightbarMessage).toHaveBeenCalled();
  });
});
