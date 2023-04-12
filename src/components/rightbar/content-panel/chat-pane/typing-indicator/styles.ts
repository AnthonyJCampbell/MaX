// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, primaryColour, Sizes as S } from "components/utils/style-constants";

export const TypingIndicator = styled.div`
  margin: 2px auto;
  display: flex;
  align-items: center;
  width: 70%;
  max-width: ${S.rightbar.chatPaneContentMaxWidth};
  min-width: ${S.rightbar.chatPaneContentMinWidth};
  min-height: 16px;

  span {
    width: 4px;
    height: 4px;
    background: ${primaryColour};
    border: 1px solid ${C.backgroundColor};
    box-shadow: 0 0 0 1px ${C.backgroundColor};
    float: left;
    margin: 0 2px;
    display: block;
    border-radius: 50%;
    animation: 1.5s blink infinite 0.5s;
  }
  span:nth-child(1) {
    animation-delay: 0s;
  }
  span:nth-child(2) {
    animation-delay: 0.5s;
  }
  span:nth-child(3) {
    animation-delay: 1s;
  }

  p {
    margin-left: 10px;
    font-family: sans-serif;
    color: #00000080;
    font-size: 12px;
  }

  @keyframes blink {
    0% {
      box-shadow: 0 0 0 1px #fff;
    }

    10% {
      box-shadow: 0 0 0 1px ${primaryColour};
    }

    100% {
      box-shadow: 0 0 0 1px #fff;
    }
  }
`;
