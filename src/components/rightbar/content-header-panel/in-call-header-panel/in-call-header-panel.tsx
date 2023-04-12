// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the InCallHeaderPanel for rightbar/Pane C.
 * It contains the selected contact's name, call status, and buttons for call features and hang-up.
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectOneActiveCallWithContact } from "store/selectors/active-calls";
import { deleteActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { showUnimplemented } from "action-creators/navigation/actions";

import TopButton from "components/rightbar/content-header-panel/top-button/button";
import TopMenuButton from "components/rightbar/content-header-panel/top-button/menu-button";
import MeetingButton from "components/rightbar/content-header-panel/in-call-header-panel/meeting-button";
import AddTransferMenu from "./add-transfer-menu";
import MoreMenu from "../more-menu/more-menu";
import HoldButton from "./hold-button";
import MuteButton from "./mute-button";
import InCallHeaderWrapper from "./in-call-header-wrapper";

import AddTransferButton from "assets/rightbar/button-add-transfer.svg";
import RecordButton from "assets/rightbar/button-record.svg";
import HangUpButton from "assets/shared/button-hang-up.svg";
import MoreButton from "assets/rightbar/button-more-incall.svg";

import log from "src/renderer-logging";
import { Contact } from "src/types";
import { StoreState } from "store/types";

export interface InCallHeaderPanelProps {
  id?: string;
}
const InCallHeaderPanel: React.FC<InCallHeaderPanelProps> = ({ id }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const meetingEnabled = useSelector<StoreState, boolean>(
    (state) => state.settingsReducer.settings.meetings.enabled
  );
  const isMainWindowFocused = useSelector<StoreState, boolean>(
    (state) => state.paneManagementReducer.isMainWindowFocused
  );

  // Locate the activeCall object that matches the selectedContact's phone number
  const activeCall = useSelector(selectOneActiveCallWithContact(selectedContact));

  if (!activeCall) {
    return null;
  }

  const isInCallHeaderDisabled = !isMainWindowFocused;

  const meetingButton = (): React.ReactElement | null => {
    if (!meetingEnabled) {
      return null;
    }

    return <MeetingButton activeCall={activeCall} disabled={isInCallHeaderDisabled} />;
  };

  log.debug("Rendering InCallHeaderPanel");
  return (
    <InCallHeaderWrapper id={id} isDisabled={isInCallHeaderDisabled}>
      <TopMenuButton
        imageSrc={AddTransferButton}
        altName={t("addOrTransfer")}
        menu={<AddTransferMenu />}
        parent="call"
        id="addTransferButton"
        disabled={isInCallHeaderDisabled}
      />
      <MuteButton activeCall={activeCall} disabled={isInCallHeaderDisabled} />
      {meetingButton()}
      <TopButton
        imageSrc={RecordButton}
        altName={t("record")}
        parent="call"
        id="recordButton"
        clickAction={(): void => {
          dispatch(showUnimplemented("Record button"));
        }}
        disabled={isInCallHeaderDisabled}
      />
      <HoldButton activeCall={activeCall} disabled={isInCallHeaderDisabled} />
      <TopButton
        imageSrc={HangUpButton}
        altName={t("hangUp")}
        clickAction={(): void => {
          deleteActiveCall(activeCall.uid);
        }}
        parent="call"
        id="hangUpButton"
        focusOnRender={true}
        disabled={isInCallHeaderDisabled}
      />
      <TopMenuButton
        imageSrc={MoreButton}
        altName={t("moreCallActions")}
        parent="call"
        id="inCallMoreButton"
        menu={<MoreMenu contact={selectedContact} inCall={true} />}
        disabled={isInCallHeaderDisabled}
      />
    </InCallHeaderWrapper>
  );
};

export default InCallHeaderPanel;
