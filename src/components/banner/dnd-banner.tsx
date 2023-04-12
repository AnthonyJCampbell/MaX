// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import { useDispatch } from "react-redux";
import { BannerType } from "shared/types";
import log from "src/renderer-logging";
import { removeBanner } from "action-creators/navigation/actions";

import Banner from "components/ui/Banner";

// A banner which lets the user know that they're in DND mode, and the consequences
// this will have related to call functionality
const DNDBanner: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dismissClickHandler = (): void => {
    log.userAction(`Dismissed the DND Banner`);
    dispatch(removeBanner(BannerType.DND));
  };

  return <Banner content={t("dNDBanner")} onDismiss={dismissClickHandler} />;
};

export default DNDBanner;
