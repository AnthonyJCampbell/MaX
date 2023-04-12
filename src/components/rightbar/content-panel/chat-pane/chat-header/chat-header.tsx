// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a ChatHeader, a header specifying the date of messages in the ChatPane
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { RequireExactlyOne } from "type-fest";
import log from "src/renderer-logging";

import * as S from "./styles";
import { convertToRelativeDate } from "components/utils/date-time";
import { MessageType } from "src/types";
import { UnreachableError } from "shared/errors";

export type Props = RequireExactlyOne<{
  date: string;
  isNew: true;
  message: {
    messageType: MessageType;
    messageUid: string;
  };
}>;

/**
 * Returns a header separating chat messages by day.
 */
export const ChatHeader: React.FC<Props> = ({ date, isNew, message }) => {
  const { t } = useTranslation();
  const displayChatDateTimeStamp = (): string => {
    if (message?.messageType !== undefined) {
      switch (message.messageType) {
        case MessageType.IM:
          return t("switchedToIM");
        case MessageType.SMS:
          return t("switchedToSMS");
        case MessageType.UNRECOGNIZED:
          log.warn(`Invalid chat message type: ${message.messageType}`);
          return "";
        default:
          throw new UnreachableError(message.messageType);
      }
    } else if (isNew) {
      return t("new");
    } else if (date) return convertToRelativeDate(date);
    else return "";
  };

  const getChatHeaderID = (): string => {
    if (message?.messageType !== undefined) {
      switch (message.messageType) {
        case MessageType.IM:
          return `chatHeader-switchedToIM-${message.messageUid}`;
        case MessageType.SMS:
          return `chatHeader-switchedToSMS-${message.messageUid}`;
        case MessageType.UNRECOGNIZED:
          return `chatHeader-unrecognized-${message.messageUid}`;
        default:
          throw new UnreachableError(message.messageType);
      }
    } else if (isNew) {
      // eslint-disable-next-line i18next/no-literal-string
      return "chatHeader-new";
    } else if (date) {
      return `chatHeader-date-${date}`;
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      return "chatHeader-unknown";
    }
  };

  return (
    <S.ChatHeader id={getChatHeaderID()} isSwitched={message?.messageType !== undefined}>
      <S.ChatHeaderText isNew={isNew !== undefined}>
        - {displayChatDateTimeStamp()} -
      </S.ChatHeaderText>
    </S.ChatHeader>
  );
};
export default ChatHeader;
