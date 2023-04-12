// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import { mockStoreState } from "shared/mocks/mock-states";
import { bilbo, gandalf } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { PhoneNumber } from "src/types";

import CallButton from "./call-button";

export default {
  title: "Components/CallButton",
  component: CallButton,
} as Meta;

/**
 * TODO: Move this to inside `call-button.js` when it is converted into TSX
 */
interface CallButtonProps {
  phoneNumbers: PhoneNumber[];
}

const Template: Story<CallButtonProps> = (args) => <CallButton {...args} />;

export const NoPhoneNumbers = Template.bind({});
NoPhoneNumbers.args = {
  phoneNumbers: [],
};
NoPhoneNumbers.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      disabledCallButton: "",
    },
  }),
];

export const WithPhoneNumbers = Template.bind({});
WithPhoneNumbers.args = {
  phoneNumbers: mutableCloneDeep(bilbo).phone,
};
WithPhoneNumbers.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      disabledCallButton: "",
    },
  }),
];

export const WithMultiplePhones = Template.bind({});
WithMultiplePhones.args = {
  phoneNumbers: mutableCloneDeep(gandalf).phone,
};
WithMultiplePhones.decorators = WithPhoneNumbers.decorators;
