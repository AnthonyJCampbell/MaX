// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls what panes are visible in the app
 */

import { ActionTypes } from "shared/types";
import * as handlers from "./handlers";
import { PaneManagementReducerState, PaneManagementPayload } from "store/types";
import { ModalPopupTypes } from "src/types";
import { CustomStatusState, PresenceMenuState } from "components/utils/common";

const initialState: PaneManagementReducerState = {
  activeMidPane: "contacts",
  activeRightPane: "",
  forceMessageRemoteParty: "",
  displayFavs: true,
  searchTerm: "",
  searchResultsCount: 0,
  focusSearch: 0,
  focusMessage: 0,
  disabledCallButton: "",
  showUnimplementedPopup: false,
  showBugReportPopup: false,
  showModalPopup: ModalPopupTypes.noModal,
  customStatusState: CustomStatusState.INITIAL,
  presenceMenuState: PresenceMenuState.INITIAL,
  banners: [],
  isMainWindowFocused: true,
  isMidPaneDialPadVisible: false,
};

export const paneManagementReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: PaneManagementPayload }
): PaneManagementReducerState => {
  switch (type) {
    case ActionTypes.SET_ACTIVE_MID_PANE:
      if (payload.activeMidPane !== undefined)
        return handlers.setActiveMidPane(state, payload.activeMidPane);
      return state;

    case ActionTypes.SET_ACTIVE_RIGHT_PANE:
      if (payload.activeRightPane !== undefined)
        return handlers.setActiveRightPane(state, payload.activeRightPane);
      return state;

    case ActionTypes.SET_FORCE_MESSAGE_REMOTE_PARTY:
      if (payload.forceMessageRemoteParty !== undefined)
        return handlers.setForceMessageRemoteParty(state, payload.forceMessageRemoteParty);
      return state;

    case ActionTypes.SET_FAVOURITES:
      if (payload.displayFavs !== undefined)
        return handlers.setFavourites(state, payload.displayFavs);
      return state;

    case ActionTypes.SET_SEARCH_TERM:
      if (payload.searchTerm !== undefined)
        return handlers.setSearchTerm(state, payload.searchTerm);
      return state;

    case ActionTypes.SET_SEARCH_RESULTS_COUNT:
      if (payload.searchResultsCount !== undefined)
        return handlers.setSearchResultsCount(state, payload.searchResultsCount);
      return state;

    case ActionTypes.FOCUS_MIDBAR_SEARCH:
      if (payload.ref !== undefined) return handlers.focusMidbarSearch(state, payload.ref);
      return state;

    case ActionTypes.FOCUS_RIGHTBAR_MESSAGE:
      return handlers.focusRightbarMessage(state);

    case ActionTypes.DISABLED_CALL_BUTTON:
      if (payload.number !== undefined)
        return handlers.setDisabledCallButton(state, payload.number);
      return state;

    case ActionTypes.SET_UNIMPLEMENTED_POPUP_VISIBILITY:
      if (payload.visible !== undefined)
        return handlers.setUnimplementedPopupVisibility(state, payload.visible);
      return state;

    case ActionTypes.SET_BUG_REPORT_POPUP_VISIBILITY:
      if (payload.visible !== undefined)
        return handlers.setBugReportPopupVisibility(state, payload.visible);
      return state;

    case ActionTypes.SET_MODAL_POPUP_VISIBILITY:
      if (payload.showModalPopup !== undefined)
        return handlers.setShowModalPopup(state, payload.showModalPopup);
      return state;

    case ActionTypes.SET_CUSTOM_STATUS_STATE:
      if (payload.customStatusState !== undefined)
        return handlers.setCustomStatusState(state, payload.customStatusState);
      return state;

    case ActionTypes.SET_PRESENCE_MENU_STATE:
      if (payload.presenceMenuState !== undefined)
        return handlers.setPresenceMenuState(state, payload.presenceMenuState);
      return state;

    case ActionTypes.ADD_BANNER:
      if (payload.bannerType !== undefined) return handlers.addBanner(state, payload.bannerType);
      return state;

    case ActionTypes.REMOVE_BANNER:
      if (payload.bannerType !== undefined) return handlers.removeBanner(state, payload.bannerType);
      return state;

    case ActionTypes.SET_IS_MAIN_WINDOW_FOCUSED:
      if (payload.isMainWindowFocused !== undefined)
        return handlers.setIsMainWindowFocused(state, payload.isMainWindowFocused);
      return state;

    case ActionTypes.SET_IS_MID_PANE_DIAL_PAD_VISIBLE:
      if (payload.isMidPaneDialPadVisible !== undefined)
        return handlers.setIsMidPaneDialPadVisible(state, payload.isMidPaneDialPadVisible);
      return state;

    case ActionTypes.APPEND_DIGIT_TO_SEARCH:
      if (payload.dialKeyPressed !== undefined)
        return handlers.appendDigitToSearch(state, payload.dialKeyPressed);
      return state;

    default:
      return state;
  }
};
