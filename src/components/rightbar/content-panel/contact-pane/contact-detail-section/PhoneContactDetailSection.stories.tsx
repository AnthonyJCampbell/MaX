// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import { reduxStoreDecorator } from "store/storybook-redux-store";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { bilbo, gandalfEmojiless } from "shared/mocks/mock-contacts";

import PhoneContactDetailSection from "./phone-section";
import { StoreState } from "store/types";
import { PhoneNumberType } from "shared/types";

export default {
  title: "Components/PhoneContactDetailSection",
  component: PhoneContactDetailSection,
} as Meta;

const Template: Story = (args) => <PhoneContactDetailSection {...args} />;

export const ContactWithSinglePhone = Template.bind({});
ContactWithSinglePhone.args = {};
ContactWithSinglePhone.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: mutableCloneDeep(bilbo),
    },
  }),
];

const MultiplePhonesState: StoreState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    selectedContact: mutableCloneDeep(gandalfEmojiless),
  },
};

export const ContactWithMultiplePhones = Template.bind({});
ContactWithMultiplePhones.args = {};
ContactWithMultiplePhones.decorators = [reduxStoreDecorator(MultiplePhonesState)];

export const WrongRegionFormmatedNumber = Template.bind({});
WrongRegionFormmatedNumber.args = {};
WrongRegionFormmatedNumber.decorators = [
  reduxStoreDecorator({
    ...MultiplePhonesState,
    settingsReducer: {
      settings: {
        ...mockStoreState.settingsReducer.settings,
        general: {
          ...mockStoreState.settingsReducer.settings.general,
          easRegion: "AU",
        },
      },
    },
  }),
];

export const AmericanRegionPhoneFormatted = Template.bind({});
AmericanRegionPhoneFormatted.args = {};
AmericanRegionPhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: {
        ...mutableCloneDeep(bilbo),
        phone: [
          { value: "4258828080 ext 123", type: PhoneNumberType.WORK_NUMBER },
          { value: "5559496375", type: PhoneNumberType.MOBILE_NUMBER },
          { value: "+442083627097x123", type: PhoneNumberType.WORK_NUMBER },
          { value: "+5545987654321", type: PhoneNumberType.MOBILE_NUMBER },
        ],
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

export const BrazillianRegionPhoneFormatted = Template.bind({});
BrazillianRegionPhoneFormatted.args = {};
BrazillianRegionPhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    contactReducer: {
      ...mockStoreState.contactReducer,
      selectedContact: {
        ...mutableCloneDeep(bilbo),
        phone: [
          { value: "1943219876x123", type: PhoneNumberType.WORK_NUMBER },
          { value: "45987654321", type: PhoneNumberType.MOBILE_NUMBER },
          { value: "+442083627097x123", type: PhoneNumberType.WORK_NUMBER },
        ],
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
