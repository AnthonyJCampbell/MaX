// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a custom generated image to be used as an avatar for an account
 * in the sidebar or a contact elsewhere.
 */

import React from "react";

import * as S from "./styles";

interface Props {
  firstName: string;
  lastName: string;
  isSidebar?: boolean;
}

/**
 * Render a replacement for an avatar image, showing initials instead.
 *
 * Note: hide text from accessibility tech as the parent Avatar component has a
 * label.
 *
 * @param {string} firstName - The first name to be used for extracting the first initial.
 * @param {string} lastName - The last name to be used for extracting the second initial.
 * @param {boolean} isSidebar - Flag for deciding whether to use it in sidebar, since it has
 * a different styling.
 */
const InitialsAvatar: React.FC<Props> = ({ firstName, lastName, isSidebar = false }) => {
  let initials = "";
  if (firstName) initials += firstName.trim().charAt(0).toUpperCase();
  if (lastName) initials += lastName.trim().charAt(0).toUpperCase();

  return (
    <S.InitialsAvatarBackground aria-hidden="true" isSidebar={isSidebar}>
      <S.AvatarText isSidebar={isSidebar}>{initials}</S.AvatarText>
    </S.InitialsAvatarBackground>
  );
};

export default InitialsAvatar;
