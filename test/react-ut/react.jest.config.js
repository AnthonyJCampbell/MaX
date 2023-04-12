// Copyright 2021 Metaswitch Networks - Highly Confidential Material
module.exports = {
  verbose: true,
  moduleNameMapper: {
    "(.*)\\.(png|svg|ico)": "test/__mocks__/$1.js",
    "(.*)\\.(mp3)": "test/__mocks__/audio-mock.js",
    "\\.(css|less)$": "test/__mocks__/style-mock.js",
    "^i18next": "test/__mocks__/i18next.js",
    "react-i18next": "test/__mocks__/react-i18next.js",
  },
  preset: "ts-jest/presets/js-with-ts",
};
