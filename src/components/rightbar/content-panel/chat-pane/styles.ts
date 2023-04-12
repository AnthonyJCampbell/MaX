// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { GridAreas } from "../../../utils/style-constants";

export const ChatPane = styled.div`
  grid-area: ${GridAreas.rightbar.contentPanel};
  overflow: hidden;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr min-content;
  grid-template-areas:
    "chatMessages"
    "messageBox";
`;

export const ChatContainer = styled.div`
  grid-area: chatMessages;
  align-self: stretch;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-top: 5px;

  display: flex;
  flex-direction: column;

  p {
    user-select: text;
  }
`;

export const BottomElement = styled.div``;

export const Wrapper = styled.div``;

export const StorybookWrapper = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "${GridAreas.rightbar.contentPanel}";
`;
