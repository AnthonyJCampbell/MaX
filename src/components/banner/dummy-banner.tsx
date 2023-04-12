// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable i18next/no-literal-string */
import React from "react";

import { useDispatch } from "react-redux";
import { BannerType } from "shared/types";
import log from "src/renderer-logging";
import { removeBanner } from "action-creators/navigation/actions";

import Banner from "components/ui/Banner";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non euismod nisi, quis luctus urna. Fusce nec consectetur ante, quis tincidunt felis. Sed eu eros felis. Pellentesque quis est pharetra, consequat mi nec, dapibus sapien. In malesuada aliquam elit, vitae maximus justo gravida ac. Vivamus ut auctor elit, in egestas quam. Fusce consectetur nisi dignissim, pellentesque nulla quis, faucibus odio.";

const DummyBanner: React.FC = () => {
  const dispatch = useDispatch();

  const dismissClickHandler = (): void => {
    log.userAction(`Dismissed the Dummy Banner`);
    dispatch(removeBanner(BannerType.Dummy));
  };

  return <Banner content={loremIpsum} onDismiss={dismissClickHandler} bgColor="orange" />;
};

export default DummyBanner;
