// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C } from "components/utils/style-constants";

export const Button = styled.button`
  color: ${C.midbar.lowerButtonColor};
  border: ${C.transparentBorder};
  border-radius: 30px;
  background-color: ${C.midbar.lowerButtonBackground};
  width: 100%;
  padding: 6px 0px;
  margin-bottom: 5px;
  font-size: 12px;
  transition: 0.2s;
  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
  &:hover {
    cursor: pointer;
    background-clip: padding-box;
    border: ${C.hoverBorder};
    box-shadow: ${C.focusShadow};
  }
`;
