// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { emptyReduxStoreDecorator } from "store/storybook-redux-store";

import ContactBlock, { ContactBlockProps } from "./contact-block";

import {
  gandalfEmojiless,
  bilbo,
  peter,
  noName,
  initialSelected,
} from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Components/ContactBlock",
  component: ContactBlock,
  decorators: [emptyReduxStoreDecorator],
} as Meta;

const Template: Story<ContactBlockProps> = (args) => <ContactBlock {...args} />;

export const Gandalf = Template.bind({});
Gandalf.args = {
  contact: mutableCloneDeep(gandalfEmojiless),
  id: "gandalfEmojiless",
};

export const Bilbo = Template.bind({});
Bilbo.args = {
  contact: mutableCloneDeep(bilbo),
  id: "bilbo",
};

export const Peter = Template.bind({});
Peter.args = {
  contact: mutableCloneDeep(peter),
  id: "peter",
};

export const NoName = Template.bind({});
NoName.args = {
  contact: mutableCloneDeep(noName),
  id: "noName",
};

export const InitialSelected = Template.bind({});
InitialSelected.args = {
  contact: mutableCloneDeep(initialSelected),
  id: "initialSelected",
};
