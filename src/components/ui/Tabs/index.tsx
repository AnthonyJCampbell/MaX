// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";

import TabButton from "./TabButton";
import * as S from "./styles";

export interface Tab {
  type: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  id?: string;
  active?: string;
  onClick?: (type: string) => void;
}

const renderTab = (tab: Tab, active?: string, onClick?: (type: string) => void): JSX.Element => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (tab.type !== active) {
      onClick && onClick(tab.type);
    }
  };

  return (
    <TabButton
      key={`tab-${tab.type}`}
      active={tab.type === active}
      label={tab.label}
      onClick={handleClick}
    />
  );
};

const Tabs: React.FC<TabsProps> = ({ id, tabs, active, onClick }) => {
  if (!tabs || tabs.length === 0) {
    return <S.TabPlaceholder />;
  }

  return (
    <S.TabContainer id={id} role="tablist">
      {tabs.map((tab) => renderTab(tab, active, onClick))}
    </S.TabContainer>
  );
};

export default Tabs;
