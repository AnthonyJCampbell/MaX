// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import TopButton from "components/rightbar/content-header-panel/top-button/button";
import MuteImage from "assets/rightbar/button-audio.svg";
import MutedImage from "assets/rightbar/button-muted.svg";

import log from "src/renderer-logging";
import { updateCallMicrophoneMute } from "action-creators/ipc-outgoing/active-calls-actions";
import { ActiveCall } from "shared/types";

interface MuteButtonProps {
  activeCall: ActiveCall;
  disabled?: boolean;
}

/**
 * A TopButton that toggles mute state for microphone.
 * @param {ActiveCall} activeCall The ActiveCall this button affects
 */
const MuteButton: React.FC<MuteButtonProps> = ({ activeCall, disabled = false }) => {
  const { t } = useTranslation();
  const isMuted = activeCall?.microphoneIsMuted;

  const toggleMute = (): void => {
    const newValue = !isMuted;
    log.userAction(`Clicked to update microphone mute to: ${newValue}`);
    updateCallMicrophoneMute(activeCall, newValue);
  };

  const altName = `${t("muteToggle")}, ${isMuted ? t("on") : t("off")}`;
  const tooltipText = isMuted ? t("unmute") : t("mute");

  return (
    <TopButton
      imageSrc={isMuted ? MutedImage : MuteImage}
      altName={altName}
      tooltipText={tooltipText}
      parent="call"
      id="muteButton"
      clickAction={toggleMute}
      disabled={disabled === true}
    />
  );
};

export default MuteButton;
