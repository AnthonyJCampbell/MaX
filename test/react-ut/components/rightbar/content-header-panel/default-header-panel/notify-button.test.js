// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as redux from "react-redux";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import "test/react-ut/components/require-mock";
import { bilbo } from "shared/mocks/mock-contacts";

import NotifyWhenAvailableButton from "components/rightbar/content-header-panel/default-header-panel/notify-button";
import TopButton from "components/rightbar/content-header-panel/top-button/button";
import WatchingIcon from "assets/rightbar/menu-button-notify-on.svg";
import NotWatchingIcon from "assets/rightbar/menu-button-notify.svg";
import { updateContactNWA } from "action-creators/ipc-outgoing/contacts-actions";
import { PresenceState } from "src/types";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("src/renderer-logging");
jest.mock("action-creators/ipc-outgoing/contacts-actions");
jest.mock("components/rightbar/content-header-panel/top-button/button");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("<NotifyWhenAvailableButton />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());
  it("Renders when contact is being watched ", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.presence.state = PresenceState.AWAY;
    contact.notifyWhenAvailable = true;
    const wrap = shallow(<NotifyWhenAvailableButton contact={contact} />);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={WatchingIcon} disabled={false} />)
    ).toBeTruthy();
  });

  it("Renders when contact is not but can be watched ", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.presence.state = PresenceState.BUSY;
    contact.notifyWhenAvailable = false;
    const wrap = shallow(<NotifyWhenAvailableButton contact={contact} />);

    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={NotWatchingIcon} disabled={false} />)
    ).toBeTruthy();
  });

  it("Disabled when contact is available ", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.presence.state = PresenceState.ONLINE;
    contact.notifyWhenAvailable = false;
    const wrap = shallow(<NotifyWhenAvailableButton contact={contact} />);

    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={NotWatchingIcon} disabled={true} />)
    ).toBeTruthy();
  });

  it("Doesn't render when contact doesn't have presence data ", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.presence = undefined;
    contact.notifyWhenAvailable = false;
    const wrap = shallow(<NotifyWhenAvailableButton contact={contact} />);

    expect(wrap.containsMatchingElement(<TopButton />)).toBeFalsy();
  });

  it("Send a request to stop watching a contact ", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.presence.state = PresenceState.IN_A_MEETING;
    contact.notifyWhenAvailable = true;
    const wrap = shallow(<NotifyWhenAvailableButton contact={contact} />);

    const clickAction = wrap.find(TopButton).props().clickAction;
    clickAction();

    expect(updateContactNWA).toHaveBeenCalledWith(contact.uid, false);
  });

  it("Send a request to start watching a contact ", () => {
    const contact = mutableCloneDeep(bilbo);
    contact.presence.state = PresenceState.IN_A_CALL;
    contact.notifyWhenAvailable = false;
    const wrap = shallow(<NotifyWhenAvailableButton contact={contact} />);

    wrap.find(TopButton).props().clickAction();

    expect(updateContactNWA).toHaveBeenCalledWith(contact.uid, true);
  });
});
