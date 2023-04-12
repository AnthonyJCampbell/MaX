// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S } from "components/utils/style-constants";

interface IsNewProp {
  isNew: boolean;
}

interface IsSwitchedProp {
  isSwitched: boolean;
}

export const ChatHeader = styled.div<IsSwitchedProp>`
  display: flex;
  justify-content: center;
  padding: 10px 0 10px 0;
  position: ${(props) => (props.isSwitched ? `` : `sticky`)};
  top: 0;
`;

export const ChatHeaderText = styled.p<IsNewProp>`
  font-size: ${S.rightbar.smallContentFontSize};
  color: ${(props) =>
    props.isNew ? `${C.rightbar.detailsLinkColor}` : `${C.rightbar.detailsFontColor}`};
  display: flex;
  justify-content: center;
  border-radius: 6px;
  background-color: ${C.rightbar.separatorColor};
  padding: 7px 10px;
  font-weight: ${(props) => (props.isNew ? "bold" : "normal")};
`;
