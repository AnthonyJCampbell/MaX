// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors } from "components/utils/style-constants";

export const DialpadButtonContainer = styled.button`
  align-items: center;
  background-color: ${Colors.backgroundColor};
  border: ${Colors.whiteFocusBorder};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 36px;

  &:hover {
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
`;

export const DialpadButtonText = styled.span`
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
`;

export const DialpadButtonAlternativeText = styled.span`
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
`;
