// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import Tooltip from "components/tooltip/tip";
import Tippy from "@tippyjs/react";

import * as S from "../styles";
import log from "src/renderer-logging";

import { showBugReport } from "action-creators/navigation/actions";
import { viewVoicemails } from "action-creators/ipc-outgoing/voicemails-actions";

import FeedbackButton from "assets/sidebar/button-feedback.svg";
import BugButton from "assets/sidebar/button-bug.svg";
import VoicemailButton from "assets/sidebar/button-voicemail.svg";

const BottomButtons = ({ voicemailFaxCount }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onVoicemailButtonClick = () => {
    log.userAction("Clicked voicemail button");
    viewVoicemails();
  };

  const onFeedbackButtonClick = () => {
    log.userAction("Clicked send feedback button");
    window.open(
      "https://forms.office.com/Pages/ResponsePage.aspx?id=61aenRP2202ye7_N8Uss27WAwjLbn0pNu25EM5EN1FFUNjBZVE9XQUM3MlNMVFFXSjE3T081UkdXMS4u"
    );
  };

  const getVoicemailLabel = () => {
    return t("voicemailLabel_interval", { postProcess: "interval", count: voicemailFaxCount });
  };

  return (
    <S.ButtonContainer>
      <Tippy content={<Tooltip text={t("voicemail")} />} delay={[600, 0]} placement="right">
        <button
          id="voicemailButton"
          aria-label={getVoicemailLabel()}
          onClick={onVoicemailButtonClick}
        >
          <img src={VoicemailButton} alt="" />
          {voicemailFaxCount !== 0 && (
            <S.Notification aria-hidden={true}>
              {voicemailFaxCount > 9 ? "9+" : voicemailFaxCount}
            </S.Notification>
          )}
        </button>
      </Tippy>
      <Tippy content={<Tooltip text={t("reportBug")} />} delay={[600, 0]} placement="right">
        <button
          id="bugButton"
          aria-label={t("reportBug")}
          onClick={() => dispatch(showBugReport())}
        >
          <img src={BugButton} alt="" />
        </button>
      </Tippy>
      <Tippy content={<Tooltip text={t("sendFeedback")} />} delay={[600, 0]} placement="right">
        <button id="feedbackButton" aria-label={t("sendFeedback")} onClick={onFeedbackButtonClick}>
          <img src={FeedbackButton} alt="" />
        </button>
      </Tippy>
    </S.ButtonContainer>
  );
};

BottomButtons.propTypes = {
  voicemailFaxCount: PropTypes.number.isRequired,
};

export default BottomButtons;
