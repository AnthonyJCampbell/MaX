// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import TypingIndicator from "./typing-indicator";

import { gandalf } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";
import { StoreState } from "store/types";

export default {
  title: "Components/TypingIndicator",
  component: TypingIndicator,
} as Meta;

const Template: Story = (args) => <TypingIndicator {...args} />;

const gandalfTyping = mutableCloneDeep(gandalf);
gandalfTyping.isTyping = true;
const gandalfTypingState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: gandalfTyping,
  },
};
export const GandalfTyping = Template.bind({});
GandalfTyping.args = {};
GandalfTyping.decorators = [reduxStoreDecorator(gandalfTypingState)];

const gandalfNotTypingState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(gandalf),
  },
};
export const GandalfNotTyping = Template.bind({});
GandalfNotTyping.args = {};
GandalfNotTyping.decorators = [reduxStoreDecorator(gandalfNotTypingState)];
