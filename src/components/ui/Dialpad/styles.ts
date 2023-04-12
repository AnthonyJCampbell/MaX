// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";

interface DialpadContainerProps {
  margin?: string;
  gridArea?: string;
}

export const DialpadContainer = styled.div<DialpadContainerProps>`
  ${({ gridArea }): string | undefined => gridArea && `grid-area: ${gridArea};`}
  ${({ margin }): string | undefined => margin && `margin: ${margin};`}
`;

export const DialpadGridContainer = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: repeat(5, auto);
  grid-gap: 4px;
  margin-bottom: 8px;
`;

export const DialpadButtonContainer = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 4px;
  margin-bottom: 8px;
`;
