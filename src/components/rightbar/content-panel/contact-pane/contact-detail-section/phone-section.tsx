// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the phone contact details section
 * The phone header, phone number button, followed by the type of number, spaced out 25px from the
 * longest phone number field
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { focusRightbarMessage, setSelectedContact } from "action-creators/navigation/actions";
import { createActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { CountryCode } from "libphonenumber-js";
import i18n from "i18next";

import PhoneDetails from "./phone-details";
import { prettyContactDetailType, phoneNumberSorter } from "components/utils/common";
import { prettyContactDetailSectionHeader, ContactDetailsSection } from "../shared";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import * as S from "./styles";
import IconButton from "components/ui/IconButton/IconButton";
import { IconVariant } from "components/ui/Icon/types";
import { IconButtonVariant } from "components/ui/IconButton/types";
import { IconName } from "assets/icons/iconsLib";

import log from "src/renderer-logging";
import { StoreState } from "store/types";
import { PhoneNumber } from "shared/types";
import { Contact } from "src/types";

/* Render method for phone numbers */
const PhoneContactDetailSection: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const contact = useSelector<StoreState, Contact>((state) => state.contactReducer.selectedContact);
  const phones = useSelector<StoreState, PhoneNumber[]>(
    (state) => state.contactReducer.selectedContact.phone
  );
  const easRegion = useSelector<StoreState, CountryCode>(
    (state) => state.settingsReducer.settings.general.easRegion
  );
  const orderedPhoneNumbers = phones.sort(phoneNumberSorter);
  const anonymous = i18n.t("anonymous");
  if (orderedPhoneNumbers.length === 0) return <></>;
  const buttonClickHandler = (number: string): void => {
    log.userAction(`Clicked detail call button with number: ${number}`);
    createActiveCall(number);
  };

  const messageClickHandler = (numberToMessage: string, contact: Contact): void => {
    log.userAction(`Clicked contact detail SMS button with number: ${numberToMessage}`);
    dispatch(setSelectedContact(contact, numberToMessage));
    dispatch(focusRightbarMessage());
  };

  const prettySectionHeader = prettyContactDetailSectionHeader(ContactDetailsSection.PHONE);

  return (
    <S.DetailSection>
      <S.SectionTitle>{prettySectionHeader}</S.SectionTitle>
      {orderedPhoneNumbers[0].value == "" || orderedPhoneNumbers[0].value == "anonymous" ? (
        <>{anonymous}</>
      ) : (
        <S.SectionContents id={`detailSection-phone`} numRows={orderedPhoneNumbers.length}>
          {orderedPhoneNumbers.map((data, index) => {
            const phoneNumber = formatPhoneNumber(data.value, easRegion);
            const numberType = prettyContactDetailType(data.type);
            const label =
              contact.uid !== ""
                ? t("sendSMStoPhoneNumberWithType", { phoneNumber, numberType })
                : t("sendSMStoPhoneNumber", { phoneNumber });
            return (
              <S.Detail key={`detail ${data.value}, ${data.type}, ${index}`}>
                <PhoneDetails
                  key={`number ${data.value}, ${data.type}, ${index}`}
                  data={data}
                  index={index}
                  easRegion={easRegion}
                  callback={buttonClickHandler}
                />
                <IconButton
                  id="sendSMSButton"
                  key={`button ${data.value}, ${data.type}, ${index}`}
                  ariaLabel={label}
                  icon={IconName.sms}
                  variant={IconButtonVariant.white}
                  iconVariant={IconVariant.primary}
                  iconSize={26}
                  onClickHandler={(): void => messageClickHandler(data.value, contact)}
                />
              </S.Detail>
            );
          })}
        </S.SectionContents>
      )}
    </S.DetailSection>
  );
};

export default PhoneContactDetailSection;
