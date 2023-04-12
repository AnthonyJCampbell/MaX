// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";

import Icon from "../Icon/Icon";
import { IconVariant } from "../Icon/types";

import { ButtonContainer } from "./styles";
import { IconName } from "assets/icons/iconsLib";
import { Sizes } from "components/utils/style-constants";

export interface Props {
  ariaLabel?: string;
  bgVariant: string;
  disabled?: boolean;
  icon?: IconName;
  iconVariant?: IconVariant;
  iconSize?: number;
  className?: string;
  text: string;
  width?: number;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
}

const getIconVariant = (iconVariant?: IconVariant, disabled?: boolean): IconVariant => {
  if (disabled) {
    return IconVariant.disabled;
  }

  if (!iconVariant) {
    return IconVariant.primary;
  }

  return iconVariant;
};

const Button: React.FC<Props> = ({
  ariaLabel,
  bgVariant,
  disabled,
  icon,
  iconVariant,
  iconSize,
  className,
  text,
  width,
  height,
  onClick,
  onMouseDown,
}) => (
  <ButtonContainer
    aria-label={ariaLabel}
    bgVariant={bgVariant}
    disabled={disabled}
    className={className}
    width={width}
    height={height}
    onClick={onClick}
    onMouseDown={onMouseDown}
  >
    {icon && (
      <Icon
        icon={icon}
        size={iconSize || Sizes.button.defaultIconSize}
        variant={getIconVariant(iconVariant, disabled)}
      />
    )}
    {text}
  </ButtonContainer>
);

export default Button;
