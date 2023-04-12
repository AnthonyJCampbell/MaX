// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C } from "components/utils/style-constants";

interface PanelContainerProps {
  dialPadVisible: boolean;
}

export const PanelContainer = styled.div<PanelContainerProps>`
  padding-left: 12px;
  padding-right: 12px;

  ${({ dialPadVisible }): string => (dialPadVisible ? "padding-top: 10px;" : "padding-top: 70px;")}
`;

export const LargeMeetingButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 8px;
`;

export const SmallMeetingButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const Message = styled.p`
  font-size: 9px;
  color: ${C.smallColor};
  line-height: 1.1;
  text-align: center;
  padding-top: 15px;
  padding-left: 25px;
  padding-right: 25px;
`;
