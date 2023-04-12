// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";
import { StoreState } from "store/types";
import { Contact } from "src/types";

import InCallHeaderPanel from "./in-call-header-panel";

import { gandalfEmojiless, nonContact } from "shared/mocks/mock-contacts";
import { bilboCall, gandalfCall, nonContactCall } from "shared/mocks/mock-active-calls";
import { upliftGandalfCallToMeeting } from "shared/mocks/mock-meetings";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Components/InCallHeaderPanel",
  component: InCallHeaderPanel,
} as Meta;

const Template: Story = (args) => <InCallHeaderPanel {...args} />;

const GandalfReduxState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(gandalfEmojiless),
  },
  meetingReducer: {
    ...mockStoreState.meetingReducer,
    meetings: [mutableCloneDeep(upliftGandalfCallToMeeting)],
  },
  settingsReducer: {
    settings: {
      ...mockStoreState.settingsReducer.settings,
      meetings: {
        enabled: true,
      },
    },
  },
  activeCallsReducer: {
    ...mockStoreState.activeCallsReducer,
    activeCalls: [gandalfCall],
  },
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    isMainWindowFocused: true,
  },
};
export const Gandalf = Template.bind({});
Gandalf.decorators = [reduxStoreDecorator(GandalfReduxState)];

export const GandalfMainWindowBlurred = Template.bind({});
GandalfMainWindowBlurred.decorators = [
  reduxStoreDecorator({
    ...GandalfReduxState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      isMainWindowFocused: false,
    },
  }),
];

const protoNonContact = mutableCloneDeep(bilboCall);
protoNonContact.remoteParty = "01773299423";

const NonContactReduxState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    contacts: [],
    selectedContact: mutableCloneDeep(nonContact),
  },
  activeCallsReducer: {
    ...mockStoreState.activeCallsReducer,
    activeCalls: [nonContactCall],
  },
};
export const NonContactCalling = Template.bind({});
NonContactCalling.decorators = [reduxStoreDecorator(NonContactReduxState)];

const americanPhoneNumber = "4258828080";
const protoNonContactAmericanRegion = mutableCloneDeep(bilboCall);
protoNonContactAmericanRegion.remoteParty = americanPhoneNumber;

const NonContactAmericanRegionPhoneReduxState: StoreState = {
  ...NonContactReduxState,
  contactReducer: {
    ...NonContactReduxState.contactReducer,
    selectedContact: Contact.fromPhoneNumber(americanPhoneNumber),
  },
  activeCallsReducer: {
    ...NonContactReduxState.activeCallsReducer,
    activeCalls: [protoNonContactAmericanRegion],
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
};

export const NonContactAmericanRegionPhone = Template.bind({});
NonContactAmericanRegionPhone.decorators = [
  reduxStoreDecorator(NonContactAmericanRegionPhoneReduxState),
];

const brazillianPhoneNumber = "1943219876";
const protoNonContactBrazillianRegion = mutableCloneDeep(bilboCall);
protoNonContactBrazillianRegion.remoteParty = brazillianPhoneNumber;

const NonContactBrazillianRegionPhoneReduxState: StoreState = {
  ...NonContactReduxState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    contacts: [],
    selectedContact: Contact.fromPhoneNumber(brazillianPhoneNumber),
  },
  activeCallsReducer: {
    ...mockStoreState.activeCallsReducer,
    activeCalls: [protoNonContactBrazillianRegion],
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
};

export const NonContactBrazillianRegionPhone = Template.bind({});
NonContactBrazillianRegionPhone.decorators = [
  reduxStoreDecorator(NonContactBrazillianRegionPhoneReduxState),
];
