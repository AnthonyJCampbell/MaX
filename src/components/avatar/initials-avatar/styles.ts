// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S, zIndexes } from "components/utils/style-constants";

const accountInitialsElementsSize = "40px";
const contactInitialsElementsSize = "32px";

interface HasSidebarProp {
  isSidebar: boolean;
}

export const InitialsAvatarBackground = styled.div<HasSidebarProp>`
  ${({ isSidebar }): string =>
    isSidebar
      ? `
  width: ${accountInitialsElementsSize};
  height: ${accountInitialsElementsSize};`
      : `
  width: ${contactInitialsElementsSize};
  height: ${contactInitialsElementsSize};`}

  background-color: ${C.midbar.defaultAvatarBackground};
  border: 1px solid white;

  object-fit: cover;
  border-radius: 50%;
  vertical-align: -100%;

  z-index: ${zIndexes.avatarBackground};
  position: relative;
`;

export const AvatarText = styled.p<HasSidebarProp>`
  ${({ isSidebar }): string =>
    isSidebar
      ? `
  font-size: ${S.avatar.accountInitialsFontSize};
  line-height: ${accountInitialsElementsSize};
  width: ${accountInitialsElementsSize};
  height: ${accountInitialsElementsSize};`
      : `
  font-size: ${S.avatar.contactInitialsFontSize};
  line-height: ${contactInitialsElementsSize};
  width: ${contactInitialsElementsSize};
  height: ${contactInitialsElementsSize};`}

  color: ${C.midbar.defaultAvatarForeground};
  text-align: center;
  font-weight: lighter;
`;
