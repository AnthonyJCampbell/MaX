// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import DefaultHeaderPanel from "components/rightbar/content-header-panel/default-header-panel/panel";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { peter, bilbo, gandalf } from "shared/mocks/mock-contacts";
import * as redux from "react-redux";
import { createMeeting, updateMeeting } from "action-creators/ipc-outgoing/meetings-actions";
import { updateContactIsFavourite } from "action-creators/ipc-outgoing/contacts-actions";
import Avatar from "components/avatar/avatar";
import TopButton from "components/rightbar/content-header-panel/top-button/button";
import CallButton from "components/rightbar/content-header-panel/default-header-panel/call-button/call-button";
import MeetingButton from "assets/rightbar/button-meeting.svg";
import AddToMeetingButton from "assets/rightbar/button-meeting-add.svg";
import MoreButton from "assets/rightbar/button-more.svg";
import * as Shared from "components/rightbar/content-header-panel/shared-styles";
import each from "jest-each";
import NotifyWhenAvailableButton from "components/rightbar/content-header-panel/default-header-panel/notify-button";
import TopMenuButton from "components/rightbar/content-header-panel/top-button/menu-button";
import MoreMenu from "components/rightbar/content-header-panel/more-menu/more-menu";
import IconButton from "components/ui/IconButton/IconButton";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/utils/common");
jest.mock("react-redux");
jest.mock("components/avatar/avatar");
jest.mock("components/rightbar/content-header-panel/top-button/button");
jest.mock("components/rightbar/content-header-panel/top-button/menu-button");
jest.mock("components/rightbar/content-header-panel/default-header-panel/call-button/call-button");
jest.mock("components/ui/IconButton/IconButton");
jest.mock("action-creators/ipc-outgoing/meetings-actions");
jest.mock("action-creators/ipc-outgoing/contacts-actions");
jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const useSelectorMock = jest.spyOn(redux, "useSelector");
let mockState;

beforeEach(() => {
  mockState = {
    contactReducer: {
      selectedContact: {},
    },
    meetingReducer: {
      meetings: [],
    },
    settingsReducer: {
      settings: {
        meetings: {
          enabled: true,
        },
        general: {
          profilePicture: undefined,
          displayName: "",
          accountNumber: "",
          easRegion: "GB",
        },
      },
    },
  };

  useSelectorMock.mockImplementation((callback) => callback(mockState));
});

describe("<DefaultHeaderPanel />", () => {
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(jest.fn());

  each([
    ["Peter", peter],
    ["Bilbo (no IM)", bilbo],
  ]).it("Renders for %s", (testName, contact) => {
    mockState.contactReducer.selectedContact = contact;
    const wrap = shallow(<DefaultHeaderPanel />);
    expect(wrap.containsMatchingElement(<Avatar contact={contact} />)).toBe(true);
    expect(wrap.containsMatchingElement(<Shared.LowerDetail />)).toBe(true);
    expect(wrap.containsMatchingElement(<NotifyWhenAvailableButton contact={contact} />)).toBe(
      true
    );
    expect(wrap.containsMatchingElement(<IconButton />)).toBe(true);

    if (testName === "Peter") {
      expect(
        wrap.containsMatchingElement(<TopButton imageSrc={MeetingButton} parent="default" />)
      ).toBe(true);
    } else {
      expect(
        wrap.containsMatchingElement(
          <TopButton imageSrc={MeetingButton} parent="default" disabled={true} />
        )
      ).toBe(true);
    }
    expect(wrap.containsMatchingElement(<CallButton phoneNumbers={contact.phoneNumbers} />)).toBe(
      true
    );

    expect(
      wrap.containsMatchingElement(
        <TopMenuButton imageSrc={MoreButton} menu={<MoreMenu contact={contact} inCall={false} />} />
      )
    ).toBe(true);
  });

  it("Hides the MeetingButton when settings.meetings.enabled is false", () => {
    mockState.contactReducer.selectedContact = peter;
    mockState.settingsReducer.settings.meetings.enabled = false;

    const wrap = shallow(<DefaultHeaderPanel />);
    expect(
      wrap.containsMatchingElement(<TopButton imageSrc={MeetingButton} parent="default" />)
    ).toBe(false);
  });

  it("Dispatches action to create a new meeting when clicking meeting button", () => {
    mockState.contactReducer.selectedContact = gandalf;

    const wrap = shallow(<DefaultHeaderPanel />);
    const meetingButton = wrap.find(TopButton).find({ imageSrc: MeetingButton });

    // Can't tell Enzyme to click the TopButton as it's a subcomponent, but we still want to test
    // that it triggers the right behaviour in its parent, so call it's click action directly.
    const clickAction = meetingButton.props().clickAction;
    clickAction();

    expect(createMeeting).toHaveBeenCalledWith([{ value: gandalf.im.value }], "");
  });

  it("Dispatches action to invite to the current meeting when clicking meeting button", () => {
    mockState.contactReducer.selectedContact = gandalf;
    mockState.meetingReducer.meetings = [{ uid: "0987654321" }];

    const wrap = shallow(<DefaultHeaderPanel />);
    const meetingButton = wrap.find(TopButton).find({ imageSrc: AddToMeetingButton });

    // Can't tell Enzyme to click the TopButton as it's a subcomponent, but we still want to test
    // that it triggers the right behaviour in its parent, so call it's click action directly.
    const clickAction = meetingButton.props().clickAction;
    clickAction();

    expect(updateMeeting).toHaveBeenCalledWith([{ value: gandalf.im.value }], "");
  });

  it("Should render Favourite button", () => {
    mockState.contactReducer.selectedContact = gandalf;

    const wrap = shallow(<DefaultHeaderPanel />);
    const iconButton = wrap.find(IconButton);
    expect(iconButton.exists()).toBe(true);

    expect(iconButton.find("#addToFavouritesButton").exists()).toBe(true);
  });

  it("should call updateContactIsFavourite when clicking in favourites toggle button", () => {
    mockState.contactReducer.selectedContact = gandalf;

    const wrap = shallow(<DefaultHeaderPanel />);
    const favouriteButton = wrap.find(IconButton).find("#addToFavouritesButton");
    favouriteButton.props().onClickHandler();

    expect(updateContactIsFavourite).toHaveBeenCalledWith(gandalf.uid, true);
  });

  it("should remove favourite contact from favourites when clicking in favourites toggle button", () => {
    let favouriteGandalf = mutableCloneDeep(gandalf);
    favouriteGandalf.isFavourite = true;
    mockState.contactReducer.selectedContact = favouriteGandalf;

    const wrap = shallow(<DefaultHeaderPanel />);
    const favouriteButton = wrap.find(IconButton).find("#addToFavouritesButton");
    favouriteButton.props().onClickHandler();

    expect(updateContactIsFavourite).toHaveBeenCalledWith(favouriteGandalf.uid, false);
  });
});
