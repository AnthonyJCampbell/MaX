// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import Banner from "components/ui/Banner";

// A banner which lets the user know that they won't be able
// to use call functionality.
const NoCallsBanner: React.FC = () => {
  const { t } = useTranslation();

  return <Banner content={t("noCallsBanner")} />;
};

export default NoCallsBanner;
