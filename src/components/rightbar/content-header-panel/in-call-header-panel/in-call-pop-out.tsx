// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the InCallPopOut for rightbar/Pane C.
 * It contains the selected contact's name, call status, and buttons for call features and hang-up.
 */

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectOneActiveCallWithContact } from "store/selectors/active-calls";
import { deleteActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { selectContactViaNode, showMainWindow } from "action-creators/navigation/actions";

import TopButton from "components/rightbar/content-header-panel/top-button/button";
import MeetingButton from "components/rightbar/content-header-panel/in-call-header-panel/meeting-button";
import Draggable from "components/windows/draggable/draggable";
import HoldButton from "./hold-button";
import MuteButton from "./mute-button";
import InCallHeaderWrapper from "./in-call-header-wrapper";

import DockWindowButton from "assets/rightbar/button-dock-window.svg";
import HangUpButton from "assets/shared/button-hang-up.svg";

import log from "src/renderer-logging";
import { Contact } from "src/types";
import { StoreState } from "store/types";

const InCallPopOut: React.FC = () => {
  const { t } = useTranslation();
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const meetingEnabled = useSelector<StoreState, boolean>(
    (state) => state.settingsReducer.settings.meetings.enabled
  );

  // Locate the activeCall object that matches the selectedContact's phone number
  const activeCall = useSelector(selectOneActiveCallWithContact(selectedContact));

  if (!activeCall) {
    return null;
  }

  const dockExternalWindow = (): void => {
    log.userAction("Clicked to dock in call window");
    selectContactViaNode(selectedContact);
    showMainWindow();
  };

  const meetingButton = (): React.ReactElement | null => {
    if (!meetingEnabled) {
      return null;
    }

    return <MeetingButton activeCall={activeCall} />;
  };

  log.debug("Rendering InCallPopOut");
  return (
    <InCallHeaderWrapper>
      <Draggable enabled={false}>
        <MuteButton activeCall={activeCall} />
        {meetingButton()}
        <HoldButton activeCall={activeCall} />
        <TopButton
          imageSrc={HangUpButton}
          altName={t("hangUp")}
          clickAction={(): void => {
            deleteActiveCall(activeCall.uid);
          }}
          parent="call"
          id="hangUpButton"
        />
        <TopButton
          imageSrc={DockWindowButton}
          altName={t("dockWindow")}
          clickAction={dockExternalWindow}
          parent="call"
          id="dockWindowButton"
        />
      </Draggable>
    </InCallHeaderWrapper>
  );
};

export default InCallPopOut;
