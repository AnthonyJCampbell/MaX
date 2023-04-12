// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";

import Banner, { BannerProps } from "./index";

import { primaryColour } from "components/utils/style-constants";

export default {
  title: "Reusable Components/Banner",
  component: Banner,
} as Meta;

const Template: Story<BannerProps> = (args) => <Banner {...args} />;

export const PlainTextBanner = Template.bind({});
PlainTextBanner.args = {
  onDismiss: () => {},
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export const MultipleLinesWrapText = Template.bind({});
MultipleLinesWrapText.args = {
  onDismiss: () => {},
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non euismod nisi, quis luctus urna. Fusce nec consectetur ante, quis tincidunt felis. Sed eu eros felis. Pellentesque quis est pharetra, consequat mi nec, dapibus sapien. In malesuada aliquam elit, vitae maximus justo gravida ac. Vivamus ut auctor elit, in egestas quam. Fusce consectetur nisi dignissim, pellentesque nulla quis, faucibus odio.",
};

export const NoDismissButton = Template.bind({});
NoDismissButton.args = {
  ...MultipleLinesWrapText.args,
  onDismiss: undefined,
};

export const BlueBackground = Template.bind({});
BlueBackground.args = {
  ...PlainTextBanner.args,
  bgColor: primaryColour,
  fontColor: "#FFF",
  dimissHoverBackground: "rgba(0, 0, 0, 0.2)",
};

const BannerContent: React.FC = () => (
  <>
    Lorem ipsum dolor sit amet
    <br />
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      click me
    </a>
    <br />
    consectetur adipiscing elit.
  </>
);

export const ContentAsReactComponent = Template.bind({});
ContentAsReactComponent.args = {
  onDismiss: () => {},
  content: <BannerContent />,
};
