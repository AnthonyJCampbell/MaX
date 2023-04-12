// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { GridAreas } from "../utils/style-constants";

export const RightBar = styled.main`
  grid-area: ${GridAreas.mainWindow.rightbar};

  overflow: hidden;
  min-width: 500px;
  background-color: white;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content 1fr;
  grid-template-areas:
    "${GridAreas.rightbar.contentHeaderPanel}"
    "${GridAreas.rightbar.tabs}"
    "${GridAreas.rightbar.contentPanel}";
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
  grid-template-areas: "${GridAreas.mainWindow.rightbar}";
`;
