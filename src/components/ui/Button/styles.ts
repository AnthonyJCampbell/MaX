// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors } from "components/utils/style-constants";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  bgVariant?: string;
  disabled?: boolean;
  width?: number;
  height?: number;
}

export const ButtonContainer = styled.button<ButtonProps>`
  align-items: center;
  border: ${Colors.transparentBorder};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  font-size: 12px;
  line-height: 16px;
  justify-content: center;
  padding: 8px;
  text-transform: uppercase;

  ${(props): string => {
    return props.bgVariant
      ? `background-color: ${props.bgVariant}`
      : `background-color: ${Colors.backgroundColor};`;
  }};

  ${(props): string =>
    props.disabled
      ? `color: ${Colors.button.disabledFontColor}; cursor:default;`
      : `color: ${Colors.button.fontColor}; cursor:pointer;`}

  ${(props): string => {
    return props.width ? `width: ${props.width}px` : "width: 100%";
  }};

  ${(props): string => {
    return props.height ? `height: ${props.height}px` : "height: 32px";
  }};

  &:hover:not(:disabled) {
    background-color: ${Colors.hoverColor};
    border: ${Colors.hoverBorder};
    box-shadow: ${Colors.focusShadow};
  }

  &:focus {
    background-color: ${Colors.backgroundColor};
    border: ${Colors.focusBorder};
    box-shadow: none;
  }

  &:active {
    background-color: ${Colors.activeColor};
    border: ${Colors.focusBorder};
    box-shadow: ${Colors.focusShadow};
  }

  svg {
    margin-right: 8px;
    margin-top: 2px;
  }
`;
