// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { deleteContact } from "action-creators/ipc-outgoing/contacts-actions";
import { showChatHistory } from "action-creators/ipc-outgoing/messaging-actions";
import { hideModalPopup } from "action-creators/navigation/actions";
import { selectChatsWithContact } from "store/selectors/messaging";
import { fullname } from "components/utils/common";
import log from "src/renderer-logging";

import * as S from "./styles";

/* Return the Confirm Delete Modal content
 * This modal contains the information and buttons used to delete a contact.
 */
const ConfirmDeletePopup = () => {
  const dispatch = useDispatch();
  const contact = useSelector((state) => state.contactReducer.selectedContact);
  const chats = useSelector(selectChatsWithContact(contact));
  const { t } = useTranslation();

  const hideHistory =
    (contact.im === null || contact.im === undefined || contact.im.value === "") &&
    chats.length === 0;

  const clickHandler = (action, logText, hidePopupAfterAction = true) => {
    log.userAction(`Clicked ${logText} Button in Confirm Delete Popup`);

    action();
    if (hidePopupAfterAction) {
      dispatch(hideModalPopup());
    }
  };

  const bgContactWithChat = !hideHistory && !contact.types.typeBGContact;

  /* The 'dialogTitle' id is not unique, as it should appear in different modals,
   * as needed by the main modal popup
   */

  const generateTitle = () => {
    if (contact.types.typeBGContact) {
      return <h1 id="dialogTitle">{t("warnNetworkContact")}</h1>;
    }
    return <h1 id="dialogTitle">{t("warnDeleteContact")}</h1>;
  };

  const generateDeleteButton = () => {
    const buttonText = contact.types.typeBGContact ? t("resetNetwork") : t("delete");

    return (
      <S.Button
        delete={true}
        onClick={() => clickHandler(() => deleteContact(contact), buttonText)}
        id={"confirmDeletePopup-Delete"}
      >
        {buttonText}
      </S.Button>
    );
  };

  return (
    <span id="confirmDeletePopup">
      <S.VariableText>
        {generateTitle()}
        <p>
          {t(contact.types.typeBGContact ? "textResetContact" : "textDeleteContact", {
            name: fullname(contact),
          })}
        </p>
        {contact.types.typeBGContact && <p>{t("textNetworkContact")}</p>}
        {!hideHistory && contact.types.typeBGContact && (
          <p>{`${t("mayLoseChat")} ${t("exportChatHistory")}`}</p>
        )}
        {bgContactWithChat && <p>{t("exportChatHistory")}</p>}
      </S.VariableText>

      <S.ButtonsContainer>
        {generateDeleteButton()}
        {!hideHistory && (
          <S.Button
            onClick={() =>
              clickHandler(() => showChatHistory(contact), t("viewChatHistory"), false)
            }
            id={"confirmDeletePopup-ViewChatHistory"}
          >
            {t("viewChatHistory")}
          </S.Button>
        )}
        <S.Button
          onClick={() => clickHandler(() => {}, t("cancel"))}
          id={"confirmDeletePopup-Cancel"}
        >
          {t("cancel")}
        </S.Button>
      </S.ButtonsContainer>
    </span>
  );
};

export default ConfirmDeletePopup;
