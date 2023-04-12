// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import Tippy from "@tippyjs/react";
import { StyledComponent } from "styled-components";

import Tooltip from "components/tooltip/tip";
import Icon from "components/ui/Icon/Icon";
import { IconVariant } from "components/ui/Icon/types";
import { IconButtonVariant } from "components/ui/IconButton/types";

import { Button, ButtonProps } from "./styles";
import { IconName } from "assets/icons/iconsLib";

export interface IconButtonProps {
  ariaLabel: string;
  id?: string;
  icon: IconName;
  tooltipText?: string;
  StyledButton?: StyledComponent<"button", never, ButtonProps, never>;
  width?: string;
  height?: string;
  variant?: IconButtonVariant;
  iconVariant?: IconVariant;
  iconColor?: string;
  iconSize?: number;
  hasFill?: boolean;
  hasStroke?: boolean;
  strokeOpacity?: number;
  hoverBackground?: string;
  disabled?: boolean;
  onClickHandler: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  ariaLabel,
  id,
  icon,
  tooltipText,
  StyledButton,
  width,
  height,
  variant,
  iconVariant,
  iconColor,
  iconSize,
  hasFill,
  hasStroke,
  strokeOpacity,
  hoverBackground,
  disabled,
  onClickHandler,
}) => {
  const ButtonComponent = StyledButton || Button;

  return (
    <Tippy
      content={tooltipText && <Tooltip text={tooltipText} />}
      delay={[600, 0]}
      placement="bottom"
    >
      <ButtonComponent
        id={id}
        aria-label={ariaLabel}
        variant={variant}
        hoverBackground={hoverBackground}
        disabled={disabled}
        width={width}
        height={height}
        onClick={onClickHandler}
      >
        <Icon
          icon={icon}
          size={iconSize || 12}
          variant={disabled ? IconVariant.disabled : iconVariant}
          color={iconColor}
          hasFill={hasFill}
          hasStroke={hasStroke}
          strokeOpacity={strokeOpacity}
        />
      </ButtonComponent>
    </Tippy>
  );
};

export default IconButton;
