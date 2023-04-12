// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { primaryColour, Colors as C, Effects as E } from "components/utils/style-constants";

export const VariableText = styled.span`
  width: 20em;
  h1,
  li {
    user-select: text;
    font-weight: bold;
  }

  p {
    font-size: 80%;
    margin-top: 1em;
    line-height: 1.3em;
  }
`;

export const ButtonsContainer = styled.span`
  box-sizing: border-box;
  width: 100%;

  padding: 20px 0px 0px 0px;

  display: flex;
`;

export const Button = styled.button`
  color: ${(props) => (props.delete ? C.warningColor : primaryColour)};
  font-weight: bold;
  font-size: 80%;
  border: 2px solid white;
  padding: 4px 4px 4px 4px;
  margin-right: 1em;
  margin-left: -6px;
  box-sizing: border-box;

  transition: ${E.transition};
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
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
`;
