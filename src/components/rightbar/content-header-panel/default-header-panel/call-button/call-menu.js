// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a menu that lists numbers for the user to call.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { createActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { Menu, Title, Section, Button } from "components/menu/menu";
import { prettyContactDetailType, phoneNumberSorter } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import CallIcon from "assets/rightbar/menu-button-call.svg";
import log from "src/renderer-logging";

const CallMenu = ({ phoneNumbers, keyboardNavTools }) => {
  const { t } = useTranslation();
  const easRegion = useSelector((state) => state.settingsReducer.settings.general.easRegion);

  const orderedPhoneNumbers = phoneNumbers.sort(phoneNumberSorter);

  const onClick = (numberToCall) => {
    log.userAction(`Clicked menu button to call ${numberToCall}`);
    createActiveCall(numberToCall);
  };

  const rowId = (phoneNumber) => `callMenuRow-${phoneNumber.value}`;

  const idList = orderedPhoneNumbers.map(rowId);

  const menuRows = orderedPhoneNumbers.map((phoneNumber, index) => {
    const phoneNumberFormatted = formatPhoneNumber(phoneNumber, easRegion);
    return (
      <Button
        key={`${phoneNumber.value}, ${phoneNumber.type}, ${index}`}
        imageSrc={CallIcon}
        text={phoneNumberFormatted}
        detail={prettyContactDetailType(phoneNumber.type)}
        clickAction={() => onClick(phoneNumber.value)}
        id={rowId(phoneNumber)}
      />
    );
  });

  return (
    <Menu keyboardNavTools={keyboardNavTools} id="callMenu" idList={idList}>
      <Section>
        <Title text={t("selectNumber")} />
        {menuRows}
      </Section>
    </Menu>
  );
};

CallMenu.propTypes = {
  phoneNumbers: PropTypes.arrayOf(PropTypes.object).isRequired,
  keyboardNavTools: PropTypes.object,
};

export default CallMenu;
