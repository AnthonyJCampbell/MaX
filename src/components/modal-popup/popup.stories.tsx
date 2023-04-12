// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import Popup from "./popup";
import { reduxStoreDecorator } from "store/storybook-redux-store";
import { mockStoreState } from "shared/mocks/mock-states";
import { StoreState } from "store/types";
import { ModalPopupTypes } from "src/types";
import { peter } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { chatWithPeter } from "shared/mocks/mock-chats";

export default {
  title: "Components/ConfirmDeletePopup",
  component: Popup,
} as Meta;

const Template: Story = (args) => <Popup {...args} />;

const DeleteContactState: StoreState = {
  ...mockStoreState,
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    showModalPopup: ModalPopupTypes.deleteContact,
  },
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(peter),
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [mutableCloneDeep(chatWithPeter)],
  },
};
export const DeleteContact = Template.bind({});
DeleteContact.args = {};
DeleteContact.decorators = [reduxStoreDecorator(DeleteContactState)];

const peterNoIMNoPhone = { ...mutableCloneDeep(peter), im: undefined };
peterNoIMNoPhone.phone = [];

const chatWithPeterPhoneUid = mutableCloneDeep(chatWithPeter);
chatWithPeterPhoneUid.uid = peter.phone[0].value;

const DeleteNonIMContactWithoutPhoneState: StoreState = {
  ...mockStoreState,
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    showModalPopup: ModalPopupTypes.deleteContact,
  },
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: peterNoIMNoPhone,
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [mutableCloneDeep(chatWithPeter), chatWithPeterPhoneUid],
  },
};
export const DeleteNonIMContactWithoutPhone = Template.bind({});
DeleteNonIMContactWithoutPhone.args = {};
DeleteNonIMContactWithoutPhone.decorators = [
  reduxStoreDecorator(DeleteNonIMContactWithoutPhoneState),
];

const peterNoIM = { ...mutableCloneDeep(peter), im: undefined };

const DeleteNonIMContactWithPhoneState: StoreState = {
  ...mockStoreState,
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    showModalPopup: ModalPopupTypes.deleteContact,
  },
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: peterNoIM,
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [mutableCloneDeep(chatWithPeter), chatWithPeterPhoneUid],
  },
};
export const DeleteNonIMContactWithPhone = Template.bind({});
DeleteNonIMContactWithPhone.args = {};
DeleteNonIMContactWithPhone.decorators = [reduxStoreDecorator(DeleteNonIMContactWithPhoneState)];

const peterNoPhone = mutableCloneDeep(peter);
peterNoIMNoPhone.phone = [];

const DeleteContactWithoutPhoneState: StoreState = {
  ...mockStoreState,
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    showModalPopup: ModalPopupTypes.deleteContact,
  },
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: peterNoPhone,
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [mutableCloneDeep(chatWithPeter), chatWithPeterPhoneUid],
  },
};
export const DeleteContactWithoutPhone = Template.bind({});
DeleteContactWithoutPhone.args = {};
DeleteContactWithoutPhone.decorators = [reduxStoreDecorator(DeleteContactWithoutPhoneState)];

const bgPeter = mutableCloneDeep(peter);
bgPeter.types = {
  typeBGContact: true,
  typeGroupContact: false,
  typeIMContact: false,
  typePersonalContact: false,
};

const DeleteBGContactState: StoreState = {
  ...mockStoreState,
  paneManagementReducer: {
    ...mockStoreState.paneManagementReducer,
    showModalPopup: ModalPopupTypes.deleteContact,
  },
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: bgPeter,
  },
  messagingReducer: {
    ...mockStoreState.messagingReducer,
    chats: [mutableCloneDeep(chatWithPeter)],
  },
};
export const DeleteBGContact = Template.bind({});
DeleteBGContact.args = {};
DeleteBGContact.decorators = [reduxStoreDecorator(DeleteBGContactState)];
