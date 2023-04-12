// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Presence Menu component.
 */

import React from "react";
import styled from "styled-components";
import { Story, Meta } from "@storybook/react";
import { CallManagerType, PresenceState } from "shared/types";
import { reduxStoreDecorator } from "store/storybook-redux-store";
import { StoreState } from "store/types";
import { mockStoreState } from "shared/mocks/mock-states";
import { bilboCall } from "shared/mocks/mock-active-calls";

import PresenceMenu, { Props } from "./presence-menu";

const Wrapper = styled.div`
  margin-left: 10px;
`;

export default {
  title: "Components/PresenceMenu",
  component: PresenceMenu,
  decorators: [
    (StoryComponent) => (
      <Wrapper>
        <StoryComponent />
      </Wrapper>
    ),
  ],
} as Meta;

const Template: Story<Props> = (args) => <PresenceMenu {...args} />;

const MockStoreState = (callManagerType: CallManagerType, inACall: boolean): StoreState => {
  return {
    ...mockStoreState,
    settingsReducer: {
      settings: {
        ...mockStoreState.settingsReducer.settings,
        call: {
          ...mockStoreState.settingsReducer.settings.call,
          callManagerType,
        },
      },
    },
    activeCallsReducer: {
      ...mockStoreState.activeCallsReducer,
      activeCalls: inACall ? [bilboCall] : [],
    },
  };
};
const otherArgs = {
  onSelectPresence: (_presence: PresenceState) => {},
  onClosePresenceMenu: () => {},
  onCloseAvatarMenu: () => {},
  onOpenCallManager: () => {},
};

export const BCMPresenceMenuInAMeeting = Template.bind({});
BCMPresenceMenuInAMeeting.args = {
  presenceState: PresenceState.IN_A_MEETING,
  ...otherArgs,
};

BCMPresenceMenuInAMeeting.decorators = [
  reduxStoreDecorator(MockStoreState(CallManagerType.BCM, false)),
];

export const ECMPresenceMenuInACall = Template.bind({});
ECMPresenceMenuInACall.args = {
  presenceState: PresenceState.ONLINE,
  ...otherArgs,
};

ECMPresenceMenuInACall.decorators = [
  reduxStoreDecorator(MockStoreState(CallManagerType.ECM, true)),
];

export const ICMPresenceMenu = Template.bind({});
ICMPresenceMenu.args = {
  presenceState: PresenceState.ONLINE,
  ...otherArgs,
};

ICMPresenceMenu.decorators = [reduxStoreDecorator(MockStoreState(CallManagerType.ICM, false))];

export const NoCMPresenceMenu = Template.bind({});
NoCMPresenceMenu.args = {
  presenceState: PresenceState.ONLINE,
  ...otherArgs,
};

NoCMPresenceMenu.decorators = [reduxStoreDecorator(MockStoreState(CallManagerType.NONE, false))];
