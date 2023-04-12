// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the ChatPane, containing the ongoing chat with the selected contact.
 * Keeps track of the current and previous chat, dispatching updates to a chat where required.
 */
import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { markChatRead } from "action-creators/ipc-outgoing/messaging-actions";
import { selectChatsWithContact } from "store/selectors/messaging";

import * as S from "./styles";

import log from "src/renderer-logging";
import { orderMessagesFromChats } from "components/utils/common";
import { ChatMessage as Message } from "./chat-message/chat-message";
import ChatHeader from "./chat-header/chat-header";
import MessageBox from "./message-box/message-box";
import { Contact, ChatMessage, Chat, MessageType } from "src/types";
import { StoreState } from "store/types";
import TypingIndicator from "./typing-indicator/typing-indicator";
import { selectMessageRemoteParty } from "store/selectors/paneManagement";

/**
 * Given a list of messages, returns the uid of the first unread message, or null if no unread messages
 *
 * Stops counting when it finds a read message, so if an unread message has a newer
 * read message it will be ignored.
 */
const calculateNewIndicatorUid = (messages: ChatMessage[]): string | null => {
  const index = messages.findIndex((m) => m.read === true);
  if (index === 0) return null;
  if (index === -1) return messages[messages.length - 1].uid;
  return messages[index - 1].uid;
};

/**
 * Mark the messages in the chat as read, provided we are on the conversation
 * tab, the most recent message is unread, and the window is in focus
 */
const markMessagesInChatAsRead = (
  activeRightPane: string,
  mostRecentChatMessageRead: boolean,
  windowFocussed: boolean,
  chat: Chat
): void => {
  if (activeRightPane !== "chat" || mostRecentChatMessageRead || !windowFocussed) return;
  markChatRead(chat);
};

/**
 * Returns the ChatPane with a list of all stored messages and the input bar.
 */
