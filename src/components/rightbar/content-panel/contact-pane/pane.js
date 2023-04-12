// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the contact details pane
 */

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import * as S from "./styles";

import log from "src/renderer-logging";
import HistoryContactDetailSection from "./contact-detail-section/history-section";
import AddressContactDetailSection from "./contact-detail-section/address-section";
import EmailContactDetailSection from "./contact-detail-section/email-section";
import PhoneContactDetailSection from "./contact-detail-section/phone-section";
import BasicContactDetailSection from "./contact-detail-section/basic-section";
import { ContactDetailsSection } from "./shared";
import { addContact } from "action-creators/ipc-outgoing/contacts-actions";
import { selectChatsWithContact } from "store/selectors/messaging";

/**
 * Render the contact details - made up of multiple contact details sections.
 */
const ContactPane = () => {
  const { selectedContact } = useSelector((state) => state.contactReducer);
  const { t } = useTranslation();
  const chats = useSelector(selectChatsWithContact(selectedContact));

  const handleAddAsContactClick = () => {
    addContact(selectedContact);
    log.userAction("Clicked 'Add as a contact' in Contact Pane");
  };

  log.debug("Rendering ContactPane");
  return (
    <S.ContactPaneWrapper id={"contactPane"}>
      {selectedContact.uid === "" && (
        <S.AddAsAContactButton id={`contactPane-addContact`} onClick={handleAddAsContactClick}>
          {t("addAsAContact")}
        </S.AddAsAContactButton>
      )}
      <S.ContactPane
        im={selectedContact.im}
        hasConversation={chats.length > 0}
        uid={selectedContact.uid}
      >
        <S.PaddingWrapper>
          <address>
            <S.BasicPaddingWrapper>
              <BasicContactDetailSection type={ContactDetailsSection.NICKNAME} />
              <BasicContactDetailSection type={ContactDetailsSection.JOB_TITLE} />
              <BasicContactDetailSection type={ContactDetailsSection.COMPANY} />
            </S.BasicPaddingWrapper>
            <PhoneContactDetailSection />
            <EmailContactDetailSection />
            <AddressContactDetailSection />
          </address>
          <HistoryContactDetailSection />
        </S.PaddingWrapper>
      </S.ContactPane>
    </S.ContactPaneWrapper>
  );
};

export default ContactPane;
