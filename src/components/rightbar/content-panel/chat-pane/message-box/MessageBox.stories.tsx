// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import { WhiteBgWrapper } from "./styles";
import MessageBox from "./message-box";

import { gandalfEmojiless } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";

export default {
  title: "Components/MessageBox",
  component: MessageBox,
  decorators: [
    (DecoratedStory): React.ReactElement<unknown> => (
      <WhiteBgWrapper>
        <DecoratedStory />
      </WhiteBgWrapper>
    ),
  ],
} as Meta;

const Template: Story = (args) => <MessageBox {...args} />;

const gandalfIMOnly = mutableCloneDeep(gandalfEmojiless);
gandalfIMOnly.phone = [];

export const IMWithoutToggle = Template.bind({});
IMWithoutToggle.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: gandalfIMOnly,
    },
  }),
];

const gandalfSMSOnly = { ...mutableCloneDeep(gandalfEmojiless), im: undefined };
gandalfSMSOnly.phone = [gandalfSMSOnly.phone[0]];

export const SMSWithoutToggle = Template.bind({});
SMSWithoutToggle.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: gandalfSMSOnly,
    },
  }),
];

export const IMWithToggle = Template.bind({});
IMWithToggle.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(gandalfEmojiless),
    },
  }),
];

const gandalfMultipleNumbers = mutableCloneDeep(gandalfEmojiless);
gandalfMultipleNumbers.im.value = "";

export const SMSWithToggle = Template.bind({});
SMSWithToggle.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: gandalfMultipleNumbers,
    },
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      forceMessageRemoteParty: gandalfEmojiless.phone[0].value,
    },
  }),
];
