// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { Story, Meta } from "@storybook/react";
import { reduxStoreDecorator } from "store/storybook-redux-store";

import AllBanners from "./all-banners";
import { mockStoreState } from "shared/mocks/mock-states";
import { BannerType } from "shared/types";

export default {
  title: "Components/Banner/AllBanners",
  component: AllBanners,
} as Meta;

const Template: Story = (args) => <AllBanners {...args} />;

export const SingleBanner = Template.bind({});
SingleBanner.args = {};
SingleBanner.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      banners: [BannerType.DND],
    },
  }),
];

export const MultipleBanners = Template.bind({});
MultipleBanners.args = {};
MultipleBanners.decorators = [
  reduxStoreDecorator({
    ...mockStoreState,
    paneManagementReducer: {
      ...mockStoreState.paneManagementReducer,
      banners: [BannerType.Dummy],
    },
  }),
];
