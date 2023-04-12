// Copyright 2021 Metaswitch Networks - Highly Confidential Material

import React from "react";
import { DialKeyValue } from "store/types";
import { UN_TABABLE } from "shared/constants";
import * as S from "./styles";

export interface Props {
  alternativeText?: string;
  ariaLabel: string;
  text: DialKeyValue;
  onClickHandler?: (value: DialKeyValue) => void;
}

const DialpadButton: React.FC<Props> = ({ ariaLabel, alternativeText, text, onClickHandler }) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    onClickHandler && onClickHandler(text);
  };

  return (
    <S.DialpadButtonContainer
      aria-label={ariaLabel}
      tabIndex={UN_TABABLE}
      onMouseDown={handleClick}
    >
      <S.DialpadButtonText>{text}</S.DialpadButtonText>
      <S.DialpadButtonAlternativeText>{alternativeText}</S.DialpadButtonAlternativeText>
    </S.DialpadButtonContainer>
  );
};

export default DialpadButton;
