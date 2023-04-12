// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Internationalisation (i18n) configuration using i18next library.
 * This file contains the config for the Node side of the app and exports functions
 * to interact with the i18next library.
 */

import i18n from "i18next";
import intervalPlural from "i18next-intervalplural-postprocessor";

import { app } from "../electron-wrapper";
import { initMacMenu } from "../pane-control/mac-app-menu";
import {
  commonOptions,
  constructLocale,
} from "../../src/shared/localisation/config/i18n-common-config";
import log from "../main-logging";

const defaultLocale = "en-US";

export const initI18n = async (): Promise<void> => {
  if (!i18n.isInitialized) {
    const initOptions = {
      ...commonOptions,
      lng: getInitialLocale(),
    };
    await i18n.use(intervalPlural).init(initOptions);
  }
};

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
      .then(() => {
        if (process.platform === "darwin") {
          initMacMenu();
        }
      })
      .catch((reason) =>
        log.error(`Failed to switch language to ${newLanguage}, reason: ${reason}`)
      );
  }
};

export const getInitialLocale = (): string => {
  if (process.env.FVFramework) {
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
