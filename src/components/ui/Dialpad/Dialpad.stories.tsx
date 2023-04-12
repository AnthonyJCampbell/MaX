// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { emptyReduxStoreDecorator } from "store/storybook-redux-store";
import Dialpad, { Props } from "./index";
import { Colors as C } from "components/utils/style-constants";

export default {
  title: "Reusable Components/Dialpad",
  component: Dialpad,
  decorators: [emptyReduxStoreDecorator],
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
} as Meta;

const Template: Story<Props> = (args) => <Dialpad {...args} />;

export const WithCallButton = Template.bind({});
WithCallButton.args = {
  callButtonVisible: true,
  callButtonDisabled: false,
};

export const WithCallButtonDisabled = Template.bind({});
WithCallButtonDisabled.args = {
  callButtonVisible: true,
  callButtonDisabled: true,
};

export const WithCallButtonHidden = Template.bind({});
WithCallButtonHidden.args = {
  callButtonVisible: false,
  callButtonDisabled: false,
};
