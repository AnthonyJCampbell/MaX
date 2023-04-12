// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import { updateActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";

import TopButton from "components/rightbar/content-header-panel/top-button/button";
import HoldImage from "assets/rightbar/button-hold.svg";
import OnHoldImage from "assets/rightbar/button-onhold.svg";

import log from "src/renderer-logging";
import { CallStatus, ActiveCall } from "src/shared/types";

interface HoldButtonProps {
  activeCall: ActiveCall;
  disabled?: boolean;
}

/**
 * A TopButton that toggles hold state for a call.
 * @param {ActiveCall} activeCall the ActiveCall whose state this button affects.
 */
const HoldButton: React.FC<HoldButtonProps> = ({ activeCall, disabled = false }) => {
  const { t } = useTranslation();
  const onHold = activeCall?.status === CallStatus.HOLD;

  // This button should only ever be enabled if the call has connected.
  const isDisabled =
    disabled === true ||
    !(activeCall?.status === CallStatus.HOLD || activeCall?.status === CallStatus.CURRENT);

  const putOnHold = (): void => {
    log.userAction("Clicked to put call on hold");
    updateActiveCall(activeCall.uid, CallStatus.HOLD);
  };

  const takeOffHold = (): void => {
    log.userAction("Clicked to take call off hold");
    updateActiveCall(activeCall.uid, CallStatus.CURRENT);
  };

  const altName = `${t("holdToggle")}, ${onHold ? t("on") : t("off")}`;
  const tooltipText = onHold ? t("takeOffHold") : t("putOnHold");

  return (
    <TopButton
      imageSrc={onHold ? OnHoldImage : HoldImage}
      altName={altName}
      tooltipText={tooltipText}
      parent="call"
      id="holdButton"
      clickAction={onHold ? takeOffHold : putOnHold}
      disabled={isDisabled}
    />
  );
};

export default HoldButton;
