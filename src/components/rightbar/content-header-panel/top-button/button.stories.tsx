// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import TopButton, { TopButtonProps } from "./button";

import MeetingButtonImg from "assets/rightbar/button-meeting.svg";

export default {
  title: "Components/TopButton",
  component: TopButton,
} as Meta;

const Template: Story<TopButtonProps> = (args) => <TopButton {...args} />;

export const MeetingButton = Template.bind({});
MeetingButton.args = {
  imageSrc: MeetingButtonImg,
  altName: "an alt name",
  parent: "default",
};

export const MeetingButtonDisabled = Template.bind({});
MeetingButtonDisabled.args = {
  ...MeetingButton.args,
  disabled: true,
};

export const MeetingButtonFocused = Template.bind({});
MeetingButtonFocused.args = {
  ...MeetingButton.args,
  focusOnRender: true,
};

export const MeetingButtonWithCustomTooltip = Template.bind({});
MeetingButtonWithCustomTooltip.args = {
  ...MeetingButtonFocused.args,
  tooltipText: "My custom tooltip, different from altName",
};
