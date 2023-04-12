// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";

import * as S from "./styles";

export interface TabButtonProps {
  active: boolean;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const TabButton: React.FC<TabButtonProps> = ({ active, label, onClick }) => (
  <S.TabButton role="tab" active={active} onClick={onClick} aria-selected={active}>
    {label}
  </S.TabButton>
);

export default TabButton;
