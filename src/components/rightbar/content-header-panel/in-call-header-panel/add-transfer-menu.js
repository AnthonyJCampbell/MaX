// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the 'Add or Transfer' menu.
 * Contains buttons for call actions whilst in a call.
 */

import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { Menu, Title, Section, Button } from "components/menu/menu";

import Add from "assets/rightbar/menu-button-add.svg";
import Transfer from "assets/rightbar/menu-button-transfer.svg";
import { showUnimplemented } from "action-creators/navigation/actions";

const AddTransferMenu = ({ keyboardNavTools }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const idList = [
    "addTransferMenuRow-AddToCall",
    "addTransferMenuRow-AttendedTransfer",
    "addTransferMenuRow-BlindTransfer",
  ];

  return (
    <Menu keyboardNavTools={keyboardNavTools} id="addTransferMenu" idList={idList}>
      <Section>
        <Title text={t("addOrTransfer")} />
        <Button
          imageSrc={Add}
          text={t("addSomeoneToThisCall")}
          id={idList[0]}
          clickAction={() => dispatch(showUnimplemented("Add or transfer button"))}
        />
        <Button
          imageSrc={Transfer}
          text={t("attendedTransfer")}
          detail={t("brSpeakFirst")}
          id={idList[1]}
          clickAction={() => dispatch(showUnimplemented("Attended transfer button"))}
        />
        <Button
          imageSrc={Add}
          text={t("blindTransfer")}
          detail={t("brImmediate")}
          id={idList[2]}
          clickAction={() => dispatch(showUnimplemented("Blind transfer button"))}
        />
      </Section>
    </Menu>
  );
};

AddTransferMenu.propTypes = {
  keyboardNavTools: PropTypes.object,
};

export default AddTransferMenu;
