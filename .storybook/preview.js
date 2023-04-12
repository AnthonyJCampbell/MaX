// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import i18n from "i18next";
import { I18nextProvider } from "react-i18next";

import GlobalCSS from "components/utils/global-styles";
import initI18n from "components/localisation/i18n-init";

import windowRequireMock from "./mocks/electron";

Object.defineProperty(window, "require", {
  writable: true,
  value: windowRequireMock,
});

window.process = {
  platform: "win32",
  env: {
    FVFramework: false,
    FVLogOnRender: false,
  },
};

initI18n("en-US");

export const decorators = [
  (Story) => (
    <I18nextProvider i18n={i18n}>
      <GlobalCSS />
      <Story />
    </I18nextProvider>
  ),
];

export const parameters = {
  options: {
    storySort: {
      method: "alphabetical",
    },
  },
  // TODO ENO - Add actions tab properly sometime
  // actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
