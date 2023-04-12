// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled, { keyframes } from "styled-components";
import { Sizes as S, Colors as C } from "components/utils/style-constants";

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Float = styled.p`
  opacity: 0;
  animation: ${fade} 0.05s linear;
  animation-delay: 0.1s;
  animation-fill-mode: forwards;
  border-radius: 6px;
  padding: 7px 10px;
  background-color: ${C.backgroundColor};
  font-size: ${S.rightbar.contentsFontSize};
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2);
`;
