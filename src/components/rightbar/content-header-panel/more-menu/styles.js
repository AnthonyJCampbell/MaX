// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Effects as E, Colors as C } from "components/utils/style-constants";

export const MenuButton = styled.button`
  align-items: center;
  border: none;
  display: flex;
  font-size: 12px;
  justify-content: left;
  padding: 4px 12px;
  min-width: 190px;
  width: 100%;
  transition: ${E.transition};

  svg {
    margin-right: 8px;
  }

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
