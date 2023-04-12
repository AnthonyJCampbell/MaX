// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import styled from "styled-components";
import { Colors as C, Sizes as S } from "components/utils/style-constants";

export const FavouritesTitle = styled.h2`
  color: ${C.smallColor};
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  margin: 0 0 8px 12px;

  svg {
    margin-right: 4px;
    vertical-align: inherit;
  }
`;

export const ContactGroupTitle = styled.h2`
  color: ${C.midbar.contactGroupTitleColor};
  font-size: ${S.midbar.smallFontSize};
  font-weight: bold;
  line-height: 16px;
  margin: 12px 0 8px 12px;
`;

export const NoResultsContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;

  margin: 0 auto;
  padding: 30px;

  h1 {
    font-size: ${S.midbar.largeFontSize};
    font-weight: bold;
    color: ${C.midbar.contactGroupTitleColor};
    text-align: center;
    margin: 12px;
  }
  p {
    text-align: center;
    margin: 12px;
    font-size: ${S.midbar.largeFontSize};
    color: ${C.midbar.contactGroupTitleColor};
  }
`;

export const ContactListContainer = styled.div`
  box-sizing: border-box;
`;
