// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import styled from "styled-components";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import InCallPopOut from "./in-call-pop-out";

import { gandalfEmojiless } from "shared/mocks/mock-contacts";
import { gandalfCall } from "shared/mocks/mock-active-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { mockStoreState } from "shared/mocks/mock-states";
import { loggedInUserMeeting } from "shared/mocks/mock-meetings";
import { StoreState } from "src/store/types";

import {
  NonContactCalling as NonContactCallingStory,
  NonContactAmericanRegionPhone as NonContactAmericanRegionPhoneStory,
  NonContactBrazillianRegionPhone as NonContactBrazillianRegionPhoneStory,
} from "./InCallHeaderPanel.stories";

const InCallWindow = styled.div`
  width: 460px;
  height: 80px;
`;

export default {
  title: "Components/InCallPopOut",
  component: InCallPopOut,
  decorators: [
    (DecoratedStory): React.ReactElement<unknown> => (
      <InCallWindow>
        <DecoratedStory />
      </InCallWindow>
    ),
  ],
} as Meta;

const Template: Story = (args) => <InCallPopOut {...args} />;

const GandalfInCallReduxState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(gandalfEmojiless),
  },
  meetingReducer: {
    ...mockStoreState.meetingReducer,
    meetings: [mutableCloneDeep(loggedInUserMeeting)],
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
    isMainWindowFocused: false,
  },
};
export const GandalfInCall = Template.bind({});
GandalfInCall.decorators = [reduxStoreDecorator(GandalfInCallReduxState)];

export const NonContactCalling = Template.bind({});
NonContactCalling.decorators = NonContactCallingStory.decorators;

export const NonContactAmericanRegionPhone = Template.bind({});
NonContactAmericanRegionPhone.decorators = NonContactAmericanRegionPhoneStory.decorators;

export const NonContactBrazillianRegionPhone = Template.bind({});
NonContactBrazillianRegionPhone.decorators = NonContactBrazillianRegionPhoneStory.decorators;
