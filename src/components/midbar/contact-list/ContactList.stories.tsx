// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import ContactList from "./contact-list";

import { gandalfEmojiless, bilbo, peter, noName } from "shared/mocks/mock-contacts";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Components/ContactList",
  component: ContactList,
} as Meta;

const Template: Story = (args) => <ContactList {...args} />;

export const Empty = Template.bind({});
Empty.args = {};
Empty.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      contacts: [],
    },
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      displayFavs: true,
      searchTerm: "",
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
      contacts: [
        mutableCloneDeep(gandalfEmojiless),
        mutableCloneDeep(bilbo),
        mutableCloneDeep(peter),
        mutableCloneDeep(noName),
      ],
    },
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      displayFavs: true,
      searchTerm: "",
    },
  }),
];
