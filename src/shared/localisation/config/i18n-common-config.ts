// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Internationalisation (i18n) configuration using i18next library.
 * This file contains the common config between the React and the Node sides of the app.
 */

import { InitOptions } from "i18next";

import enUS from "../languages/en-US";
import test from "../languages/test";

export const commonOptions: InitOptions = {
  fallbackLng: "en-US",
  resources: {
    //"bg-BG": bgBG,
    //"de": deDE,
    //"el-CY": elCY,
    // Windows client reports el-GR when OS uses el-CY
    // We don't support el-GR, so map it to el-CY translations
    //"el-GR": elCY,
    //"en-GB": enGB,
    "en-US": enUS,
    //"es": es,
    //"fr-CA": frCA,
    //"fr-FR": frFR,
    //"hr-HR": hrHR,
    //"id-ID": idID,
    //"in-ID": idID,
    //"it-IT": itIT,
    //"pl-PL": plPL,
    //"pt-AO": ptAO,
    //"pt-BR": ptBR,
    //"sl-SI": slSI,
    //"th-TH": thTH,
    //"zh-TW": zhTW,
    test: test,
  },

  // For now, we only use one namespace, but we can separate this into different namespaces
  // in the future.
  ns: ["common"],
  defaultNS: "common",
};

export const constructLocale = (appLocale: string, appRegionCode: string): string => {
  let locale = appLocale;
  if (locale && !locale.includes("-") && appRegionCode) {
    locale = locale + "-" + appRegionCode;
  }
  return locale;
};
