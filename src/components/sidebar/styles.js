// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Effects as E, GridAreas } from "components/utils/style-constants";

export const Sidebar = styled.nav`
  grid-area: ${GridAreas.mainWindow.sidebar};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${C.sidebar.background};
  justify-content: space-between;
  padding: 8px;
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AddButton = styled.button`
  height: 42px;
  width: 42px;
  margin: 2vh 0;
  border: ${C.transparentBorder};
  border-radius: 50%;
  padding: 2px;

  transition: margin 0s, background-color ${E.transition}, box-shadow ${E.transition};
  &:focus {
    border: ${C.whiteFocusBorder};
    box-shadow: ${C.whiteFocusShadow};
  }
  &:hover {
    cursor: pointer;
    box-shadow: ${C.whiteFocusShadow};
    border: ${C.whiteHoverBorder};
  }
  &:active {
    cursor: pointer;
    border: ${C.whiteFocusBorder};
    box-shadow: ${C.whiteFocusShadow};
    opacity: 0.7;
  }

  img {
    width: 34px;
    height: 34px;
  }
`;

export const ButtonDivider = styled.div`
  height: 0;
  width: 49px;
  margin: 8px 0;
  border-bottom: 1px solid ${C.sidebar.accentColor};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    margin: 0.5vh 0;
    width: 44px;
    height: 44px;
    border: ${C.transparentBorder};
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    transition: margin 0s, border ${E.transition}, box-shadow ${E.transition};
    &:focus {
      border: ${C.whiteFocusBorder};
      box-shadow: ${C.whiteFocusShadow};
    }
    &:hover {
      cursor: pointer;
      background-color: ${C.whiteHoverColor};
      border: ${C.whiteHoverBorder};
      box-shadow: ${C.whiteFocusShadow};
    }
    &:active {
      cursor: pointer;
      background-color: ${C.whiteActiveColor};
      border: ${C.whiteFocusBorder};
      box-shadow: ${C.whiteFocusShadow};
    }
  }
`;

export const Notification = styled.p`
  font-size: 11px;
  color: white;
  font-weight: bold;
  border: 4px solid ${C.sidebar.background};
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: ${C.notificationDot};
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -7px;
  right: -7px;
`;
