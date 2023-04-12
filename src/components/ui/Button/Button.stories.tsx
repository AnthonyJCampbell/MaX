// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story } from "@storybook/react";

import Button, { Props } from "./Button";
import { IconVariant } from "../Icon/types";
import { Colors as C } from "components/utils/style-constants";
import { IconName } from "assets/icons/iconsLib";

export default {
  title: "Reusable Components/Button",
  component: Button,
  parameters: {
    backgrounds: {
      default: "gray",
      values: [
        { name: "gray", value: C.midbar.background },
        { name: "white", value: C.backgroundColor },
        { name: "dark", value: C.textColor },
      ],
    },
  },
};

const Template: Story<Props> = (args) => <Button {...args} />;

export const ButtonWithoutIcon = Template.bind({});
ButtonWithoutIcon.args = {
  ariaLabel: "Button without icon",
  text: "Button without icon",
};

export const ButtonWithIcon = Template.bind({});
ButtonWithIcon.args = {
  ariaLabel: "Button with icon",
  icon: IconName.phone,
  text: "Button with icon",
  iconVariant: IconVariant.primary,
};

export const ButtonWithBackgroundColor = Template.bind({});
ButtonWithBackgroundColor.args = {
  ariaLabel: "Button with background color",
  bgVariant: C.focusColor,
  text: "Button",
};

export const SmallButton = Template.bind({});
SmallButton.args = {
  ariaLabel: "Small button",
  text: "small",
  width: 48,
};

export const MediumButton = Template.bind({});
MediumButton.args = {
  ariaLabel: "Medium button",
  text: "medium",
  width: 92,
};

export const LargeButton = Template.bind({});
LargeButton.args = {
  ariaLabel: "Large button",
  text: "large",
  width: 200,
};

export const DisabledButton = Template.bind({});
DisabledButton.args = {
  ariaLabel: "disabled button",
  disabled: true,
  text: "disabled button",
  width: 200,
};
