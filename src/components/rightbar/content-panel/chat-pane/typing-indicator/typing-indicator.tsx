// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useSelector } from "react-redux";
import { StoreState } from "store/types";
import { Contact } from "src/types";
import { useTranslation } from "react-i18next";

import * as S from "./styles";

export const TypingIndicator: React.FC = () => {
  const { t } = useTranslation();
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );

  // Return an empty TypingIndicator to ensure the layout doesn't move
  // every time the TypingIndicator appears/disappears
  if (!selectedContact.isTyping) return <S.TypingIndicator />;

  return (
    // The spans represent the dynamic typing indicators elements,
    // the animation is fully done in S.TypingIndicator's CSS
    <S.TypingIndicator>
      <span></span>
      <span></span>
      <span></span>
      <p>{selectedContact.identity?.firstName + " " + t("isTyping")}</p>
    </S.TypingIndicator>
  );
};

export default TypingIndicator;
