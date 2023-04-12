// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import DefaultHeaderPanel from "./panel";
import { StoreState } from "store/types";
import { PhoneNumberType } from "shared/types";

import {
  initialSelected,
  peter,
  gandalfEmojiless,
  bilbo,
  nonContact,
  longName,
} from "shared/mocks/mock-contacts";
import { protoUpliftGandalfCallToMeeting } from "shared/mocks/mock-meetings";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { Colors } from "components/utils/style-constants";
import { StorybookMinWidthWrapper } from "../shared-styles";

export default {
  title: "Components/DefaultHeaderPanel",
  component: DefaultHeaderPanel,
  parameters: {
    backgrounds: {
      default: "gray",
      values: [
        { name: "gray", value: Colors.midbar.background },
        { name: "white", value: Colors.backgroundColor },
        { name: "dark", value: Colors.textColor },
      ],
    },
  },
} as Meta;

const Template: Story = (args) => <DefaultHeaderPanel {...args} />;

const InitialSelectedReduxState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(initialSelected),
  },
  meetingReducer: {
    ...mockStoreState.meetingReducer,
    meetings: [],
  },
  settingsReducer: {
    settings: {
      ...mockStoreState.settingsReducer.settings,
      meetings: {
        enabled: true,
      },
    },
  },
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    disabledCallButton: "",
  },
};
export const InitialSelected = Template.bind({});
InitialSelected.decorators = [reduxStoreDecorator(InitialSelectedReduxState)];

const PeterReduxState: StoreState = {
  ...InitialSelectedReduxState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(peter),
  },
};
export const Peter = Template.bind({});
Peter.decorators = [reduxStoreDecorator(PeterReduxState)];

const GandalfReduxState: StoreState = {
  ...InitialSelectedReduxState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(gandalfEmojiless),
  },
  meetingReducer: {
    ...mockStoreState.meetingReducer,
    meetings: [mutableCloneDeep(protoUpliftGandalfCallToMeeting)],
  },
};
export const GandalfInCall = Template.bind({});
GandalfInCall.decorators = [reduxStoreDecorator(GandalfReduxState)];

const BilboReduxState: StoreState = {
  ...InitialSelectedReduxState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(bilbo),
  },
  settingsReducer: {
    settings: {
      ...mockStoreState.settingsReducer.settings,
      meetings: {
        enabled: false,
      },
    },
  },
};
export const BilboMeetingsDisabled = Template.bind({});
BilboMeetingsDisabled.decorators = [reduxStoreDecorator(BilboReduxState)];

export const NonContactCalling = Template.bind({});
NonContactCalling.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      contacts: [],
      selectedContact: mutableCloneDeep(nonContact),
    },
  }),
];

export const NonContactAmericanRegionPhone = Template.bind({});
NonContactAmericanRegionPhone.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      contacts: [],
      selectedContact: {
        ...mutableCloneDeep(nonContact),
        phone: [{ value: "4258828080", type: PhoneNumberType.OTHER_NUMBER }],
      },
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

export const NonContactBrazillianRegionPhone = Template.bind({});
NonContactBrazillianRegionPhone.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      contacts: [],
      selectedContact: {
        ...mutableCloneDeep(nonContact),
        phone: [{ value: "1943219876", type: PhoneNumberType.OTHER_NUMBER }],
      },
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

export const LongNameWithEllipsis = Template.bind({});
LongNameWithEllipsis.decorators = [
  (StoryComponent) => (
    <StorybookMinWidthWrapper>
      <StoryComponent />
    </StorybookMinWidthWrapper>
  ),
  reduxStoreDecorator({
    ...InitialSelectedReduxState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(longName),
    },
  }),
];
