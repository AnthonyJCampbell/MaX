// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Internationalisation (i18n) configuration using i18next library.
 * This file contains helper methods.
 * It is split out from i18n-react-init.ts because that file can't contain
 * window.require statements - it is used early on in storybook setup,
 * before window.require is mocked.
 */

import i18n from "i18next";

import { constructLocale } from "shared/localisation/config/i18n-common-config";
import { initDateTimeFormat } from "../utils/date-time";
import log from "src/renderer-logging";

const { app } = window.require("@electron/remote");
const defaultLocale = "en-US";

export const changeLanguage = (newLanguage: string): void => {
  if (!newLanguage) {
    return;
  }

  if (!i18n.isInitialized) {
    log.warn(`Tried to change language to ${newLanguage} before i18next initialized`);
    return;
  }

  if (newLanguage !== i18n.language) {
    log.info(`Switching language from ${i18n.language} to ${newLanguage}`);
    i18n
      .changeLanguage(newLanguage)
      .then(() => initDateTimeFormat())
      .catch((reason) =>
        log.error(`Failed to switch language to ${newLanguage}, reason: ${reason}`)
      );
  }
};

export const getInitialLocale = (): string => {
  if (window.process.env.FVFramework) {
    return defaultLocale;
  }

  const appLocale = app.getLocale();
  const regionCode = app.getLocaleCountryCode();
  const locale = constructLocale(appLocale, regionCode);
  log.info(
    `Got initial locale from Electron.
    Constructed locale ${locale} from app locale ${appLocale} and region ${regionCode}`
  );
  return locale;
};
