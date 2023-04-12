// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns an Avatar (profile picture, maybe with a presence image overlaid).
 * If no contact, then just return a default.
 */

import React from "react";

import { setPresence } from "components/utils/common";

import * as S from "./styles";
import DefaultProfilePicture from "assets/shared/default-profile-picture.png";
import InitialsAvatar from "./initials-avatar/initials-avatar";
import { Contact } from "../../types";

// No logging, as it would be too spammy

export interface AvatarProps {
  /**
   * @param {Contact} contact - Optional, Contact whose presence and profile picture we want to render
   */
  contact?: Contact | null;

  /**
   * @param {boolean} showPresence - Whether to show presence for this avatar if the contact has one
   */
  showPresence?: boolean;
}

/**
 * Render a profile picture, maybe with a presence image overlaid
 */
const Avatar: React.FC<AvatarProps> = ({ contact, showPresence = true }) => {
  // If the contact has an avatar, use it; if not, create one based on their initials if possible or
  // a default image if they have no name, or there is no Contact.
  let avatar;
  if (contact?.identity?.profilePicture) {
    avatar = <S.ProfilePicture src={contact.identity.profilePicture} alt="" />;
  } else {
    if (contact?.identity?.firstName || contact?.identity?.lastName) {
      const { firstName, lastName } = contact.identity;
      avatar = <InitialsAvatar firstName={firstName} lastName={lastName} />;
    } else avatar = <S.ProfilePicture src={DefaultProfilePicture} alt="" />;
  }

  // If a contact, and has presence and this is an instance where we want to display presence with the
  // avatar, add a presence indicator; if not, display an empty div to centre the text
  const presence =
    contact?.presence && showPresence ? (
      <S.PresenceImage src={setPresence(contact.presence.state)} alt="" />
    ) : (
      <S.PresencePlaceholder />
    );

  return (
    <S.ImageContainer aria-hidden="true">
      {avatar}
      {presence}
    </S.ImageContainer>
  );
};

export default Avatar;
