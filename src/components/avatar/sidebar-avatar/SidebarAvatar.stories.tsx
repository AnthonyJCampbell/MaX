// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";
import { StoreState } from "store/types";

import SidebarAvatar from "./sidebar-avatar";

import { mockStoreState } from "shared/mocks/mock-states";
import { bilbo } from "shared/mocks/mock-contacts";

export default {
  title: "Components/SidebarAvatar",
  component: SidebarAvatar,
} as Meta;

const Template: Story = (args) => <SidebarAvatar {...args} />;

const BilboStoreState: StoreState = {
  ...mockStoreState,
  settingsReducer: {
    settings: {
      ...mockStoreState.settingsReducer.settings,
      general: {
        ...mockStoreState.settingsReducer.settings.general,
        profilePicture: bilbo.identity?.profilePicture,
        accountNumber: bilbo.phone[0].value,
        displayName: `${bilbo.identity?.firstName} ${bilbo.identity?.lastName}`,
      },
    },
  },
};

export const Bilbo = Template.bind({});
Bilbo.args = {};
Bilbo.decorators = [reduxStoreDecorator(BilboStoreState)];

const WithInitialsState: StoreState = {
  ...mockStoreState,
  settingsReducer: {
    settings: {
      ...mockStoreState.settingsReducer.settings,
      general: {
        ...mockStoreState.settingsReducer.settings.general,
        accountNumber: bilbo.phone[0].value,
        displayName: `${bilbo.identity?.firstName} ${bilbo.identity?.lastName}`,
      },
    },
  },
};

export const WithInitials = Template.bind({});
WithInitials.args = {};
WithInitials.decorators = [reduxStoreDecorator(WithInitialsState)];

const NoNameState: StoreState = {
  ...mockStoreState,
};

/**
 * This is a current bug scenario we have.
 * Maybe, one day, this scenario will be fixed,
 * and this story will make any sense
 */
export const NoName = Template.bind({});
NoName.args = {};
NoName.decorators = [reduxStoreDecorator(NoNameState)];
