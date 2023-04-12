// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import styled from "styled-components";
import { Sizes as S, Colors as C, zIndexes, GridAreas } from "components/utils/style-constants";

interface ContentHeaderPanelProps extends React.HTMLProps<HTMLDivElement> {
  panel: string;
}

export const ContentHeaderPanel = styled.header<ContentHeaderPanelProps>`
  grid-area: ${GridAreas.rightbar.contentHeaderPanel};
  box-sizing: border-box;
  border-bottom: ${C.paneDividerColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px 15px 20px;
  color: ${(props): string =>
    props.panel === "default"
      ? `${C.rightbar.ContentHeaderPanelFontColor}`
      : `${C.rightbar.InCallHeaderPanelFontColor}`};
  background-color: ${(props): string =>
    props.panel === "default"
      ? `${C.backgroundColor}`
      : `${C.rightbar.InCallHeaderPanelBackgroundColor}`};
  min-width: ${S.inCallWindow.width};
  width: 100%;
  height: ${S.rightbar.ContentHeaderPanelHeight};
  position: relative;
`;

export const ContentHeaderPanelDisableOverlay = styled.div`
  width: 100%;
  height: ${S.rightbar.ContentHeaderPanelHeight};
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${zIndexes.contentHeaderPanel + 1};
  background-color: rgba(255, 255, 255, 0.7);
`;

export const ButtonContainer = styled.div`
  display: flex;
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

export const BasicInfo = styled.div`
  margin-left: 5px;
  padding-bottom: 2px;
  min-width: 0;
  h1,
  p {
    user-select: text;
  }
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: end;
  min-width: 0;

  h1 {
    font-size: ${S.rightbar.ContentHeaderPanelFontSize};
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: ${S.rightbar.lineHeight};
  }
  button {
    margin-left: 5px;
    padding: 1px;
  }
`;

export const LowerDetail = styled.p`
  font-size: ${S.rightbar.ContentHeaderPanelPresenceFontSize};
  line-height: ${S.rightbar.ContentHeaderPanelPresenceLineHeight};
  font-weight: normal;
  overflow: hidden;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const StorybookMinWidthWrapper = styled.div`
  margin: 0;
  padding: 0;
  width: ${S.rightbar.minWidth};
  overflow: hidden;
`;
