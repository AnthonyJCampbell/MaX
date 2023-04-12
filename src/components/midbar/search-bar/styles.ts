// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Sizes as S, Colors as C, Sizes, GridAreas } from "components/utils/style-constants";

interface SearchBarContainerProps {
  expanded: boolean;
}
export const SearchBarContainer = styled.div<SearchBarContainerProps>`
  grid-area: ${GridAreas.midbar.searchBar};

  box-sizing: border-box;
  min-width: 200px;
  width: 100%;
  display: flex;
  padding-left: 10px;

  height: ${({ expanded }): string =>
    expanded ? Sizes.midbar.searchBarExpandedHeight : Sizes.midbar.searchBarHeight};
`;

export const InputContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  border-radius: 8px;
  background-color: ${C.midbar.inputContainerBackground};
  border: ${C.transparentBorder};

  :focus-within {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
`;

export const InputContainerRow = styled.div`
  box-sizing: border-box;
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px 3px;

  * {
    margin: 0 4px;
  }

  img {
    width: 18px;
  }
`;

export const Input = styled.input`
  box-sizing: border-box;
  flex-grow: 1;

  border: none;
  padding: none;
  font-size: ${S.midbar.largeFontSize};
  min-width: 100px;
`;

export const CloseButton = styled.button`
  // Border is transparent so there's no jump in button-size when focused
  border: 2px solid transparent;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  margin-top: 1px;

  img {
    width: 10px;
    margin-left: -4px;
    margin-bottom: 2px;
  }

  &:hover {
    cursor: pointer;
    background-color: ${C.hoverColor};
  }

  &:focus {
    border: ${C.focusBorder};
    box-shadow: ${C.focusShadow};
  }
`;
