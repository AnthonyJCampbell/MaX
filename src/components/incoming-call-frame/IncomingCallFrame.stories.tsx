// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import styled from "styled-components";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import IncomingCallFrame from "./frame";
import { WindowTypes } from "src/shared/types";

import { gandalfEmojiless } from "shared/mocks/mock-contacts";
import { gandalfCall } from "shared/mocks/mock-active-calls";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { StoreState } from "store/types";

const IncomingCallWindow = styled.div`
  width: 300px;
  height: 75px;
`;

export default {
  title: "Components/IncomingCallFrame",
  component: IncomingCallFrame,
  decorators: [
    (DecoratedStory): React.ReactElement<unknown> => (
      <IncomingCallWindow>
        <DecoratedStory />
      </IncomingCallWindow>
    ),
  ],
} as Meta;

const Template: Story = (args) => <IncomingCallFrame {...args} />;

const GandalfCallingReduxState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    contacts: [mutableCloneDeep(gandalfEmojiless)],
  },
  activeCallsReducer: {
    ...mockStoreState.activeCallsReducer,
    activeCalls: [gandalfCall],
  },
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
  },
  windowReducer: {
    type: WindowTypes.incomingCall,
    identifiers: {
      uid: "",
    },
    metadata: {
      remoteParty: gandalfEmojiless.phone[0].value,
    },
  },
};
export const GandalfCalling = Template.bind({});
GandalfCalling.decorators = [reduxStoreDecorator(GandalfCallingReduxState)];

const NonContactReduxState = {
  ...GandalfCallingReduxState,
  contactReducer: {
    ...GandalfCallingReduxState.contactReducer,
    contacts: [],
  },
};
export const NonContactCalling = Template.bind({});
NonContactCalling.decorators = [reduxStoreDecorator(NonContactReduxState)];
