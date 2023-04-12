// Copyright 2021 Metaswitch Networks - Highly Confidential Material
const { mockedT } = require("shared/mocks/ts-utils");
const i18next = jest.genMockFromModule("i18next");

i18next.t = mockedT;
i18next.isInitialized = true;
i18next.init = jest.fn();
i18next.use = jest.fn();
i18next.languages = ["en-US"];
i18next.hasResourceBundle = jest.fn(() => true);

module.exports = i18next;
