// Copyright 2021 Metaswitch Networks - Highly Confidential Material
module.exports = {
  verbose: true,
  testEnvironment: "node",
  moduleNameMapper: {
    i18next: "test/__mocks__/i18next.js",
  },
  preset: "ts-jest/presets/js-with-ts",
};
