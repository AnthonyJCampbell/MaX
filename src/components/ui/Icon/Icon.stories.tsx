// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story } from "@storybook/react";

import { IconName } from "assets/icons/iconsLib";
import { Colors } from "components/utils/style-constants";
import Icon, { IconProps } from "./Icon";
import { IconVariant } from "./types";

export default {
  title: "Reusable Components/Icon",
  component: Icon,
  parameters: {
    backgrounds: {
      default: "gray",
      values: [
        { name: "gray", value: Colors.midbar.background },
        { name: "white", value: Colors.backgroundColor },
        { name: "dark", value: Colors.textColor },
      ],
    },
  },
};

const Template: Story<IconProps> = (args) => <Icon {...args} />;

export const StarPrimary = Template.bind({});
StarPrimary.args = {
  ariaLabel: "Star",
  icon: IconName.star,
  size: 32,
  variant: IconVariant.primary,
};

export const StarDark = Template.bind({});
StarDark.args = {
  ...StarPrimary.args,
  variant: IconVariant.dark,
};

export const StarDisabled = Template.bind({});
StarDisabled.args = {
  ...StarPrimary.args,
  variant: IconVariant.disabled,
};

export const StarOutlined = Template.bind({});
StarOutlined.args = {
  ...StarPrimary.args,
  variant: IconVariant.outlined,
};

export const NotifyPrimary = Template.bind({});
NotifyPrimary.args = {
  icon: IconName.notify,
  size: 32,
  variant: IconVariant.primary,
};

export const NotifyDark = Template.bind({});
NotifyDark.args = {
  ...NotifyPrimary.args,
  variant: IconVariant.dark,
};

export const NotifyDisabled = Template.bind({});
NotifyDisabled.args = {
  ...NotifyPrimary.args,
  variant: IconVariant.disabled,
};

export const NotifyOutlined = Template.bind({});
NotifyOutlined.args = {
  ...NotifyPrimary.args,
  variant: IconVariant.outlined,
};

export const HangUpPrimary = Template.bind({});
HangUpPrimary.args = {
  icon: IconName.hangup,
  size: 32,
  variant: IconVariant.primary,
};

export const HangUpDark = Template.bind({});
HangUpDark.args = {
  ...HangUpPrimary.args,
  variant: IconVariant.dark,
};

export const HangUpDisabled = Template.bind({});
HangUpDisabled.args = {
  ...HangUpPrimary.args,
  variant: IconVariant.disabled,
};

export const HangUpOutlined = Template.bind({});
HangUpOutlined.args = {
  ...HangUpPrimary.args,
  variant: IconVariant.outlined,
};

export const Dismiss = Template.bind({});
Dismiss.args = {
  icon: IconName.dismiss,
  size: 32,
  color: Colors.textColor,
  hasFill: false,
  hasStroke: true,
};

export const PhonePrimary = Template.bind({});
PhonePrimary.args = {
  icon: IconName.phone,
  size: 32,
  variant: IconVariant.primary,
};

export const PhoneDark = Template.bind({});
PhoneDark.args = {
  ...PhonePrimary.args,
  variant: IconVariant.dark,
};

export const PhoneDisabled = Template.bind({});
PhoneDisabled.args = {
  ...PhonePrimary.args,
  variant: IconVariant.disabled,
};

export const PhoneOutlined = Template.bind({});
PhoneOutlined.args = {
  ...PhonePrimary.args,
  variant: IconVariant.outlined,
};

export const DialpadPrimary = Template.bind({});
DialpadPrimary.args = {
  icon: IconName.dialpad,
  size: 32,
  variant: IconVariant.primary,
};

export const DialpadDark = Template.bind({});
DialpadDark.args = {
  ...DialpadPrimary.args,
  variant: IconVariant.dark,
};

export const DialpadDisabled = Template.bind({});
DialpadDisabled.args = {
  ...DialpadPrimary.args,
  variant: IconVariant.disabled,
};

export const DialpadOutlined = Template.bind({});
DialpadOutlined.args = {
  ...DialpadPrimary.args,
  variant: IconVariant.outlined,
};

export const DialpadOpenPrimary = Template.bind({});
DialpadOpenPrimary.args = {
  icon: IconName.dialpadOpen,
  size: 32,
  variant: IconVariant.primary,
};

export const DialpadOpenDark = Template.bind({});
DialpadOpenDark.args = {
  ...DialpadOpenPrimary.args,
  variant: IconVariant.dark,
};

export const DialpadOpenDisabled = Template.bind({});
DialpadOpenDisabled.args = {
  ...DialpadOpenPrimary.args,
  variant: IconVariant.disabled,
};

export const SMSPrimary = Template.bind({});
SMSPrimary.args = {
  icon: IconName.sms,
  size: 32,
  variant: IconVariant.primary,
};

export const SMSDark = Template.bind({});
SMSDark.args = {
  ...SMSPrimary.args,
  variant: IconVariant.dark,
};

export const SMSDisabled = Template.bind({});
SMSDisabled.args = {
  ...SMSPrimary.args,
  variant: IconVariant.disabled,
};
