// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import BottomButtons from "components/sidebar/bottom-buttons/buttons";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import each from "jest-each";
import * as redux from "react-redux";
import * as S from "src/components/sidebar/styles";
import FeedbackButton from "assets/sidebar/button-feedback.svg";
import BugButton from "assets/sidebar/button-bug.svg";
import VoicemailButton from "assets/sidebar/button-voicemail.svg";
import { viewVoicemails } from "action-creators/ipc-outgoing/voicemails-actions";
import { showBugReport } from "action-creators/navigation/actions";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");
jest.mock("react-redux");
jest.mock("action-creators/ipc-outgoing/voicemails-actions");
jest.mock("action-creators/navigation/actions");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<BottomButtons />", () => {
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useSelectorMock.mockReturnValue({
    activeMidPane: "contacts",
    focusSearch: 0,
    chats: [],
    voicemailFaxCount: { newMessages: 0 },
  });
  useDispatchMock.mockReturnValue(jest.fn());
  each([0, 4, 10]).it("Renders with %s new voicemails", (voicemailCount) => {
    const wrap = shallow(<BottomButtons voicemailFaxCount={voicemailCount} />);
    expect(
      wrap.containsMatchingElement(
        <button>
          <img src={VoicemailButton} alt="" />
          {voicemailCount > 0 &&
            (voicemailCount > 9 ? (
              <S.Notification>9+</S.Notification>
            ) : (
              <S.Notification>{voicemailCount}</S.Notification>
            ))}
        </button>
      )
    ).toBeTruthy();
    expect(
      wrap.containsMatchingElement(
        <button>
          <img src={FeedbackButton} alt="" />
        </button>
      )
    ).toBeTruthy();
    expect(
      wrap.containsMatchingElement(
        <button>
          <img src={BugButton} alt="" />
        </button>
      )
    ).toBeTruthy();
  });

  it("Opens the voicemail link", () => {
    const wrap = shallow(<BottomButtons voicemailFaxCount={0} />);
    wrap.find({ id: "voicemailButton" }).simulate("click");
    expect(viewVoicemails).toHaveBeenCalled();
  });

  it("Opens the send feedback link", () => {
    window.open = jest.fn();
    const wrap = shallow(<BottomButtons voicemailFaxCount={0} />);
    wrap.find({ id: "feedbackButton" }).simulate("click");
    // Not checking the actual link, just that we try to open *a* link.
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it("Opens the bug report link", () => {
    const wrap = shallow(<BottomButtons voicemailFaxCount={0} />);
    wrap.find({ id: "bugButton" }).simulate("click");
    // Not checking the actual link, just that we show the popup
    expect(showBugReport).toHaveBeenCalledTimes(1);
  });
});
