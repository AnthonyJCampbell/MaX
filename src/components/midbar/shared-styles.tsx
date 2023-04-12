// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import styled from "styled-components";
import { Colors as C, Effects as E, Sizes as S } from "components/utils/style-constants";

export const NoItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;

  padding: 30px;
  height: 100%;

  h1 {
    font-size: ${S.midbar.largeFontSize};
    font-weight: bold;
    color: ${C.midbar.contactGroupTitleColor};
    text-align: center;
    margin: 12px;
  }
`;

export const ItemBlock = styled.button`
  display: flex;
  align-items: center;
  margin: 2px 0px;
  width: 100%;
  border-radius: 5px;
  padding: 1px 1px 2px 7px;

  border: ${C.transparentBorder};
  text-align: left;
  min-height: 45px;

  transition: ${E.transition};
  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.midbar.blockFocusShadow};
  }
  &:hover {
    cursor: pointer;
    background-color: ${C.hoverColor};
    transition: 0s;
  }
  &:active {
    cursor: pointer;
    background-color: ${C.activeColor};
  }
`;

export const InfoContainer = styled.div`
  display: grid;
  padding: 2px;
  width: inherit;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  margin-right: 5px;

  img {
    margin-left: 5px;
  }
`;

interface NameProps extends React.HTMLProps<HTMLParagraphElement> {
  bold?: boolean;
}

export const Name = styled.p<NameProps>`
  font-size: ${S.midbar.largeFontSize};
  font-weight: ${(props): string => (props.bold ? "bold" : "normal")};
  color: ${C.midbar.blockNameColor};
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const TopLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
`;

export const Time = styled.time`
  min-width: 50px;
  font-size: ${S.midbar.blockTimeFontSize};
  color: ${C.smallColor};
  display: flex;
  justify-content: flex-end;
`;

export const BottomLine = styled.small`
  font-size: ${S.midbar.smallFontSize};
  color: ${C.smallColor};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const AttentionDot = styled.span`
  width: 10px;
  height: 10px;
  min-width: 10px;
  min-height: 10px;
  background-color: ${C.notificationDot};
  border: 1px solid white;

  object-fit: cover;
  border-radius: 50%;

  margin-top: 3px;
  margin-right: 3px;
`;
