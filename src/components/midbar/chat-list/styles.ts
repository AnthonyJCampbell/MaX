// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S } from "components/utils/style-constants";

export const PanelContainer = styled.div`
  height: 100%;
  padding-top: 100px;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;

  h1 {
    font-size: ${S.midbar.largeFontSize};
    font-weight: bold;
    color: ${C.midbar.contactGroupTitleColor};
    text-align: center;
    margin: 12px;
  }

  p {
    font-size: ${S.midbar.smallFontSize};
    color: ${C.smallColor};
    text-align: center;
    line-height: 16px;
    padding-bottom: 20px;
  }
`;

export const Button = styled.button`
  color: ${C.midbar.lowerButtonColor};
  border: ${C.transparentBorder};
  border-radius: 30px;
  background-color: ${C.midbar.lowerButtonBackground};
  width: 100%;
  padding: 6px 0px;
  margin-bottom: 5px;
  font-size: 12px;
  transition: 0.2s;
  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
  &:hover {
    cursor: pointer;
    background-clip: padding-box;
    border: ${C.hoverBorder};
    box-shadow: ${C.focusShadow};
  }
`;

export const ChatListContainer = styled.div`
  box-sizing: border-box;
`;
