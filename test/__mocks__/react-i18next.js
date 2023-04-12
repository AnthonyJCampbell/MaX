// Copyright 2021 Metaswitch Networks - Highly Confidential Material
const { mockedT } = require("shared/mocks/ts-utils");
const reactI18next = jest.genMockFromModule("react-i18next");

reactI18next.useTranslation = () => ({
  t: mockedT,
});

module.exports = reactI18next;
