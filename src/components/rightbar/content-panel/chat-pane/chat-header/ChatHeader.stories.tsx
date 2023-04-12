// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import ChatHeader, { Props } from "./chat-header";
import { MessageType } from "src/types";

export default {
  title: "Components/ChatHeader",
  component: ChatHeader,
  argTypes: {
    messageType: {
      type: "select",
      options: MessageType,
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <ChatHeader {...args} />;

export const DateHeader = Template.bind({});
DateHeader.args = { date: "2020-06-20T17:32:12" };

export const NewHeader = Template.bind({});
NewHeader.args = { isNew: true };

export const SmsHeader = Template.bind({});
SmsHeader.args = { message: { messageType: MessageType.SMS, messageUid: "sms-uid" } };

export const ImHeader = Template.bind({});
ImHeader.args = { message: { messageType: MessageType.IM, messageUid: "im-uid" } };
