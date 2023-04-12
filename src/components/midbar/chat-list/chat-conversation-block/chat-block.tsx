// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a single chat conversation block.
 */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setSelectedContact, focusRightbarMessage } from "action-creators/navigation/actions";
import Avatar from "components/avatar/avatar";
import Icon from "components/ui/Icon/Icon";

import { StoreState } from "store/types";
import { Contact, Chat } from "src/types";
import { chatAttention, fullname, prettyPresence } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import { convertToRelativeTime } from "components/utils/date-time";
import * as Shared from "components/midbar/shared-styles";

import NotifyIcon from "assets/midbar/list-notify-on.svg";

import log from "src/renderer-logging";
import { IconVariant } from "components/ui/Icon/types";
import { CountryCode } from "libphonenumber-js";
import { IconName } from "assets/icons/iconsLib";

interface Props {
  contact: Contact;
  chat: Chat;
  id: string;
}

/**
 * Render a single block in the chat list
 * @param {Contact} contact - Contact whom that chat is with
 * @param {Object} chat - A Chat object with its messages ordered
 * @param {String} id - unique ID for the chat block
 */
const ChatBlock: React.FC<Props> = ({ contact, chat, id }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const activeRightPane = useSelector<StoreState, string>(
    (state) => state.paneManagementReducer.activeRightPane
  );
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const isMainWindowFocused = useSelector<StoreState, boolean>(
    (state) => state.paneManagementReducer.isMainWindowFocused
  );
  const easRegion = useSelector<StoreState, CountryCode>(
    (state) => state.settingsReducer.settings.general.easRegion
  );
  const attention = chatAttention(chat, selectedContact, activeRightPane, isMainWindowFocused);

  const [rerender, setRerender] = useState(false);

  let fullName = fullname(contact);
  // TODO DUIR-3351: This logic shouldn't depend on a translated string
  if (fullName === t("noName") && contact.phone[0]) {
    fullName = formatPhoneNumber(contact.phone[0].value, easRegion);
  }

  // A new message is listed as having been received "Just now", but should be updated to a timestamp after 60 seconds.
  // Every 10 seconds, the interval checks if 60 seconds have elapsed, in which case it updates the datetime stamp
  // If so, we call setRerender() order to manually rerender and display the timestamp.
  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout>;
    if (convertToRelativeTime(chat.message[0].timestamp) === t("justNow")) {
      intervalId = setInterval(() => {
        setRerender(!rerender);
      }, 10000);
    }

    return (): void => clearInterval(intervalId);
  });

  const setSelectedContactHandler = (contact: Contact): void => {
    log.userAction(`Clicked chat with ${fullName} (UID: ${contact.uid})`);
    dispatch(setSelectedContact(contact));
    dispatch(focusRightbarMessage());
  };

  // Note, this is a comma separated list, so building the string
  // programmatically rather than using a branded formatting string.
  let accessibleText = `${fullName}, `;
  if (contact.presence) {
    accessibleText += `${prettyPresence(contact.presence.state)}, `;
  }
  if (contact.isFavourite) {
    accessibleText += `${t("favouritesContact")}, `;
  }
  if (contact.notifyWhenAvailable) {
    accessibleText += `${t("watchingAvailability")}, `;
  }
  if (attention) {
    accessibleText += `${t("unreadMessages")}, `;
  }
  accessibleText += `${chat.message[0].content}, `;
  accessibleText += `${convertToRelativeTime(chat.message[0].timestamp)}, `;

  return (
    <Shared.ItemBlock
      onClick={(): void => setSelectedContactHandler(contact)}
      id={id}
      aria-label={accessibleText}
      tabIndex={-1}
    >
      <Avatar contact={contact} aria-hidden="true" />
      <Shared.InfoContainer>
        <Shared.TopLine>
          <Shared.NameContainer>
            {/* Show the attention dot if the chat wants the user's attention*/}
            {attention && <Shared.AttentionDot />}
            <Shared.Name bold={attention}>{fullName}</Shared.Name>
            {contact?.isFavourite && (
              <Icon
                icon={IconName.star}
                size={12}
                variant={IconVariant.dark}
                style={{ marginLeft: "4px" }}
              />
            )}
            {contact.notifyWhenAvailable ? <img src={NotifyIcon} alt="" /> : <></>}
          </Shared.NameContainer>
          <Shared.Time dateTime={chat.message[0].timestamp}>
            {convertToRelativeTime(chat.message[0].timestamp)}
          </Shared.Time>
        </Shared.TopLine>
        <Shared.BottomLine>
          {contact.isTyping ? t("typing") : chat.message[0].content}
        </Shared.BottomLine>
      </Shared.InfoContainer>
    </Shared.ItemBlock>
  );
};

const areEqual = (prevProps: Props, nextProps: Props): boolean => {
  return (
    JSON.stringify(prevProps.contact) === JSON.stringify(nextProps.contact) &&
    JSON.stringify(prevProps.chat) === JSON.stringify(nextProps.chat)
  );
};

export default React.memo(ChatBlock, areEqual);
