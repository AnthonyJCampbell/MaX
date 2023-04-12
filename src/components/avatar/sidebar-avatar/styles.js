// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import {
  Colors as C,
  Effects as E,
  primaryColour,
  zIndexes,
} from "components/utils/style-constants";

export const SideBarPictureContainer = styled.button`
  width: 50px;
  height: 50px;
  border: ${C.transparentBorder};
  display: flex;
  border-radius: 50%;
  padding: 2px;

  transition: ${E.transition};
  &:focus {
    border: ${C.whiteFocusBorder};
    box-shadow: ${C.whiteFocusShadow};
  }
  &:hover {
    cursor: pointer;
    box-shadow: ${C.whiteFocusShadow};
    border: ${C.whiteHoverBorder};
  }
  &:active {
    cursor: pointer;
    border: ${C.whiteFocusBorder};
    box-shadow: ${C.whiteFocusShadow};
    opacity: 0.7;
  }
`;

export const SidebarPresenceIcon = styled.img`
  width: 13px;
  height: 13px;
`;

export const SidebarPresenceBorder = styled.div`
  width: 13px;
  height: 13px;

  position: relative;
  top: 28px;
  right: 15px;
  z-index: 2;

  border-radius: 50%;
  border: 2px solid ${primaryColour};
  background-color: ${primaryColour};
`;

export const SidebarPicture = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
`;

export const SidebarCustomStatusIcon = styled.img`
  width: 12px;
  height: 12px;
`;

export const SidebarCustomStatusBorder = styled.div`
  width: 12px;
  height: 12px;

  position: relative;
  top: 16px;
  right: 24px;
  z-index: 3;

  border-radius: 50%;
  border: 2px solid ${primaryColour};
  background-color: ${primaryColour};
`;

export const SidebarPresencePlaceholder = styled.div`
  min-width: 15px;
  min-height: 15px;
  object-fit: cover;
  border-radius: 50%;
  border: ${C.transparentBorder};
  margin-right: -5px;
  vertical-align: -110%;
  z-index: ${zIndexes.avatarPresenceIcon};
  position: relative;
  top: 28px;
  right: 12px;
`;
