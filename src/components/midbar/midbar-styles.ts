// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors, GridAreas, Sizes } from "components/utils/style-constants";

interface MidbarProps {
  dialpadVisible: boolean;
}

export const Midbar = styled.section<MidbarProps>`
  grid-area: ${GridAreas.mainWindow.midbar};

  box-sizing: border-box;
  border-right: 2px solid ${Colors.paneDividerColor};
  background-color: ${Colors.midbar.background};
  padding-top: 20px;
  height: 100%;

  display: grid;
  column-gap: 7px;
  row-gap: 11px;
  grid-template-columns: auto calc(
      ${Sizes.midbar.dialpadButtonSize} + ${Sizes.midbar.searchBarContainerPadding} - 2px
    );

  ${({ dialpadVisible }): string => {
    if (dialpadVisible) {
      return `
        grid-template-rows: ${Sizes.midbar.searchBarHeight} 200px auto;
        grid-template-areas:
          "${GridAreas.midbar.searchBar} ${GridAreas.midbar.dialpadButton}"
          "${GridAreas.midbar.dialpad} ${GridAreas.midbar.dialpad}"
          "${GridAreas.midbar.content} ${GridAreas.midbar.content}";
      `;
    }

    return `
      grid-template-rows: min-content auto;
      grid-template-areas:
        "${GridAreas.midbar.searchBar} ${GridAreas.midbar.dialpadButton}"
        "${GridAreas.midbar.content} ${GridAreas.midbar.content}";
    `;
  }}
`;

export const MidbarContent = styled.section`
  padding: 0 6px;
  margin: 10px 0 0;
  box-sizing: border-box;
  grid-area: ${GridAreas.midbar.content};
  align-self: stretch;
  overflow-y: auto;
  overflow-x: hidden;
  ::-webkit-scrollbar-thumb {
    border: 3px solid ${Colors.midbar.background};
  }
`;

export const MinWidthStorybookWrapper = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: ${Sizes.midbar.minWidth};
`;

export const MaxWidthStorybookWrapper = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: ${Sizes.midbar.maxWidth};
`;

export const StorybookWrapper = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "${GridAreas.mainWindow.midbar}";
`;
