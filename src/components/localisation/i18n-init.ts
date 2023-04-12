// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Internationalisation (i18n) configuration using i18next library.
 * This file contains the config for the React side of the app and exports the function to
 * initialise the i18next library.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import intervalPlural from "i18next-intervalplural-postprocessor";
import { commonOptions } from "shared/localisation/config/i18n-common-config";

const initI18n = async (initialLocale: string): Promise<void> => {
  if (!i18n.isInitialized) {
    const initOptions = {
      ...commonOptions,
      lng: initialLocale,
      react: {
        // Suspense is an experimental React feature, so we shouldn't use it for production code.
        useSuspense: false,
      },
    };
    await i18n.use(intervalPlural).use(initReactI18next).init(initOptions);
  }
};

export default initI18n;
