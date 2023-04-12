// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the Call button in the for the header panel in rightbar/Pane C.
 * The button can either make a call directly or open a menu with a selection of numbers to call,
 * depending on how many numbers are available.
 */

import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { createActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";

import CallIcon from "assets/rightbar/button-call.svg";
import CallMultiIcon from "assets/rightbar/button-call-multiple.svg";
import TopButton from "components/rightbar/content-header-panel/top-button/button";
import TopMenuButton from "components/rightbar/content-header-panel/top-button/menu-button";
import CallMenu from "./call-menu";

import log from "src/renderer-logging";

const CallButton = ({ phoneNumbers }) => {
  const { disabledCallButton } = useSelector((state) => state.paneManagementReducer);
  const { t } = useTranslation();

  const numberToCall = phoneNumbers?.[0]?.value;
  const multiNumbers = phoneNumbers != null && phoneNumbers.length > 1;

  const makeCall = () => {
    log.userAction(`Clicked top button to call ${numberToCall}`);
    createActiveCall(numberToCall);
  };

  // Check if the current contact has a valid number or if the call button
  // has been disabled for this specific contact
  const callButtonDisabled =
    !numberToCall || phoneNumbers.some((num) => num.value === disabledCallButton);

  return multiNumbers ? (
    <TopMenuButton
      imageSrc={CallMultiIcon}
      altName={t("call")}
      menu={<CallMenu phoneNumbers={phoneNumbers} />}
      label={t("callMultiLabel", { count: phoneNumbers.length })}
      parent="default"
      id="callButton"
      disabled={callButtonDisabled}
    />
  ) : (
    <TopButton
      imageSrc={CallIcon}
      altName={t("call")}
      clickAction={!numberToCall ? null : makeCall}
      parent="default"
      id="callButton"
      disabled={callButtonDisabled}
    />
  );
};

CallButton.propTypes = {
  phoneNumbers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CallButton;
