// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import Tabs, { TabsProps, Tab } from "./index";
import { TabName } from "components/rightbar/rightbar";

export default {
  title: "Reusable Components/Tabs",
  component: Tabs,
} as Meta;

const Template: Story<TabsProps> = (args) => <Tabs {...args} />;

export const Empty = Template.bind({});
Empty.args = {};

const chatTab: Tab = {
  type: TabName.CHAT,
  label: "Conversation",
};

const contactDetailsTab: Tab = {
  type: TabName.CONTACT_DETAILS,
  label: "Contact details",
};

export const NoTabSelected = Template.bind({});
NoTabSelected.args = {
  tabs: [chatTab, contactDetailsTab],
};

export const ChatTabSelected = Template.bind({});
ChatTabSelected.args = {
  ...NoTabSelected.args,
  active: TabName.CHAT,
};

export const ContactDetailsTabSelected = Template.bind({});
ContactDetailsTabSelected.args = {
  ...NoTabSelected.args,
  active: TabName.CONTACT_DETAILS,
};
