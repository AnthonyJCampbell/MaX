// Copyright 2021 Metaswitch Networks - Highly Confidential Material

// Used for built clients
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
});
