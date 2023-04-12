// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the ContentHeaderPanel for rightbar/Pane C.
 * It contains either the default (not in a call) or the in-call header panel.
 */

import React from "react";
import { useSelector } from "react-redux";
import { selectOneActiveCallWithContact } from "store/selectors/active-calls";

import DefaultHeaderPanel from "components/rightbar/content-header-panel/default-header-panel/panel";
import InCallHeaderPanel from "components/rightbar/content-header-panel/in-call-header-panel/in-call-header-panel";

import { CallStatus } from "src/types";
const ContentHeaderPanel = () => {
  const { selectedContact } = useSelector((state) => state.contactReducer);

  // Find an activeCall with remoteParty matching the phone number of the selectedContact in
  // contactReducer
  const showInCallUI = useSelector(selectOneActiveCallWithContact(selectedContact));
  // If there is an active call that is not incoming, show the in-call UI
  const VisiblePanel =
    showInCallUI && showInCallUI.status !== CallStatus.INCOMING
      ? InCallHeaderPanel
      : DefaultHeaderPanel;

  return <VisiblePanel id="contentHeaderPanel" />;
};

export default ContentHeaderPanel;
