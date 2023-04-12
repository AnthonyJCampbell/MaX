// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Listens to changes to activeCalls and selected contact
 * Dispatches actions to send these state updates to pane-control
 */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { updatePaneControlState } from "action-creators/navigation/actions";

import log from "src/renderer-logging";

/**
 * Component that listens to redux state changes, and passes them to pane-control if relevant
 */
const PaneControlStateHandler = () => {
  const { activeCalls } = useSelector((state) => state.activeCallsReducer);
  const { selectedContact } = useSelector((state) => state.contactReducer);

  useEffect(() => {
    log.debug("Updating pane control state");
    updatePaneControlState({
      activeCalls,
      selectedContact,
    });
  }, [activeCalls, selectedContact]);

  return <></>;
};

export default PaneControlStateHandler;
