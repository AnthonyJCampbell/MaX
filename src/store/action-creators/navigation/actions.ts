// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Exports actions that directly influence display behaviour when navigating within the app
 */

import { ActionTypes } from "shared/types";
import { DialKeyValue } from "store/types";
import { fullname } from "components/utils/common";
import { oneLine } from "common-tags";
import log from "src/renderer-logging";
import { WindowTypes } from "shared/types";
import { Contact, ModalPopupTypes } from "src/types";
import { ipcChannels } from "shared/constants";

import { PaneManagementAction, ContactsAction, MessagingAction, EmptyAction } from "store/types";
import { Dispatch } from "react";
import { PaneControlState, Drafts, BannerType } from "shared/types";
import store from "store/store";
import { selectChatsWithContact } from "selectors/messaging";
const { ipcRenderer } = window.require("electron");

/**
 * Toggle whether favourites are currently shown or collapsed.
 *
 * @param {boolean} displayFavs
 *  */
export const setFavourites = (displayFavs: boolean): PaneManagementAction => {
  log.debug(`Return SET_FAVOURITES action to ${displayFavs}`);
  return {
    type: ActionTypes.SET_FAVOURITES,
    payload: {
      displayFavs,
    },
  };
};

/**
 * Update the current search term in the search field.
 *
 * @param {string} searchTerm
 */
export const setSearchTerm = (searchTerm: string): PaneManagementAction => {
  log.debug(`Return SET_SEARCH_TERM action to ${searchTerm}`);
  return {
    type: ActionTypes.SET_SEARCH_TERM,
    payload: {
      searchTerm,
    },
  };
};

/**
 * Update the current search term, appending a given dial key element to the end of search term.
 * This should be used to handle Mid Pane dial pad on key down event.
 *
 * @param dialKeyPressed The string to append, which should be one of the dial pad button string value.
 */
export const appendDigitToSearch = (dialKeyPressed: DialKeyValue): PaneManagementAction => {
  log.debug(`Appending the dial key "${dialKeyPressed}" to the end of searchTerm`);
  return {
    type: ActionTypes.APPEND_DIGIT_TO_SEARCH,
    payload: {
      dialKeyPressed,
    },
  };
};

/**
 * @param {number} searchResultsCount the number of search results shown in the UI
 */
export const setSearchResultsCount = (searchResultsCount: number): PaneManagementAction => {
  log.debug(`Return SET_SEARCH_RESULTS_COUNT action to ${searchResultsCount}`);
  return {
    type: ActionTypes.SET_SEARCH_RESULTS_COUNT,
    payload: {
      searchResultsCount,
    },
  };
};

type DispatchFunction = (payload: ContactsAction | PaneManagementAction) => void;

const _reduxDispatchFn: DispatchFunction = (payload) => store.dispatch(payload);
const _reduxIpcEventFn: DispatchFunction = (payload) =>
  ipcRenderer.send(ipcChannels.sendReduxActionToMainWindow, payload);

/**
 * Internal generic set Selected Contact function. A common function to avoid duplication of code.
 *
 * @param selectedContact Object containing all contact information which is then
 * rendered on the right-pane NOTE: in the future, this'll probably be replaced with a reference
 * to the contact's hashed UID
 * @param dispatchFn A dispatch function, which should be one of: `_reduxIpcEventFn` or `_reduxDispatchFn`
 */
