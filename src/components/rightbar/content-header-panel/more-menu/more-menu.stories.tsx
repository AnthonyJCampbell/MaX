// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { emptyReduxStoreDecorator } from "store/storybook-redux-store";

import MoreMenu from "./more-menu";
import { Contact, KeyboardNavTools } from "src/types";

import { gandalfEmojiless, initialSelected } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

/**
 * TODO: Move this to inside `more-menu.js` when it is converted into TSX
 */
interface MoreMenuProps {
  contact: Contact;
  keyboardNavTools?: KeyboardNavTools;
  inCall: boolean;
}

export default {
  title: "Components/MoreMenu",
  component: MoreMenu,
  decorators: [emptyReduxStoreDecorator],
} as Meta;

const Template: Story<MoreMenuProps> = (args) => {
  const [visible, setVisible] = useState<boolean>(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const keyboardNavTools = {
    visible,
    setVisible,
    buttonRef,
  };

  return <MoreMenu {...args} keyboardNavTools={keyboardNavTools} />;
};

export const InitialSelected = Template.bind({});
InitialSelected.args = {
  contact: mutableCloneDeep(initialSelected),
  inCall: false,
};

export const GandalfMoreMenu = Template.bind({});
GandalfMoreMenu.args = {
  contact: mutableCloneDeep(gandalfEmojiless),
  inCall: false,
};

export const InCall = Template.bind({});
InCall.args = {
  ...GandalfMoreMenu.args,
  inCall: true,
};
