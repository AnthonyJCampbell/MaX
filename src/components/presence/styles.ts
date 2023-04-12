// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Effects as E, primaryColour } from "components/utils/style-constants";

export const Submenu = styled.ul`
  background-color: ${C.backgroundColor};
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  margin-left: -16px;
`;

export const MenuItem = styled.a`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  font-size: 12px;
  justify-content: left;
  padding: 4px 12px;
  min-width: 170px;
  width: 100%;

  transition: ${E.transition};

  &:focus {
    background-color: ${C.focusColor};
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

  p {
    display: flex;
  }

  img {
    margin-right: 8px;
    max-width: 14px;
    max-height: 14px;
  }
`;

export const CustomStatusContainer = styled.div`
  background-color: ${C.menu.inputBoxBackground};
  margin-left: 6px;
  margin-top: 4px;
  position: relative;
  max-width: 178px;
`;

export const TextAreaImage = styled.img`
  position: absolute;
  top: 8px;
  left: 7px;
`;

export const TextArea = styled.textarea`
  background-color: ${C.menu.inputBoxBackground};
  box-sizing: border-box;
  border: none;
  font-size: 12px;
  height: 45px;
  line-height: 1.2;
  margin-top: 4px;
  padding-left: 28px;
  resize: none;
  width: 99%;
`;

export const CustomStatusParagraph = styled.p`
  background-color: ${C.menu.inputBoxBackground};
  box-sizing: border-box;
  display: block;
  font-size: 12px;
  height: auto;
  line-height: 1.2;
  max-height: 64px;
  margin-bottom: 7px;
  padding-left: 28px;
  padding-top: 8px;
  overflow-y: auto;
  word-break: break-word;
  width: 99%;
`;

export const Wrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 5px 1px 0 1px;
  background: ${C.backgroundColor};
`;

export const ActionButton = styled.button`
  border: 2px solid transparent;
  color: ${primaryColour};
  font-weight: 700;
  font-size: 12px;
  padding: 2px 4px;

  transition: ${E.transition};

  &:first-child {
    margin-right: 2px;
  }

  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }

  &:hover {
    cursor: pointer;
    border: ${C.focusBorder};
  }

  &:active {
    cursor: pointer;
  }

  &:disabled {
    cursor: default;
    opacity: ${E.hoverOpacity};
    border: 2px solid transparent;
  }
`;

interface HasEnablingProp {
  isEnabled: boolean;
}

export const CharacterCount = styled.span<HasEnablingProp>`
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
  margin-right: 8px;
  text-align: right;
  width: 24px;
  color: ${(props): string => (props.isEnabled ? C.smallColor : C.warningColor)};
`;