const _setSelectedContact = (
  selectedContact: Contact,
  dispatchFn: DispatchFunction,
  forceMessageRemoteParty?: string
): ContactsAction => {
  const chats = selectChatsWithContact(selectedContact)(store.getState());
  log.debug(
    `Return SELECT_CONTACT action with contact ${fullname(selectedContact)} (UID: ${
      selectedContact.uid
    })`
  );

  dispatchFn({
    type: ActionTypes.SET_MODAL_POPUP_VISIBILITY,
    payload: {
      showModalPopup: ModalPopupTypes.noModal,
    },
  });

  dispatchFn({
    type: ActionTypes.SET_FORCE_MESSAGE_REMOTE_PARTY,
    payload: {
      forceMessageRemoteParty: forceMessageRemoteParty || "",
    },
  });

  const activeRightPane =
    selectedContact.im || chats.some((chat) => chat.message.length > 0) || forceMessageRemoteParty
      ? "chat"
      : "contactDetails";
  log.debug(`Set active right pane to: ${activeRightPane}`);
  dispatchFn({
    type: ActionTypes.SET_ACTIVE_RIGHT_PANE,
    payload: {
      activeRightPane,
    },
  });

  return {
    type: ActionTypes.SET_SELECTED_CONTACT,
    payload: {
      selectedContact,
    },
  };
};

/**
 * @param {contact} selectedContact - Object containing all contact information which is then
 * rendered on the right-pane NOTE: in the future, this'll probably be replaced with a reference
 * to the contact's hashed UID
 * This action will dispatch the 'set_modal_popup_visibility' action if there is a modal being shown,
 * to hide it before changing the contact, and 'set_initiating_sms' to hide the chat pane when selecting
 * a new contact without initiating SMS.
 */
export const setSelectedContact = (
  selectedContact: Contact,
  forceMessageRemoteParty?: string
): ContactsAction => {
  const contactsAction: ContactsAction = _setSelectedContact(
    selectedContact,
    _reduxDispatchFn,
    forceMessageRemoteParty || ""
  );
  return contactsAction;
};

/**
 * Set the selected contact of the main window (via Node)
 * @param {contact} selectedContact - Object containing all contact information which is then
 * rendered on the right-pane of the main window NOTE: in the future, this'll probably be replaced
 * with a reference to the contact's hashed UID
 */
export const selectContactViaNode = (selectedContact: Contact): void => {
  const contactsAction: ContactsAction = _setSelectedContact(selectedContact, _reduxIpcEventFn);
  _reduxIpcEventFn(contactsAction);
};

/**
 * @param {string} activeMidPane - Denotes what should be visible on the midbar
 */
export const setActiveMidPane = (activeMidPane: string): PaneManagementAction | void => {
  const validMidPanes = ["contacts", "calls", "chat", "meetings"];
  if (!validMidPanes.includes(activeMidPane)) {
    log.error(
      oneLine`
        Attempted to dispatch SET_ACTIVE_MID_PANE action with invalid payload. Valid payloads are
         "${validMidPanes}" but the received payload was "${activeMidPane}". Action will not be
         dispatched`
    );
    return;
  }

  log.debug(`Return SET_ACTIVE_MID_PANE action with payload "${activeMidPane}"`);
  return {
    type: ActionTypes.SET_ACTIVE_MID_PANE,
    payload: {
      activeMidPane,
    },
  };
};

/**
 * @param {string} activeRightPane - Denotes what should be visible on the rightbar content panel
 */
export const setActiveRightPane = (activeRightPane: string): PaneManagementAction | void => {
  const validRightPanes = ["chat", "contactDetails"];
  if (!validRightPanes.includes(activeRightPane)) {
    log.error(
      oneLine`
        Attempted to dispatch SET_ACTIVE_RIGHT_PANE action with invalid payload. Valid payloads are
         "${validRightPanes}" but the received payload was "${activeRightPane}". Action will not be
         dispatched`
    );
    return;
  }

  log.debug(`Return SET_ACTIVE_RIGHT_PANE action with payload "${activeRightPane}"`);
  return {
    type: ActionTypes.SET_ACTIVE_RIGHT_PANE,
    payload: {
      activeRightPane,
    },
  };
};

/**
 * @param {string} forceMessageRemoteParty - the user has selected a remote party that we don't want to overwrite
 */
