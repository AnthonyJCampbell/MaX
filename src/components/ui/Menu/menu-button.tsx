// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";

import * as S from "./styles";
import Tippy from "@tippyjs/react";
import Tooltip from "components/tooltip/tip";
import { MenuState } from "./index";

export interface MenuButtonProps {
  id?: string;
  ariaLabel: string;
  label?: string;
  icon?: string;
  size?: string;
  padding?: string;
  bgColor?: string;
  children?: JSX.Element;
  onClick?: () => void;
  tooltipText?: string;
  menuState?: MenuState;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  id,
  ariaLabel,
  label,
  icon,
  size,
  padding,
  bgColor,
  onClick,
  children,
  tooltipText,
  menuState,
}) => {
  const tooltipContent = menuState !== MenuState.OPEN && tooltipText && (
    <Tooltip text={tooltipText} />
  );
  return (
    <Tippy content={tooltipContent} delay={[600, 0]} placement="top">
      <S.MenuButton
        id={id}
        aria-label={ariaLabel}
        size={size}
        padding={padding}
        bgColor={bgColor}
        hasIconAndLabel={Boolean(icon && label)}
        onClick={onClick}
      >
        {icon && <img src={icon} alt="" />}
        {label}
        {children}
      </S.MenuButton>
    </Tippy>
  );
};

export default MenuButton;
