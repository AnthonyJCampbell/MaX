// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import Banner from "components/ui/Banner";

// A banner which lets the user know that things might not be functioning
// normally (displayed when we can't talk to the Java part of the app)
const JavaDownBanner: React.FC = () => {
  const { t } = useTranslation();

  return <Banner content={t("javaDownBanner")} />;
};

export default JavaDownBanner;
