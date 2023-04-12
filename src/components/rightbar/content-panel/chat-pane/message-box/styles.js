// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S } from "components/utils/style-constants";

export const InputContainer = styled.div`
  box-sizing: border-box;
  width: 70%;
  max-width: ${S.rightbar.chatPaneContentMaxWidth};
  min-width: ${S.rightbar.chatPaneContentMinWidth};
  margin: 5px auto 5px auto;
  min-height: 55px;
  background-color: ${C.backgroundColor};
  border: 2px solid ${C.paneDividerColor};
  box-shadow: 0px 0 0 5px ${C.backgroundColor};
  border-radius: 8px;
  padding: 5px 12px;
  display: flex;
  align-items: center;
`;

export const InputTextbox = styled.div`
  box-sizing: border-box;
  width: 100%;

  display: flex;
  flex-flow: column;

  textarea {
    border: none;
    padding: 4px 4px 4px 0px;
    margin-left: 20px;
    font: inherit;
    font-size: ${S.rightbar.contentsFontSize};
    resize: none;
    line-height: ${S.rightbar.lineHeight};
  }
`;
export const Hint = styled.div`
  font-size: 10px;
  padding-left: 20px;
  margin-bottom: 8px;
  min-height: 10px;

  pre {
    color: ${C.smallColor};
  }
`;

export const ButtonContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  button {
    background-color: inherit;
    border: ${C.transparentBorder};
    border-radius: 50%;
    height: 30px;
    width: 30px;
    padding: 4px;
    margin: 3px;

    transition: 0.1s;
    &:focus {
      border: ${C.focusBorder};
      box-shadow: ${C.focusShadow};
    }
    &:hover {
      cursor: pointer;
      background-color: ${C.hoverColor};
    }
    &:active {
      cursor: pointer;
      background-color: ${C.activeColor};
    }
  }
`;

export const MsgMenuToggle = styled.div`
  box-sizing: border-box;
  display: flex;
  align-self: center;
  width: 26px;
`;

export const WhiteBgWrapper = styled.div`
  background-color: ${C.backgroundColor};
  padding: 200px 50px;
`;
