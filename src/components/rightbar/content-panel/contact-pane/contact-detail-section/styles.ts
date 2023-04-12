// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Effects as E, Sizes as S } from "components/utils/style-constants";
import React from "react";

// Section Titles
export const SectionTitle = styled.h2`
  min-width: 60px;
  text-align: right;
  font-size: ${S.rightbar.sectionTitleFontSize};
  padding-right: 20px;
  padding-top: 8px;
  text-transform: capitalize;
  display: flex;
  justify-content: flex-end;
  text-transform: uppercase;
`;

// Section wrappers
export const BasicDetailSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: first baseline;
  color: ${C.rightbar.detailsFontColor};
  padding: 0px 22px;
`;

export const DetailSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: first baseline;
  color: ${C.rightbar.detailsFontColor};
  margin: 0px 22px 22px;
`;

// Section contents
export const BasicSectionContents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

interface SectionContentsProps extends React.HTMLProps<HTMLDivElement> {
  numRows: number;
}

export const SectionContents = styled.div<SectionContentsProps>`
  align-items: start;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(${(props) => props.numRows}, auto);
  margin-right: 15px;
`;

// Section details
export const Detail = styled.div`
  display: flex;
  align-items: top;
`;

export const PhoneDetail = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 2;
`;

const detailValue = `
  border: ${C.transparentBorder};
  border-radius: 2px;
  font: inherit;
  color: ${C.rightbar.detailsLinkColor};
  font-size: ${S.rightbar.contentsFontSize};
  font-weight: bold;
  padding: 5px 10px;
  margin-left: -12px;
  margin-right: 15px;
  transition: ${E.transition};
  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
  &:hover {
    cursor: pointer;
    border: ${C.hoverBorder};
  }
  &:active {
    cursor: pointer;
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
`;

export const DetailValueLink = styled.a`
  ${detailValue}
  text-decoration: none;
`;

export const DetailValueGrey = styled.p`
  color: ${C.rightbar.detailsTextColor};
  margin-right: 25px;
  padding-top: 7px;
  padding-bottom: 7px;
  font-size: ${S.rightbar.contentsFontSize};
`;

export const DetailParagraph = styled.p`
  font-size: 11px;
`;

export const DetailType = styled.p`
  font-size: 11px;
  height: 28px;
  display: flex;
  align-items: center;
`;

// History specific
export const HistoryImage = styled.img`
  padding-right: 5px;
`;

export const HistoryDateTime = styled.p`
  font-size: 11px;
  margin-left: 25px;
  display: flex;
  align-items: center;
  height: 28px;
`;

export const HistoryLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: ${S.rightbar.contentsFontSize};
  // Maximum width of the image + text
  width: 180px;
`;
