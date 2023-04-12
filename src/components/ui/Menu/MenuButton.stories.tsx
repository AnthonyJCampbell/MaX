// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import { WhiteBgWrapper } from "./styles";
import MenuButton, { MenuButtonProps } from "./menu-button";
import Menu, { MenuState } from "./index";
import MenuItem from "./menu-item";
import IMIconToggle from "assets/rightbar/chat-toggle.svg";
import IMIcon from "assets/rightbar/chat.svg";
import { Colors, Sizes } from "components/utils/style-constants";

export default {
  title: "Reusable Components/MenuButton",
  component: MenuButton,
  decorators: [
    (DecoratedStory): React.ReactElement<unknown> => (
      <WhiteBgWrapper>
        <DecoratedStory />
      </WhiteBgWrapper>
    ),
  ],
} as Meta;

const Template: Story<MenuButtonProps> = (args) => <MenuButton {...args} />;

const onClickHandler = () => console.log("clicked");
const menuToDisplay = (state: MenuState): JSX.Element => (
  <Menu state={state} title={"This is a menu"}>
    <MenuItem label="menu item one" onClick={onClickHandler} icon={IMIcon} />
    <MenuItem label="menu item two" onClick={onClickHandler} icon={IMIcon} />
    <MenuItem label="menu item three" onClick={onClickHandler} icon={IMIcon} />
  </Menu>
);

export const CollapsedMenu = Template.bind({});
CollapsedMenu.args = {
  ariaLabel: "button to expand menu",
  icon: IMIconToggle,
  size: Sizes.rightbar.chatTypeButtonSize,
  children: menuToDisplay(MenuState.CLOSE),
};

export const ExpandedMenu = Template.bind({});
ExpandedMenu.args = {
  ariaLabel: "button to expand menu",
  icon: IMIconToggle,
  size: Sizes.rightbar.chatTypeButtonSize,
  children: menuToDisplay(MenuState.OPEN),
};

export const AppProps = Template.bind({});
AppProps.args = {
  ariaLabel: "a menu button with label",
  label: "menu label",
  bgColor: Colors.focusColor,
  padding: "5px 20px",
  icon: IMIconToggle,
  children: menuToDisplay(MenuState.OPEN),
};
