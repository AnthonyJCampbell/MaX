// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { emptyReduxStoreDecorator } from "store/storybook-redux-store";

import TopMenuButton, { TopMenuButtonProps } from "./menu-button";

import MoreButtonImg from "assets/rightbar/button-more.svg";
import { GandalfMoreMenu } from "../more-menu/more-menu.stories";

export default {
  title: "Components/TopMenuButton",
  component: TopMenuButton,
  decorators: [emptyReduxStoreDecorator],
} as Meta;

const Template: Story<TopMenuButtonProps> = (args) => <TopMenuButton {...args} />;

export const MoreMenu = Template.bind({});
MoreMenu.args = {
  imageSrc: MoreButtonImg,
  altName: "an alt name",
  parent: "default",
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  menu: <GandalfMoreMenu {...GandalfMoreMenu.args} />,
};
