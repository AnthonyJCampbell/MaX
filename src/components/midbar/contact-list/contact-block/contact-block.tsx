// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a single contact block.
 */

import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { setSelectedContact, focusRightbarMessage } from "action-creators/navigation/actions";

import Avatar from "components/avatar/avatar";
import { fullname, prettyPresenceWithStatus } from "components/utils/common";
import Icon from "components/ui/Icon/Icon";

import * as Shared from "components/midbar/shared-styles";

import log from "src/renderer-logging";
import { Contact } from "src/types";
import { IconVariant } from "components/ui/Icon/types";
import { IconName } from "assets/icons/iconsLib";
import { Sizes } from "components/utils/style-constants";

export interface ContactBlockProps {
  /**
   * Contact whose details we want
   */
  contact: Contact;

  /**
   * Unique ID for the contact block
   */
  id: string;
}

/**
 * Render a single block in the contact list
 */
const ContactBlock: React.FC<ContactBlockProps> = ({ contact, id }) => {
  // To allow testing of memoisation in the FV framework we log out whenever this component renders.
  // Log needs to be a warning log because only error and warning logs are printed by chromedriver.
  if (window.process.env.FVFramework) {
    // eslint-disable-next-line i18next/no-literal-string
    console.warn(`Rendering contact ${contact.uid}`);
  }
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClick = (contact: Contact): void => {
    log.userAction(`Clicked contact ${fullname(contact)} (UID: ${contact.uid})`);
    dispatch(setSelectedContact(contact));
    dispatch(focusRightbarMessage());
  };

  let accessibleText = fullname(contact);
  if (contact.presence) {
    accessibleText += `, ${prettyPresenceWithStatus(contact)}`;
  }
  if (contact?.isFavourite) {
    accessibleText += `, ${t("favouritesContact")}`;
  }
  if (contact.notifyWhenAvailable) {
    accessibleText += `, ${t("watchingAvailability")}`;
  }

  return (
    <Shared.ItemBlock
      id={id}
      onClick={(): void => handleClick(contact)}
      tabIndex={-1}
      aria-label={accessibleText}
    >
      <Avatar contact={contact} aria-hidden="true" />
      {/* Info container - mostly for positioning purposes, but aria hide as the Avatar has a label */}
      <Shared.InfoContainer aria-hidden="true">
        <Shared.NameContainer>
          <Shared.Name>{fullname(contact)}</Shared.Name>
          {contact.isFavourite && (
            <Icon
              ariaLabel="Favourite Contact"
              icon={IconName.star}
              size={Sizes.midbar.contactBlockStarIconSize}
              variant={IconVariant.dark}
              style={{ marginLeft: "4px" }}
            />
          )}
          {contact.notifyWhenAvailable && (
            <Icon
              icon={IconName.notify}
              size={Sizes.midbar.contactBlockStarIconSize}
              variant={IconVariant.dark}
              style={{ marginLeft: "4px" }}
            />
          )}
        </Shared.NameContainer>
        <Shared.BottomLine>
          {/* Logic to make presence indicator human-readable ("IN_A_CALL" vs. "In A Call") */}
          {prettyPresenceWithStatus(contact)}
        </Shared.BottomLine>
      </Shared.InfoContainer>
    </Shared.ItemBlock>
  );
};

export default React.memo(ContactBlock);
