// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import MenuItem, { MenuItemProps } from "./menu-item";
import IMIcon from "assets/rightbar/chat.svg";

export default {
  title: "Reusable Components/Menu/MenuItem",
  component: MenuItem,
} as Meta;

const Template: Story<MenuItemProps> = (args) => <MenuItem {...args} />;

export const IconMenuItem = Template.bind({});
IconMenuItem.args = {
  label: "menu item",
  onClick: () => console.log("clicked"),
  icon: IMIcon,
};

export const NonIconMenuItem = Template.bind({});
NonIconMenuItem.args = {
  label: "menu item",
  onClick: () => console.log("clicked"),
};
