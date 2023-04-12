// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";

import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mutableCloneDeep, mockedT } from "shared/mocks/ts-utils";

import "test/react-ut/components/require-mock";
import { peter, bilbo, initialSelected } from "shared/mocks/mock-contacts";

import MoreMenu from "components/rightbar/content-header-panel/more-menu/more-menu";
import { Button } from "components/menu/menu";
import { showConfirmDeletePopup } from "action-creators/navigation/actions";
import {
  editContact,
  updateContactNWA,
  updateContactIsFavourite,
} from "action-creators/ipc-outgoing/contacts-actions";
import { showChatHistory } from "action-creators/ipc-outgoing/messaging-actions";
import { PresenceState } from "src/types";
import NotifyOn from "assets/rightbar/menu-button-notify-on.svg";
import NotifyOff from "assets/rightbar/menu-button-notify.svg";
import History from "assets/rightbar/menu-button-history.svg";
import EditContact from "assets/rightbar/menu-button-edit.svg";
import DeleteContact from "assets/rightbar/menu-button-delete.svg";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");
jest.mock("components/menu/menu");
jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/contacts-actions");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("components/rightbar/content-header-panel/top-button/button");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

const setVisible = jest.fn();
let mockVisible = false;

const useRefMock = jest.spyOn(React, "useRef");
useRefMock.mockImplementation(() => ({
  current: {
    focus: jest.fn(),
    setAttribute: jest.fn(),
  },
}));

const useSelectorMock = jest.spyOn(redux, "useSelector");
let mockState;

