// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story } from "@storybook/react";

import IconButton, { IconButtonProps } from "./IconButton";
import { IconVariant } from "../Icon/types";
import { IconName } from "assets/icons/iconsLib";
import { Colors as C, Sizes as S } from "components/utils/style-constants";
import { IconButtonVariant } from "./types";

export default {
  title: "Reusable Components/IconButton",
  component: IconButton,
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

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />;

export const AddFavoriteButton = Template.bind({});
AddFavoriteButton.args = {
  ariaLabel: "add to favorite",
  variant: IconButtonVariant.transparent,
  iconVariant: IconVariant.outlined,
  icon: IconName.star,
  tooltipText: "add to favorite",
  onClickHandler: () => {},
};

export const RemoveFavoriteButton = Template.bind({});
RemoveFavoriteButton.args = {
  ariaLabel: "remove from favorites",
  variant: IconButtonVariant.transparent,
  iconVariant: IconVariant.primary,
  icon: IconName.star,
  tooltipText: "remove from favorites",
  onClickHandler: () => {},
};

export const DismissButton = Template.bind({});
DismissButton.args = {
  ariaLabel: "Dismiss",
  variant: IconButtonVariant.transparent,
  icon: IconName.dismiss,
  tooltipText: "Dismiss",
  iconSize: 15,
  iconColor: "#000",
  hasFill: false,
  hasStroke: true,
  strokeOpacity: 0.54,
  onClickHandler: () => {},
};

export const DialpadButton = Template.bind({});
DialpadButton.args = {
  ariaLabel: "Dialpad",
  icon: IconName.dialpad,
  tooltipText: "Dialpad",
  iconSize: 17,
  variant: IconButtonVariant.white,
  iconVariant: IconVariant.primary,
  width: S.midbar.dialpadButtonSize,
  height: S.midbar.dialpadButtonSize,
  onClickHandler: () => {},
};

export const DialpadButtonDisabled = Template.bind({});
DialpadButtonDisabled.args = {
  ...DialpadButton.args,
  disabled: true,
};

export const DialpadOpenButton = Template.bind({});
DialpadOpenButton.args = {
  ...DialpadButton.args,
  icon: IconName.dialpadOpen,
};
