// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import * as S from "./styles";
import Rightbar, { TabName } from "./rightbar";

import { mockStoreState } from "shared/mocks/mock-states";
import { peter, gandalfEmojiless } from "shared/mocks/mock-contacts";
import { chatWithPeter, chatWithGandalf } from "shared/mocks/mock-chats";
import { gandalfCall } from "shared/mocks/mock-active-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Screens/Rightbar",
  component: Rightbar,
  decorators: [
    (StoryComponent) => (
      <S.StorybookWrapper>
        <StoryComponent />
      </S.StorybookWrapper>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} as Meta;

const Template: Story = (args) => <Rightbar {...args} />;

export const NoTabSelected = Template.bind({});
NoTabSelected.args = {};
NoTabSelected.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
  }),
];

export const ChatPane = Template.bind({});
ChatPane.args = {};
ChatPane.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(peter),
    },
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      activeRightPane: TabName.CHAT,
    },
    messagingReducer: {
      ...mockStoreState.messagingReducer,
      chats: [mutableCloneDeep(chatWithPeter)],
    },
  }),
];

export const InCallChatPane = Template.bind({});
InCallChatPane.args = {};
InCallChatPane.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(gandalfEmojiless),
    },
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      activeRightPane: TabName.CHAT,
    },
    messagingReducer: {
      ...mockStoreState.messagingReducer,
      chats: [mutableCloneDeep(chatWithGandalf)],
    },
    activeCallsReducer: {
      ...mockStoreState.activeCallsReducer,
      activeCalls: [gandalfCall],
    },
  }),
];

export const ContactDetailsPane = Template.bind({});
ContactDetailsPane.args = {};
ContactDetailsPane.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(peter),
    },
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      activeRightPane: TabName.CONTACT_DETAILS,
    },
  }),
];
