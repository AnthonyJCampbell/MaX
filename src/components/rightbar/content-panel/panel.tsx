// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the ContentPanel, containing buttons to switch the active view and the selected sub-pane
 * Currently, ChatPane and ContactPane are supported
 */

import React from "react";
import { useSelector } from "react-redux";

import ContactPane from "./contact-pane/pane";
import ChatPane from "./chat-pane/chat-pane";

import log from "src/renderer-logging";
import { selectTabsEnabled } from "store/selectors/paneManagement";

import { StoreState } from "store/types";
import { TabName } from "../rightbar";

const ContentPanel: React.FC = () => {
  const tabsEnabled = useSelector(selectTabsEnabled);
  const activeRightPane = useSelector<StoreState, string>(
    (state) => state.paneManagementReducer.activeRightPane
  );

  log.debug(`[ContentPanel] activeRightPane: ${activeRightPane}`);

  /**
   * Render the content, depending on the value of activeTab
   */
  switch (activeRightPane) {
    case TabName.CHAT:
      if (tabsEnabled) {
        return <ChatPane />;
      } else {
        return <ContactPane />;
      }
    case TabName.CONTACT_DETAILS:
      return <ContactPane />;
    default:
      return null;
  }
};

export default ContentPanel;
