// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled, { keyframes } from "styled-components";
import {
  primaryColour,
  Colors as C,
  Effects as E,
  zIndexes,
} from "components/utils/style-constants";

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const PopupContainer = styled.span`
  box-sizing: border-box;
  width: 294px;
  height: 84px;

  border-radius: 4px;
  box-shadow: 0px 2px 4px #00000050;
  padding: 4px 4px 4px 4px;

  position: fixed;
  bottom: 6px;
  left: 6px;
  z-index: ${zIndexes.unimplementedPopup};

  background: white;

  animation: ${fade} 0.5s linear;

  display: flex;
`;

export const ImageContainer = styled.span`
  box-sizing: border-box;
  height: 100%;
`;
export const Image = styled.img`
  box-sizing: border-box;
  height: 100%;
`;
export const TextContainer = styled.span`
  box-sizing: border-box;
  height: 100%;

  padding: 6px 4px 2px 4px;

  display: flex;
  flex-flow: column;
`;

export const BoldText = styled.span`
  box-sizing: border-box;
  width: 100%;
  font-weight: 900;
  font-size: 12px;
`;
export const NormalText = styled.span`
  box-sizing: border-box;
  width: 100%;
  font-size: 12px;

  padding-top: 6px;
`;
export const ButtonsContainer = styled.span`
  box-sizing: border-box;
  width: 100%;

  padding-top: 6px;

  display: flex;
  justify-content: space-between;
  button {
    color: ${primaryColour};
    font-weight: 700;
    font-size: 12px;
    border: none;
    padding: 0px 0px 0px 0px;

    transition: ${E.transition};
    &:focus {
      border: ${C.focusBorder};
      box-shadow: ${C.focusShadow};
    }
    &:hover {
      cursor: pointer;
      opacity: ${E.hoverOpacity};
    }
    &:active {
      cursor: pointer;
      opacity: ${E.activeOpacity};
    }
  }
`;

export const DismissButton = styled.span`
  box-sizing: border-box;
  padding-bottom: 10px; // TODO Remove when we add the details button
`;
export const DetailsButton = styled.span`
  box-sizing: border-box;
  // padding-right: 35px // TODO Add back in when we've added the details button
`;
