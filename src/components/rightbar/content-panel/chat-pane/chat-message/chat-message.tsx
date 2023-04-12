// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a ChatMessage, a single chat message in the ChatPane
 */

import React from "react";
import { useTranslation } from "react-i18next";
import Linkify from "linkifyjs/react";

import { MessageType, Contact, ChatMessage as ChatMessageInterface } from "src/types";

import Avatar from "components/avatar/avatar";
import * as S from "./styles";
import { formatDateTime } from "components/utils/date-time";

export interface Props {
  message: ChatMessageInterface;
  contact: Contact;
  displayAvatar: boolean;
}

/**
 * Returns a single chat message, containing the text, timestamp and author-specific styling.
 *
 * @param message - The message to display, containing content, timestamp and author data
 * @param contact - The contact whose avatar we should display
 * @param displayAvatar - Whether this is the first in a set of messages by this author (only
 * display avatar for the first)
 */
export const ChatMessage: React.FC<Props> = ({ message, contact, displayAvatar }) => {
  // If the author is empty, we interpret that as a message sent by the user, not the contact.
  const { t } = useTranslation();
  const isAuthor = message.author?.value === "";
  const id = `chatMessage-${message.uid}`;
  const renderAvatar = (): JSX.Element | null => {
    // Render nothing if the message is the user's (i.e. should be shown on the right). If it's a
    // message from the contact, render either their avatar or a blank block of the same size, such
    // that only the first message in a sequence is rendered with an avatar.
    if (isAuthor) return null;
    else if (displayAvatar) return <Avatar contact={contact} showPresence={false} />;
    else return <S.AvatarPlaceholder />;
  };

  // Linkify recognises links in the text of messages
  return (
    <S.MessageContainer isAuthor={isAuthor} id={id}>
      {renderAvatar()}
      <S.MessageBubble isAuthor={isAuthor}>
        <Linkify>
          <S.MessageText>{message.content}</S.MessageText>
        </Linkify>
        <S.MessageTimestamp isAuthor={isAuthor}>
          <S.Time>{message.type === MessageType.SMS ? t("sms") + " - " : ""}</S.Time>
          <S.Time>{formatDateTime(new Date(message.timestamp), { timeStyle: "short" })}</S.Time>
        </S.MessageTimestamp>
      </S.MessageBubble>
    </S.MessageContainer>
  );
};

export default ChatMessage;
