// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests for the paneManagementReducer
 */
import "test/react-ut/components/require-mock";
import { paneManagementReducer } from "reducers/pane-management/reducer";
import { ActionTypes, BannerType, WindowTypes } from "src/shared/types";
import { mockStoreState } from "shared/mocks/mock-states";
import { ModalPopupTypes } from "src/types";
import log from "src/renderer-logging";

let identifiers: { type: WindowTypes };

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("Pane management reducer (Main Window)", () => {
  beforeEach(() => {
    identifiers = { type: WindowTypes.main };
  });
  it("Sets a new active mid pane", () => {
    const initialState = {
      ...mockStoreState.paneManagementReducer,
      activeMidPane: "contacts",
      identifiers,
    };
    const activeMidPaneAction = {
      type: ActionTypes.SET_ACTIVE_MID_PANE,
      payload: {
        activeMidPane: "meetings",
      },
    };
    const expectedState = {
      ...mockStoreState.paneManagementReducer,
      activeMidPane: "meetings",
      identifiers,
    };

    const newState = paneManagementReducer(initialState, activeMidPaneAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Toggles the status of the favourites tab", () => {
    const initialState = {
      ...mockStoreState.paneManagementReducer,
      displayFavs: true,
      identifiers,
    };
    const favouritesAction = {
      type: ActionTypes.SET_FAVOURITES,
      payload: {
        displayFavs: false,
      },
    };
    const expectedState = {
      ...mockStoreState.paneManagementReducer,
      displayFavs: false,
      identifiers,
    };

    const newState = paneManagementReducer(initialState, favouritesAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Sets the search term", () => {
    const initialState = {
      ...mockStoreState.paneManagementReducer,
      searchTerm: "",
      identifiers,
    };
    const searchAction = {
      type: ActionTypes.SET_SEARCH_TERM,
      payload: {
        searchTerm: "Test",
      },
    };
    const expectedState = {
      ...mockStoreState.paneManagementReducer,
      searchTerm: "Test",
      identifiers,
    };

    const newState = paneManagementReducer(initialState, searchAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Sets confirm delete popup visibility state", () => {
    const initialState = {
      ...mockStoreState.paneManagementReducer,
      showModalPopup: ModalPopupTypes.noModal,
      identifiers,
    };
    const popupVisibilityAction = {
      type: ActionTypes.SET_MODAL_POPUP_VISIBILITY,
      payload: {
        showModalPopup: ModalPopupTypes.deleteContact,
      },
    };
    const expectedState = {
      ...mockStoreState.paneManagementReducer,
      showModalPopup: ModalPopupTypes.deleteContact,
      identifiers,
    };

    const newState = paneManagementReducer(initialState, popupVisibilityAction);
    expect(newState).toStrictEqual(expectedState);
  });

  it("Adds DND Banner state", () => {
    const initialState = {
      ...mockStoreState.paneManagementReducer,
      banners: [],
    };
    const addBannerAction = {
      type: ActionTypes.ADD_BANNER,
      payload: {
        bannerType: BannerType.DND,
      },
    };
    const showDNDExpectedState = {
      ...mockStoreState.paneManagementReducer,
      banners: [BannerType.DND],
    };
    const showDNDNewState = paneManagementReducer(initialState, addBannerAction);
    expect(showDNDNewState).toStrictEqual(showDNDExpectedState);
  });
});
