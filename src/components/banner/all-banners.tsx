// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useSelector } from "react-redux";
import { BannerType } from "shared/types";
import { selectActiveBanner } from "store/selectors/paneManagement";

import DNDBanner from "./dnd-banner";
import DummyBanner from "./dummy-banner";
import JavaDownBanner from "./java-down-banner";
import NoChatOrCallsBanner from "./no-chat-or-calls-banner";
import NoChatBanner from "./no-chat-banner";
import NoCallsBanner from "./no-calls-banner";

/**
 * All the Banners we support right now.
 *
 * Just a single banner will be presented, based on its priority number.
 * The highest priority number is the active banner being presented.
 * Dismissed banners are removed from redux array.
 */
const AllBanners: React.FC = () => {
  const activeBanner: BannerType | undefined = useSelector(selectActiveBanner);

  switch (activeBanner) {
    case BannerType.JAVA_DOWN:
      return <JavaDownBanner />;
    case BannerType.NO_CHAT_OR_CALLS:
      return <NoChatOrCallsBanner />;
    case BannerType.NO_CHAT:
      return <NoChatBanner />;
    case BannerType.NO_CALLS:
      return <NoCallsBanner />;
    case BannerType.DND:
      return <DNDBanner />;
    case BannerType.Dummy:
      return <DummyBanner />;
    default:
      return null;
  }
};

export default AllBanners;
