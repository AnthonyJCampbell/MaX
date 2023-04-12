// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Effects as E, Colors as C } from "components/utils/style-constants";

export const Menu = styled.div`
  border-radius: 5px;
  background-color: ${C.backgroundColor};
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export const Section = styled.div`
  border-bottom: ${(props) => (props.border ? `1px solid #c1c1c1` : "none")};
  padding: 12px 0 8px;
`;

export const Title = styled.p`
  font-weight: bold;
  padding: 0px 12px 10px;
  color: #000000b3;
`;

export const DisplayName = styled.p`
  font-weight: bold;
  padding: 0px 12px 7px;
  font-size: 14px;
  color: #000000;
`;

export const AccountNumber = styled.p`
  padding: 0px 12px 4px;
  color: #000000;
`;

function buttonInteractionStyles(props) {
  if (props.disabled) {
    return "";
  } else {
    return `
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
    `;
  }
}

export const MenuItemButton = styled.button`
  padding: 4px 12px;
  display: flex;
  min-width: 190px;
  width: 100%;
  align-items: center;
  justify-content: left;
  border: none;
  width: 100%;
  font-size: 12px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};

  transition: ${E.transition};

  ${(props) => buttonInteractionStyles(props)}

  p {
    display: flex;
  }

  img {
    margin-right: 8px;
    padding-top: 1px;
    max-width: 14px;
    max-height: 14px;
  }
`;

export const PresenceButton = styled.div`
  border-radius: 50%;
  margin-right: 8px;
  width: 14px;
  height: 14px;

  background-color: ${(props) => (props.color ? props.color : "#eee")};
`;

export const PresenceDisclosure = styled.img`
  margin: 0;
  margin-left: auto;
  padding-top: 0;
`;

export const TextAndDetail = styled.div`
  display: flex;
  color: #000000de;
`;

export const Text = styled.p`
  color: ${(props) => (props.color ? props.color : C.textColor)};
`;

export const Detail = styled.p`
  color: #000000a6;
  margin-left: 3px;
  display: inline-block;
`;

export const Box = styled.span`
  width: 13px;
  margin-right: 8px;
  padding-top: 2px;
  opacity: ${(props) => (props.activeButton === props.thisButton ? `1` : `0`)};
  img {
    padding-bottom: 2px;
  }
`;

export const MenuItemSlider = styled.input`
  -webkit-appearance: none;
  width: 85%;
  height: 1px;
  background-color: #c1c1c1;
  border-radius: 10%;
  outline: none;
  margin-left: 7.5%;

  &:hover {
    cursor: pointer;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    border: 2px solid #d0d0d0;
    background-color: ${C.backgroundColor};
    border-radius: 50%;
  }
`;
