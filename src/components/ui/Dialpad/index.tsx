// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import { DialKeyValue } from "store/types";
import Button from "components/ui/Button/Button";
import { IconVariant } from "components/ui/Icon/types";
import { Colors } from "components/utils/style-constants";

import * as S from "./styles";
import { IconName } from "assets/icons/iconsLib";
import { KeypadButtons } from "./keypad-buttons";
import DialpadButton from "./dialpad-button";

export interface Props {
  id?: string;
  callButtonVisible: boolean;
  callButtonDisabled: boolean;
  margin?: string;
  gridArea?: string;
  onDialpadClick?: (value: DialKeyValue) => void;
  onCall?: () => void;
  onSMS?: () => void;
}

const renderDialpadButtons = (onClick?: (value: DialKeyValue) => void): JSX.Element[] => {
  return KeypadButtons.map((value) => {
    return (
      <DialpadButton
        key={value.text}
        ariaLabel={value.ariaLabel}
        text={value.text}
        alternativeText={value.alternativeText}
        onClickHandler={onClick}
      />
    );
  });
};

const Dialpad: React.FC<Props> = ({
  id,
  callButtonVisible,
  callButtonDisabled,
  margin,
  gridArea,
  onDialpadClick,
  onCall,
  onSMS,
}) => {
  const { t } = useTranslation();

  return (
    <S.DialpadContainer id={id} margin={margin} gridArea={gridArea}>
      <S.DialpadGridContainer>{renderDialpadButtons(onDialpadClick)}</S.DialpadGridContainer>
      {callButtonVisible && (
        <S.DialpadButtonContainer>
          <Button
            icon={IconName.phone}
            iconVariant={IconVariant.primary}
            className="dialpadCallButton"
            text={t("call")}
            bgVariant={Colors.backgroundColor}
            onClick={onCall}
            disabled={callButtonDisabled}
          />
          <Button
            icon={IconName.sms}
            iconVariant={IconVariant.primary}
            className="dialpadSMSButton"
            text={t("sms")}
            bgVariant={Colors.backgroundColor}
            onClick={onSMS}
            disabled={callButtonDisabled}
            iconSize={16}
          />
        </S.DialpadButtonContainer>
      )}
    </S.DialpadContainer>
  );
};

export default Dialpad;
