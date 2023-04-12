// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import MainWindow from "./main-window";

import { InitialReduxState } from "shared/redux-dumps/main-window-initial-state";
import { ContactDetailsReduxState } from "shared/redux-dumps/main-window-contact-details";
import { NonContactCallDetailsReduxState } from "shared/redux-dumps/main-window-call-from-a-non-contact";
import { PresenceState } from "protobuf-wispa/dist/presence";
import { BannerType } from "shared/types";
import { StoreState } from "store/types";
import { TabName } from "components/rightbar/rightbar";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { peter, longName } from "shared/mocks/mock-contacts";
import { chatWithPeter } from "shared/mocks/mock-chats";
import { Colors } from "components/utils/style-constants";

import { StorybookMinWidthWrapper } from "./styles";

export default {
  title: "Screens/MainWindow",
  component: MainWindow,
  parameters: {
    layout: "fullscreen",
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

const Template: Story = (args) => <MainWindow {...args} />;

export const InitialState = Template.bind({});
InitialState.decorators = [reduxStoreDecorator(InitialReduxState)];

export const ContactDetails = Template.bind({});
ContactDetails.decorators = [reduxStoreDecorator(ContactDetailsReduxState)];

export const LongNameWithEllipsis = Template.bind({});
LongNameWithEllipsis.decorators = [
  (StoryComponent) => (
    <StorybookMinWidthWrapper>
      <StoryComponent />
    </StorybookMinWidthWrapper>
  ),
  reduxStoreDecorator({
    ...ContactDetailsReduxState,
    contactReducer: {
      ...ContactDetailsReduxState.contactReducer,
      selectedContact: mutableCloneDeep(longName),
    },
  }),
];

export const NonContactCallDetails = Template.bind({});
NonContactCallDetails.decorators = [reduxStoreDecorator(NonContactCallDetailsReduxState)];

const ChatPaneState: StoreState = {
  ...InitialReduxState,
  contactReducer: {
    ...InitialReduxState.contactReducer,
    selectedContact: mutableCloneDeep(peter),
  },
  paneManagementReducer: {
    ...InitialReduxState.paneManagementReducer,
    activeRightPane: TabName.CHAT,
  },
  messagingReducer: {
    ...InitialReduxState.messagingReducer,
    chats: [mutableCloneDeep(chatWithPeter)],
  },
};

export const ChatPane = Template.bind({});
ChatPane.decorators = [reduxStoreDecorator(ChatPaneState)];

export const ChatPaneMinWidth = Template.bind({});
ChatPaneMinWidth.decorators = [
  (StoryComponent) => (
    <StorybookMinWidthWrapper>
      <StoryComponent />
    </StorybookMinWidthWrapper>
  ),
  reduxStoreDecorator(ChatPaneState),
];

export const WithDummyBanner = Template.bind({});
WithDummyBanner.decorators = [
  reduxStoreDecorator({
    ...ChatPaneState,
    paneManagementReducer: {
      ...ChatPaneState.paneManagementReducer,
      banners: [BannerType.Dummy],
    },
  }),
];

export const DoNotDisturbWithBanner = Template.bind({});
DoNotDisturbWithBanner.decorators = [
  reduxStoreDecorator({
    ...ChatPaneState,
    userReducer: {
      ...ChatPaneState.userReducer,
      user: {
        ...ChatPaneState.userReducer.user,
        presence: {
          ...ChatPaneState.userReducer.user.presence,
          state: PresenceState.DO_NOT_DISTURB,
        },
      },
    },
    paneManagementReducer: {
      ...ChatPaneState.paneManagementReducer,
      banners: [BannerType.DND],
    },
  }),
];

export const DoNotDisturbWithBannerDismissed = Template.bind({});
DoNotDisturbWithBannerDismissed.decorators = [
  reduxStoreDecorator({
    ...ChatPaneState,
    userReducer: {
      ...ChatPaneState.userReducer,
      user: {
        ...ChatPaneState.userReducer.user,
        presence: {
          ...ChatPaneState.userReducer.user.presence,
          state: PresenceState.DO_NOT_DISTURB,
        },
      },
    },
    paneManagementReducer: {
      ...ChatPaneState.paneManagementReducer,
      banners: [],
    },
  }),
];
