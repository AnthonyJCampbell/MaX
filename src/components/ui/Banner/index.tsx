// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import log from "src/renderer-logging";
import IconButton from "components/ui/IconButton/IconButton";
import { IconName } from "assets/icons/iconsLib";

export interface BannerProps {
  content: React.ReactNode;
  bgColor?: string;
  fontColor?: string;
  fontSize?: string;
  dimissHoverBackground?: string;
  onDismiss?: () => void;
}

const Banner: React.FC<BannerProps> = ({
  bgColor,
  fontColor,
  fontSize,
  dimissHoverBackground,
  onDismiss,
  content,
}) => {
  const { t } = useTranslation();
  const dismissClickHandler = (): void => {
    log.userAction(`Dismissed the Banner`);

    onDismiss && onDismiss();
  };

  return (
    <S.Banner
      bgColor={bgColor}
      fontColor={fontColor}
      fontSize={fontSize}
      hasDimissFn={Boolean(onDismiss)}
    >
      <p role="alert">{content}</p>
      {onDismiss && (
        <IconButton
          ariaLabel={t("dismissBanner")}
          icon={IconName.dismiss}
          iconSize={15}
          StyledButton={S.DismissButton}
          tooltipText={t("dismiss")}
          iconColor={fontColor || "#000"}
          hoverBackground={dimissHoverBackground}
          hasFill={false}
          hasStroke={true}
          strokeOpacity={0.54}
          onClickHandler={dismissClickHandler}
        />
      )}
    </S.Banner>
  );
};

export default Banner;
