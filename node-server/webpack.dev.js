// Copyright 2021 Metaswitch Networks - Highly Confidential Material

// Used when running npm start
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  // Choose devtools with a good balance of debug information and build speed.
  // For more details: // https://webpack.js.org/configuration/devtool/
  devtool: "cheap-module-eval-source-map",
});
