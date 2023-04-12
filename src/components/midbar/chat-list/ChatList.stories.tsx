// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import ChatList from "./chat-list";

import { peter } from "shared/mocks/mock-contacts";
import { chatWithPeter } from "shared/mocks/mock-chats";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Components/ChatList",
  component: ChatList,
} as Meta;

const Template: Story = (args) => <ChatList {...args} />;

export const Empty = Template.bind({});
Empty.args = {};
Empty.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      contacts: [],
    },
    messagingReducer: {
      ...mockStoreState.messagingReducer,
      chats: [],
    },
  }),
];

export const Full = Template.bind({});
Full.args = {};
Full.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      contacts: [mutableCloneDeep(peter)],
      selectedContact: mutableCloneDeep(peter),
    },
    messagingReducer: {
      ...mockStoreState.messagingReducer,
      chats: [mutableCloneDeep(chatWithPeter)],
    },
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      activeRightPane: "",
    },
  }),
];
