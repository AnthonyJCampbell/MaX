// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story } from "@storybook/react";

import { DialKeyValue } from "store/types";

import DialpadButton, { Props } from "./index";
import { Colors as C } from "components/utils/style-constants";

export default {
  title: "Reusable Components/Dialpad/DialpadButton",
  component: DialpadButton,
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

const Template: Story<Props> = (args) => <DialpadButton {...args} />;

export const DialpadButtonDefault = Template.bind({});
DialpadButtonDefault.args = {
  alternativeText: "",
  ariaLabel: "Dialpad button number one",
  text: DialKeyValue.One,
  onClickHandler: () => {},
};

export const AlternativeDialpadButton = Template.bind({});
AlternativeDialpadButton.args = {
  alternativeText: "abc",
  ariaLabel: "Dialpad button number two",
  text: DialKeyValue.Two,
  onClickHandler: () => {},
};
