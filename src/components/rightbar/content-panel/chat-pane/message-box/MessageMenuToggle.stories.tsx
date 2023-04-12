// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import { WhiteBgWrapper } from "./styles";
import MessageMenuToggle, { MessageMenuToggleProps } from "./message-menu-toggle";

import { gandalfEmojiless } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";
import { MenuState } from "components/ui/Menu";

export default {
  title: "Components/MessageMenuToggle",
  component: MessageMenuToggle,
  decorators: [
    (DecoratedStory): React.ReactElement<unknown> => (
      <WhiteBgWrapper>
        <DecoratedStory />
      </WhiteBgWrapper>
    ),
  ],
} as Meta;

const Template: Story<MessageMenuToggleProps> = (args) => <MessageMenuToggle {...args} />;

const gandalfIMOnly = mutableCloneDeep(gandalfEmojiless);
gandalfIMOnly.phone = [];

export const IMOnly = Template.bind({});
IMOnly.decorators = [
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

export const SMSOnly = Template.bind({});
SMSOnly.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: gandalfSMSOnly,
    },
  }),
];

export const IMAndSMS = Template.bind({});
IMAndSMS.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(gandalfEmojiless),
    },
  }),
];

export const IMAndSMSExpanded = Template.bind({});
IMAndSMSExpanded.args = {
  initialState: MenuState.OPEN,
};
IMAndSMSExpanded.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(gandalfEmojiless),
    },
  }),
];

const gandalfMultipleNumbers = { ...mutableCloneDeep(gandalfEmojiless), im: undefined };

export const MultipleSMS = Template.bind({});
MultipleSMS.decorators = [
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

export const MultipleSMSExpanded = Template.bind({});
MultipleSMSExpanded.args = {
  initialState: MenuState.OPEN,
};
MultipleSMSExpanded.decorators = MultipleSMS.decorators;