export const ChatPane: React.FC = () => {
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const chats = useSelector(selectChatsWithContact(selectedContact));
  const messageRemoteParty = useSelector(selectMessageRemoteParty);
  const activeRightPane = useSelector<StoreState, string>(
    (state) => state.paneManagementReducer.activeRightPane
  );
  const isMainWindowFocused = useSelector<StoreState, boolean>(
    (state) => state.paneManagementReducer.isMainWindowFocused
  );

  const prevContact = useRef<Contact>();
  const bottomElementRef = useRef<HTMLDivElement>(null);
  const orderedMessages: ChatMessage[] = orderMessagesFromChats(chats);
  const reversedMessages: ChatMessage[] = orderedMessages.slice().reverse();
  const mostRecentChatMessageUid = orderedMessages[0]?.uid;
  const mostRecentChatMessageRead = orderedMessages[0]?.read;
  const [newIndicatorUid, setNewIndicatorUid] = useState<string | null>(null);
  let newIndicatorIndex: number | null = null;
  // After moving away from using css to reverse the message groups' order
  // We need to make sure to scroll the most recent messages into view
  // Update the scroll location to the bottom on update of selectedContact
  // The delay makes sure the contents have been rendered before scrolling to the bottom
  useLayoutEffect(() => {
    setTimeout(() => {
      bottomElementRef?.current?.scrollIntoView();
    }, 0);
  }, [selectedContact.uid, mostRecentChatMessageUid, messageRemoteParty]);

  /**
   * Recalculate the location of the new indicator, provided either the selected contact
   *  has changed or we're not displaying the indicator but now we need to display one.
   */
  const getNewIndicatorLocation = (
    prevContact: Contact,
    selectedContact: Contact,
    chatMessages: ChatMessage[],
    newIndicatorUid: string | null,
    mostRecentChatMessageRead: boolean
  ): void => {
    if (
      prevContact.uid !== selectedContact.uid ||
      (selectedContact.uid === "" &&
        prevContact.phone[0]?.value !== selectedContact.phone[0]?.value) ||
      (!newIndicatorUid && mostRecentChatMessageRead === false)
    ) {
      setNewIndicatorUid(chatMessages.length === 0 ? null : calculateNewIndicatorUid(chatMessages));
    }
  };

  const updateNewIndicator = (): void => {
    // 1. New indicator
    if (prevContact.current)
      getNewIndicatorLocation(
        prevContact.current,
        selectedContact,
        orderedMessages,
        newIndicatorUid,
        mostRecentChatMessageRead
      );
    // 2. Mark chat read
    if (chats.length > 0)
      chats.forEach((chat) => {
        markMessagesInChatAsRead(
          activeRightPane,
          mostRecentChatMessageRead,
          isMainWindowFocused,
          chat
        );
      });

    // 3. Set prev contact
    prevContact.current = selectedContact;

    if (reversedMessages.length !== 0) {
      // Find the latest batch of unread messages, and separate them out.
      //
      // There are 3 locations for the split:
      // 1. No new messages -> newIndicatorUid is null
      // 2. All new messages -> newIndicatorUid is the first item in the list, or not null
      //    (oldest new message has aged out)
      // 3. N new messages -> newIndicator is anything else; split new and old based on the
      //    index of the first unread message
      if (!newIndicatorUid) {
        newIndicatorIndex = reversedMessages.length;
      } else {
        const oldestUnreadMessageIndex = reversedMessages.findIndex(
          (m) => m.uid === newIndicatorUid
        );
        if (oldestUnreadMessageIndex !== -1) {
          // Set split based on index of oldest unread message
          newIndicatorIndex = oldestUnreadMessageIndex;
        } else {
          // If the newIndicatorUid is set, but can't be found, then the message has aged out
          // so all messages must be unread
          newIndicatorIndex = 0;
        }
      }
    }
  };

  const renderMessage = (message: ChatMessage, idx: number): React.ReactElement => {
    let dateHeader: string | undefined = undefined;
    const date = new Date(message.timestamp);
    const dateString = new Date(date.toDateString());
    const datestamp = dateString.toISOString();
    if (idx === 0) dateHeader = datestamp;
    else {
      const previousDate = new Date(reversedMessages[idx - 1].timestamp);
      const previousDateString = new Date(previousDate.toDateString());
      const previousDatestamp = previousDateString.toISOString();
      if (datestamp !== previousDatestamp) dateHeader = datestamp;
    }

    let isNew = false;
    if (newIndicatorIndex !== null) isNew = idx === newIndicatorIndex;
    const isSwitched = idx >= 1 ? reversedMessages[idx - 1].type !== message.type : false;

    return (
      <React.Fragment key={`fragment-${message.uid}`}>
        {dateHeader !== undefined && (
          <ChatHeader key={`dateheader-${message.uid}`} date={dateHeader} />
        )}
        {isSwitched && (
          <ChatHeader
            key={`messagetypeheader-${message.uid}`}
            message={{ messageType: message.type, messageUid: message.uid }}
          />
        )}
        {isNew && <ChatHeader key={`newheader-${message.uid}`} isNew={true} />}
        <Message
          key={idx}
          contact={selectedContact}
          message={message}
          displayAvatar={
            // Display avatar if first message after a header or previous message has different author
            dateHeader || isNew || isSwitched
              ? true
              : reversedMessages[idx - 1].author?.value !== message.author?.value
          }
        />
      </React.Fragment>
    );
  };

  const renderFinalTypeHeader = (): React.ReactElement | void => {
    if (
      orderedMessages[0] &&
      messageRemoteParty === "IM" &&
      orderedMessages[0]?.type !== MessageType.IM
    ) {
      return (
        // No index is needed for temporary chat header
        <ChatHeader
          key={`finaltypeheader-${orderedMessages[0].uid}`}
          // eslint-disable-next-line i18next/no-literal-string
          message={{ messageType: MessageType.IM, messageUid: "temp" }}
        />
      );
    } else if (
      orderedMessages[0] &&
      messageRemoteParty !== "IM" &&
      orderedMessages[0]?.type === MessageType.IM
    ) {
      return (
        // No index is needed for temporary chat header
        <ChatHeader
          key={`finaltypeheader-${orderedMessages[0].uid}`}
          // eslint-disable-next-line i18next/no-literal-string
          message={{ messageType: MessageType.SMS, messageUid: "temp" }}
        />
      );
    }
  };

  updateNewIndicator();
  log.debug("Rendering ChatPane");
  return (
    <S.ChatPane id="chatPane">
      <S.ChatContainer>
        {reversedMessages.map(renderMessage)}
        {renderFinalTypeHeader()}
        {/* An anchor for scrolling to the most recent messages in chat pane*/}
        <S.BottomElement ref={bottomElementRef} />
      </S.ChatContainer>
      <S.Wrapper>
        <TypingIndicator />
        <MessageBox />
      </S.Wrapper>
    </S.ChatPane>
  );
};

export default ChatPane;
