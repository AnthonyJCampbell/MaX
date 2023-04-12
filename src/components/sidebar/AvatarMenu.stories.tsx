// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";
import { StoreState } from "store/types";
import { KeyboardNavTools } from "src/types";

import AvatarMenu from "./avatar-menu";

import { mockStoreState } from "shared/mocks/mock-states";
import { bilbo } from "shared/mocks/mock-contacts";

export default {
  title: "Components/AvatarMenu",
  component: AvatarMenu,
} as Meta;

/**
 * TODO: Move this to inside `avatar-menu.js` when it is converted into TSX
 */
interface AvatarMenuProps {
  keyboardNavTools?: KeyboardNavTools;
}

const Template: Story<AvatarMenuProps> = (args) => {
  const [visible, setVisible] = useState<boolean>(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const keyboardNavTools = {
    visible,
    setVisible,
    buttonRef,
  };

  return <AvatarMenu {...args} keyboardNavTools={keyboardNavTools} />;
};

const BilboStoreState: StoreState = {
  ...mockStoreState,
  settingsReducer: {
    settings: {
      ...mockStoreState.settingsReducer.settings,
      general: {
        ...mockStoreState.settingsReducer.settings.general,
        accountNumber: bilbo.phone[0].value,
        displayName: `${bilbo.identity?.firstName} ${bilbo.identity?.lastName}`,
      },
    },
  },
};

export const Bilbo = Template.bind({});
Bilbo.args = {};
Bilbo.decorators = [reduxStoreDecorator(BilboStoreState)];

const NoNameState: StoreState = {
  ...mockStoreState,
};

export const AmericanRegionPhoneFormatted = Template.bind({});
AmericanRegionPhoneFormatted.args = {};
AmericanRegionPhoneFormatted.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    settingsReducer: {
      settings: {
        ...mockStoreState.settingsReducer.settings,
        general: {
          ...mockStoreState.settingsReducer.settings.general,
          accountNumber: "4258828080",
          displayName: `American Phone Number`,
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
    settingsReducer: {
      settings: {
        ...mockStoreState.settingsReducer.settings,
        general: {
          ...mockStoreState.settingsReducer.settings.general,
          accountNumber: "1943219876",
          displayName: `Brazillian Phone Number`,
          easRegion: "BR",
        },
      },
    },
  }),
];

/**
 * This is a current bug scenario we have.
 * Maybe, one day, this scenario will be fixed,
 * and this story will make any sense
 */
export const NoName = Template.bind({});
NoName.args = {};
NoName.decorators = [reduxStoreDecorator(NoNameState)];
