// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the buttons to manage meetings
 */
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import * as S from "./styles";

import LowerMeetingButton from "./lower-meeting-button/lower-button";
import UpperMeetingButton from "./upper-meeting-button/upper-button";
import CreateMeetingIcon from "assets/midbar/create-meeting-icon.png";
import ScheduleMeetingIcon from "assets/midbar/schedule-meeting-icon.png";
import {
  scheduleMeeting,
  joinMeeting,
  viewScheduledMeetings,
  viewRecordedMeetings,
  createMeetingWithOptions,
} from "action-creators/ipc-outgoing/meetings-actions";

import log from "src/renderer-logging";

/**
 * Collection of buttons used to manage meetings.
 *
 * Contains two large buttons (create and schedule)
 * and three small buttons (join a meeting, view upcoming meetings and view recorded meetings)
 */
const MeetingManagement = () => {
  const inAMeeting = useSelector((state) => state.meetingReducer.meetings.length) !== 0;
  const dialPadVisible = useSelector(
    (state) => state.paneManagementReducer.isMidPaneDialPadVisible
  );
  const { t } = useTranslation();

  const clickHandler = (action, logText) => {
    log.userAction(`Clicked ${logText} Button`);
    action();
  };

  return (
    <S.PanelContainer id="meetingManagement" dialPadVisible={dialPadVisible}>
      <S.LargeMeetingButtonContainer>
        <UpperMeetingButton
          image={CreateMeetingIcon}
          ariaLabel={inAMeeting ? t("inviteOthers") : t("createAMeeting")}
          text={inAMeeting ? t("invite") : t("create")}
          clickAction={() =>
            // eslint-disable-next-line i18next/no-literal-string
            clickHandler(createMeetingWithOptions, inAMeeting ? "invite" : "create")
          }
        />
        <UpperMeetingButton
          image={ScheduleMeetingIcon}
          ariaLabel={t("scheduleAMeeting")}
          text={t("schedule")}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(scheduleMeeting, "schedule")}
        />
      </S.LargeMeetingButtonContainer>
      <S.SmallMeetingButtonContainer>
        <LowerMeetingButton
          text={t("joinAMeeting")}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(joinMeeting, "joinAMeeting")}
        />
        <LowerMeetingButton
          text={t("viewUpcomingMeetings")}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(viewScheduledMeetings, "viewUpcomingMeetings")}
        />
        <LowerMeetingButton
          text={t("viewRecordedMeetings")}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(viewRecordedMeetings, "viewRecordedMeetings")}
        />
      </S.SmallMeetingButtonContainer>
      <S.Message>{t("ifYouReceivedAnInvitationLinkClickOnTheLink")}</S.Message>
    </S.PanelContainer>
  );
};

MeetingManagement.propTypes = {};

export default MeetingManagement;
