// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import ChatMessage, { Props } from "./chat-message";

import { gandalfEmojiless } from "shared/mocks/mock-contacts";
import { MessageType } from "src/types";
import { onTimeMessage, youAreLateMessage } from "shared/mocks/mock-chats";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Components/ChatMessage",
  component: ChatMessage,
} as Meta;

const Template: Story<Props> = (args) => <ChatMessage {...args} />;

export const IMReceived = Template.bind({});
IMReceived.args = { message: onTimeMessage };

const SMSOnTimeMessage = mutableCloneDeep(onTimeMessage);
SMSOnTimeMessage.type = MessageType.SMS;
export const SMSReceived = Template.bind({});
SMSReceived.args = { message: SMSOnTimeMessage };

export const IMSent = Template.bind({});
IMSent.args = { message: youAreLateMessage };

const SMSyouAreLateMessage = mutableCloneDeep(youAreLateMessage);
SMSyouAreLateMessage.type = MessageType.SMS;
export const SMSSent = Template.bind({});
SMSSent.args = { message: SMSyouAreLateMessage };

export const IMWithAvatar = Template.bind({});
IMWithAvatar.args = {
  message: onTimeMessage,
  contact: mutableCloneDeep(gandalfEmojiless),
  displayAvatar: true,
};

export const SMSWithAvatar = Template.bind({});
SMSWithAvatar.args = {
  message: SMSOnTimeMessage,
  contact: mutableCloneDeep(gandalfEmojiless),
  displayAvatar: true,
};
