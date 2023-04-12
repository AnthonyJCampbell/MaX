// Copyright 2021 Metaswitch Networks - Highly Confidential Material

/**
 * Unfortuanlly, Jest does not support the "TextEncoder" natively, as it
 * is using the jsdom to compile itself. This code adds a "hack" to allow
 * the code to work inside jest, while it work as well at storybook level
 */
const getTextEncoder = () => {
  try {
    const result = new TextEncoder();
    return result;
    // eslint-disable-next-line
  } catch (err) {}

  // eslint-disable-next-line
  const util = require("util");
  return new util.TextEncoder();
};

// eslint-disable-next-line no-undef
module.exports = getTextEncoder;
