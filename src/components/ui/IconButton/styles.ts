// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import styled from "styled-components";
import { Colors as C } from "components/utils/style-constants";
import { IconButtonVariant } from "./types";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  width?: string;
  height?: string;
  variant?: IconButtonVariant;
  hoverBackground?: string;
}

const getButtonStyle = (variant?: IconButtonVariant): string => {
  switch (variant) {
    case IconButtonVariant.white:
      return `
        background-color: ${C.backgroundColor};
      `;
    case IconButtonVariant.gray:
      return `background-color: ${C.midbar.background};`;
    case IconButtonVariant.transparent:
    default:
      return `
        background-color: transparent;
      `;
  }
};

export const Button = styled.button<ButtonProps>`
  ${({ width }): string => (width ? `width: ${width};` : "width: inherit;")}
  ${({ height }): string => (height ? `height: ${height};` : "height: inherit;")}
  border: ${C.transparentBorder};

  ${({ variant }): string => getButtonStyle(variant)}

  ${({ variant }): string =>
    variant === IconButtonVariant.transparent ? "border-radius: 50%;" : "border-radius: 8px;"}
  
  &:not(:disabled) {
    cursor: pointer;
  }

  &:active:not(:disabled) {
    background-color: ${C.activeColor};
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }

  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }

  &:hover:not(:disabled) {
    transition: 0s;
    border: ${C.hoverBorder};
    box-shadow: ${C.focusShadow};

    ${({ hoverBackground }): string =>
      hoverBackground
        ? `background-color: ${hoverBackground};`
        : `background-color: ${C.hoverColor};`}
  }
`;
