// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import AddMenu from "./add-menu";
import { reduxStoreDecorator } from "store/storybook-redux-store";
import { KeyboardNavTools } from "src/types";
import { StoreState } from "store/types";
import { mockStoreState } from "shared/mocks/mock-states";

/**
 * TODO: Move this to inside `add-menu.js` when it is converted into TSX
 */
interface AddMenuProps {
  keyboardNavTools?: KeyboardNavTools;
}

export default {
  title: "Components/AddMenu",
  component: AddMenu,
} as Meta;

const Template: Story<AddMenuProps> = (args) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const keyboardNavTools = {
    visible,
    setVisible,
    buttonRef,
  };

  return <AddMenu {...args} keyboardNavTools={keyboardNavTools} />;
};

export const DefaultAddMenu = Template.bind({});
DefaultAddMenu.args = {};
DefaultAddMenu.decorators = [reduxStoreDecorator(mockStoreState)];

const AddMenuWithMeetingsState: StoreState = {
  ...mockStoreState,
  meetingReducer: {
    ...mockStoreState.meetingReducer,
    meetings: [
      {
        uid: "meeting-test-id",
        remoteParty: [{ value: "0123456789@im.address.com" }],
      },
    ],
  },
};

export const AddMenuWithMeetings = Template.bind({});
AddMenuWithMeetings.args = {};
AddMenuWithMeetings.decorators = [reduxStoreDecorator(AddMenuWithMeetingsState)];
