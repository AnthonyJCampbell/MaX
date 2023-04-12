// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import CallList from "./call-list";

import { bilbo, peter, noName } from "shared/mocks/mock-contacts";
import {
  protoMissedHistoricCall,
  protoInboundHistoricCall,
  protoOutboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Components/CallList",
  component: CallList,
} as Meta;

const Template: Story = (args) => <CallList {...args} />;

const callHistoryReducer = {
  ...mockStoreState.callHistoryReducer,
  historicCalls: [protoMissedHistoricCall, protoInboundHistoricCall, protoOutboundHistoricCall],
};

export const Empty = Template.bind({});
Empty.args = {};
Empty.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    callHistoryReducer: {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [],
    },
  }),
];

export const Full = Template.bind({});
Full.args = {};
Full.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    callHistoryReducer,
    contactReducer: {
      ...mockStoreState.contactReducer,
      contacts: [mutableCloneDeep(bilbo), mutableCloneDeep(peter), mutableCloneDeep(noName)],
    },
  }),
];

export const JustNow = Template.bind({});
JustNow.args = {};
JustNow.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    callHistoryReducer: {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [
        {
          ...protoMissedHistoricCall,
          datetimeStarted: new Date().toISOString(),
        },
      ],
    },
  }),
];

export const AmericanRegionPhoneFormatted = Template.bind({});
AmericanRegionPhoneFormatted.args = {};
AmericanRegionPhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    callHistoryReducer: {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [
        {
          ...protoMissedHistoricCall,
          remoteParty: "4258828080",
        },
        {
          ...protoInboundHistoricCall,
          remoteParty: "+442083627097",
        },
        {
          ...protoOutboundHistoricCall,
          remoteParty: "+5545987654321",
        },
      ],
    },
    contactReducer: {
      ...mockStoreState.contactReducer,
    },
    settingsReducer: {
      settings: {
        ...mockStoreState.settingsReducer.settings,
        general: {
          ...mockStoreState.settingsReducer.settings.general,
          easRegion: "US",
        },
      },
    },
  }),
];

export const BrazillianRegionPhoneFormatted = Template.bind({});
BrazillianRegionPhoneFormatted.args = {};
BrazillianRegionPhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    callHistoryReducer: {
      ...mockStoreState.callHistoryReducer,
      historicCalls: [
        {
          ...protoMissedHistoricCall,
          remoteParty: "1943219876",
        },
        {
          ...protoInboundHistoricCall,
          remoteParty: "45987654321",
        },
        {
          ...protoOutboundHistoricCall,
          remoteParty: "+442083627097",
        },
      ],
    },
    contactReducer: {
      ...mockStoreState.contactReducer,
    },
    settingsReducer: {
      settings: {
        ...mockStoreState.settingsReducer.settings,
        general: {
          ...mockStoreState.settingsReducer.settings.general,
          easRegion: "BR",
        },
      },
    },
  }),
];
