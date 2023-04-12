// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import Avatar, { AvatarProps } from "./avatar";

import { Contact, PresenceState } from "src/types";

import { gandalfEmojiless } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

export default {
  title: "Components/Avatar",
  component: Avatar,
} as Meta;

const Template: Story<AvatarProps> = (args) => <Avatar {...args} />;

export const Contactless = Template.bind({});
Contactless.args = {
  contact: undefined,
  showPresence: true,
};

const contactWithoutProfilePicture: Contact = {
  phone: [],
  postal: [],
  email: [],
  uid: "",
  identity: {
    firstName: "John",
    lastName: "Doe",
    nickname: "",
    jobTitle: "",
    organisation: "",
  },
  types: {
    typeGroupContact: false,
    typeIMContact: true,
    typeBGContact: true,
    typePersonalContact: true,
  },
  im: { value: "123@wizard.com" },
  presence: { state: PresenceState.ONLINE, customStatus: "" },
  isFavourite: false,
  notifyWhenAvailable: true,
  isTyping: false,
};

export const AvatarWithInitials = Template.bind({});
AvatarWithInitials.args = {
  contact: contactWithoutProfilePicture,
  showPresence: true,
};

const gandalf = (presenceState: PresenceState): Contact => ({
  ...mutableCloneDeep(gandalfEmojiless),
  presence: { state: presenceState, customStatus: "" },
});

export const GandalfOnline = Template.bind({});
GandalfOnline.args = {
  contact: gandalf(PresenceState.ONLINE),
  showPresence: true,
};

export const GandalfBusy = Template.bind({});
GandalfBusy.args = {
  contact: gandalf(PresenceState.BUSY),
  showPresence: true,
};

export const GandalfDoNotDisturb = Template.bind({});
GandalfDoNotDisturb.args = {
  contact: gandalf(PresenceState.DO_NOT_DISTURB),
  showPresence: true,
};

export const GandalfInCall = Template.bind({});
GandalfInCall.args = {
  contact: gandalf(PresenceState.IN_A_CALL),
  showPresence: true,
};

export const GandalfInMeeting = Template.bind({});
GandalfInMeeting.args = {
  contact: gandalf(PresenceState.IN_A_MEETING),
  showPresence: true,
};

export const GandalfNotAuthorised = Template.bind({});
GandalfNotAuthorised.args = {
  contact: gandalf(PresenceState.NOT_AUTHORISED),
  showPresence: true,
};

export const GandalfOffline = Template.bind({});
GandalfOffline.args = {
  contact: gandalf(PresenceState.OFFLINE),
  showPresence: true,
};

export const GandalfAway = Template.bind({});
GandalfAway.args = {
  contact: gandalf(PresenceState.AWAY),
  showPresence: true,
};

export const GandalfUnkown = Template.bind({});
GandalfUnkown.args = {
  contact: gandalf(PresenceState.UNKNOWN),
  showPresence: true,
};

export const GandalfUnrecognized = Template.bind({});
GandalfUnrecognized.args = {
  contact: gandalf(PresenceState.UNRECOGNIZED),
  showPresence: true,
};

export const GandalfWaitingForAuthorisation = Template.bind({});
GandalfWaitingForAuthorisation.args = {
  contact: gandalf(PresenceState.WAITING_FOR_AUTHORISATION),
  showPresence: true,
};
