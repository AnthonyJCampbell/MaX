// Copyright 2021 Metaswitch Networks - Highly Confidential Material

/**
 * String used as the UID of the placeholder selected contact
 */
export const noSelectedContactUid = "default_selected_contact";

/**
 * Channels to be used by React <> Node IPC communications
 */
export const ipcChannels = {
  wispaRequest: "wispaRequest",
  wispaMessage: "wispaMessage",
  mainWindowAction: "mainWindowAction",
  paneControlStateUpdate: "paneControlStateUpdate",
  resizeWindow: "resizeWindow",
  showWindow: "showWindow",
  setOverlayIcon: "setOverlayIcon",
  sendReduxActionToMainWindow: "sendReduxActionToMainWindow",
  sendMainWindowEvent: "sendMainWindowEvent",
  identifiersAndMetadataRequest: "identifiersAndMetadataRequest",
};

/**
 * Just in case the wispa message don't arrive just because of reasons,
 * we are setting this to be the same default value as Java Client uses:
 *
 * AccessionDesktop/plugins/phonenumberutils/src/net/java/sip/communicator/impl/phonenumberutils/PhoneNumberUtilsActivator.java
 * protected static final String DEFAULT_REGION_CODE = "US";
 */
export const DEFAULT_EAS_REGION = "US";

/**
 * Whenever `tabIndex` receives a negative number (usually tabIndex={-1}),
 * it means that the element is not reachable via sequential keyboard navigation,
 * but could be focused with JavaScript or visually by clicking with the mouse.
 * It's mostly useful to create accessible widgets with JavaScript.
 *
 * Further information can be found at:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
 */
export const UN_TABABLE = -1;
