// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the InCallHeaderWrapper for rightbar/Pane C.
 * It contains the selected contact's name, call status, and buttons for call features and hang-up.
 */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectOneActiveCallWithContact } from "store/selectors/active-calls";

import Avatar from "components/avatar/avatar";
import { fullname, prettyCallStatus, prettyCallDuration } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import * as Shared from "../shared-styles";

import log from "src/renderer-logging";
import { CallStatus, Contact } from "src/types";
import { StoreState } from "store/types";
import { CountryCode } from "libphonenumber-js";

export interface InCallHeaderWrapperProps {
  id?: string;
  isDisabled?: boolean;
}

/**
 * A common wrapper for our in call header scenario, which are presented
 * at main window (in call header panel) and at secondary window (in call
 * header pop out).
 *
 * The goal is to minify duplication code, making usage of React compositon:
 * https://reactjs.org/docs/composition-vs-inheritance.html
 *
 * Contains contact info and buttons for IM, calls, meetings, and options.
 *
 * Provide the in-call-header buttons as `children` for this component.
 */
const InCallHeaderWrapper: React.FC<InCallHeaderWrapperProps> = ({ id, isDisabled, children }) => {
  const { t } = useTranslation();
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );

  const easRegion = useSelector<StoreState, CountryCode>(
    (state) => state.settingsReducer.settings.general?.easRegion
  );

  // Locate the activeCall object that matches the selectedContact's phone number
  const activeCall = useSelector(selectOneActiveCallWithContact(selectedContact));

  const [tick, setTick] = useState(0);

  const showTimer =
    activeCall?.status === CallStatus.CURRENT || activeCall?.status === CallStatus.HOLD;

  useEffect(() => {
    const timer = setInterval(() => {
      if (showTimer) {
        setTick(tick + 1);
      }
    }, 1000);
    return (): void => clearInterval(timer);
  });

  if (!activeCall) {
    return null;
  }

  // Calculate the time based on the difference between the current time and the timestamp
  // provided by activeCall. If datetimeStarted is undefined, initalize as 0.
  const timeElapsedInSec = activeCall.datetimeStarted
    ? Math.floor((Date.now() - Date.parse(activeCall.datetimeStarted)) / 1000)
    : 0;

  /**
   * The text to be displayed representing the remote party's identity.
   *
   * Name if it exists, then phone number if it exists. Failing both, "No name"
   */
  const displayName = (): string => {
    const fullName = fullname(selectedContact);
    const firstPhoneNumber = selectedContact.phone[0];

    // TODO DUIR-3351: This logic shouldn't depend on a translated string
    if (fullName === t("noName") && firstPhoneNumber) {
      return formatPhoneNumber(firstPhoneNumber.value, easRegion);
    } else {
      return fullName;
    }
  };

  log.debug("Rendering InCallHeaderWrapper");
  return (
    <Shared.ContentHeaderPanel id={id} panel="call">
      {isDisabled && <Shared.ContentHeaderPanelDisableOverlay />}
      {/* Container for positioning purposes, contains contact info and avatar*/}
      <Shared.LeftSide id="contentHeaderPanelContact">
        <Avatar contact={selectedContact} />
        <Shared.BasicInfo>
          <Shared.NameContainer>
            <h1>{displayName()}</h1>
          </Shared.NameContainer>
          <Shared.LowerDetail>
            {showTimer ? prettyCallDuration(timeElapsedInSec) : prettyCallStatus(activeCall.status)}
          </Shared.LowerDetail>
        </Shared.BasicInfo>
      </Shared.LeftSide>

      {/* Button container */}
      <Shared.ButtonContainer>{children}</Shared.ButtonContainer>
    </Shared.ContentHeaderPanel>
  );
};

export default InCallHeaderWrapper;
