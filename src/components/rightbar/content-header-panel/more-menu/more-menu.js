// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the 'More options' menu.
 * Contains buttons for miscellaneous actions when viewing a contact.
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { Menu, Title, Section, Button } from "components/menu/menu";
import Icon from "components/ui/Icon/Icon";

import Delete from "assets/rightbar/menu-button-delete.svg";
import Edit from "assets/rightbar/menu-button-edit.svg";
import NotifyOff from "assets/rightbar/menu-button-notify.svg";
import NotifyOn from "assets/rightbar/menu-button-notify-on.svg";
import History from "assets/rightbar/menu-button-history.svg";
import Dialpad from "assets/rightbar/menu-button-dialpad.svg";
import Switch from "assets/rightbar/menu-button-switch.svg";
import Add from "assets/rightbar/menu-button-add.svg";

import log from "src/renderer-logging";
import { PresenceState } from "src/types";

import {
  editContact,
  updateContactIsFavourite,
  updateContactNWA,
  addContact,
} from "action-creators/ipc-outgoing/contacts-actions";
import { showChatHistory } from "action-creators/ipc-outgoing/messaging-actions";
import { showUnimplemented, showConfirmDeletePopup } from "action-creators/navigation/actions";
import { noSelectedContactUid } from "shared/constants";
import { selectChatsWithContact } from "selectors/messaging";

import { MenuButton } from "./styles";

/**
 * Menu for miscellaneous actions on a contact.
 *
 * @param contact the contact for whom this menu is
 * @param keyboardNavTools object containing necessary information to make
 * keyboard navigation work (see Menu for more details)
 */
