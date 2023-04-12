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
  width: 600px;
  height: 240px;

  border-radius: 4px;
  box-shadow: 0px 2px 4px #00000050;
  padding: 4px;

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

  p,
  li {
    user-select: text;
  }

  button {
    color: ${primaryColour};
    border: none;
    font: inherit;

    padding: 0px;

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

export const ButtonsContainer = styled.span`
  box-sizing: border-box;
  width: 100%;

  padding: 10px 0px 0px 0px;

  display: flex;
  justify-content: space-between;
  button {
    color: ${primaryColour};
    font-weight: 700;
    font-size: 12px;
    border: none;
    padding: 0px;

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
  padding-bottom: 10px;
`;
