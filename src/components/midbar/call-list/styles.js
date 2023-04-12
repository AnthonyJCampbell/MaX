// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Effects as E } from "components/utils/style-constants";

export const VoicemailContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  max-height: 21px;
`;

export const VoicemailButton = styled.button`
  border: ${C.transparentBorder};
  background-color: ${C.midbar.background};
  padding-right: 9px;

  transition: ${E.transition};
  &:focus {
    img {
      border: ${C.focusBorder};
      border-radius: 10px;
      box-shadow: ${C.focusShadow};
      margin-right: -2px;
    }
  }
  &:hover {
    cursor: pointer;
    opacity: ${E.hoverOpacity};
  }
  &:active {
    cursor: pointer;
    opacity: ${E.activeOpacity};
  }
`;

export const VoicemailIcon = styled.img`
  height: 17px;
  width: auto;
`;

export const CallListContainer = styled.div`
  box-sizing: border-box;
  padding: 0;
  margin: 0;
`;
