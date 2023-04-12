// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import styled from "styled-components";
import { Colors as C } from "components/utils/style-constants";

interface StyleTopButtonProps extends React.HTMLProps<HTMLButtonElement> {
  parent: string;
  altName: string;
  onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const interactionStyles = (props: StyleTopButtonProps): string => {
  if (props.disabled) {
    return "";
  } else {
    return `
    &:focus {
      cursor: pointer;
      border: ${props.parent === "default" ? C.focusBorder : C.whiteFocusBorder};
      box-shadow: ${props.parent === "default" ? C.focusShadow : C.whiteFocusShadow};
    }
    &:hover {
      cursor: pointer;
      transition: 0s;
      background-color: ${props.parent === "default" ? C.hoverColor : C.whiteHoverColor};
      border: ${props.parent === "default" ? C.hoverBorder : C.whiteHoverBorder};
      box-shadow: ${props.parent === "default" ? C.focusShadow : C.whiteFocusShadow};
    }
    &:active {
      cursor: pointer;
      background-color: ${props.parent === "default" ? C.activeColor : C.whiteActiveColor};
      border: ${props.parent === "default" ? C.focusBorder : C.whiteFocusBorder};
      box-shadow: ${props.parent === "default" ? C.focusShadow : C.whiteFocusShadow};
    }
    `;
  }
};

export const StyleTopButton = styled.button<StyleTopButtonProps>`
  border: ${C.transparentBorder};
  vertical-align: middle;
  transition: 0.2s;
  border-radius: 50%;
  margin: 1px;
  padding: 6px;
  opacity: ${(props): string => (props.disabled ? "0.5" : "1")};
  background-color: ${(props): string =>
    props.parent === "call" && props.altName === "Hang up" ? "white" : "inherit"};

  ${(props): string => interactionStyles(props)}

  img {
    display: flex;
    vertical-align: middle;
  }
`;

export const ButtonWrapper = styled.div`
  display: inline-block;
`;
