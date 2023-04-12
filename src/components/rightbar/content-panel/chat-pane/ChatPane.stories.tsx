// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import ChatPane from "./chat-pane";
import * as S from "./styles";

import { gandalf } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";
import { MessageType } from "src/types";
import { StoreState } from "store/types";
import { chatWithGandalf } from "shared/mocks/mock-chats";

export default {
  title: "Components/ChatPane",
  component: ChatPane,
  decorators: [
    (StoryComponent) => (
      <S.StorybookWrapper>
        <StoryComponent />
      </S.StorybookWrapper>
    ),
  ],
} as Meta;

const Template: Story = (args) => <ChatPane {...args} />;

const gandalfTyping = mutableCloneDeep(gandalf);
gandalfTyping.isTyping = true;
const gandalfTypingState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: gandalfTyping,
    contacts: [gandalfTyping],
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [mutableCloneDeep(chatWithGandalf)],
  },
};
export const GandalfTyping = Template.bind({});
GandalfTyping.args = {};
GandalfTyping.decorators = [reduxStoreDecorator(gandalfTypingState)];

const gandalfNotTyping = mutableCloneDeep(gandalf);
const gandalfNotTypingState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: gandalfNotTyping,
    contacts: [gandalfNotTyping],
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [mutableCloneDeep(chatWithGandalf)],
  },
};
export const GandalfNotTyping = Template.bind({});
GandalfNotTyping.args = {};
GandalfNotTyping.decorators = [reduxStoreDecorator(gandalfNotTypingState)];

const gandalfSMSChat = mutableCloneDeep(chatWithGandalf);
gandalfSMSChat.message.forEach((message) => (message.type = MessageType.SMS));
gandalfSMSChat.message.forEach((message) => (message.author = { value: gandalf.phone[0].value }));
const gandalfSMSState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: gandalfNotTyping,
    contacts: [gandalfNotTyping],
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [gandalfSMSChat],
  },
};
export const GandalfSMS = Template.bind({});
GandalfSMS.args = {};
GandalfSMS.decorators = [reduxStoreDecorator(gandalfSMSState)];

const multipleHeadersChat = mutableCloneDeep(chatWithGandalf);
multipleHeadersChat.message[1].type = MessageType.SMS;
multipleHeadersChat.message[1].timestamp = "2020-06-21T17:32:12";
multipleHeadersChat.message[2].timestamp = "2020-06-21T18:32:12";
const multipleHeadersState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: gandalfNotTyping,
    contacts: [gandalfNotTyping],
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [multipleHeadersChat],
  },
};
export const MultipleHeaders = Template.bind({});
MultipleHeaders.args = {};
MultipleHeaders.decorators = [reduxStoreDecorator(multipleHeadersState)];
