// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import SearchBar from "./search-bar";
import { Colors as C } from "components/utils/style-constants";

import { mockStoreState } from "shared/mocks/mock-states";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    backgrounds: {
      default: "gray",
      values: [
        { name: "gray", value: C.midbar.background },
        { name: "white", value: C.backgroundColor },
        { name: "dark", value: C.textColor },
      ],
    },
  },
} as Meta;

const Template: Story = (args) => <SearchBar {...args} />;

export const EmptyUnfocussed = Template.bind({});
EmptyUnfocussed.args = {};
EmptyUnfocussed.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      searchTerm: "",
    },
  }),
];

export const EmptyFocussed = Template.bind({});
EmptyFocussed.args = {};
EmptyFocussed.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      focusSearch: 1,
      searchTerm: "",
    },
  }),
];

export const SearchTextUnfocussed = Template.bind({});
SearchTextUnfocussed.args = {};
SearchTextUnfocussed.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      searchTerm: "ThisIsASearchTerm",
    },
  }),
];

export const SearchTextFocussed = Template.bind({});
SearchTextFocussed.args = {};
SearchTextFocussed.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      focusSearch: 1,
      searchTerm: "ThisIsASearchTerm",
    },
  }),
];

export const SearchNumberUnfocussed = Template.bind({});
SearchNumberUnfocussed.args = {};
SearchNumberUnfocussed.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      searchTerm: "123456",
    },
  }),
];

export const SearchNumberFocussed = Template.bind({});
SearchNumberFocussed.args = {};
SearchNumberFocussed.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      focusSearch: 1,
      searchTerm: "123456",
    },
  }),
];
