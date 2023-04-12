// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Effects as E } from "components/utils/style-constants";

export const Menu = styled.ul`
  background-color: ${C.backgroundColor};
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  margin-left: -16px;
  padding: 6px 0;
  position: absolute;
  bottom: 36px;
  z-index: 100;
`;

export const MenuTitle = styled.p`
  padding: 4px 12px 10px;
  font-size: 12px;
  font-weight: bold;
  color: #000000b3;
  text-align: left;
`;

export const MenuItem = styled.li`
  list-style: none;
`;

export const MenuItemLink = styled.a`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  font-size: 12px;
  justify-content: left;
  padding: 0px 12px;
  min-height: 25px;
  min-width: 250px;
  width: 100%;

  transition: ${E.transition};

  &:focus {
    background-color: ${C.focusColor};
  }

  &:hover {
    cursor: pointer;
    background-color: ${C.hoverColor};
    transition: 0s;
  }

  &:active {
    cursor: pointer;
    background-color: ${C.activeColor};
  }

  img {
    margin-right: 8px;
  }
`;

interface MenuButtonProps {
  size?: string;
  padding?: string;
  bgColor?: string;
  hasIconAndLabel: boolean;
}
export const MenuButton = styled.button<MenuButtonProps>`
  box-sizing: border-box;
  align-items: center;
  position: relative;
  width: ${({ size }): string => size || "100%"};
  height: ${({ size }): string => size || "100%"};
  background-color: ${({ bgColor }): string => bgColor || "inherit"};
  border: none;
  display: flex;
  padding: ${({ padding }): string => padding || "0"};

  transition: 0.1s;
  &:focus {
    outline: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
  &:hover {
    cursor: pointer;
    background-color: ${C.hoverColor};
  }
  &:active {
    cursor: pointer;
    background-color: ${C.activeColor};
  }

  ${({ hasIconAndLabel }): string | undefined =>
    hasIconAndLabel ? `& > img { margin-right: 8px; }` : undefined}
`;

export const WhiteBgWrapper = styled.div`
  background-color: ${C.backgroundColor};
  padding: 200px 50px;
`;

export const RelativeWrapper = styled.div`
  background-color: ${C.backgroundColor};
  padding: 100px 50px;
  position: relative;
`;
