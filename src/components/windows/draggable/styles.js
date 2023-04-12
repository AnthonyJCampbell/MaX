// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";

export const Wrapper = styled.span`
  width: 100%;
  -webkit-app-region: ${(props) => (props.enabled ? "drag" : "no-drag")};
`;
