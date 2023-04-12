// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ModalPopup from "components/modal-popup/popup";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { gandalf } from "shared/mocks/mock-contacts";
import { chatWithGandalf } from "shared/mocks/mock-chats";
import { hideModalPopup } from "action-creators/navigation/actions";
import * as S from "components/modal-popup/styles";
import FocusTrap from "focus-trap-react";
import ConfirmDeletePopup from "components/modal-popup/confirm-delete-popup/popup";
import { ModalPopupTypes } from "src/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/contacts-actions");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("react-redux");
jest.mock("components/utils/common");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<ModalPopup />", () => {
  const mockState = {
    messagingReducer: { chats: [chatWithGandalf] },
    contactReducer: { contacts: [gandalf] },
    paneManagementReducer: { showModalPopup: ModalPopupTypes.deleteContact },
  };

  const useSelectorMock = jest.spyOn(redux, "useSelector");
  useSelectorMock.mockImplementation((callback) => callback(mockState));
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  const wrap = shallow(<ModalPopup />);
  const pressKey = (key, wrap) => {
    wrap.find(S.Background).simulate("keyDown", {
      key,
      preventDefault: () => {},
    });
  };
  it("Render the modal", () => {
    expect(
      wrap.containsMatchingElement(
        <S.Background>
          <FocusTrap
            focusTrapOptions={{
              escapeDeactivates: false,
            }}
          >
            <S.PopupContainer>
              <S.ContentContainer>
                <ConfirmDeletePopup />
              </S.ContentContainer>
            </S.PopupContainer>
          </FocusTrap>
        </S.Background>
      )
    ).toBeTruthy();
  });

  it("Hide the modal when pressed the escape button", () => {
    pressKey("Escape", wrap);
    expect(hideModalPopup).toHaveBeenCalled();
  });
});
