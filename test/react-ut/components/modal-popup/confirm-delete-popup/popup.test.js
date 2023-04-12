// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ConfirmDeletePopup from "components/modal-popup/confirm-delete-popup/popup";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as redux from "react-redux";
import { bilbo, gandalf, peter } from "shared/mocks/mock-contacts";
import { chatWithGandalf, chatWithPeter } from "shared/mocks/mock-chats";
import { mockedT } from "shared/mocks/ts-utils";
import { showChatHistory } from "action-creators/ipc-outgoing/messaging-actions";
import { deleteContact } from "action-creators/ipc-outgoing/contacts-actions";
import { hideModalPopup } from "action-creators/navigation/actions";
import * as S from "components/modal-popup/confirm-delete-popup/styles";
import { fullname } from "components/utils/common";
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

describe("<ConfirmDeletePopup/>", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Renders a BG contact", () => {
    const mockState = {
      messagingReducer: { chats: [chatWithGandalf] },
      contactReducer: { contacts: [gandalf], selectedContact: gandalf },
      paneManagementReducer: { showConfirmDeletePopup: gandalf.uid },
    };

    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));
    fullname.mockReturnValue("Gandalf The ⚪");
    const wrap = shallow(<ConfirmDeletePopup />);

    const variableTextComponent = wrap.find(S.VariableText);
    expect(variableTextComponent.find("h1").text()).toBe(mockedT("warnNetworkContact"));

    const paragraphs = variableTextComponent.find("p");
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs.at(0).text()).toBe(mockedT("textResetContact", { name: fullname(gandalf) }));
    expect(paragraphs.at(1).text()).toBe(mockedT("textNetworkContact"));
    expect(paragraphs.at(2).text()).toBe(mockedT("mayLoseChat exportChatHistory"));

    const buttons = wrap.find(S.Button);
    expect(buttons).toHaveLength(3);
    expect(buttons.at(0).text()).toBe(mockedT("resetNetwork"));
    expect(buttons.at(1).text()).toBe(mockedT("viewChatHistory"));
    expect(buttons.at(2).text()).toBe(mockedT("cancel"));
  });

  it("Renders a non BG contact", () => {
    const mockState = {
      messagingReducer: { chats: [chatWithPeter] },
      contactReducer: { contacts: [peter], selectedContact: peter },
      paneManagementReducer: { showConfirmDeletePopup: peter.uid },
    };

    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));
    fullname.mockReturnValue("Peter Parker");
    const wrap = shallow(<ConfirmDeletePopup />);
    expect(fullname).toHaveBeenCalledWith(peter);

    const variableTextComponent = wrap.find(S.VariableText);
    expect(variableTextComponent.find("h1").text()).toBe(mockedT("warnDeleteContact"));

    const paragraphs = variableTextComponent.find("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs.at(0).text()).toBe(mockedT("textDeleteContact", { name: fullname(peter) }));
    expect(paragraphs.at(1).text()).toBe(mockedT("exportChatHistory"));

    const buttons = wrap.find(S.Button);
    expect(buttons).toHaveLength(3);
    expect(buttons.at(0).text()).toBe(mockedT("delete"));
    expect(buttons.at(1).text()).toBe(mockedT("viewChatHistory"));
    expect(buttons.at(2).text()).toBe(mockedT("cancel"));
  });

  it("Renders a non IM contact without chat history", () => {
    const mockState = {
      messagingReducer: { chats: [] },
      contactReducer: { contacts: [bilbo], selectedContact: bilbo },
      paneManagementReducer: { showConfirmDeletePopup: bilbo.uid },
    };

    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));
    fullname.mockReturnValue("Bilbo Baggins");
    const wrap = shallow(<ConfirmDeletePopup />);

    expect(fullname).toHaveBeenCalledWith(bilbo);

    const variableTextComponent = wrap.find(S.VariableText);
    expect(variableTextComponent.find("h1").text()).toBe(mockedT("warnDeleteContact"));

    const paragraphs = variableTextComponent.find("p");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs.text()).toBe(mockedT("textDeleteContact", { name: fullname(bilbo) }));

    const buttons = wrap.find(S.Button);
    expect(buttons).toHaveLength(2);
    expect(buttons.at(0).text()).toBe(mockedT("delete"));
    expect(buttons.at(1).text()).toBe(mockedT("cancel"));
  });

  it("Delete the contact clicking the delete button", () => {
    const mockState = {
      messagingReducer: { chats: [chatWithGandalf] },
      contactReducer: { contacts: [gandalf], selectedContact: gandalf },
      paneManagementReducer: { showConfirmDeletePopup: gandalf.uid },
    };
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));

    const wrap = shallow(<ConfirmDeletePopup />);
    wrap.find({ id: "confirmDeletePopup-Delete" }).simulate("click");
    expect(deleteContact).toHaveBeenCalledWith(gandalf);
    expect(showChatHistory).not.toHaveBeenCalled();
    expect(hideModalPopup).toHaveBeenCalled();
  });

  it("Opens the view chat java UI clicking the export chat history button", () => {
    const mockState = {
      messagingReducer: { chats: [chatWithGandalf] },
      contactReducer: { contacts: [gandalf], selectedContact: gandalf },
      paneManagementReducer: { showConfirmDeletePopup: gandalf.uid },
    };
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));

    const wrap = shallow(<ConfirmDeletePopup />);
    wrap.find({ id: "confirmDeletePopup-ViewChatHistory" }).simulate("click");
    expect(deleteContact).not.toHaveBeenCalled();
    expect(showChatHistory).toHaveBeenCalled();
    expect(hideModalPopup).not.toHaveBeenCalled();
  });

  it("Hides the dialog on clicking the cancel button", () => {
    const mockState = {
      messagingReducer: { chats: [chatWithGandalf] },
      contactReducer: { contacts: [gandalf], selectedContact: gandalf },
      paneManagementReducer: { showConfirmDeletePopup: gandalf.uid },
    };
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));

    const wrap = shallow(<ConfirmDeletePopup />);
    wrap.find({ id: "confirmDeletePopup-Cancel" }).simulate("click");
    expect(deleteContact).not.toHaveBeenCalled();
    expect(showChatHistory).not.toHaveBeenCalled();
    expect(hideModalPopup).toHaveBeenCalled();
  });
});
