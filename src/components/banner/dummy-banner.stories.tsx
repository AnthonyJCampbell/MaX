// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { emptyReduxStoreDecorator } from "store/storybook-redux-store";

import DummyBanner from "./dummy-banner";

export default {
  title: "Components/Banner/DummyBanner",
  component: DummyBanner,
  decorators: [emptyReduxStoreDecorator],
} as Meta;

const Template: Story = (args) => <DummyBanner {...args} />;

export const Default = Template.bind({});
Default.args = {};
