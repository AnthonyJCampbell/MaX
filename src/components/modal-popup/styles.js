// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled, { keyframes } from "styled-components";
import { zIndexes } from "components/utils/style-constants";

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const PopupContainer = styled.span`
  box-sizing: border-box;

  border-radius: 4px;
  box-shadow: 0px 2px 4px #00000050;
  padding: 4px;

  position: fixed;
  top: 50%;
  left: 50vw;
  transform: translate(-50%, -50%);

  z-index: ${zIndexes.unimplementedPopup};

  background: white;

  animation: ${fade} 0.5s linear;

  display: flex;
`;

export const Background = styled.div`
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndexes.unimplementedPopup};
`;

export const ContentContainer = styled.span`
  box-sizing: border-box;
  height: 100%;

  padding: 20px;

  display: flex;
  flex-flow: column;

  p,
  li {
    user-select: text;
  }
`;
