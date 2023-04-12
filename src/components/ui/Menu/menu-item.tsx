// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import * as S from "./styles";

export interface MenuItemProps {
  id?: string;
  label: string;
  onClick: () => void;
  icon?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ id, label, onClick, icon }) => {
  return (
    <S.MenuItem role="none" id={id}>
      <S.MenuItemLink onClick={onClick} role="menuitem" tabIndex={-1}>
        {icon && <img src={icon} alt="" />}
        {label}
      </S.MenuItemLink>
    </S.MenuItem>
  );
};

export default MenuItem;
