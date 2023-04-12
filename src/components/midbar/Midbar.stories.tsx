// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import Midbar from "./midbar";
import * as S from "./midbar-styles";

import { mockStoreState } from "shared/mocks/mock-states";
import { StoreState } from "store/types";
import { gandalfEmojiless, bilbo, peter, noName } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { MinWidthStorybookWrapper, MaxWidthStorybookWrapper } from "./midbar-styles";

export default {
  title: "Screens/Midbar",
  component: Midbar,
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

const Template: Story = (args) => <Midbar {...args} />;

const gandalfContact = mutableCloneDeep(gandalfEmojiless);
if (gandalfContact.identity) gandalfContact.identity.organisation = "The Valar Fellowship";
gandalfContact.isFavourite = true;

const peterContact = mutableCloneDeep(peter);
if (peterContact.identity) peterContact.identity.lastName = "Par-ker";

const decoratorWithContacts: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    contacts: [
      mutableCloneDeep(gandalfContact),
      mutableCloneDeep(bilbo),
      mutableCloneDeep(peterContact),
      mutableCloneDeep(noName),
    ],
  },
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    activeMidPane: "contacts",
    displayFavs: true,
    searchTerm: "",
  },
};

export const NoSearchResults = Template.bind({});
NoSearchResults.args = {};
NoSearchResults.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "searchstringwithnoresults",
    },
  }),
];

export const SearchByName = Template.bind({});
SearchByName.args = {};
SearchByName.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "peter par-ker",
    },
  }),
];

export const SearchByFirstName = Template.bind({});
SearchByFirstName.args = {};
SearchByFirstName.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "ete",
    },
  }),
];

export const SearchByLastName = Template.bind({});
SearchByLastName.args = {};
SearchByLastName.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "white",
    },
  }),
];

export const SearchByNickname = Template.bind({});
SearchByNickname.args = {};
SearchByNickname.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "Barrel Rider",
    },
  }),
];

export const SearchByOrganisation = Template.bind({});
SearchByOrganisation.args = {};
SearchByOrganisation.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "Fellowship",
    },
  }),
];

export const SearchByEMail = Template.bind({});
SearchByEMail.args = {};
SearchByEMail.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "@",
    },
  }),
];

export const SearchByNumber = Template.bind({});
SearchByNumber.args = {};
SearchByNumber.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "(11)-8493 7456",
    },
  }),
];

export const SearchBarWithSecondRow = Template.bind({});
SearchBarWithSecondRow.args = {};
SearchBarWithSecondRow.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      searchTerm: "1184937456",
      focusSearch: 1,
    },
  }),
];

export const DialPadOpenedMinWidth = Template.bind({});
DialPadOpenedMinWidth.args = {};
DialPadOpenedMinWidth.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      isMidPaneDialPadVisible: true,
      searchTerm: "1",
      focusSearch: 1,
    },
  }),
  (StoryComponent) => (
    <MinWidthStorybookWrapper>
      <StoryComponent />
    </MinWidthStorybookWrapper>
  ),
];

export const DialPadOpenedMaxWidth = Template.bind({});
DialPadOpenedMaxWidth.args = {};
DialPadOpenedMaxWidth.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      isMidPaneDialPadVisible: true,
      searchTerm: "1",
      focusSearch: 1,
    },
  }),
  (StoryComponent) => (
    <MaxWidthStorybookWrapper>
      <StoryComponent />
    </MaxWidthStorybookWrapper>
  ),
];

export const DialPadOpenedWithCallButtonEnabled = Template.bind({});
DialPadOpenedWithCallButtonEnabled.args = {};
DialPadOpenedWithCallButtonEnabled.decorators = [
  reduxStoreDecorator({
    ...decoratorWithContacts,
    paneManagementReducer: {
      ...decoratorWithContacts.paneManagementReducer,
      isMidPaneDialPadVisible: true,
      searchTerm: "1184937456",
    },
  }),
];
