// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import { reduxStoreDecorator } from "store/storybook-redux-store";
import { mockStoreState } from "shared/mocks/mock-states";
import { gandalf } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { PhoneNumber, PhoneNumberType } from "src/types";

import CallMenu from "./call-menu";

export default {
  title: "Components/CallMenu",
  component: CallMenu,
} as Meta;

/**
 * TODO: Move this to inside `call-menu.js` when it is converted into TSX
 */
interface CallMenuProps {
  phoneNumbers: PhoneNumber[];
}

const Template: Story<CallMenuProps> = (args) => {
  const [visible, setVisible] = useState<boolean>(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const keyboardNavTools = {
    visible,
    setVisible,
    buttonRef,
  };

  return <CallMenu {...args} keyboardNavTools={keyboardNavTools} />;
};

export const WithMultiplePhones = Template.bind({});
WithMultiplePhones.args = {
  phoneNumbers: mutableCloneDeep(gandalf).phone,
};
WithMultiplePhones.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
  }),
];

export const WrongRegionPhoneFormatted = Template.bind({});
WrongRegionPhoneFormatted.args = {
  phoneNumbers: mutableCloneDeep(gandalf).phone,
};
WrongRegionPhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
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

export const AmericanRegionMultiplePhoneFormatted = Template.bind({});
AmericanRegionMultiplePhoneFormatted.args = {
  phoneNumbers: [
    { value: "4258828080 ext 123", type: PhoneNumberType.WORK_NUMBER },
    { value: "5559496375", type: PhoneNumberType.MOBILE_NUMBER },
    { value: "+442083627097x123", type: PhoneNumberType.WORK_NUMBER },
    { value: "+5545987654321", type: PhoneNumberType.MOBILE_NUMBER },
  ],
};
AmericanRegionMultiplePhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
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

export const BrazillianRegionMultiplePhoneFormatted = Template.bind({});
BrazillianRegionMultiplePhoneFormatted.args = {
  phoneNumbers: [
    { value: "1943219876x123", type: PhoneNumberType.WORK_NUMBER },
    { value: "45987654321", type: PhoneNumberType.MOBILE_NUMBER },
    { value: "+442083627097x123", type: PhoneNumberType.WORK_NUMBER },
  ],
};
BrazillianRegionMultiplePhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
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
