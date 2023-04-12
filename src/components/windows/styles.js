// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Sizes, primaryColour, GridAreas } from "components/utils/style-constants";

export const MainWindow = styled.div`
  margin: 0;
  padding: 0;
  min-width: ${Sizes.mainWindow.minWidth};
  width: 100hw;
  height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-columns:
    ${Sizes.sidebar.width} minmax(${Sizes.midbar.minWidth}, ${Sizes.midbar.maxWidth})
    minmax(${Sizes.rightbar.minWidth}, auto);
  grid-template-rows: 1fr minmax(480px, 100vh);
  grid-template-areas:
    "${GridAreas
      .mainWindow.sidebar} ${GridAreas.mainWindow.notificationBanner} ${GridAreas.mainWindow.notificationBanner}"
    "${GridAreas.mainWindow.sidebar} ${GridAreas.mainWindow.midbar} ${GridAreas.mainWindow
      .rightbar}";
`;

export const IncomingCallWindow = styled.div`
  display: flex;
`;

export const InCallWindow = styled.div`
  display: flex;
`;

export const StartupScreen = styled.main`
  background-color: ${primaryColour};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const StartupText = styled.h1`
  font-size: 14px;
  color: white;
  position: absolute;
  bottom: 50px;
`;

export const StorybookMinWidthWrapper = styled.div`
  margin: 0;
  padding: 0;
  width: ${Sizes.mainWindow.minWidth};
  overflow: hidden;
`;
