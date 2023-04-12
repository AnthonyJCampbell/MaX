// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the history contact details section
 * The history header, type of call, type of phone number, followed by call duration (spaced out 25px from the
 * longest type of call field (Outgoing call (Mobile)), and datetime of call, spaced out 25px from the
 * longest call duration field
 */

import React from "react";
import { useSelector } from "react-redux";
import i18n from "i18next";
import { selectHistoricCallsWithContact } from "store/selectors/historic-calls";

import {
  prettyContactDetailType,
  prettyCallDuration,
  a11yCallDuration,
} from "components/utils/common";
import { convertToRelativeTime } from "components/utils/date-time";
import { prettyContactDetailSectionHeader, ContactDetailsSection } from "../shared";

import * as S from "./styles";

import IncomingCall from "assets/shared/history-incoming-call.svg";
import MissedCall from "assets/shared/history-missed-call.svg";
import OutgoingCall from "assets/shared/history-outgoing-call.svg";
import { CallType } from "shared/types";

/* Individual historic call date and time JSX */
const details = (data, contactPhoneNumbers, isAContact) => {
  let imageSrc;
  let string;
  const remotePartyType = contactPhoneNumbers.find((num) => num.value === data.remoteParty).type;
  switch (data.type) {
    case CallType.IN:
      imageSrc = IncomingCall;
      string = i18n.t("incomingCall");
      break;
    case CallType.MISSED:
      imageSrc = MissedCall;
      string = i18n.t("missedCall");
      break;
    case CallType.OUT:
      imageSrc = OutgoingCall;
      string = i18n.t("outgoingCall");
      break;
    default:
      string = i18n.t("incomingCall");
      imageSrc = IncomingCall;
      break;
  }

  let visibleText = string;
  if (isAContact) visibleText += ` (${prettyContactDetailType(remotePartyType)})`;

  return (
    <S.Detail
      key={data.uid}
      aria-label={`${visibleText}, ${a11yCallDuration(data.duration)}, ${convertToRelativeTime(
        data.datetimeStarted,
        true
      )}`}
    >
      <S.HistoryLeft>
        <S.HistoryImage src={imageSrc} alt="" />
        <S.DetailValueGrey aria-hidden={true}>{visibleText}</S.DetailValueGrey>
      </S.HistoryLeft>
      <S.DetailType aria-hidden={true}>
        {i18n.t("durationSeconds", { duration: prettyCallDuration(data.duration) })}
      </S.DetailType>
      <S.HistoryDateTime>
        <time>{convertToRelativeTime(data.datetimeStarted, true)}</time>
      </S.HistoryDateTime>
    </S.Detail>
  );
};

/* Render method for call history */
const HistoryContactDetailSection = () => {
  const { selectedContact } = useSelector((state) => state.contactReducer);
  const historicCallsData = useSelector(selectHistoricCallsWithContact(selectedContact));
  if (historicCallsData.length === 0) return <></>;

  const isAContact = selectedContact.uid !== "";
  const prettySectionHeader = prettyContactDetailSectionHeader(ContactDetailsSection.HISTORY);

  return (
    <S.DetailSection>
      <S.SectionTitle>{prettySectionHeader}</S.SectionTitle>
      <S.SectionContents id={`detailSection-history`} numRows={historicCallsData.length}>
        {historicCallsData.map((data) => details(data, selectedContact.phone, isAContact))}
      </S.SectionContents>
    </S.DetailSection>
  );
};

export default HistoryContactDetailSection;
