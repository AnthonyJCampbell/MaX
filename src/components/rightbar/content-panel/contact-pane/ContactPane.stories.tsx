// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import ContactPane from "./pane";

import { bilbo, peter, gandalfEmojiless } from "shared/mocks/mock-contacts";
import {
  protoMissedHistoricCall,
  protoInboundHistoricCall,
  protoOutboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";
import { StoreState } from "store/types";

export default {
  title: "Components/ContactPane",
  component: ContactPane,
} as Meta;

const Template: Story = (args) => <ContactPane {...args} />;

const bilboState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(bilbo),
  },
  callHistoryReducer: {
    ...mockStoreState.callHistoryReducer,
    historicCalls: [protoMissedHistoricCall, protoInboundHistoricCall, protoOutboundHistoricCall],
  },
};
export const Bilbo = Template.bind({});
Bilbo.args = {};
Bilbo.decorators = [reduxStoreDecorator(bilboState)];

const peterState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(peter),
  },
  callHistoryReducer: {
    ...mockStoreState.callHistoryReducer,
    historicCalls: [protoMissedHistoricCall, protoInboundHistoricCall, protoOutboundHistoricCall],
  },
};
export const Peter = Template.bind({});
Peter.args = {};
Peter.decorators = [reduxStoreDecorator(peterState)];

const gandalfState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(gandalfEmojiless),
  },
  callHistoryReducer: {
    ...mockStoreState.callHistoryReducer,
    historicCalls: [protoMissedHistoricCall, protoInboundHistoricCall, protoOutboundHistoricCall],
  },
};
export const Gandalf = Template.bind({});
Gandalf.args = {};
Gandalf.decorators = [reduxStoreDecorator(gandalfState)];

const nonContact = mutableCloneDeep(peter);
nonContact.uid = "";
const nonContactState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: nonContact,
  },
  callHistoryReducer: {
    ...mockStoreState.callHistoryReducer,
    historicCalls: [protoMissedHistoricCall, protoInboundHistoricCall, protoOutboundHistoricCall],
  },
};
export const NonContact = Template.bind({});
NonContact.args = {};
NonContact.decorators = [reduxStoreDecorator(nonContactState)];