export const setForceMessageRemoteParty = (
  forceMessageRemoteParty: string
): PaneManagementAction => {
  log.debug(
    `Return SET_FORCE_MESSAGE_REMOTE_PARTY action with payload "${forceMessageRemoteParty}"`
  );
  return {
    type: ActionTypes.SET_FORCE_MESSAGE_REMOTE_PARTY,
    payload: {
      forceMessageRemoteParty,
    },
  };
};

/**
 * Save off the list of draft messages
 *
 * The MessageBox component stores these messages in its own local state and uses this function to
 * save them off when it unmounts
 * @param {object} drafts - Object of the form `{contact_uid: "draft message", ...}`
 */
export const saveDrafts = (drafts: Drafts): MessagingAction => {
  log.debug(`Return SAVE_DRAFTS action with payload "${drafts}"`);

  return {
    type: ActionTypes.SAVE_DRAFTS,
    payload: {
      drafts,
    },
  };
};

/**
 * Store a reference to the search component
 *
 * This enables other components to programatically set focus to the search component
 * @param {number} ref - reference to the search component
 */
export const focusMidbarSearch = (ref: number): PaneManagementAction => {
  log.debug(`Return FOCUS_MIDBAR_SEARCH action with payload "${ref}`);

  return {
    type: ActionTypes.FOCUS_MIDBAR_SEARCH,
    payload: {
      ref,
    },
  };
};

/**
 * Focus the message box component
 */
export const focusRightbarMessage = (): EmptyAction => {
  log.debug(`Return FOCUS_RIGHTBAR_MESSAGE action`);

  return {
    type: ActionTypes.FOCUS_RIGHTBAR_MESSAGE,
    payload: {},
  };
};

/**
 * Set the Disabled Call Button to the passed number
 * @param {string} number The number of the contact which Call button to disable
 */
export const setCallButtonDisabled = (number: string): PaneManagementAction => {
  log.debug(`Return DISABLED_CALL_BUTTON action with payload ${number}`);

  return {
    type: ActionTypes.DISABLED_CALL_BUTTON,
    payload: {
      number,
    },
  };
};

/**
 * Display the "Unimplemented" popup
 * @param {string} feature The name of the unimplemented feature
 */
export const showUnimplemented =
  (feature: string) =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    log.debug(`Feature "${feature}" is not implemented yet - display the unimplemented popup`);

    // Hide it if it already exists so that we get the animation of it appearing again
    dispatch({
      type: ActionTypes.SET_UNIMPLEMENTED_POPUP_VISIBILITY,
      payload: {
        visible: false,
      },
    });

    // Allow the rest of the event loop to process so that the popup is un-rendered, then trigger it
    // to display again
    setTimeout(
      () =>
        dispatch({
          type: ActionTypes.SET_UNIMPLEMENTED_POPUP_VISIBILITY,
          payload: {
            visible: true,
          },
        }),
      0
    );
  };

/**
 * Hide the "Unimplemented" popup
 */
export const hideUnimplemented = (): PaneManagementAction => {
  log.debug(`Hiding the unimplemented popup`);

  return {
    type: ActionTypes.SET_UNIMPLEMENTED_POPUP_VISIBILITY,
    payload: {
      visible: false,
    },
  };
};

/**
 * Display the "Bug Report" popup
 */
export const showBugReport =
  () =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    log.debug(`Display the bug report popup`);

    // Hide it if it already exists so that we get the animation of it appearing again
    dispatch({
      type: ActionTypes.SET_BUG_REPORT_POPUP_VISIBILITY,
      payload: {
        visible: false,
      },
    });

    // Allow the rest of the event loop to process so that the popup is un-rendered, then trigger it
    // to display again
    setTimeout(
      () =>
        dispatch({
          type: ActionTypes.SET_BUG_REPORT_POPUP_VISIBILITY,
          payload: {
            visible: true,
          },
        }),
      0
    );
  };

/**
 * Hide the "Bug report" popup
 */
