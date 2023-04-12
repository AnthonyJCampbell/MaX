// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { BannerType } from "shared/types";
import { DialKeyValue, PaneManagementReducerState } from "store/types";
import { ModalPopupTypes } from "src/types";

/**
 * Handler to set active mid pane
 * @param state - The Redux state
 * @param payloadActiveMidPane - The action payload activeMidPane
 */
export const setActiveMidPane = (
  state: PaneManagementReducerState,
  payloadActiveMidPane: string
): PaneManagementReducerState => {
  return {
    ...state,
    activeMidPane: payloadActiveMidPane,
  };
};

/**
 * Handler to set active right pane
 * @param state - The Redux state
 * @param payloadActiveRightPane - The action payload activeRightPane
 */
export const setActiveRightPane = (
  state: PaneManagementReducerState,
  payloadActiveRightPane: string
): PaneManagementReducerState => {
  return {
    ...state,
    activeRightPane: payloadActiveRightPane,
  };
};

/**
 * Handler to set the remote party of a chat message sent from the message box
 * @param state - The Redux state
 * @param payloadForceMessageRemoteParty - The action payload forceMessageRemoteParty
 */
export const setForceMessageRemoteParty = (
  state: PaneManagementReducerState,
  payloadForceMessageRemoteParty: string
): PaneManagementReducerState => {
  return {
    ...state,
    forceMessageRemoteParty: payloadForceMessageRemoteParty,
  };
};

/**
 * Handler to set the status of the favourites tab
 * @param state - The Redux state
 * @param payloadDisplayFavs - The action payload displayFavs
 */
export const setFavourites = (
  state: PaneManagementReducerState,
  payloadDisplayFavs: boolean
): PaneManagementReducerState => {
  return {
    ...state,
    displayFavs: payloadDisplayFavs,
  };
};

/**
 * Handler to set the search term
 * @param state - The Redux state
 * @param payloadSearchTerm - The action payload searchTerm
 */
export const setSearchTerm = (
  state: PaneManagementReducerState,
  payloadSearchTerm: string
): PaneManagementReducerState => {
  return {
    ...state,
    searchTerm: payloadSearchTerm,
  };
};

/**
 * Handler to set the number of search results shown
 * @param state - The Redux state
 * @param payloadSearchResultsCount - The action payload searchResultsCount
 */
export const setSearchResultsCount = (
  state: PaneManagementReducerState,
  payloadSearchResultsCount: number
): PaneManagementReducerState => {
  return {
    ...state,
    searchResultsCount: payloadSearchResultsCount,
  };
};

/**
 * Handler to toggle the focus trigger for the search box in midbar
 * @param state - The Redux state
 * @param payloadRef - The action payload ref
 */
export const focusMidbarSearch = (
  state: PaneManagementReducerState,
  payloadRef: number
): PaneManagementReducerState => {
  return {
    ...state,
    focusSearch: payloadRef,
  };
};

/**
 * Handler to toggle the focus trigger for the message input box in rightbar
 * @param state - The Redux state
 */
export const focusRightbarMessage = (
  state: PaneManagementReducerState
): PaneManagementReducerState => {
  return {
    ...state,
    // Increment our arbitrary number to trigger a state change, the actual value is irrelevant
    focusMessage: state.focusMessage + 1,
  };
};

/**
 * Handler to set disabledCallButton to the value in the payload
 * @param state - The Redux state
 * @param payloadNumber - The action payload number, number is a phone number or empty string
 */
export const setDisabledCallButton = (
  state: PaneManagementReducerState,
  payloadNumber: string
): PaneManagementReducerState => {
  return {
    ...state,
    disabledCallButton: payloadNumber,
  };
};

/**
 * Handler to set unimplementedPopupVisibility to the value in the payload
 * @param state - The Redux state
 * @param payloadNumber - The action payload visible
 */
export const setUnimplementedPopupVisibility = (
  state: PaneManagementReducerState,
  payloadVisible: boolean
): PaneManagementReducerState => {
  return {
    ...state,
    showUnimplementedPopup: payloadVisible,
  };
};

/**
 * Handler to set bugReportPopupVisibility to the value in the payload
 * @param state - The Redux state
 * @param payloadNumber - The action payload visible
 */
export const setBugReportPopupVisibility = (
  state: PaneManagementReducerState,
  payloadVisible: boolean
): PaneManagementReducerState => {
  return {
    ...state,
    showBugReportPopup: payloadVisible,
  };
};

/**
 * Handler to set showModalPopup to the value in the payload
 * @param state - The Redux state
 * @param modalType - The action payload modalType
 */
export const setShowModalPopup = (
  state: PaneManagementReducerState,
  payloadModalType: ModalPopupTypes
): PaneManagementReducerState => {
  return {
    ...state,
    showModalPopup: payloadModalType,
  };
};

/**
 * Handler to set the state of custom status inside avatar menu
 * @param state - The Redux state
 * @param customStatusState - The expected new value
 */
export const setCustomStatusState = (
  state: PaneManagementReducerState,
  customStatusState: number
): PaneManagementReducerState => {
  return {
    ...state,
    customStatusState,
  };
};

/**
 * Handler to set the state of presence menu inside avatar menu
 * @param state - The Redux state
 * @param presenceMenuState - The expected new value
 */
export const setPresenceMenuState = (
  state: PaneManagementReducerState,
  presenceMenuState: number
): PaneManagementReducerState => {
  return {
    ...state,
    presenceMenuState,
  };
};

/**
 * Handler to add a banner
 * @param state - The Redux state
 * @param bannerType - The banner to add
 */
export const addBanner = (
  state: PaneManagementReducerState,
  bannerType: BannerType
): PaneManagementReducerState => {
  const banners: BannerType[] = [bannerType].concat(state.banners);

  return {
    ...state,
    banners,
  };
};

/**
 * Handler to remove the active banner
 * @param state - The Redux state
 * * @param bannerType - The banner to remove
 */
export const removeBanner = (
  state: PaneManagementReducerState,
  bannerType: BannerType
): PaneManagementReducerState => {
  const banners: BannerType[] = state.banners.filter((item: BannerType) => item !== bannerType);

  return {
    ...state,
    banners,
  };
};

/**
 * Handler to set the focus state of the main window
 * @param state - The Redux state
 * @param isMainWindowFocused - The new focus state of main window
 */
export const setIsMainWindowFocused = (
  state: PaneManagementReducerState,
  isMainWindowFocused: boolean
): PaneManagementReducerState => {
  return {
    ...state,
    isMainWindowFocused,
  };
};

/**
 * Handler to open or hide the dial pad into Mid Pane
 * @param state - The Redux state
 * @param isMidPaneDialPadVisible - The new focus state of main window
 */
export const setIsMidPaneDialPadVisible = (
  state: PaneManagementReducerState,
  isMidPaneDialPadVisible: boolean
): PaneManagementReducerState => {
  return {
    ...state,
    isMidPaneDialPadVisible,
  };
};

/**
 * Append a given dial key value to the end of search term
 *
 * @param state - The Redux state
 * @param dialKeyPressed - The string to append, which should be one of the dial pad button string value.
 */
export const appendDigitToSearch = (
  state: PaneManagementReducerState,
  dialKeyPressed: DialKeyValue
): PaneManagementReducerState => {
  return {
    ...state,
    searchTerm: `${state.searchTerm}${dialKeyPressed}`,
  };
};
