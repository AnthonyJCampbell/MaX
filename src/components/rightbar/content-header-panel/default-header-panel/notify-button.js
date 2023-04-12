// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the notify when available button in the for the left side of the header panel in
 * rightbar/Pane C.
 */

import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import NotifyOn from "assets/rightbar/menu-button-notify-on.svg";
import NotifyOff from "assets/rightbar/menu-button-notify.svg";
import TopButton from "../top-button/button";

import { PresenceState } from "src/types";
import log from "src/renderer-logging";

import { updateContactNWA } from "action-creators/ipc-outgoing/contacts-actions";

const NotifyWhenAvailableButton = ({ contact }) => {
  const { t } = useTranslation();

  const hide = !contact.presence;
  const disabled = contact.presence?.state === PresenceState.ONLINE;

  const toggleNotifyWhenAvailable = () => {
    if (!hide && !disabled) {
      const newValue = !contact.notifyWhenAvailable;
      log.userAction(
        `Clicked header panel button to turn ${newValue ? "on" : "off"} notifyWhenAvailable`
      );
      updateContactNWA(contact.uid, newValue);
    }
  };

  const tooltipText = contact.notifyWhenAvailable
    ? t("stopWatchingAvailability")
    : t("notifyWhenAvailable");

  const screenReaderText = `${t("notifyWhenAvailable")}, ${
    contact.notifyWhenAvailable ? t("checked") : t("unchecked")
  }`;

  if (hide) {
    return <></>;
  } else {
    return (
      <TopButton
        id="notifyWhenAvailableButton"
        imageSrc={contact.notifyWhenAvailable ? NotifyOn : NotifyOff}
        altName={screenReaderText}
        tooltipText={tooltipText}
        parent="default"
        clickAction={toggleNotifyWhenAvailable}
        disabled={disabled}
      />
    );
  }
};

NotifyWhenAvailableButton.propTypes = {
  contact: PropTypes.object,
};

export default NotifyWhenAvailableButton;
