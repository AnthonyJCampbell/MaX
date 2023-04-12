// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a single call history block.
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setSelectedContact, focusRightbarMessage } from "action-creators/navigation/actions";
import { updateHistoricCall } from "action-creators/ipc-outgoing/call-history-actions";
import { selectOneContactWithPhoneNumber } from "store/selectors/contacts";
import { CountryCode } from "libphonenumber-js";

import Avatar from "components/avatar/avatar";
import Icon from "components/ui/Icon/Icon";
import { fullname, prettyContactDetailType, prettyPresence } from "components/utils/common";
import { convertToRelativeTime } from "components/utils/date-time";
import * as S from "./styles";
import * as Shared from "components/midbar/shared-styles";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import NotifyIcon from "assets/midbar/list-notify-on.svg";
import IncomingCall from "assets/shared/history-incoming-call.svg";
import MissedCall from "assets/shared/history-missed-call.svg";
import OutgoingCall from "assets/shared/history-outgoing-call.svg";
import { IconName } from "assets/icons/iconsLib";

import log from "src/renderer-logging";

import { CallType, Contact, HistoricCall } from "src/types";
import { StoreState } from "store/types";
import { IconVariant } from "components/ui/Icon/types";

interface CallBlockProps {
  call: HistoricCall;
}

/**
 * Render a single block in the call history list
 * @param {Object} call - Call history data item
 */
const CallBlock: React.FC<CallBlockProps> = ({ call }) => {
  const dispatch = useDispatch();
  const contact = useSelector(selectOneContactWithPhoneNumber(call.remoteParty));
  const easRegion = useSelector<StoreState, CountryCode>(
    (state) => state.settingsReducer.settings.general.easRegion
  );
  const { t } = useTranslation();

  const [rerender, setRerender] = useState(false);

  // A new call is listed as having been started "Just now", but should be updated to a timestamp after 60 seconds.
  // Every 10 seconds, the interval checks if 60 seconds have elapsed, in which case it updates the datetime stamp
  // If so, we call setRerender() order to manually rerender and display the timestamp.
  useEffect(() => {
    /**
     * While running this as react code (`npm start`) this returns NodeJS.Timeout type
     * But when you run this as JEST, it returns as `number`.
     * Using `ReturnType<typeof setTimeout>` make this work on both JS context.
     */
    let intervalId: ReturnType<typeof setTimeout>;

    if (convertToRelativeTime(call.datetimeStarted) === t("justNow")) {
      intervalId = setInterval(() => {
        setRerender(!rerender);
      }, 10000);
    }

    return (): void => clearInterval(intervalId);
  });

  const clickHandler = (contact?: Contact | null): void => {
    if (call.attention) updateHistoricCall(call.uid, false);

    // If number doesn't match a known contact, create a temporary one
    if (!contact) {
      log.userAction(`Clicked historic call from non-contact ${call.remoteParty}`);
      const unknownRemotePartyContact = Contact.fromPhoneNumber(call.remoteParty);
      dispatch(setSelectedContact(unknownRemotePartyContact));
      return;
    }

    log.userAction(`Clicked historic call from ${fullname(contact)} (UID: ${contact.uid})`);
    dispatch(setSelectedContact(contact));
    dispatch(focusRightbarMessage());
  };

  // Use slightly different formatting for visual and audio display
  const phoneNumberMatch = contact?.phone?.filter((number) => {
    return number.value === call.remoteParty;
  })[0];
  const phoneNumberType = phoneNumberMatch ? prettyContactDetailType(phoneNumberMatch.type) : "";
  const phoneNumberFormatted = formatPhoneNumber(call.remoteParty, easRegion);

  // Prepare the accessible text
  const callType =
    call.type === CallType.OUT
      ? t("outgoingCall")
      : call.type === CallType.IN
      ? t("incomingCall")
      : t("missedCall");

  let namePresence = phoneNumberFormatted;
  if (contact) {
    namePresence = fullname(contact);
    if (contact.presence) {
      namePresence += `, ${prettyPresence(contact.presence.state)}`;
    }
  }
  // Build the accessible text starting with the attention state
  let accessibleText = call.attention ? t("newComma") : "";
  accessibleText += t("xCallFromNamePresenceAtTime", {
    type: callType,
    nameAndPresence: namePresence,
    time: convertToRelativeTime(call.datetimeStarted),
  });
  // Add the phone number and type
  if (contact) {
    accessibleText += `, ${phoneNumberFormatted}, ${phoneNumberType}`;
  }

  if (contact?.isFavourite) {
    accessibleText += `, ${t("favouritesContact")}, `;
  }
  // Add whether we're watching the availability of this contact
  if (contact?.notifyWhenAvailable) {
    accessibleText += `, ${t("watchingAvailability")}`;
  }
  let callerID: string;
  let phoneToDisplay = phoneNumberFormatted;

  if (contact) {
    callerID = fullname(contact);
  } else {
    callerID = call.displayName;
  }
  if (callerID === "") {
    if (phoneNumberFormatted) {
      callerID = phoneNumberFormatted;
    } else {
      callerID = t("anonymous");
      phoneToDisplay = t("anonymous");
    }
  }
  if (phoneToDisplay == "anonymous" || phoneToDisplay == "") {
    phoneToDisplay = t("anonymous");
  }

  return (
    <Shared.ItemBlock
      onClick={(): void => clickHandler(contact)}
      id={`callBlock-${call.uid}`}
      aria-label={accessibleText}
      tabIndex={-1}
    >
      <Avatar contact={contact} />

      <Shared.InfoContainer>
        <Shared.TopLine>
          <Shared.NameContainer>
            {/* Show the attention dot if the call wants the user's attention*/}
            {call.attention && <Shared.AttentionDot />}
            <Shared.Name bold={call.attention}>{callerID}</Shared.Name>
            {contact?.isFavourite && (
              <Icon
                icon={IconName.star}
                size={12}
                variant={IconVariant.dark}
                style={{ marginLeft: "4px" }}
              />
            )}
            {contact?.notifyWhenAvailable ? <img src={NotifyIcon} alt="" /> : <></>}
          </Shared.NameContainer>
          <Shared.Time dateTime={call.datetimeStarted}>
            {convertToRelativeTime(call.datetimeStarted)}
          </Shared.Time>
        </Shared.TopLine>
        <S.HistoryDetails>
          {call.type === CallType.OUT ? (
            <img src={OutgoingCall} alt="" />
          ) : call.type === CallType.IN ? (
            <img src={IncomingCall} alt="" />
          ) : (
            <img src={MissedCall} alt="" />
          )}
          <Shared.BottomLine>{`${phoneToDisplay}${
            phoneNumberType ? ` (${phoneNumberType})` : ``
          }`}</Shared.BottomLine>
        </S.HistoryDetails>
      </Shared.InfoContainer>
    </Shared.ItemBlock>
  );
};

export default CallBlock;
