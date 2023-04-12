// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import { RelativeWrapper } from "./styles";
import Menu, { MenuProps, MenuState } from "./index";
import MenuItem from "./menu-item";
import IMIcon from "assets/rightbar/chat.svg";

export default {
  title: "Reusable Components/Menu",
  component: Menu,
  argTypes: {
    state: {
      type: "select",
      options: MenuState,
    },
  },
  decorators: [
    (DecoratedStory): React.ReactElement<unknown> => (
      <RelativeWrapper>
        <DecoratedStory />
      </RelativeWrapper>
    ),
  ],
} as Meta;

const Template: Story<MenuProps> = (args) => <Menu {...args} />;

const onClickHandler = () => console.log("clicked");
export const NonIconMenu = Template.bind({});
NonIconMenu.args = {
  title: "This is a Menu",
  state: MenuState.OPEN,
  children: [
    <MenuItem label="menu item one" onClick={onClickHandler} />,
    <MenuItem label="menu item two" onClick={onClickHandler} />,
    <MenuItem label="menu item three" onClick={onClickHandler} />,
  ],
};

export const IconMenu = Template.bind({});
IconMenu.args = {
  title: "This is a Menu",
  state: MenuState.OPEN,
  children: [
    <MenuItem label="menu item one" onClick={onClickHandler} icon={IMIcon} />,
    <MenuItem label="menu item two" onClick={onClickHandler} icon={IMIcon} />,
    <MenuItem label="menu item three" onClick={onClickHandler} icon={IMIcon} />,
  ],
};

export const UntitledMenu = Template.bind({});
UntitledMenu.args = {
  ariaLabel: "This is a Menu",
  state: MenuState.OPEN,
  children: [
    <MenuItem label="menu item one" onClick={onClickHandler} icon={IMIcon} />,
    <MenuItem label="menu item two" onClick={onClickHandler} icon={IMIcon} />,
    <MenuItem label="menu item three" onClick={onClickHandler} icon={IMIcon} />,
  ],
};
