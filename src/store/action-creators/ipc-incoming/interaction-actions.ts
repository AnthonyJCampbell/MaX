// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import store from "store/store";
import { setCallButtonDisabled } from "action-creators/navigation/actions";
import { selectActiveCallFromUid } from "store/selectors/active-calls";

import { ActiveCall } from "src/types";
import log from "src/renderer-logging";

/**
 * Disable the Call Button for 1 second for the contact of the dropped call
 * @param {ActiveCall} call - The deleted call data passed in from IPC
 */
export const temporarilyDisableCallButton = (call: ActiveCall): void => {
  const activeCall = selectActiveCallFromUid(call.uid)(store.getState());

  if (!activeCall) return;
  log.debug(`Disabling the call button for ${activeCall.remoteParty}`);
  store.dispatch(setCallButtonDisabled(activeCall.remoteParty));

  setTimeout(() => {
    store.dispatch(setCallButtonDisabled(""));
  }, 1000);
};
