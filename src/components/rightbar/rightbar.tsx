// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the right-hand pane (Pane C), which contains the content-header-panel (with the info of the selected contact) and content-panel (containing contact info or the ongoing chat)
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import ContentHeaderPanel from "./content-header-panel/panel";
import ContentPanel from "./content-panel/panel";

import * as S from "./styles";

import log from "src/renderer-logging";

import { fullname, prettyPresenceWithStatus, isAriaHiddenByModal } from "components/utils/common";

import { noSelectedContactUid } from "shared/constants";
import { selectTabsEnabled } from "store/selectors/paneManagement";
import { StoreState } from "store/types";
import { Contact, ModalPopupTypes } from "src/types";
import Tabs, { Tab } from "components/ui/Tabs";
import { sendAnalytic } from "store/action-creators/ipc-outgoing/analytics-actions";
import { setActiveRightPane, setForceMessageRemoteParty } from "action-creators/navigation/actions";

export enum TabName {
  CHAT = "chat",
  CONTACT_DETAILS = "contactDetails",
}

/**
 * Render the right-hand pane - consisting of content header pane and content pane.
 * Depends on the activeRightPane.
 */
const Rightbar: React.FC = () => {
  log.debug("Rendering Rightbar");

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const showModalPopup = useSelector<StoreState, ModalPopupTypes>(
    (state) => state.paneManagementReducer.showModalPopup
  );
  const activeRightPane = useSelector<StoreState, string>(
    (state) => state.paneManagementReducer.activeRightPane
  );
  const tabsEnabled = useSelector(selectTabsEnabled);

  const chatTab: Tab = {
    type: TabName.CHAT,
    label: t("conversation"),
  };

  const contactDetailsTab: Tab = {
    type: TabName.CONTACT_DETAILS,
    label: t("contactDetails"),
  };

  // Use the selected contact as the label for the main section.
  const mainlabel = (): string => {
    if (selectedContact.uid === noSelectedContactUid) {
      return t("selectAContact");
    }

    if (selectedContact.presence) {
      return fullname(selectedContact) + ", " + prettyPresenceWithStatus(selectedContact);
    } else {
      return fullname(selectedContact);
    }
  };

  // Checks if activeTab needs to be changed and then changes it. (Done to prevent unnecessary re-renders)
  const tabHandler = (tab: string): void => {
    log.userAction(`Clicked ${tab} (current ${activeRightPane})`);

    if (tab === TabName.CONTACT_DETAILS) {
      sendAnalytic("VIEW_CONTACT_DETAILS");
      dispatch(setForceMessageRemoteParty(""));
    }

    dispatch(setActiveRightPane(tab));
  };

  const tabs = tabsEnabled ? [chatTab, contactDetailsTab] : [];

  return (
    <S.RightBar
      id="rightbar"
      aria-label={mainlabel()}
      aria-hidden={isAriaHiddenByModal(showModalPopup)}
    >
      <ContentHeaderPanel />
      <Tabs id="rightbarTabs" active={activeRightPane} tabs={tabs} onClick={tabHandler} />
      <ContentPanel />
    </S.RightBar>
  );
};

export default Rightbar;
