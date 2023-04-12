// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S } from "components/utils/style-constants";

export const Background = styled.main`
  display: flex;
  flex-direction: row;
  background-color: ${C.sidebar.background};
  width: 100%;
  height: 75px;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 5px;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 5px;
  align-items: center;
`;

export const ProfilePicture = styled.img`
  width: 40px;
  height: 40px;

  object-fit: cover;
  border-radius: 50%;
  vertical-align: -110%;

  margin-left: 5px;
  margin-right: 5px;
`;

export const StyleButton = styled.button`
  border: ${C.transparentBorder};
  vertical-align: middle;
  transition: 0.2s;
  border-radius: 50%;
  padding: 6px;
  background-color: white;
  margin-right: 5px;
  margin-left: 5px;
  -webkit-app-region: no-drag;

  &:focus {
    cursor: pointer;
    border: ${C.whiteFocusBorder};
    box-shadow: ${C.whiteFocusShadow};
  }
  &:hover {
    cursor: pointer;
    transition: 0s;
    background-color: ${C.whiteHoverColor};
  }
  &:active {
    cursor: pointer;
    background-color: ${C.whiteActiveColor};
  }

  img {
    display: flex;
    vertical-align: middle;
  }
`;

export const UpperDetails = styled.h1`
  font-size: ${S.rightbar.ContentHeaderPanelFontSize};
  font-weight: bold;
  color: ${C.rightbar.InCallHeaderPanelFontColor};
  margin-bottom: 3px;
`;

export const LowerDetails = styled.p`
  font-size: ${S.rightbar.ContentHeaderPanelPresenceFontSize};
  font-weight: normal;
  color: ${C.rightbar.InCallHeaderPanelFontColor};
`;
