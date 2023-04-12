// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C } from "components/utils/style-constants";

export const HistoryDetails = styled.div`
  display: flex;
  align-items: inherit;

  img {
    padding-right: 2px;
  }
`;

export const AttentionDot = styled.div`
  width: 10px;
  height: 10px;
  min-width: 10px;
  min-height: 10px;
  background-color: ${C.midbar.defaultAvatarBackground};
  border: 1px solid white;

  object-fit: cover;
  border-radius: 50%;

  margin-top: 3px;
  margin-right: 2px;
`;

export const BoldName = styled.p`
  font-weight: bold;
`;

export const Call = styled.div`
  display: flex;
`;
