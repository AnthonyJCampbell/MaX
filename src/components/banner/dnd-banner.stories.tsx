// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { emptyReduxStoreDecorator } from "store/storybook-redux-store";

import DNDBanner from "./dnd-banner";

export default {
  title: "Components/Banner/DNDBanner",
  component: DNDBanner,
  decorators: [emptyReduxStoreDecorator],
} as Meta;

const Template: Story = (args) => <DNDBanner {...args} />;

export const Default = Template.bind({});
Default.args = {};
