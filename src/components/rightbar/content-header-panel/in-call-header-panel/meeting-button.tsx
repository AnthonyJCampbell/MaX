// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import MeetingButtonIcon from "assets/rightbar/button-meeting-incall.svg";
import AddToMeetingButton from "assets/rightbar/button-meeting-add-incall.svg";
import TopButton from "components/rightbar/content-header-panel/top-button/button";

import { createMeeting, updateMeeting } from "action-creators/ipc-outgoing/meetings-actions";

import log from "src/renderer-logging";
import { ActiveCall, Contact, Meeting } from "src/shared/types";
import { StoreState } from "store/types";

interface MeetingButtonProps {
  activeCall: ActiveCall;
  disabled?: boolean;
}

/**
 * A TopButton that uplifts to meeting.
 * @param {ActiveCall} activeCall The ActiveCall this button affects
 */
const MeetingButton: React.FC<MeetingButtonProps> = ({ activeCall, disabled = false }) => {
  const [uplifting, setUplifting] = useState(false);

  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const meetings = useSelector<StoreState, Meeting[]>((state) => state.meetingReducer.meetings);
  const { t } = useTranslation();

  // Disable button if already attempting to start meeting or there is no IM address
  const imAddress = selectedContact.im?.value;

  const inAMeeting = imAddress !== undefined && meetings.length !== 0;

  const upliftToMeeting = (): void => {
    log.userAction("Clicked to uplift call to meeting");

    setUplifting(true);
    setTimeout(() => {
      setUplifting(false);
    }, 5000);

    if (selectedContact.im) {
      const meetingAction = inAMeeting ? updateMeeting : createMeeting;
      meetingAction([{ value: selectedContact.im.value }], activeCall.uid);
    }
  };

  const isDisabled = disabled || !imAddress || uplifting;

  return (
    <TopButton
      imageSrc={inAMeeting ? AddToMeetingButton : MeetingButtonIcon}
      altName={inAMeeting ? t("inviteToMeeting") : t("startMeeting")}
      clickAction={(): void => upliftToMeeting()}
      parent="call"
      id="inCallMeetingButton"
      disabled={isDisabled}
    />
  );
};

export default MeetingButton;
