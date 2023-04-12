// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the chat list.
 */

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ChatBlock from "./chat-conversation-block/chat-block";
// eslint-disable-next-line
// @ts-ignore
import ArrowKeyControl from "components/arrow-key-control/control";
import { Chat, Contact } from "src/types";

import * as Shared from "components/midbar/shared-styles";
import * as S from "./styles";

import log from "src/renderer-logging";
import { doesContactMatchChat, sortMessages, chatSorter } from "components/utils/common";
import { StoreState } from "store/types";
import { MessageType } from "protobuf-wispa/dist/messaging";

/**
 * Render the list of chat conversation blocks.
 */
const ChatList: React.FC = () => {
  const chats = useSelector<StoreState, Chat[]>((state) => state.messagingReducer.chats);
  const contacts = useSelector<StoreState, Contact[]>((state) => state.contactReducer.contacts);
  const { t } = useTranslation();

  const orderedChats = chats
    .map((chat: Chat) => {
      chat.message = sortMessages(chat.message);
      return chat;
    })
    .sort(chatSorter);

  const getContactFromChatUid = (chat: Chat): Contact | undefined => {
    const matches = contacts.filter((contact: Contact) => doesContactMatchChat(contact, chat.uid));

    if (matches.length > 0) {
      return matches[0];
    } else if (chat.message[0].type === MessageType.SMS) {
      return Contact.fromPhoneNumber(chat.uid);
    }
    return;
  };

  // Get unique contacts from each chat
  const contactsWithChat = orderedChats
    .map((chat) => getContactFromChatUid(chat))
    .reduce<Contact[]>((accumulator, current) => {
      if (
        current &&
        !accumulator.some((contact) => contact.uid !== "" && contact.uid === current.uid)
      ) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);

  const idList = contactsWithChat.map((contact) => {
    return `chatBlock-${contact.uid}-${contact.phone[0]?.value}`;
  });

  /**
   * Render each unique contact from the ordered chats list
   */
  const renderChats = (): JSX.Element[] =>
    contactsWithChat.map((contact) => {
      const chat = orderedChats.find(
        (item) =>
          contact.im?.value === item.uid ||
          contact.phone.some((phoneNumber) => phoneNumber.value === item.uid)
      );
      if (chat) {
        const id = `chatBlock-${contact.uid}-${contact.phone[0]?.value}`;
        return (
          <ChatBlock
            key={`${contact.uid}, ${contact.phone[0]?.value}`}
            chat={chat}
            contact={contact}
            id={id}
          />
        );
      } else {
        return <></>;
      }
    });

  log.debug("Rendering chat list");
  return (
    <>
      <S.ChatListContainer id="chatList">
        {chats.length === 0 ? (
          <Shared.NoItems>
            <h1>{t("noChatsMessage")}</h1>
          </Shared.NoItems>
        ) : (
          <ArrowKeyControl idList={idList}>{renderChats()}</ArrowKeyControl>
        )}
      </S.ChatListContainer>
    </>
  );
};

export default ChatList;
