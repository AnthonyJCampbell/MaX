// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S } from "components/utils/style-constants";

interface IsAuthorProp {
  isAuthor: boolean;
}

export const MessageContainer = styled.div<IsAuthorProp>`
  box-sizing: border-box;
  width: 70%;
  max-width: ${S.rightbar.chatPaneContentMaxWidth};
  min-width: ${S.rightbar.chatPaneContentMinWidth};
  margin: 4px auto;
  display: flex;
  justify-content: ${(props) => (props.isAuthor === true ? "flex-end" : "flex-start")};
`;

export const AvatarPlaceholder = styled.div`
  width: 40px;
  height: 40px;
`;

export const MessageBubble = styled.div<IsAuthorProp>`
  max-width: 60%;
  background-color: ${(props) =>
    props.isAuthor === true ? C.rightbar.sentMessageColor : C.rightbar.receivedMessageColor};
  border-radius: 8px;
  padding: 4px 8px 4px 8px;
  font-size: ${S.rightbar.contentsFontSize};
  line-height: ${S.rightbar.lineHeight};
  word-wrap: break-word;
  white-space: pre-wrap;
`;

// The message text _must_ be explicitly selectable, so users can copy select
// and copy snippets of text they receive.
export const MessageText = styled.p`
  //Added this to make sure that if we have a link inside our Message Text the link will be able to select.
  & > a {
    user-select: text;
  }
`;

export const Time = styled.p`
  padding-top: 4px;
  font-size: ${S.midbar.blockTimeFontSize};
  color: ${C.smallColor};
  display: flex;
  justify-content: flex-start;
`;

export const MessageTimestamp = styled.div<IsAuthorProp>`
  padding: 2px 0 0 0;
  display: flex;
  justify-content: ${(props) => (props.isAuthor === true ? "flex-end" : "flex-start")};
`;
