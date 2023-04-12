// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Sizes as S, Colors as C, GridAreas } from "components/utils/style-constants";

/**
 * Calculating height based on whether the Tabs section, or the Add as a contact button
 * above the Pane will be shown
 */

export const ContactPane = styled.div`
  width: 70%;
  max-width: ${S.rightbar.chatPaneContentMaxWidth};
  min-width: ${S.rightbar.chatPaneContentMinWidth};
  margin: 0 auto;
`;

export const PaddingWrapper = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;

  time,
  h2,
  p,
  span {
    user-select: text;
  }
`;

export const BasicPaddingWrapper = styled.div`
  padding-bottom: 22px;
`;

export const ContactPaneWrapper = styled.div`
  grid-area: ${GridAreas.rightbar.contentPanel};
  align-self: stretch;

  overflow-y: scroll;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AddAsAContactButton = styled.button`
  color: ${C.midbar.lowerButtonColor};
  border: ${C.transparentBorder};
  border-radius: 30px;
  background-color: ${C.midbar.lowerButtonBackground};
  width: 200px;
  padding: 6px 0px;
  margin-top: 20px;
  margin-bottom: -2px;
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
