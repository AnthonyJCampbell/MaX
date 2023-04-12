// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, GridAreas, Sizes as S } from "components/utils/style-constants";
import { ButtonProps } from "components/ui/IconButton/styles";

interface BannerProps {
  bgColor?: string;
  fontColor?: string;
  fontSize?: string;
  hasDimissFn?: boolean;
}

export const Banner = styled.div<BannerProps>`
  grid-area: ${GridAreas.mainWindow.notificationBanner};
  box-sizing: border-box;

  display: grid;
  grid-template-columns: auto 30px;
  grid-template-row: 1fr;
  align-items: center;
  padding: 2px 8px 2px 15px;

  ${({ hasDimissFn }): string =>
    hasDimissFn ? `grid-template-columns: auto 30px;` : `grid-template-columns: auto;`}

  ${({ bgColor }): string =>
    bgColor ? `background-color: ${bgColor};` : `background-color: ${C.banner.background};`}
    
  > p {
    padding: 8px 0;
    marging: 0;

    ${({ fontColor }): string => (fontColor ? `color: ${fontColor};` : `color: inherit;`)}

    ${({ fontSize }): string =>
      fontSize ? `font-size: ${fontSize};` : `font-size: ${S.banner.defaultFontSize};`}
  }
`;

interface DismissButtonProps extends ButtonProps {
  fillColor?: string;
}

export const DismissButton = styled.button<DismissButtonProps>`
  border: ${C.banner.transparentBorder};
  justify-self: end;
  align-self: center;
  transition: 0.2s;
  border-radius: 100%;
  cursor: pointer;
  padding: 5px;

  &:focus {
    border: ${C.banner.activeBorder};
  }
  &:hover {
    transition: 0s;
    border: ${C.banner.transparentBorder};

    ${({ hoverBackground }): string =>
      hoverBackground
        ? `background-color: ${hoverBackground};`
        : `background-color: ${C.banner.hoverColor};`}
  }
  &:active {
    background-color: ${C.banner.hoverColor};
    border: ${C.banner.activeBorder};
  }

  svg {
    display: flex;
    vertical-align: middle;
  }
`;

export const DNDBanner = styled.div`
  grid-column: 2 / span 2;
  grid-row: 1;

  display: flex;
  vertical-align: middle;
  justify-content: space-between;
  background-color: ${C.banner.background};
  font-size: ${S.banner.defaultFontSize};
`;

export const DNDText = styled.div`
  display: flex;
  vertical-align: middle;
  margin: 10px 15px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  padding: 0px 5px;
`;

export const DndDismissButton = styled.button`
  border: ${C.banner.transparentBorder};
  vertical-align: middle;
  transition: 0.2s;
  border-radius: 100%;
  margin: 2px;

  &:focus {
    cursor: pointer;
    border: ${C.banner.activeBorder};
  }
  &:hover {
    cursor: pointer;
    transition: 0s;
    background-color: ${C.banner.hoverColor};
    border: ${C.banner.transparentBorder};
  }
  &:active {
    cursor: pointer;
    background-color: ${C.banner.hoverColor};
    border: ${C.banner.activeBorder};
  }

  img {
    display: flex;
    vertical-align: middle;
  }
`;
