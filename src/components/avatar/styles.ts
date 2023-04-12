// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { zIndexes } from "../utils/style-constants";

export const ImageContainer = styled.div`
  position: relative;
  display: flex;
  margin-right: -2px;
`;

export const ProfilePicture = styled.img`
  width: 34px;
  height: 34px;

  object-fit: cover;
  border-radius: 50%;
  vertical-align: -110%;
  z-index: ${zIndexes.avatarBackground}
  position: relative;
`;

export const PresenceImage = styled.img`
  width: 12px;
  height: 12px;
  object-fit: cover;
  border-radius: 50%;

  margin-right: -5px;
  vertical-align: -110%;
  z-index: ${zIndexes.avatarPresenceIcon};
  position: relative;
  top: 23px;
  right: 10px;
`;

export const PresencePlaceholder = styled.div`
  padding-right: 7px;
`;