beforeEach(() => {
  mockState = {
    settingsReducer: {
      settings: {
        meetings: {
          enabled: true,
        },
        general: {
          profilePicture: undefined,
          displayName: "",
          accountNumber: "",
        },
      },
    },
    messagingReducer: { chats: [] },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
});

describe("<MoreMenu />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  it("Renders for a contact being watched", () => {
    const contact = mutableCloneDeep(peter);
    contact.presence.state = PresenceState.AWAY;
    contact.notifyWhenAvailable = true;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );
    expect(wrap.containsMatchingElement(<Button imageSrc={NotifyOn} disabled={false} />)).toBe(
      true
    );
  });

  it("Renders when contact can be watched", () => {
    const contact = mutableCloneDeep(peter);
    contact.presence.state = PresenceState.BUSY;
    contact.notifyWhenAvailable = false;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    expect(wrap.containsMatchingElement(<Button imageSrc={NotifyOff} disabled={false} />)).toBe(
      true
    );
  });

  it("Notify button is disabled when contact is available", () => {
    const contact = mutableCloneDeep(peter);
    contact.presence.state = PresenceState.ONLINE;
    contact.notifyWhenAvailable = false;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    expect(wrap.containsMatchingElement(<Button imageSrc={NotifyOff} disabled={true} />)).toBe(
      true
    );
  });

  it("Notify button sends a request to stop watching a contact", () => {
    const contact = mutableCloneDeep(peter);
    contact.presence.state = PresenceState.IN_A_MEETING;
    contact.notifyWhenAvailable = true;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    wrap.find(Button).find({ id: "moreMenuRow-NotifyWA" }).props().clickAction();

    expect(updateContactNWA).toHaveBeenCalledWith(contact.uid, false);
  });

  it("Notify button sends a request to start watching a contact", () => {
    const contact = mutableCloneDeep(peter);
    contact.presence.state = PresenceState.IN_A_CALL;
    contact.notifyWhenAvailable = false;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    wrap.find(Button).find({ id: "moreMenuRow-NotifyWA" }).props().clickAction();

    expect(updateContactNWA).toHaveBeenCalledWith(contact.uid, true);
  });

  it("View chat history button sends a request to show the chat history ui", () => {
    const contact = mutableCloneDeep(peter);
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    wrap.find(Button).find({ id: "moreMenuRow-ShowChatHistory" }).props().clickAction();

    expect(showChatHistory).toHaveBeenCalledWith(contact);
  });

  it("View chat history button is HIDDEN for contacts with no IMAddress", () => {
    const contact = mutableCloneDeep(bilbo);
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    expect(
      wrap.containsMatchingElement(
        <Button
          id={"moreMenuRow-ShowChatHistory"}
          imageSrc={History}
          text={mockedT("viewChatHistory")}
        />
      )
    ).toBe(false);
  });

  it("View chat history button is SHOWN for contacts with IMAddress", () => {
    const contact = mutableCloneDeep(peter);
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    expect(
      wrap.containsMatchingElement(
        <Button
          id={"moreMenuRow-ShowChatHistory"}
          imageSrc={History}
          text={mockedT("viewChatHistory")}
        />
      )
    ).toBe(true);
  });

  it("Edit contact calls the 'editContact' action in contacts namespace, with a contact as value", () => {
    const contact = mutableCloneDeep(peter);
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    wrap.find(Button).find({ id: "moreMenuRow-EditContact" }).props().clickAction();

    expect(setVisible).toHaveBeenCalledWith(false);
    expect(editContact).toHaveBeenCalledWith(contact);
  });

  it("Delete contact calls the 'showConfirmDeletePopup' action, with a contact uid as value", () => {
    const contact = mutableCloneDeep(peter);
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    wrap.find(Button).find({ id: "moreMenuRow-DeleteContact" }).props().clickAction();

    expect(setVisible).toHaveBeenCalledWith(false);
    expect(showConfirmDeletePopup).toHaveBeenCalled();
  });

  it("Edit contact is HIDDEN when no contact is selected", () => {
    const wrap = shallow(
      <MoreMenu
        contact={initialSelected}
        keyboardNavTools={{ mockVisible, setVisible, useRefMock }}
      />
    );

    expect(
      wrap.containsMatchingElement(
        <Button
          id={"moreMenuRow-EditContact"}
          imageSrc={EditContact}
          text={mockedT("editContact")}
        />
      )
    ).toBe(false);
  });

  it("Delete contact is HIDDEN when no contact is selected", () => {
    const wrap = shallow(
      <MoreMenu
        contact={initialSelected}
        keyboardNavTools={{ mockVisible, setVisible, useRefMock }}
      />
    );

    expect(
      wrap.containsMatchingElement(
        <Button
          id={"moreMenuRow-DeleteContact"}
          imageSrc={DeleteContact}
          text={mockedT("deleteContact")}
        />
      )
    ).toBe(false);
  });

  it("Edit contact is SHOWN when a contact is selected", () => {
    const contact = mutableCloneDeep(bilbo);
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    expect(
      wrap.containsMatchingElement(
        <Button
          id={"moreMenuRow-EditContact"}
          imageSrc={EditContact}
          text={mockedT("editContact")}
        />
      )
    ).toBe(true);
  });

  it("Delete contact is SHOWN when a contact is selected", () => {
    const contact = mutableCloneDeep(bilbo);
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    expect(
      wrap.containsMatchingElement(
        <Button
          id={"moreMenuRow-DeleteContact"}
          imageSrc={DeleteContact}
          text={mockedT("deleteContact")}
        />
      )
    ).toBe(true);
  });

  it("render favourite button in more menu", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.isFavourite = false;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    expect(wrap.find("#moreMenuRow-AddToFavorites").exists()).toBe(true);
  });

  it("click in favourite button should add as favourite", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.isFavourite = false;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    const favouriteButton = wrap.find("#moreMenuRow-AddToFavorites");
    favouriteButton.simulate("click");

    expect(updateContactIsFavourite).toHaveBeenCalledWith(bilbo.uid, true);
  });

  it("click in favourite button when contact is favourite should remove as favourite", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.isFavourite = true;
    const wrap = shallow(
      <MoreMenu contact={contact} keyboardNavTools={{ mockVisible, setVisible, useRefMock }} />
    );

    const favouriteButton = wrap.find("#moreMenuRow-AddToFavorites");
    favouriteButton.simulate("click");

    expect(updateContactIsFavourite).toHaveBeenCalledWith(bilbo.uid, false);
  });
});
