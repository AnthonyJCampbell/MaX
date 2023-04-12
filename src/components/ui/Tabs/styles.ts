// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S } from "components/utils/style-constants";

export const TabContainer = styled.nav`
  border-bottom: 2px solid ${C.paneDividerColor};
  display: flex;
  padding-left: 6px;
`;

export const TabPlaceholder = styled.div`
  border-bottom: 2px solid ${C.paneDividerColor};
`;

interface TabButtonProps extends React.HTMLProps<HTMLButtonElement> {
  active: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 3px;
  margin-bottom: -2px;
  padding-top: 4px;
  padding-bottom: 6px;
  text-align: center;
  color: ${(props): string => (props.active ? "#2F78CA" : "#767676")};
  font-weight: ${(props): string => (props.active ? "bold" : "normal")};
  font-size: ${S.rightbar.ContentHeaderPanelButtonFontSize};
  border: ${C.transparentBorder};
  border-radius: 2px;
  border-bottom: ${(props): string =>
    props.active ? "2px solid #2F78CA" : `2px solid ${C.paneDividerColor}`};

  transition: 0.1s;
  &:focus {
    color: #2f78ca;
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
  &:hover {
    cursor: pointer;
    color: #2f78ca;
    border-bottom: 2px solid #2f78ca80;
  }
  &:active {
    cursor: pointer;
    color: #2f78ca;
    border-bottom: 2px solid #2f78ca;
  }
`;