export const hideBugReport = (): PaneManagementAction => {
  log.debug(`Hiding the bug report popup`);

  return {
    type: ActionTypes.SET_BUG_REPORT_POPUP_VISIBILITY,
    payload: {
      visible: false,
    },
  };
};

/**
 * Returns an action to add a banner
 * @param banner - The banner to be added
 * @returns The add banner action
 */
export const addBanner = (bannerType: BannerType): PaneManagementAction => {
  log.debug(`Adding banner: ${bannerType}`);

  return {
    type: ActionTypes.ADD_BANNER,
    payload: {
      bannerType,
    },
  };
};

/**
 * Remove the current active banner
 */
export const removeBanner = (bannerType: BannerType): PaneManagementAction => {
  log.debug(`Removing banner: ${bannerType}`);

  return {
    type: ActionTypes.REMOVE_BANNER,
    payload: {
      bannerType,
    },
  };
};

/**
 * Add the delete contact content to the popup modal
 */
export const showConfirmDeletePopup =
  () =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    dispatch({
      type: ActionTypes.SET_MODAL_POPUP_VISIBILITY,
      payload: {
        showModalPopup: ModalPopupTypes.deleteContact,
      },
    });
  };

/**
 * Add the log out content to the popup modal
 */
export const showConfirmLogOutPopup =
  () =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    dispatch({
      type: ActionTypes.SET_MODAL_POPUP_VISIBILITY,
      payload: {
        showModalPopup: ModalPopupTypes.logOut,
      },
    });
  };

/**
 * Hide the modal popup
 */
export const hideModalPopup =
  () =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    dispatch({
      type: ActionTypes.SET_MODAL_POPUP_VISIBILITY,
      payload: {
        showModalPopup: ModalPopupTypes.noModal,
      },
    });
  };

/**
 * Show and focus the main window
 */
export const showMainWindow = (): void => {
  log.debug("Showing the main window");
  ipcRenderer.send(ipcChannels.showWindow, { type: WindowTypes.main });
};

/**
 * Send state over IPC, to update pane control to changes that impact BrowserWindow management.
 * @param {PaneControlState} state - The state to update pane control to.
 */
export const updatePaneControlState = (state: PaneControlState): void => {
  log.ipc(`Update pane control state to: ${JSON.stringify(state)}`);
  ipcRenderer.send(ipcChannels.paneControlStateUpdate, state);
};

/**
 * Change the custom status state in the avatar menu.
 *
 * @param customStatusState - A CustomStatusState enum (components/utils/common -> CustomStatusState)
 */
export const setCustomStatusState =
  (customStatusState: number) =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    log.debug(`Changing custom status state to: ${customStatusState}`);

    dispatch({
      type: ActionTypes.SET_CUSTOM_STATUS_STATE,
      payload: {
        customStatusState,
      },
    });
  };

/**
 * Change the presence menu state in the avatar menu.
 *
 * @param presenceMenuState - A PresenceMenuState enum (components/utils/common -> PresenceMenuState)
 */
export const setPresenceMenuState =
  (presenceMenuState: number) =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    log.debug(`Changing presence menu state to: ${presenceMenuState}`);

    dispatch({
      type: ActionTypes.SET_PRESENCE_MENU_STATE,
      payload: {
        presenceMenuState,
      },
    });
  };

/**
 * Show or hide the Mid Pane dial pad.
 *
 * @param isMidPaneDialPadVisible - true for visible, false for hidden
 */
export const setIsMidPaneDialPadVisible =
  (isMidPaneDialPadVisible: boolean) =>
  (dispatch: Dispatch<PaneManagementAction>): void => {
    log.debug(`Setting Mid Pane dial pad visibility to: ${isMidPaneDialPadVisible}`);

    dispatch({
      type: ActionTypes.SET_IS_MID_PANE_DIAL_PAD_VISIBLE,
      payload: {
        isMidPaneDialPadVisible,
      },
    });
  };