const MoreMenu = ({ contact, keyboardNavTools, inCall }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const chats = useSelector(selectChatsWithContact(contact));

  // Hide the notfy when available button if the contact doesn't have a presence.
  const notifyHide = !contact.presence;
  // User should not be able to toggle notify when available if the contact is already online.
  const notifyDisabled = contact.presence?.state === PresenceState.ONLINE;
  // User should not be able to bring up the chat history for contact with no IMAddress
  const hideHistory =
    (contact.im === null || contact.im === undefined || contact.im.value === "") &&
    chats.length === 0;
  // User should not be able to add contact when they have no selected contact
  const noSelectedContact = contact.uid === noSelectedContactUid;
  // User should not be able to edit or delete a non-contact
  const isNonContact = contact.uid === "" || noSelectedContact;

  const toggleNotifyWhenAvailable = () => {
    const newValue = !contact.notifyWhenAvailable;
    log.userAction(
      `Clicked more menu button to turn ${newValue ? "on" : "off"} notifyWhenAvailable`
    );
    updateContactNWA(contact.uid, newValue);
  };

  const notifyButton = () => {
    const isWatching = contact.notifyWhenAvailable;
    const imageSrc = isWatching ? NotifyOn : NotifyOff;
    const text = isWatching ? t("stopWatchingAvailability") : t("notifyWhenAvailable");

    return (
      !notifyHide && (
        <Button
          id={"moreMenuRow-NotifyWA"}
          imageSrc={imageSrc}
          text={text}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(toggleNotifyWhenAvailable, "Notify when available")}
          disabled={notifyDisabled}
        />
      )
    );
  };

  const chatHistoryButton = () => {
    return (
      !hideHistory && (
        <Section borderBottom={true}>
          <Button
            id={"moreMenuRow-ShowChatHistory"}
            imageSrc={History}
            text={t("viewChatHistory")}
            clickAction={() =>
              // eslint-disable-next-line i18next/no-literal-string
              clickHandler(() => showChatHistory(contact), "View chat history")
            }
          />
        </Section>
      )
    );
  };

  const addContactButton = () => {
    return (
      <Button
        imageSrc={Add}
        text={t("addAsAContact")}
        id={"moreMenuRow-AddContact"}
        // eslint-disable-next-line i18next/no-literal-string
        clickAction={() => clickHandler(() => addContact(contact), "Add as a contact")}
      />
    );
  };

  const editContactButton = () => {
    return (
      <Button
        imageSrc={Edit}
        text={t("editContact")}
        id={"moreMenuRow-EditContact"}
        // eslint-disable-next-line i18next/no-literal-string
        clickAction={() => clickHandler(() => editContact(contact), "Edit contact")}
      />
    );
  };

  const deleteContactButton = () => {
    return (
      !isNonContact && (
        <Button
          imageSrc={Delete}
          text={t("deleteContact")}
          id={"moreMenuRow-DeleteContact"}
          clickAction={() =>
            // eslint-disable-next-line i18next/no-literal-string
            clickHandler(() => dispatch(showConfirmDeletePopup()), "Delete contact")
          }
        />
      )
    );
  };

  const closeMenu = () => {
    keyboardNavTools.setVisible(false);
    if (keyboardNavTools.buttonRef?.current) keyboardNavTools.buttonRef.current.focus();
  };

  const clickHandler = (clickedFunc, logText) => {
    log.userAction(`Clicked ${logText} Button in More menu`);
    clickedFunc();
    closeMenu();
  };

  const getFocusableIdList = () => {
    const idList = [];
    // Push IDs into the list in the order they appear in the component. Hidden or disabled buttons
    // can't be focused, so don't include them in the ID List.
    if (inCall) {
      idList.push("moreMenuRow-MoveCall", "moreMenuRow-ShowKeypad");
    }
    if (!hideHistory) idList.push("moreMenuRow-ShowChatHistory");
    idList.push("moreMenuRow-AddToFavorites");
    if (!notifyHide && !notifyDisabled) idList.push("moreMenuRow-NotifyWA");
    if (!isNonContact) {
      idList.push("moreMenuRow-EditContact");
      idList.push("moreMenuRow-DeleteContact");
    }

    return idList;
  };

  const renderFavouritesButton = () => {
    return (
      <MenuButton id={"moreMenuRow-AddToFavorites"} onClick={toggleFavourite}>
        <Icon icon="star" size={12} variant={contact.isFavourite ? "primary" : "outlined"} />
        <div>
          <p>{contact.isFavourite ? t("removeFromFavourites") : t("addToFavourites")}</p>
        </div>
      </MenuButton>
    );
  };

  const toggleFavourite = () => {
    const toogleFavourite = !contact.isFavourite;

    log.userAction(
      `Clicked header panel button to change ${toogleFavourite ? "true" : "false"} isFavourite`
    );
    updateContactIsFavourite(contact.uid, toogleFavourite);
    closeMenu();
  };

  const shouldShowSection = !notifyHide || !isNonContact;

  return (
    <Menu keyboardNavTools={keyboardNavTools} id="moreMenu" idList={getFocusableIdList()}>
      {inCall ? (
        <Section borderBottom={true}>
          <Title text={t("menuMoreCallActions")} />
          <Button
            imageSrc={Switch}
            text={t("moveCallToAnotherDevice")}
            id={"moreMenuRow-MoveCall"}
            clickAction={() => dispatch(showUnimplemented("Move call button"))}
          />
          <Button
            imageSrc={Dialpad}
            text={t("showKeypad")}
            id={"moreMenuRow-ShowKeypad"}
            clickAction={() => dispatch(showUnimplemented("Show keypad button"))}
          />
        </Section>
      ) : (
        <></>
      )}

      {inCall ? null : (
        <Section borderBottom={true}>
          <Title text={t("menuMoreOptions")} />
        </Section>
      )}

      {chatHistoryButton()}
      {shouldShowSection && (
        <Section borderBottom={true}>
          {renderFavouritesButton()}
          {notifyButton()}
        </Section>
      )}

      {!isNonContact ? (
        <Section borderBottom={true}>
          {editContactButton()}
          {deleteContactButton()}
        </Section>
      ) : (
        !noSelectedContact && <Section borderBottom={true}>{addContactButton()}</Section>
      )}
    </Menu>
  );
};

MoreMenu.propTypes = {
  contact: PropTypes.object.isRequired,
  keyboardNavTools: PropTypes.object,
  inCall: PropTypes.bool.isRequired,
};

export default MoreMenu;
