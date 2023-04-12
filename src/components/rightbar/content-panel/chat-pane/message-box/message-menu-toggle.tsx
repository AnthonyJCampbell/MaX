// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Provides the MessageMenuToggle, which lets the user choose between sending SMS or IM
 */
import React, { RefObject, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import log from "src/renderer-logging";

import MenuButton from "src/components/ui/Menu/menu-button";
import Menu, { MenuState } from "src/components/ui/Menu";
import MenuItem from "src/components/ui/Menu/menu-item";
import { prettyContactDetailType, phoneNumberSorter } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import IMIcon from "assets/rightbar/chat.svg";
import IMIconToggle from "assets/rightbar/chat-toggle.svg";
import SMSIcon from "assets/rightbar/chat-sms.svg";
import SMSIconToggle from "assets/rightbar/chat-sms-toggle.svg";

import { Contact } from "src/types";
import { CountryCode } from "libphonenumber-js";
import { StoreState } from "store/types";
import { PhoneNumber } from "shared/types";
import { setForceMessageRemoteParty } from "action-creators/navigation/actions";
import { Sizes } from "components/utils/style-constants";
import { selectMessageRemoteParty } from "store/selectors/paneManagement";

export interface MessageMenuToggleProps {
  initialState?: MenuState;
  focusRefOnClose?: RefObject<HTMLTextAreaElement>;
}

const MessageMenuToggle: React.FC<MessageMenuToggleProps> = ({
  initialState = MenuState.INITIAL,
  focusRefOnClose,
}) => {
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const messageRemoteParty = useSelector(selectMessageRemoteParty);
  const easRegion = useSelector<StoreState, CountryCode>(
    (state) => state.settingsReducer.settings.general.easRegion
  );
  const [menuState, setMenuState] = useState(initialState || MenuState.INITIAL);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onClickHandler = (numberType: string): void => {
    dispatch(setForceMessageRemoteParty(numberType));
    log.userAction(`User selected message remote party from menu: ${messageRemoteParty}`);
  };
  const orderedPhoneNumbers = selectedContact.phone.sort(phoneNumberSorter);

  useEffect(() => {
    if (menuState === MenuState.CLOSE) {
      focusRefOnClose?.current?.focus();
    }
  }, [menuState]);

  const itemToFocus = (): number => {
    if (messageRemoteParty === "IM") return 0;
    else {
      const index = orderedPhoneNumbers.findIndex((number) => number.value === messageRemoteParty);
      if (selectedContact.im || index === -1) return index + 1;
      else return index;
    }
  };

  const renderIMOption = (): void | JSX.Element => {
    if (selectedContact.im) {
      return (
        <MenuItem
          id={"messageMenuRow-IM"}
          key={"IM"}
          label={t("sendIMMessage")}
          onClick={(): void => onClickHandler("IM")}
          icon={IMIcon}
        />
      );
    }
  };

  const renderSMSOption = (phone: PhoneNumber, index: number): JSX.Element => {
    const phoneNumber = formatPhoneNumber(phone.value, easRegion);
    const numberType = prettyContactDetailType(phone.type);
    return (
      <MenuItem
        id={`messageMenuRow-SMS-${index}`}
        key={`${phone.value}, ${phone.type}, ${index}`}
        label={t("sendSMStoPhoneNumberWithType", { phoneNumber, numberType })}
        onClick={(): void => onClickHandler(phone.value)}
        icon={SMSIcon}
      />
    );
  };

  const renderMenuItems = (): JSX.Element[] => {
    const imOption = renderIMOption();
    const smsItems = orderedPhoneNumbers.map((data, index) => renderSMSOption(data, index));
    const menuItems: JSX.Element[] = imOption ? [imOption].concat(smsItems) : smsItems;

    return menuItems;
  };

  if (selectedContact.im && selectedContact.phone.length === 0) {
    return (
      <S.MsgMenuToggle id={"messageMenu"}>
        <img src={IMIcon} alt="" />
      </S.MsgMenuToggle>
    );
  } else if (!selectedContact.im && selectedContact.phone.length === 1) {
    return (
      <S.MsgMenuToggle id={"messageMenu"}>
        <img src={SMSIcon} alt="" />
      </S.MsgMenuToggle>
    );
  } else {
    const handleClick = (): void => {
      if (menuState === MenuState.OPEN) {
        setMenuState(MenuState.CLOSE);
      } else {
        setMenuState(MenuState.OPEN);
      }
    };

    return (
      <MenuButton
        id={"messageMenuButton"}
        ariaLabel={t("expandMessagingOptions")}
        icon={messageRemoteParty === "IM" ? IMIconToggle : SMSIconToggle}
        size={Sizes.rightbar.chatTypeButtonSize}
        onClick={handleClick}
        tooltipText={t("messagingOptions")}
        menuState={menuState}
      >
        <Menu
          id={"messageMenu"}
          state={menuState}
          itemToFocus={itemToFocus()}
          onClose={(): void => setMenuState(MenuState.CLOSE)}
          onDismiss={(): void => setMenuState(MenuState.INITIAL)}
          title={t("messagingOptions")}
        >
          {renderMenuItems()}
        </Menu>
      </MenuButton>
    );
  }
};

export default MessageMenuToggle;
