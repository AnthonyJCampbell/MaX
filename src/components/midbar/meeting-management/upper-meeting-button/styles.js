// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Effects as E } from "components/utils/style-constants";

export const Button = styled.button`
  width: 100%;
  border-radius: 10px;
  border: ${C.transparentBorder};
  background-color: ${C.backgroundColor};
  font-size: 13px;
  color: ${C.midbar.upperButtonColor};
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 4px;
  box-shadow: ${C.midbar.upperButtonBoxShadow};
  transition: ${E.transition};
  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
  &:hover {
    cursor: pointer;
    border: ${C.hoverBorder};
    box-shadow: ${C.focusShadow};
  }
`;
