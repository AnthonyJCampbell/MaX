// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Manages call-window lifecycle (create, delete, show and hide)
 */

/* eslint-disable @typescript-eslint/no-var-requires */
import log from "../main-logging";
import { PaneControlState, CallStatus, ActiveCall } from "../../node-server/types";
import { CallWindow, CallWindowIdentifiers, CallWindowMetadata } from "./types";

import { windows } from "../ipc-renderer/window-messaging";
import { createInCallWindow, createIncomingCallWindow } from "./create-secondary-windows";
import { WindowTypes } from "../types";

let state: PaneControlState = {
  activeCalls: [],
  selectedContact: null,
  focus: true,
};

function closeCallWindowsWithNoCorrespondingActiveCall(
  window: CallWindow,
  incomingCalls: ActiveCall[],
  inCalls: ActiveCall[]
): void {
  let hasCorrespondingActiveCall: boolean;

  switch (window.identifiers.type) {
    case WindowTypes.incomingCall:
      hasCorrespondingActiveCall = incomingCalls.some(
        (call) => call.uid === window.identifiers.uid
      );
      break;
    case WindowTypes.inCall:
      hasCorrespondingActiveCall = inCalls.some((call) => call.uid === window.identifiers.uid);
      break;
    default:
      return;
  }

  if (!hasCorrespondingActiveCall) {
    log.debug(`Closing window with identifiers ${JSON.stringify(window.identifiers)}`);
    window.close();
  }
}

function createCallWindows(call: ActiveCall, type: WindowTypes): void {
  const identifiers: CallWindowIdentifiers = {
    type,
    uid: call.uid,
  };
  const metadata: CallWindowMetadata = {
    remoteParty: call.remoteParty,
  };
  switch (type) {
    case WindowTypes.incomingCall:
      createIncomingCallWindow(identifiers, metadata);
      break;
    case WindowTypes.inCall:
      createInCallWindow(identifiers, metadata);
      break;
    default:
      log.debug("Window type has no create window method");
      return;
  }
}

function showOrHideWindow(window: CallWindow, state: PaneControlState): void {
  if (window.identifiers.type !== WindowTypes.inCall) return;

  // Save off whether the window was previously visible for logging purposes. A change in visibility
  // is worth a log, but no change is not.
  const windowIsOriginallyShown = window.isVisible();

  if (state.selectedContact === null) {
    if (!windowIsOriginallyShown) {
      log.info(
        `Showing window with identifiers ${window.identifiers} and metadata ${window.metadata}`
      );
    }

    window.showInactive();
    return;
  }
  const mainWindowFocused = state.focus;
  const selectedContactHasMatchingPhoneNumber = state.selectedContact.phone.some(
    (phoneNumber) => phoneNumber.value === window.metadata.remoteParty
  );

  if (mainWindowFocused && selectedContactHasMatchingPhoneNumber) {
    if (windowIsOriginallyShown) {
      log.info(
        `Hiding window with identifiers ${JSON.stringify(
          window.identifiers
        )} and metadata ${JSON.stringify(window.metadata)}`
      );
    }
    window.hide();
  } else {
    if (!windowIsOriginallyShown) {
      log.info(
        `Showing window with identifiers ${JSON.stringify(
          window.identifiers
        )} and metadata ${JSON.stringify(window.metadata)}`
      );
    }
    window.showInactive();
  }
}

/**
 * Recalculate the lifecycle state of all call windows
 *
 * Will create/close/hide/show in-call and incoming call windows based on Pane Control's state
 */
export function recalculateCallWindows(): void {
  log.debug("Recalculating all call windows lifecycle state");
  // TODO Remove this dangerous type cast when all of node-server is in TypeScript.
  // TODO windows.all gets all windows, not just the call ones. Might be improved in the rework
  const allWindows: () => CallWindow[] = () => windows.all as CallWindow[];

  const incomingCalls: ActiveCall[] = state.activeCalls.filter(
    (call) => call.status === CallStatus.INCOMING
  );
  const inCalls: ActiveCall[] = state.activeCalls.filter(
    (call) =>
      call.status === CallStatus.HOLD ||
      call.status === CallStatus.CURRENT ||
      call.status === CallStatus.CONNECTING ||
      call.status === CallStatus.RINGING
  );

  log.debug("Ensure all call windows that shouldn't exist don't");
  allWindows().forEach((window) =>
    closeCallWindowsWithNoCorrespondingActiveCall(window, incomingCalls, inCalls)
  );

  log.debug("Ensure all call windows that should exist do");
  incomingCalls.forEach((call) => createCallWindows(call, WindowTypes.incomingCall));
  inCalls.forEach((call) => createCallWindows(call, WindowTypes.inCall));

  log.debug("Show or hide in-call windows");
  if (state.selectedContact === null) {
    log.warn("No contact selected, showing all in-call windows");
  }
  allWindows().forEach((window) => showOrHideWindow(window, state));
}

export function setState(paneControlState: Partial<PaneControlState>): void {
  state = { ...state, ...paneControlState };
  recalculateCallWindows();
}
